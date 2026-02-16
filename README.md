# Gemini API Tester

A Next.js application for testing Google Gemini API keys with text and live (voice) chat interfaces.

## Features

- **Text Chat** — Communicate with Gemini AI through text prompts
- **Live Chat** — Voice conversation with animated AI visualization (Gemini Live style)
- **Settings** — Bring Your Own Key (BYOK) with environment variable fallback

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Key Setup

1. **BYOK (preferred):** Enter your key in the Settings tab
2. **Environment variable:** Create `.env.local` with `NEXT_PUBLIC_GEMINI_API_KEY=your-key`

Get a key at [Google AI Studio](https://aistudio.google.com/).

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [AI Engines Guide](docs/AI_ENGINES.md)
