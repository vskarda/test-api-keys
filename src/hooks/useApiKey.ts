"use client";

import { useState, useCallback } from "react";
import {
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey as clearStored,
} from "@/lib/gemini";

type KeySource = "byok" | "env" | "none";

function resolveKey(): { apiKey: string | null; source: KeySource } {
  if (typeof window === "undefined") return { apiKey: null, source: "none" };
  const stored = getStoredApiKey();
  if (stored) return { apiKey: stored, source: "byok" };
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY)
    return { apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY, source: "env" };
  return { apiKey: null, source: "none" };
}

export function useApiKey() {
  const [state, setState] = useState(resolveKey);

  const setApiKey = useCallback((key: string) => {
    setStoredApiKey(key);
    setState(resolveKey());
  }, []);

  const clearApiKey = useCallback(() => {
    clearStored();
    setState(resolveKey());
  }, []);

  return { apiKey: state.apiKey, setApiKey, clearApiKey, source: state.source };
}
