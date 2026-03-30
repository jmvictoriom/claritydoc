import { spawn, execSync } from "child_process";
import { existsSync } from "fs";

const GEMINI_PATH = findGemini();

/**
 * Calls Gemini CLI with a prompt and returns the raw text response.
 * Uses local OAuth credentials — no API key needed.
 */
export async function geminiCLI(prompt: string): Promise<string> {
  if (!GEMINI_PATH) {
    throw new Error(
      "Gemini CLI not found. Install: npm i -g @google/gemini-cli",
    );
  }

  return new Promise((resolve, reject) => {
    const args = [
      "-p",
      prompt,
      "-o",
      "json",
      "-m",
      "gemini-2.5-flash",
      "-y",
    ];

    const proc = spawn(GEMINI_PATH, args, {
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
    });

    proc.stdin.end();

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        const errorDetail = stderr.slice(0, 500) || "Unknown error";
        reject(new Error(`Gemini CLI exited with code ${code}: ${errorDetail}`));
        return;
      }

      // Gemini -o json wraps the response in: { session_id, response, stats }
      try {
        const envelope = JSON.parse(stdout);
        if (envelope.error) {
          reject(new Error(envelope.error.message || "Gemini API error"));
          return;
        }
        resolve(envelope.response ?? envelope.result ?? stdout);
      } catch {
        // If not valid JSON envelope, return raw stdout
        resolve(stdout);
      }
    });

    proc.on("error", (err) => {
      reject(new Error(`Failed to spawn Gemini CLI: ${err.message}`));
    });
  });
}

function findGemini(): string | null {
  if (process.env.GEMINI_CLI_PATH) return process.env.GEMINI_CLI_PATH;
  const home = process.env.HOME ?? "";
  const candidates = [
    `${home}/.local/bin/gemini`,
    "/usr/local/bin/gemini",
    "/opt/homebrew/bin/gemini",
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  try {
    return execSync("which gemini", { encoding: "utf-8" }).trim();
  } catch {
    return null;
  }
}
