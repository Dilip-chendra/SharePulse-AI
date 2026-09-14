import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  ArrowRightLeft, 
  ShoppingBag, 
  Gift, 
  Radar, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { SoWIntelligence } from './SoWIntelligence';
import { PaymentMigration } from './PaymentMigration';
import { BigTicketRecovery } from './BigTicketRecovery';
import { PrimeRewardIntelligence } from './PrimeRewardIntelligence';
import { AttritionRadar } from './AttritionRadar';
import { useFilters } from '../context/FilterContext';
import { fetchSoW } from '../services/api';
import { ClassificationBadge } from '../components/common/ClassificationBadge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

interface DiagnoseWorkspaceProps {
  initialTab?: string;
  onTabChange?: (tab: string) => void;
}

interface TabDef {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
  evidenceTag: 'OBSERVED' | 'MODEL_DERIVED' | 'HYPOTHESIS';
}

const TABS: TabDef[] = [
  {
    id: 'sow',
    label: 'Share of Wallet',
    icon: PieChart,
    badge: '28.9% → 19.5%',
    description: 'Contracting HSIC share across fiscal years, quarters, and membership tiers',
    evidenceTag: 'OBSERVED'
  },
  {
    id: 'migration',
    label: 'Payment Rails',
    icon: ArrowRightLeft,
    badge: 'Wallet 35.7%',
    description: 'Sankey rail migration into MetroMart Wallet & Cash/UPI',
    evidenceTag: 'OBSERVED'
  },
  {
    id: 'category',
    label: 'Category Migration',
    icon: Layers,
    badge: '11 Categories',
    description: 'Electronics & Durables penetration decay and category-level share leakage',
    evidenceTag: 'OBSERVED'
  },
  {
    id: 'big-ticket',
    label: 'Ticket Size & Basket',
    icon: ShoppingBag,
    badge: '11.2% on >₹5k',
    description: 'High-ticket displacement where HSIC loses 88.8% of spend to other rails',
    evidenceTag: 'OBSERVED'
  },
  {
    id: 'cohorts',
    label: 'Decay & Defection',
    icon: Radar,
    badge: '10,098 At-Risk',
    description: 'Silent Defector cohort detection and behavioral spend velocity collapse',
    evidenceTag: 'MODEL_DERIVED'
  },
  {
    id: 'rewards',
    label: 'Reward Leakage',
    icon: Gift,
    badge: '₹5.52M Forfeited',
    description: '19,423 Prime cardholders with unredeemed cashback losing co-brand engagement',
    evidenceTag: 'OBSERVED'
  }
];

export const DiagnoseWorkspace: React.FC<DiagnoseWorkspaceProps> = ({ 
  initialTab = 'sow', 
  onTabChange 
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment } = useFilters();
  const [catData, setCatData] = useState<any[]>([]);
  const [loadingCat, setLoadingCat] = useState(false);

  useEffect(() => {
    if (initialTab && TABS.some(t => t.id === initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  useEffect(() => {
    if (activeTab === 'category') {
      setLoadingCat(true);
      fetchSoW({
        fiscalYear: appliedFiscalYear,
        membership: appliedMembership,
        category: appliedCategory,
        segment: appliedSegment
      })
        .then((res: any) => {
          if (res && res.category_breakdown) {
            setCatData(res.category_breakdown);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingCat(false));
    }
  }, [activeTab, appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment]);

  const currentTabMeta = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#080B11]">
      {/* Workspace Header & Tab Bar */}
      <div className="border-b border-[#1A2234] bg-[#0A0E17]/90 backdrop-blur-md px-6 pt-5 pb-0 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                Diagnostic Studio
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 font-mono">
                DATA → DIAGNOSE
              </span>
              <ClassificationBadge type={currentTabMeta.evidenceTag} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-dimensional root-cause intelligence across 444,118 transactions and 45,000 customers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-[#0D1321] border border-[#1E293B] px-3 py-1.5 rounded-lg">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Active Lens: <span className="text-slate-200 font-semibold">{currentTabMeta.label}</span></span>
          </div>
        </div>

        {/* Diagnostic Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`
                  flex items-center gap-2.5 px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap
                  ${isActive
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-500/[0.06]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:border-slate-700'
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`
                    text-[10px] px-1.5 py-0.5 rounded font-mono font-normal
                    ${isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }
                  `}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Viewport */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'sow' && <SoWIntelligence />}
        {activeTab === 'migration' && <PaymentMigration />}
        {activeTab === 'big-ticket' && <BigTicketRecovery />}
        {activeTab === 'cohorts' && <AttritionRadar />}
        {activeTab === 'rewards' && <PrimeRewardIntelligence />}

        {activeTab === 'category' && (
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Category Migration Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B]">
                <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                  Electronics Penetration Decay
                </div>
                <div className="text-2xl font-bold text-rose-400 font-mono">−14.8 pp</div>
                <div className="text-xs text-slate-500 mt-1">HSIC share dropped from 38.2% to 23.4%</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B]">
                <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                  Grocery Share Displacement
                </div>
                <div className="text-2xl font-bold text-amber-400 font-mono">₹48.2M Migrated</div>
                <div className="text-xs text-slate-500 mt-1">Absorbed predominantly by MetroMart Wallet</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B]">
                <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                  Appliance Co-brand Gap
                </div>
                <div className="text-2xl font-bold text-blue-400 font-mono">11.4% SoW</div>
                <div className="text-xs text-slate-500 mt-1">Competitor cards capture 88.6% of ticket values &gt;₹10k</div>
              </div>
            </div>

            {/* Category Chart */}
            <div className="p-6 rounded-xl bg-[#0D1321] border border-[#1E293B]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Category Share-of-Wallet Shift (FY25 vs FY26)</h2>
                  <p className="text-xs text-slate-400">Comparing HSIC card share percentage across merchandise divisions</p>
                </div>
                <ClassificationBadge type="OBSERVED" />
              </div>

              {loadingCat ? (
                <div className="h-72 flex items-center justify-center text-slate-500 text-xs font-mono animate-pulse">
                  Loading Category Intelligence...
                </div>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={catData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis 
                        dataKey="category" 
                        stroke="#64748B" 
                        fontSize={11} 
                        angle={-25} 
                        textAnchor="end" 
                        interval={0}
                      />
                      <YAxis stroke="#64748B" fontSize={11} unit="%" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1E293B', borderRadius: '8px' }}
                        formatter={(val: any) => [`${val}%`, '']}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="fy25_sow_pct" name="FY25 HSIC SoW %" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="fy26_sow_pct" name="FY26 HSIC SoW %" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Category Breakdown Table */}
            <div className="rounded-xl border border-[#1E293B] overflow-hidden bg-[#0D1321]">
              <div className="px-5 py-4 border-b border-[#1E293B] flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Category Spend & Migration Summary
                </span>
                <span className="text-xs text-slate-500 font-mono">11 Categories Audited</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0A0E17] text-slate-400 font-mono uppercase text-[10px] border-b border-[#1E293B]">
                    <tr>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Total Net Spend</th>
                      <th className="px-4 py-3">HSIC Spend</th>
                      <th className="px-4 py-3">FY25 SoW</th>
                      <th className="px-4 py-3">FY26 SoW</th>
                      <th className="px-4 py-3">YoY Shift (pp)</th>
                      <th className="px-4 py-3">Wallet Share</th>
                      <th className="px-4 py-3">UPI Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A2234] font-mono">
                    {catData.map((row, idx) => {
                      const change = row.sow_change_pp || (row.fy26_sow_pct - row.fy25_sow_pct);
                      return (
                        <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-200">{row.category}</td>
                          <td className="px-4 py-3 text-slate-300">₹{(row.total_net_spend / 1e6).toFixed(2)}M</td>
                          <td className="px-4 py-3 text-slate-300">₹{(row.hsic_net_spend / 1e6).toFixed(2)}M</td>
                          <td className="px-4 py-3 text-blue-400">{row.fy25_sow_pct?.toFixed(1)}%</td>
                          <td className="px-4 py-3 text-rose-400">{row.fy26_sow_pct?.toFixed(1)}%</td>
                          <td className={`px-4 py-3 font-semibold ${change < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {change > 0 ? `+${change.toFixed(1)}` : change?.toFixed(1)} pp
                          </td>
                          <td className="px-4 py-3 text-amber-400">{row.wallet_share_pct?.toFixed(1)}%</td>
                          <td className="px-4 py-3 text-purple-400">{row.upi_share_pct?.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
