import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Assignment, QueryResult } from '../types';
import { executeQuery } from '../services/dbService';
import { getSqlHint } from '../services/geminiService';
import Editor from '@monaco-editor/react';

interface AssignmentAttemptProps {
  assignment: Assignment;
  onBack: () => void;
  onNext?: () => void;
  isLast?: boolean;
  userEmail?: string;
}

type EditorTheme = 'vs-dark' | 'light' | 'hc-black';

const AssignmentAttempt: React.FC<AssignmentAttemptProps> = ({ assignment, onBack, onNext, isLast, userEmail }) => {
  const [query, setQuery] = useState(assignment.initialQuery || '');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [activeTab, setActiveTab] = useState<'schema' | 'results'>('results');
  const [hint, setHint] = useState<string | null>(null);
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [editorTheme, setEditorTheme] = useState<EditorTheme>('vs-dark');

  // Resizing state
  const [resultsHeight, setResultsHeight] = useState(40); // Initial 40% height for results
  const [isResizing, setIsResizing] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);

  // Reset state when assignment changes
  useEffect(() => {
    setQuery(assignment.initialQuery || '');
    setResult(null);
    setHint(null);
    setActiveTab('results');
  }, [assignment]);

  const handleExecute = async () => {
    setIsExecuting(true);
    const res = await executeQuery(query, assignment.schemas, userEmail, assignment.id);
    setResult(res);
    setActiveTab('results');
    setIsExecuting(false);
  };

  const handleGetHint = async () => {
    setIsGettingHint(true);
    const h = await getSqlHint(assignment, query);
    setHint(h);
    setIsGettingHint(false);
  };

  // Resize logic
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

  const isSuccessful = result && !result.error && result.data && result.data.length > 0;

  return (
    <div className="assignment-attempt">
      {/* Sidebar: Instructions */}
      <div className="sidebar">
        <div className="sidebar__header">
          <button onClick={onBack} className="sidebar__exit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Exit
          </button>
          <span className="sidebar__status-badge">Active</span>
        </div>

        <div className="sidebar__content">
          <div className="challenge-info">
            <h4 className="challenge-info__label">The Challenge</h4>
            <h2 className="challenge-info__title">{assignment.title}</h2>
            <p className="challenge-info__desc">
              {assignment.description}
            </p>
          </div>

          <div className="challenge-info">
            <h4 className="challenge-info__label">Required Outputs</h4>
            <ul className="requirements-list">
              {assignment.requirements.map((req, idx) => (
                <li key={idx}>
                  <span>{idx + 1}.</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {hint && (
            <div className="hint-box">
              <div className="hint-box__header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
                <span>Tutor Advice</span>
              </div>
              <p className="hint-box__text">"{hint}"</p>
            </div>
          )}
        </div>

        <div className="sidebar__footer">
          <button
            onClick={handleGetHint}
            disabled={isGettingHint}
            className="btn-primary"
          >
            {isGettingHint ? (
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Ask for a Hint"
            )}
          </button>
        </div>
      </div>

      {/* Workspace: Editor + Output */}
      <div ref={workspaceRef} className="workspace">
        {/* Editor Container */}
        <div className="flex-1 flex flex-col relative min-h-0">
          <div className="editor-toolbar">
            <div className="editor-toolbar__left">
              <div className="editor-toolbar__file">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                main.sql
              </div>

              <div className="editor-toolbar__theme-toggles">
                {([['vs-dark', 'Dark'], ['light', 'Light'], ['hc-black', 'High Contrast']] as const).map(([t, label]) => (
                  <button
                    key={t}
                    onClick={() => setEditorTheme(t)}
                    className={editorTheme === t ? 'active' : ''}
                    title={label}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="editor-toolbar__actions">
              {isSuccessful && !isLast && onNext && (
                <button
                  onClick={onNext}
                  className="btn-execute bg-green-600 hover:bg-green-500 animate-bounce"
                  style={{ background: '#16a34a' }}
                >
                  Next Challenge
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
              )}

              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="btn-execute"
              >
                {isExecuting ? (
                  <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  "Execute Query"
                )}
              </button>
            </div>
          </div>

          <div className="editor-area" style={{ height: '100%', padding: '0' }}>
            <Editor
              height="100%"
              defaultLanguage="sql"
              theme={editorTheme}
              value={query}
              onChange={(value) => setQuery(value || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                automaticLayout: true,
                padding: { top: 16, bottom: 16 }
              }}
            />
          </div>
        </div>

        {/* DRAGGABLE RESIZER */}
        <div
          onMouseDown={startResizing}
          className={`resizer ${isResizing ? 'resizing' : ''}`}
        >
          <div className="resizer__handle" />
        </div>

        {/* Results / Schema Panel */}
        <div
          className="results-panel"
          style={{ height: `${resultsHeight}%` }}
        >
          <div className="results-panel__tabs">
            <button
              onClick={() => setActiveTab('results')}
              className={activeTab === 'results' ? 'active-results' : ''}
            >
              Output
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={activeTab === 'schema' ? 'active-schema' : ''}
            >
              Schemas
            </button>
          </div>

          <div className="results-panel__content">
            {activeTab === 'results' ? (
              <div className="h-full">
                {!result ? (
                  <div className="results-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" /><path d="M12 10v4" /><path d="m9 14 3 3 3-3" /></svg>
                    <p>Awaiting execution...</p>
                  </div>
                ) : result.error ? (
                  <div className="p-5 bg-rose-500/5 border border-rose-500/20 rounded-xl text-rose-400 text-sm code-font leading-relaxed">
                    <div className="font-bold text-rose-500 mb-2 uppercase tracking-widest text-[10px]">Syntax Error</div>
                    {result.error}
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="results-success__header">
                      <div>
                        {result.data.length} Records found
                      </div>
                      {isSuccessful && (
                        <div className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          Challenge Complete
                        </div>
                      )}
                      <div>
                        {result.executionTime.toFixed(1)}ms
                      </div>
                    </div>
                    <div className="border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                      <table className="data-table">
                        <thead>
                          <tr>
                            {result.columns.map(col => (
                              <th key={col}>
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.data.map((row, i) => (
                            <tr key={i}>
                              {result.columns.map(col => (
                                <td key={col}>
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
                          <table className="data-table" style={{ fontSize: '10px' }}>
                            <thead>
                              <tr className="text-slate-600">
                                {schema.columns.map(c => <th key={c.name} className="px-2 py-1 text-left font-bold uppercase">{c.name}</th>)}
                              </tr>
                            </thead>
                            <tbody>
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
