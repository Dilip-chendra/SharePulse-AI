import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Target
} from 'lucide-react';
import { fetchDecisions } from '../services/api';
import type { DecisionMatrixData } from '../types';
import { ClassificationBadge } from '../components/common/ClassificationBadge';

export const ActionCenter: React.FC = () => {
  const [data, setData] = useState<DecisionMatrixData | null>(null);
  
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('All');

  useEffect(() => {
    const load = async () => {
      try {
        
        const res = await fetchDecisions(50);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        
      }
    };
    load();
  }, []);

  const decisions = data?.customer_decisions?.filter(d => 
    selectedQuadrant === 'All' ? true : d.quadrant.includes(selectedQuadrant)
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0b101d] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Enterprise Action Center & Profit Optimization Matrix</h1>
            <p className="text-xs text-slate-400 mt-1">
              Risk × Value × Recoverability economic prioritization enforcing strictly Expected Net Contribution &gt; 0.
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-300">
          Economic Gate: Expected Net Contribution = (Recoverability × Revenue at Risk × Uplift) - (Incentive + Campaign + Ops Cost) &gt; 0
        </div>
      </div>

      {/* 4 Quadrants Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.quadrants?.map((q, idx) => (
          <div 
            key={idx}
            onClick={() => setSelectedQuadrant(q.quadrant.includes('Priority 1') ? 'Priority 1' : q.quadrant.includes('Priority 2') ? 'Priority 2' : q.quadrant.includes('Priority 3') ? 'Priority 3' : 'Priority 4')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedQuadrant !== 'All' && q.quadrant.includes(selectedQuadrant)
                ? 'bg-indigo-950/50 border-cyan-400 shadow-lg shadow-cyan-950/50'
                : 'bg-[#0e131f] border-slate-800/90 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-slate-200 mb-1">{q.quadrant}</div>
            <div className="text-xl font-bold text-white font-mono">{q.cardholder_count.toLocaleString()} <span className="text-xs text-slate-400 font-normal">({q.pct_of_base}%)</span></div>
            <div className="text-xs text-emerald-400 mt-2 font-mono">Net Value: ₹{(q.expected_net_contribution / 1e6).toFixed(1)}M</div>
            <div className="text-[11px] text-slate-400 mt-1">{q.recommended_action}</div>
          </div>
        ))}
      </div>

      {/* Customer Intervention Matrix */}
      <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800/90 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Profit-Optimized Individual Customer Interventions (Top {decisions.length})
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Quadrant:</span>
            <select
              value={selectedQuadrant}
              onChange={(e) => setSelectedQuadrant(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1"
            >
              <option value="All">All Quadrants</option>
              <option value="Priority 1">Priority 1 (High Risk / High Rec)</option>
              <option value="Priority 2">Priority 2 (High Risk / Low Rec)</option>
              <option value="Priority 3">Priority 3 (Low Risk / High Rec)</option>
              <option value="Priority 4">Priority 4 (Low Risk / Low Rec)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-3 py-2.5">Customer ID</th>
                <th className="px-3 py-2.5">Segment</th>
                <th className="px-3 py-2.5">Risk Score</th>
                <th className="px-3 py-2.5">Recoverability</th>
                <th className="px-3 py-2.5">Revenue at Risk</th>
                <th className="px-3 py-2.5">Recommended NBA</th>
                <th className="px-3 py-2.5">Cost</th>
                <th className="px-3 py-2.5">Expected Net Value</th>
                <th className="px-3 py-2.5">Taxonomy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {decisions.map((d) => (
                <tr key={d.customer_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 font-mono font-bold text-white">CUST-{d.customer_id}</td>
                  <td className="px-3 py-2.5 text-slate-300">{d.segment}</td>
                  <td className="px-3 py-2.5 font-mono text-amber-300 font-bold">{d.risk_score}</td>
                  <td className="px-3 py-2.5 font-mono text-emerald-400">{d.recoverability_score}%</td>
                  <td className="px-3 py-2.5 font-mono text-slate-200">₹{d.revenue_at_risk.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-cyan-300 font-medium">{d.recommended_nba}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-400">₹{d.intervention_cost}</td>
                  <td className="px-3 py-2.5 font-mono font-bold text-emerald-400">₹{d.expected_net_contribution.toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    <ClassificationBadge type="MODEL_DERIVED" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
