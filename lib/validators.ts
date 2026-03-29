import { MAX_FILE_SIZE, MIN_TEXT_LENGTH, MAX_TEXT_LENGTH } from "./constants";

export function validateFile(file: File): string | null {
  if (file.type !== "application/pdf") {
    return `Solo se aceptan archivos PDF. El archivo seleccionado es de tipo ${file.type || "desconocido"}.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximo permitido: 10MB.`;
  }
  return null;
}

export function validateText(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return "Por favor, pega el texto de tu contrato.";
  }
  if (trimmed.length < MIN_TEXT_LENGTH) {
    return "El texto es demasiado corto para ser un contrato. Pega el contrato completo.";
  }
  if (trimmed.length > MAX_TEXT_LENGTH) {
    return null; // Will be truncated server-side with warning
  }
  return null;
}

export function validatePdfBuffer(buffer: Buffer): string | null {
  const header = buffer.subarray(0, 5).toString("ascii");
  if (header !== "%PDF-") {
    return "El archivo no es un PDF valido.";
  }
  return null;
}
