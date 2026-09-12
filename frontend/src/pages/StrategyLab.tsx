import React, { useState, useEffect } from 'react';
import { runSimulation } from '../services/api';
import { Sliders, Sparkles } from 'lucide-react';

import { useFilters } from '../context/FilterContext';

export const StrategyLab: React.FC = () => {
  const { appliedSegment, filterVersion } = useFilters();
  const [budget, setBudget] = useState<number>(1000000);
  const [targetSegment, setTargetSegment] = useState<string>("All");
  const [targetState, setTargetState] = useState<string>("All");
  const [incentiveRate, setIncentiveRate] = useState<number>(0.03);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (appliedSegment && appliedSegment !== "All") {
      setTargetSegment(appliedSegment);
    }
  }, [appliedSegment, filterVersion]);

  const executeSimulation = () => {
    runSimulation({
      budget,
      target_segment: targetSegment,
      target_state: targetState,
      incentive_rate: incentiveRate,
      conversion_rate_multiplier: 1.0
    })
      .then(setResult)
      .catch(console.error);
  };

  useEffect(() => {
    executeSimulation();
  }, [budget, targetSegment, targetState, incentiveRate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Strategy Lab & Campaign Budget Optimizer</h2>
          <p className="text-xs text-slate-400">Simulate campaign capital allocation, target population sizing, and expected financial returns.</p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> SIMULATION ENGINE ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-brand-400" />
            <span>Campaign Parameters</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Campaign Budget:</span>
              <span className="font-bold text-brand-300">₹{(budget / 1e5).toFixed(1)} Lakh (₹{budget.toLocaleString()})</span>
            </div>
            <input
              type="range"
              min="100000"
              max="5000000"
              step="50000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-400 font-mono">Target Segment:</label>
            <select
              value={targetSegment}
              onChange={(e) => setTargetSegment(e.target.value)}
              className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
            >
              <option value="All">All Segments</option>
              <option value="MetroMart Wallet Dominant Shoppers">MetroMart Wallet Dominant Shoppers</option>
              <option value="High-Value Multi-Channel Shoppers">High-Value Multi-Channel Shoppers</option>
              <option value="HSIC Core Loyalists">HSIC Core Loyalists</option>
              <option value="Cash & UPI Transactors">Cash & UPI Transactors</option>
              <option value="Dormant & Low-Engagement Shoppers">Dormant & Low-Engagement Shoppers</option>
            </select>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-400 font-mono">Customer Risk State:</label>
            <select
              value={targetState}
              onChange={(e) => setTargetState(e.target.value)}
              className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
            >
              <option value="All">All States</option>
              <option value="Declining">Declining (High Priority)</option>
              <option value="Warning">Warning (Early Risk)</option>
              <option value="Dormant">Dormant (Reactivation)</option>
              <option value="Healthy">Healthy (Retention)</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Incentive Cashback Rate:</span>
              <span className="font-bold text-white">{(incentiveRate * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.08"
              step="0.005"
              value={incentiveRate}
              onChange={(e) => setIncentiveRate(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface-card border border-surface-border rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Simulated Expected Campaign Outcomes</h3>

            {result && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-surface-dark border border-surface-border rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Targeted Cardholders</span>
                  <span className="text-xl font-bold text-white mt-1 block">{result.targeted_customers_count.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{result.pct_of_target_population}% of pool</span>
                </div>
                <div className="bg-surface-dark border border-surface-border rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Recovered Spend</span>
                  <span className="text-xl font-bold text-accent-emerald mt-1 block">₹{(result.expected_recovered_spend / 1e6).toFixed(1)}M</span>
                </div>
                <div className="bg-surface-dark border border-surface-border rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Intervention Cost</span>
                  <span className="text-xl font-bold text-slate-300 mt-1 block">₹{(result.total_intervention_cost / 1e6).toFixed(2)}M</span>
                </div>
                <div className="bg-surface-dark border border-surface-border rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Net Contribution</span>
                  <span className="text-xl font-bold text-brand-300 mt-1 block">₹{(result.expected_net_value / 1e6).toFixed(2)}M</span>
                  <span className="text-[10px] font-bold text-accent-emerald font-mono">ROI: {result.expected_roi}x</span>
                </div>
              </div>
            )}

            {result?.segment_breakdown?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Segment Distribution of Allocated Budget</h4>
                <div className="space-y-2">
                  {result.segment_breakdown.map((s: any, i: number) => (
                    <div key={i} className="bg-surface-dark border border-surface-border rounded-xl p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block">{s.segment_name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{s.targeted_count.toLocaleString()} Customers Targeted</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-accent-emerald font-bold block">₹{(s.recovered_spend / 1e6).toFixed(2)}M Recovered</span>
                        <span className="text-slate-400 text-[10px]">Cost: ₹{(s.cost / 1e5).toFixed(1)} Lakh</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 font-mono italic">
            * Note: Values displayed in the Strategy Lab are mathematical simulations based on historical customer recoverability proxies and configured conversion multipliers.
          </p>
        </div>
      </div>
    </div>
  );
};
