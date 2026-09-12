import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useFilters } from '../../context/FilterContext';
import {
  Bot,
  FileText,
  Search,
  X,
  Sparkles,
  Command,
  Activity,
  Menu,
  TrendingDown,
  LayoutDashboard,
  Shield,
  PieChart,
  ArrowRightLeft,
  Radar,
  Target,
  ShoppingBag,
  Gift,
  RotateCcw,
  Users,
  Shapes,
  Cpu,
  FlaskConical,
  Database,
  FileCheck,
  GitBranch,
  AlertTriangle
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  activePage?: string;
  kpis?: any;
  onOpenCommandPalette?: () => void;
  onNavigateAlerts?: () => void;
  onToggleMobileSidebar?: () => void;
}

const PAGE_META: Record<string, { label: string; icon: React.ElementType }> = {
  'overview': { label: 'Executive Command', icon: LayoutDashboard },
  'alerts': { label: 'Alerts & Incidents', icon: AlertTriangle },
  'sow': { label: 'Share of Wallet', icon: PieChart },
  'migration': { label: 'Payment Migration', icon: ArrowRightLeft },
  'attrition': { label: 'Attrition Radar', icon: Radar },
  'opportunity': { label: 'Opportunity Radar', icon: Target },
  'big-ticket': { label: 'Big-Ticket Recovery', icon: ShoppingBag },
  'prime-reward': { label: 'Prime Rewards', icon: Gift },
  'return-friction': { label: 'Return Friction', icon: RotateCcw },
  'customers': { label: 'Customer 360', icon: Users },
  'segmentation': { label: 'Customer Archetypes', icon: Shapes },
  'leakage': { label: 'Margin Bleed Index', icon: TrendingDown },
  'nba': { label: 'Next Best Action', icon: Sparkles },
  'strategy': { label: 'Strategy Lab', icon: Activity },
  'actions': { label: 'Action Center', icon: Shield },
  'automations': { label: 'Automations & HITL', icon: Cpu },
  'experiments': { label: 'Experiment & Uplift', icon: FlaskConical },
  'connections': { label: 'Data Connections', icon: Database },
  'datasets': { label: 'Dataset Manager', icon: Database },
  'data-health': { label: 'Data Health & Drift', icon: FileCheck },
  'lineage': { label: 'Visual Data Lineage', icon: GitBranch },
  'ai-discovery': { label: 'Autonomous AI Insights', icon: Bot },
  'model-explainability': { label: 'Model Explainability', icon: Shield },
  'model-health': { label: 'Model Monitoring', icon: Shield },
  'audit': { label: 'Audit & Security', icon: Shield },
  'governance': { label: 'Data Governance', icon: FileCheck },
  'pulse': { label: 'Business Pulse (Live)', icon: Activity },
};

export const Navbar: React.FC<NavbarProps> = ({
  activePage = 'overview',
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idNum = parseInt(searchQuery.trim().replace('#', ''));
    if (!isNaN(idNum) && idNum > 0) {
      setSelectedCustomerId(idNum);
    }
  };

  const pageInfo = PAGE_META[activePage] || { label: 'SharePulse Cockpit', icon: LayoutDashboard };
  const PageIcon = pageInfo.icon;

  const sowPct = kpis?.overall_sow_pct !== undefined ? kpis.overall_sow_pct : 23.91;
  const sowDrop = kpis?.sow_collapse_pp !== undefined ? kpis.sow_collapse_pp : 10.03;

  return (
    <header className="h-16 bg-[#080C16]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-md">
      {/* ─── Left Section: Mobile Menu + Active Context & Live Indicator ─── */}
      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0 border border-slate-800"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Active Page Pill */}
        <div className="flex items-center space-x-2.5 py-1 px-2.5 sm:px-3 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-sm shrink-0">
          <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400">
            <PageIcon className="w-4 h-4 shrink-0" />
          </div>
          <span className="font-bold text-white text-xs sm:text-sm tracking-tight truncate max-w-[140px] sm:max-w-[200px] md:max-w-none">
            {pageInfo.label}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Engine
          </span>
        </div>

        {/* Portfolio Quick KPI — Only on wide screens (2xl+) so it NEVER collides */}
        <div className="hidden 2xl:flex items-center space-x-2 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-xl whitespace-nowrap text-xs">
          <span className="text-slate-400">Portfolio SoW:</span>
          <span className="font-bold text-cyan-300 font-sans">{sowPct}%</span>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded-full">
            <TrendingDown className="w-2.5 h-2.5" />
            <span>{sowDrop} pp</span>
          </span>
        </div>
      </div>

      {/* ─── Center Section: Command Search Bar ─── */}
      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-3 sm:mx-6 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
          <input
            type="text"
            placeholder="Search Cardholder ID / Press Ctrl+K..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-xs rounded-xl pl-9 pr-14 py-2 text-slate-200 placeholder-slate-500 focus:outline-none transition-all font-sans shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="absolute right-2 top-2 px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded-md border border-slate-700 hover:text-slate-200 hover:border-slate-600 cursor-pointer flex items-center gap-0.5 transition-colors shadow-sm"
              title="Open Command Palette (Ctrl+K)"
            >
              <Command className="w-3 h-3" />K
            </button>
          )}
        </form>
      </div>

      {/* ─── Right Section: Quick Actions & Profile ─── */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Mobile Search Icon button (triggers command palette on < md) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Search (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Popover */}
        <NotificationCenter onNavigateAlerts={onNavigateAlerts} />

        {/* AI Analyst Action Button */}
        <button
          onClick={() => setIsAIAnalystOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-950/60 border border-indigo-400/30 transition-all cursor-pointer active:scale-95 group shrink-0"
          title="Open Autonomous AI Analyst"
        >
          <Bot className="w-4 h-4 shrink-0 text-indigo-100 group-hover:rotate-6 transition-transform" />
          <span className="hidden sm:inline">AI Analyst</span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-200 hidden lg:inline animate-pulse" />
        </button>

        {/* Executive Brief Button */}
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-sm shrink-0"
          title="Open Executive Brief"
        >
          <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="hidden md:inline">Executive Brief</span>
        </button>

        {/* User Profile Avatar */}
        <div className="pl-1 sm:pl-2 border-l border-slate-800 flex items-center shrink-0">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};
