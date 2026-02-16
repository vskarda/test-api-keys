# Architecture

## Overview

This is a Next.js application for testing Gemini API keys. It provides text and live (voice) chat interfaces powered by Google's Generative AI.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI SDK:** @google/generative-ai
- **Speech:** Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Native speech (optional):** @capacitor-community/speech-recognition

## Directory Structure

```
src/
├── app/
│   ├── api/chat/route.ts   # Server-side Gemini proxy endpoint
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page with tab navigation
├── components/
│   ├── TextChat.tsx         # Text-based chat interface
│   ├── LiveChat.tsx         # Voice-based live chat with visualization
│   └── Settings.tsx         # API key management (BYOK)
├── hooks/
│   └── useApiKey.ts         # Custom hook for API key state
├── lib/
│   └── gemini.ts            # Gemini AI helpers and key management
└── types/
    └── speech.d.ts          # Web Speech API type declarations
```

## API Key Management

The app supports two sources of API keys:

1. **BYOK (Bring Your Own Key)** — User-provided key stored in `localStorage`. This is **preferred**.
2. **Environment Variable** — `NEXT_PUBLIC_GEMINI_API_KEY` (client) or `GEMINI_API_KEY` (server-only).

Priority order: BYOK > Environment variable.

## API Route

`POST /api/chat` proxies requests to the Gemini API. It accepts:

```json
{
  "message": "string",
  "history": [{ "role": "user|model", "parts": [{ "text": "..." }] }],
  "apiKey": "optional-byok-key"
}
```

When no client key is provided, the server uses `GEMINI_API_KEY` or `NEXT_PUBLIC_GEMINI_API_KEY`.

## Live Chat Flow

1. User clicks **Start Conversation**
2. Web Speech API begins listening for speech
3. Recognized text is sent to the Gemini API
4. AI response is spoken aloud via SpeechSynthesis
5. Animated visualization shows AI speaking state
6. Loop continues until user clicks **Stop Conversation**

For native mobile apps, replace Web Speech API with `@capacitor-community/speech-recognition`.
