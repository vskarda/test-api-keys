# Development Guide

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Server-side only (recommended for production)
GEMINI_API_KEY=your-gemini-api-key

# Client-side accessible (used as fallback)
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

> **Note:** Users can also provide their own API key via the Settings tab (BYOK). This key is stored in `localStorage` and takes priority over environment variables.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full project structure and design decisions.

## Adding Capacitor (Optional)

For native mobile support with speech recognition:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor-community/speech-recognition
npx cap sync
```

Then update `LiveChat.tsx` to use the Capacitor speech recognition plugin instead of Web Speech API when running in a native context.

## Troubleshooting

### Speech recognition not working
- Ensure you're using Chrome, Edge, or Safari (Firefox has limited Web Speech API support)
- Grant microphone permissions when prompted
- Check that the page is served over HTTPS (required for speech recognition in most browsers)

### API key errors
- Verify your Gemini API key is valid at [Google AI Studio](https://aistudio.google.com/)
- Check the Settings tab to see which key source is active
- Ensure the environment variable is properly set in `.env.local`
