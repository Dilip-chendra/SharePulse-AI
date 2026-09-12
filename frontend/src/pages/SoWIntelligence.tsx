import React, { useEffect, useState } from 'react';
import { fetchSoW } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';
import { useFilters } from '../context/FilterContext';
import { 
  TrendingDown, 
  Crown, 
  BarChart3,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export const SoWIntelligence: React.FC = () => {
  const { 
    appliedFiscalYear, 
    appliedMembership, 
    appliedCategory, 
    appliedSegment,
    filterVersion,
    isFilterApplied 
  } = useFilters();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSoW({
      fiscalYear: appliedFiscalYear,
      membership: appliedMembership,
      category: appliedCategory,
      segment: appliedSegment
    })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion]);

  if (loading || !data) return <div className="p-8 text-slate-400 font-mono text-xs animate-pulse">Loading SoW Intelligence...</div>;

  const { overall, monthly_trend, prime_breakdown, category_breakdown } = data;

  const displayMonthlyTrend = appliedFiscalYear === "FY25" 
    ? (monthly_trend || []).slice(0, 12)
    : appliedFiscalYear === "FY26"
    ? (monthly_trend || []).slice(12, 24)
    : (monthly_trend || []);

  const displayPrimeBreakdown = appliedMembership === "Prime"
    ? (prime_breakdown || []).filter((p: any) => p.membership_type === "Prime")
    : appliedMembership === "Non-Prime"
    ? (prime_breakdown || []).filter((p: any) => p.membership_type === "Non-Prime")
    : (prime_breakdown || []);

  const displayCategoryBreakdown = appliedCategory !== "All"
    ? (category_breakdown || []).filter((c: any) => c.category.toLowerCase().includes(appliedCategory.toLowerCase()))
    : (category_breakdown || []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Share of Wallet (SoW) Intelligence Engine</h2>
        <p className="text-xs text-slate-400">Deep-dive into 24-month SoW dynamics across time horizons, Prime status, and merchandise categories.</p>
      </div>

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
          <span className="text-[11px] text-slate-400">Showing {displayCategoryBreakdown.length} Categories</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="FY25 HSIC Baseline SoW"
          value={`${overall.fy25_sow_pct}%`}
          subtitle="Aug 2024 - Jul 2025 Net Sales"
          icon={BarChart3}
          accentColor="brand"
        />
        <MetricCard
          title="FY26 HSIC Final SoW"
          value={`${overall.fy26_sow_pct}%`}
          subtitle="Aug 2025 - Jul 2026 Net Sales"
          delta={`${overall.sow_collapse_pp} pp`}
          isPositive={false}
          icon={TrendingDown}
          accentColor="rose"
        />
        <MetricCard
          title="Relative SoW Contraction"
          value={`${overall.relative_collapse_pct}%`}
          subtitle="Portfolio payment share loss"
          icon={TrendingDown}
          accentColor="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-card border border-surface-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-1">Monthly Payment Method Shares Trend</h3>
          <p className="text-xs text-slate-400 mb-4">Tracking migration away from HSIC into Wallet and Cash/UPI</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayMonthlyTrend}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `${v}%`} domain={[0, 45]} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#1F293D", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Line type="monotone" dataKey="sow_pct" name="HSIC SoW" stroke="#6366F1" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="wallet_share_pct" name="MetroMart Wallet" stroke="#F59E0B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="upi_share_pct" name="Cash/UPI" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="other_cc_share_pct" name="Other Credit Cards" stroke="#EC4899" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Prime vs Non-Prime SoW Breakdown</h3>
            <p className="text-xs text-slate-400 mb-4">Evaluating cashback impact on customer card usage</p>

            <div className="space-y-4">
              {displayPrimeBreakdown.map((p: any, i: number) => (
                <div key={i} className="bg-surface-dark border border-surface-border rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center space-x-1.5">
                      {p.membership_type === "Prime" && <Crown className="w-4 h-4 text-amber-400 mr-1" />}
                      <span>{p.membership_type}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-300">{p.sow_pct}% SoW</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-slate-400">
                    <div>FY25 SoW: <strong className="text-slate-200">{p.fy25_sow_pct}%</strong></div>
                    <div>FY26 SoW: <strong className="text-slate-200">{p.fy26_sow_pct}%</strong></div>
                  </div>
                  <div className="text-[11px] font-mono text-accent-rose">
                    Change: <strong>{p.sow_change_pp} pp</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-amber-400/90 bg-amber-950/30 border border-amber-500/20 p-3 rounded-lg mt-4 leading-relaxed">
            <strong>Key Finding:</strong> Prime SoW (23.75%) is identical to Non-Prime (23.81%), indicating that 5% Grocery and 3% Electronics rewards are underpromoted.
          </p>
        </div>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-1">Category-Level Share of Wallet Matrix</h3>
        <p className="text-xs text-slate-400 mb-4">Analysis of net spend, HSIC SoW, and payment method mix across 10 categories</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-dark text-slate-400 uppercase font-mono text-[10px] border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Total Net Spend</th>
                <th className="py-3 px-4">HSIC Spend</th>
                <th className="py-3 px-4">HSIC SoW</th>
                <th className="py-3 px-4">FY25 → FY26</th>
                <th className="py-3 px-4">Wallet Share</th>
                <th className="py-3 px-4">UPI Share</th>
                <th className="py-3 px-4">Other CC Share</th>
                <th className="py-3 px-4">Avg Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-mono text-slate-300">
              {displayCategoryBreakdown.map((c: any, i: number) => (
                <tr key={i} className="hover:bg-surface-hover/50">
                  <td className="py-3 px-4 font-sans font-semibold text-white">{c.category}</td>
                  <td className="py-3 px-4">₹{(c.total_net_spend / 1e6).toFixed(1)}M</td>
                  <td className="py-3 px-4 text-brand-300">₹{(c.hsic_net_spend / 1e6).toFixed(1)}M</td>
                  <td className="py-3 px-4 font-bold text-white">{c.sow_pct}%</td>
                  <td className="py-3 px-4 text-accent-rose">{c.sow_change_pp} pp</td>
                  <td className="py-3 px-4 text-amber-400">{c.wallet_share_pct}%</td>
                  <td className="py-3 px-4 text-emerald-400">{c.upi_share_pct}%</td>
                  <td className="py-3 px-4 text-pink-400">{c.other_cc_share_pct}%</td>
                  <td className="py-3 px-4">₹{c.avg_sales_ticket.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
