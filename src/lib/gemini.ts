import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY_STORAGE_KEY = "gemini-api-key";

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export function getStoredApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function clearStoredApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export function getActiveApiKey(): string | null {
  const byok = getStoredApiKey();
  if (byok) return byok;
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? null;
}

export function getApiKeySource(): "byok" | "env" | "none" {
  if (getStoredApiKey()) return "byok";
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) return "env";
  return "none";
}

export function createGeminiModel(apiKey: string, model = "gemini-2.0-flash") {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model });
}
