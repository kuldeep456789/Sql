import React from 'react';
import { Assignment, Difficulty, UserStats } from '../types';

interface AssignmentListProps {
  assignments: Assignment[];
  onSelectAssignment: (id: string) => void;
  userName?: string;
  stats?: UserStats | null;
}

const DifficultyBadge: React.FC<{ difficulty: Difficulty }> = ({ difficulty }) => {
  return (
    <span className={`difficulty-badge difficulty-badge--${difficulty}`}>
      {difficulty}
    </span>
  );
};

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, onSelectAssignment, userName, stats }) => {
  return (
    <div className="assignment-list">
      <div className="assignment-list__container">
        <div className="welcome-section">
          <div className="max-w-2xl">
            <h2 className="welcome-section__title">
              Welcome Back, <span>{userName || 'Explorer'}</span>
            </h2>
            <p className="welcome-section__text">
              Your current progress is <span>{stats?.progress || 0}%</span> complete.
              Continue where you left off or start a new challenge below.
            </p>
          </div>

          <div className="welcome-section__stats">
            <div className="stat-card">
              <span className="stat-card__label">XP Points</span>
              <span className="stat-card__value stat-card__value--orange">{stats?.xp.toLocaleString() || 0}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Rank</span>
              <span className="stat-card__value stat-card__value--green">{stats?.rank || 'Novice I'}</span>
            </div>
          </div>
        </div>

        <div className="section-header">
          <h3 className="section-header__title">Curriculum</h3>
          <div className="section-header__actions">
            <button className="section-header__filter section-header__filter--active">All</button>
            <button className="section-header__filter section-header__filter--inactive">Queries</button>
          </div>
        </div>

        <div className="assignment-grid">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              onClick={() => onSelectAssignment(assignment.id)}
              className="assignment-card group"
            >
              <div className="assignment-card__glow" />

              <div className="assignment-card__header">
                <DifficultyBadge difficulty={assignment.difficulty} />
                <div className="assignment-card__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </div>

              <h3 className="assignment-card__title">
                {assignment.title}
              </h3>
              <p className="assignment-card__desc">
                {assignment.description}
              </p>

              <div className="assignment-card__footer">
                <div className="meta-info">
                  <div className="meta-info__item">
                    <span className="green">#</span> {assignment.schemas.length} Tables
                  </div>
                  <div className="meta-info__item">
                    <span className="orange">!</span> {assignment.requirements.length} Tasks
                  </div>
                </div>
                <div className="assignment-card__cta">
                  Start Challenge
                </div>
              </div>
            </div>
          ))}

          <div className="coming-soon-card">
            <div className="coming-soon-card__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <h4 className="coming-soon-card__label">Coming Soon</h4>
            <p className="coming-soon-card__sub">Advanced Transactions & Optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;
