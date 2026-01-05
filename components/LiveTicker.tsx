import React from 'react';

const MOCK_CLAIMS = [
  { user: 'BioHackerX', niche: 'Vagus Nerve Stimulation', time: '2m ago' },
  { user: 'SarahSEO', niche: 'Micro-SaaS for Seniors', time: '5m ago' },
  { user: 'CryptoDad', niche: 'DeFi Insurance', time: '12m ago' },
  { user: 'NomadLife', niche: 'Digital Detox Resorts', time: '24m ago' },
];

const LiveTicker: React.FC = () => {
  return (
    <div className="mt-8 border-t border-slate-800 pt-6">
      <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest mb-4 flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
        Live Claims
      </h3>
      <div className="space-y-3 max-h-48 overflow-hidden relative">
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
        {MOCK_CLAIMS.map((claim, idx) => (
          <div key={idx} className="flex flex-col bg-slate-800/50 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-300">@{claim.user}</span>
              <span className="text-[10px] text-slate-500">{claim.time}</span>
            </div>
            <span className="text-xs text-brand-purple truncate">Defined: {claim.niche}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTicker;