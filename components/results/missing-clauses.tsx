import type { MissingClause } from "@/types/analysis";
import { ClauseCard } from "./clause-card";

interface MissingClausesProps {
  clauses: MissingClause[];
}

export function MissingClauses({ clauses }: MissingClausesProps) {
  if (clauses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No se han detectado clausulas ausentes importantes. El contrato parece
        incluir todas las clausulas habituales.
      </p>
    );
  }

  const sorted = [...clauses].sort((a, b) => {
    if (a.nivelRiesgo === "rojo" && b.nivelRiesgo !== "rojo") return -1;
    if (a.nivelRiesgo !== "rojo" && b.nivelRiesgo === "rojo") return 1;
    return 0;
  });

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Estas clausulas deberian estar en tu contrato y no aparecen. Haz clic en
        cada una para ver por que son importantes y un texto sugerido.
      </p>
      {sorted.map((clause, i) => (
        <ClauseCard key={i} clause={clause} type="missing" />
      ))}
    </div>
  );
}
