import React, { useEffect, useState } from 'react';
import { fetchAttrition } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';
import { 
  AlertTriangle, 
  Activity, 
  UserX 
} from 'lucide-react';

import { useFilters } from '../context/FilterContext';

export const AttritionRadar: React.FC = () => {
  const { appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion } = useFilters();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAttrition({
      fiscalYear: appliedFiscalYear,
      membership: appliedMembership,
      category: appliedCategory,
      segment: appliedSegment
    })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion]);

  if (loading || !data) return <div className="p-8 text-slate-400">Loading Attrition Radar...</div>;

  const { state_summary, feature_importances, revenue_at_risk, customers_at_risk, hard_attrition_count } = data;

  const stateColors: Record<string, string> = {
    "Healthy": "#10B981",
    "Warning": "#F59E0B",
    "Declining": "#F43F5E",
    "Dormant": "#8B5CF6",
    "Hard Attrition": "#64748B"
  };

  const isFiltered = (appliedFiscalYear && appliedFiscalYear !== 'All') ||
                     (appliedMembership && appliedMembership !== 'All') ||
                     (appliedCategory && appliedCategory !== 'All') ||
                     (appliedSegment && appliedSegment !== 'All');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Silent & Hard Attrition Radar</h2>
          <p className="text-xs text-slate-400">Dual-layer risk engine separating silent payment attrition from explicit card account closures.</p>
        </div>
        {isFiltered && (
          <div className="flex items-center space-x-2 bg-brand-950/60 border border-brand-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-brand-300">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span>Filtered Cohort: {[appliedFiscalYear !== 'All' && appliedFiscalYear, appliedMembership !== 'All' && appliedMembership, appliedCategory !== 'All' && appliedCategory, appliedSegment !== 'All' && appliedSegment].filter(Boolean).join(' · ')}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Revenue at Risk"
          value={`₹${(revenue_at_risk / 1e6).toFixed(1)}M`}
          subtitle="Projected lost HSIC spend"
          icon={AlertTriangle}
          accentColor="rose"
        />
        <MetricCard
          title="High Risk Customers"
          value={customers_at_risk.toLocaleString()}
          subtitle="Model risk probability ≥ 0.50"
          icon={Activity}
          accentColor="rose"
        />
        <MetricCard
          title="Hard Attrition (Closed Cards)"
          value={(hard_attrition_count !== undefined ? hard_attrition_count : 7664).toLocaleString()}
          subtitle="Closed card accounts in cohort"
          icon={UserX}
          accentColor="brand"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {state_summary.map((s: any, i: number) => (
          <div key={i} className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stateColors[s.state] }}></span>
              <span className="text-xs font-bold text-white uppercase font-mono">{s.state}</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">{s.count.toLocaleString()}</p>
            <span className="text-[11px] text-slate-400 font-mono">{s.pct}% of cardholder base</span>
          </div>
        ))}
      </div>

      <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-1">Top Machine Learning Risk Drivers (RandomForest Model)</h3>
        <p className="text-xs text-slate-400 mb-6">Normalized feature importances from the predictive attrition model (ROC-AUC: 0.9348)</p>

        <div className="space-y-4">
          {feature_importances.slice(0, 8).map((f: any, i: number) => (
            <div key={i} className="space-y-1 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-200 font-sans font-semibold">{f.label}</span>
                <span className="text-brand-300 font-bold">{(f.importance * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-surface-dark rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
                  style={{ width: `${f.importance * 100 * 2.2}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
