import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { ShieldCheck, Mail, Lock, Chrome, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onBackToLanding: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBackToLanding }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = isSignUp 
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    // 1. Trigger the popup
    const result = await signInWithPopup(auth, provider);
    
    // 2. If we get a user back, proceed to dashboard
    if (result.user) {
      console.log("Authenticated successfully:", result.user.email);
      onLogin(); 
    }
  } catch (error: any) {
    console.error("Login failed:", error.code, error.message);
    if (error.code === 'auth/popup-blocked') {
      alert("Please enable popups in your browser to sign in with Google.");
    } else {
      alert("Auth Error: " + error.message);
    }
  }
};
  

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Logo and Back Link */}
        <button 
          onClick={onBackToLanding}
          className="flex items-center text-slate-400 hover:text-brand-gold transition mb-8 text-sm group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition" />
          Back to EntityGap
        </button>

        <div className="bg-brand-card border border-white/5 p-10 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <img src="/entitygap-logo.png" alt="Logo" className="h-12 w-auto mb-4" />
            <h2 className="text-3xl font-black text-white tracking-tighter">
              {isSignUp ? 'Join the Network' : 'Agent Access'}
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              {isSignUp ? 'Create your EntityGap account' : 'Verify your credentials to scan'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-purple transition outline-none"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
  <div className="relative">
    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
    <input 
      type={showPassword ? "text" : "password"} 
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white focus:border-brand-purple transition outline-none"
      placeholder="••••••••"
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition focus:outline-none"
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>
</div>

            {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}

            <button 
              type="submit"
              className="w-full py-4 bg-brand-gold hover:bg-yellow-400 text-black font-black rounded-xl transition shadow-[0_0_20px_rgba(251,191,36,0.2)] mt-4"
            >
              {isSignUp ? 'Create Account' : 'Verify & Login'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-brand-card px-3 text-slate-500">Or continue with</span></div>
          </div>

          <button 
  onClick={handleGoogleLogin}
  className="w-full py-3 bg-white text-black font-bold rounded-lg flex items-center justify-center space-x-2 hover:bg-slate-100 transition"
>
            <img src="/google-icon.svg" className="w-5 h-5" alt="Google" />
            <span>Sign in with Google</span>
        </button>

          <p className="text-center mt-8 text-sm text-slate-500">
  {isSignUp ? 'Already have an account?' : "Don't have an access key?"}{' '}
  <button
    type="button"
    onClick={() => setIsSignUp(!isSignUp)} // Switches between Login and Sign-Up state
    className="text-brand-purple font-bold hover:text-brand-gold transition"
  >
    {isSignUp ? 'Login' : 'Sign Up'}
  </button>
</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;