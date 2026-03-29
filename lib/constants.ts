import type { ContractType } from "@/types/analysis";

export const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
export const MAX_TEXT_LENGTH = 100_000;
export const MIN_TEXT_LENGTH = 200;
export const MAX_REQUESTS_PER_HOUR = 5;

export const CONTRACT_TYPES: { value: ContractType; label: string }[] = [
  { value: "alquiler_vivienda", label: "Alquiler de vivienda habitual" },
  { value: "alquiler_local_comercial", label: "Alquiler de local comercial" },
  { value: "alquiler_temporal", label: "Alquiler temporal / de temporada" },
  { value: "otro", label: "Otro tipo de contrato" },
];

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  alquiler_vivienda: "contrato de alquiler de vivienda habitual",
  alquiler_local_comercial: "contrato de alquiler de local comercial",
  alquiler_temporal: "contrato de alquiler temporal / de temporada",
  otro: "contrato de arrendamiento (tipo no especificado)",
};
