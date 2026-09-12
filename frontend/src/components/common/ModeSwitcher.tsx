import React from 'react';
import { Database, Radio } from 'lucide-react';

interface ModeSwitcherProps {
  mode: 'case_study' | 'live';
  onModeChange: (mode: 'case_study' | 'live') => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ mode, onModeChange }) => {
  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-inner backdrop-blur-sm">
      <button
        type="button"
        onClick={() => onModeChange('case_study')}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          mode === 'case_study'
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-950/60 border border-indigo-400/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <Database className={`w-3.5 h-3.5 ${mode === 'case_study' ? 'text-indigo-200' : 'text-slate-400'}`} />
        <span>Case Study Mode</span>
        {mode === 'case_study' && (
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-indigo-950/90 rounded border border-indigo-400/40 text-indigo-300">
            444K
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => onModeChange('live')}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          mode === 'live'
            ? 'bg-gradient-to-r from-cyan-950 via-emerald-950 to-slate-900 text-emerald-300 shadow-md shadow-emerald-950/60 border border-emerald-500/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <Radio className={`w-3.5 h-3.5 ${mode === 'live' ? 'animate-pulse text-emerald-400' : 'text-slate-400'}`} />
        <span>Live Enterprise Mode</span>
        {mode === 'live' && (
          <span className="flex items-center gap-1.5 text-[10px] font-sans font-bold px-2 py-0.5 bg-emerald-900/40 rounded-full border border-emerald-400/40 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            STREAMING
          </span>
        )}
      </button>
    </div>
  );
};
