import React, { useState } from 'react';
import { 
  Sparkles, 
  Sliders, 
  Clock, 
  PauseCircle, 
  PlayCircle, 
  DollarSign, 
  Target,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ClassificationBadge } from '../components/common/ClassificationBadge';

interface StrategyDetail {
  id: string;
  code: string;
  name: string;
  targetCohort: string;
  targetCount: number;
  modeledSpend: number;
  offerCost: number;
  commCost: number;
  opCost: number;
  expectedIncrementalSpend: number;
  expectedNetValue: number;
  expectedRoi: number;
  naturalRecoveryRate: number; // % who would spend naturally without offer
  recommendedDecision: 'ACT NOW' | 'WAIT / DO NOTHING';
  whyThisCustomer: string;
  whyThisAction: string;
  whyNow: string;
  whyWorthCost: string;
  eligibilityRules: string[];
}

const STRATEGIES: StrategyDetail[] = [
  {
    id: 'nba-01',
    code: 'NBA 01',
    name: 'Prime Statement Transparency Alert',
    targetCohort: '19,423 Prime Cardholders with Unclaimed Cashback',
    targetCount: 19423,
    modeledSpend: 12850000,
    offerCost: 1942300,
    commCost: 194230,
    opCost: 500000,
    expectedIncrementalSpend: 12850000,
    expectedNetValue: 10213470,
    expectedRoi: 4.8,
    naturalRecoveryRate: 18,
    recommendedDecision: 'ACT NOW',
    whyThisCustomer: 'Customer holds an active Prime membership with accumulated unredeemed cashback (part of the ₹5.52M pool) but has reduced HSIC card swipe frequency by >20% YoY.',
    whyThisAction: 'Cashback transparency has negligible customer acquisition friction. Revealing existing earned value eliminates perceived reward complexity without issuing margin-eroding new discounts.',
    whyNow: 'Prime annual renewal and quarterly statement cycles represent the highest attrition vulnerability window.',
    whyWorthCost: 'Cost is limited strictly to low-cost SMS/push communications (₹10/user) and operational reminder messaging, yielding an exceptional 4.8x ROI.',
    eligibilityRules: ['Is_Prime == 1', 'Unredeemed_Cashback > ₹100', 'Delta_SoW < -0.05', 'Is_Closed == 0']
  },
  {
    id: 'nba-02',
    code: 'NBA 02',
    name: '0% POS Financing on Durables >₹5k',
    targetCohort: '14,850 Big-Ticket Shoppers Migrating to Competing Cards',
    targetCount: 14850,
    modeledSpend: 26200000,
    offerCost: 5240000,
    commCost: 297000,
    opCost: 2170000,
    expectedIncrementalSpend: 26200000,
    expectedNetValue: 18493000,
    expectedRoi: 3.4,
    naturalRecoveryRate: 12,
    recommendedDecision: 'ACT NOW',
    whyThisCustomer: 'Frequent shopper with average basket > ₹5,000 who currently routes 88.8% of high-ticket transactions to competitor bank credit cards or debit rails.',
    whyThisAction: 'High-ticket defection is driven by POS merchant financing terms and EMI subvention rather than lack of store loyalty.',
    whyNow: 'A recent high-value search or basket creation was detected at checkout on an alternative payment rail within the last 30 days.',
    whyWorthCost: 'Subvention cost (2.0% merchant/bank split) is vastly outweighed by recapturing ₹1,764 average incremental spend per converted ticket.',
    eligibilityRules: ['Avg_Ticket > ₹5,000', 'HSIC_High_Ticket_SoW < 15%', 'Credit_Limit >= ₹75,000']
  },
  {
    id: 'nba-03',
    code: 'NBA 03',
    name: 'Silent Defector Velocity Interception',
    targetCohort: '10,098 Cardholders with Severe SoW Contraction',
    targetCount: 10098,
    modeledSpend: 8200000,
    offerCost: 2019600,
    commCost: 201960,
    opCost: 600000,
    expectedIncrementalSpend: 8200000,
    expectedNetValue: 5378440,
    expectedRoi: 2.9,
    naturalRecoveryRate: 22,
    recommendedDecision: 'ACT NOW',
    whyThisCustomer: 'Cardholder whose annualized HSIC SoW contracted by ≥15 percentage points while overall MetroMart visits remained continuous (spend diverted to MetroMart Wallet or Cash/UPI).',
    whyThisAction: 'Targeted temporary 5% co-brand accelerated rebate for the next 3 transactions disrupts established wallet habits and re-establishes top-of-wallet card memory.',
    whyNow: 'Velocity tracking indicates customer is in day 30–60 of defection velocity. Beyond 90 days, behavioral inertia makes recovery 4x more expensive.',
    whyWorthCost: 'The 3-swipe incentive cost is capped at ₹200 per customer, against an expected ₹812 net incremental contribution per active salvage.',
    eligibilityRules: ['Delta_SoW <= -0.15', 'Total_Spend >= ₹3,000', 'Days_Since_Last_HSIC_Txn > 25']
  },
  {
    id: 'nba-04',
    code: 'NBA 04',
    name: 'One-Hit Wonder Second-Swipe Ladder',
    targetCohort: '4,000 Single-Transaction Inactive Cardholders',
    targetCount: 4000,
    modeledSpend: 4000000,
    offerCost: 1200000,
    commCost: 80000,
    opCost: 520000,
    expectedIncrementalSpend: 4000000,
    expectedNetValue: 2200000,
    expectedRoi: 2.2,
    naturalRecoveryRate: 48,
    recommendedDecision: 'WAIT / DO NOTHING',
    whyThisCustomer: 'Cardholder who made exactly one co-branded purchase upon card issuance and has not made a subsequent transaction in 90 days.',
    whyThisAction: 'Evaluating a second-swipe ₹250 activation voucher against historical natural recovery curve.',
    whyNow: 'Card tenure has reached day 95 without second-swipe engagement.',
    whyWorthCost: 'Marginal economics: 48% of this cohort organically returns during seasonal festive promotions without intervention spend. Recommending WAIT / HOLD to prevent margin cannibalization.',
    eligibilityRules: ['Total_HSIC_Txns == 1', 'Days_Since_Issuance > 90', 'Organic_Rebound_Prob > 45%']
  }
];

export const NextBestAction: React.FC = () => {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('nba-01');
  const [activeStep, setActiveStep] = useState<number>(4);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({ 'nba-01': true, 'nba-04': true });

  // Sensitivity Adjustment States for the selected strategy
  const [discountAdjustmentPct, setDiscountAdjustmentPct] = useState<number>(0);

  const selectedStrategy = STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[0];

  // Dynamic sensitivity calculation
  const adjustedOfferCost = Math.round(selectedStrategy.offerCost * (1 + discountAdjustmentPct / 100));
  const totalAdjustedCost = adjustedOfferCost + selectedStrategy.commCost + selectedStrategy.opCost;
  const adjustedNetValue = selectedStrategy.expectedIncrementalSpend - totalAdjustedCost;
  const adjustedRoi = Number((selectedStrategy.expectedIncrementalSpend / (totalAdjustedCost || 1)).toFixed(1));

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#080B11] p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#1A2234] pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                Next Best Action (NBA) Decision Engine
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                DATA → DECIDE
              </span>
              <ClassificationBadge type="MODEL_DERIVED" />
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Algorithmic prescriptive intervention pipeline. Evaluates eligibility, models unit economics, and answers the 4 mandatory questions before execution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Decision Threshold:</span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#0D1321] border border-[#1E293B] text-emerald-400">
              ROI &gt; 2.0x Hurdle
            </span>
          </div>
        </div>
      </div>

      {/* 6-Step Decision Pipeline Visualization */}
      <div className="bg-[#0D1321] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            The 6-Step Algorithmic Decision Flow
          </span>
          <span className="text-[11px] font-mono text-slate-500">Autonomous Gate Pipeline</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
          {[
            { step: 1, name: 'Eligibility', desc: 'Active & Limit Rules' },
            { step: 2, name: 'Opportunity', desc: 'Addressable Spend' },
            { step: 3, name: 'Action Options', desc: 'Generate Candidates' },
            { step: 4, name: 'Economics', desc: 'Unit Margin Netting' },
            { step: 5, name: 'Hurdle & Wait', desc: 'Natural Baseline Test' },
            { step: 6, name: 'Explain & Rank', desc: '4 Mandatory Whys' }
          ].map((s) => (
            <div
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`
                p-3 rounded-xl border text-center transition-all cursor-pointer
                ${activeStep === s.step
                  ? 'bg-purple-950/30 border-purple-500/60 ring-1 ring-purple-500/40 text-purple-200'
                  : 'bg-[#080B11] border-[#1E293B] text-slate-400 hover:border-slate-700'
                }
              `}
            >
              <div className="text-[10px] font-mono font-bold text-purple-400">STEP 0{s.step}</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">{s.name}</div>
              <div className="text-[10px] text-slate-500 mt-1">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* The 4 Priority Strategies with the 4 Mandatory Questions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Candidate Interventions & Mandatory Explainability
          </h2>
          <span className="text-xs text-slate-400 font-mono">4 Strategies Evaluated</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {STRATEGIES.map((strat) => {
            const isExpanded = !!expandedCards[strat.id];
            const isActNow = strat.recommendedDecision === 'ACT NOW';

            return (
              <div 
                key={strat.id}
                className={`
                  rounded-2xl border transition-all bg-[#0A0E17] overflow-hidden shadow-xl
                  ${isActNow ? 'border-[#1E293B] hover:border-emerald-500/40' : 'border-amber-500/30 bg-amber-950/[0.04]'}
                `}
              >
                {/* Card Top Banner */}
                <div className="p-6 border-b border-[#1A2234] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0D1321]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                        {strat.code}
                      </span>
                      <h3 className="text-base font-bold text-white">{strat.name}</h3>
                      <ClassificationBadge type="MODEL_DERIVED" />
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      Target Universe: <span className="text-slate-200">{strat.targetCohort}</span>
                    </div>
                  </div>

                  {/* Decision Badge & Toggle */}
                  <div className="flex items-center gap-3">
                    <span className={`
                      text-xs font-mono font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5
                      ${isActNow 
                        ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40' 
                        : 'bg-amber-950/50 text-amber-300 border-amber-500/40'
                      }
                    `}>
                      {isActNow ? <PlayCircle className="w-3.5 h-3.5 text-emerald-400" /> : <PauseCircle className="w-3.5 h-3.5 text-amber-400" />}
                      DECISION: {strat.recommendedDecision}
                    </span>

                    <button
                      onClick={() => toggleExpand(strat.id)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Economics Summary Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#080B11] border-b border-[#1A2234] font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Modeled Recapture</span>
                    <span className="text-sm font-bold text-emerald-400">₹{(strat.modeledSpend / 1e6).toFixed(2)}M</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Intervention Cost</span>
                    <span className="text-sm font-bold text-slate-300">₹{((strat.offerCost + strat.commCost + strat.opCost) / 1e6).toFixed(2)}M</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Expected Net Value</span>
                    <span className="text-sm font-bold text-blue-400">₹{(strat.expectedNetValue / 1e6).toFixed(2)}M</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Portfolio ROI</span>
                    <span className={`text-sm font-bold ${strat.expectedRoi >= 2.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {strat.expectedRoi}x
                    </span>
                  </div>
                </div>

                {/* Detailed Body (4 Mandatory Whys + Economics) */}
                {isExpanded && (
                  <div className="p-6 space-y-6">
                    {/* The 4 Mandatory Questions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Q1: WHY THIS CUSTOMER? */}
                      <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B] space-y-1.5">
                        <div className="text-[11px] font-bold text-blue-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-blue-400" />
                          1. Why this customer? (Behavioral Evidence)
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {strat.whyThisCustomer}
                        </p>
                      </div>

                      {/* Q2: WHY THIS ACTION? */}
                      <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B] space-y-1.5">
                        <div className="text-[11px] font-bold text-purple-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          2. Why this action? (Intervention Fit)
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {strat.whyThisAction}
                        </p>
                      </div>

                      {/* Q3: WHY NOW? */}
                      <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B] space-y-1.5">
                        <div className="text-[11px] font-bold text-amber-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          3. Why now? (Action Trigger)
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {strat.whyNow}
                        </p>
                      </div>

                      {/* Q4: WHY WORTH THE COST? */}
                      <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B] space-y-1.5">
                        <div className="text-[11px] font-bold text-emerald-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          4. Why worth the cost? (Transparent Economics)
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {strat.whyWorthCost}
                        </p>
                      </div>
                    </div>

                    {/* Wait / Do Nothing Analysis Layer */}
                    <div className="p-4 rounded-xl bg-[#080B11] border border-[#1E293B] space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300 font-bold uppercase tracking-wider">
                          Counterfactual "Wait / Do Nothing" Hurdle Analysis
                        </span>
                        <span className="text-slate-400">Natural Organic Rebound: {strat.naturalRecoveryRate}%</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-lg bg-[#0D1321] border border-[#1E293B]">
                          <span className="text-slate-500 text-[10px] block">Natural Baseline Outcome:</span>
                          <span className="text-slate-300 font-semibold">₹{((strat.modeledSpend * (strat.naturalRecoveryRate/100)) / 1e6).toFixed(2)}M</span>
                          <span className="text-[10px] text-slate-500 block mt-1">Zero intervention marketing cost</span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0D1321] border border-[#1E293B]">
                          <span className="text-slate-500 text-[10px] block">Active Campaign Outcome:</span>
                          <span className="text-emerald-400 font-semibold">₹{(strat.modeledSpend / 1e6).toFixed(2)}M</span>
                          <span className="text-[10px] text-slate-500 block mt-1">Full propensity capture</span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0D1321] border border-[#1E293B]">
                          <span className="text-slate-500 text-[10px] block">Net Incremental Lift:</span>
                          <span className="text-blue-400 font-semibold">
                            ₹{(((strat.modeledSpend * (1 - strat.naturalRecoveryRate/100)) - (strat.offerCost + strat.commCost + strat.opCost)) / 1e6).toFixed(2)}M
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            {isActNow ? 'Intervention highly profitable' : 'Margin cannibalization risk'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Action Economics Sensitivity Sandbox */}
      <div className="bg-[#0A0E17] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Interactive Action Economics Sensitivity Layer
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate offer incentive adjustments and observe real-time impact on Net Value and Portfolio ROI.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Selected Playbook:</span>
            <select
              value={selectedStrategyId}
              onChange={(e) => {
                setSelectedStrategyId(e.target.value);
                setDiscountAdjustmentPct(0);
              }}
              className="bg-[#0D1321] border border-[#1E293B] text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
            >
              {STRATEGIES.map(s => (
                <option key={s.id} value={s.id}>{s.code}: {s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Formula Display */}
        <div className="p-4 rounded-xl bg-[#080B11] border border-[#1E293B] font-mono text-xs space-y-2">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Transparent Mathematical Netting Formula:</span>
          <div className="text-slate-200 text-[11px] overflow-x-auto whitespace-nowrap">
            <span className="text-emerald-400">Expected Incremental Spend (₹{(selectedStrategy.expectedIncrementalSpend/1e6).toFixed(2)}M)</span>
            {' − '}
            <span className="text-amber-400">Offer Cost (₹{(adjustedOfferCost/1e6).toFixed(2)}M)</span>
            {' − '}
            <span className="text-blue-400">Comm Cost (₹{(selectedStrategy.commCost/1e6).toFixed(2)}M)</span>
            {' − '}
            <span className="text-purple-400">Op Cost (₹{(selectedStrategy.opCost/1e6).toFixed(2)}M)</span>
            {' = '}
            <span className="text-white font-bold">Net Incremental Value (₹{(adjustedNetValue/1e6).toFixed(2)}M)</span>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Offer Incentive Budget Adjustment:</span>
            <span className="font-bold text-emerald-400">
              {discountAdjustmentPct > 0 ? `+${discountAdjustmentPct}%` : `${discountAdjustmentPct}%`}
            </span>
          </div>
          <input
            type="range"
            min={-50}
            max={50}
            step={5}
            value={discountAdjustmentPct}
            onChange={(e) => setDiscountAdjustmentPct(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>−50% (Lean Budget)</span>
            <span>0% (Base Plan)</span>
            <span>+50% (Aggressive Acquisition)</span>
          </div>
        </div>

        {/* Live Dynamic Output Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B]">
            <span className="text-slate-500 text-[10px] block">Simulated Total Cost</span>
            <span className="text-lg font-bold text-slate-200">₹{(totalAdjustedCost / 1e6).toFixed(2)}M</span>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B]">
            <span className="text-slate-500 text-[10px] block">Simulated Net Value</span>
            <span className="text-lg font-bold text-blue-400">₹{(adjustedNetValue / 1e6).toFixed(2)}M</span>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B]">
            <span className="text-slate-500 text-[10px] block">Simulated Portfolio ROI</span>
            <span className={`text-lg font-bold ${adjustedRoi >= 2.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {adjustedRoi}x {adjustedRoi >= 2.0 ? '✓ Above Hurdle' : '✗ Sub-Hurdle'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
