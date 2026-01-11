
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

// [INSTRUCTION]: Replace the placeholder URLs below with the actual links to your screenshots.
const SLIDES = [
  {
    id: 1,
    url: "https://via.placeholder.com/1600x900/0a0a0a/8b5cf6?text=1_Landing_Page", 
    title: "The Portal",
    description: "The journey begins. EntityGap AI is the world's first 'Pre-Trend' auditing engine."
  },
  {
    id: 2,
    url: "https://via.placeholder.com/1600x900/0a0a0a/fbbf24?text=2_Login_Screen", 
    title: "Secure Access",
    description: "Agents login via secure 256-bit encryption protocols to access the GapScan™ Engine."
  },
  {
    id: 3,
    url: "https://via.placeholder.com/1600x900/0a0a0a/38bdf8?text=3_Dashboard_Init", 
    title: "The Command Center",
    description: "A clean, high-velocity interface ready for target acquisition."
  },
  {
    id: 4,
    url: "https://via.placeholder.com/1600x900/0a0a0a/ef4444?text=4_Live_Scanning", 
    title: "Real-Time Verification",
    description: "The engine triangulates data across Reddit, TikTok, and Search to prevent hallucinations."
  },
  {
    id: 5,
    url: "https://via.placeholder.com/1600x900/0a0a0a/22c55e?text=5_Gap_Identified", 
    title: "Gap Identified",
    description: "Target acquired: 'AI + Affiliate Marketing'. High Authority Score confirmed."
  },
  {
    id: 6,
    url: "https://via.placeholder.com/1600x900/0a0a0a/a855f7?text=6_Creative_Strategy", 
    title: "Instant Strategy",
    description: "The Creative Lab automatically generates headlines, visual concepts, and SEO briefs."
  },
  {
    id: 7,
    url: "https://via.placeholder.com/1600x900/0a0a0a/f97316?text=7_Enterprise_Features", 
    title: "Deep Architecture",
    description: "Advanced tiers unlock Sentiment Analysis, Gap Heatmaps, and PR Engine tools."
  },
  {
    id: 8,
    url: "https://via.placeholder.com/1600x900/0a0a0a/64748b?text=8_Claim_Gap", 
    title: "Ownership",
    description: "Claim the 'First-to-Define' badge and secure your position in the market."
  }
];

interface DemoSlideshowProps {
  onClose: () => void;
  onStartRealApp: () => void;
}

const DemoSlideshow: React.FC<DemoSlideshowProps> = ({ onClose, onStartRealApp }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-slate-400 hover:text-white transition p-2 bg-neutral-900 rounded-full border border-neutral-800 hover:border-neutral-600 z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <div className="w-full max-w-6xl relative flex flex-col items-center">
        
        {/* Navigation - Left */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-brand-gold transition hover:scale-110 z-10"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>

        {/* Slide Display */}
        <div className="relative w-full aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-white/10 shadow-2xl">
          <img 
            src={SLIDES[currentIndex].url} 
            alt={SLIDES[currentIndex].title}
            className="w-full h-full object-contain bg-black"
          />
          
          {/* Caption Overlay */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-8 pt-20">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
              <span className="text-brand-purple mr-2">{currentIndex + 1}/{SLIDES.length}</span> 
              {SLIDES[currentIndex].title}
            </h3>
            <p className="text-slate-300 max-w-2xl">{SLIDES[currentIndex].description}</p>
          </div>
        </div>

        {/* Navigation - Right */}
        <button 
          onClick={nextSlide}
          className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-brand-gold transition hover:scale-110 z-10"
        >
          <ChevronRight className="w-10 h-10" />
        </button>

        {/* Bottom Actions */}
        <div className="mt-8 flex items-center space-x-4">
          <div className="flex space-x-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-brand-gold w-6' : 'bg-neutral-700 hover:bg-neutral-500'}`}
              />
            ))}
          </div>
          
          <div className="h-6 w-px bg-neutral-800 mx-4"></div>

          <button 
            onClick={onStartRealApp}
            className="px-6 py-2 bg-brand-purple hover:bg-violet-500 text-white text-sm font-bold rounded-full transition shadow-[0_0_15px_rgba(139,92,246,0.4)] flex items-center"
          >
            <Zap className="w-4 h-4 mr-2" />
            Launch Live Scan
          </button>
        </div>

      </div>
    </div>
  );
};

export default DemoSlideshow;
