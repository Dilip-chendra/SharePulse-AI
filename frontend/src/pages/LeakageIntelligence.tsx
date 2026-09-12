import React, { useEffect, useState } from 'react';
import { fetchLeakage } from '../services/api';
import { ClassificationBadge } from '../components/common/ClassificationBadge';
import { 
  Crown, 
  Wallet 
} from 'lucide-react';

import { useFilters } from '../context/FilterContext';

export const LeakageIntelligence: React.FC = () => {
  const { appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion } = useFilters();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLeakage({
      fiscalYear: appliedFiscalYear,
      membership: appliedMembership,
      category: appliedCategory,
      segment: appliedSegment
    })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion]);

  if (loading || !data) return <div className="p-8 text-slate-400">Loading Leakage Intelligence...</div>;

  const { prime_missed_rewards, high_ticket_leakage, payment_destinations } = data;

  const isFiltered = (appliedFiscalYear && appliedFiscalYear !== 'All') ||
                     (appliedMembership && appliedMembership !== 'All') ||
                     (appliedCategory && appliedCategory !== 'All') ||
                     (appliedSegment && appliedSegment !== 'All');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Revenue Leakage & Missed Value Intelligence</h2>
          <p className="text-xs text-slate-400">Granular diagnosis of Prime reward underutilization, high-ticket spend leakage, and payment migration channels.</p>
        </div>
        {isFiltered && (
          <div className="flex items-center space-x-2 bg-brand-950/60 border border-brand-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-brand-300">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span>Filtered: {[appliedFiscalYear !== 'All' && appliedFiscalYear, appliedMembership !== 'All' && appliedMembership, appliedCategory !== 'All' && appliedCategory, appliedSegment !== 'All' && appliedSegment].filter(Boolean).join(' · ')}</span>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-amber-950/40 via-surface-card to-surface-card border border-amber-500/40 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50 flex items-center">
                <Crown className="w-3.5 h-3.5 mr-1 text-amber-400" /> PRIME BENEFIT UNDERUTILIZATION
              </span>
              <ClassificationBadge type={prime_missed_rewards.classification} />
            </div>
            <h3 className="text-lg font-bold text-white">{prime_missed_rewards.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{prime_missed_rewards.finding}</p>
          </div>
          <div className="bg-surface-dark border border-surface-border rounded-xl p-4 shrink-0 font-mono text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Total Forfeited Cashback</span>
            <span className="text-2xl font-bold text-amber-400">₹5.52M</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Across ₹331.2M Non-HSIC Spend</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-rose-950/40 via-surface-card to-surface-card border border-rose-500/40 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-900/60 text-accent-rose border border-rose-700/50 flex items-center">
                <Wallet className="w-3.5 h-3.5 mr-1" /> BIG-TICKET MONOPOLIZATION
              </span>
              <ClassificationBadge type={high_ticket_leakage.classification} />
            </div>
            <h3 className="text-lg font-bold text-white">{high_ticket_leakage.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{high_ticket_leakage.finding}</p>
          </div>
          <div className="bg-surface-dark border border-surface-border rounded-xl p-4 shrink-0 font-mono text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Wallet High-Ticket Share</span>
            <span className="text-2xl font-bold text-accent-rose">40.96%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">vs HSIC's 25.24% on orders ≥ ₹5,000</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {payment_destinations.map((d: any, i: number) => (
          <div key={i} className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-2">
            <span className="text-xs font-semibold text-slate-300">{d.destination}</span>
            <p className="text-xl font-bold text-white font-mono">₹{(d.gained_spend / 1e6).toFixed(2)}M</p>
            <p className="text-[11px] text-slate-400 font-mono">Captured {d.pct_of_captured}% of defector spend</p>
          </div>
        ))}
      </div>
    </div>
  );
};
