import React, { useState } from 'react';
import { Assignment, UserStats } from '../types';

interface ProfileViewProps {
    onBack: () => void;
    user: { name: string; role: string; email: string } | null;
    stats?: UserStats | null;
    onUpdateUser: (name: string, email: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onBack, user, stats, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const days = Array.from({ length: 365 }, (_, i) => {
        const date = new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const activity = stats?.history.find((h: any) => h.date.split('T')[0] === dateStr);
        return {
            date,
            count: activity ? activity.count : 0,
        };
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const handleSave = () => {
        onUpdateUser(editData.name, editData.email);
        setIsEditing(false);
    };

    return (
        <div className="profile-view animate-in fade-in duration-500">
            <div className="profile-view__container max-w-6xl mx-auto p-6 lg:p-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: User Info */}
                    <div className="w-full lg:w-[350px] shrink-0 space-y-6">
                        <div className="bg-[#111318] border border-white/5 rounded-[32px] p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl pointer-events-none" />

                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full theme-gradient p-1 mb-6">
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl font-black text-white shadow-inner">
                                        {editData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                </div>

                                {isEditing ? (
                                    <div className="w-full space-y-4">
                                        <input
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-green-500 outline-none"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            placeholder="Full Name"
                                        />
                                        <input
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-green-500 outline-none"
                                            value={editData.email}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                            placeholder="Email"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={handleSave} className="flex-1 theme-gradient py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white">Save</button>
                                            <button onClick={() => setIsEditing(false)} className="flex-1 bg-white/5 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-2xl font-black mb-1">{editData.name}</h1>
                                        <p className="text-slate-500 text-sm mb-6 font-medium">@{editData.name.toLowerCase().replace(/\s/g, '')}_sql</p>

                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all mb-8"
                                        >
                                            Edit Profile
                                        </button>
                                    </>
                                )}

                                <div className="w-full space-y-3 pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-bold uppercase">Rank</span>
                                        <span className="text-green-500 font-black tracking-widest uppercase">{stats?.rank}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-bold uppercase">Level</span>
                                        <span className="text-white font-black">Pro Member</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-bold uppercase">Joined</span>
                                        <span className="text-slate-300">Dec 2025</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Difficulty Progress Card - LeetCode Style */}
                        <div className="bg-[#111318] border border-white/5 rounded-[32px] p-8">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Solved Problems</h4>

                            <div className="flex items-center gap-6">
                                <div className="relative w-24 h-24 shrink-0">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <circle className="text-white/5" stroke="currentColor" strokeWidth="3" fill="transparent" r="16" cx="18" cy="18" />
                                        <circle className="text-green-500" stroke="currentColor" strokeWidth="3" strokeDasharray="100" strokeDashoffset="58" fill="transparent" r="16" cx="18" cy="18" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-lg font-black">{stats?.solvedCount}</span>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase">Solved</span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold">
                                            <span className="text-green-500">Easy</span>
                                            <span className="text-white">8/10</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[80%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold">
                                            <span className="text-blue-500">Medium</span>
                                            <span className="text-white">4/15</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[26%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold">
                                            <span className="text-red-500">Hard</span>
                                            <span className="text-white">0/5</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 w-0" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dashboard & Activity */}
                    <div className="flex-1 space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#111318] border border-white/5 rounded-3xl p-6">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">SQL XP</span>
                                <div className="text-2xl font-black text-green-500">{stats?.xp.toLocaleString()}</div>
                                <span className="text-[10px] text-slate-600 font-bold uppercase mt-1">Next rank in 4,000 XP</span>
                            </div>
                            <div className="bg-[#111318] border border-white/5 rounded-3xl p-6">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Current Streak</span>
                                <div className="text-2xl font-black text-red-500">{stats?.streak} Days</div>
                                <span className="text-[10px] text-slate-600 font-bold uppercase mt-1">Active Activity</span>
                            </div>
                            <div className="bg-[#111318] border border-white/5 rounded-3xl p-6">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Global Rank</span>
                                <div className="text-2xl font-black text-white">#1,402</div>
                                <span className="text-[10px] text-slate-600 font-bold uppercase mt-1">Top 12% globally</span>
                            </div>
                        </div>

                        {/* Heatmap Section */}
                        <div className="bg-[#111318] border border-white/5 rounded-[32px] p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black uppercase tracking-widest">Submission Activity</h3>
                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-slate-500">
                                    <span>Total: 842 submissions</span>
                                    <span>Max Streak: 12 days</span>
                                </div>
                            </div>

                            <div className="heatmap-container overflow-x-auto pb-4">
                                <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-2 px-1">
                                    {months.map(m => <span key={m} className="w-8">{m}</span>)}
                                </div>
                                <div className="grid grid-flow-col grid-rows-7 gap-1">
                                    {days.map((day, i) => {
                                        const intensity = day.count === 0 ? 'bg-white/5' :
                                            day.count < 2 ? 'bg-green-900/40' :
                                                day.count < 4 ? 'bg-green-700/60' :
                                                    'bg-green-500';
                                        return (
                                            <div
                                                key={i}
                                                className={`w-3 h-3 rounded-sm ${intensity} transition-colors hover:ring-2 hover:ring-white/20`}
                                                title={`${day.date.toDateString()}: ${day.count} submissions`}
                                            />
                                        )
                                    })}
                                </div>
                                <div className="flex items-center justify-end gap-2 mt-6 text-[10px] font-bold text-slate-600">
                                    <span>Less</span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 rounded-sm bg-white/5" />
                                        <div className="w-3 h-3 rounded-sm bg-green-900/40" />
                                        <div className="w-3 h-3 rounded-sm bg-green-700/60" />
                                        <div className="w-3 h-3 rounded-sm bg-green-500" />
                                    </div>
                                    <span>More</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Achievements */}
                        <div className="bg-[#111318] border border-white/5 rounded-[32px] p-8">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-8">Recent Achievements</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Data Voyager', desc: 'Resolved 10 Beginner challenges.', date: 'Dec 22', icon: '💎' },
                                    { title: 'Join Master', desc: 'Used 5 different JOIN types.', date: 'Dec 24', icon: '🔗' },
                                    { title: 'Query Speedster', desc: 'Optimized a query under 10ms.', date: 'Dec 25', icon: '⚡' },
                                    { title: 'Clean Coder', desc: 'Passed validation first try.', date: 'Dec 27', icon: '✨' }
                                ].map((badge, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-green-500/30 transition-all group">
                                        <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                            {badge.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h5 className="text-xs font-black uppercase tracking-wider">{badge.title}</h5>
                                                <span className="text-[8px] font-bold text-slate-500 uppercase">{badge.date}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-1">{badge.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Submission Activity List */}
                        <div className="bg-[#111318] border border-white/5 rounded-[32px] p-8">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-8">Recent Submissions</h3>
                            <div className="space-y-4">
                                {[
                                    { title: 'The Great Join Query', status: 'Accepted', time: '2 hours ago', lang: 'PostgreSQL' },
                                    { title: 'Nested Select Optimization', status: 'Accepted', time: '5 hours ago', lang: 'PostgreSQL' },
                                    { title: 'Window Function Hero', status: 'Accepted', time: 'Yesterday', lang: 'PostgreSQL' },
                                    { title: 'Data Cleaning Script', status: 'Accepted', time: '2 days ago', lang: 'PostgreSQL' }
                                ].map((sub, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-transparent hover:border-green-500/20 transition-all">
                                        <div>
                                            <div className="text-xs font-bold text-white">{sub.title}</div>
                                            <div className="text-[10px] text-slate-500 mt-1">{sub.time} • {sub.lang}</div>
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-tighter text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                            {sub.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
