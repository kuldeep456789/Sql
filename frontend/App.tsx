
import React, { useState, useEffect } from 'react';
import { ASSIGNMENTS } from './constants';
import AssignmentList from './components/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';

type ViewState = 'landing' | 'auth_login' | 'auth_signup' | 'dashboard' | 'attempt';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  const selectedIndex = ASSIGNMENTS.findIndex(a => a.id === selectedAssignmentId);
  const selectedAssignment = selectedIndex !== -1 ? ASSIGNMENTS[selectedIndex] : null;

  const handleLoginSuccess = () => {
    setView('dashboard');
  };

  const handleLogout = () => {
    setView('landing');
    setSelectedAssignmentId(null);
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
    <div className="min-h-screen flex flex-col bg-[#0c0e12] text-slate-100 overflow-hidden font-['Inter']">
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
            onClick={backToDashboard}
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${view === 'dashboard' ? 'text-green-500' : 'text-slate-400 hover:text-green-500'}`}
          >
            Dashboard
          </button>
          <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-green-500 transition-colors">Progress</button>
          <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Community</button>

          <div className="h-px w-8 bg-white/10" />

          <div className="flex items-center gap-3 group cursor-pointer" onClick={handleLogout}>
            <div className="text-right hidden lg:block">
              <div className="text-[10px] font-black text-white">John Smith</div>
              <div className="text-[8px] font-bold text-slate-500 uppercase">Pro Member</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-red-500/50 transition-all">
              <span className="text-xs font-bold text-red-400">JS</span>
            </div>
          </div>
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
        ) : (
          <AssignmentList
            assignments={ASSIGNMENTS}
            onSelectAssignment={selectAssignment}
          />
        )}
      </main>

      <footer className="h-8 border-t border-white/5 flex items-center justify-between px-6 bg-slate-950/80 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
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
    </div>
  );
};

export default App;
