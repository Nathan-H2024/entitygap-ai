"use client";

import React, { useState, useEffect } from 'react';
import LandingPage from '../LandingPage';
import LoginPage from '../LoginPage';
import OnboardingPage from '../OnboardingPage';
import DashboardPage from './dashboard/page'; 
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'onboarding' | 'dashboard'>('landing');
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Auto-skip to dashboard if already logged in
      if (u && currentPage === 'landing') {
        setCurrentPage('dashboard');
      }
    });
    return () => unsubscribe();
  }, [currentPage]);

  return (
    <main>
      {currentPage === 'landing' && (
        <LandingPage 
          onStart={() => setCurrentPage('onboarding')} 
          onLoginClick={() => setCurrentPage('login')} 
        />
      )}
      {currentPage === 'onboarding' && (
        <OnboardingPage 
          onBack={() => setCurrentPage('landing')} 
          onSelectFree={() => setCurrentPage('dashboard')} 
        />
      )}
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={() => setCurrentPage('dashboard')} 
          onBackToLanding={() => setCurrentPage('landing')} 
        />
      )}
      {currentPage === 'dashboard' && <DashboardPage />}
    </main>
  );
}