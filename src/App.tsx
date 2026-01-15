import React, { useState } from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import OnboardingPage from './OnboardingPage';
import DashboardPage from '../app/dashboard/page'; // Up and into root/app
import { auth } from './services/firebase';      // Up and into root/services
import { doc, setDoc } from 'firebase/firestore';
import { db } from './services/firebase';        // Up and into root/services

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'onboarding' | 'dashboard'>('landing');
  const [user, setUser] = useState(auth.currentUser);

  auth.onAuthStateChanged((u) => setUser(u));

  const handleFreeSignup = async () => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid), {
        subscriptionTier: 'FREE',
        setupComplete: true
      }, { merge: true });
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('login');
    }
  };

  // Automated Skip for Logged-In Users
  if (user && currentPage === 'landing') {
    setCurrentPage('dashboard');
  }

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage 
          onStart={() => setCurrentPage('onboarding')} 
          onLoginClick={() => setCurrentPage('login')} 
        />
      )}
      {currentPage === 'onboarding' && (
        <OnboardingPage 
          onBack={() => setCurrentPage('landing')} 
          onSelectFree={handleFreeSignup} 
        />
      )}
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={() => setCurrentPage('dashboard')} 
          onBackToLanding={() => setCurrentPage('landing')} 
        />
      )}
      {currentPage === 'dashboard' && <DashboardPage />}
    </>
  );
};

export default App;