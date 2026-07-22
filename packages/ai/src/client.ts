import OpenAI from "openai";

let client: OpenAI | null = null;

/** Lazily create the OpenAI client. Returns null when no key is configured. */
export function getOpenAI(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new OpenAI({ apiKey });
  return client;
}

/** Default model, overridable via OPENAI_MODEL or per-template config. */
export const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o";
