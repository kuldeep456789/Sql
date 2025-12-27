import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Assignment } from './types';
import AssignmentList from './components/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';

type ViewState = 'landing' | 'auth_login' | 'auth_signup' | 'dashboard' | 'attempt';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch assignments when app loads (or when entering dashboard)
    const fetchAssignments = async () => {
      try {
        const data = await api.get('/assignments');
        setAssignments(data);
      } catch (err) {
        console.error('Failed to load assignments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const selectedIndex = assignments.findIndex(a => a.id === selectedAssignmentId);
  const selectedAssignment = selectedIndex !== -1 ? assignments[selectedIndex] : null;

  const handleLoginSuccess = () => {
    setView('dashboard');
  };

  const handleLogout = () => {
    setView('landing');
    setSelectedAssignmentId(null);
  };

  const handleNextAssignment = () => {
    if (selectedIndex !== -1 && selectedIndex < assignments.length - 1) {
      setSelectedAssignmentId(assignments[selectedIndex + 1].id);
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

  // Render Logic
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
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__brand" onClick={backToDashboard}>
          <div className="app-header__logo">
            C
          </div>
          <h1 className="app-header__title">
            Cipher<span>SQL</span>Studio
          </h1>
        </div>

        <nav className="nav-menu">
          <button
            onClick={backToDashboard}
            className={`nav-menu__item ${view === 'dashboard' ? 'nav-menu__item--active' : ''}`}
          >
            Dashboard
          </button>
          <button className="nav-menu__item">Progress</button>
          <button className="nav-menu__item">Community</button>

          <div className="nav-menu__divider" />

          <div className="user-profile group" onClick={handleLogout}>
            <div className="user-profile__info">
              <div className="user-profile__name">John Smith</div>
              <div className="user-profile__role">Pro Member</div>
            </div>
            <div className="user-profile__avatar">
              <span>JS</span>
            </div>
          </div>
        </nav>
      </header>

      <main className="app-main">
        {/* Background Glows */}
        <div className="bg-glow bg-glow--orange" />
        <div className="bg-glow bg-glow--green" />

        {view === 'attempt' && selectedAssignment ? (
          <AssignmentAttempt
            assignment={selectedAssignment}
            onBack={backToDashboard}
            onNext={handleNextAssignment}
            isLast={selectedIndex === assignments.length - 1}
          />
        ) : (
          <AssignmentList
            assignments={assignments}
            onSelectAssignment={selectAssignment}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="app-footer__status">
          <div className="app-footer__indicator">
            <div className="dot" />
            System Ready
          </div>
          <div>|</div>
          <div>PostgreSQL 15.2 (Simulated)</div>
        </div>
        <div className="app-footer__links">
          <span>Documentation</span>
          <span>Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
