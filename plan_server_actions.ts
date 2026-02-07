"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CurationFilters, AICompany, RefinedItem } from "./types"; // Adjust relative path

// Initialize Gemini API client on the server
// Check for both server-side and client-side env vars for compatibility
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

console.log("API Key present:", !!apiKey);

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Mock Data for fallback
const MOCK_ANALYSIS: AnalysisResult = {
    // ... (copy from service or types if needed)
    snapshot: [],
    friction: [],
    errc: { eliminate: [], reduce: [], raise: [], create: [] },
    features: [],
    groundingUrls: []
};

export async function getMarketAnalysis(ideaDescription: string): Promise<AnalysisResult> {
    if (!ai) {
        console.error("Gemini API key missing on server.");
        // Return mock or throw error
        return MOCK_ANALYSIS;
    }
    // ... (implementation)
}

export async function fetchAICompanies(): Promise<AICompany[]> {
    // ... (implementation)
}

export async function discoverTrendingAINews(filters: CurationFilters) {
    // ... (implementation)
}

export async function refineCuratedContent(rawItem: any): Promise<RefinedItem> {
    // ... (implementation)
}

export async function generateBrandMascot(): Promise<string> {
    // ... (implementation)
}
