import React, { useEffect, useState } from 'react';
import { fetchExperiments } from '../services/api';
import { ClassificationBadge } from '../components/common/ClassificationBadge';
import { ShieldCheck, FlaskConical, CheckCircle2, Sparkles, Activity } from 'lucide-react';
import { useFilters } from '../context/FilterContext';

export const ExperimentImpact: React.FC = () => {
  const { appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion } = useFilters();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiments()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filterVersion]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">
        Initializing Randomized Controlled Trial (RCT) & Causal Protocol Lab...
      </div>
    );
  }

  const isFiltered = (appliedFiscalYear && appliedFiscalYear !== 'All') ||
                     (appliedMembership && appliedMembership !== 'All') ||
                     (appliedCategory && appliedCategory !== 'All') ||
                     (appliedSegment && appliedSegment !== 'All');

  const defaultPilot = {
    name: "SharePulse Causal Uplift & Incrementality Pilot (Q1 FY27)",
    sample_size_per_arm: 2500,
    total_sample_size: 10000,
    power_analysis: "80% statistical power at alpha = 0.05 to detect minimum detectable effect (MDE) of +1.8 pp SoW lift",
    treatment_arms: [
      {
        arm: "Arm 1: Prime 1-Click Default Binding",
        intervention: "In-app interstitial prompting Prime members to bind HSIC card as 1-click default checkout to capture forfeited cashback.",
        target_segment: "MetroMart Wallet Dominant Shoppers",
        expected_lift_sow_pp: 14.5,
        expected_roi: 4.2
      },
      {
        arm: "Arm 2: 0% POS Financing on Durables (>= Rs. 5,000)",
        intervention: "Instant 3-month zero-cost EMI on Electronics and Appliances orders to overcome Wallet preference.",
        target_segment: "High-Value Multi-Channel Shoppers",
        expected_lift_sow_pp: 22.0,
        expected_roi: 3.8
      },
      {
        arm: "Arm 3: Early Decay Statement Credit (Rs. 250)",
        intervention: "Rs. 250 statement credit on grocery baskets when SoW velocity drops > 20% in 60 days to reverse silent defection.",
        target_segment: "Declining & Warning Cardholders",
        expected_lift_sow_pp: 18.2,
        expected_roi: 3.1
      }
    ],
    measurement_metrics: [
      "Incremental HSIC Share-of-Wallet (pp)",
      "90-Day Retention Rate (%)",
      "Forfeited Cashback Reduction (INR)",
      "Net Cardholder Lifetime Value (CLV)",
      "Revolving Balance & Interchange Net Margin"
    ]
  };

  const experimentFramework = data?.experiment_framework || "Randomized Controlled Trial (RCT) Pilot Framework";
  const pilotDesign = data?.pilot_design || defaultPilot;
  const treatmentArms = pilotDesign.treatment_arms || defaultPilot.treatment_arms;
  const metrics = pilotDesign.measurement_metrics || defaultPilot.measurement_metrics;
  const experimentsList = data?.experiments || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-brand-400" />
              <span>Experimentation & Causal Counterfactual Framework</span>
            </h2>
            <ClassificationBadge type="PROPOSED" />
          </div>
          <p className="text-xs text-slate-400">
            Randomized Controlled Trial (RCT) pilot design to measure true incremental Share-of-Wallet lift with zero observational bias.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isFiltered && (
            <div className="flex items-center space-x-2 bg-brand-950/60 border border-brand-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-brand-300">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              <span>Cohort Filter: {[appliedFiscalYear !== 'All' && appliedFiscalYear, appliedMembership !== 'All' && appliedMembership, appliedCategory !== 'All' && appliedCategory, appliedSegment !== 'All' && appliedSegment].filter(Boolean).join(' · ')}</span>
            </div>
          )}
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-950/60 text-accent-emerald border border-emerald-500/30 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1.5" /> CAUSAL PROTOCOL READY
          </span>
        </div>
      </div>

      {/* Hero Pilot Specification */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border/60">
          <div>
            <span className="text-[10px] font-mono text-brand-400 font-bold uppercase">{experimentFramework}</span>
            <h3 className="text-base font-bold text-white mt-0.5">{pilotDesign.name}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Sample size: <strong className="text-slate-200">{pilotDesign.sample_size_per_arm.toLocaleString()}</strong> cardholders per randomized arm ({((pilotDesign.sample_size_per_arm * treatmentArms.length)).toLocaleString()} total target cohort)
            </p>
          </div>
          {pilotDesign.power_analysis && (
            <div className="bg-surface-dark p-3 rounded-xl border border-surface-border text-xs font-mono text-slate-300 max-w-sm">
              <div className="text-[10px] text-brand-300 font-bold uppercase mb-0.5">Statistical Power Design</div>
              <p className="text-[11px] text-slate-400">{pilotDesign.power_analysis}</p>
            </div>
          )}
        </div>

        {/* Treatment Arms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {treatmentArms.map((arm: any, i: number) => (
            <div key={i} className="bg-surface-dark border border-surface-border rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-brand-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-500/30">
                    ARM #{i + 1}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 1:1 Randomized
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{arm.arm}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{arm.intervention}</p>
              </div>

              <div className="pt-3 border-t border-surface-border font-mono text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Target Segment:</span>
                  <span className="text-slate-200 font-sans">{arm.target_segment}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Expected Lift:</span>
                  <span className="text-accent-emerald font-bold">+{arm.expected_lift_sow_pp} pp SoW</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Expected ROI:</span>
                  <span className="text-brand-300 font-bold">{arm.expected_roi}x</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Measurement KPIs */}
        <div className="pt-4 border-t border-surface-border">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-400" />
            <span>Primary Measurement KPIs & Success Criteria</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {metrics.map((m: string, i: number) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-surface-dark border border-surface-border text-slate-300 font-mono">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Experiments Registry */}
      {experimentsList.length > 0 && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Pre-Configured Causal Experiment Catalog</span>
              </h3>
              <p className="text-xs text-slate-400">Designed A/B trial specifications mapped to empirical defection sinks.</p>
            </div>
            <ClassificationBadge type="PROPOSED" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {experimentsList.map((exp: any, idx: number) => (
              <div key={idx} className="bg-surface-dark p-4 rounded-xl border border-surface-border space-y-2.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-brand-300">{exp.experiment_id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    {exp.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{exp.name}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed font-mono">{exp.hypothesis}</p>
                <div className="pt-2 border-t border-surface-border/50 text-[11px] font-mono flex justify-between text-slate-400">
                  <span>Sample Size:</span>
                  <span className="text-white font-bold">{exp.sample_size.toLocaleString()} / arm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentImpact;

