import React from 'react';
import { ShieldCheck, Activity, TrendingUp, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLoginClick }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand-purple/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center font-bold">G</div>
          <span className="text-xl font-bold tracking-tighter">EntityGap <span className="text-brand-gold">AI</span></span>
        </div>
        <button 
          onClick={onLoginClick}
          className="px-6 py-2 bg-brand-purple/20 border border-brand-purple/50 rounded-full text-sm font-bold hover:bg-brand-purple/40 transition-all"
        >
          Agent Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto text-center pt-20 px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-green-400 uppercase tracking-widest">GapScan™ Engine Online</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
          Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-gold">Gap</span> before<br />the market floods.
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          The world's first rigorous "Pre-Trend" auditing engine. We don't just find trends; we verify the <strong>Entity Gap</strong>—the specific unmet need in a saturated market.
        </p>

        <button 
          onClick={onStart}
          className="group relative px-12 py-5 bg-brand-gold hover:bg-yellow-400 text-black font-black rounded-full text-lg shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all hover:scale-105 flex items-center gap-2 mx-auto"
        >
          Start First Scan
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 text-left pb-20">
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-brand-purple/50 transition-colors">
            <ShieldCheck className="text-brand-purple w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Strict Verification</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Our AI refuses to hallucinate. If a trend isn't verified by 2+ live data sources, we mark it as a risk.</p>
          </div>
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-brand-gold/50 transition-colors">
            <Activity className="text-brand-gold w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Velocity & Saturation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Don't enter a dead market. Our Saturation Meter tells you if a niche is a "Blue Ocean" instantly.</p>
          </div>
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-blue-500/50 transition-colors">
            <TrendingUp className="text-blue-500 w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Niche Pollination</h3>
            <p className="text-slate-400 text-sm leading-relaxed">If a market is crowded, our engine suggests adjacent "Pollination" gaps where you can pivot.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;