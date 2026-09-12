import React, { useEffect, useState } from 'react';
import { fetchInsights } from '../services/api';
import { ClassificationBadge } from '../components/common/ClassificationBadge';
import { Lightbulb, Sparkles, Filter, Activity } from 'lucide-react';
import type { AIInsight } from '../types';
import { useFilters } from '../context/FilterContext';

export const AIDiscoveredInsights: React.FC = () => {
  const { appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion } = useFilters();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights().then(setInsights).catch(console.error).finally(() => setLoading(false));
  }, [filterVersion]);

  if (loading) return <div className="p-8 text-slate-400">Scanning Datasets & Discovering Empirical Patterns...</div>;

  const isFiltered = (appliedFiscalYear && appliedFiscalYear !== 'All') ||
                     (appliedMembership && appliedMembership !== 'All') ||
                     (appliedCategory && appliedCategory !== 'All') ||
                     (appliedSegment && appliedSegment !== 'All');

  const taxonomyOptions = ['ALL', 'OBSERVED', 'MODEL_DERIVED', 'HYPOTHESIS', 'PROPOSED'];

  const filteredInsights = selectedTaxonomy === 'ALL'
    ? insights
    : insights.filter(ins => (ins.taxonomy || '').toUpperCase().replace('-', '_') === selectedTaxonomy);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-lg font-bold text-white">Autonomous AI Empirical Discovery Engine</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-950 text-brand-300 border border-brand-500/40 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>{insights.length} Empirical Discoveries</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            System independently scanned 444,118 transaction and 45,000 customer records to surface hidden structural leakages, behavioral anomalies, and economic opportunities beyond initial case requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isFiltered && (
            <div className="flex items-center space-x-2 bg-brand-950/60 border border-brand-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-brand-300">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              <span>Active Cohort: {[appliedFiscalYear !== 'All' && appliedFiscalYear, appliedMembership !== 'All' && appliedMembership, appliedCategory !== 'All' && appliedCategory, appliedSegment !== 'All' && appliedSegment].filter(Boolean).join(' · ')}</span>
            </div>
          )}

          {/* Taxonomy Filter Bar */}
          <div className="flex items-center space-x-1.5 bg-surface-card border border-surface-border p-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 shrink-0" />
            {taxonomyOptions.map(tax => (
              <button
                key={tax}
                onClick={() => setSelectedTaxonomy(tax)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedTaxonomy === tax
                    ? 'bg-brand-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-dark'
                }`}
              >
                {tax.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 Discovered Insights Banner */}
      <div className="bg-gradient-to-r from-brand-950/80 via-surface-card to-brand-950/80 border border-brand-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Breakthrough Discoveries Beyond Case Requirements</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The system independently identified: <strong>(1) ₹5.52M in forfeited Prime cashback</strong> on Non-HSIC spend, <strong>(2) Wallet capturing 40.96% share</strong> on high-ticket orders &ge; ₹5,000, <strong>(3) 9,049 silent defectors shifting ₹58.33M</strong> away from HSIC, <strong>(4) New 2026 onboarding SoW collapsing to 16.27%</strong>, and <strong>(5) Return rate neutrality across all payment methods (~11.2%, p = 0.9464)</strong> disproving return friction as the attrition driver.
        </p>
      </div>

      {/* Insight Cards */}
      <div className="space-y-6">
        {filteredInsights.map((ins, i) => (
          <div key={i} className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-4 shadow-xl hover:border-brand-500/40 transition-all">
            {/* Top Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border/50">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-500/30">
                  {ins.id}
                </span>
                <span className="text-xs font-bold text-accent-rose font-mono">{ins.tier}</span>
              </div>
              <div className="flex items-center space-x-3">
                <ClassificationBadge type={ins.taxonomy || "OBSERVED"} />
              </div>
            </div>

            {/* Title & Finding */}
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>{ins.title}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{ins.finding}</p>
            </div>

            {/* Statistical Validation Box */}
            {ins.statistical_evidence && (
              <div className="bg-surface-dark p-4 rounded-xl border border-surface-border space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-surface-border/40">
                  <span className="text-[10px] uppercase font-bold text-brand-300 flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Formal Statistical Evidence & Diagnostic Tests</span>
                  </span>
                  {ins.statistical_evidence.test_type && (
                    <span className="text-[10px] text-slate-400">{ins.statistical_evidence.test_type}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 pt-1">
                  {ins.statistical_evidence.sample_size !== undefined && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">Sample Size (N):</span>
                      <span className="text-white font-bold">{ins.statistical_evidence.sample_size.toLocaleString()}</span>
                    </div>
                  )}
                  {ins.statistical_evidence.test_statistic && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">Test Statistic:</span>
                      <span className="text-accent-emerald font-bold">{ins.statistical_evidence.test_statistic}</span>
                    </div>
                  )}
                  {ins.statistical_evidence.p_value !== undefined && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">p-Value:</span>
                      <span className="text-accent-cyan font-bold">
                        {ins.statistical_evidence.p_value < 0.0001 ? "p < 0.0001 (Significant)" : `p = ${ins.statistical_evidence.p_value}`}
                      </span>
                    </div>
                  )}
                  {ins.statistical_evidence.effect_size && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">Effect Size:</span>
                      <span className="text-accent-amber font-bold">{ins.statistical_evidence.effect_size}</span>
                    </div>
                  )}
                  {ins.statistical_evidence.total_unclaimed_cashback !== undefined && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">Forfeited Cashback:</span>
                      <span className="text-accent-rose font-bold">₹{ins.statistical_evidence.total_unclaimed_cashback.toLocaleString()}</span>
                    </div>
                  )}
                  {ins.statistical_evidence.high_ticket_total_spend !== undefined && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">High-Ticket Spend:</span>
                      <span className="text-accent-emerald font-bold">₹{ins.statistical_evidence.high_ticket_total_spend.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {ins.statistical_evidence.inference && (
                  <div className="pt-2 text-[11px] text-slate-300 border-t border-surface-border/40">
                    <strong>Statistical Inference:</strong> {ins.statistical_evidence.inference}
                  </div>
                )}
              </div>
            )}

            {/* Hypothesis & Proposed Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ins.hypothesis && (
                <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center space-x-2">
                    <ClassificationBadge type="HYPOTHESIS" />
                    <span className="text-[10px] text-amber-300 uppercase font-mono font-bold">Underlying Mechanism</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ins.hypothesis.text}</p>
                </div>
              )}

              {ins.proposed_action && (
                <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center space-x-2">
                    <ClassificationBadge type="PROPOSED" />
                    <span className="text-[10px] text-cyan-300 uppercase font-mono font-bold">Recommended Action</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">{ins.proposed_action.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{ins.proposed_action.description}</p>
                </div>
              )}
            </div>

            {/* Bottom Value & Impact */}
            <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center space-x-2 text-xs">
                <Lightbulb className="w-4 h-4 text-brand-400 shrink-0" />
                <span className="text-slate-300">
                  Business Impact: <strong className="text-white">{ins.business_impact}</strong>
                </span>
              </div>
              <div className="font-mono text-xs text-accent-emerald font-bold shrink-0 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30">
                Recoverable Potential: {ins.recoverable_spend_potential || ins.expected_recoverable_value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
