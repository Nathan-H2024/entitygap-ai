import React from 'react';

// Mock data to simulate the Firestore 'users' collection for the UI
const MOCK_USERS = [
  { id: '1', email: 'wanderlustwhisperz1@gmail.com', role: 'ADMIN', agreedAt: '2024-05-15T08:30:00Z', status: 'Online', lastAction: 'Viewing Admin Console', tier: 'AUTHORITY' },
  { id: '2', email: 'sarah.analyst@gmail.com', role: 'USER', agreedAt: '2024-05-16T10:15:00Z', status: 'Active', lastAction: 'Scouting: Vertical Farming', tier: 'ARCHITECT' },
  { id: '3', email: 'crypto.dad@yahoo.com', role: 'USER', agreedAt: '2024-05-16T14:22:00Z', status: 'Idle', lastAction: 'Claimed: DeFi Insurance', tier: 'SCOUT' },
  { id: '4', email: 'biohacker.pro@protonmail.com', role: 'USER', agreedAt: '2024-05-17T09:45:00Z', status: 'Active', lastAction: 'Analyzing: Vagus Nerve', tier: 'AUTHORITY' },
  { id: '5', email: 'new.user@gmail.com', role: 'USER', agreedAt: '2024-05-18T11:00:00Z', status: 'Offline', lastAction: 'Login', tier: 'DAILY_ALPHA' },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Admin Command Console</h1>
           <p className="text-slate-400">System Overview & User Compliance Tracking</p>
        </div>
        <div className="flex space-x-2">
           <span className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-800 rounded text-xs font-mono flex items-center">
             <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
             SYSTEM HEALTHY
           </span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-400 text-xs font-mono uppercase mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-white">1,248</p>
            <p className="text-xs text-green-400 mt-1">↑ 12% this week</p>
         </div>
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-400 text-xs font-mono uppercase mb-2">Active Sessions</h3>
            <p className="text-3xl font-bold text-brand-purple">42</p>
            <p className="text-xs text-slate-500 mt-1">Right now</p>
         </div>
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-400 text-xs font-mono uppercase mb-2">Avg. Session Time</h3>
            <p className="text-3xl font-bold text-brand-gold">14m 20s</p>
            <p className="text-xs text-slate-500 mt-1">High Engagement</p>
         </div>
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-400 text-xs font-mono uppercase mb-2">Total Entities Claimed</h3>
            <p className="text-3xl font-bold text-blue-400">892</p>
            <p className="text-xs text-slate-500 mt-1">Lifetime</p>
         </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
         <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">User Registry & Compliance</h3>
            <div className="flex space-x-2">
               <input type="text" placeholder="Search email..." className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-xs text-white focus:outline-none focus:border-brand-purple" />
               <button className="bg-brand-purple hover:bg-purple-600 text-white text-xs px-3 py-1 rounded">Export CSV</button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-950 text-slate-400 text-xs font-mono uppercase">
                  <tr>
                     <th className="px-6 py-4">User Identity</th>
                     <th className="px-6 py-4">Tier</th>
                     <th className="px-6 py-4">Terms Agreed At (UTC)</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Live Snapshot</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800 text-sm">
                  {MOCK_USERS.map((u) => (
                     <tr key={u.id} className="hover:bg-slate-800/50 transition">
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-white font-medium">{u.email}</span>
                              <span className="text-[10px] text-slate-500">{u.role}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`text-xs px-2 py-1 rounded border ${u.tier === 'AUTHORITY' ? 'border-red-900 text-red-400 bg-red-900/10' : 'border-slate-700 text-slate-400 bg-slate-800'}`}>
                              {u.tier}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="font-mono text-brand-gold text-xs">{new Date(u.agreedAt).toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${u.status === 'Online' || u.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                              <span className="text-slate-300">{u.status}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-slate-400 italic text-xs">{u.lastAction}</span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;