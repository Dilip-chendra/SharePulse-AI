import React, { useState, useEffect } from 'react';
import { Search, Activity, Zap, Shield, Database, Users, TrendingUp, AlertTriangle, ArrowRight, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { label: 'Business Pulse (Live Control Plane)', section: 'Overview', route: 'pulse', icon: Activity },
    { label: 'Executive Command Center', section: 'Overview', route: 'overview', icon: TrendingUp },
    { label: 'Alerts & Incidents Triage', section: 'Overview', route: 'alerts', icon: AlertTriangle },
    { label: 'Share-of-Wallet Trajectory', section: 'Intelligence', route: 'sow', icon: TrendingUp },
    { label: 'Payment Migration & Wallet Displacement', section: 'Intelligence', route: 'migration', icon: Zap },
    { label: 'Silent Attrition Radar', section: 'Intelligence', route: 'attrition', icon: AlertTriangle },
    { label: 'Opportunity & NBA Matrix', section: 'Intelligence', route: 'opportunity', icon: Zap },
    { label: 'Customer 360 Feature Store', section: 'Customers', route: 'customers', icon: Users },
    { label: 'Behavioral Archetypes (K-Means)', section: 'Customers', route: 'segmentation', icon: Users },
    { label: 'Next Best Action Decisions', section: 'Decisions', route: 'nba', icon: Zap },
    { label: 'Action Center & Net Contribution Matrix', section: 'Decisions', route: 'actions', icon: Shield },
    { label: 'Automations & Human-in-the-Loop', section: 'Decisions', route: 'automations', icon: Shield },
    { label: 'Enterprise Data Connections', section: 'Data', route: 'connections', icon: Database },
    { label: 'Data Health & Schema Drift Center', section: 'Data', route: 'data-health', icon: Database },
    { label: 'Visual Data Lineage Graph', section: 'Data', route: 'lineage', icon: Database },
    { label: 'Model Health & PSI Drift Monitoring', section: 'Governance', route: 'model-health', icon: Shield },
    { label: 'Audit Trail & Multi-Tenant Security', section: 'Governance', route: 'audit', icon: Shield },
    { label: 'Autonomous AI Empirical Discovery', section: 'AI', route: 'ai-discovery', icon: Zap }
  ];

  const filtered = items.filter(i => 
    i.label.toLowerCase().includes(query.toLowerCase()) || 
    i.section.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0d121d] border border-slate-700/60 shadow-2xl shadow-indigo-950/50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, page, metric or action (e.g. pulse, wallet, decisions)..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No matching pages or commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(item.route);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-white group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-indigo-400 group-hover:text-cyan-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-200 group-hover:text-white">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.section}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Navigation shortcut:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Ctrl+K</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Esc</kbd>
          </div>
          <span className="font-mono text-indigo-400">SharePulse AI Enterprise v2.5</span>
        </div>
      </div>
    </div>
  );
};
