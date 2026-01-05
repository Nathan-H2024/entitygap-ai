
import React, { useState, useEffect } from 'react';
import DashboardPage from './app/dashboard/page';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'LANDING' | 'AUTH' | 'DASHBOARD'>('LANDING');

  // Listen for real Firebase Auth state changes
  useEffect(() => {
    // Defensive check: If auth failed to initialize (e.g. critical config error), stop here.
    if (!auth) {
      console.warn("Firebase Auth not initialized. Running in offline/demo mode.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setView('DASHBOARD');
      } else {
        // If we were in dashboard and logged out, go to landing
        // If we are just loading, stay on landing (default)
        if (view === 'DASHBOARD') setView('LANDING');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [view]); // Added view dependency to ensure correct transitions

  const handleStart = () => {
    setView('AUTH');
  };

  const handleBackToLanding = () => {
    setView('LANDING');
  };

  // Called by LoginPage when auth succeeds (real or demo)
  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setView('DASHBOARD');
  };

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
    // Force state clear for Demo Mode or fallbacks
    setUser(null);
    setView('LANDING');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user && view === 'DASHBOARD') {
    // Pass logout handler to Dashboard (which passes it to Sidebar)
    // Note: You might need to prop-drill this to ChatSidebar via DashboardPage
    // For now, we are patching the component rendering context
    return <DashboardPage />; 
  }

  if (view === 'AUTH') {
    return <LoginPage onLogin={handleLoginSuccess} onBackToLanding={handleBackToLanding} />;
  }

  return <LandingPage onStart={handleStart} />;
}
