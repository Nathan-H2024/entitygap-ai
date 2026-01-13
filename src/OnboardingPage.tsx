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

        {/* Protocol Agreement Checkbox */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 mt-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={agreed} 
              onChange={() => setAgreed(!agreed)}
              className="w-5 h-5 rounded border-white/20 bg-black/40 text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-sm font-medium group-hover:text-white transition-colors">I accept the terms and operational disclaimers to unlock all tiers.</span>
          </label>
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