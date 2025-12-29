
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Assignment, QueryResult } from '../types';
import { executeQuery } from '../services/dbService';
import { getSqlHint } from '../services/geminiService';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';

interface AssignmentAttemptProps {
  assignment: Assignment;
  onBack: () => void;
  onNext?: () => void;
  isLast?: boolean;
}

type EditorTheme = 'cyberpunk' | 'amber' | 'emerald';

const AssignmentAttempt: React.FC<AssignmentAttemptProps> = ({ assignment, onBack, onNext, isLast }) => {
  const [query, setQuery] = useState(assignment.initialQuery || '');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [activeTab, setActiveTab] = useState<'schema' | 'results'>('results');
  const [hint, setHint] = useState<string | null>(null);
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [editorTheme, setEditorTheme] = useState<EditorTheme>('cyberpunk');

  const [resultsHeight, setResultsHeight] = useState(40); // Initial 40% height for results
  const [isResizing, setIsResizing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(assignment.initialQuery || '');
    setResult(null);
    setHint(null);
    setActiveTab('results');
  }, [assignment]);

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const res = executeQuery(query, assignment.schemas);
      setResult(res);
      setActiveTab('results');
      setIsExecuting(false);
    }, 400);
  };

  const handleGetHint = async () => {
    setIsGettingHint(true);
    const h = await getSqlHint(assignment, query);
    setHint(h);
    setIsGettingHint(false);
  };

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && workspaceRef.current) {
      const workspaceRect = workspaceRef.current.getBoundingClientRect();
      const relativeY = e.clientY - workspaceRect.top;
      const totalHeight = workspaceRect.height;
      const newHeightPercentage = 100 - (relativeY / totalHeight) * 100;

      // Constraints: 10% to 85%
      const clampedHeight = Math.max(10, Math.min(85, newHeightPercentage));
      setResultsHeight(clampedHeight);
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'ns-resize';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'default';
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const getThemeClasses = () => {
    switch (editorTheme) {
      case 'amber':
        return {
          bg: 'bg-[#120a0a]',
          text: 'text-red-400',
          lineNumbers: 'bg-[#1a1010] text-red-900',
          border: 'border-red-500/20',
          prismClass: 'theme-amber'
        };
      case 'emerald':
        return {
          bg: 'bg-[#0a120d]',
          text: 'text-green-400',
          lineNumbers: 'bg-[#101a14] text-green-900',
          border: 'border-green-500/20',
          prismClass: 'theme-emerald'
        };
      default:
        return {
          bg: 'bg-black',
          text: 'text-green-400',
          lineNumbers: 'bg-slate-900 text-slate-700',
          border: 'border-white/5',
          prismClass: 'theme-cyberpunk'
        };
    }
  };

  const themeClasses = getThemeClasses();
  const highlightedCode = Prism.highlight(query, Prism.languages.sql, 'sql');

  const isSuccessful = result && !result.error && result.data.length > 0;

  return (
    <div className={`h-full flex flex-col md:flex-row overflow-hidden bg-[#0c0e12] ${themeClasses.prismClass}`}>
      <div className="w-full md:w-[320px] lg:w-[400px] border-r border-white/5 flex flex-col bg-slate-950/50 backdrop-blur-md">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Exit
          </button>
          <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase">
            Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">The Challenge</h4>
            <h2 className="text-xl font-bold mb-3">{assignment.title}</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {assignment.description}
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Required Outputs</h4>
            <ul className="space-y-4">
              {assignment.requirements.map((req, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-300">
                  <span className="text-green-500 font-mono font-bold">{idx + 1}.</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {hint && (
            <div className="bg-gradient-to-br from-red-500/20 to-transparent border border-red-500/20 rounded-xl p-5 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex items-center gap-2 mb-3 text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
                <span className="text-[10px] font-black uppercase tracking-widest">Tutor Advice</span>
              </div>
              <p className="text-sm italic text-slate-200 leading-relaxed">"{hint}"</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-slate-900/40">
          <button
            onClick={handleGetHint}
            disabled={isGettingHint}
            className="w-full py-3 rounded-xl border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            {isGettingHint ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Ask for a Hint"
            )}
          </button>
        </div>
      </div>

      <div ref={workspaceRef} className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex flex-col relative min-h-0">
          <div className="h-12 flex items-center justify-between px-4 bg-[#0c0e12] border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                main.sql
              </div>

              <div className="flex items-center bg-slate-950 border border-white/5 rounded-md p-0.5">
                {(['cyberpunk', 'amber', 'emerald'] as EditorTheme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setEditorTheme(t)}
                    className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${editorTheme === t ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isSuccessful && !isLast && onNext && (
                <button
                  onClick={onNext}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-500/10 transition-all animate-bounce"
                >
                  Next Challenge
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
              )}

              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="theme-gradient hover:opacity-90 disabled:opacity-50 text-white px-6 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-500/10 transition-all"
              >
                {isExecuting ? (
                  <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  "Execute Query"
                )}
              </button>
            </div>
          </div>

          <div className={`flex-1 flex min-h-0 ${themeClasses.bg} transition-colors duration-500`}>
            <div className={`w-10 ${themeClasses.lineNumbers} border-r ${themeClasses.border} flex flex-col items-center pt-[1.5rem] text-[10px] font-mono select-none transition-colors duration-500`}>
              {[...Array(50)].map((_, i) => <div key={i} className="h-6 leading-6">{i + 1}</div>)}
            </div>
            <div className="flex-1 relative overflow-hidden prism-editor-container">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onScroll={handleScroll}
                spellCheck={false}
                className="prism-editor-textarea"
                placeholder="-- Start writing your SQL query..."
              />
              <pre
                ref={preRef}
                className="prism-editor-pre language-sql"
                aria-hidden="true"
              >
                <code dangerouslySetInnerHTML={{ __html: highlightedCode + '\n' }} />
              </pre>
            </div>
          </div>
        </div>

        <div
          onMouseDown={startResizing}
          className={`h-1 cursor-ns-resize transition-colors z-30 group relative ${isResizing ? 'bg-red-500' : 'bg-white/5 hover:bg-red-500/50'}`}
        >
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] ${isResizing ? 'opacity-100' : ''}`} />
        </div>

        <div
          className="flex flex-col bg-[#111318] border-t border-white/5 shadow-2xl overflow-hidden"
          style={{ height: `${resultsHeight}%` }}
        >
          <div className="flex items-center px-4 border-b border-white/5 bg-black/20 shrink-0">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'results' ? 'border-green-500 text-green-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Output
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'schema' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Schemas
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'results' ? (
              <div className="h-full">
                {!result ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" /><path d="M12 10v4" /><path d="m9 14 3 3 3-3" /></svg>
                    <p className="text-xs font-bold uppercase tracking-widest">Awaiting execution...</p>
                  </div>
                ) : result.error ? (
                  <div className="p-5 bg-rose-500/5 border border-rose-500/20 rounded-xl text-rose-400 text-sm code-font leading-relaxed">
                    <div className="font-bold text-rose-500 mb-2 uppercase tracking-widest text-[10px]">Syntax Error</div>
                    {result.error}
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {result.data.length} Records found
                      </div>
                      {isSuccessful && (
                        <div className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          Challenge Complete
                        </div>
                      )}
                      <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {result.executionTime.toFixed(1)}ms
                      </div>
                    </div>
                    <div className="border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-white/5">
                          <tr>
                            {result.columns.map(col => (
                              <th key={col} className="px-4 py-3 font-black text-slate-400 border-r last:border-r-0 border-white/5 uppercase tracking-wider">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {result.data.map((row, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                              {result.columns.map(col => (
                                <td key={col} className="px-4 py-3 text-slate-300 border-r last:border-r-0 border-white/5 code-font">
                                  {row[col]?.toString() ?? <span className="text-slate-600">NULL</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-12 pb-8">
                {assignment.schemas.map((schema, sIdx) => (
                  <div key={sIdx} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <h5 className="text-sm font-black text-white uppercase tracking-widest">{schema.tableName}</h5>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-1 bg-black/40 border border-white/5 rounded-xl overflow-hidden">
                        <div className="px-4 py-2 bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Definition</div>
                        <div className="p-4 space-y-3">
                          {schema.columns.map((col, cIdx) => (
                            <div key={cIdx} className="flex items-center justify-between">
                              <span className="code-font text-xs text-slate-300">{col.name}</span>
                              <span className="text-[10px] font-bold text-slate-600 uppercase">{col.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="lg:col-span-2 bg-black/40 border border-white/5 rounded-xl overflow-hidden">
                        <div className="px-4 py-2 bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Sample Context</div>
                        <div className="overflow-x-auto p-4">
                          <table className="w-full text-[10px]">
                            <thead>
                              <tr className="text-slate-600">
                                {schema.columns.map(c => <th key={c.name} className="px-2 py-1 text-left font-bold uppercase">{c.name}</th>)}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {schema.sampleData.slice(0, 3).map((row, rIdx) => (
                                <tr key={rIdx}>
                                  {schema.columns.map(c => (
                                    <td key={c.name} className="px-2 py-2 text-slate-400 code-font">{row[c.name]}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAttempt;
