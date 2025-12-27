import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Assignment, UserStats } from './types';
import AssignmentList from './components/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';

type ViewState = 'landing' | 'auth_login' | 'auth_signup' | 'dashboard' | 'attempt' | 'settings' | 'profile';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>({
    name: 'Guest',
    role: 'Free Member',
    email: 'guest@example.com'
  });
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const fetchUserStats = async (email: string) => {
    try {
      const cleanEmail = email.trim();
      const stats = await api.get(`/user/stats/${cleanEmail}`);
      setUserStats(stats);
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };

  useEffect(() => {
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

  const handleLoginSuccess = (name: string, email: string) => {
    setUser({
      name,
      role: 'Pro Member',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`
    });
    fetchUserStats(email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`);
    setView('dashboard');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleUpdateUser = (name: string, email: string) => {
    if (user) {
      setUser({ ...user, name, email });
    }
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

  const handleAssignmentComplete = () => {
    if (user?.email) fetchUserStats(user.email);
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
    <div className={`app-container ${theme === 'light' ? 'light-mode' : ''}`}>
      <header className="app-header">
        <div className="app-header__brand" onClick={backToDashboard}>
          <div className="app-header__logo">C</div>
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
        </nav>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <div className="nav-menu__divider" />
          <div className="user-profile-container">
            <div className="user-profile group" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
              <div className="user-profile__info">
                <div className="user-profile__name">{user?.name || 'Guest'}</div>
                <div className="user-profile__role">{user?.role || 'Free Member'}</div>
              </div>
              <div className="user-profile__avatar">
                <span>{user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'G'}</span>
              </div>
            </div>

            {showProfileDropdown && (
              <div className="profile-dropdown">
                <button className="profile-dropdown__item" onClick={() => { setView('profile'); setShowProfileDropdown(false); }}>
                  View Profile
                </button>
                <button className="profile-dropdown__item" onClick={() => { setView('settings'); setShowProfileDropdown(false); }}>
                  Settings
                </button>
                <div className="profile-dropdown__divider" />
                <button className="profile-dropdown__item profile-dropdown__item--logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="bg-glow bg-glow--orange" />
        <div className="bg-glow bg-glow--green" />

        {view === 'attempt' && selectedAssignment ? (
          <AssignmentAttempt
            assignment={selectedAssignment}
            onBack={backToDashboard}
            onNext={handleNextAssignment}
            isLast={selectedIndex === assignments.length - 1}
            userEmail={user?.email}
          />
        ) : view === 'profile' ? (
          <ProfileView
            user={{ ...user!, role: userStats?.rank || user!.role }}
            stats={userStats}
            onBack={backToDashboard}
          />
        ) : view === 'settings' ? (
          <SettingsView
            user={user}
            onUpdateUser={handleUpdateUser}
            onBack={backToDashboard}
          />
        ) : (
          <AssignmentList
            assignments={assignments}
            onSelectAssignment={selectAssignment}
            userName={user?.name}
            stats={userStats}
          />
        )}
      </main>

    </div>
  );
};

export default App;
