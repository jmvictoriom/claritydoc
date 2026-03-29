"use client";

import { useState } from "react";
import type { ClauseAnalysis, RiskLevel } from "@/types/analysis";
import { ClauseCard } from "./clause-card";

interface ClauseListProps {
  clauses: ClauseAnalysis[];
}

type FilterLevel = "todas" | RiskLevel;

export function ClauseList({ clauses }: ClauseListProps) {
  const [filter, setFilter] = useState<FilterLevel>("todas");

  const counts = {
    todas: clauses.length,
    rojo: clauses.filter((c) => c.nivelRiesgo === "rojo").length,
    amarillo: clauses.filter((c) => c.nivelRiesgo === "amarillo").length,
    verde: clauses.filter((c) => c.nivelRiesgo === "verde").length,
  };

  const filtered =
    filter === "todas"
      ? clauses
      : clauses.filter((c) => c.nivelRiesgo === filter);

  const sorted = [...filtered].sort(
    (a, b) => b.puntuacionRiesgo - a.puntuacionRiesgo,
  );

  const filters: { key: FilterLevel; label: string; color: string }[] = [
    { key: "todas", label: "Todas", color: "bg-gray-100 text-gray-700" },
    { key: "rojo", label: "Peligrosas", color: "bg-red-100 text-red-700" },
    {
      key: "amarillo",
      label: "Precaucion",
      color: "bg-amber-100 text-amber-700",
    },
    { key: "verde", label: "Correctas", color: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f.key
                ? `${f.color} ring-2 ring-offset-1 ring-current`
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {sorted.map((clause) => (
          <ClauseCard key={clause.id} clause={clause} type="analyzed" />
        ))}
        {sorted.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay clausulas con este nivel de riesgo.
          </p>
        )}
      </div>
    </div>
  );
}
