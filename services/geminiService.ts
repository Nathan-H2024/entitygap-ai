
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GAPSCAN_SYSTEM_INSTRUCTION } from "../constants";
import { EntityGapAnalysis, UserTier } from "../types";

// Initialize the client. API Key is obtained exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for structured output matching the new Types
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    entityName: { type: Type.STRING, description: "The name of the identified trend/entity." },
    safetyViolation: { type: Type.BOOLEAN, description: "True if content is illegal or harmful." },
    isHallucinationRisk: { type: Type.BOOLEAN, description: "True if sources could not be verified." },
    statusMessage: { type: Type.STRING, description: "Reason for safety violation or hallucination risk." },
    positioningAngle: { type: Type.STRING, description: "The strategic angle to take." },
    authorityScore: { type: Type.NUMBER, description: "0 to 100 score based on verification." },
    confidenceScore: { type: Type.NUMBER, description: "Confidence score (0-100)." },
    marketVolume: { type: Type.STRING, description: "e.g. '12k searches/mo'" },
    competitionLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
    velocity: { type: Type.STRING, description: "Trend velocity analysis." },
    saturation: { type: Type.STRING, description: "Market saturation (e.g. Blue Ocean, Crowded)." },
    unmetNeed: { type: Type.STRING, description: "Specific complaint or gap in the market." },
    discoveryDate: { type: Type.STRING, description: "Current date." },
    
    // Niche Pollinations (Suggestions)
    nichePollinations: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "List of specific sub-niche angles or adjacent opportunities." 
    },

    // Architect Fields
    sentimentAnalysis: {
      type: Type.OBJECT,
      properties: {
        currentFrustrations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3 complaints about current solutions." },
        projectedDesires: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3 things users want from this new entity." },
        sentimentScore: { type: Type.NUMBER, description: "0-100 Sentiment Score." }
      }
    },
    gapHeatmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING, description: "e.g. TikTok, Reddit, Google Search" },
          saturation: { type: Type.NUMBER, description: "0-100 (High number = Crowded)" },
          opportunity: { type: Type.NUMBER, description: "0-100 (High number = High Opportunity)" }
        }
      }
    },
    
    // Creative Lab
    creativeLab: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING, description: "Catchy headline for the entity." },
        visualConcept: { type: Type.STRING, description: "Description of a visual concept." },
        entityBrief: { type: Type.STRING, description: "SEO brief or description." },
        videoScript: { type: Type.STRING, description: "A 15-second viral video script hook + body." }
      },
      required: ["headline", "visualConcept", "entityBrief"]
    },

    // SEO Engine (Architect+)
    aiSeo: {
      type: Type.OBJECT,
      properties: {
        entityDefinition: { type: Type.STRING, description: "Formal definition of the entity for SEO schema." },
        citationPrep: { type: Type.STRING, description: "Authority only: List of citations to seed." }
      }
    },

    // PR Engine (Architect+)
    prEngine: {
      type: Type.OBJECT,
      properties: {
        pitchTemplate: { type: Type.STRING, description: "Email pitch template for journalists." },
        editorialWindow: { type: Type.STRING, description: "Authority only: Estimated best time to pitch." }
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

// Robust JSON Cleaner
const cleanAndParseJSON = (text: string): EntityGapAnalysis => {
  // Pre-cleaning: 
  // 1. Fix known repetition bugs (e.g., ").2026).2026").
  let cleaned = text.replace(/(\)\.\d{4}){2,}/g, ').');

  // 2. Fix the specific " / . / ." loop seen in Gemini 2.5/3 models.
  // This regex looks for repeated sequences of slashes, dots, and spaces at the end of the string.
  cleaned = cleaned.replace(/(\s*\/[\s\.]*)+$/g, '');

  // 3. Remove Markdown code blocks if present
  cleaned = cleaned.replace(/```json\s*/g, '').replace(/```/g, '').trim();

  try {
    // 4. Extract JSON object via brace matching
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    
    // 5. Attempt to parse
    return JSON.parse(cleaned);

  } catch (e) {
    // Fallback strategy for unescaped characters or truncation
    try {
        // Flatten text to handle unescaped newlines in strings
        const flattened = cleaned.replace(/[\r\n\t]+/g, ' ');
        
        // Re-attempt extraction
        const firstBrace = flattened.indexOf('{');
        const lastBrace = flattened.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
             const finalClean = flattened.substring(firstBrace, lastBrace + 1);
             return JSON.parse(finalClean);
        }
        
        // If no closing brace found (truncated), try finding the last valid comma-separated property
        if (firstBrace !== -1) {
            // "Hail Mary": Assume the string was cut off inside a value. 
            // Try to close the JSON manually.
            let truncated = flattened.substring(firstBrace);
            // Remove the last partial string if it doesn't end with a quote
            if (!truncated.endsWith('"') && !truncated.endsWith('}')) {
                // Find the last quote
                const lastQuote = truncated.lastIndexOf('"');
                if (lastQuote > 0) {
                     // Close the string and object
                     return JSON.parse(truncated.substring(0, lastQuote) + '"}');
                }
            }
        }
        
        throw e;
    } catch (finalError) {
        console.error("Critical JSON Parse Error:", finalError);
        console.error("Raw Text causing error:", text);
        throw new Error("Failed to parse AI response. The model generated invalid JSON.");
    }
  }
};

export const analyzeNiche = async (niche: string, tier: UserTier): Promise<EntityGapAnalysis> => {
  const modelName = 'gemini-3-pro-preview';
  
  const { current, cutoff } = getDateContext();

  // Tier-Specific Logic
  const isArchitectOrHigher = tier === UserTier.ARCHITECT || tier === UserTier.AUTHORITY;
  const isAuthority = tier === UserTier.AUTHORITY;

  // Determine Pollination (Suggestion) Count based on Tier
  let pollinationCount = 1; // Default Daily Alpha
  if (tier === UserTier.SCOUT) pollinationCount = 3;
  if (isArchitectOrHigher) pollinationCount = 5; // Batches of 5

  const promptContext = `Perform a strict "GapScan Audit" on: "${niche}". 
      
      User Subscription Tier: ${tier}. 
      
      CONTEXT:
      - Today: ${current}
      - Cutoff: ${cutoff} (Trends older than this are Saturated)

      GATES:
      1. Legal/Safety (Block if illegal/harmful).
      2. Verification (Must have 2+ recent sources).
      3. COMPETITION & GAP LOGIC:
         - Perform Google Search for "${niche}".
         - Assess Competition Level.
         - MANDATORY: Generate exactly ${pollinationCount} 'nichePollinations' (Alternative Gaps) regardless of competition level.
           > If Competition is HIGH/SATURATED: Find specific low-competition sub-niches or pivots.
           > If Competition is LOW/BLUE OCEAN: Find specific expansion opportunities or monetization angles.

      OUTPUT REQUIREMENTS:
      - Return STRICT JSON. No markdown.
      - IMPORTANT: Ensure all newlines within string values are escaped (e.g. "\\n"). Do not output literal control characters.
      - CRITICAL: Do not output repetitive filler characters like "/ . / ." or infinite loops. Terminate the JSON object properly.
      
      BASE FIELDS (For All Tiers):
      - entityName, positioningAngle, marketVolume, saturation, unmetNeed.
      - authorityScore (0-100).
      
      formatting:
      - velocity: Provide a detailed analysis (MAX 50 words). Write in PLAIN TEXT. Be extremely concise. Long outputs cause errors. Do not use markdown.

      TIER SPECIFIC GENERATION:
      - Generate exactly ${pollinationCount} items for 'nichePollinations'.

      ${isArchitectOrHigher ? `ARCHITECT TIER FEATURES:
      - Generate 'sentimentAnalysis': 3 current frustrations, 3 projected desires.
      - Generate 'gapHeatmap': Data for TikTok, Reddit, Google.
      - Generate 'creativeLab.videoScript': 15s viral script.
      - Generate 'aiSeo.entityDefinition': A formal dictionary definition for SEO.
      - Generate 'prEngine.pitchTemplate': A 2-sentence media pitch.` : ''}

      ${isAuthority ? `AUTHORITY TIER FEATURES:
      - Generate 'aiSeo.citationPrep': List of 3 high-authority domains to target.
      - Generate 'prEngine.editorialWindow': Specific upcoming date range to pitch.` : ''}

      IMPORTANT:
      - If a field is not requested for this tier, omit it or leave null.
      - Keep text concise.
      - Do not hallucinate URLs.`;

  try {
    // 1. Generate Text Analysis
    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptContext,
      config: {
        systemInstruction: GAPSCAN_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // ENABLE GROUNDING
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 1024 }, // Reduced thinking budget to reserve tokens for output
        maxOutputTokens: 4000, // Reduced max output to prevent loops from consuming full context
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = cleanAndParseJSON(text);
    
    // Fallbacks
    if (!data.confidenceScore) data.confidenceScore = data.authorityScore || 0;
    if (!data.discoveryDate) data.discoveryDate = current;
    
    return data;
    
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Return Error State
    return {
      entityName: "Error",
      safetyViolation: false,
      isHallucinationRisk: true,
      statusMessage: "System Error or AI Timeout",
      positioningAngle: "System Error",
      authorityScore: 0,
      confidenceScore: 0,
      marketVolume: "N/A",
      competitionLevel: "High",
      velocity: "Unknown",
      saturation: "Unknown",
      unmetNeed: "None",
      discoveryDate: current
    };
  }
};
