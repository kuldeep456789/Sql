
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { src: '/images/preview_dashboard.png', label: 'Interactive Dashboard' },
    { src: '/images/preview_editor.png', label: 'Advanced SQL Editor' },
    { src: '/images/preview_schema.png', label: 'Schema Visualizer' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
          CipherSchool <br />
          For <span className="theme-text-gradient">SQLEditor.</span>
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

        {/* Product Preview Slider */}
        <div className="w-full max-w-5xl relative group animate-in fade-in duration-1000 delay-300">
          <div className="relative aspect-video rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/10 bg-[#0d0f14] shadow-2xl transition-all duration-700 hover:scale-90 cursor-pointer">
            {slides.map((img, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${i === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                  }`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12 text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2">Live Experience</span>
                  <h3 className="text-xl md:text-2xl font-black text-white">{img.label}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Indicators */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-white' : 'bg-white/20'
                  }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
