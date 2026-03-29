"use client";

import { useState } from "react";
import type { ClauseAnalysis, MissingClause } from "@/types/analysis";
import { TrafficLightBadge } from "./traffic-light-badge";
import { Card } from "@/components/ui/card";

interface ClauseCardProps {
  clause: ClauseAnalysis | MissingClause;
  type: "analyzed" | "missing";
}

const categoryLabels: Record<string, string> = {
  duracion: "Duracion",
  renta_y_pagos: "Renta y pagos",
  fianza_y_garantias: "Fianza y garantias",
  mantenimiento_y_reparaciones: "Mantenimiento",
  suministros: "Suministros",
  subarriendo: "Subarriendo",
  obras_y_modificaciones: "Obras",
  resolucion_y_penalizaciones: "Resolucion",
  actualizacion_renta: "Actualizacion renta",
  derecho_adquisicion_preferente: "Adquisicion preferente",
  uso_del_inmueble: "Uso del inmueble",
  seguros: "Seguros",
  proteccion_datos: "Proteccion de datos",
  jurisdiccion: "Jurisdiccion",
  otro: "Otro",
};

export function ClauseCard({ clause, type }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isAnalyzed = type === "analyzed" && "puntuacionRiesgo" in clause;

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <TrafficLightBadge level={clause.nivelRiesgo} />
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {categoryLabels[clause.categoria] || clause.categoria}
            </span>
            {isAnalyzed && (
              <span className="text-xs font-medium text-muted-foreground">
                {(clause as ClauseAnalysis).puntuacionRiesgo}/100
              </span>
            )}
          </div>
          <h4 className="font-medium text-sm">
            {"titulo" in clause ? clause.titulo : ""}
          </h4>
        </div>
        <svg
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t pt-4">
          {isAnalyzed && (clause as ClauseAnalysis).textoOriginal && (
            <Detail
              label="Texto original"
              value={(clause as ClauseAnalysis).textoOriginal}
              italic
            />
          )}
          {type === "missing" && (clause as MissingClause).textoSugerido && (
            <Detail
              label="Texto sugerido"
              value={(clause as MissingClause).textoSugerido}
              italic
            />
          )}
          <Detail label="Explicacion" value={clause.explicacion} />
          <Detail label="Referencia legal" value={clause.referenciaLegal} />
          {isAnalyzed && (
            <>
              <Detail
                label="Comparacion con el estandar"
                value={(clause as ClauseAnalysis).comparacionEstandar}
              />
              <Detail
                label="Recomendacion"
                value={(clause as ClauseAnalysis).recomendacion}
              />
            </>
          )}
        </div>
      )}
    </Card>
  );
}

function Detail({
  label,
  value,
  italic,
}: {
  label: string;
  value: string;
  italic?: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-0.5">
        {label}
      </p>
      <p
        className={`text-sm leading-relaxed ${italic ? "italic text-muted-foreground bg-muted/50 p-2 rounded" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
