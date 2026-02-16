"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useApiKey } from "@/hooks/useApiKey";

interface TranscriptEntry {
  role: "user" | "ai";
  text: string;
}

export default function LiveChat() {
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [status, setStatus] = useState("Tap Start to begin");
  const { apiKey, source } = useApiKey();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const getAiResponse = useCallback(
    async (userText: string) => {
      setStatus("Thinking...");
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userText,
            apiKey: source === "byok" ? apiKey : undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data.text as string;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error getting response";
        setStatus(msg);
        return null;
      }
    },
    [apiKey, source]
  );

  const startListening = useCallback(() => {
    // Try Web Speech API (works in Chrome, Edge, Safari)
    const SpeechRecognitionCtor =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognitionCtor) {
      setStatus("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("Listening...");
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const userText = event.results[0][0].transcript;
      setIsListening(false);
      setTranscript((prev) => [...prev, { role: "user", text: userText }]);

      const aiText = await getAiResponse(userText);
      if (aiText) {
        setTranscript((prev) => [...prev, { role: "ai", text: aiText }]);
        setStatus("Speaking...");
        await speak(aiText);
      }
      // Continue listening after AI responds if still active
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // recognition may already be started
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      if (event.error === "no-speech") {
        setStatus("No speech detected. Listening again...");
        try {
          recognition.start();
        } catch {
          // ignore
        }
      } else if (event.error !== "aborted") {
        setStatus(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [getAiResponse, speak]);

  const handleStart = () => {
    if (source === "none") {
      setStatus("No API key configured. Go to Settings.");
      return;
    }
    setIsActive(true);
    setStatus("Starting...");
    startListening();
  };

  const handleStop = () => {
    setIsActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setStatus("Stopped");
    window.speechSynthesis?.cancel();
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center">
      {source === "none" && (
        <div className="mb-3 w-full rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
          No API key configured. Go to Settings to add one.
        </div>
      )}

      {/* AI Visualization */}
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="relative flex items-center justify-center">
          {/* Outer rings */}
          <div
            className={`absolute h-48 w-48 rounded-full border-2 border-blue-400/30 ${
              isSpeaking ? "animate-pulse-ring-3" : ""
            }`}
          />
          <div
            className={`absolute h-36 w-36 rounded-full border-2 border-blue-400/40 ${
              isSpeaking ? "animate-pulse-ring-2" : ""
            }`}
          />
          <div
            className={`absolute h-24 w-24 rounded-full border-2 border-blue-400/50 ${
              isSpeaking ? "animate-pulse-ring-1" : ""
            }`}
          />
          {/* Core circle */}
          <div
            className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full text-2xl ${
              isSpeaking
                ? "animate-pulse-core bg-blue-500 shadow-lg shadow-blue-500/50"
                : isListening
                  ? "bg-red-500 shadow-lg shadow-red-500/50"
                  : isActive
                    ? "bg-zinc-600"
                    : "bg-zinc-700"
            }`}
          >
            {isSpeaking ? "🔊" : isListening ? "🎙️" : "⬤"}
          </div>
        </div>
      </div>

      {/* Status */}
      <p className="mb-4 text-sm text-zinc-400">{status}</p>

      {/* Note about Capacitor */}
      <p className="mb-4 text-center text-xs text-zinc-600">
        Uses Web Speech API. For native apps, @capacitor-community/speech-recognition is recommended.
      </p>

      {/* Start/Stop Button */}
      <button
        onClick={isActive ? handleStop : handleStart}
        className={`mb-6 rounded-full px-8 py-3 text-sm font-semibold transition-colors ${
          isActive
            ? "bg-red-600 text-white hover:bg-red-500"
            : "bg-blue-600 text-white hover:bg-blue-500"
        }`}
      >
        {isActive ? "Stop Conversation" : "Start Conversation"}
      </button>

      {/* Transcript */}
      {transcript.length > 0 && (
        <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 text-sm font-medium text-zinc-300">Transcript</h3>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {transcript.map((entry, i) => (
              <div key={i} className="text-sm">
                <span
                  className={`font-medium ${
                    entry.role === "user" ? "text-blue-400" : "text-green-400"
                  }`}
                >
                  {entry.role === "user" ? "You" : "AI"}:
                </span>{" "}
                <span className="text-zinc-300">{entry.text}</span>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
