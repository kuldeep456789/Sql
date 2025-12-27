import React, { useState } from 'react';

interface AuthPageProps {
  onLoginSuccess: (name: string, email: string) => void;
  initialMode: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, initialMode }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(formData.name || 'User', formData.email);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg-orange" />
      <div className="auth-page__bg-green" />

      <div className="auth-page__container">
        <div className="auth-card">
          <div className="auth-card__header">
            <div className="auth-card__logo">
              C
            </div>
            <h1 className="auth-card__title">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="auth-card__subtitle">
              {mode === 'login'
                ? 'Continue your journey in CipherSQLStudio'
                : 'Start mastering SQL with professional tools'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <div className="auth-form__group">
                <label className="auth-form__label">Full Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="auth-form__input"
                />
              </div>
            )}

            <div className="auth-form__group">
              <label className="auth-form__label">Email Address</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="auth-form__input"
              />
            </div>

            <div className="auth-form__group">
              <div className="auth-form__label-row">
                <label className="auth-form__label">Password</label>
                {mode === 'login' && (
                  <button type="button" className="auth-form__forgot">Forgot?</button>
                )}
              </div>
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="auth-form__input"
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="auth-form__submit"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer__text">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="auth-footer__link"
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>

        <div className="trusted-badge">
          <p>
            Trusted by over 10,000 developers worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
