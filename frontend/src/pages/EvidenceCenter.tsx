import React, { useState } from 'react';
import { 
  FileCheck, 
  ShieldCheck, 
  AlertTriangle, 
  BookOpen,
  Database
} from 'lucide-react';
import { ClassificationBadge } from '../components/common/ClassificationBadge';

interface EvidenceItem {
  id: string;
  claim: string;
  exactValue: string;
  sourceCohort: string;
  datasetField: string;
  status: 'OBSERVED' | 'MODEL_DERIVED' | 'HYPOTHESIS' | 'EXPERIMENT_REQUIRED';
  verificationMethod: string;
  sqlOrFormula: string;
}

const EVIDENCE_MATRIX: EvidenceItem[] = [
  {
    id: "EV-01",
    claim: "Total Case Study Transaction Volume",
    exactValue: "444,118 Transactions",
    sourceCohort: "Entire Dataset",
    datasetField: "transaction_id",
    status: "OBSERVED",
    verificationMethod: "Row count validation across clean partition",
    sqlOrFormula: "SELECT count(*) FROM transactions WHERE status != 'FAILED'"
  },
  {
    id: "EV-02",
    claim: "Total Customer Universe",
    exactValue: "45,000 Cardholders",
    sourceCohort: "Entire Dataset",
    datasetField: "customer_id",
    status: "OBSERVED",
    verificationMethod: "Unique distinct customer entity count",
    sqlOrFormula: "SELECT count(DISTINCT customer_id) FROM customers"
  },
  {
    id: "EV-03",
    claim: "FY25 HSIC Share of Wallet",
    exactValue: "28.91% (₹85.67M / ₹296.34M)",
    sourceCohort: "FY25 (Apr 2024 - Mar 2025)",
    datasetField: "payment_method, net_amount",
    status: "OBSERVED",
    verificationMethod: "Sum of HSIC net spend divided by Total MetroMart net spend",
    sqlOrFormula: "SUM(CASE WHEN payment_method='HSIC' THEN net_amount ELSE 0 END) / SUM(net_amount)"
  },
  {
    id: "EV-04",
    claim: "FY26 HSIC Share of Wallet",
    exactValue: "19.48% (₹68.92M / ₹353.80M)",
    sourceCohort: "FY26 (Apr 2025 - Mar 2026)",
    datasetField: "payment_method, net_amount",
    status: "OBSERVED",
    verificationMethod: "Sum of HSIC net spend divided by Total MetroMart net spend",
    sqlOrFormula: "SUM(CASE WHEN payment_method='HSIC' THEN net_amount ELSE 0 END) / SUM(net_amount)"
  },
  {
    id: "EV-05",
    claim: "HSIC Co-Brand SoW Contraction",
    exactValue: "−9.43 percentage points",
    sourceCohort: "FY25 → FY26",
    datasetField: "Calculated ΔSoW",
    status: "OBSERVED",
    verificationMethod: "Direct subtraction: 19.48% − 28.91%",
    sqlOrFormula: "fy26_sow_pct - fy25_sow_pct = -9.43 pp"
  },
  {
    id: "EV-06",
    claim: "MetroMart Wallet Share Absorption",
    exactValue: "35.68% of Total Spend",
    sourceCohort: "All Transactions",
    datasetField: "payment_method = 'MetroMart Wallet'",
    status: "OBSERVED",
    verificationMethod: "Direct payment rail aggregation",
    sqlOrFormula: "SUM(wallet_spend) / SUM(total_spend) = 35.68%"
  },
  {
    id: "EV-07",
    claim: "Cash & UPI Rail Share",
    exactValue: "23.40% of Total Spend",
    sourceCohort: "All Transactions",
    datasetField: "payment_method = 'Cash/UPI'",
    status: "OBSERVED",
    verificationMethod: "Direct payment rail aggregation",
    sqlOrFormula: "SUM(upi_spend) / SUM(total_spend) = 23.40%"
  },
  {
    id: "EV-08",
    claim: "High-Ticket (>₹5,000) HSIC SoW",
    exactValue: "11.20% Share",
    sourceCohort: "Transactions > ₹5,000",
    datasetField: "amount > 5000 AND payment_method",
    status: "OBSERVED",
    verificationMethod: "High-ticket bracketed payment partition",
    sqlOrFormula: "SUM(hsic_amount) / SUM(total_amount) WHERE amount > 5000"
  },
  {
    id: "EV-09",
    claim: "Prime Unclaimed Cashback Pool",
    exactValue: "₹5,516,360.84 across 19,423 cardholders",
    sourceCohort: "Prime Co-Brand Members",
    datasetField: "accrued_cashback, redeemed_cashback",
    status: "OBSERVED",
    verificationMethod: "Accrued reward balance audit minus redeemed transactions",
    sqlOrFormula: "SUM(earned_rewards - redeemed_rewards) WHERE membership='Prime'"
  },
  {
    id: "EV-10",
    claim: "Silent Defector Cohort Count",
    exactValue: "10,098 Cardholders",
    sourceCohort: "ΔSoW ≤ −15 pp",
    datasetField: "sow_delta <= -0.15",
    status: "MODEL_DERIVED",
    verificationMethod: "Cohort threshold segmentation model",
    sqlOrFormula: "COUNT(*) WHERE fy26_sow - fy25_sow <= -0.15 AND total_spend > 2000"
  },
  {
    id: "EV-11",
    claim: "Big-Ticket Shopper Cohort Count",
    exactValue: "14,850 Cardholders",
    sourceCohort: "Avg Basket > ₹5,000",
    datasetField: "avg_ticket > 5000",
    status: "MODEL_DERIVED",
    verificationMethod: "Basket size distribution clustering",
    sqlOrFormula: "COUNT(*) WHERE total_spend / txn_count > 5000"
  },
  {
    id: "EV-12",
    claim: "Combined Modeled Recapture Opportunity",
    exactValue: "₹51.25M Recapturable Spend",
    sourceCohort: "Top 4 NBA Intervention Segments",
    datasetField: "Model Opportunity Score",
    status: "MODEL_DERIVED",
    verificationMethod: "Elasticity and propensity-weighted spend recovery model",
    sqlOrFormula: "SUM(addressable_spend * recapture_probability * intervention_multiplier)"
  },
  {
    id: "EV-13",
    claim: "Refund Friction Settlement Latency",
    exactValue: "Hypothesis (4.8% return rate verified; latency unobserved)",
    sourceCohort: "Returns & Exchanges (4.8% of GMV)",
    datasetField: "transaction_type='RETURN'",
    status: "HYPOTHESIS",
    verificationMethod: "Net refund value verified; settlement time requires instrumented bank logs",
    sqlOrFormula: "Unobserved: t_refund_settlement - t_return_initiation"
  }
];

export const EvidenceCenter: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredItems = filterType === 'ALL' 
    ? EVIDENCE_MATRIX 
    : EVIDENCE_MATRIX.filter(i => i.status === filterType);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#080B11] p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#1A2234] pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                Auditable Evidence & Trust Center
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                SYNCHRONY 2026 AUDITED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 max-w-3xl">
              Every numerical claim, metric calculation, and machine learning insight is mapped to its underlying SQL query, dataset columns, and empirical taxonomy classification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Status Filter:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs bg-[#0D1321] border border-[#1E293B] text-slate-200 px-3 py-1.5 rounded-lg font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Classifications ({EVIDENCE_MATRIX.length})</option>
              <option value="OBSERVED">OBSERVED (Empirical Truth)</option>
              <option value="MODEL_DERIVED">MODEL_DERIVED (Algorithms)</option>
              <option value="HYPOTHESIS">HYPOTHESIS (Unobserved / Qualitative)</option>
              <option value="EXPERIMENT_REQUIRED">EXPERIMENT_REQUIRED (Needs RCT)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mandatory Refund Latency Disclosure Alert */}
      <div className="p-5 rounded-2xl bg-[#0F1422] border-l-4 border-amber-500 border-r border-y border-[#1E293B] shadow-lg">
        <div className="flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-amber-200">
                Methodological Disclosure: Refund Timing & Latency Hypothesis
              </h3>
              <ClassificationBadge type="HYPOTHESIS" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Verified Data:</strong> Return transactions constitute exactly <strong>4.8%</strong> of total transaction value across the 444,118 transaction ledger.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Unobserved Hypothesis:</strong> While customer churn strongly correlates with repeat returners, <em>settlement delay (bank-rail clearance latency)</em> is an unobserved hypothesis because inter-bank settlement timestamps are not recorded in the retail store dataset. Any recommendation involving instant refund bridges must be evaluated via an in-market randomized controlled trial (A/B experiment) prior to full roll-out.
            </p>
          </div>
        </div>
      </div>

      {/* Auditable Evidence Matrix Table */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0A0E17] overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#0D1321]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              The 13 Core Evidence Records
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Showing {filteredItems.length} of {EVIDENCE_MATRIX.length} Claims
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#080B11] text-slate-400 font-mono uppercase text-[10px] border-b border-[#1E293B]">
              <tr>
                <th className="px-5 py-3.5">Claim ID</th>
                <th className="px-5 py-3.5">Business Finding</th>
                <th className="px-5 py-3.5">Verified Number</th>
                <th className="px-5 py-3.5">Taxonomy Status</th>
                <th className="px-5 py-3.5">Source Fields</th>
                <th className="px-5 py-3.5">Mathematical / SQL Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161F30]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-400">{item.id}</td>
                  <td className="px-5 py-4 font-medium text-slate-200 max-w-xs">{item.claim}</td>
                  <td className="px-5 py-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                    {item.exactValue}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <ClassificationBadge type={item.status} />
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-400 text-[11px] max-w-xs">
                    {item.datasetField}
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-[11px] text-blue-300 bg-blue-950/40 border border-blue-800/40 px-2 py-1 rounded font-mono block max-w-md truncate">
                      {item.sqlOrFormula}
                    </code>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {item.verificationMethod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology & Formula Reference Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0D1321] border border-[#1E293B] space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <h3>Standard Methodology Definitions</h3>
          </div>
          
          <div className="space-y-3 text-xs text-slate-400">
            <div className="p-3 rounded-lg bg-[#080B11] border border-[#1A2234]">
              <div className="text-slate-200 font-medium mb-1">Share of Wallet (SoW)</div>
              <p>Defined as the net monetary spend charged on HSIC Bank Co-Branded Credit Cards divided by the total net retail spend across all accepted payment instruments at MetroMart Inc. for the specified cohort and time interval.</p>
            </div>

            <div className="p-3 rounded-lg bg-[#080B11] border border-[#1A2234]">
              <div className="text-slate-200 font-medium mb-1">Net Spend Accounting</div>
              <p>All gross sales are netted against recorded return transactions: <code className="text-blue-300 font-mono">Net Spend = Gross - Return</code>. Transactions marked failed or reversed prior to settlement are excluded.</p>
            </div>

            <div className="p-3 rounded-lg bg-[#080B11] border border-[#1A2234]">
              <div className="text-slate-200 font-medium mb-1">Silent Defector Identification</div>
              <p>A cardholder is defined as a Silent Defector if their annualized HSIC SoW contracted by 15 percentage points or greater while maintaining stable or growing overall MetroMart purchasing frequency.</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D1321] border border-[#1E293B] space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3>Causal Inference & Action Economics</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-400">
            <div className="p-3 rounded-lg bg-[#080B11] border border-[#1A2234]">
              <div className="text-slate-200 font-medium mb-1">Net Incremental Value Formula</div>
              <p className="font-mono text-emerald-300 mb-1">Net Value = ΔSpend − (Offer Cost + Comm Cost + Op Cost)</p>
              <p>No recommendation is deemed viable unless Expected Net Value &gt; 0 and Portfolio ROI exceeds the cost of capital threshold (2.0x hurdle rate).</p>
            </div>

            <div className="p-3 rounded-lg bg-[#080B11] border border-[#1A2234]">
              <div className="text-slate-200 font-medium mb-1">The "Wait / Do Nothing" Hurdle</div>
              <p>Interventions are always benchmarked against the counterfactual "Natural Recovery" baseline. If a segment demonstrates &gt;60% organic rebound probability, the system recommends <span className="text-amber-300 font-mono font-semibold">WAIT</span> to protect margin.</p>
            </div>

            <div className="p-3 rounded-lg bg-[#080B11] border border-[#1A2234]">
              <div className="text-slate-200 font-medium mb-1">Experimentation Requirement</div>
              <p>All Modeled Recapture pipelines (including the ₹51.25M master opportunity) represent addressable ceiling estimates. Formal deployment mandates A/B randomized control testing with 95% confidence intervals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
