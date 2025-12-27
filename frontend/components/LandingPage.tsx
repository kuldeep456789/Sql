
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
        <div className="new-release-badge">
          <span className="new-release-badge__label">New Release</span>
          <div className="new-release-badge__dot" />
          <span className="new-release-badge__text">Gemini 3.0 Integration Live</span>
        </div>

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

        {/* Stats Section */}
        <div className="stats-grid">
          {[
            { label: 'Users', value: '10k+', color: 'orange' },
            { label: 'Queries', value: '2.4M', color: 'green' },
            { label: 'Lessons', value: '450+', color: 'orange' },
            { label: 'Success Rate', value: '98%', color: 'green' },
          ].map((stat, i) => (
            <div key={i} className="stats-grid__item">
              <div className={`stats-grid__value ${stat.color}`}>{stat.value}</div>
              <div className="stats-grid__label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="landing-page__float-1" />
      <div className="landing-page__float-2" />
    </div>
  );
};


export default LandingPage;
