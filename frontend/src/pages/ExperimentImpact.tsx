import React, { useState } from 'react';
import { 
  FlaskConical, 
  ShieldCheck, 
  CheckCircle2, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { ClassificationBadge } from '../components/common/ClassificationBadge';

interface ExperimentResult {
  id: string;
  name: string;
  strategyCode: string;
  status: 'COMPLETED' | 'RUNNING' | 'SIMULATED';
  sampleTreatment: number;
  sampleControl: number;
  treatmentSpend: number;
  controlSpend: number;
  liftPct: number;
  ciLower: number;
  ciUpper: number;
  pValue: number;
  interventionCost: number;
  netIncrementalValue: number;
  roi: number;
  decision: 'SCALE' | 'ITERATE' | 'STOP' | 'WAIT';
  decisionRationale: string;
  simulatedNote?: string;
}

const HISTORICAL_BACKTESTS: ExperimentResult[] = [
  {
    id: 'exp-01',
    name: 'Prime Cashback Statement Credit Transparency Trial',
    strategyCode: 'NBA 01',
    status: 'SIMULATED',
    sampleTreatment: 5000,
    sampleControl: 5000,
    treatmentSpend: 18450000,
    controlSpend: 15120000,
    liftPct: 22.0,
    ciLower: 18.2,
    ciUpper: 25.8,
    pValue: 0.0004,
    interventionCost: 650000,
    netIncrementalValue: 2680000,
    roi: 4.1,
    decision: 'SCALE',
    decisionRationale: 'Strong causal incrementality with p < 0.001. Net Value is positive across all confidence intervals. Recommend immediate rollout to all 19,423 eligible Prime cardholders.',
    simulatedNote: '[SIMULATED / HISTORICAL EVALUATION] Reconstructed from synthetic cohort matched on FY25 baselines.'
  },
  {
    id: 'exp-02',
    name: '0% POS Financing on Large Appliances & Electronics (>₹5,000)',
    strategyCode: 'NBA 02',
    status: 'SIMULATED',
    sampleTreatment: 4000,
    sampleControl: 4000,
    treatmentSpend: 24800000,
    controlSpend: 20900000,
    liftPct: 18.7,
    ciLower: 14.1,
    ciUpper: 23.3,
    pValue: 0.0012,
    interventionCost: 980000,
    netIncrementalValue: 2920000,
    roi: 3.0,
    decision: 'SCALE',
    decisionRationale: 'Statistically significant reduction in payment rail displacement. Competitor card capture dropped from 88.8% to 64.2% in treatment cohort.',
    simulatedNote: '[SIMULATED / HISTORICAL EVALUATION] Evaluated against high-ticket buyer counterfactual holdouts.'
  },
  {
    id: 'exp-03',
    name: 'Silent Defector Accelerated 5% Rebate (3-Swipe Ladder)',
    strategyCode: 'NBA 03',
    status: 'SIMULATED',
    sampleTreatment: 3000,
    sampleControl: 3000,
    treatmentSpend: 7600000,
    controlSpend: 6640000,
    liftPct: 14.5,
    ciLower: 8.9,
    ciUpper: 20.1,
    pValue: 0.008,
    interventionCost: 450000,
    netIncrementalValue: 510000,
    roi: 2.1,
    decision: 'ITERATE',
    decisionRationale: 'Positive lift observed, but lower bound of 95% CI approaches cost hurdle rate. Recommend tightening eligibility filter to day 30–45 defection velocity before scaling.',
    simulatedNote: '[SIMULATED / HISTORICAL EVALUATION] Simulated on silent defector cohort (ΔSoW ≤ -15 pp).'
  },
  {
    id: 'exp-04',
    name: 'One-Hit Wonder Second-Swipe Activation Voucher (₹250)',
    strategyCode: 'NBA 04',
    status: 'SIMULATED',
    sampleTreatment: 2000,
    sampleControl: 2000,
    treatmentSpend: 2100000,
    controlSpend: 2020000,
    liftPct: 4.0,
    ciLower: -2.1,
    ciUpper: 10.1,
    pValue: 0.28,
    interventionCost: 500000,
    netIncrementalValue: -420000,
    roi: 0.8,
    decision: 'WAIT',
    decisionRationale: 'Insignificant causal difference (p = 0.28). Control group achieved 48% organic recovery rate without offer spend. Active marketing produces negative net ROI.',
    simulatedNote: '[SIMULATED / HISTORICAL EVALUATION] Demonstrates value of "WAIT / DO NOTHING" counterfactual protection.'
  }
];

export const ExperimentImpact: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'historical' | 'designer'>('historical');
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentResult>(HISTORICAL_BACKTESTS[0]);

  // Designer Interactive State
  const [designAction, setDesignAction] = useState<string>('NBA 01: Prime Statement Transparency Alert');
  const [sampleSize, setSampleSize] = useState<number>(5000);
  const [assumedLiftPct, setAssumedLiftPct] = useState<number>(18);
  const [unitCost] = useState<number>(120);

  // Computed Designer Metrics
  const baseSpendPerUser = 3200;
  const totalControlSpend = sampleSize * baseSpendPerUser;
  const totalTreatmentSpend = Math.round(totalControlSpend * (1 + assumedLiftPct / 100));
  const incrementalSpend = totalTreatmentSpend - totalControlSpend;
  const totalCost = sampleSize * unitCost;
  const netValue = incrementalSpend - totalCost;
  const computedRoi = Number((incrementalSpend / (totalCost || 1)).toFixed(1));
  const ciMargin = (assumedLiftPct * 0.22).toFixed(1);
  const ciLow = (assumedLiftPct - Number(ciMargin)).toFixed(1);
  const ciHigh = (assumedLiftPct + Number(ciMargin)).toFixed(1);
  const designerDecision = netValue > 0 && computedRoi >= 2.0 
    ? 'SCALE' 
    : netValue > 0 
    ? 'ITERATE' 
    : 'STOP';

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#080B11] p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#1A2234] pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                Experiment Center & Incrementality Lift Measurement
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                DATA → EXPERIMENT → MEASURE → LEARN
              </span>
              <ClassificationBadge type="MODEL_DERIVED" />
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Causal measurement engine. Eliminates selection bias through randomized treatment vs control protocols and rigorous 95% confidence intervals.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#0D1321] border border-[#1E293B] p-1 rounded-xl font-mono text-xs">
            <button
              onClick={() => setActiveTab('historical')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'historical'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Historical Holdout Backtests
            </button>
            <button
              onClick={() => setActiveTab('designer')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'designer'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RCT Pilot Designer
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'historical' ? (
        /* Historical Holdout Backtests Mode */
        <div className="space-y-8">
          {/* Prominent Simulated Disclaimer */}
          <div className="p-4 rounded-xl bg-[#0F1422] border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-xs text-slate-300 font-mono">
                <strong>Empirical Transparency Notice:</strong> All backtests shown below are labeled <span className="text-blue-400 font-semibold">[SIMULATED / HISTORICAL EVALUATION]</span>. In the absence of live production telemetry logs, counterfactual holdouts were mathematically constructed from the two-year transaction baseline.
              </span>
            </div>
            <ClassificationBadge type="MODEL_DERIVED" />
          </div>

          {/* Experiment Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {HISTORICAL_BACKTESTS.map((exp) => {
              const isSelected = selectedExperiment.id === exp.id;
              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExperiment(exp)}
                  className={`
                    p-4 rounded-xl border cursor-pointer transition-all text-xs font-mono
                    ${isSelected
                      ? 'bg-[#0D1321] border-emerald-500 ring-1 ring-emerald-500/40'
                      : 'bg-[#0A0E17] border-[#1E293B] hover:border-slate-700'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                      {exp.strategyCode}
                    </span>
                    <span className={`
                      text-[10px] font-bold px-2 py-0.5 rounded border
                      ${exp.decision === 'SCALE' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' :
                        exp.decision === 'ITERATE' ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' :
                        exp.decision === 'WAIT' ? 'bg-blue-950/60 text-blue-300 border-blue-500/40' :
                        'bg-rose-950/60 text-rose-300 border-rose-500/40'}
                    `}>
                      {exp.decision}
                    </span>
                  </div>
                  <div className="font-sans font-bold text-slate-200 line-clamp-2 mb-2">
                    {exp.name}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold">
                    +{exp.liftPct}% Causal Lift
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Sample: {(exp.sampleTreatment + exp.sampleControl).toLocaleString()} Users
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Experiment Deep Dive */}
          <div className="bg-[#0A0E17] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                    {selectedExperiment.strategyCode}
                  </span>
                  <h2 className="text-base font-bold text-white font-sans">{selectedExperiment.name}</h2>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {selectedExperiment.simulatedNote}
                </div>
              </div>

              {/* Executive Decision Banner */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">Executive Recommendation:</span>
                <span className={`
                  text-xs font-mono font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5
                  ${selectedExperiment.decision === 'SCALE' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' :
                    selectedExperiment.decision === 'ITERATE' ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' :
                    selectedExperiment.decision === 'WAIT' ? 'bg-blue-950/60 text-blue-300 border-blue-500/40' :
                    'bg-rose-950/60 text-rose-300 border-rose-500/40'}
                `}>
                  {selectedExperiment.decision === 'SCALE' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  DECISION: {selectedExperiment.decision}
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B]">
                <span className="text-slate-500 text-[10px] uppercase block">Incremental Lift</span>
                <span className="text-xl font-bold text-emerald-400">+{selectedExperiment.liftPct}%</span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  95% CI: [{selectedExperiment.ciLower}%, {selectedExperiment.ciUpper}%]
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B]">
                <span className="text-slate-500 text-[10px] uppercase block">Statistical Significance</span>
                <span className="text-xl font-bold text-blue-400">p = {selectedExperiment.pValue}</span>
                <span className="text-[10px] text-emerald-400 block mt-1">
                  {selectedExperiment.pValue < 0.05 ? '✓ Statistically Significant' : '✗ Insignificant'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B]">
                <span className="text-slate-500 text-[10px] uppercase block">Treatment vs Control Spend</span>
                <span className="text-sm font-bold text-white">
                  ₹{(selectedExperiment.treatmentSpend / 1e6).toFixed(2)}M vs ₹{(selectedExperiment.controlSpend / 1e6).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1">
                  +₹{((selectedExperiment.treatmentSpend - selectedExperiment.controlSpend) / 1e6).toFixed(2)}M Lift
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B]">
                <span className="text-slate-500 text-[10px] uppercase block">Net Incremental Value</span>
                <span className={`text-xl font-bold ${selectedExperiment.netIncrementalValue > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ₹{(selectedExperiment.netIncrementalValue / 1e6).toFixed(2)}M
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">After ₹{(selectedExperiment.interventionCost / 1e6).toFixed(2)}M costs</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1321] border border-[#1E293B]">
                <span className="text-slate-500 text-[10px] uppercase block">Measured Net ROI</span>
                <span className={`text-xl font-bold ${selectedExperiment.roi >= 2.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedExperiment.roi}x
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Hurdle: 2.0x</span>
              </div>
            </div>

            {/* Decision Rationale */}
            <div className="p-5 rounded-xl bg-[#0D1321] border border-[#1E293B] space-y-2">
              <div className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Causal Interpretation & Institutional Recommendation
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedExperiment.decisionRationale}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive RCT Pilot Designer Mode */
        <div className="space-y-8">
          <div className="bg-[#0A0E17] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Randomized Controlled Trial (RCT) Parameter Designer
                </h3>
                <p className="text-xs text-slate-400">
                  Configure sample allocations, assumed lift distributions, and cost structures to verify statistical power.
                </p>
              </div>
              <ClassificationBadge type="EXPERIMENT_REQUIRED" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-mono">Select NBA Strategy Arm</label>
                <select
                  value={designAction}
                  onChange={(e) => setDesignAction(e.target.value)}
                  className="w-full bg-[#0D1321] border border-[#1E293B] text-slate-200 text-xs rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-emerald-500"
                >
                  <option value="NBA 01: Prime Statement Transparency Alert">NBA 01: Prime Transparency Alert</option>
                  <option value="NBA 02: 0% POS Financing on Durables >₹5k">NBA 02: 0% POS Financing &gt;₹5k</option>
                  <option value="NBA 03: Silent Defector Velocity Interception">NBA 03: Silent Defector Velocity Interception</option>
                  <option value="NBA 04: One-Hit Wonder Second-Swipe Ladder">NBA 04: Second-Swipe Ladder</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-mono">Sample Size Per Arm: {sampleSize.toLocaleString()}</label>
                <input
                  type="range"
                  min={1000}
                  max={10000}
                  step={500}
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1,000 (Pilot)</span>
                  <span>5,000 (Balanced)</span>
                  <span>10,000 (Full Power)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-mono">Assumed Uplift (%): +{assumedLiftPct}%</label>
                <input
                  type="range"
                  min={5}
                  max={35}
                  step={1}
                  value={assumedLiftPct}
                  onChange={(e) => setAssumedLiftPct(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>+5% (Conservative)</span>
                  <span>+18% (Base Model)</span>
                  <span>+35% (Optimistic)</span>
                </div>
              </div>
            </div>

            {/* Projected Designer Results */}
            <div className="p-5 rounded-xl bg-[#0D1321] border border-[#1E293B] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-200 font-bold uppercase tracking-wider">
                  Power Analysis & Projected Unit Economics
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  designerDecision === 'SCALE' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' :
                  designerDecision === 'ITERATE' ? 'bg-amber-950/60 text-amber-400 border-amber-500/40' :
                  'bg-rose-950/60 text-rose-400 border-rose-500/40'
                }`}>
                  Projected Decision: {designerDecision}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-[#080B11] border border-[#1E293B]">
                  <span className="text-slate-500 text-[10px] block">Treatment Spend:</span>
                  <span className="text-sm font-bold text-white">₹{(totalTreatmentSpend / 1e6).toFixed(2)}M</span>
                  <span className="text-[10px] text-slate-500 block">Control: ₹{(totalControlSpend / 1e6).toFixed(2)}M</span>
                </div>

                <div className="p-3 rounded-lg bg-[#080B11] border border-[#1E293B]">
                  <span className="text-slate-500 text-[10px] block">Projected 95% CI:</span>
                  <span className="text-sm font-bold text-emerald-400">[{ciLow}%, {ciHigh}%]</span>
                  <span className="text-[10px] text-slate-500 block">MDE: 2.1 pp</span>
                </div>

                <div className="p-3 rounded-lg bg-[#080B11] border border-[#1E293B]">
                  <span className="text-slate-500 text-[10px] block">Projected Net Value:</span>
                  <span className={`text-sm font-bold ${netValue > 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                    ₹{(netValue / 1e6).toFixed(2)}M
                  </span>
                  <span className="text-[10px] text-slate-500 block">Cost: ₹{(totalCost / 1e6).toFixed(2)}M</span>
                </div>

                <div className="p-3 rounded-lg bg-[#080B11] border border-[#1E293B]">
                  <span className="text-slate-500 text-[10px] block">Projected Net ROI:</span>
                  <span className={`text-sm font-bold ${computedRoi >= 2.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {computedRoi}x
                  </span>
                  <span className="text-[10px] text-slate-500 block">{computedRoi >= 2.0 ? 'Exceeds 2.0x Hurdle' : 'Below Hurdle'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
