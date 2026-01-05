"use client";

import React, { useEffect, useRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EntityGapAnalysis, UserTier } from '../../types';

// --- 1. UTILITY & TYPES ---

// Helper for conditional classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error' | 'thinking';
  title: string;
  content?: string;
}

interface AgentLogProps {
  logEntries: LogEntry[];
}

// --- 2. SUB-COMPONENT: The Log Card (Inlined for simplicity) ---

const LogEntryCard: React.FC<{ entry: LogEntry }> = ({ entry }) => {
  // Color mapping based on log type
  const typeColors = {
    info: "border-blue-500/30 bg-blue-500/10 text-blue-200",
    success: "border-green-500/30 bg-green-500/10 text-green-200",
    warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
    error: "border-red-500/30 bg-red-500/10 text-red-200",
    thinking: "border-purple-500/30 bg-purple-500/10 text-purple-200 animate-pulse",
  };

  const styleClass = typeColors[entry.type] || typeColors.info;

  return (
    <div className={cn("mb-3 p-3 rounded-md border text-sm font-mono", styleClass)}>
      <div className="flex justify-between items-start opacity-70 text-xs mb-1">
        <span className="uppercase tracking-wider font-bold">{entry.type}</span>
        <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
      </div>
      <div className="font-semibold">{entry.title}</div>
      {entry.content && (
        <div className="mt-2 text-xs opacity-90 whitespace-pre-wrap pl-2 border-l-2 border-white/20">
          {entry.content}
        </div>
      )}
    </div>
  );
};

// --- 3. MAIN COMPONENT: AgentLog ---

const AgentLog: React.FC<AgentLogProps> = ({ logEntries }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logEntries]);

  if (!logEntries || logEntries.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg h-96 flex flex-col items-center justify-center text-neutral-500 font-mono text-sm">
        <div className="mb-2">system_idle...</div>
        <div>Waiting for agent execution</div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-lg shadow-inner h-96 overflow-y-auto font-sans">
      <div className="flex flex-col">
        {logEntries.map((entry) => (
          <LogEntryCard key={entry.id} entry={entry} />
        ))}
        {/* Invisible element to scroll to */}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default AgentLog;