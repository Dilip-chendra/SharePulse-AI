import React, { useState, useEffect } from 'react';
import { 
  Activity,
  LayoutDashboard, 
  AlertTriangle,
  PieChart, 
  ArrowRightLeft, 
  Radar, 
  Target,
  ShoppingBag,
  Gift,
  RotateCcw,
  Users, 
  Shapes, 
  TrendingDown, 
  Zap, 
  Sliders, 
  Shield,
  Cpu,
  FlaskConical, 
  Database,
  FileCheck,
  GitBranch,
  Search,
  ChevronDown,
  ChevronRight,
  Server,
  Sparkles,
  Bot
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  id: string;
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onOpenCommandPalette?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onOpenCommandPalette }) => {
  const navSections: NavSection[] = [
    {
      id: "overview",
      title: "OVERVIEW",
      icon: LayoutDashboard,
      items: [
        { id: "overview", label: "Executive Command", icon: LayoutDashboard, badge: "COMMAND" },
        { id: "alerts", label: "Alerts & Incidents", icon: AlertTriangle, badge: "4" },
      ]
    },
    {
      id: "intelligence",
      title: "INTELLIGENCE",
      icon: PieChart,
      items: [
        { id: "sow", label: "Share of Wallet", icon: PieChart },
        { id: "migration", label: "Payment Migration", icon: ArrowRightLeft },
        { id: "attrition", label: "Attrition Radar", icon: Radar },
        { id: "opportunity", label: "Opportunity Radar", icon: Target },
        { id: "big-ticket", label: "Big-Ticket Recovery", icon: ShoppingBag },
        { id: "prime-reward", label: "Prime Rewards", icon: Gift },
        { id: "return-friction", label: "Return Friction", icon: RotateCcw },
      ]
    },
    {
      id: "customers",
      title: "CUSTOMERS",
      icon: Users,
      items: [
        { id: "customers", label: "Customer 360 Store", icon: Users },
        { id: "segmentation", label: "Customer Archetypes", icon: Shapes },
        { id: "leakage", label: "Margin Bleed Index", icon: TrendingDown },
      ]
    },
    {
      id: "decisions",
      title: "DECISIONS",
      icon: Zap,
      items: [
        { id: "nba", label: "Next Best Action", icon: Sparkles },
        { id: "strategy", label: "Strategy Lab", icon: Sliders },
        { id: "actions", label: "Action Center Matrix", icon: Shield, badge: "PROFIT" },
        { id: "automations", label: "Automations & HITL", icon: Cpu },
      ]
    },
    {
      id: "experiments",
      title: "EXPERIMENTS",
      icon: FlaskConical,
      items: [
        { id: "experiments", label: "Experiment & Uplift", icon: FlaskConical },
      ]
    },
    {
      id: "ai",
      title: "AI & DISCOVERY",
      icon: Bot,
      items: [
        { id: "ai-discovery", label: "Autonomous Discovery", icon: Sparkles, badge: "AI" },
        { id: "model-explainability", label: "Model Explainability", icon: Shield },
      ]
    },
    {
      id: "data",
      title: "DATA & PIPELINE",
      icon: Database,
      items: [
        { id: "connections", label: "Data Connections", icon: Server, badge: "5 FEEDS" },
        { id: "datasets", label: "Dataset Manager", icon: Database },
        { id: "data-health", label: "Data Health & Drift", icon: FileCheck },
        { id: "lineage", label: "Visual Data Lineage", icon: GitBranch },
      ]
    },
    {
      id: "governance",
      title: "GOVERNANCE",
      icon: Shield,
      items: [
        { id: "model-health", label: "Model Monitoring (PSI)", icon: Shield },
        { id: "audit", label: "Audit & Security", icon: Shield },
        { id: "governance", label: "Data Governance", icon: FileCheck },
      ]
    },
    {
      id: "live-stream",
      title: "LIVE INGESTION",
      icon: Activity,
      items: [
        { id: "pulse", label: "Business Pulse (Live)", icon: Activity, badge: "STREAMING" },
      ]
    }
  ];

  // Helper to find which section contains the active page
  const findSectionForPage = (pageId: string) => {
    return navSections.find(sec => sec.items.some(item => item.id === pageId))?.id || "overview";
  };

  // Keep track of which sections are expanded.
  // Initialize with only the active section open (or empty) so it starts clean.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const activeSecId = findSectionForPage(activePage);
    return { [activeSecId]: true };
  });

  // When activePage changes, ensure its parent section is open
  useEffect(() => {
    const activeSecId = findSectionForPage(activePage);
    setOpenSections(prev => ({
      ...prev,
      [activeSecId]: true
    }));
  }, [activePage]);

  const toggleSection = (secId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  return (
    <aside className="w-64 bg-[#080C16] border-r border-slate-800/80 flex flex-col h-screen select-none shrink-0 shadow-2xl">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <BrandLogo size="md" />
      </div>

      {/* Global Command Palette Trigger */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
            <span>Search or jump to...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded-md border border-slate-700">Ctrl+K</kbd>
        </button>
      </div>

      {/* Navigation Links Accordion (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1.5 custom-scrollbar">
        {navSections.map((section) => {
          const isOpen = !!openSections[section.id];
          const hasActiveChild = section.items.some(item => item.id === activePage);
          const SectionIcon = section.icon;

          return (
            <div key={section.id} className="rounded-xl overflow-hidden transition-all">
              {/* Main Section Header Button */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                  hasActiveChild
                    ? "bg-slate-900/90 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <SectionIcon className={`w-4 h-4 shrink-0 transition-colors ${
                    hasActiveChild ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                  }`} />
                  <span className="tracking-wide uppercase text-[11px] font-extrabold truncate">
                    {section.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {section.items.length > 0 && (
                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.2 rounded bg-slate-800/80">
                      {section.items.length}
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform duration-200" />
                  )}
                </div>
              </button>

              {/* Sub-sections List (Collapsible) */}
              {isOpen && (
                <div className="mt-1 mb-1.5 ml-3 pl-2.5 border-l border-slate-800/80 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-950/80 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badge === 'STREAMING'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30 animate-pulse'
                              : item.badge === 'COMMAND'
                              ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                              : item.badge === 'AI'
                              ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Profile & Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-slate-300">Engine v2.5.0</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
            CONNECTED
          </span>
        </div>
      </div>
    </aside>
  );
};
