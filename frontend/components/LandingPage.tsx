
import React from 'react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="min-h-screen bg-[#050608] flex flex-col items-center overflow-x-hidden font-['Inter']">
      {/* Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-green-500/10 via-red-500/5 to-transparent pointer-events-none opacity-50" />
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation Bar (Landing) */}
      <nav className="w-full max-w-7xl px-8 h-20 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 theme-gradient rounded-lg flex items-center justify-center font-black text-white text-sm shadow-lg">C</div>
          <span className="font-extrabold text-lg tracking-tight">Cipher<span className="theme-text-gradient">SQL</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <button onClick={onLogin} className="text-white hover:text-green-500 transition-colors">Sign In</button>
          <button onClick={onSignup} className="bg-white text-black px-5 py-2 rounded-full hover:bg-green-500 hover:text-white transition-all transform active:scale-95">Get Started</button>
        </div>
      </nav>

      <main className="w-full max-w-7xl px-8 flex flex-col items-center pt-24 pb-32 z-10 text-center">


        {/* Hero Text */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Precision Engineering <br />
          For <span className="theme-text-gradient">SQL Masters.</span>
        </h1>



        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <button
            onClick={onSignup}
            className="group relative px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-[11px] rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5"
          >
            <div className="absolute inset-0 theme-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 group-hover:text-white transition-colors">Get Start</span>
          </button>

          <button
            onClick={onLogin}
            className="px-10 py-5 bg-slate-900/40 border border-white/5 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-slate-800 transition-all backdrop-blur-md"
          >
            Sign In
          </button>
        </div>

        {/* Product Preview Mockup */}
        <div className="relative w-full max-w-5xl group animate-in fade-in duration-1000 delay-300 transition-all duration-700 hover:scale-90 cursor-pointer">
          {/* Outer Shadow/Glow */}
          <div className="absolute -inset-1 theme-gradient blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-700" />

          <div className="relative bg-[#0d0f14] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/8] glass-morphism animate-float">
            {/* Window Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-black/40 px-6 py-1 rounded-full border border-white/5 text-[10px] font-bold text-slate-500 tracking-widest flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  ciphersql.studio/main_v1.sql
                </div>
              </div>
            </div>

            {/* Window Content Split */}
            <div className="flex h-full">
              {/* Sidebar Mock */}
              <div className="w-16 md:w-48 border-r border-white/5 flex flex-col p-4 gap-4 bg-black/20">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-2 w-full bg-white/5 rounded-full" />
                ))}
              </div>

              {/* Editor Mock */}
              <div className="flex-1 p-8 text-left code-font">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-4">
                    <span className="text-red-500">SELECT</span>
                    <span className="text-slate-300">u.first_name, u.email, o.total</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-red-500">FROM</span>
                    <span className="text-slate-300">users u</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-red-500">JOIN</span>
                    <span className="text-slate-300">orders o </span>
                    <span className="text-red-500">ON</span>
                    <span className="text-slate-300">u.id = o.user_id</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-red-500">WHERE</span>
                    <span className="text-slate-300">o.status = </span>
                    <span className="text-green-500">'COMPLETED'</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-red-500">LIMIT</span>
                    <span className="text-blue-400">100</span>;
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Query Results</span>
                      <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Done • 12ms</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-6 w-full bg-white/5 rounded-lg flex items-center px-3 gap-4">
                        <div className="h-2 w-12 bg-white/10 rounded" />
                        <div className="h-2 w-32 bg-white/10 rounded" />
                        <div className="h-2 w-8 bg-green-500/20 rounded" />
                      </div>
                      <div className="h-6 w-full bg-white/5 rounded-lg flex items-center px-3 gap-4">
                        <div className="h-2 w-12 bg-white/10 rounded" />
                        <div className="h-2 w-32 bg-white/10 rounded" />
                        <div className="h-2 w-8 bg-green-500/20 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
