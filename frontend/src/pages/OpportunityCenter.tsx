import React, { useEffect, useState } from 'react';
import { fetchOpportunities } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';
import { ClassificationBadge } from '../components/common/ClassificationBadge';
import { Target, DollarSign, Zap, ShieldCheck, Info } from 'lucide-react';

import { useFilters } from '../context/FilterContext';

export const OpportunityCenter: React.FC = () => {
  const { appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion } = useFilters();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchOpportunities({
      fiscalYear: appliedFiscalYear,
      membership: appliedMembership,
      category: appliedCategory,
      segment: appliedSegment
    })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion]);

  if (loading || !data) return <div className="p-8 text-slate-400">Loading Opportunity Center...</div>;

  const { summary = {}, actions = [] } = data;

  const isFiltered = (appliedFiscalYear && appliedFiscalYear !== 'All') ||
                     (appliedMembership && appliedMembership !== 'All') ||
                     (appliedCategory && appliedCategory !== 'All') ||
                     (appliedSegment && appliedSegment !== 'All');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-lg font-bold text-white">Master Customer Opportunity & Recovery Queue</h2>
            <ClassificationBadge type="PROPOSED" />
          </div>
          <p className="text-xs text-slate-400">
            Ranked recovery portfolio prioritized by Risk Probability &times; Addressable Non-HSIC Spend &times; Recoverability Proxy Index.
          </p>
        </div>
        {isFiltered && (
          <div className="flex items-center space-x-2 bg-brand-950/60 border border-brand-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-brand-300">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span>Filtered: {[appliedFiscalYear !== 'All' && appliedFiscalYear, appliedMembership !== 'All' && appliedMembership, appliedCategory !== 'All' && appliedCategory, appliedSegment !== 'All' && appliedSegment].filter(Boolean).join(' · ')}</span>
          </div>
        )}
      </div>

      {/* Methodology Alert on Uplift vs Proxy */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-4 flex items-start space-x-3 text-xs font-mono">
        <Info className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-accent-cyan font-bold block">Methodology & Recoverability Proxy Clarification:</span>
          <p className="text-slate-300 leading-relaxed font-sans">
            In the absence of historical randomized controlled trial (RCT) treatment/control uplift logs, the <strong>Recoverability Score</strong> serves as a <strong>Behavioral Feasibility Index</strong> (based on shopping recency, Prime engagement elasticity, and prior card loyalty) rather than true causal uplift. True incremental lift is validated in the A/B Experimentation module.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Recoverable Spend Potential"
          value={`₹${(summary.total_recoverable_opportunity / 1e6).toFixed(1)}M`}
          subtitle="Feasibility-scaled addressable spend"
          icon={Target}
          accentColor="emerald"
        />
        <MetricCard
          title="Total Intervention Cost"
          value={`₹${(summary.total_intervention_cost / 1e6).toFixed(2)}M`}
          subtitle="Targeted campaign incentive budget"
          icon={DollarSign}
          accentColor="amber"
        />
        <MetricCard
          title="Expected Net Contribution"
          value={`₹${(summary.total_expected_net_contribution / 1e6).toFixed(1)}M`}
          subtitle="Net incremental margin after costs"
          icon={Zap}
          accentColor="cyan"
        />
        <MetricCard
          title="Portfolio Campaign ROI"
          value={`${summary.portfolio_roi}x`}
          subtitle="Net return on marketing capital"
          delta={`${summary.portfolio_roi}x ROI`}
          isPositive={true}
          icon={ShieldCheck}
          accentColor="brand"
        />
      </div>

      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Target Action Allocation & Campaign Economics</h3>
            <p className="text-xs text-slate-400">Breakdown of customer volume, campaign cost, and net return per intervention playbook.</p>
          </div>
          <ClassificationBadge type="PROPOSED" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-dark text-slate-400 uppercase font-mono text-[10px] border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">Action Proposition</th>
                <th className="py-3 px-4">Target Cardholders</th>
                <th className="py-3 px-4">% Base</th>
                <th className="py-3 px-4">Recoverable Spend</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Expected Net Value</th>
                <th className="py-3 px-4">Expected ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-mono text-slate-300">
              {actions.map((act: any, i: number) => (
                <tr key={i} className="hover:bg-surface-dark/40 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-white">{act.action_name}</td>
                  <td className="py-3 px-4">{act.target_customers.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-400">{act.pct_of_customers}%</td>
                  <td className="py-3 px-4 font-bold text-accent-emerald">₹{(act.total_recoverable_spend / 1e6).toFixed(2)}M</td>
                  <td className="py-3 px-4 text-slate-300">₹{(act.total_intervention_cost / 1e6).toFixed(2)}M</td>
                  <td className="py-3 px-4 font-bold text-brand-300">₹{(act.expected_net_value / 1e6).toFixed(2)}M</td>
                  <td className="py-3 px-4 text-accent-cyan font-bold">{act.expected_roi}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
