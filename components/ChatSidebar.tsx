
"use client";

import React from 'react';
import { 
  PlusCircle, MessageSquare, Camera, Mic, 
  ChevronsLeft, ChevronsRight, LogOut, 
  Star, Image as ImageIcon, 
  FileText, Link as LinkIcon, AlertCircle, Zap
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- 1. UTILITIES & TYPES ---

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ChatSession {
  id: string;
  name: string;
  documentsUploadedThisConversation?: number;
}

export enum UserTier {
  FREE = 'Free',
  PREMIUM = 'Premium',
  PRO = 'Pro'
}

const TIER_LIMITS = {
  [UserTier.FREE]: { maxChatSessions: 5, imageGenerationsPerDay: 5, workspaceOutputsPerDay: 2, docUploadsPerConversation: 1, urlOrVideoUploadsPerDay: 2 },
  [UserTier.PREMIUM]: { maxChatSessions: 20, imageGenerationsPerDay: 50, workspaceOutputsPerDay: 20, docUploadsPerConversation: 10, urlOrVideoUploadsPerMonth: 100 },
  [UserTier.PRO]: { maxChatSessions: 100, imageGenerationsPerDay: 200, workspaceOutputsPerDay: 100, docUploadsPerConversation: 50, urlOrVideoUploadsPerMonth: 500 },
};

interface ChatSidebarProps {
  chats: ChatSession[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  isCameraFeatureEnabled: boolean;
  isMicrophoneFeatureEnabled: boolean;
  onToggleCameraFeature: () => void;
  onToggleMicrophoneFeature: () => void;
  isSidebarExpanded: boolean;
  onToggleSidebar: () => void;
  onSignOut?: () => void;
  currentUserTier: UserTier;
  displayTierName?: string;
  imagesGeneratedToday: number;
  workspaceOutputsToday: number;
  urlUploadsToday: number; 
  onReportIssueClick?: () => void; 
  onManageSubscription?: () => void;
}

// --- 2. MAIN COMPONENT ---

const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  chats, 
  activeChatId, 
  onSelectChat, 
  onNewChat,
  isCameraFeatureEnabled,
  isMicrophoneFeatureEnabled,
  onToggleCameraFeature,
  onToggleMicrophoneFeature,
  isSidebarExpanded,
  onToggleSidebar,
  onSignOut,
  currentUserTier,
  displayTierName,
  imagesGeneratedToday,
  workspaceOutputsToday,
  urlUploadsToday, 
  onReportIssueClick,
  onManageSubscription,
}) => {
  
  const currentLimits = TIER_LIMITS[currentUserTier];

  // Colors aligned with EntityGap AI Logo
  const sidebarBaseClasses = "bg-brand-dark border-r border-neutral-800 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out font-sans";
  const expandedClasses = "w-72 p-4"; 
  const collapsedClasses = "w-20 p-2 items-center";

  return (
    <aside className={cn(sidebarBaseClasses, isSidebarExpanded ? expandedClasses : collapsedClasses)}>
      
      {/* HEADER / NEW CHAT */}
      <div className={cn("flex items-center mb-8", isSidebarExpanded ? "justify-between" : "justify-center")}>
        {isSidebarExpanded && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
               <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight leading-none">
              <span className="text-brand-purple">EntityGap</span> <span className="text-brand-gold">AI</span>
            </h2>
          </div>
        )}
        <button
          onClick={onNewChat}
          title="New Scan Session"
          disabled={currentUserTier === UserTier.FREE && chats.length >= (currentLimits.maxChatSessions || 5)}
          className={cn(
            "p-2 bg-brand-gold text-black rounded-lg hover:bg-yellow-400 transition-all shadow-[0_0_10px_rgba(251,191,36,0.3)] disabled:opacity-50 disabled:cursor-not-allowed",
            !isSidebarExpanded && "mx-auto"
          )}
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      {/* CHAT LIST */}
      <div className="mb-2 px-2 text-xs font-bold text-neutral-600 uppercase tracking-wider">
         {isSidebarExpanded ? "Recent Scans" : "---"}
      </div>
      <nav className="flex-grow space-y-1 overflow-y-auto pr-1 custom-scrollbar">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            title={chat.name}
            className={cn(
              "w-full flex items-center p-2.5 text-left rounded-lg text-sm transition-all border",
              !isSidebarExpanded && "justify-center",
              chat.id === activeChatId 
                ? "bg-brand-purple/10 border-brand-purple/50 text-brand-purple shadow-[0_0_10px_rgba(139,92,246,0.1)]" 
                : "border-transparent text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
            )}
          >
            <MessageSquare className={cn("w-4 h-4 flex-shrink-0", isSidebarExpanded ? "mr-3" : "mx-auto")} />
            {isSidebarExpanded && <span className="truncate flex-grow font-medium">{chat.name}</span>}
          </button>
        ))}
      </nav>
      
      {/* STATS PANEL (Only visible when expanded) */}
      {isSidebarExpanded && (
        <div className="mt-auto pt-4 border-t border-neutral-800 space-y-3 text-xs">
          <div className="px-3 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-brand-gold font-mono">
                  <Star className="w-3 h-3 mr-2 fill-brand-gold"/>
                  <span className="font-bold uppercase tracking-wider">{(displayTierName || currentUserTier)} TIER</span>
                </div>
                {onManageSubscription && (
                    <button 
                        onClick={onManageSubscription}
                        className="text-[10px] text-neutral-500 hover:text-white underline decoration-dotted transition-colors"
                    >
                        Manage
                    </button>
                )}
            </div>
            
            <div className="text-neutral-500 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1.5"/> Img Gen</span>
                <span>{imagesGeneratedToday}/{currentLimits.imageGenerationsPerDay}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center"><FileText className="w-3 h-3 mr-1.5"/> Workspace</span>
                <span>{workspaceOutputsToday}/{currentLimits.workspaceOutputsPerDay}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center"><LinkIcon className="w-3 h-3 mr-1.5"/> Analysis</span>
                <span>{urlUploadsToday}/{currentUserTier === UserTier.FREE ? (currentLimits as any).urlOrVideoUploadsPerDay : (currentLimits as any).urlOrVideoUploadsPerMonth}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS / FOOTER */}
      <div className={cn("pt-4 border-t border-neutral-800 space-y-1", !isSidebarExpanded && "flex flex-col items-center")}>
        
        {/* Toggle Switches */}
        <label className={cn("w-full flex items-center p-2 rounded-md cursor-pointer hover:bg-neutral-900 transition-colors", !isSidebarExpanded && "justify-center")}>
          <input type="checkbox" checked={isCameraFeatureEnabled} onChange={onToggleCameraFeature} className="hidden" />
          <Camera className={cn("w-4 h-4", isCameraFeatureEnabled ? "text-brand-purple" : "text-neutral-600")} />
          {isSidebarExpanded && <span className={cn("ml-3 text-sm", isCameraFeatureEnabled ? "text-neutral-200" : "text-neutral-500")}>Vision</span>}
        </label>

        <label className={cn("w-full flex items-center p-2 rounded-md cursor-pointer hover:bg-neutral-900 transition-colors", !isSidebarExpanded && "justify-center")}>
          <input type="checkbox" checked={isMicrophoneFeatureEnabled} onChange={onToggleMicrophoneFeature} className="hidden" />
          <Mic className={cn("w-4 h-4", isMicrophoneFeatureEnabled ? "text-brand-purple" : "text-neutral-600")} />
          {isSidebarExpanded && <span className={cn("ml-3 text-sm", isMicrophoneFeatureEnabled ? "text-neutral-200" : "text-neutral-500")}>Voice</span>}
        </label>

        {/* Action Buttons */}
        {onReportIssueClick && (
            <button onClick={onReportIssueClick} className={cn("w-full p-2 flex items-center text-neutral-500 hover:text-brand-gold hover:bg-neutral-900 rounded-md transition-colors", !isSidebarExpanded && "justify-center")}>
                <AlertCircle className="w-4 h-4" />
                {isSidebarExpanded && <span className="ml-3 text-sm">Report Issue</span>}
            </button>
        )}

        {onSignOut && ( 
             <button onClick={onSignOut} className={cn("w-full p-2 flex items-center text-neutral-500 hover:text-red-400 hover:bg-neutral-900 rounded-md transition-colors", !isSidebarExpanded && "justify-center")}>
                <LogOut className="w-4 h-4" />
                {isSidebarExpanded && <span className="ml-3 text-sm">Sign Out</span>}
            </button>
        )}

        <button 
            onClick={onToggleSidebar} 
            className={cn("w-full p-2 mt-2 flex items-center text-neutral-600 hover:text-neutral-300 hover:bg-neutral-900 rounded-md transition-colors", !isSidebarExpanded && "justify-center")}
        >
            {isSidebarExpanded ? <ChevronsLeft className="w-4 h-4" /> : <ChevronsRight className="w-4 h-4" />}
            {isSidebarExpanded && <span className="ml-3 text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
