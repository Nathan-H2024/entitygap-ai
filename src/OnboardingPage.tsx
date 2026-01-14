import React, { useState } from 'react';
import { ArrowLeft, Info, Zap } from 'lucide-react';

interface OnboardingPageProps {
  onBack: () => void;
  onSelectFree: () => void; // New prop to handle free signup
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onBack, onSelectFree }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Landing
        </button>

        <h2 className="text-4xl font-black mb-8 tracking-tighter text-center">Select Your Operational Tier</h2>

        {/* The Daily Alpha (Free) Card */}
        <div className={`mb-12 p-8 rounded-3xl border transition-all ${agreed ? 'bg-white/5 border-white/10 hover:border-brand-purple/50' : 'bg-white/5 border-white/5 opacity-50 pointer-events-none'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white">Daily Alpha</h3>
              <p className="text-slate-400 text-sm">Trial the engine with core data.</p>
            </div>
            <span className="px-3 py-1 bg-brand-purple/20 text-brand-purple text-xs font-bold rounded-full uppercase">Free Entry</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="text-sm text-slate-300 flex items-center gap-2">✓ 5 Basic Scans Per Day</li>
            <li className="text-sm text-slate-300 flex items-center gap-2">✓ Trend Identification</li>
            <li className="text-sm text-slate-300 flex items-center gap-2">✓ Community Data Feed</li>
          </ul>
          <button 
            onClick={onSelectFree}
            className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
          >
            Start with Daily Alpha
          </button>
        </div>

        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-xs uppercase font-bold text-slate-600 bg-[#0a0a0a] px-4">OR UPGRADE FOR FULL POWER</div>
        </div>

        {/* Protocol Agreement & Terms Viewer */}
<div className="mt-8 mb-12 max-w-2xl mx-auto">
  <div className="bg-slate-900/50 border border-slate-800 rounded-t-xl p-4">
    <h3 className="text-white font-bold text-sm mb-2 uppercase tracking-widest">Operational Disclaimers & Terms</h3>
    <div className="h-48 overflow-y-auto text-[11px] leading-relaxed text-slate-400 space-y-4 pr-4 custom-scrollbar bg-black/20 p-3 rounded border border-white/5">
      <p><strong>1. PROPRIETARY DATA NOTICE:</strong> EntityGap AI provides trend analysis derived from proprietary "Gap Identification" protocols. No financial advice is implied.</p>
      <p><strong>2. USAGE LIMITS:</strong> Daily Alpha users are granted 5 basic scans per 24-hour cycle. Any attempt to bypass this via automation or session manipulation results in a permanent UID ban.</p>
      <p><strong>3. DATA ACCURACY:</strong> While the GAPSCAN™ Engine v3.1 utilizes advanced verification gates, users acknowledge that real-time market saturation can occur between scan intervals.</p>
      <p><strong>4. LIABILITY WAIVER:</strong> By engaging the "Start" sequence, the operator accepts full responsibility for all market positioning based on engine outputs.</p>
      {/* Paste your full legal Terms and Conditions text here */}
    </div>
  </div>

  <div className="bg-white/5 border-x border-b border-white/10 rounded-b-xl p-4 flex items-center space-x-3">
    <input 
      type="checkbox" 
      id="terms" 
      checked={agreed}
      onChange={() => setAgreed(!agreed)}
      className="w-5 h-5 rounded border-slate-700 bg-black text-brand-purple focus:ring-brand-purple"
    />
    <label htmlFor="terms" className="text-sm text-slate-300 cursor-pointer select-none">
      I have read and accept the terms and operational disclaimers to unlock all tiers.
    </label>
  </div>
</div>

        {/* Premium Tiers (Stripe) */}
        <div className={agreed ? "opacity-100 transition-opacity" : "opacity-30 pointer-events-none transition-opacity"}>
          <stripe-pricing-table 
            pricing-table-id="prctbl_1SovtlDFnQqtDdboAJl5fWDf"
            publishable-key="pk_live_51QSfBBDFnQqtDdboD4o6sWj0J1ZpbBHqGZMacOmShhjscUTDJdj7GEcEJO2dBJ2159xonmDUdH0hxtOODT7lSapS00i5VMQooP"
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;