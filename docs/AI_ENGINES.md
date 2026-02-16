# AI Engines — App Development Guide

## Supported AI Engine

### Google Gemini

This application uses the **Google Gemini** API via the `@google/generative-ai` SDK.

- **Model:** `gemini-2.0-flash` (default)
- **SDK:** [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)
- **API Docs:** [Google AI for Developers](https://ai.google.dev/docs)

### Getting an API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **Get API Key** → **Create API key**
4. Copy the key and add it to Settings (BYOK) or `.env.local`

### Model Configuration

The default model is `gemini-2.0-flash`. To change it, update:

- `src/app/api/chat/route.ts` — server-side model selection
- `src/lib/gemini.ts` — `createGeminiModel()` default parameter

Available models include:
- `gemini-2.0-flash` — Fast, efficient for most tasks
- `gemini-2.0-flash-lite` — Lightweight variant
- `gemini-2.5-pro-preview-06-05` — Most capable model

## Adding a New AI Engine

To integrate a different AI provider (e.g., OpenAI, Anthropic):

### 1. Install the SDK

```bash
npm install openai  # Example for OpenAI
```

### 2. Create a Provider Module

```typescript
// src/lib/openai.ts
import OpenAI from "openai";

export function createOpenAIClient(apiKey: string) {
  return new OpenAI({ apiKey });
}
```

### 3. Add an API Route

```typescript
// src/app/api/chat-openai/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { message, apiKey } = await req.json();
  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: message }],
  });
  return NextResponse.json({ text: response.choices[0].message.content });
}
```

### 4. Update the Settings Tab

Add a provider selector in `Settings.tsx` to let users choose between AI engines and configure keys for each.

## Speech Recognition

### Web Speech API (Default)

The app uses the browser's built-in Web Speech API:

- **SpeechRecognition** — Converts speech to text
- **SpeechSynthesis** — Converts text to speech (TTS)

Browser support:
| Browser | SpeechRecognition | SpeechSynthesis |
|---------|-------------------|-----------------|
| Chrome | ✅ | ✅ |
| Edge | ✅ | ✅ |
| Safari | ✅ | ✅ |
| Firefox | ❌ | ✅ |

### Capacitor (Native Apps)

For native mobile apps, use `@capacitor-community/speech-recognition`:

```typescript
import { SpeechRecognition } from "@capacitor-community/speech-recognition";

// Request permission
await SpeechRecognition.requestPermissions();

// Start listening
const { matches } = await SpeechRecognition.start({
  language: "en-US",
  popup: false,
});
```

This provides better accuracy and offline support on iOS and Android.

## Security Considerations

- **BYOK keys** are stored in `localStorage` and never leave the user's browser (except to call Gemini directly)
- **Environment variable keys** are proxied through the server-side API route (`/api/chat`) and are never exposed to the client
- The API route validates input to prevent injection attacks
- No API keys are logged or stored on the server
