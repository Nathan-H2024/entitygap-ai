
import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, Globe, Lock, Activity, TrendingUp } from 'lucide-react';
import DemoSlideshow from './DemoSlideshow';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 font-sans overflow-hidden">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
               <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-brand-purple">EntityGap</span> <span className="text-brand-gold">AI</span>
            </span>
          </div>
          <button 
            onClick={onStart}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2 rounded-full text-sm font-bold transition border border-white/10"
          >
            Agent Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-purple/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-mono text-green-400">GAPSCAN™ ENGINE ONLINE</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-gold">Gap</span> before<br />the market floods.
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The world's first rigorous "Pre-Trend" auditing engine. We don't just find trends; we verify the <strong>Entity Gap</strong>—the specific unmet need in a saturated market.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-brand-gold hover:bg-yellow-400 text-black font-bold rounded-full text-lg shadow-[0_0_20px_rgba(251,191,36,0.4)] transition hover:scale-105 flex items-center"
          >
            Start Free Scan <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <a 
            href="/demo.webm" 
            target="_blank" 
            rel="noreferrer"
            className="px-8 py-4 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white font-bold rounded-full text-lg transition inline-flex items-center justify-center cursor-pointer"
            >
              View Demo
           </a>
        </div>
          <div className="bg-brand-card p-8 rounded-2xl border border-white/5 hover:border-brand-purple/50 transition duration-300 group">
            <div className="w-12 h-12 bg-brand-purple/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <ShieldCheck className="w-6 h-6 text-brand-purple" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Strict Verification</h3>
            <p className="text-slate-400 leading-relaxed">
              Our "Skeptical Scout" AI refuses to hallucinate. If a trend isn't verified by 2+ live data sources, we mark it as a risk.
            </p>
          </div>

          <div className="bg-brand-card p-8 rounded-2xl border border-white/5 hover:border-brand-gold/50 transition duration-300 group">
            <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Activity className="w-6 h-6 text-brand-gold" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Velocity & Saturation</h3>
            <p className="text-slate-400 leading-relaxed">
              Don't enter a dead market. Our Saturation Meter tells you if a niche is a "Blue Ocean" or a "Red Ocean" instantly.
            </p>
          </div>

          <div className="bg-brand-card p-8 rounded-2xl border border-white/5 hover:border-blue-500/50 transition duration-300 group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Niche Pollination</h3>
            <p className="text-slate-400 leading-relaxed">
              If a market is crowded, our engine suggests 5 adjacent "Pollination" gaps where you can pivot and dominate.
            </p>
          </div>

        </div>
      </section>

      {/* Live Data Teaser */}
      <section className="py-20 border-t border-white/5 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-black border border-brand-purple/30 rounded-2xl p-2 md:p-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple via-brand-gold to-brand-purple animate-gradient-x"></div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                   <h2 className="text-3xl font-bold text-white mb-4">Real-Time Intelligence.</h2>
                   <p className="text-slate-400 mb-6">
                     Stop guessing. EntityGap scans search volume, social sentiment, and competition density in seconds.
                   </p>
                   <ul className="space-y-3">
                      <li className="flex items-center text-sm text-slate-300">
                        <Globe className="w-4 h-4 text-brand-purple mr-3" />
                        Global Search Verification
                      </li>
                      <li className="flex items-center text-sm text-slate-300">
                        <Lock className="w-4 h-4 text-brand-gold mr-3" />
                        First-To-Define Claims (NFT-Ready)
                      </li>
                      <li className="flex items-center text-sm text-slate-300">
                        <Zap className="w-4 h-4 text-blue-400 mr-3" />
                        Instant Strategy Generation
                      </li>
                   </ul>
                </div>
                <div className="bg-neutral-900 rounded-xl border border-white/10 p-6 font-mono text-xs text-green-400 shadow-inner">
                   <div className="mb-2 opacity-50 border-b border-white/10 pb-2">TERMINAL OUTPUT &gt;&gt;</div>
                   <div className="space-y-2">
                      <p>&gt; INITIATING SCAN: "Vertical Farming at Home"</p>
                      <p>&gt; CHECKING SOURCES... <span className="text-brand-gold">REDDIT (FOUND)</span>, <span className="text-brand-gold">TIKTOK (FOUND)</span></p>
                      <p>&gt; VELOCITY: <span className="text-white">HIGH (85%)</span></p>
                      <p>&gt; SATURATION: <span className="text-red-500">MEDIUM-HIGH</span></p>
                      <p>&gt; DETECTED GAP: <span className="text-brand-purple">"Modular hydroponics for small apartments without direct sunlight."</span></p>
                      <p className="animate-pulse">_</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} EntityGap AI. All rights reserved.</p>
        <p className="mt-2 opacity-50">Powered by Gemini 1.5 Pro & Flash</p>
      </footer>

      {/* Slideshow Modal */}
      {showDemo && (
        <DemoSlideshow 
          onClose={() => setShowDemo(false)} 
          onStartRealApp={() => {
            setShowDemo(false);
            onStart();
          }}
        />
      )}

    </div>
  );
};

export default LandingPage;
