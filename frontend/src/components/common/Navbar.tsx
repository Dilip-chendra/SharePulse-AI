import React, { useEffect, useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useFilters } from '../../context/FilterContext';
import {
  Bot,
  FileText,
  Search,
  TrendingDown,
  X,
  Sparkles,
  Command,
  Activity,
  Layers,
  Menu
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { fetchLiveThroughput } from '../../services/api';

interface NavbarProps {
  kpis?: any;
  onOpenCommandPalette?: () => void;
  onNavigateAlerts?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  kpis,
  onOpenCommandPalette,
  onNavigateAlerts,
  onToggleMobileSidebar
}) => {
  const {
    searchQuery,
    setSearchQuery,
    setIsAIAnalystOpen,
    setIsReportModalOpen,
    setSelectedCustomerId
  } = useFilters();

  const [liveMetrics, setLiveMetrics] = useState<{ total_events?: number; events_per_second?: number; p99_latency_ms?: number } | null>(null);

  useEffect(() => {
    // Fetch once on mount, then poll every 30s (reduced from 5s to avoid 503 spam)
    fetchLiveThroughput()
      .then(setLiveMetrics)
      .catch(() => {});
    const interval = setInterval(() => {
      fetchLiveThroughput().then(setLiveMetrics).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idNum = parseInt(searchQuery.trim().replace('#', ''));
    if (!isNaN(idNum) && idNum > 0) {
      setSelectedCustomerId(idNum);
    }
  };

  const sowPct = kpis?.overall_sow_pct !== undefined ? kpis.overall_sow_pct : '—';
  const sowDrop = kpis?.sow_collapse_pp !== undefined ? kpis.sow_collapse_pp : '—';
  const revRiskM = kpis?.revenue_at_risk !== undefined ? (kpis.revenue_at_risk / 1e6).toFixed(1) : '—';

  return (
    <header className="h-14 sm:h-16 bg-[#080C16]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-sm gap-2">
      {/* Mobile hamburger */}
      <button
        onClick={onToggleMobileSidebar}
        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        aria-label="Toggle navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Left: Live Telemetry & Portfolio Stats */}
      <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0 flex-1">
        {/* Core Portfolio SoW Metric */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-900/80 border border-slate-800/80 px-2.5 sm:px-3 py-1.5 rounded-xl">
          <span className="text-slate-400 font-medium text-xs hidden sm:inline">Portfolio SoW:</span>
          <span className="text-slate-400 font-medium text-xs sm:hidden">SoW:</span>
          <span className="font-bold text-cyan-300 font-sans text-xs">{sowPct}{typeof sowPct === 'number' ? '%' : ''}</span>
          {typeof sowDrop === 'number' && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-full">
              <TrendingDown className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">{sowDrop} pp</span>
            </span>
          )}
        </div>

        {/* Rev at Risk — hidden on very small screens */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-900/80 border border-slate-800/80 px-3 py-1.5 rounded-xl">
          <span className="text-slate-400 font-medium text-xs">Rev at Risk:</span>
          <span className="font-bold text-rose-400 font-sans text-xs">₹{revRiskM}M</span>
        </div>

        {/* Cohort stats — hidden on mobile and tablet */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 border border-slate-800/80 px-3 py-1.5 rounded-xl">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400 font-medium text-xs">Cohort:</span>
          <span className="font-bold text-indigo-300 font-sans text-xs">444.1K Txns • 38.2K Cust</span>
        </div>

        {/* Live Stream Indicator — only on xl */}
        {liveMetrics && liveMetrics.events_per_second !== undefined && (
          <div className="hidden xl:flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Live:</span>
            <span className="font-bold text-emerald-300 font-sans">
              {liveMetrics.events_per_second > 0 ? `${liveMetrics.events_per_second.toFixed(1)} evt/s` : 'Idle'}
            </span>
          </div>
        )}
      </div>

      {/* Right: Search, Notifications, Actions, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
        {/* Quick Search — hidden on mobile */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:flex items-center w-48 lg:w-60">
          <input
            type="text"
            placeholder="Search Cust ID / Ctrl+K..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs rounded-xl pl-8 pr-12 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="absolute right-1.5 top-1.5 px-1.5 py-0.5 text-[9px] font-mono bg-slate-800/90 text-slate-400 rounded border border-slate-700/80 hover:text-slate-200 cursor-pointer flex items-center gap-0.5"
            >
              <Command className="w-2.5 h-2.5" />K
            </button>
          )}
        </form>

        {/* Notifications */}
        <NotificationCenter onNavigateAlerts={onNavigateAlerts} />

        {/* AI Analyst */}
        <button
          onClick={() => setIsAIAnalystOpen(true)}
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-950/60 border border-indigo-400/30 transition-all cursor-pointer active:scale-95 group"
          title="Open Autonomous AI Analyst"
        >
          <Bot className="w-4 h-4 shrink-0 text-indigo-100 group-hover:rotate-6 transition-transform" />
          <span className="hidden sm:inline">AI Analyst</span>
          <Sparkles className="w-3 h-3 text-cyan-200 hidden lg:inline animate-pulse" />
        </button>

        {/* Executive Brief */}
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
          title="Open Executive Brief"
        >
          <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="hidden md:inline">Executive Brief</span>
        </button>

        {/* User Avatar */}
        <div className="pl-1 sm:pl-2 border-l border-slate-800 flex items-center">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};
