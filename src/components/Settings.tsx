"use client";

import { useState } from "react";
import { useApiKey } from "@/hooks/useApiKey";

export default function Settings() {
  const { apiKey, setApiKey, clearApiKey, source } = useApiKey();
  const [inputValue, setInputValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setApiKey(trimmed);
    setInputValue("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    clearApiKey();
    setInputValue("");
  };

  const statusColor =
    source === "byok"
      ? "text-green-400"
      : source === "env"
        ? "text-blue-400"
        : "text-red-400";

  const statusLabel =
    source === "byok"
      ? "Using your API key"
      : source === "env"
        ? "Using environment variable"
        : "No API key configured";

  return (
    <div className="mx-auto w-full max-w-md space-y-6 pt-8">
      <div>
        <h2 className="text-lg font-semibold text-white">API Key Settings</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Provide your own Gemini API key or use the environment variable.
        </p>
      </div>

      {/* Status Indicator */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              source === "byok"
                ? "bg-green-400"
                : source === "env"
                  ? "bg-blue-400"
                  : "bg-red-400"
            }`}
          />
          <span className={`text-sm font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
        {apiKey && (
          <p className="mt-2 font-mono text-xs text-zinc-500">
            {showKey ? apiKey : `${apiKey.slice(0, 8)}${"•".repeat(20)}`}
          </p>
        )}
      </div>

      {/* Environment Variable Status */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-zinc-400">
          Environment key (NEXT_PUBLIC_GEMINI_API_KEY):{" "}
          <span
            className={
              process.env.NEXT_PUBLIC_GEMINI_API_KEY
                ? "text-green-400"
                : "text-zinc-600"
            }
          >
            {process.env.NEXT_PUBLIC_GEMINI_API_KEY
              ? "Available"
              : "Not set"}
          </span>
        </p>
      </div>

      {/* API Key Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-300">
          Your API Key (BYOK)
        </label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your Gemini API key..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-16 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
          >
            {showKey ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!inputValue.trim()}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-40"
          >
            Save Key
          </button>
          {source === "byok" && (
            <button
              onClick={handleClear}
              className="rounded-xl border border-white/10 px-5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5"
            >
              Clear Key
            </button>
          )}
        </div>

        {saved && (
          <p className="text-sm text-green-400">✓ API key saved successfully</p>
        )}
      </div>

      {/* Info */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-zinc-500">
        <p>
          <strong className="text-zinc-400">Priority:</strong> Your API key (BYOK)
          is preferred over the environment variable.
        </p>
        <p className="mt-1">
          <strong className="text-zinc-400">Storage:</strong> Your key is stored in
          localStorage and never sent to third parties.
        </p>
        <p className="mt-1">
          <strong className="text-zinc-400">Server:</strong> When using the env
          variable, requests are proxied through the API route to keep the key
          secure.
        </p>
      </div>
    </div>
  );
}
