
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
    velocity: { type: Type.STRING, description: "Trend velocity analysis. Double check found information." },
    saturation: { type: Type.STRING, description: "Market saturation (e.g. Blue Ocean, Crowded)." },
    unmetNeed: { type: Type.STRING, description: "Specific complaint or gap in the market." },
    discoveryDate: { type: Type.STRING, description: "Current date." },
    
    // Niche Pollinations (Suggestions) - NOW MANDATORY
    nichePollinations: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "List of specific sub-niche angles or adjacent opportunities. Must not be empty." 
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
  // ADDED nichePollinations, velocity, unmetNeed to REQUIRED to force generation
  required: ["entityName", "safetyViolation", "isHallucinationRisk", "positioningAngle", "authorityScore", "marketVolume", "competitionLevel", "nichePollinations", "velocity", "unmetNeed"]
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
  // 1. Remove Markdown code blocks if present (e.g., ```json ... ```)
  // We prefer the content inside the block.
  let cleaned = text;
  const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (markdownMatch) {
    cleaned = markdownMatch[1];
  } else {
    // Fallback: Remove any code block markers if regex didn't match perfectly
    cleaned = cleaned.replace(/```json\s*/g, '').replace(/```/g, '');
  }

  // 2. Fix known model glitches
  cleaned = cleaned.replace(/(\)\.\d{4}){2,}/g, ').'); // Repetitive date/version artifacts
  cleaned = cleaned.replace(/(\s*\/[\s\.]*)+$/g, ''); // Trailing slashes loops

  // 3. Locate JSON boundaries
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  } else if (firstBrace !== -1) {
    // Truncated Case: Start from the first brace
    cleaned = cleaned.substring(firstBrace);
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // 4. Advanced Repair for Truncated JSON
    console.warn("JSON Parse Failed, attempting repair...", e);
    
    try {
      // Flatten text to handle unescaped newlines in strings for easier regex processing
      let flat = cleaned.replace(/[\r\n\t]+/g, ' ');

      // Common truncation: cut off inside a string
      // e.g., "description": "some text...
      if (!flat.endsWith('}') && !flat.endsWith(']')) {
         // Check if we are inside a quote
         const quoteCount = (flat.match(/"/g) || []).length;
         if (quoteCount % 2 !== 0) {
             // We are inside an open string. Close it.
             flat += '"';
         }
         
         // Now try to close objects/arrays. 
         // A simple heuristic: count open braces/brackets and add missing closing ones.
         // This is imperfect but works for simple tail truncation.
         const openCurly = (flat.match(/\{/g) || []).length;
         const closeCurly = (flat.match(/\}/g) || []).length;
         const openSquare = (flat.match(/\[/g) || []).length;
         const closeSquare = (flat.match(/\]/g) || []).length;

         for (let i = 0; i < (openSquare - closeSquare); i++) flat += ']';
         for (let i = 0; i < (openCurly - closeCurly); i++) flat += '}';
         
         return JSON.parse(flat);
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

  const promptContext = `
      ROLE: You are the "GapScan Auditor" (EntityGap AI).
      TASK: Perform a strict "GapScan Audit" on: "${niche}".
      
      USER TIER: ${tier}
      REQUIRED POLLINATIONS: ${pollinationCount} (You MUST generate exactly this many).
      
      CONTEXT:
      - Today: ${current}
      - Cutoff: ${cutoff} (Trends older than this are Saturated)

      SCOUT ENGINE LOGIC (Follow sequentially):
      1. [LEGAL GATE] Block if illegal/harmful (set safetyViolation=true).
      2. [VERIFICATION] Search for "${niche}". Verify 2+ sources. If fake/nonsense, set isHallucinationRisk=true.
      3. [VELOCITY CHECK] Double check found information. Is this trending UP or DOWN? Concisely explain in 'velocity'.
      4. [SATURATION] Determine if this is "Blue Ocean" (New) or "Red Ocean" (Crowded).
      5. [UNMET NEEDS] Identify the specific complaint or "Gap" in the market.
      6. [POLLINATION] Suggest exactly ${pollinationCount} 'nichePollinations' (Alternative Gaps) based on your saturation finding:
         - If Saturated: Suggest specific sub-niches or pivots.
         - If Blue Ocean: Suggest specific expansion opportunities or monetization angles.
         - NOTE: This field is MANDATORY for all queries.

      OUTPUT INSTRUCTIONS (CRITICAL):
      - You must output STRICT VALID JSON. 
      - DO NOT output internal monologue.
      - DO NOT wrap the output in markdown (no \`\`\`json tags).
      - Just output the raw JSON string starting with { and ending with }.
      - Keep text fields concise.
      
      BASE FIELDS (REQUIRED):
      - entityName, positioningAngle, marketVolume, saturation, unmetNeed.
      - authorityScore (0-100).
      - velocity: Concise plain text analysis (max 40 words).
      - nichePollinations: Array of exactly ${pollinationCount} strings.

      ${isArchitectOrHigher ? `ARCHITECT TIER FIELDS:
      - sentimentAnalysis: 3 frustrations, 3 desires.
      - gapHeatmap: Data for TikTok, Reddit, Google.
      - creativeLab.videoScript: 15s viral script.
      - aiSeo.entityDefinition: A formal dictionary definition for SEO.
      - prEngine.pitchTemplate: A 2-sentence media pitch.` : ''}

      ${isAuthority ? `AUTHORITY TIER FIELDS:
      - aiSeo.citationPrep: List of 3 high-authority domains to target.
      - prEngine.editorialWindow: Specific upcoming date range to pitch.` : ''}

      IMPORTANT:
      - 'nichePollinations' must NEVER be empty.
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
        thinkingConfig: { thinkingBudget: 1024 }, // Increased slightly for better logic flow
        maxOutputTokens: 8192,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = cleanAndParseJSON(text);
    
    // Fallbacks
    if (!data.confidenceScore) data.confidenceScore = data.authorityScore || 0;
    if (!data.discoveryDate) data.discoveryDate = current;
    // Ensure nichePollinations is an array even if the model fails (fallback)
    if (!data.nichePollinations) data.nichePollinations = ["Analysis unavailable. Please retry scan."];
    
    return data;
    
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Return Error State
    return {
      entityName: "Analysis Error",
      safetyViolation: false,
      isHallucinationRisk: true,
      statusMessage: "System Error or AI Timeout. Please try again.",
      positioningAngle: "System Error",
      authorityScore: 0,
      confidenceScore: 0,
      marketVolume: "N/A",
      competitionLevel: "High",
      velocity: "Unknown",
      saturation: "Unknown",
      unmetNeed: "None",
      nichePollinations: [],
      discoveryDate: current
    };
  }
};
