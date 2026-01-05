
// types.ts (Root directory)

export enum UserTier {
  DAILY_ALPHA = 'Daily Alpha', // Free
  SCOUT = 'Scout',             // Basic Paid
  ARCHITECT = 'Architect',     // Pro
  AUTHORITY = 'Authority'      // Enterprise
}

export interface ChatSession {
  id: string;
  name: string;
  documentsUploadedThisConversation: number;
}

export interface CreativeLabData {
  headline: string;
  visualConcept: string;
  entityBrief: string;
  generatedVisual?: string;
  videoScript?: string; // Architect Feature
}

export interface EntityGapAnalysis {
  entityName: string;
  safetyViolation: boolean;
  isHallucinationRisk: boolean;
  positioningAngle: string; // Blurred for Alpha
  authorityScore: number; // 0 to 100
  marketVolume: string;   // e.g. "12k searches/mo"
  competitionLevel: 'Low' | 'Medium' | 'High';
  
  // Detailed analysis fields
  statusMessage?: string;
  discoveryDate?: string;
  confidenceScore?: number;
  velocity?: string;
  saturation?: string;
  unmetNeed?: string;
  creativeLab?: CreativeLabData;

  // Scout Tier Features
  nichePollinations?: string[]; // 5 specific sub-niche angles

  // Architect Tier Features
  sentimentAnalysis?: {
    currentFrustrations: string[]; // What people hate about current solutions
    projectedDesires: string[];    // What this entity solves
    sentimentScore: number;        // 0-100
  };
  gapHeatmap?: {
    platform: string;
    saturation: number; // 0-100
    opportunity: number; // 0-100
  }[];
  
  // Architect & Authority Features
  aiSeo?: {
    entityDefinition: string; // Architect
    citationPrep?: string;    // Authority (LLM Citation)
  };
  prEngine?: {
    pitchTemplate: string;    // Architect
    editorialWindow?: string; // Authority
  };
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error' | 'thinking';
  title: string;
  content?: string;
}
