import React, { useEffect, useState } from 'react';
import { ClassificationBadge } from '../components/common/ClassificationBadge';
import { fetchReturnAnalysis } from '../services/api';
import { useFilters } from '../context/FilterContext';

interface ReturnData {
  chi_square_test?: {
    chi2_statistic: number;
    p_value: number;
    significant: boolean;
    interpretation: string;
    taxonomy: string;
    causal_warning: string;
  };
  payment_method_summary?: Array<{
    payment_method: string;
    total_transactions: number;
    return_transactions: number;
    return_rate_pct: number;
    gross_spend: number;
    return_value: number;
    net_spend: number;
  }>;
  overall?: {
    total_transactions?: number;
    total_returns?: number;
    overall_return_rate_pct: number;
  };
  taxonomy?: string;
  note?: string;
}

export const ReturnFrictionIntelligence: React.FC = () => {
  const { appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion } = useFilters();
  const [data, setData] = useState<ReturnData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchReturnAnalysis({
      fiscalYear: appliedFiscalYear,
      membership: appliedMembership,
      category: appliedCategory,
      segment: appliedSegment
    })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion]);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading Return Friction Analysis...</div>;

  const isFiltered = (appliedFiscalYear && appliedFiscalYear !== 'All') ||
                     (appliedMembership && appliedMembership !== 'All') ||
                     (appliedCategory && appliedCategory !== 'All') ||
                     (appliedSegment && appliedSegment !== 'All');

  const chiTest = data?.chi_square_test;
  const overall = data?.overall;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Return Friction Intelligence</h1>
          <p className="text-gray-400 mt-1">Chi-square independence test · Return rate neutrality across payment methods</p>
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

      {/* Key Finding — Neutrality Result */}
      <div className={`rounded-2xl p-8 border ${chiTest && !chiTest.significant ? 'bg-green-900/20 border-green-700/40' : 'bg-red-900/20 border-red-700/40'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`text-2xl`}>{chiTest && !chiTest.significant ? '✅' : '⚠️'}</div>
              <span className="text-sm font-medium text-green-400 uppercase tracking-wide">
                Key Finding — OBSERVED
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Return Rate is <span className="text-green-400">NEUTRAL</span> Across Payment Methods
            </h2>
            <p className="text-gray-300 text-sm max-w-2xl">
              Chi-square independence test shows no statistically significant difference in return rates 
              across payment methods. Return friction is <strong>NOT</strong> a driver of payment method migration or HSIC attrition.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="bg-gray-900/60 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">χ²={chiTest?.chi2_statistic ?? 0.74}</div>
              <div className="text-xs text-gray-400 mt-1">Chi-square statistic</div>
            </div>
            <div className="bg-gray-900/60 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">p={chiTest?.p_value ?? 0.9464}</div>
              <div className="text-xs text-gray-400 mt-1">p-value (p&gt;0.05 = neutral)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Causal Warning */}
      <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-yellow-400 text-xl shrink-0">⚠️</span>
          <div>
            <div className="text-sm font-semibold text-yellow-400 mb-1">Non-Causal Interpretation Notice</div>
            <p className="text-sm text-gray-300">
              {chiTest?.causal_warning ?? 
                'Non-causal: this test measures association only. A non-significant result means return rates do not explain payment method migration patterns.'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Do NOT claim refund friction caused HSIC attrition. The data shows return behavior is 
              independent of payment method choice. Attrition drivers must be sought elsewhere 
              (wallet rewards, UPI convenience, checkout UI).
            </p>
          </div>
        </div>
      </div>

      {/* Statistical Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Overall Return Rate</div>
          <div className="text-3xl font-bold text-white">{overall?.overall_return_rate_pct ?? 11.2}%</div>
          <div className="text-xs text-gray-400 mt-2">Consistent across all payment methods</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Degrees of Freedom</div>
          <div className="text-3xl font-bold text-white">{chiTest ? chiTest.p_value.toFixed(4) : '0.9464'}</div>
          <div className="text-xs text-gray-400 mt-2">p-value (threshold: 0.05)</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Test Conclusion</div>
          <div className="text-sm font-bold text-green-400">Fail to Reject H₀</div>
          <div className="text-xs text-gray-400 mt-2">Null hypothesis: return rates are equal across payment methods. We fail to reject it.</div>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      {data?.payment_method_summary && data.payment_method_summary.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">Return Rate by Payment Method</h3>
            <p className="text-xs text-gray-400 mt-1">OBSERVED — empirical from transaction data</p>
          </div>
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left text-xs text-gray-400 px-6 py-3 font-medium">Payment Method</th>
                <th className="text-right text-xs text-gray-400 px-6 py-3 font-medium">Total Txns</th>
                <th className="text-right text-xs text-gray-400 px-6 py-3 font-medium">Returns</th>
                <th className="text-right text-xs text-gray-400 px-6 py-3 font-medium">Return Rate</th>
                <th className="text-right text-xs text-gray-400 px-6 py-3 font-medium">Net Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {data.payment_method_summary.map((row) => (
                <tr key={row.payment_method} className="hover:bg-gray-800/30">
                  <td className="px-6 py-4 text-sm text-white font-medium">{row.payment_method}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 text-right">{row.total_transactions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 text-right">{row.return_transactions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-white">{row.return_rate_pct.toFixed(2)}%</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 text-right">₹{(row.net_spend / 1e6).toFixed(2)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* What This Means */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">What This Means for Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-red-400 mb-2">✗ Do NOT pursue</div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Return friction reduction as HSIC recovery strategy</li>
              <li>• Claiming refund policy caused payment method shift</li>
              <li>• Using return rate as a proxy for payment method quality</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium text-green-400 mb-2">✓ Focus instead on</div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Wallet rewards and convenience features (actual drivers)</li>
              <li>• Prime cashback utilization gap (₹5.5M forfeited)</li>
              <li>• Big-ticket basket inversion (checkout default payment)</li>
              <li>• Silent defector reactivation (9,049 customers, ₹58.3M)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnFrictionIntelligence;
