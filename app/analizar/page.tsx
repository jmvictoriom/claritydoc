"use client";

import { useState, useRef, useCallback } from "react";
import type {
  ContractAnalysis,
  ContractType,
  PageState,
} from "@/types/analysis";
import { CONTRACT_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExecutiveSummary } from "@/components/results/executive-summary";
import { ClauseList } from "@/components/results/clause-list";
import { MissingClauses } from "@/components/results/missing-clauses";

const LOADING_MESSAGES = [
  "Extrayendo texto del documento...",
  "Identificando clausulas del contrato...",
  "Analizando cada clausula segun la legislacion vigente...",
  "Detectando clausulas ausentes...",
  "Generando informe de riesgos...",
];

export default function AnalizarPage() {
  const [state, setState] = useState<PageState>({ step: "upload" });
  const [contractType, setContractType] =
    useState<ContractType>("alquiler_vivienda");
  const [inputMode, setInputMode] = useState<"pdf" | "text">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [disclaimer, setDisclaimer] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = useCallback(async () => {
    const controller = new AbortController();
    setState({ step: "loading", abortController: controller });
    setLoadingMsg(0);

    // Animate loading messages
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex++;
      if (msgIndex < LOADING_MESSAGES.length) {
        setLoadingMsg(msgIndex);
      }
    }, 4000);

    try {
      const formData = new FormData();
      formData.append("contractType", contractType);

      if (inputMode === "pdf" && file) {
        formData.append("file", file);
      } else if (inputMode === "text" && text.trim()) {
        formData.append("text", text);
      }

      const res = await fetch("/api/analizar", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const json = await res.json();

      if (json.success) {
        setState({ step: "results", analysis: json.data as ContractAnalysis });
      } else {
        setState({ step: "error", error: json.error });
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setState({ step: "upload" });
      } else {
        setState({
          step: "error",
          error: {
            code: "NETWORK_ERROR",
            message:
              "Error de conexion. Comprueba tu conexion a internet e intentalo de nuevo.",
          },
        });
      }
    } finally {
      clearInterval(interval);
    }
  }, [contractType, file, inputMode, text]);

  const canSubmit =
    disclaimer &&
    ((inputMode === "pdf" && file) ||
      (inputMode === "text" && text.trim().length >= 200));

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf" && dropped.size <= MAX_FILE_SIZE) {
      setFile(dropped);
    }
  }, []);

  const reset = useCallback(() => {
    setState({ step: "upload" });
    setFile(null);
    setText("");
    setDisclaimer(false);
  }, []);

  // Upload State
  if (state.step === "upload" || state.step === "error") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Analiza tu contrato</h1>
        <p className="text-muted-foreground mb-8">
          Sube tu contrato en PDF o pega el texto para recibir un analisis
          detallado con semaforo de riesgos.
        </p>

        {state.step === "error" && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {state.error.message}
          </div>
        )}

        {/* Contract type */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Tipo de contrato
          </label>
          <select
            value={contractType}
            onChange={(e) =>
              setContractType(e.target.value as ContractType)
            }
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {CONTRACT_TYPES.map((ct) => (
              <option key={ct.value} value={ct.value}>
                {ct.label}
              </option>
            ))}
          </select>
        </div>

        {/* Input mode tabs */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setInputMode("pdf")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMode === "pdf"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Subir PDF
            </button>
            <button
              onClick={() => setInputMode("text")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMode === "text"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Pegar texto
            </button>
          </div>

          {inputMode === "pdf" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : file
                    ? "border-green-300 bg-green-50"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
              {file ? (
                <div>
                  <p className="font-medium text-sm text-green-700">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-xs text-red-500 mt-2 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Arrastra tu contrato aqui o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Solo PDF, maximo 10MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Pega aqui el texto completo de tu contrato..."
              className="min-h-[240px] text-sm"
            />
          )}
          {inputMode === "text" && text.length > 0 && text.trim().length < 200 && (
            <p className="text-xs text-amber-600 mt-2">
              El texto es demasiado corto ({text.trim().length}/200 caracteres
              minimos).
            </p>
          )}
        </div>

        {/* Disclaimer */}
        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={disclaimer}
            onChange={(e) => setDisclaimer(e.target.checked)}
            className="mt-0.5 rounded border-gray-300"
          />
          <span className="text-sm text-muted-foreground leading-relaxed">
            Entiendo que ClarityDoc es una herramienta informativa y{" "}
            <strong>no sustituye el asesoramiento juridico profesional</strong>.
          </span>
        </label>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          size="lg"
          className="w-full"
        >
          Analizar contrato
        </Button>
      </div>
    );
  }

  // Loading State
  if (state.step === "loading") {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-8" />
        <p className="text-lg font-medium mb-2">Analizando tu contrato...</p>
        <p className="text-sm text-muted-foreground animate-pulse">
          {LOADING_MESSAGES[loadingMsg]}
        </p>
        <button
          onClick={() => {
            state.abortController.abort();
            setState({ step: "upload" });
          }}
          className="mt-8 text-sm text-muted-foreground hover:text-foreground underline"
        >
          Cancelar analisis
        </button>
      </div>
    );
  }

  // Results State
  const analysis = state.analysis;
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Resultado del analisis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Contrato analizado el{" "}
            {new Date(analysis.fechaAnalisis).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Button variant="outline" onClick={reset}>
          Nuevo analisis
        </Button>
      </div>

      <Card className="p-6 mb-8">
        <ExecutiveSummary analysis={analysis} />
      </Card>

      <Tabs defaultValue="clausulas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clausulas">
            Clausulas ({analysis.clausulasAnalizadas.length})
          </TabsTrigger>
          <TabsTrigger value="ausentes">
            Ausentes ({analysis.clausulasAusentes.length})
          </TabsTrigger>
          <TabsTrigger value="acciones">Acciones</TabsTrigger>
        </TabsList>

        <TabsContent value="clausulas">
          <ClauseList clauses={analysis.clausulasAnalizadas} />
        </TabsContent>

        <TabsContent value="ausentes">
          <MissingClauses clauses={analysis.clausulasAusentes} />
        </TabsContent>

        <TabsContent value="acciones">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Acciones recomendadas</h3>
            {analysis.resumenEjecutivo.accionesRecomendadas.length > 0 ? (
              <ol className="space-y-3 list-decimal list-inside">
                {analysis.resumenEjecutivo.accionesRecomendadas.map((a, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    {a}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay acciones especificas recomendadas. El contrato parece
                razonablemente equilibrado.
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 text-center">
        Este analisis tiene caracter informativo y no constituye asesoramiento
        juridico. Consulta siempre con un profesional antes de firmar.
      </div>
    </div>
  );
}
