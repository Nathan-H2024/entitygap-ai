
import React, { useState } from 'react';
import { UserTier } from '../types';
import { PRICING_TIERS, SUBSCRIPTION_POLICY_TEXT, STRIPE_LINKS } from '../constants';
import { auth } from '../services/firebase'; 
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup 
} from 'firebase/auth';
import { syncUserProfile } from '../services/firestoreService';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onBackToLanding: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBackToLanding }) => {
  // Mode Toggle
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Sign Up Step (1 = Details, 2 = Tier Selection)
  const [signupStep, setSignupStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState<UserTier>(UserTier.SCOUT);

  // Form Fields
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Consents (Sign Up Only)
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToDrive, setAgreedToDrive] = useState(false);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);

  // UI State
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // --- Handlers ---

  const resetForm = () => {
    setError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUserName('');
    setSignupStep(1);
    setAgreedToTerms(false);
    setAgreedToDrive(false);
    setAgreedToDisclaimer(false);
    setLoadingMessage('');
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!userName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address.");
        return;
    }

    setSignupStep(2);
  };

  const handleDemoLogin = () => {
      // Simulate a user object
      const demoUser = {
          uid: 'demo-user-' + Math.random().toString(36).substr(2, 9),
          email: email || 'demo@entitygap.ai',
          displayName: userName || 'Demo Agent',
          emailVerified: true
      };
      
      syncUserProfile(demoUser).then(() => {
          onLogin(demoUser);
      });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setLoadingMessage("Authenticating Credentials...");

    if (!auth) {
        // Offline / Demo Mode
        setTimeout(() => {
            handleDemoLogin();
        }, 800);
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(userCredential.user);
        onLogin(userCredential.user);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/invalid-credential') {
            setError("Invalid email or password.");
        } else {
            setError(err.message || "Login failed.");
        }
        setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation (Step 2)
    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions and Privacy Policy.");
      return;
    }
    if (!agreedToDrive) {
      setError("You must consent to Drive connection to proceed.");
      return;
    }
    if (!agreedToDisclaimer) {
      setError("You must acknowledge the AI and Affiliate Disclaimer.");
      return;
    }

    setLoading(true);
    
    const isPaidTier = selectedTier !== UserTier.DAILY_ALPHA;

    if (!auth) {
         // Offline / Demo Mode
         setTimeout(() => {
            handleDemoLogin();
         }, 800);
         return;
    }

    try {
        if (isPaidTier) {
           setLoadingMessage("Redirecting to Secure Checkout...");
           
           // Create the user first so we have the account
           await createUserWithEmailAndPassword(auth, email, password);
           
           const stripeLink = STRIPE_LINKS[selectedTier];
           if (stripeLink) {
               window.location.href = stripeLink; 
           } else {
               throw new Error("Payment link configuration missing.");
           }

        } else {
           // Free Tier - Immediate
           setLoadingMessage("Creating Profile...");
           const userCredential = await createUserWithEmailAndPassword(auth, email, password);
           await syncUserProfile({ ...userCredential.user, displayName: userName });
           onLogin(userCredential.user);
        }
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
            setError("This email is already registered. Please login.");
        } else {
            setError(err.message || "Registration failed.");
        }
        setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    if (!auth) {
        // Offline / Demo Mode
        setTimeout(() => {
            onLogin({
                uid: 'google-demo-user',
                email: 'google-demo@entitygap.ai',
                displayName: 'Google Demo User',
                photoURL: 'https://via.placeholder.com/150'
            });
        }, 800);
        return;
    }

    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await syncUserProfile(result.user);
        onLogin(result.user);
    } catch (err: any) {
        console.error(err);
        setError("Google authentication failed. Please try again.");
        setLoading(false);
    }
  };

  const isPaidSelection = selectedTier !== UserTier.DAILY_ALPHA;

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark relative overflow-hidden py-10 px-4">
      
      {/* Back Button */}
      <button 
        onClick={onBackToLanding}
        className="absolute top-6 left-6 text-slate-500 hover:text-white flex items-center transition z-20"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      {/* Background Ambience - Electric Purple and Gold */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-brand-purple/30 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-brand-gold/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className={`w-full relative z-10 transition-all duration-500 ${!isLoginMode && signupStep === 2 ? 'max-w-5xl' : 'max-w-md'}`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-gradient text-white font-bold font-mono text-xl shadow-[0_0_20px_rgba(139,92,246,0.6)] mb-4">
            EG
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            <span className="text-brand-purple">EntityGap</span> <span className="text-brand-gold">AI</span>
          </h1>
          <p className="text-slate-400 text-sm">
            {!auth && <span className="text-brand-gold font-bold mr-1">[OFFLINE MODE]</span>}
            {isLoginMode 
              ? 'Sign in to access the GapScan™ Engine' 
              : signupStep === 1 
                ? 'Step 1: Identity Protocol' 
                : 'Step 2: Select Clearance Level'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-brand-card/90 backdrop-blur-2xl border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top Border Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple to-brand-gold"></div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-300 text-xs flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={isLoginMode ? handleLogin : (signupStep === 1 ? handleNextStep : handleSignUp)} className="space-y-4">
            
            {/* --- STEP 1: USER DETAILS (Sign Up & Login) --- */}
            {((!isLoginMode && signupStep === 1) || isLoginMode) && (
              <>
                {/* User Name - Sign Up Only */}
                {!isLoginMode && (
                  <div>
                    <label className="block text-xs font-mono text-brand-purple font-bold uppercase mb-1">User Name</label>
                    <input 
                      type="text" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm"
                      placeholder="Agent Smith"
                      required={!isLoginMode}
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-mono text-neutral-500 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm"
                    placeholder="analyst@entitygap.ai"
                    required
                  />
                </div>
                
                {/* Password */}
                <div>
                  <label className="block text-xs font-mono text-neutral-500 uppercase mb-1">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-white transition-colors"
                    >
                      {/* Icon */}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showPassword ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
                        {!showPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password - Sign Up Only */}
                {!isLoginMode && (
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 uppercase mb-1">Confirm Password</label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm pr-10"
                        placeholder="••••••••"
                        required={!isLoginMode}
                      />
                       <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-white transition-colors"
                      >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           {showConfirmPassword ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
                           {!showConfirmPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                         </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* --- STEP 2: TIER SELECTION (Sign Up Only) --- */}
            {!isLoginMode && signupStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   {PRICING_TIERS.map(tier => (
                     <div 
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={`
                          relative cursor-pointer rounded-xl p-4 border transition-all duration-300
                          ${selectedTier === tier.id 
                            ? `${tier.color} bg-neutral-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-105 z-10 ring-1 ring-white/20` 
                            : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-600 opacity-80 hover:opacity-100'}
                        `}
                     >
                        {tier.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                             Best Value
                          </div>
                        )}
                        <h3 className={`text-sm font-bold mb-1 ${selectedTier === tier.id ? 'text-white' : 'text-slate-300'}`}>{tier.name}</h3>
                        <div className="flex items-baseline mb-3">
                          <span className="text-xl font-bold text-white">{tier.price}</span>
                          <span className="text-xs text-slate-500 ml-1">{tier.period}</span>
                        </div>
                        <ul className="space-y-2 mb-2">
                           {tier.features.map((feat, i) => (
                             <li key={i} className="flex items-start text-[10px] text-slate-400">
                               <span className="mr-1 text-brand-purple">✓</span>
                               {feat}
                             </li>
                           ))}
                        </ul>
                        <div className={`
                           w-4 h-4 rounded-full border border-neutral-600 ml-auto mt-2 flex items-center justify-center
                           ${selectedTier === tier.id ? 'bg-brand-purple border-transparent' : ''}
                        `}>
                           {selectedTier === tier.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                     </div>
                   ))}
                </div>

                {/* Subscription Terms Scrollbox */}
                <div className="bg-black/50 rounded p-3 mt-4 border border-neutral-800">
                   <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Subscription Policy & Auto-Renewal</p>
                   <div className="h-16 overflow-y-auto text-[10px] text-slate-400 leading-relaxed pr-2 custom-scrollbar border-t border-neutral-800 pt-2">
                      {SUBSCRIPTION_POLICY_TEXT}
                   </div>
                </div>

                {/* Terms & Consents */}
                <div className="space-y-3 pt-2 border-t border-neutral-700">
                   {/* Consents Layout */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Terms Agreement */}
                      <div className="flex items-start space-x-3 bg-neutral-900/30 p-2 rounded">
                          <div className="flex items-center h-5">
                              <input id="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-brand-gold focus:ring-brand-gold focus:ring-offset-neutral-900" />
                          </div>
                          <div className="text-xs">
                              <label htmlFor="terms" className="text-slate-400">I agree to the <span className="underline cursor-pointer hover:text-white">Terms</span> & <span className="underline cursor-pointer hover:text-white">Privacy</span>.</label>
                          </div>
                      </div>

                      {/* Drive Consent */}
                      <div className="flex items-start space-x-3 bg-neutral-900/30 p-2 rounded">
                          <div className="flex items-center h-5">
                              <input id="drive" type="checkbox" checked={agreedToDrive} onChange={(e) => setAgreedToDrive(e.target.checked)} className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-brand-purple focus:ring-brand-purple focus:ring-offset-neutral-900" />
                          </div>
                          <div className="text-xs">
                              <label htmlFor="drive" className="text-slate-400">Connect to <span className="text-brand-purple">Google Drive</span>.</label>
                          </div>
                      </div>

                      {/* Disclaimer Consent */}
                      <div className="flex items-start space-x-3 bg-neutral-900/30 p-2 rounded md:col-span-2">
                          <div className="flex items-center h-5">
                              <input id="disclaimer" type="checkbox" checked={agreedToDisclaimer} onChange={(e) => setAgreedToDisclaimer(e.target.checked)} className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-brand-accent focus:ring-brand-accent focus:ring-offset-neutral-900" />
                          </div>
                          <div className="text-xs">
                              <label htmlFor="disclaimer" className="text-slate-400">I acknowledge the <strong>AI & Affiliate Disclosure</strong>.</label>
                          </div>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center space-x-4">
                   <button 
                     type="button" 
                     onClick={() => setSignupStep(1)}
                     className="px-6 py-3 rounded-lg border border-neutral-700 text-slate-400 hover:text-white hover:bg-neutral-800 transition"
                   >
                     Back
                   </button>
                   <button 
                      type="submit" 
                      disabled={loading}
                      className={`flex-1 font-bold py-3 rounded-lg transition-all transform shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center justify-center
                        ${loading ? 'bg-neutral-700 text-slate-500 cursor-not-allowed' : 'bg-brand-gold hover:bg-yellow-400 hover:scale-[1.02] text-black'}`}
                    >
                      {loading ? (loadingMessage || 'Processing...') : (isPaidSelection ? 'Proceed to Stripe Checkout' : 'Create Free Account')}
                      {!loading && isPaidSelection && <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
                    </button>
                </div>
              </div>
            )}

            {/* Login Button (Only in Login Mode) */}
            {isLoginMode && (
               <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full font-bold py-3 rounded-lg transition-all transform shadow-[0_0_15px_rgba(251,191,36,0.3)] 
                    ${loading ? 'bg-neutral-700 text-slate-500 cursor-not-allowed' : 'bg-brand-gold hover:bg-yellow-400 hover:scale-[1.02] text-black'}`}
                >
                  {loading ? (loadingMessage || 'Authenticating...') : 'Secure Login'}
                </button>
            )}

            {/* Step 1 Next Button (Sign Up Only) */}
            {!isLoginMode && signupStep === 1 && (
               <button 
                  type="submit" 
                  className="w-full font-bold py-3 rounded-lg bg-brand-purple hover:bg-violet-500 text-white transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(139,92,246,0.3)]"
               >
                  Next: Select Plan
               </button>
            )}
          </form>

          {/* Login/Sign Up Toggle & Google Auth (Hide in Step 2 for cleanliness) */}
          {signupStep === 1 && (
            <div className="mt-6">
              
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-brand-card text-neutral-500 font-mono">OR</span>
                </div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                className="w-full border border-neutral-600 bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center space-x-2 mb-4"
              >
                 <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                 </svg>
                 <span>{isLoginMode ? 'Sign in with Google' : 'Sign up with Google'}</span>
              </button>

              <div className="text-center">
                <button 
                  onClick={toggleMode}
                  className="text-xs text-brand-gold hover:text-white hover:underline transition-colors font-mono"
                >
                  {isLoginMode 
                    ? "New Operative? Initialize Protocol (Sign Up)" 
                    : "Already an Agent? Secure Login"}
                </button>
              </div>

            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-neutral-500 font-mono">
            SECURE ACCESS: 256-BIT ENCRYPTION ACTIVE
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
