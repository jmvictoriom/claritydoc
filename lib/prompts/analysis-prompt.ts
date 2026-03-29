import { CONTRACT_TYPE_LABELS } from "@/lib/constants";
import type { ContractType } from "@/types/analysis";

export function buildAnalysisPrompt(
  contractText: string,
  contractType: ContractType,
): string {
  const typeLabel =
    CONTRACT_TYPE_LABELS[contractType] || CONTRACT_TYPE_LABELS.otro;

  return `Analiza el siguiente ${typeLabel}.

## TEXTO DEL CONTRATO

<contrato>
${contractText}
</contrato>

Analiza cada clausula del contrato anterior siguiendo estrictamente las instrucciones del sistema. Responde UNICAMENTE con el objeto JSON especificado.`;
}
