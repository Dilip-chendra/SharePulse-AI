import React, { useEffect, useState } from 'react';
import { fetchNextBestAction } from '../services/api';
import { Zap, CheckCircle2 } from 'lucide-react';

import { useFilters } from '../context/FilterContext';

export const NextBestAction: React.FC = () => {
  const { appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion } = useFilters();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchNextBestAction({
      fiscalYear: appliedFiscalYear,
      membership: appliedMembership,
      category: appliedCategory,
      segment: appliedSegment
    })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion]);

  if (loading || !data) return <div className="p-8 text-slate-400">Loading Next Best Action Engine...</div>;

  const { actions = [] } = data;

  const isFiltered = (appliedFiscalYear && appliedFiscalYear !== 'All') ||
                     (appliedMembership && appliedMembership !== 'All') ||
                     (appliedCategory && appliedCategory !== 'All') ||
                     (appliedSegment && appliedSegment !== 'All');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Next Best Action (NBA) Decision Engine</h2>
          <p className="text-xs text-slate-400">Automated prescriptive intervention playbooks for every prioritized cardholder segment.</p>
        </div>
        {isFiltered && (
          <div className="flex items-center space-x-2 bg-brand-950/60 border border-brand-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-brand-300">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span>Filtered: {[appliedFiscalYear !== 'All' && appliedFiscalYear, appliedMembership !== 'All' && appliedMembership, appliedCategory !== 'All' && appliedCategory, appliedSegment !== 'All' && appliedSegment].filter(Boolean).join(' · ')}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((act: any, i: number) => (
          <div key={i} className="bg-surface-card border border-surface-border rounded-2xl p-6 flex flex-col justify-between hover:border-brand-500/40 transition-all space-y-4 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-950/60 text-brand-300 border border-brand-500/30">
                  PLAYBOOK #{i + 1}
                </span>
                <span className="text-xs font-mono text-slate-400">{act.target_customers.toLocaleString()} Cardholders</span>
              </div>

              <h3 className="text-base font-bold text-white flex items-start space-x-2">
                <Zap className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <span>{act.action_name}</span>
              </h3>

              <div className="grid grid-cols-3 gap-2 bg-surface-dark p-3 rounded-xl border border-surface-border text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Recoverable Spend:</span>
                  <span className="font-bold text-accent-emerald">₹{(act.total_recoverable_spend / 1e6).toFixed(2)}M</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Campaign Cost:</span>
                  <span className="font-bold text-slate-300">₹{(act.total_intervention_cost / 1e6).toFixed(2)}M</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Expected ROI:</span>
                  <span className="font-bold text-brand-300">{act.expected_roi}x</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Expected Net Uplift: <strong className="text-white">₹{(act.expected_net_value / 1e6).toFixed(2)}M</strong></span>
              <span className="text-accent-emerald flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Ready</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
