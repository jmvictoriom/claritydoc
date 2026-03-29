import { NextResponse } from "next/server";
import { extractTextFromPDF, ExtractError } from "@/lib/pdf-extract";
import { analyzeContract } from "@/lib/anthropic";
import { validatePdfBuffer } from "@/lib/validators";
import { MAX_FILE_SIZE, MIN_TEXT_LENGTH } from "@/lib/constants";
import type { ContractType } from "@/types/analysis";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT",
            message:
              "Has alcanzado el limite de analisis por hora (5). Intentalo de nuevo mas tarde.",
          },
        },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;
    const contractType =
      (formData.get("contractType") as ContractType) || "alquiler_vivienda";

    let contractText: string;

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FILE_TOO_LARGE",
              message: "El archivo excede el tamano maximo permitido (10MB).",
            },
          },
          { status: 413 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const pdfError = validatePdfBuffer(buffer);
      if (pdfError) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "INVALID_PDF", message: pdfError },
          },
          { status: 422 },
        );
      }

      const extraction = await extractTextFromPDF(buffer);
      contractText = extraction.text;
    } else if (text && text.trim().length >= MIN_TEXT_LENGTH) {
      contractText = text.trim();
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NO_INPUT",
            message:
              "Debes subir un PDF o pegar el texto del contrato (minimo 200 caracteres).",
          },
        },
        { status: 400 },
      );
    }

    const analysis = await analyzeContract(contractText, contractType);

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    if (error instanceof ExtractError) {
      return NextResponse.json(
        {
          success: false,
          error: { code: error.code, message: error.message },
        },
        { status: 422 },
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("Analysis error:", errorMessage, error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "API_ERROR",
          message: `Error: ${errorMessage}`,
        },
      },
      { status: 500 },
    );
  }
}
