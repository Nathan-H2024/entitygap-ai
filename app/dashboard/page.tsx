
"use client";

import React, { useState } from 'react';

// --- CORRECTED IMPORTS FOR YOUR FILE TREE ---
import ChatSidebar, { UserTier as SidebarUserTier } from '../../components/ChatSidebar';
import AgentLog, { LogEntry } from '../../components/dashboard/AgentLog';
import EntityCard from '../../components/EntityCard';
import SubscriptionModal from '../../components/SubscriptionModal';
import { analyzeNiche } from '../../services/geminiService'; // Adjusted to point to services folder
import { UserTier, EntityGapAnalysis, ChatSession } from '../../types';

export default function DashboardPage() {
  // --- Sidebar State ---
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeChatId, setActiveChatId] = useState('session-1');
  const [chats, setChats] = useState<ChatSession[]>([
    { id: 'session-1', name: 'Scan Session: Biohacking', documentsUploadedThisConversation: 0 }
  ]);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);

  // --- App State ---
  const [query, setQuery] = useState('');
  const [credits, setCredits] = useState(5);
  const [tier, setTier] = useState<UserTier>(UserTier.SCOUT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EntityGapAnalysis | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // --- Modal State ---
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // --- Mappers ---
  const mapAppTierToChatTier = (appTier: UserTier): SidebarUserTier => {
    switch(appTier) {
      case UserTier.DAILY_ALPHA: return SidebarUserTier.FREE;
      case UserTier.SCOUT: return SidebarUserTier.PREMIUM;
      case UserTier.ARCHITECT: 
      case UserTier.AUTHORITY: return SidebarUserTier.PRO;
      default: return SidebarUserTier.FREE;
    }
  };

  const addLog = (title: string, content?: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        title,
        content,
        type
      }
    ]);
  };

  // --- Handlers ---
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (credits <= 0) {
      addLog('Action Blocked', 'Insufficient credits.', 'error');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setLogs([]); 
    
    addLog('Initialization', 'GapScan Engine spinning up...', 'info');
    setTimeout(() => addLog('Gate 1 Check', `Analyzing niche "${query}" against safety protocols.`, 'thinking'), 500);

    try {
      const result = await analyzeNiche(query, tier);
      
      if (result.safetyViolation) {
        addLog('Integrity Protocol', 'Query blocked by Safety Gate.', 'error');
      } else if (result.isHallucinationRisk) {
        addLog('Verification Warning', 'Cross-reference failed. Hallucination risk.', 'warning');
      } else {
        addLog('Success', `Gap identified: ${result.entityName}`, 'success');
        addLog('Strategy Generated', result.positioningAngle, 'info');
      }

      setAnalysisResult(result);
      setCredits(prev => prev - 1);
    } catch (err: any) {
      addLog('System Error', err.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    setChats(prev => [...prev, { id: newId, name: 'New Scan Session', documentsUploadedThisConversation: 0 }]);
    setActiveChatId(newId);
    setLogs([]);
    setAnalysisResult(null);
    setQuery('');
  };

  const handleManageSubscription = () => {
    setIsSubscriptionModalOpen(true);
  };

  const handleConfirmSubscriptionChange = (newTier: UserTier) => {
    setTier(newTier);
    setIsSubscriptionModalOpen(false);
    addLog('Subscription Update', `Clearance level updated to: ${newTier}`, 'success');
  };

  const handleCancelSubscription = () => {
    setTier(UserTier.DAILY_ALPHA);
    setIsSubscriptionModalOpen(false);
    addLog('Subscription Update', 'Plan cancelled. Reverted to Daily Alpha protocol.', 'warning');
  };

  return (
    <div className="flex h-screen w-full bg-brand-dark text-slate-200 overflow-hidden font-sans">
      
      <ChatSidebar 
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        isCameraFeatureEnabled={isCameraEnabled}
        onToggleCameraFeature={() => setIsCameraEnabled(!isCameraEnabled)}
        isMicrophoneFeatureEnabled={isMicEnabled}
        onToggleMicrophoneFeature={() => setIsMicEnabled(!isMicEnabled)}
        isSidebarExpanded={isSidebarExpanded}
        onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        onSignOut={() => window.location.href = "/"}
        currentUserTier={mapAppTierToChatTier(tier)}
        displayTierName={tier}
        imagesGeneratedToday={0}
        workspaceOutputsToday={0}
        urlUploadsToday={5 - credits}
        onManageSubscription={handleManageSubscription}
      />

      <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-neutral-950">
        <header className="h-16 border-b border-brand-purple/20 flex items-center justify-between px-8 bg-black/50 backdrop-blur sticky top-0 z-10">
           <h2 className="text-sm font-mono tracking-widest text-brand-purple">GAPSCAN™ ENGINE <span className="text-white text-xs ml-2">v3.1</span></h2>
           <div className="flex items-center space-x-4">
              <span className="text-xs text-brand-gold font-bold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
                CREDITS: {credits}
              </span>
           </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-8">
           <div className="text-center mt-10">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">
                FIND THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-gold pr-1">GAP.</span>
              </h1>
              <p className="text-slate-400 max-w-lg mx-auto mb-8">
                Identify emerging trends before they saturate using our strict verification engine.
              </p>
              
              <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto relative group">
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-purple to-brand-gold rounded-full opacity-30 group-hover:opacity-75 transition duration-500 blur"></div>
                 <div className="relative">
                    <input 
                      type="text" 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter a niche (e.g., 'Biohacking Sleep')"
                      className="block w-full pl-6 pr-36 py-4 bg-brand-card border border-neutral-800 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition shadow-2xl"
                    />
                    <button 
                      type="submit" 
                      disabled={isAnalyzing || !query}
                      className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-brand-gold to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black px-8 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isAnalyzing ? 'SCANNING...' : 'SCAN'}
                    </button>
                 </div>
              </form>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
              <div className="lg:col-span-1">
                 <h3 className="text-xs font-bold text-brand-gold mb-3 uppercase tracking-wider flex items-center">
                    <span className="w-2 h-2 bg-brand-gold rounded-full mr-2 animate-pulse"></span>
                    Live Operation Log
                 </h3>
                 <AgentLog logEntries={logs} />
              </div>

              <div className="lg:col-span-2">
                 <h3 className="text-xs font-bold text-brand-purple mb-3 uppercase tracking-wider flex items-center">
                    <span className="w-2 h-2 bg-brand-purple rounded-full mr-2"></span>
                    Target Analysis
                 </h3>
                 {analysisResult ? (
                    <EntityCard 
                       data={analysisResult}
                       onClaim={() => alert("Claimed!")}
                       isClaimed={false} 
                       userTier={tier}
                       onOpenSubscriptionModal={handleManageSubscription}
                    />
                 ) : (
                    <div className="h-96 border border-brand-purple/20 border-dashed rounded-xl bg-brand-purple/5 flex flex-col items-center justify-center text-brand-purple/50">
                       <span className="font-mono text-sm">Awaiting Target Selection</span>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Subscription Modal */}
        <SubscriptionModal 
            isOpen={isSubscriptionModalOpen}
            currentTier={tier}
            onClose={() => setIsSubscriptionModalOpen(false)}
            onConfirmChange={handleConfirmSubscriptionChange}
            onCancelSubscription={handleCancelSubscription}
        />
      </main>
    </div>
  );
}
