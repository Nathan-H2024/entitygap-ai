
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GAPSCAN_SYSTEM_INSTRUCTION } from "../constants";
import { EntityGapAnalysis, UserTier } from "../types";

// Initialize the client using Next.js public environment variable
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable. AI features may not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// Define the response schema for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    entityName: { type: Type.STRING, description: "The name of the identified trend/entity." },
    safetyViolation: { type: Type.BOOLEAN, description: "True if content is illegal or harmful." },
    isHallucinationRisk: { type: Type.BOOLEAN, description: "True if sources could not be verified." },
    statusMessage: { type: Type.STRING, description: "Reason for safety violation or hallucination risk." },
    positioningAngle: { type: Type.STRING, description: "The strategic angle to take." },
    authorityScore: { type: Type.NUMBER, description: "0-100 score based on verification." },
    confidenceScore: { type: Type.NUMBER, description: "Confidence score (0-100)." },
    marketVolume: { type: Type.STRING, description: "Estimated search volume string." },
    competitionLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
    velocity: { type: Type.STRING, description: "Trend velocity analysis." },
    saturation: { type: Type.STRING, description: "Market saturation (e.g. Blue Ocean, Crowded)." },
    unmetNeed: { type: Type.STRING, description: "Specific complaint or gap in the market." },
    discoveryDate: { type: Type.STRING, description: "Current date." },
    nichePollinations: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "List of specific sub-niche angles or adjacent opportunities." 
    },
    creativeLab: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING },
        visualConcept: { type: Type.STRING },
        entityBrief: { type: Type.STRING }
      }
    }
  },
  required: ["entityName", "safetyViolation", "isHallucinationRisk", "positioningAngle", "authorityScore", "marketVolume", "competitionLevel"]
};

// Helper to get formatted dates for the prompt
const getDateContext = () => {
  const now = new Date();
  const current = now.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  
  const past = new Date();
  past.setFullYear(now.getFullYear() - 1);
  const cutoff = past.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  
  return { current, cutoff };
};

export const analyzeNiche = async (niche: string, tier: UserTier): Promise<EntityGapAnalysis> => {
  const modelName = 'gemini-3-pro-preview';
  const { current, cutoff } = getDateContext();
  const isArchitectOrHigher = tier === UserTier.ARCHITECT || tier === UserTier.AUTHORITY;

  // Determine Pollination (Suggestion) Count based on Tier
  let pollinationCount = 1; // Default Daily Alpha
  if (tier === UserTier.SCOUT) pollinationCount = 3;
  if (isArchitectOrHigher) pollinationCount = 5; // Batches of 5

  // Authority Prompt Engineering: The "GapScan Auditor" Persona
  const promptContext = `
    ACT AS: The "GapScan Auditor".
    TASK: Analyze the niche query: "${niche}".
    
    CONTEXT:
    - User Tier: ${tier}
    - Today's Date: ${current}
    - Saturation Cutoff: ${cutoff}

    STRICT SAFETY PROTOCOLS:
    1. If the query involves medical advice, illegal acts, or hate speech, set 'safetyViolation' to true.
    2. If the niche sounds fake or nonsensical, set 'isHallucinationRisk' to true.

    VERIFICATION GATES:
    - Check peak date against cutoff (${cutoff}).
    - Verify 2+ sources via Google Search (Reddit, News, TikTok trends).
    - If verified, authorityScore > 70. If only 1 source, < 50.

    COMPETITION & GAP LOGIC:
    - Perform Google Search for "${niche}".
    - Assess Competition Level.
    - MANDATORY: Generate exactly ${pollinationCount} 'nichePollinations' (Alternative Gaps) regardless of competition level.
        > If Competition is HIGH/SATURATED: Find specific low-competition sub-niches or pivots.
        > If Competition is LOW/BLUE OCEAN: Find specific expansion opportunities or monetization angles.

    OUTPUT: Return ONLY a JSON object matching the schema.
    Determine:
    1. Market Volume (Estimate)
    2. Competition Level (Low/Medium/High)
    3. Authority Score (Confidence in trend existence)
    4. Positioning Angle (Strategic gap)
    5. Velocity (Provide 2-3 paragraphs. Write in PLAIN TEXT. Do not use markdown like bolding or code blocks.)
    6. Saturation
    7. Unmet Need (The Gap)
    8. Creative Assets (Headline, Visual Concept)
    9. Niche Pollinations (Exactly ${pollinationCount} items)
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptContext,
      config: {
        systemInstruction: GAPSCAN_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const data = JSON.parse(text) as EntityGapAnalysis;

    // Fill defaults
    if (!data.confidenceScore) data.confidenceScore = data.authorityScore;
    if (!data.discoveryDate) data.discoveryDate = current;

    return data;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      entityName: "Error",
      safetyViolation: false,
      isHallucinationRisk: true,
      statusMessage: "Analysis Failed: " + (error instanceof Error ? error.message : "Unknown error"),
      positioningAngle: "Analysis Failed",
      authorityScore: 0,
      confidenceScore: 0,
      marketVolume: "N/A",
      competitionLevel: "High",
      velocity: "N/A",
      saturation: "N/A",
      unmetNeed: "None",
      discoveryDate: current
    };
  }
};
