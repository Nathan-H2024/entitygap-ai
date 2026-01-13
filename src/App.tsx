import React, { useState } from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import OnboardingPage from './OnboardingPage';
import Dashboard from './app/Dashboard'; // Adjust path if needed
import { auth } from './services/firebase';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'onboarding' | 'dashboard'>('landing');

  // Handle Auth State
  const [user, setUser] = useState(auth.currentUser);
  auth.onAuthStateChanged((u) => setUser(u));

  if (user && currentPage !== 'dashboard') {
    return <Dashboard />;
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
        <OnboardingPage onBack={() => setCurrentPage('landing')} />
      )}
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={() => setCurrentPage('dashboard')} 
          onBackToLanding={() => setCurrentPage('landing')} 
        />
      )}
      {currentPage === 'dashboard' && <Dashboard />}
    </>
  );
};

export default App;