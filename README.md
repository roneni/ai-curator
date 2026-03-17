# AI Curator

A premium AI-powered news intelligence platform that filters 99% of the noise from the AI ecosystem and surfaces only the top 1% signals. Built around the ERRC (Eliminate-Reduce-Raise-Create) Blue Ocean Strategy framework, with a "Super-Mentor" persona fusing the mental models of Marty Cagan, W. Chan Kim, and Paul Graham.

**Live:** [ai-curator-ivory.vercel.app](https://ai-curator-ivory.vercel.app)

## What It Does

AI Curator acts as an elite content curation engine with four operational views:

- **Strategy Blueprint** -- Automated competitive analysis. Scans the AI aggregator market, identifies top competitors, maps user frictions, and generates an ERRC strategy grid with actionable feature recommendations.
- **MVP Spec** -- Translates the strategic analysis into concrete product features with descriptions, auto-generated from the market data.
- **Production Line** -- A three-stage content pipeline (Scraped Inbox, Refinement Desk, Refined Catalog) where raw AI news is discovered, approved, and rewritten into premium brand-voice posts.
- **Public Feed** -- A consumer-facing view that displays refined content as shareable cards with built-in social distribution to X, LinkedIn, WhatsApp, Telegram, Facebook, Threads, and Reddit.

## Key Features

- **Deep Scan Engine** -- Real-time web scanning via Gemini with Google Search grounding, targeting the last 48-72 hours of AI news across 9 industry domains and 20+ tracked companies.
- **Multi-Domain Filtering** -- Granular control over domains (Health/Biotech, Finance, Creative Arts, Dev/SWE, Education, Legal, Robotics, Marketing) with sub-field and company-level topic tracking.
- **AI Ecosystem Tracking** -- Monitors both AI giants (Google, Anthropic, Meta, OpenAI, Microsoft, NVIDIA) and disruptive startups (Groq, 11Labs, Perplexity, Midjourney, Mistral, and others).
- **Brand Voice Refinement** -- Two-pass AI pipeline: discovery uses Gemini Flash for speed, refinement uses Gemini Pro for quality. Output includes a cinematic hook, 1% justification, and a mentor verdict -- all in Hebrew.
- **AI-Generated Mascot** -- Uses Gemini's image generation model to create a brand mascot on demand.
- **Persistent Local State** -- Approved tools, refined items, and mascot are persisted to localStorage across sessions.

## Tech Stack

| Layer       | Technology                                        |
|-------------|---------------------------------------------------|
| Framework   | Next.js 14 (App Router, Server Actions)           |
| Language    | TypeScript                                        |
| AI Backend  | Google Gemini API (`@google/genai`) -- Flash for discovery, Pro for refinement, Flash-Image for mascot generation |
| Search      | Gemini Google Search grounding for real-time data  |
| Styling     | Tailwind CSS 3 with custom animations             |
| Deployment  | Vercel                                            |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/) API key with access to Gemini models

### Installation

```bash
git clone https://github.com/roneni/ai-curator.git
cd ai-curator
npm install
```

### Configuration

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=your_api_key_here
```

The app also checks `NEXT_PUBLIC_GEMINI_API_KEY` and `GOOGLE_API_KEY` as fallbacks. If no key is found, the Strategy view renders with mock data so the UI is still functional.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

## Project Structure

```
ai-curator/
  app/
    actions.ts        -- Server actions wrapping Gemini API calls
    page.tsx          -- Main client component with all four views
    layout.tsx        -- Root layout
    globals.css       -- Global styles
  services/
    geminiService.ts  -- Standalone Gemini service (client-side variant)
  types.ts            -- Shared TypeScript interfaces
  tailwind.config.cjs
  next.config.js
  tsconfig.json
```

## License

MIT
