import { PDFParse } from "pdf-parse";
import { MIN_TEXT_LENGTH, MAX_TEXT_LENGTH } from "./constants";

export class ExtractError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ExtractError";
  }
}

interface ExtractionResult {
  text: string;
  pageCount: number;
  truncated: boolean;
}

function cleanText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/^\s+$/gm, "")
    .trim();
}

export async function extractTextFromPDF(
  buffer: Buffer,
): Promise<ExtractionResult> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();

  const rawText = result.text || "";
  const pageCount = result.pages?.length ?? 0;

  await parser.destroy();

  if (!rawText || rawText.trim().length === 0) {
    throw new ExtractError(
      "EMPTY_TEXT",
      "El PDF no contiene texto extraible. Es posible que sea un documento escaneado (imagen). Por ahora solo analizamos PDFs digitales.",
    );
  }

  let text = cleanText(rawText);

  if (text.length < MIN_TEXT_LENGTH) {
    throw new ExtractError(
      "INSUFFICIENT_TEXT",
      "El texto extraido es demasiado corto para ser un contrato valido.",
    );
  }

  let truncated = false;
  if (text.length > MAX_TEXT_LENGTH) {
    text = text.substring(0, 80_000);
    truncated = true;
  }

  return { text, pageCount, truncated };
}
