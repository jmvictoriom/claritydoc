import type { RiskLevel } from "@/types/analysis";

const config = {
  rojo: {
    dot: "bg-red-500",
    label: "Riesgo Alto",
    labelClass: "bg-red-100 text-red-700",
  },
  amarillo: {
    dot: "bg-amber-500",
    label: "Riesgo Medio",
    labelClass: "bg-amber-100 text-amber-700",
  },
  verde: {
    dot: "bg-green-500",
    label: "Riesgo Bajo",
    labelClass: "bg-green-100 text-green-700",
  },
};

export function TrafficLightBadge({ level }: { level: RiskLevel }) {
  const c = config[level];
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${c.dot} shrink-0`} />
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.labelClass}`}
      >
        {c.label}
      </span>
    </div>
  );
}
