import type { RiskLevel } from "@/types/analysis";

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
}

const levelColors = {
  rojo: { ring: "text-red-500", bg: "bg-red-50", text: "text-red-700" },
  amarillo: { ring: "text-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  verde: { ring: "text-green-500", bg: "bg-green-50", text: "text-green-700" },
};

const levelLabels = {
  rojo: "Riesgo Alto",
  amarillo: "Riesgo Medio",
  verde: "Riesgo Bajo",
};

export function RiskGauge({ score, level }: RiskGaugeProps) {
  const c = levelColors[level];
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl ${c.bg}`}>
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={c.ring}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${c.text}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${c.text}`}>
        {levelLabels[level]}
      </span>
    </div>
  );
}
