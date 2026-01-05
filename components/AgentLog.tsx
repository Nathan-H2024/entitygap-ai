"use client";

import React from 'react';
import { EntityGapAnalysis, UserTier } from '../types';

interface AgentLogProps {
  data: EntityGapAnalysis | null;
  loading: boolean;
  onClaim?: () => void;
  userTier: UserTier;
}

const AgentLog: React.FC<AgentLogProps> = ({ data, loading, onClaim, userTier }) => {
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 border border-[#facc15]/20 rounded-xl bg-black text-[#facc15] flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-mono animate-pulse">TRIANGULATING DATA SOURCES...</p>
        <p className="text-xs text-[#facc15]/50 mt-2">Checking Reddit, TikTok, and News velocity.</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Handle Safety Violations
  if (data.safetyViolation) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 border border-red-600 bg-red-950/20 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-red-500 mb-2">INTEGRITY PROTOCOL VIOLATION</h3>
        <p className="text-red-400 mb-4">{data.statusMessage}</p>
        <div className="text-xs text-red-500 uppercase font-mono border-t border-red-900/50 pt-4 inline-block">
          Gate 1: Blocked
        </div>
      </div>
    );
  }

  // Handle Hallucinations
  if (data.isHallucinationRisk) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 border border-orange-500/50 bg-orange-950/20 rounded-xl">
        <h3 className="text-xl font-bold text-orange-500 mb-2 font-mono">UNCERTAINTY DETECTED</h3>
        <p className="text-orange-300 mb-4">{data.statusMessage}</p>
        <div className="text-xs text-orange-500 uppercase font-mono">
          Gate 2: Verification Failed
        </div>
      </div>
    );
  }

  const isFree = userTier.includes('Alpha');
  const isArchitectOrHigher = userTier.includes('Architect') || userTier.includes('Authority');

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-black border border-[#facc15] rounded-xl p-8 shadow-[0_0_30px_rgba(250,204,21,0.1)] text-[#facc15] font-mono">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b border-[#facc15]/30 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{data.entityName}</h2>
          <p className="text-xs text-[#facc15]/60 uppercase tracking-widest">
            DISCOVERY DATE: {data.discoveryDate}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black">{data.confidenceScore}%</div>
          <div className="text-xs text-[#facc15]/60 uppercase">CONFIDENCE</div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#facc15]/10 p-4 rounded border border-[#facc15]/30">
          <h4 className="text-[#facc15]/60 text-xs uppercase mb-1">Velocity</h4>
          <p className="text-xl font-bold">{data.velocity}</p>
        </div>
        <div className="bg-[#facc15]/10 p-4 rounded border border-[#facc15]/30">
          <h4 className="text-[#facc15]/60 text-xs uppercase mb-1">Saturation</h4>
          <p className="text-xl font-bold">{data.saturation}</p>
        </div>
      </div>

      {/* The Gap */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <span className="w-2 h-2 bg-[#facc15] mr-3"></span>
          THE GAP STRATEGY
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-[#facc15]/5 rounded border border-[#facc15]/20">
            <h4 className="text-[#facc15] font-bold mb-1 uppercase text-xs">Unmet Need</h4>
            <p className="text-white text-sm leading-relaxed">{data.unmetNeed}</p>
          </div>
          <div className="p-4 bg-[#facc15]/5 rounded border border-[#facc15]/20 relative">
            <h4 className="text-[#facc15] font-bold mb-1 uppercase text-xs">Positioning Angle</h4>
            <p className={`text-white text-sm leading-relaxed ${isFree ? 'blur-sm opacity-50' : ''}`}>
              {data.positioningAngle}
            </p>
            {isFree && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black border border-[#facc15] px-3 py-1 text-xs text-[#facc15]">LOCKED</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Creative Lab */}
      <div className="mb-8 border border-[#facc15]/30 p-6 rounded relative">
        <h3 className="text-sm font-bold text-[#facc15] uppercase tracking-wider mb-4">
          CREATIVE LAB
        </h3>
        
        {data.creativeLab ? (
          <div className="space-y-4">
            <div>
              <span className="text-xs text-[#facc15]/60 uppercase">Headline</span>
              <p className="text-white text-lg font-bold">{data.creativeLab.headline}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-3 bg-[#facc15]/5 border border-[#facc15]/20 rounded">
                 <span className="text-xs text-[#facc15]/60 uppercase block mb-1">Visual Concept</span>
                 {isArchitectOrHigher && data.creativeLab.generatedVisual ? (
                    <img src={data.creativeLab.generatedVisual} alt="Generated Concept" className="w-full rounded mt-2 border border-[#facc15]/30" />
                 ) : (
                    <p className="text-white text-xs">{data.creativeLab.visualConcept}</p>
                 )}
               </div>
               <div className="p-3 bg-[#facc15]/5 border border-[#facc15]/20 rounded">
                 <span className="text-xs text-[#facc15]/60 uppercase block mb-1">SEO Brief</span>
                 <p className="text-white text-xs">{data.creativeLab.entityBrief}</p>
               </div>
            </div>

            {/* Locked Content for Free/Scout */}
            {!isArchitectOrHigher && (
              <div className="mt-4 p-4 border border-[#facc15]/30 border-dashed rounded text-center">
                <p className="text-xs text-[#facc15]/60 mb-2">ADVANCED ASSETS LOCKED (ARCHITECT+)</p>
                <div className="flex gap-2 justify-center opacity-50">
                  <div className="h-8 w-1/4 bg-[#facc15]/20 rounded"></div>
                  <div className="h-8 w-1/4 bg-[#facc15]/20 rounded"></div>
                </div>
              </div>
            )}
          </div>
        ) : (
           // Fallback for Alpha tier where creativeLab might be null
           <div className="text-center py-8 opacity-50">
             <p className="text-xs">CREATIVE LAB CLASSIFIED</p>
           </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4 border-t border-[#facc15]/30">
        <button 
          onClick={onClaim}
          className="bg-[#facc15] hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded transition shadow-[0_0_15px_rgba(250,204,21,0.5)] flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          CLAIM FTD BADGE
        </button>
      </div>
    </div>
  );
};

export default AgentLog;