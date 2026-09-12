import React, { useState } from 'react';
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
  Server
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
  items: NavItem[];
}

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onOpenCommandPalette?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onOpenCommandPalette }) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (secId: string) => {
    setCollapsedSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const navSections: NavSection[] = [
    {
      id: "overview",
      title: "OVERVIEW",
      items: [
        { id: "overview", label: "Executive Command", icon: LayoutDashboard, badge: "COMMAND" },
        { id: "alerts", label: "Alerts & Incidents", icon: AlertTriangle, badge: "4" },
      ]
    },
    {
      id: "intelligence",
      title: "INTELLIGENCE",
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
      items: [
        { id: "customers", label: "Customer 360 Store", icon: Users },
        { id: "segmentation", label: "Customer Archetypes", icon: Shapes },
        { id: "leakage", label: "Margin Bleed Index", icon: TrendingDown },
      ]
    },
    {
      id: "decisions",
      title: "DECISIONS",
      items: [
        { id: "nba", label: "Next Best Action", icon: Zap },
        { id: "strategy", label: "Strategy Lab", icon: Sliders },
        { id: "actions", label: "Action Center Matrix", icon: Shield, badge: "PROFIT" },
        { id: "automations", label: "Automations & HITL", icon: Cpu },
      ]
    },
    {
      id: "experiments",
      title: "EXPERIMENTS",
      items: [
        { id: "experiments", label: "Experiment & Uplift", icon: FlaskConical },
      ]
    },
    {
      id: "ai",
      title: "AI & DISCOVERY",
      items: [
        { id: "ai-discovery", label: "Autonomous Discovery", icon: Zap, badge: "AI" },
        { id: "model-explainability", label: "Model Explainability", icon: Shield },
      ]
    },
    {
      id: "data",
      title: "DATA & PIPELINE",
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
      items: [
        { id: "model-health", label: "Model Monitoring (PSI)", icon: Shield },
        { id: "audit", label: "Audit & Security", icon: Shield },
        { id: "governance", label: "Data Governance", icon: FileCheck },
      ]
    },
    {
      id: "live-stream",
      title: "LIVE INGESTION",
      items: [
        { id: "pulse", label: "Business Pulse (Live)", icon: Activity, badge: "STREAMING" },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#080C16] border-r border-slate-800/80 flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <BrandLogo size="md" />
      </div>

      {/* Global Command Palette Trigger */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-sm group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:text-cyan-300" />
            <span>Search or jump to...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">Ctrl+K</kbd>
        </button>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 custom-scrollbar">
        {navSections.map((section) => {
          const isCollapsed = collapsedSections[section.id];
          return (
            <div key={section.id} className="space-y-1">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-200 tracking-wider transition-colors cursor-pointer"
              >
                <span>{section.title}</span>
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-950 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badge === 'STREAMING'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30 animate-pulse'
                              : item.badge === 'COMMAND'
                              ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
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
