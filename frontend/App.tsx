
import React, { useState, useEffect } from 'react';
import { ASSIGNMENTS } from './constants';
import AssignmentList from './components/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import ProfileView from './components/ProfileView';
import { UserStats } from './types';

type ViewState = 'landing' | 'auth_login' | 'auth_signup' | 'dashboard' | 'attempt' | 'profile';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);

  const [stats, setStats] = useState<UserStats>({
    solvedCount: 34,
    xp: 28450,
    rank: 'SQL Architect',
    streak: 12,
    history: Array.from({ length: 120 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      count: i % 7 === 0 ? 0 : Math.floor(Math.random() * 8)
    })),
    progress: 68
  });

  const selectedIndex = ASSIGNMENTS.findIndex(a => a.id === selectedAssignmentId);
  const selectedAssignment = selectedIndex !== -1 ? ASSIGNMENTS[selectedIndex] : null;

  const handleLoginSuccess = (name: string, email: string) => {
    setUser({ name, email, role: 'Pro Member' });
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
    setSelectedAssignmentId(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleUpdateUser = (name: string, email: string) => {
    setUser(prev => prev ? { ...prev, name, email } : null);
  };

  const handleNextAssignment = () => {
    if (selectedIndex !== -1 && selectedIndex < ASSIGNMENTS.length - 1) {
      setSelectedAssignmentId(ASSIGNMENTS[selectedIndex + 1].id);
    } else {
      setSelectedAssignmentId(null);
      setView('dashboard');
    }
  };

  const selectAssignment = (id: string) => {
    setSelectedAssignmentId(id);
    setView('attempt');
  };

  const backToDashboard = () => {
    setSelectedAssignmentId(null);
    setView('dashboard');
  };

  if (view === 'landing') {
    return <LandingPage
      onLogin={() => setView('auth_login')}
      onSignup={() => setView('auth_signup')}
    />;
  }

  if (view === 'auth_login' || view === 'auth_signup') {
    return <AuthPage
      onLoginSuccess={handleLoginSuccess}
      initialMode={view === 'auth_login' ? 'login' : 'signup'}
    />;
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'light-mode bg-slate-50 text-slate-900' : 'bg-[#0c0e12] text-slate-100'} overflow-hidden font-['Inter'] transition-colors duration-300`}>
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={backToDashboard}>
          <div className="w-9 h-9 theme-gradient rounded-xl flex items-center justify-center font-black text-white shadow-lg transform group-hover:rotate-12 transition-transform">
            C
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Cipher<span className="theme-text-gradient">SQL</span>Studio
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <button
            onClick={backToDashboard}
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${view === 'dashboard' ? 'text-green-500' : 'text-slate-400 hover:text-green-500'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setView('profile')}
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${view === 'profile' ? 'text-green-500' : 'text-slate-400 hover:text-green-500'}`}
          >
            Profile
          </button>
        </nav>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] pointer-events-none" />

        {view === 'attempt' && selectedAssignment ? (
          <AssignmentAttempt
            assignment={selectedAssignment}
            onBack={backToDashboard}
            onNext={handleNextAssignment}
            isLast={selectedIndex === ASSIGNMENTS.length - 1}
          />
        ) : view === 'profile' ? (
          <ProfileView
            onBack={backToDashboard}
            user={user}
            stats={stats}
            onUpdateUser={handleUpdateUser}
          />
        ) : (
          <AssignmentList
            assignments={ASSIGNMENTS}
            onSelectAssignment={selectAssignment}
            user={user}
            stats={stats}
          />
        )}
      </main>

      {(view !== 'dashboard' && view !== 'profile') && (
        <footer className="h-8 border-t border-white/5 flex items-center justify-between px-6 bg-slate-950/80 text-[10px] text-slate-500 uppercase tracking-widest font-bold shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              System Ready
            </div>
            <div className="text-slate-700">|</div>
            <div>PostgreSQL 15.2 (Simulated)</div>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-green-500 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-red-500 cursor-pointer transition-colors">Privacy Policy</span>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
