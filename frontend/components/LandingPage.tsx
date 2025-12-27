
import React from 'react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="landing-page">
      {/* Dynamic Background Elements */}
      <div className="landing-page__bg-orange" />
      <div className="landing-page__bg-green" />
      <div className="landing-page__noise" />

      {/* Grid Pattern */}
      <div className="landing-page__grid" />

      <div className="landing-page__container">
        <h1 className="hero-title">
          Master SQL <br />
          <span>Without Limits.</span>
        </h1>

        <p className="hero-text">
          The most advanced browser-based SQL IDE. Real-time execution,
          intelligent AI hints, and professional curriculum designed for the modern engineer.
        </p>

        <div className="cta-group">
          <button
            onClick={onSignup}
            className="btn-landing-primary category-btn"
          >
            <div className="btn-landing-primary__gradient" />
            <span>Enter the Studio</span>
          </button>

          <button
            onClick={onLogin}
            className="btn-landing-secondary"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="landing-page__float-1" />
      <div className="landing-page__float-2" />
    </div>
  );
};


export default LandingPage;
