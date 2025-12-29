
import React from 'react';
import { Assignment, Difficulty } from '../types';

interface AssignmentListProps {
  assignments: Assignment[];
  onSelectAssignment: (id: string) => void;
}

const DifficultyBadge: React.FC<{ difficulty: Difficulty }> = ({ difficulty }) => {
  const styles = {
    Beginner: 'from-green-500/20 to-green-500/5 text-green-400 border-green-500/20',
    Intermediate: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20',
    Advanced: 'from-red-500/20 to-red-500/5 text-red-400 border-red-500/20'
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider bg-gradient-to-br ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
};

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, onSelectAssignment }) => {
  return (
    <div className="h-full overflow-y-auto p-6 lg:p-12 scroll-smooth">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black mb-4 tracking-tight">
              Welcome Back, <span className="theme-text-gradient">Explorer</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Your current progress is <span className="text-white font-bold">42%</span> complete.
              Continue where you left off or start a new challenge below.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#111318] border border-white/5 rounded-2xl p-4 flex flex-col min-w-[140px]">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">XP Points</span>
              <span className="text-xl font-black text-green-500">12,450</span>
            </div>
            <div className="bg-[#111318] border border-white/5 rounded-2xl p-4 flex flex-col min-w-[140px]">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Rank</span>
              <span className="text-xl font-black text-red-500">Novice II</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Core Curriculum</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-black uppercase text-white border border-white/10">All</button>
            <button className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Queries</button>
            <button className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Joins</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              onClick={() => onSelectAssignment(assignment.id)}
              className="group relative bg-[#111318] border border-white/5 rounded-3xl p-8 hover:border-green-500/30 hover:glow-green transition-all cursor-pointer flex flex-col overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="flex items-center justify-between mb-8">
                <DifficultyBadge difficulty={assignment.difficulty} />
                <div className="w-10 h-10 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center group-hover:theme-gradient group-hover:text-white group-hover:border-transparent transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:theme-text-gradient transition-all duration-300">
                {assignment.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-10 flex-1">
                {assignment.description}
              </p>

              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex items-center gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">#</span> {assignment.schemas.length} Tables
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">!</span> {assignment.requirements.length} Tasks
                  </div>
                </div>
                <div className="text-[10px] font-black text-slate-600 group-hover:text-slate-400 transition-colors uppercase tracking-widest">
                  Start Challenge
                </div>
              </div>
            </div>
          ))}

          <div className="relative bg-slate-900/10 border border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center group cursor-not-allowed">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Coming Soon</h4>
            <p className="text-[10px] text-slate-700 font-bold uppercase">Advanced Transactions & Optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;
