import { geminiCLI } from "./gemini-cli";
import { SYSTEM_PROMPT } from "./prompts/system-prompt";
import { buildAnalysisPrompt } from "./prompts/analysis-prompt";
import { contractAnalysisSchema } from "./prompts/types";
import type { ContractAnalysis, ContractType } from "@/types/analysis";

export async function analyzeContract(
  contractText: string,
  contractType: ContractType,
): Promise<ContractAnalysis> {
  const userPrompt = buildAnalysisPrompt(contractText, contractType);

  // Combine system + user prompt for CLI (no separate system instruction)
  const fullPrompt = `${SYSTEM_PROMPT}\n\n---\n\n${userPrompt}`;

  const responseText = await geminiCLI(fullPrompt);

  // Extract JSON from the response — the model might wrap it in markdown code blocks
  const jsonText = extractJSON(responseText);

  let json: unknown;
  try {
    json = JSON.parse(jsonText);
  } catch {
    // Retry once asking for clean JSON
    const retryPrompt = `${SYSTEM_PROMPT}\n\n---\n\nTu respuesta anterior no fue JSON valido. Aqui estaba tu respuesta:\n\n${responseText.slice(0, 2000)}\n\nResponde UNICAMENTE con el objeto JSON especificado en las instrucciones. Sin texto adicional, sin markdown, sin code blocks. Solo JSON puro.`;
    const retryText = await geminiCLI(retryPrompt);
    json = JSON.parse(extractJSON(retryText));
  }

  const analysis = contractAnalysisSchema.parse(json);

  return {
    ...analysis,
    fechaAnalisis: new Date().toISOString(),
  } as ContractAnalysis;
}

/**
 * Extract JSON from a response that might be wrapped in ```json ... ``` blocks
 * or contain extra text before/after the JSON object.
 */
function extractJSON(text: string): string {
  // Try to extract from markdown code block
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  // Try to find a JSON object directly
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  return text.trim();
}
