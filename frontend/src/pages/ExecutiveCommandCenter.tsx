import React from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { ClassificationBadge } from '../components/common/ClassificationBadge';
import { useFilters } from '../context/FilterContext';
import { 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Sparkles, 
  ArrowRight, 
  Zap,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

interface Props {
  overviewData: any;
  setActivePage: (p: string) => void;
}

export const ExecutiveCommandCenter: React.FC<Props> = ({ overviewData, setActivePage }) => {
  const { 
    appliedFiscalYear, 
    appliedMembership, 
    appliedCategory, 
    appliedSegment,
    isFilterApplied 
  } = useFilters();

  if (!overviewData) return <div className="p-8 text-slate-400 font-mono text-xs animate-pulse">Loading Executive Command Center...</div>;

  const { kpis, executive_narrative, monthly_trend, payment_mix, top_insights } = overviewData;

  // Filter monthly trend if specific fiscal year is selected
  const displayMonthlyTrend = appliedFiscalYear === "FY25" 
    ? (monthly_trend || []).slice(0, 12)
    : appliedFiscalYear === "FY26"
    ? (monthly_trend || []).slice(12, 24)
    : (monthly_trend || []);

  const paymentColors: Record<string, string> = {
    "MetroMart Wallet": "#F59E0B",
    "HSIC Bank Credit Card": "#6366F1",
    "Cash/UPI": "#10B981",
    "Other Bank Credit Card": "#EC4899",
    "Debit Card": "#06B6D4"
  };

  return (
    <div className="space-y-6">
      {/* Active Filter Notification Bar */}
      {isFilterApplied && (
        <div className="bg-brand-950/40 border border-brand-500/30 rounded-xl px-4 py-2 flex items-center justify-between text-xs font-mono text-brand-300">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Filter Applied:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {appliedFiscalYear !== "All" && <span className="bg-brand-900/80 px-2 py-0.5 rounded text-white border border-brand-700/50">{appliedFiscalYear}</span>}
              {appliedMembership !== "All" && <span className="bg-amber-950/80 px-2 py-0.5 rounded text-amber-300 border border-amber-700/50">{appliedMembership}</span>}
              {appliedCategory !== "All" && <span className="bg-cyan-950/80 px-2 py-0.5 rounded text-cyan-300 border border-cyan-700/50">{appliedCategory}</span>}
              {appliedSegment !== "All" && <span className="bg-purple-950/80 px-2 py-0.5 rounded text-purple-300 border border-purple-700/50">{appliedSegment}</span>}
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Dynamically Calibrated View</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-surface-card to-surface-card border border-accent-rose/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-900/60 text-accent-rose border border-rose-700/50 flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" /> CRITICAL SOW CONTRACTION DETECTED
              </span>
              <ClassificationBadge type="OBSERVED" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Share-of-Wallet Collapsed by {Math.abs(kpis.sow_collapse_pp)} pp ({kpis.fy25_sow_pct}% → {kpis.fy26_sow_pct}%)
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {executive_narrative}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => setActivePage("opportunity")}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
            >
              <span>View Recovery Queue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage("strategy")}
              className="px-4 py-2.5 rounded-xl bg-surface-cardMuted hover:bg-surface-hover border border-surface-border text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <span>Simulate Budget</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Portfolio SoW"
          value={`${kpis.overall_sow_pct}%`}
          subtitle={`FY25: ${kpis.fy25_sow_pct}% | FY26: ${kpis.fy26_sow_pct}%`}
          delta={`${kpis.sow_collapse_pp} pp`}
          isPositive={false}
          icon={TrendingDown}
          accentColor="rose"
        />
        <MetricCard
          title="Revenue at Risk"
          value={`₹${(kpis.revenue_at_risk / 1e6).toFixed(1)}M`}
          subtitle={`Across ${kpis.customers_at_risk.toLocaleString()} at-risk cardholders`}
          icon={AlertTriangle}
          accentColor="rose"
        />
        <MetricCard
          title="Recoverable Opportunity"
          value={`₹${(kpis.recoverable_opportunity / 1e6).toFixed(1)}M`}
          subtitle="Feasibility-scaled addressable spend"
          icon={Target}
          accentColor="emerald"
        />
        <MetricCard
          title="Expected Net Contribution"
          value={`₹${(kpis.expected_net_contribution / 1e6).toFixed(1)}M`}
          subtitle={`Portfolio Campaign ROI: ${kpis.portfolio_roi}x`}
          delta={`${kpis.portfolio_roi}x ROI`}
          isPositive={true}
          icon={Zap}
          accentColor="cyan"
        />
      </div>

      {/* Trajectory & Payment Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">24-Month Share-of-Wallet Trajectory (FY25 - FY26)</h3>
                <ClassificationBadge type="OBSERVED" />
              </div>
              <p className="text-xs text-slate-400">Monthly HSIC net spend proportion against total MetroMart customer spend</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface-cardMuted border border-surface-border text-slate-300">
              Aug 2024 - Jul 2026
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayMonthlyTrend}>
                <defs>
                  <linearGradient id="sowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `${v}%`} tickLine={false} domain={[10, 40]} />
                <Tooltip 
                  formatter={(val: any) => [`${val}%`, "HSIC SoW"]}
                  contentStyle={{ backgroundColor: "#111827", borderColor: "#1F293D", borderRadius: "8px", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="sow_pct" stroke="#6366F1" strokeWidth={3} fill="url(#sowGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-bold text-white">Active Payment Mix Share</h3>
              <ClassificationBadge type="OBSERVED" />
            </div>
            <p className="text-xs text-slate-400 mb-4">Distribution of ₹{(kpis.total_metro_spend/1e6).toFixed(1)}M Net Spend</p>

            <div className="space-y-3">
              {payment_mix.map((p: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{p.payment_method}</span>
                    <span className="font-mono font-bold text-white">{p.share_pct}% (₹{(p.net_spend/1e6).toFixed(1)}M)</span>
                  </div>
                  <div className="w-full h-2 bg-surface-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${p.share_pct}%`,
                        backgroundColor: paymentColors[p.payment_method] || "#94A3B8" 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border text-xs text-slate-400 flex items-center justify-between">
            <span>Dominant Sink: <strong className="text-amber-400">MetroMart Wallet (35.1%)</strong></span>
            <button onClick={() => setActivePage("migration")} className="text-brand-400 hover:text-brand-300 font-medium flex items-center cursor-pointer">
              View Flows <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Discovered Insights Preview */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-bold text-white">Top Discovered Empirical Breakthroughs</h3>
          </div>
          <button
            onClick={() => setActivePage("ai-discovery")}
            className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center cursor-pointer"
          >
            Explore All Insights ({top_insights.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top_insights.map((ins: any, i: number) => (
            <div key={i} className="bg-surface-dark border border-surface-border rounded-xl p-4 flex flex-col justify-between hover:border-brand-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">{ins.id}</span>
                  <ClassificationBadge type={ins.taxonomy || ins.classification || "OBSERVED"} />
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2">{ins.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">{ins.finding}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-border text-[11px] flex justify-between items-center font-mono">
                <span className="text-slate-500">Value:</span>
                <span className="font-bold text-accent-emerald">{ins.recoverable_spend_potential || ins.expected_recoverable_value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
