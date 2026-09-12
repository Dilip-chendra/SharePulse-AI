import React, { useEffect, useState } from 'react';
import { fetchSegmentation } from '../services/api';
import { ClassificationBadge } from '../components/common/ClassificationBadge';
import { CheckCircle2 } from 'lucide-react';
import type { SegmentSummary, ClusterBenchmarkItem } from '../types';

import { useFilters } from '../context/FilterContext';

export const CustomerSegmentation: React.FC = () => {
  const { appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion } = useFilters();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSegmentation({
      fiscalYear: appliedFiscalYear,
      membership: appliedMembership,
      category: appliedCategory,
      segment: appliedSegment
    })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion]);

  if (loading || !data) return <div className="p-8 text-slate-400">Loading Behavioral Customer Archetypes...</div>;

  const { segments, k_validation_benchmark, selected_k } = data;

  const isFiltered = (appliedFiscalYear && appliedFiscalYear !== 'All') ||
                     (appliedMembership && appliedMembership !== 'All') ||
                     (appliedCategory && appliedCategory !== 'All') ||
                     (appliedSegment && appliedSegment !== 'All');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-lg font-bold text-white">Behavioral Customer Archetypes & Segmentation</h2>
            <ClassificationBadge type="MODEL_DERIVED" />
          </div>
          <p className="text-xs text-slate-400">
            Unsupervised clustering over multi-dimensional transaction velocity, payment share distributions, and lifecycle engagement.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isFiltered && (
            <div className="flex items-center space-x-2 bg-brand-950/60 border border-brand-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-brand-300">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              <span>Filtered: {[appliedFiscalYear !== 'All' && appliedFiscalYear, appliedMembership !== 'All' && appliedMembership, appliedCategory !== 'All' && appliedCategory, appliedSegment !== 'All' && appliedSegment].filter(Boolean).join(' · ')}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 bg-surface-card border border-surface-border px-3 py-1.5 rounded-xl text-xs font-mono">
            <span className="text-slate-400">Optimal Archetype Count:</span>
            <span className="text-accent-emerald font-bold">k = {selected_k || 5} Archetypes</span>
          </div>
        </div>
      </div>

      {/* Cluster Validation & K-Selection Benchmark Table */}
      {k_validation_benchmark && k_validation_benchmark.length > 0 && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Cluster Number Optimization Benchmark (k = 2 to 8 Evaluated)</h3>
              <p className="text-xs text-slate-400">
                Evaluation across Silhouette Score, Davies-Bouldin Index (lower is better), Calinski-Harabasz Index, and Inertia.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Empirically Tested</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-dark/80 text-slate-400 border-b border-surface-border">
                <tr>
                  <th className="py-3 px-4">Cluster Count (k)</th>
                  <th className="py-3 px-4">Silhouette Score</th>
                  <th className="py-3 px-4">Davies-Bouldin Index (Lower is Better)</th>
                  <th className="py-3 px-4">Calinski-Harabasz Index</th>
                  <th className="py-3 px-4">Inertia (Elbow)</th>
                  <th className="py-3 px-4">Business Interpretability & Selection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50 text-slate-300">
                {k_validation_benchmark.map((kb: ClusterBenchmarkItem, idx: number) => (
                  <tr key={idx} className={(kb.is_selected ?? (kb.k === 5)) ? "bg-brand-950/30 font-semibold" : "hover:bg-surface-dark/40"}>
                    <td className="py-3 px-4 flex items-center space-x-2">
                      {(kb.is_selected ?? (kb.k === 5)) && <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" />}
                      <span className={(kb.is_selected ?? (kb.k === 5)) ? "text-white font-bold" : "text-slate-300"}>k = {kb.k}</span>
                    </td>
                    <td className="py-3 px-4 text-brand-300">{kb.silhouette_score.toFixed(4)}</td>
                    <td className="py-3 px-4 text-accent-amber">{(kb.davies_bouldin_index ?? kb.davies_bouldin ?? 0).toFixed(4)}</td>
                    <td className="py-3 px-4 text-accent-cyan">{(kb.calinski_harabasz_index ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-400">{kb.inertia.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      {(kb.is_selected ?? (kb.k === 5)) ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          Selected (Optimal Payment Channel Separation)
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">
                          {kb.k < 5 ? "Under-segmented (mixes payment methods)" : "Over-segmented (fragmented archetypes)"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map((seg: SegmentSummary, i: number) => {
          const isTargeted = appliedSegment && appliedSegment !== 'All' && (seg.segment_name ?? seg.name) === appliedSegment;
          return (
            <div 
              key={i} 
              className={`bg-surface-card border rounded-2xl p-5 shadow-xl space-y-4 transition-all ${
                isTargeted 
                  ? 'border-brand-500 ring-2 ring-brand-500/30 bg-brand-950/20' 
                  : 'border-surface-border hover:border-brand-500/40'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{(seg.segment_name ?? seg.name)}</h3>
                    {isTargeted && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-500 text-white font-bold">
                        ACTIVE TARGET
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {seg.customer_count.toLocaleString()} cardholders ({(seg.pct_of_customers ?? seg.pct_of_total ?? 0).toFixed(1)}%)
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                  seg.avg_risk_score > 0.5 ? 'bg-rose-950/60 text-rose-300 border-rose-500/30' :
                  seg.avg_risk_score > 0.3 ? 'bg-amber-950/60 text-amber-300 border-amber-500/30' :
                  'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                }`}>
                  Risk: {(seg.avg_risk_score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-surface-dark p-3 rounded-xl border border-surface-border">
                <div>
                  <span className="text-slate-500 text-[10px] block">Avg HSIC SoW:</span>
                  <span className="text-white font-bold">{(seg.avg_sow_pct !== undefined ? seg.avg_sow_pct : seg.avg_sow * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Avg Total Spend:</span>
                  <span className="text-accent-emerald font-bold">₹{(seg.avg_spend_per_customer ?? seg.avg_total_spend ?? 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Wallet Share:</span>
                  <span className="text-brand-300 font-bold">{(seg.avg_wallet_share_pct !== undefined ? seg.avg_wallet_share_pct : seg.avg_wallet_share * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">UPI Share:</span>
                  <span className="text-accent-cyan font-bold">{(seg.avg_upi_share_pct !== undefined ? seg.avg_upi_share_pct : seg.avg_upi_share * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-border space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Recommended Strategic Playbook:</span>
                <p className="text-xs text-slate-200 leading-relaxed">{(seg.recommended_strategy ?? seg.primary_strategy)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
