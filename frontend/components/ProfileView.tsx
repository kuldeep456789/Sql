import React from 'react';
import { Assignment } from '../types';

interface ProfileViewProps {
    onBack: () => void;
    user: { name: string; role: string } | null;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onBack, user }) => {
    // Simulated data for the heatmap
    const days = Array.from({ length: 365 }, (_, i) => ({
        date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000),
        count: Math.floor(Math.random() * 5),
    }));

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="profile-view">
            <div className="profile-view__container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-header__main">
                        <div className="profile-header__avatar">
                            <span>{user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'G'}</span>
                        </div>
                        <div className="profile-header__info">
                            <h1 className="profile-header__name">{user?.name || 'Guest'}</h1>
                            <p className="profile-header__handle">@{user?.name?.toLowerCase().replace(/\s+/g, '') || 'guest'}_sql</p>
                            <div className="profile-header__badges">
                                <span className="badge badge--orange">{user?.role || 'Free Member'}</span>
                                <span className="badge badge--blue">SQL Ninja</span>
                            </div>
                        </div>
                    </div>
                    <button className="btn-secondary" onClick={onBack}>
                        Back to Dashboard
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="profile-stats">
                    <div className="stat-card">
                        <div className="stat-card__label">Problems Solved</div>
                        <div className="stat-card__value">142</div>
                        <div className="stat-card__sub">Top 5% this month</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card__label">Current Streak</div>
                        <div className="stat-card__value stat-card__value--orange">12 Days</div>
                        <div className="stat-card__sub">Personal Best: 24</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card__label">Global Rank</div>
                        <div className="stat-card__value stat-card__value--green">#1,240</div>
                        <div className="stat-card__sub">Out of 45k users</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card__label">Skill Level</div>
                        <div className="stat-card__value">Advanced</div>
                        <div className="stat-card__sub">Mastered 8 topics</div>
                    </div>
                </div>

                {/* Activity Heatmap */}
                <div className="activity-section">
                    <h2 className="section-title">Submission Activity</h2>
                    <div className="heatmap-container">
                        <div className="heatmap-header">
                            {months.map(m => <span key={m}>{m}</span>)}
                        </div>
                        <div className="heatmap-grid">
                            {days.map((day, i) => (
                                <div
                                    key={i}
                                    className={`heatmap-cell intensity-${day.count}`}
                                    title={`${day.date.toDateString()}: ${day.count} submissions`}
                                />
                            ))}
                        </div>
                        <div className="heatmap-footer">
                            <span>Less</span>
                            <div className="heatmap-legend">
                                <div className="heatmap-cell intensity-0" />
                                <div className="heatmap-cell intensity-1" />
                                <div className="heatmap-cell intensity-2" />
                                <div className="heatmap-cell intensity-3" />
                                <div className="heatmap-cell intensity-4" />
                            </div>
                            <span>More</span>
                        </div>
                    </div>
                </div>

                {/* Recent Achievements */}
                <div className="achievements-section">
                    <h2 className="section-title">Recent Achievements</h2>
                    <div className="achievements-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="achievement-card">
                                <div className="achievement-card__icon">🏆</div>
                                <div className="achievement-card__info">
                                    <div className="achievement-card__title">SQL Master Level {i}</div>
                                    <div className="achievement-card__date">Unlocked on Dec {20 + i}, 2025</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
