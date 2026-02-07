import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CurationFilters, AICompany, RefinedItem } from "../types";

// Safe initialization
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Mock Data for UI Verification
const MOCK_ANALYSIS: AnalysisResult = {
  snapshot: [
    { name: "TechCrunch AI", traffic: "High", promise: "Breaking News" },
    { name: "ProductHunt", traffic: "Medium", promise: "New Launches" },
    { name: "TLDR AI", traffic: "High", promise: "Daily Summary" }
  ],
  friction: [
    "Too much noise/low quality tools",
    "Lack of strategic depth",
    "Overwhelming volume of daily releases"
  ],
  errc: {
    eliminate: ["Generic Wrappers", "Hype-only Tools", "Clickbait", "Surface-level Analysis"],
    reduce: ["Information Overload", "Latency", "User Friction", "Notification Spam"],
    raise: ["Curation Quality", "Visual Aesthetics", "Strategic Context", "Trust/Verification"],
    create: ["Mentor Persona", "Physical UI Interactions", "Cinematic Reports", "Blue Ocean Strategy"]
  },
  features: [
    { title: "Deep Scan", description: "AI that reads the code, not just the marketing." },
    { title: "Mentor Mode", description: "Strategic advice from Cagan/Graham personas." }
  ],
  groundingUrls: ["https://example.com"]
};

export const getMarketAnalysis = async (ideaDescription: string): Promise<AnalysisResult> => {
  if (!ai) {
    console.warn("No API Key found, returning MOCK DATA for Strategy View");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ANALYSIS), 1000));
  }

  const prompt = `
    Analyze the following product idea as a "Super-Mentor" (fusing Marty Cagan, W. Chan Kim, Paul Graham):
    "${ideaDescription}"
    
    Research requirements (Use Google Search):
    1. Find exactly the top 3 high-traffic competitors in the AI news/tools aggregator space.
    2. Identify specific market frictions (what users are frustrated with).

    Return the result in JSON format only.
    Language: Hebrew.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            snapshot: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  traffic: { type: Type.STRING },
                  promise: { type: Type.STRING }
                },
                required: ["name", "traffic", "promise"]
              }
            },
            friction: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            errc: {
              type: Type.OBJECT,
              properties: {
                eliminate: { type: Type.ARRAY, items: { type: Type.STRING } },
                reduce: { type: Type.ARRAY, items: { type: Type.STRING } },
                raise: { type: Type.ARRAY, items: { type: Type.STRING } },
                create: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["eliminate", "reduce", "raise", "create"]
            },
            features: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            }
          },
          required: ["snapshot", "friction", "errc", "features"]
        }
      }
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(text);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = groundingChunks
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: string | undefined): uri is string => !!uri);

    return {
      ...parsedData,
      groundingUrls: Array.from(new Set(urls))
    };
  } catch (error) {
    console.error("Market analysis failed:", error);
    // Return mock data on failure too, to ensure UI is visible
    return MOCK_ANALYSIS;
  }
};

export const fetchAICompanies = async (): Promise<AICompany[]> => {
  if (!ai) return [];

  const prompt = `
    Scan the current AI ecosystem and return a list of exactly 20 companies.
    Special Instruction: For Google, include a subtopic called "Experiments" which refers to Google Labs.
    
    1. AI Giants: Google (Gemini/DeepMind), Anthropic (Claude), Meta (Llama), OpenAI, Microsoft, NVIDIA.
    2. Disruptive Stars: Manus AI, Groq, 11Labs, Perplexity, Midjourney, Pika Labs, Mistral AI, Runway, Cohere, Harvey.
    
    Return JSON only: { "companies": [ { "id": "string", "name": "string", "type": "giant" | "promising", "description": "string", "subtopics": ["string"] } ] }
  `;

  try {
    if (!ai) return [];
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });
    const data = JSON.parse(response.text);
    return data.companies || [];
  } catch (error) {
    console.error("Fetch AI companies failed:", error);
    return [];
  }
};

export const discoverTrendingAINews = async (filters: CurationFilters) => {
  const isExperimentalSelected = filters.selectedDomains.includes('experimental') || filters.selectedSubtopics.includes('Experiments');
  const sourceHint = isExperimentalSelected ? "IMPORTANT SOURCE: Specifically check https://labs.google/experiments for new AI tools and creative experiments." : "";

  const prompt = `
    Act as "The AI Curator". Perform a high-precision web scan.
    ${sourceHint}
    
    Selected Domains: ${filters.selectedDomains.join(", ")}
    Selected Subfields: ${filters.selectedSubfields.join(", ")}
    Tracked Companies: ${filters.selectedCompanies.join(", ")}
    Tracked Subtopics: ${filters.selectedSubtopics.join(", ")}
    
    CRITICAL SEARCH TARGETS:
    - Recent releases on https://labs.google/experiments (if experimental or Google selected).
    - Recent GitHub repository releases (e.g., 'Claude Code', 'Manus Beta SDK').
    - Product leaks, hidden roadmap items, and internal demos.
    - Research breakthroughs transitioning to working apps.
    - Beta/Waitlist openings for "under-the-radar" products.
    
    CRITERIA: 
    - Actively hunt for IN-DEVELOPMENT items.
    - Focus on the last 48-72 hours only.
    - High-Signal only (Top 1% impact).
    
    Language: Hebrew.
    Return JSON only:
    { "items": [ { "id": "string", "title": "string", "score": number, "summary": "string", "link": "string" } ] }
  `;

  try {
    if (!ai) throw new Error("AI not initialized");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text);
    const items = data.items || [];
    return items.map((item: any, idx: number) => ({
      ...item,
      id: item.id || `news-${Date.now()}-${idx}`
    }));
  } catch (error) {
    console.error("Discovery failed:", error);
    return [];
  }
};

export const refineCuratedContent = async (rawItem: any): Promise<RefinedItem> => {
  const prompt = `
    Act as "The AI Curator", fusing the mental models of Marty Cagan (Product Value), W. Chan Kim (Blue Ocean), and Paul Graham (Startup Signal).
    
    Refine this raw data into a premium authoritative post for an elite audience.
    Raw Data: ${JSON.stringify(rawItem)}

    OUTPUT REQUIREMENTS (Hebrew):
    1. Hook: A catchy, cinematic headline focusing on the "unfair advantage" of this news.
    2. 1% Justification: Why did this survive our strict filter? Focus on Value, ROI, or Innovation.
    3. Curator's Verdict: A short, sharp, and opinionated verdict in the style of an elite mentor.
    
    Return JSON only:
    { "hook": "string", "justification": "string", "verdict": "string" }
  `;

  if (!ai) return "";
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = response.text || "{}";
  const refined = JSON.parse(text);
  return {
    ...refined,
    id: rawItem.id || `refined-${Date.now()}`,
    originalLink: rawItem.link || '#',
    originalTitle: rawItem.title || 'Untitled'
  };
};

export const generateBrandMascot = async (): Promise<string> => {
  if (!ai) return ''; // Add null check for ai instance
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A high-end cinematic render of a humanoid robot head and shoulders, inspired by Sonny from I, Robot but styled as a premium Apple product. Ceramic white polished finish, titanium accents, translucent glass components with subtle internal glow. Deep space background with a hint of purple aurora. Studio lighting, 8k resolution, minimalist.',
        },
      ],
    },
  });

  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64) {
    return `data:image/png;base64,${base64}`;
  }
  return '';
};
