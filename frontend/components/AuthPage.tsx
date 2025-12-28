
import React, { useState } from 'react';
import { api } from '../services/api';

interface AuthPageProps {
  onLoginSuccess: (name: string, email: string) => void;
  initialMode: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, initialMode }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const data = await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        onLoginSuccess(data.name, data.email);
      } else {
        const data = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        onLoginSuccess(data.name, data.email);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] flex items-center justify-center p-6 relative overflow-hidden font-['Inter']">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-[#111318] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-12 h-12 theme-gradient rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg mb-4">
              C
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-500 text-sm mt-2 text-center">
              {mode === 'login'
                ? 'Continue your journey in CipherSQLStudio'
                : 'Start mastering SQL with professional tools'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                {mode === 'login' && (
                  <button type="button" className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors">Forgot?</button>
                )}
              </div>
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-slate-700"
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full theme-gradient py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-green-500/10 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 text-xs">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError(null);
                }}
                className="ml-2 font-black text-green-500 hover:text-green-400 transition-colors uppercase tracking-widest text-[10px]"
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-300">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
            Trusted by over 10,000 developers worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
