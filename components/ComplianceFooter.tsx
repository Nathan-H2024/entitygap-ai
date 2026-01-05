import React from 'react';
import { DISCLAIMER_TEXT } from '../constants';

const ComplianceFooter: React.FC = () => {
  return (
    <div className="w-full bg-slate-950 border-t border-slate-800 p-4 mt-8">
      <div className="max-w-4xl mx-auto text-xs text-slate-500 text-center font-mono">
        <p className="mb-2">⚠️ DISCLAIMER</p>
        <p>{DISCLAIMER_TEXT}</p>
        <div className="mt-2 flex justify-center space-x-4">
          <span>EntityGap AI © {new Date().getFullYear()}</span>
          <span className="cursor-pointer hover:text-slate-300">Privacy Policy</span>
          <span className="cursor-pointer hover:text-slate-300">Terms of Service</span>
        </div>
      </div>
    </div>
  );
};

export default ComplianceFooter;