import React, { useState } from 'react';
import { ArrowLeft, Info, CheckCircle2 } from 'lucide-react';

interface OnboardingPageProps {
  onBack: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onBack }) => {
  const [agreed, setAgreed] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Landing
        </button>

        <h2 className="text-4xl font-black mb-4 tracking-tighter">Initialize Your Credentials</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          To access the GapScan™ Engine, you must select an operational tier and agree to the data auditing protocols.
        </p>

        {/* Disclaimers */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
          <h3 className="text-sm font-bold uppercase text-slate-500 mb-4 tracking-widest">Protocol Agreement</h3>
          <div className="space-y-4 text-sm text-slate-400">
            <p>1. I understand that AI analysis is probabilistic and should be cross-referenced.</p>
            <p>2. I agree to the privacy policy regarding the storage of scan histories.</p>
          </div>
          <label className="flex items-center gap-3 mt-6 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={agreed} 
              onChange={() => setAgreed(!agreed)}
              className="w-5 h-5 rounded border-white/20 bg-black/40 text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-sm font-medium group-hover:text-white transition-colors">I accept the terms and operational disclaimers.</span>
          </label>
        </div>

        {/* Feature Pop-up Trigger */}
        <button 
          onClick={() => setShowFeatures(true)}
          className="flex items-center gap-2 text-brand-gold text-sm font-bold mb-8 hover:underline"
        >
          <Info className="w-4 h-4" /> View Detailed Tier Comparisons
        </button>

        {/* Stripe Pricing Table - Only active if agreed */}
        <div className={agreed ? "opacity-100 transition-opacity" : "opacity-30 pointer-events-none transition-opacity"}>
          <stripe-pricing-table 
            pricing-table-id="prctbl_1SovtlDFnQqtDdboAJl5fWDf"
            publishable-key="pk_live_51QSfBBDFnQqtDdboD4o6sWj0J1ZpbBHqGZMacOmShhjscUTDJdj7GEcEJO2dBJ2159xonmDUdH0hxtOODT7lSapS00i5VMQooP"
          />
        </div>

        {/* Feature Modal */}
        {showFeatures && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-2xl w-full shadow-2xl relative">
              <button onClick={() => setShowFeatures(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>
              <h3 className="text-2xl font-bold mb-6">Tier Capabilities</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-brand-purple font-bold">Scout</h4>
                  <p className="text-xs text-slate-500">Trend Identification, Basic Saturation Checks.</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-brand-gold font-bold">Architect</h4>
                  <p className="text-xs text-slate-500">Niche Pollination, Velocity Tracking, 100 Monthly Scans.</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-blue-500 font-bold">Authority</h4>
                  <p className="text-xs text-slate-500">Unlimited Scans, Priority AI Engine, Full Strategic Blueprints.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;