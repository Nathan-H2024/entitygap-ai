import React, { useState } from 'react';
import { UserTier } from '../types';
import { PRICING_TIERS } from '../constants';

interface SubscriptionModalProps {
  currentTier: UserTier;
  isOpen: boolean;
  onClose: () => void;
  onConfirmChange: (newTier: UserTier) => void;
  onCancelSubscription: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ currentTier, isOpen, onClose, onConfirmChange, onCancelSubscription }) => {
  const [selectedTier, setSelectedTier] = useState<UserTier>(currentTier);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen) return null;

  const currentTierObj = PRICING_TIERS.find(t => t.id === currentTier);
  const selectedTierObj = PRICING_TIERS.find(t => t.id === selectedTier);

  const isDowngrade = (selectedTierObj?.rank || 0) < (currentTierObj?.rank || 0);
  const isChange = selectedTier !== currentTier;

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate API processing time
    setTimeout(() => {
        onConfirmChange(selectedTier);
        setIsProcessing(false);
        onClose();
    }, 1500);
  };

  const handleCancellation = () => {
      setIsProcessing(true);
      setTimeout(() => {
          onCancelSubscription();
          setIsProcessing(false);
          onClose();
      }, 1500);
  };

  if (showCancelConfirm) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-slate-900 border border-red-900/50 rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="text-center mb-6">
                    <div className="mx-auto w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Cancel Subscription?</h3>
                    <p className="text-sm text-slate-400">
                        Your features will remain active until <span className="text-brand-gold font-bold">11:59 PM on the last day of this month</span>. 
                        After that, you will be downgraded to the free tier.
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-2 rounded bg-slate-800 text-white hover:bg-slate-700 transition">Go Back</button>
                    <button 
                        onClick={handleCancellation}
                        className="flex-1 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition font-bold"
                    >
                        {isProcessing ? 'Processing...' : 'Confirm Cancellation'}
                    </button>
                </div>
            </div>
        </div>
      )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
             <h2 className="text-2xl font-bold text-white tracking-tight">Manage Subscription</h2>
             <p className="text-slate-400 text-sm">Select a plan to upgrade or downgrade your clearance level.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white transition p-2 hover:bg-slate-800 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tiers Grid */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PRICING_TIERS.map(tier => {
                    const isActive = currentTier === tier.id;
                    const isSelected = selectedTier === tier.id;

                    return (
                        <div 
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={`
                            relative cursor-pointer rounded-xl p-4 border transition-all duration-300 flex flex-col
                            ${isSelected 
                            ? `${tier.color} bg-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] transform scale-[1.02] z-10 ring-1 ring-white/20` 
                            : 'border-slate-800 bg-slate-900/50 hover:border-slate-600 opacity-80 hover:opacity-100'}
                        `}
                        >
                        {isActive && (
                             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                Current Plan
                             </div>
                        )}
                        <h3 className={`text-sm font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'} mt-2`}>{tier.name}</h3>
                        <div className="flex items-baseline mb-3">
                            <span className="text-xl font-bold text-white">{tier.price}</span>
                            <span className="text-xs text-slate-500 ml-1">{tier.period}</span>
                        </div>
                        <ul className="space-y-2 mb-4 flex-1">
                            {tier.features.map((feat, i) => (
                                <li key={i} className="flex items-start text-[10px] text-slate-400">
                                <span className="mr-1 text-brand-purple">✓</span>
                                {feat}
                                </li>
                            ))}
                        </ul>
                        
                        <div className={`
                            mt-auto w-full py-2 rounded text-xs font-bold text-center transition
                            ${isActive ? 'bg-slate-700 text-slate-400 cursor-default' : 
                              isSelected ? 'bg-brand-purple text-white' : 'bg-slate-800 text-slate-500'}
                        `}>
                            {isActive ? 'Active' : isSelected ? 'Selected' : 'Select'}
                        </div>
                        </div>
                    );
                })}
           </div>
        </div>

        {/* Footer / Disclaimer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/50">
           
           {isChange && (
               <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-lg p-4 mb-6 flex items-start space-x-3">
                   <svg className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <div>
                       <h4 className="text-sm font-bold text-brand-gold mb-1">Subscription Change Notice</h4>
                       <p className="text-xs text-slate-300 leading-relaxed">
                           In the event of a subscription downgrade, the revised subscription cost and features will be immediately applied and charged at the time the change is made. If upgrading, the new features are unlocked instantly.
                       </p>
                   </div>
               </div>
           )}

           <div className="flex items-center justify-between">
               {/* Cancel Link */}
               <div>
                 {currentTier !== UserTier.DAILY_ALPHA && (
                     <button onClick={() => setShowCancelConfirm(true)} className="text-xs text-red-500 hover:text-red-400 underline decoration-dotted">
                        Cancel Subscription
                     </button>
                 )}
               </div>

               <div className="flex items-center space-x-4">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
                    >
                        Close
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={!isChange || isProcessing}
                        className={`
                            px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center
                            ${!isChange 
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                : isDowngrade 
                                    ? 'bg-red-900/50 text-red-200 border border-red-800 hover:bg-red-900 hover:text-white'
                                    : 'bg-brand-purple hover:bg-purple-600 text-white shadow-lg shadow-purple-900/20'}
                        `}
                    >
                        {isProcessing ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Updating Plan...
                            </span>
                        ) : (
                            isDowngrade ? 'Confirm Downgrade' : 'Confirm Upgrade'
                        )}
                    </button>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;