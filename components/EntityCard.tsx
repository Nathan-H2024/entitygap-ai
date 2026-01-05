
"use client";

import React, { useState } from 'react';
import { EntityGapAnalysis, UserTier } from '../types';
import { ShieldCheck, AlertTriangle, TrendingUp, BarChart2, ThumbsDown, ThumbsUp, Play, FileText, Megaphone, Lock, Globe } from 'lucide-react';

interface EntityCardProps {
  data: EntityGapAnalysis;
  onClaim: () => void;
  isClaimed: boolean;
  userTier: UserTier;
  onOpenSubscriptionModal: () => void;
}

// Mock Data for Locked Features (To show blurred background)
const MOCK_SENTIMENT = {
    frustrations: ["Too expensive ($200+ entry)", "Complicated setup process", "Lack of mobile app integration"],
    desires: ["One-click automation", "Affordable starter kit", "Community-driven templates"]
};
const MOCK_HEATMAP = [
    { platform: "TikTok", sat: 85, opp: 90 },
    { platform: "Reddit", sat: 40, opp: 75 },
    { platform: "Search", sat: 20, opp: 60 },
];
const MOCK_SCRIPT = "[HOOK] Stop trying to fix your sleep with pills. \n[BODY] The real problem is your light environment. Here is the 3-step protocol used by elite athletes to reset circadian rhythm in 48 hours.";

// Helper to clean Markdown and raw escapes from Velocity text
const cleanVelocityText = (text: string | undefined) => {
    if (!text) return "Analysis unavailable.";
    return text
        .replace(/\*\*/g, "") // Remove bold
        .replace(/##/g, "")   // Remove headers
        .replace(/\\n/g, "\n") // Fix literal escaped newlines
        .replace(/`/g, "")     // Remove code ticks
        .trim();
};

const LockedBlur: React.FC<{ isLocked: boolean; tierName: string; onUnlock: () => void; children: React.ReactNode }> = ({ isLocked, tierName, onUnlock, children }) => {
    if (!isLocked) return <>{children}</>;
    return (
        <div className="relative overflow-hidden rounded-lg group">
            <div className="filter blur-[6px] select-none pointer-events-none opacity-40 transition-all duration-500 transform scale-[1.01]">
                {children}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-neutral-900/10 group-hover:bg-neutral-900/30 transition-all">
                <Lock className="w-8 h-8 text-brand-gold mb-3 drop-shadow-lg" />
                <button
                    onClick={onUnlock}
                    className="px-5 py-2.5 bg-brand-gold hover:bg-yellow-400 text-black text-xs font-bold uppercase tracking-wider rounded shadow-lg transform transition hover:scale-105"
                >
                    Unlock {tierName} Feature
                </button>
            </div>
        </div>
    );
};

const EntityCard: React.FC<EntityCardProps> = ({ data, onClaim, isClaimed, userTier, onOpenSubscriptionModal }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SENTIMENT' | 'CREATIVE' | 'ENGINE'>('OVERVIEW');

  // Tier Checks
  const isAlpha = userTier === UserTier.DAILY_ALPHA;
  const isScoutOrHigher = userTier !== UserTier.DAILY_ALPHA;
  const isArchitectOrHigher = userTier === UserTier.ARCHITECT || userTier === UserTier.AUTHORITY;
  const isAuthority = userTier === UserTier.AUTHORITY;

  if (data.safetyViolation) {
    return (
      <div className="p-6 bg-red-950/30 border border-red-500/50 rounded-xl flex items-center space-x-4 font-sans shadow-lg">
        <AlertTriangle className="text-red-500 w-10 h-10" />
        <div>
          <h3 className="text-red-400 font-bold">Safety Protocol Triggered</h3>
          <p className="text-red-300 text-sm">This query violates content safety guidelines.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-card border border-brand-purple/30 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.1)] font-sans overflow-hidden">
      
      {/* HEADER */}
      <div className="p-6 border-b border-brand-purple/10 bg-gradient-to-r from-brand-card to-brand-purple/5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight leading-none mb-2">{data.entityName}</h2>
            <div className="flex flex-wrap items-center gap-2">
               <span className={`px-2 py-0.5 rounded text-xs font-bold tracking-wider ${data.competitionLevel === 'Low' ? 'bg-green-900 text-green-400' : 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30'}`}>
                  {data.competitionLevel.toUpperCase()} COMPETITION
               </span>
               <span className="text-neutral-400 text-xs font-mono border-l border-neutral-700 pl-2">{data.marketVolume}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-brand-gold drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{data.authorityScore}</div>
            <div className="text-[10px] text-brand-gold/70 uppercase tracking-widest font-bold">Auth Score</div>
          </div>
        </div>
      </div>

      {/* TABS - Now Interactive for Everyone */}
      <div className="flex border-b border-brand-purple/10 bg-black/20 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === 'OVERVIEW' ? 'bg-brand-purple/10 text-brand-purple border-b-2 border-brand-purple' : 'text-neutral-500 hover:text-white'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('SENTIMENT')}
          className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center justify-center ${activeTab === 'SENTIMENT' ? 'bg-brand-purple/10 text-brand-purple border-b-2 border-brand-purple' : 'text-neutral-500 hover:text-white'}`}
        >
           Sentiment
        </button>
        <button 
          onClick={() => setActiveTab('CREATIVE')}
          className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center justify-center ${activeTab === 'CREATIVE' ? 'bg-brand-purple/10 text-brand-purple border-b-2 border-brand-purple' : 'text-neutral-500 hover:text-white'}`}
        >
           Creative
        </button>
        <button 
          onClick={() => setActiveTab('ENGINE')}
          className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center justify-center ${activeTab === 'ENGINE' ? 'bg-brand-purple/10 text-brand-purple border-b-2 border-brand-purple' : 'text-neutral-500 hover:text-white'}`}
        >
           SEO & PR
        </button>
      </div>

      <div className="p-6 min-h-[300px]">
        
        {/* VIEW 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
             {/* Positioning Strategy (Blurred for Alpha) */}
             <div className="bg-black/40 p-5 rounded-lg border-l-2 border-brand-purple relative overflow-hidden shadow-inner">
                <h4 className="text-xs text-brand-purple uppercase mb-2 font-bold tracking-wider">Positioning Strategy</h4>
                <LockedBlur isLocked={isAlpha} tierName="Scout" onUnlock={onOpenSubscriptionModal}>
                    <p className="text-neutral-200 italic leading-relaxed">
                       "{data.positioningAngle}"
                    </p>
                </LockedBlur>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-800/50 p-4 rounded border border-neutral-800">
                   <div className="text-xs text-neutral-500 uppercase mb-1">Unmet Need</div>
                   <div className="text-sm text-white font-medium">{data.unmetNeed}</div>
                </div>
                <div className="bg-neutral-800/50 p-4 rounded border border-neutral-800">
                   <div className="text-xs text-neutral-500 uppercase mb-1">Velocity</div>
                   <div className="text-sm text-white font-medium whitespace-pre-wrap leading-relaxed">
                       {cleanVelocityText(data.velocity)}
                   </div>
                   {/* Alpha Visual: Velocity Graph Only */}
                   {isAlpha && <div className="mt-2 h-1 w-full bg-neutral-700 rounded overflow-hidden"><div className="h-full bg-blue-500 w-3/4"></div></div>}
                </div>
             </div>

             {/* Niche Pollinations (Tier Dependent Count) */}
             <div className="mt-4">
                 <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs text-brand-accent uppercase font-bold">Niche Pollinations (Alternative Gaps)</h4>
                    {isAlpha && <span className="text-[10px] text-neutral-500">1 of 3 shown</span>}
                    {!isAlpha && !isArchitectOrHigher && <span className="text-[10px] text-neutral-500">3 of 5 shown</span>}
                 </div>
                 
                 {data.nichePollinations && data.nichePollinations.length > 0 ? (
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {data.nichePollinations.map((pol, i) => (
                                <span key={i} className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs rounded-full">
                                    {pol}
                                </span>
                            ))}
                        </div>
                        
                        {/* Upsell Message */}
                        {isAlpha && (
                            <button onClick={onOpenSubscriptionModal} className="text-[10px] text-brand-accent hover:text-white flex items-center mt-2">
                                <Lock className="w-3 h-3 mr-1" /> Upgrade to Scout for 3 suggestions
                            </button>
                        )}
                        {!isAlpha && !isArchitectOrHigher && (
                             <button onClick={onOpenSubscriptionModal} className="text-[10px] text-brand-accent hover:text-white flex items-center mt-2">
                                <Lock className="w-3 h-3 mr-1" /> Upgrade to Architect for 10 suggestions/day
                             </button>
                        )}
                    </div>
                 ) : (
                     <div className="p-3 bg-neutral-800/50 rounded border border-neutral-800 text-xs text-neutral-500 italic">
                         No pollinations generated for this query.
                     </div>
                 )}
             </div>

             {/* Scout Feature: Saturation Meter */}
             <div className="mt-2 bg-neutral-800/30 p-4 rounded border border-neutral-800">
                 <div className="flex justify-between text-xs text-neutral-400 mb-2">
                    <span>Saturation Meter</span>
                    <span>{isScoutOrHigher ? data.saturation : "???"}</span>
                 </div>
                 <LockedBlur isLocked={!isScoutOrHigher} tierName="Scout" onUnlock={onOpenSubscriptionModal}>
                    <div className="h-2 w-full bg-neutral-700 rounded-full overflow-hidden">
                        <div className={`h-full ${data.competitionLevel === 'High' ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: data.competitionLevel === 'High' ? '85%' : data.competitionLevel === 'Medium' ? '50%' : '15%' }}></div>
                    </div>
                 </LockedBlur>
             </div>
          </div>
        )}

        {/* VIEW 2: SENTIMENT & HEATMAP (Architect Features) */}
        {activeTab === 'SENTIMENT' && (
           <div className="space-y-8 animate-in fade-in zoom-in duration-300">
             <LockedBlur isLocked={!isArchitectOrHigher} tierName="Architect" onUnlock={onOpenSubscriptionModal}>
                {/* Gap Heatmap */}
                <div>
                    <h4 className="text-xs text-brand-gold uppercase font-bold mb-4 flex items-center">
                        <BarChart2 className="w-3 h-3 mr-2" />
                        Gap Heatmaps
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {(data.gapHeatmap || MOCK_HEATMAP).map((heat, idx) => (
                         <div key={idx} className="bg-neutral-800/30 p-3 rounded border border-neutral-800 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-2 z-10 relative">
                               <span className="text-sm font-bold text-white">{heat.platform}</span>
                               <span className="text-[10px] text-neutral-400 uppercase">Opp: {heat.opportunity}%</span>
                            </div>
                            
                            <div className="space-y-2 relative z-10">
                               <div>
                                  <div className="flex justify-between text-[10px] text-neutral-500 mb-0.5"><span>Saturation</span></div>
                                  <div className="h-1.5 w-full bg-neutral-700 rounded-full overflow-hidden">
                                     <div className="h-full bg-red-500" style={{ width: `${heat.saturation}%` }}></div>
                                  </div>
                               </div>
                               <div>
                                  <div className="flex justify-between text-[10px] text-neutral-500 mb-0.5"><span>Demand</span></div>
                                  <div className="h-1.5 w-full bg-neutral-700 rounded-full overflow-hidden">
                                     <div className="h-full bg-green-500" style={{ width: `${heat.opportunity}%` }}></div>
                                  </div>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                </div>

                {/* Sentiment Switch */}
                <div className="mt-8">
                    <h4 className="text-xs text-brand-gold uppercase font-bold mb-4 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-2" />
                        The Sentiment Switch
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-neutral-800 rounded-lg overflow-hidden">
                        <div className="bg-red-950/10 p-4 border-r border-neutral-800">
                            <div className="flex items-center text-red-400 mb-3">
                                <ThumbsDown className="w-4 h-4 mr-2" />
                                <span className="text-xs font-bold uppercase">Frustrations</span>
                            </div>
                            <ul className="space-y-2">
                                {(data.sentimentAnalysis?.currentFrustrations || MOCK_SENTIMENT.frustrations).map((item, i) => (
                                    <li key={i} className="text-xs text-neutral-300 flex items-start">
                                    <span className="text-red-500 mr-2">•</span>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-green-950/10 p-4">
                            <div className="flex items-center text-green-400 mb-3">
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                <span className="text-xs font-bold uppercase">Solution Gap</span>
                            </div>
                            <ul className="space-y-2">
                                {(data.sentimentAnalysis?.projectedDesires || MOCK_SENTIMENT.desires).map((item, i) => (
                                    <li key={i} className="text-xs text-neutral-300 flex items-start">
                                    <span className="text-green-500 mr-2">•</span>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
             </LockedBlur>
           </div>
        )}

        {/* VIEW 3: CREATIVE LAB */}
        {activeTab === 'CREATIVE' && (
           <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <LockedBlur isLocked={!isScoutOrHigher} tierName="Scout" onUnlock={onOpenSubscriptionModal}>
                  <div className="bg-neutral-800/30 p-4 rounded border border-neutral-800">
                     <h4 className="text-[10px] text-brand-purple uppercase font-bold mb-2">Headline Concept</h4>
                     <p className="text-xl font-bold text-white font-serif italic">"{data.creativeLab?.headline || "Loading Concept..."}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                     <div className="bg-neutral-800/30 p-4 rounded border border-neutral-800">
                        <h4 className="text-[10px] text-neutral-500 uppercase font-bold mb-2">Visual Direction</h4>
                        <p className="text-sm text-neutral-300">{data.creativeLab?.visualConcept || "Loading..."}</p>
                     </div>
                     <div className="bg-neutral-800/30 p-4 rounded border border-neutral-800">
                        <h4 className="text-[10px] text-neutral-500 uppercase font-bold mb-2">Entity Brief</h4>
                        <p className="text-sm text-neutral-300">{data.creativeLab?.entityBrief || "Loading..."}</p>
                     </div>
                  </div>
              </LockedBlur>

              {/* Video Script (Architect+) */}
              {isScoutOrHigher && (
                  <div className="bg-black/40 border border-neutral-800 rounded p-4 relative overflow-hidden">
                      <h4 className="text-[10px] text-brand-purple uppercase font-bold mb-2 flex items-center">
                         <Play className="w-3 h-3 mr-2 fill-brand-purple" />
                         Viral Video Script (15s)
                      </h4>
                      <LockedBlur isLocked={!isArchitectOrHigher} tierName="Architect" onUnlock={onOpenSubscriptionModal}>
                         <div className="font-mono text-xs text-neutral-400 whitespace-pre-wrap bg-neutral-950 p-3 rounded border border-neutral-900">
                            {data.creativeLab?.videoScript || MOCK_SCRIPT}
                         </div>
                      </LockedBlur>
                  </div>
              )}
           </div>
        )}

        {/* VIEW 4: SEO & PR ENGINE (Architect+) */}
        {activeTab === 'ENGINE' && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <LockedBlur isLocked={!isArchitectOrHigher} tierName="Architect" onUnlock={onOpenSubscriptionModal}>
                    {/* AI SEO Engine */}
                    <div className="bg-neutral-800/30 border border-neutral-800 rounded p-4">
                        <h4 className="text-xs text-brand-accent uppercase font-bold mb-3 flex items-center">
                            <Globe className="w-3 h-3 mr-2" />
                            AI SEO Engine
                        </h4>
                        <div className="space-y-3">
                            <div className="bg-black/30 p-3 rounded">
                                <span className="text-[10px] text-neutral-500 uppercase block mb-1">Entity Definition (Schema)</span>
                                <p className="text-sm text-white">{data.aiSeo?.entityDefinition || "Generating definition..."}</p>
                            </div>
                            
                            {/* Authority Only: Citation Prep */}
                            <div className="bg-black/30 p-3 rounded relative overflow-hidden">
                                <span className="text-[10px] text-neutral-500 uppercase block mb-1">LLM Citation Prep</span>
                                <LockedBlur isLocked={!isAuthority} tierName="Authority" onUnlock={onOpenSubscriptionModal}>
                                    <p className="text-sm text-white">{data.aiSeo?.citationPrep || "Calculating authority sources... [LOCKED CONTENT]"}</p>
                                </LockedBlur>
                            </div>
                        </div>
                    </div>

                    {/* PR Engine */}
                    <div className="bg-neutral-800/30 border border-neutral-800 rounded p-4 mt-4">
                        <h4 className="text-xs text-green-400 uppercase font-bold mb-3 flex items-center">
                            <Megaphone className="w-3 h-3 mr-2" />
                            PR Engine
                        </h4>
                        <div className="space-y-3">
                            <div className="bg-black/30 p-3 rounded">
                                <span className="text-[10px] text-neutral-500 uppercase block mb-1">Journalist Pitch Template</span>
                                <div className="text-xs font-mono text-neutral-300 whitespace-pre-wrap bg-neutral-900 p-2 rounded border border-neutral-800">
                                    {data.prEngine?.pitchTemplate || "Drafting pitch..."}
                                </div>
                            </div>

                            {/* Authority Only: Editorial Window */}
                            <div className="bg-black/30 p-3 rounded relative overflow-hidden">
                                <span className="text-[10px] text-neutral-500 uppercase block mb-1">Editorial Window Tracker</span>
                                <LockedBlur isLocked={!isAuthority} tierName="Authority" onUnlock={onOpenSubscriptionModal}>
                                    <p className="text-sm text-green-300">{data.prEngine?.editorialWindow || "Scanning calendar... [LOCKED CONTENT]"}</p>
                                </LockedBlur>
                            </div>
                        </div>
                    </div>
                </LockedBlur>
            </div>
        )}

      </div>

      {/* FOOTER ACTION */}
      <div className="p-4 bg-neutral-950 border-t border-brand-purple/10">
         <button 
            onClick={isAlpha ? onOpenSubscriptionModal : onClaim}
            disabled={isClaimed}
            className={`w-full py-3 font-bold rounded-lg transition-all flex items-center justify-center space-x-2 
                ${isClaimed ? 'bg-green-600 text-white cursor-default' : 
                  isAlpha ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400' : 
                  'bg-brand-gold hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,191,36,0.4)]'}`}
         >
            {isAlpha ? (
                <>
                    <Lock className="w-5 h-5" />
                    <span>UPGRADE TO CLAIM GAP</span>
                </>
            ) : (
                <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>{isClaimed ? 'ENTITY SECURED' : 'CLAIM THIS GAP'}</span>
                </>
            )}
         </button>
      </div>
    </div>
  );
};

export default EntityCard;
