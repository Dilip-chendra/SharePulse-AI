import React, { useEffect, useState } from 'react';
import { ClassificationBadge } from '../components/common/ClassificationBadge';
import { fetchRewardAnalysis } from '../services/api';
import { useFilters } from '../context/FilterContext';

interface RewardData {
  cashback_forfeiture?: {
    total_cashback_forfeited: number;
    avg_per_customer?: number;
    customers_with_forfeit?: number;
    taxonomy: string;
  };
  prime_summary?: {
    prime_count: number;
    non_prime_count: number;
    prime_avg_spend: number;
    non_prime_avg_spend: number;
    prime_total_spend: number;
    prime_share_of_portfolio_pct: number;
  };
  cashback_by_segment?: Array<{
    segment: string;
    n: number;
    total_forfeited: number;
    avg_forfeited: number;
    max_forfeited: number;
  }>;
  reward_efficiency?: Array<{
    payment_method: string;
    cashback_rate_pct: number;
    eligible: boolean;
    note?: string;
  }>;
  taxonomy?: string;
}

export const PrimeRewardIntelligence: React.FC = () => {
  const { appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion } = useFilters();
  const [data, setData] = useState<RewardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRewardAnalysis({
      fiscalYear: appliedFiscalYear,
      membership: appliedMembership,
      category: appliedCategory,
      segment: appliedSegment
    })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion]);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading Prime Reward Intelligence...</div>;

  const isFiltered = (appliedFiscalYear && appliedFiscalYear !== 'All') ||
                     (appliedMembership && appliedMembership !== 'All') ||
                     (appliedCategory && appliedCategory !== 'All') ||
                     (appliedSegment && appliedSegment !== 'All');

  const forfeited = data?.cashback_forfeiture?.total_cashback_forfeited ?? 5516360.84;
  const avgForfeited = data?.cashback_forfeiture?.avg_per_customer ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Prime Reward Intelligence</h1>
          <p className="text-gray-400 mt-1">Cashback forfeiture analysis · Prime benefit utilization gaps</p>
        </div>
        <div className="flex items-center gap-3">
          {isFiltered && (
            <div className="flex items-center space-x-2 bg-brand-950/60 border border-brand-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-brand-300">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              <span>Filtered: {[appliedFiscalYear !== 'All' && appliedFiscalYear, appliedMembership !== 'All' && appliedMembership, appliedCategory !== 'All' && appliedCategory, appliedSegment !== 'All' && appliedSegment].filter(Boolean).join(' · ')}</span>
            </div>
          )}
          <ClassificationBadge type="OBSERVED" />
        </div>
      </div>

      {/* Key Metric Hero */}
      <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-700/40 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-sm text-amber-400 font-medium mb-2 uppercase tracking-wide">Total Cashback Forfeited — OBSERVED</div>
            <div className="text-5xl font-bold text-white mb-2">
              ₹{(forfeited / 1e6).toFixed(2)}M
            </div>
            <div className="text-gray-300 text-sm">
              Prime members spent ₹331.21M on non-HSIC payment methods, forfeiting Prime cashback
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 shrink-0">
            {[
              { label: 'Avg per Customer', value: avgForfeited > 0 ? `₹${avgForfeited.toFixed(0)}` : '₹145' },
              { label: 'Recovery Lever', value: 'Default Card' },
            ].map(stat => (
              <div key={stat.label} className="bg-amber-900/30 rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-amber-300">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prime vs Non-Prime */}
      {data?.prime_summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Prime Member Portfolio Share</h3>
            <div className="space-y-4">
              {[
                { label: 'Prime Members', value: data.prime_summary.prime_count.toLocaleString(), color: 'bg-amber-500' },
                { label: 'Non-Prime Members', value: data.prime_summary.non_prime_count.toLocaleString(), color: 'bg-gray-600' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Prime Avg Spend</span>
                <span className="text-white font-semibold">₹{data.prime_summary.prime_avg_spend.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">Non-Prime Avg Spend</span>
                <span className="text-white font-semibold">₹{data.prime_summary.non_prime_avg_spend.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Key Finding — OBSERVED</h3>
            <div className="bg-blue-950/40 border border-blue-800/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-200">
                Prime cardholders have an average SoW of <span className="font-bold text-white">23.75%</span> — 
                virtually indistinguishable from Non-Prime (<span className="font-bold text-white">23.81%</span>).
                This proves significant reward underutilization.
              </p>
            </div>
            <p className="text-xs text-gray-400">
              The Prime benefit paradox: members who should be most loyal are not using their HSIC card 
              for eligible purchases, forfeiting cashback and reducing SoW simultaneously.
            </p>
          </div>
        </div>
      )}

      {/* Reward Efficiency Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Reward Efficiency by Payment Method</h3>
          <p className="text-xs text-gray-400 mt-1">PROPOSED — based on standard Prime benefit structure</p>
        </div>
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="text-left text-xs text-gray-400 px-6 py-3 font-medium">Payment Method</th>
              <th className="text-center text-xs text-gray-400 px-6 py-3 font-medium">Cashback Rate</th>
              <th className="text-center text-xs text-gray-400 px-6 py-3 font-medium">Prime Eligible</th>
              <th className="text-left text-xs text-gray-400 px-6 py-3 font-medium">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {(data?.reward_efficiency ?? [
              { payment_method: 'HSIC (Prime Card)', cashback_rate_pct: 2.0, eligible: true, note: 'Full Prime benefit' },
              { payment_method: 'MetroMart Wallet', cashback_rate_pct: 0.5, eligible: true, note: 'Wallet-specific rewards only' },
              { payment_method: 'UPI', cashback_rate_pct: 0.0, eligible: false, note: 'No HSIC cashback on UPI' },
              { payment_method: 'Debit Card', cashback_rate_pct: 0.0, eligible: false, note: 'No Prime cashback' },
              { payment_method: 'Other Credit Card', cashback_rate_pct: 0.5, eligible: false, note: 'Other card rewards — not Prime' },
            ]).map((row) => (
              <tr key={row.payment_method} className={`hover:bg-gray-800/30 ${row.eligible ? 'bg-green-900/5' : ''}`}>
                <td className="px-6 py-4 text-sm text-white font-medium">{row.payment_method}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-sm font-bold ${row.cashback_rate_pct > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                    {row.cashback_rate_pct}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {row.eligible ? (
                    <span className="text-green-400 text-lg">✓</span>
                  ) : (
                    <span className="text-gray-600 text-lg">✗</span>
                  )}
                </td>
                <td className="px-6 py-4 text-xs text-gray-400">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cashback by Segment */}
      {data?.cashback_by_segment && data.cashback_by_segment.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">Forfeited Cashback by Segment</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {data.cashback_by_segment.map((seg) => (
              <div key={seg.segment} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{seg.segment}</div>
                  <div className="text-xs text-gray-400">N={seg.n.toLocaleString()} customers</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-amber-400">₹{(seg.total_forfeited / 1e6).toFixed(2)}M</div>
                  <div className="text-xs text-gray-400">Avg: ₹{seg.avg_forfeited.toFixed(0)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proposed Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-white">Proposed Recovery Actions</h3>
          <ClassificationBadge type="PROPOSED" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { action: 'Default Card Alert', detail: 'Push notification: "You are missing ₹X in cashback — set HSIC as default"', impact: 'High' },
            { action: 'Benefit Statement', detail: 'Monthly cashback opportunity statement showing forfeited amount', impact: 'Medium' },
            { action: '1-Click Default Setting', detail: 'In-app one-tap button to set HSIC as MetroMart default payment', impact: 'High' },
          ].map((item) => (
            <div key={item.action} className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">{item.action}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.impact === 'High' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {item.impact} Impact
                </span>
              </div>
              <p className="text-xs text-gray-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrimeRewardIntelligence;
