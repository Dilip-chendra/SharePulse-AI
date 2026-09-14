import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PieChart, 
  Users, 
  Target,
  Sparkles,
  FlaskConical, 
  Database,
  FileCheck,
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
  ArrowRightLeft,
  ShoppingBag,
  Gift,
  Radar,
  Shapes,
  Sliders,
  Activity
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export interface NavSection {
  id: string;
  title: string;
  icon: React.ElementType;
  primaryPageId: string;
  items: NavItem[];
}

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onOpenCommandPalette?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onOpenCommandPalette }) => {
  // Clean Enterprise 9-Module Navigation Structure (Synchrony Analytics Hackathon 2026)
  const navSections: NavSection[] = [
    {
      id: "overview",
      title: "Overview",
      icon: LayoutDashboard,
      primaryPageId: "overview",
      items: [
        { id: "overview", label: "Command Center", icon: LayoutDashboard, badge: "LIVE" },
        { id: "pulse", label: "Business Pulse", icon: Activity, badge: "STREAM" },
      ]
    },
    {
      id: "diagnose",
      title: "Diagnose",
      icon: PieChart,
      primaryPageId: "diagnose",
      items: [
        { id: "diagnose", label: "Diagnostic Studio", icon: PieChart },
        { id: "sow", label: "Share of Wallet", icon: PieChart },
        { id: "migration", label: "Payment Rails", icon: ArrowRightLeft },
        { id: "big-ticket", label: "Ticket Size & Basket", icon: ShoppingBag },
        { id: "prime-reward", label: "Prime Reward Leakage", icon: Gift },
        { id: "attrition", label: "Decay & Silent Defection", icon: Radar },
      ]
    },
    {
      id: "customers",
      title: "Customers",
      icon: Users,
      primaryPageId: "customers",
      items: [
        { id: "customers", label: "Customer 360", icon: Users, badge: "45K" },
        { id: "segmentation", label: "Archetypes & Clusters", icon: Shapes },
      ]
    },
    {
      id: "opportunities",
      title: "Opportunities",
      icon: Target,
      primaryPageId: "opportunities",
      items: [
        { id: "opportunities", label: "Ranked Pipeline", icon: Target, badge: "₹51.25M" },
      ]
    },
    {
      id: "nba",
      title: "Next Best Actions",
      icon: Sparkles,
      primaryPageId: "nba",
      items: [
        { id: "nba", label: "Decision Engine", icon: Sparkles, badge: "AI" },
        { id: "strategy", label: "Action Economics", icon: Sliders },
      ]
    },
    {
      id: "experiments",
      title: "Experiments",
      icon: FlaskConical,
      primaryPageId: "experiments",
      items: [
        { id: "experiments", label: "Experiment Center", icon: FlaskConical, badge: "RCT" },
      ]
    },
    {
      id: "data",
      title: "Data",
      icon: Database,
      primaryPageId: "data",
      items: [
        { id: "data", label: "Ingestion & Quality", icon: Database, badge: "DUAL" },
      ]
    },
    {
      id: "evidence",
      title: "Evidence",
      icon: FileCheck,
      primaryPageId: "evidence",
      items: [
        { id: "evidence", label: "Auditable Claims & Logic", icon: FileCheck, badge: "AUDIT" },
      ]
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      primaryPageId: "settings",
      items: [
        { id: "settings", label: "Environment & Health", icon: Settings },
      ]
    }
  ];

  // Helper to find which section contains the active page
  const findSectionForPage = (pageId: string) => {
    return navSections.find(sec => sec.items.some(item => item.id === pageId) || sec.primaryPageId === pageId)?.id || "overview";
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const activeSecId = findSectionForPage(activePage);
    return { [activeSecId]: true };
  });

  useEffect(() => {
    const activeSecId = findSectionForPage(activePage);
    setOpenSections(prev => ({
      ...prev,
      [activeSecId]: true
    }));
  }, [activePage]);

  const toggleSection = (secId: string, primaryPageId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
    // If user clicks the section header, navigate to primary page
    setActivePage(primaryPageId);
  };

  return (
    <aside className="w-64 bg-[#080C16] border-r border-slate-800/80 flex flex-col h-screen select-none shrink-0 shadow-2xl">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <BrandLogo size="md" />
      </div>

      {/* Dataset Environment Indicator */}
      <div className="px-3 pt-3 pb-1">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-semibold">Synchrony FY25–26</span>
          </div>
          <span className="text-[9px] text-slate-400 font-bold px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700">
            OFFICIAL
          </span>
        </div>
      </div>

      {/* Global Command Palette Trigger */}
      <div className="px-3 py-2">
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
      <div className="flex-1 overflow-y-auto px-2.5 py-1 space-y-1 custom-scrollbar">
        {navSections.map((section) => {
          const isOpen = !!openSections[section.id];
          const isSectionActive = activePage === section.primaryPageId || section.items.some(item => item.id === activePage);
          const SectionIcon = section.icon;

          return (
            <div key={section.id} className="rounded-xl overflow-hidden transition-all">
              {/* Main Section Header Button */}
              <button
                type="button"
                onClick={() => toggleSection(section.id, section.primaryPageId)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                  isSectionActive
                    ? "bg-slate-900/90 text-indigo-300 border border-indigo-500/40 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <SectionIcon className={`w-4 h-4 shrink-0 transition-colors ${
                    isSectionActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                  }`} />
                  <span className="tracking-wide text-xs font-bold truncate">
                    {section.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {section.items.length > 1 && (
                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.2 rounded bg-slate-800/80">
                      {section.items.length}
                    </span>
                  )}
                  {section.items.length > 1 ? (
                    isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform duration-200" />
                    )
                  ) : null}
                </div>
              </button>

              {/* Sub-sections List (Collapsible, only for multi-item sections) */}
              {isOpen && section.items.length > 1 && (
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
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-950/80 font-semibold'
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
                              : item.badge === 'STREAM'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30 animate-pulse'
                              : item.badge === 'LIVE'
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
            <span className="font-mono text-slate-300">Decision Engine v3.0</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
            ONLINE
          </span>
        </div>
      </div>
    </aside>
  );
};
