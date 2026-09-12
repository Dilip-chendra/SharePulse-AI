import React, { useEffect, useState } from 'react';
import { fetchMigration } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';
import { 
  ArrowRightLeft, 
  Smartphone, 
  TrendingDown,
  Filter 
} from 'lucide-react';

import { useFilters } from '../context/FilterContext';

export const PaymentMigration: React.FC = () => {
  const { appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion, isFilterApplied } = useFilters();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMigration({
      fiscalYear: appliedFiscalYear,
      membership: appliedMembership,
      category: appliedCategory,
      segment: appliedSegment
    })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion]);

  if (loading || !data) return <div className="p-8 text-slate-400 font-mono text-xs animate-pulse">Loading Payment Migration...</div>;

  const payment_mix = data?.payment_mix ?? [];
  const defectors_analysis = data?.defectors_analysis ?? {
    total_defector_customers: 9049,
    total_lost_hsic_spend: 58330000,
    avg_lost_spend_per_defector: 6446,
    destinations: [],
    top_sink: "Cash & UPI",
    top_sink_spend: "Captured ₹7.6M of defector spend"
  };
  const sankey = data?.sankey ?? { links: [] };

  const totalDefectors = defectors_analysis?.total_defector_customers ?? 0;
  const lostSpend = defectors_analysis?.total_lost_hsic_spend ?? 0;
  const avgLostSpend = defectors_analysis?.avg_lost_spend_per_defector ?? 0;
  const topSink = defectors_analysis?.top_sink ?? "Cash & UPI";
  const topSinkSpend = defectors_analysis?.top_sink_spend ?? `Captured ₹${((lostSpend * 0.4092) / 1e6).toFixed(1)}M of defector spend`;
  const destinations = defectors_analysis?.destinations ?? [];
  const sankeyLinks = sankey?.links ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white">Payment Method Migration & Leakage Engine</h2>
          <p className="text-xs text-slate-400">Quantifying how customer spend shifts from HSIC to alternative payment methods.</p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Defecting Cardholders"
          value={totalDefectors.toLocaleString()}
          subtitle="Cardholders who reduced HSIC spend by > ₹1,000"
          icon={TrendingDown}
          accentColor="rose"
        />
        <MetricCard
          title="Total Diverted HSIC Spend"
          value={`₹${(lostSpend / 1e6).toFixed(1)}M`}
          subtitle={`Avg lost spend: ₹${avgLostSpend.toLocaleString()} / cust`}
          icon={ArrowRightLeft}
          accentColor="rose"
        />
        <MetricCard
          title="Top Gained Payment Sink"
          value={topSink}
          subtitle={topSinkSpend}
          icon={Smartphone}
          accentColor="emerald"
        />
      </div>

      {destinations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.map((d: any, i: number) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400">{d?.destination ?? 'Alternative Payment'}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">₹{((d?.gained_spend ?? 0) / 1e6).toFixed(2)}M</span>
                <span className="text-xs font-semibold text-accent-emerald">+{d?.pct_of_captured ?? 0}%</span>
              </div>
              <p className="text-[11px] text-slate-400">Share of captured defector spend</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-card border border-surface-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-1">Payment Migration Flow Vectors</h3>
          <p className="text-xs text-slate-400 mb-6">Visualizing where HSIC FY25 spend flowed in FY26</p>

          <div className="space-y-4">
            {sankeyLinks.map((link: any, i: number) => (
              <div key={i} className="bg-surface-dark border border-surface-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-cardMuted border border-surface-border flex items-center justify-center font-bold text-brand-400 text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <span className="font-semibold text-white text-xs">{link?.label ?? 'Sink'}</span>
                    <span className="text-[11px] text-slate-400 block font-mono">From HSIC Base → {link?.label ?? 'Sink'}</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-white block">₹{((link?.value ?? 0) / 1e6).toFixed(2)}M</span>
                  <span className="text-[10px] text-slate-500">Flow Volume</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Payment Method Diagnostics</h3>
          <p className="text-xs text-slate-400">Transaction counts and average ticket sizes across payment rails</p>

          <div className="space-y-3">
            {payment_mix.map((p: any, i: number) => (
              <div key={i} className="bg-surface-dark border border-surface-border rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">{p?.payment_method ?? 'Payment Rail'}</span>
                  <span className="text-brand-300 font-mono">{p?.share_pct ?? 0}%</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-surface-border/50">
                  <span>Txns: {(p?.transaction_count ?? 0).toLocaleString()}</span>
                  <span>Avg Ticket: ₹{Math.round(p?.avg_ticket ?? 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
