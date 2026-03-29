import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "./prompts/system-prompt";
import { buildAnalysisPrompt } from "./prompts/analysis-prompt";
import { contractAnalysisSchema } from "./prompts/types";
import type { ContractAnalysis, ContractType } from "@/types/analysis";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeContract(
  contractText: string,
  contractType: ContractType,
): Promise<ContractAnalysis> {
  const userPrompt = buildAnalysisPrompt(contractText, contractType);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 16000,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(userPrompt);
  const responseText = result.response.text();

  let json: unknown;
  try {
    json = JSON.parse(responseText);
  } catch {
    // Retry once if JSON is invalid
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: userPrompt }] },
        { role: "model", parts: [{ text: responseText }] },
      ],
    });

    const retry = await chat.sendMessage(
      "Tu respuesta anterior no es JSON valido. Responde UNICAMENTE con el objeto JSON especificado en las instrucciones del sistema, sin texto adicional.",
    );
    json = JSON.parse(retry.response.text());
  }

  const analysis = contractAnalysisSchema.parse(json);

  return {
    ...analysis,
    fechaAnalisis: new Date().toISOString(),
  } as ContractAnalysis;
}
