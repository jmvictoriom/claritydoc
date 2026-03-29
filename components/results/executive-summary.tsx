import type { ContractAnalysis } from "@/types/analysis";
import { RiskGauge } from "./risk-gauge";
import { Alert } from "@/components/ui/alert";

interface ExecutiveSummaryProps {
  analysis: ContractAnalysis;
}

export function ExecutiveSummary({ analysis }: ExecutiveSummaryProps) {
  const { resumenEjecutivo, metadatos } = analysis;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <RiskGauge
          score={resumenEjecutivo.puntuacionRiesgoGlobal}
          level={resumenEjecutivo.nivelRiesgoGlobal}
        />
        <div className="flex-1 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <StatBadge
              label="Clausulas"
              value={metadatos.totalClausulas}
              color="gray"
            />
            <StatBadge
              label="Peligrosas"
              value={metadatos.clausulasRojas}
              color="red"
            />
            <StatBadge
              label="Precaucion"
              value={metadatos.clausulasAmarillas}
              color="amber"
            />
            <StatBadge
              label="Correctas"
              value={metadatos.clausulasVerdes}
              color="green"
            />
            <StatBadge
              label="Ausentes"
              value={metadatos.clausulasAusentes}
              color="red"
            />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {resumenEjecutivo.resumenGeneral}
          </p>
        </div>
      </div>

      {resumenEjecutivo.advertenciasCriticas.length > 0 && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <div>
            <p className="font-semibold text-sm mb-2">
              Advertencias criticas
            </p>
            <ul className="list-disc list-inside space-y-1">
              {resumenEjecutivo.advertenciasCriticas.map((w, i) => (
                <li key={i} className="text-sm">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </Alert>
      )}

      {resumenEjecutivo.hallazgosPrincipales.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-2">
            Hallazgos principales
          </h3>
          <ul className="space-y-2">
            {resumenEjecutivo.hallazgosPrincipales.map((h, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground flex gap-2 items-start"
              >
                <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "gray" | "red" | "amber" | "green";
}) {
  const colors = {
    gray: "bg-gray-100 text-gray-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-green-100 text-green-700",
  };
  return (
    <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${colors[color]}`}>
      <span className="font-bold text-base mr-1">{value}</span>
      {label}
    </div>
  );
}
