import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Verified / labeled data
const MODELED_RECOVERY_M = 51.25;

const RECOVERY_LEVERS = [
  {
    id: 'checkout',
    label: 'POS Checkout Prompt',
    description: 'Instant reminders of unclaimed Prime cashback at register',
    modeledImpact: '₹12.3M',
    confidence: 'EXPERIMENT CANDIDATE',
    color: '#10b981',
    width: 24,
  },
  {
    id: 'bigticket',
    label: 'Big-Ticket Financing Nudge',
    description: 'Targeted zero-interest offers on transactions >₹5,000',
    modeledImpact: '₹18.7M',
    confidence: 'EXPERIMENT CANDIDATE',
    color: '#6366f1',
    width: 36.5,
  },
  {
    id: 'defector',
    label: 'Defector Re-engagement',
    description: 'Automated NBA campaign for 10,098 silent defectors',
    modeledImpact: '₹11.2M',
    confidence: 'EXPERIMENT CANDIDATE',
    color: '#f59e0b',
    width: 21.9,
  },
  {
    id: 'category',
    label: 'Category Cashback Boost',
    description: 'Electronics cashback boosted 3% → 5% for 90 days',
    modeledImpact: '₹9.05M',
    confidence: 'EXPERIMENT CANDIDATE',
    color: '#8b5cf6',
    width: 17.6,
  },
];

export const RecoveryScene: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);

  // Initialize with verified modeled value — NEVER 0!
  const [count, setCount] = useState<number>(MODELED_RECOVERY_M);
  const [meterFill, setMeterFill] = useState<number>(100);
  const [barsReady, setBarsReady] = useState<boolean>(true);
  const animFired = useRef<boolean>(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
      });

      ScrollTrigger.create({
        trigger: meterRef.current,
        start: 'top 85%',
        onEnter: () => {
          if (animFired.current) return;
          animFired.current = true;
          setBarsReady(true);

          if (prefersReduced) {
            setMeterFill(100);
            setCount(MODELED_RECOVERY_M);
            return;
          }

          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: MODELED_RECOVERY_M,
            duration: 2.0,
            ease: 'power2.out',
            onUpdate: () => setCount(parseFloat(counterObj.val.toFixed(2))),
            onComplete: () => setCount(MODELED_RECOVERY_M),
          });

          setMeterFill(100);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-recovery"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden"
    >
      {/* Soft atmospheric ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[400px] bg-emerald-950/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono tracking-wider text-emerald-300 uppercase mb-4 shadow-sm shadow-emerald-950">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Recovery Modeling · MODELED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Modeled{' '}
            <span className="text-gradient-brand">Recapture Opportunity</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            If targeted interventions achieve projected conversion rates, this modeled recapturable spend represents the addressable upside.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column: main meter */}
          <div ref={meterRef} className="space-y-5">
            {/* Modeled recovery amount card */}
            <div className="relative p-6 sm:p-8 rounded-2xl border border-emerald-500/25 bg-emerald-950/20 backdrop-blur-md overflow-hidden shadow-xl shadow-black/30">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/15 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-emerald-400 font-bold">
                    Modeled Recapturable Spend
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500/40 text-amber-300 uppercase tracking-wider">
                    MODELED
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-emerald-300 metric-counter leading-none mb-2 tracking-tight">
                  ₹{count.toFixed(2)}M
                </div>
                <div className="text-sm text-slate-300">
                  Across 4 targeted intervention levers · Assumes 18–25% conversion
                </div>
              </div>
            </div>

            {/* Recovery progress meter card */}
            <div className="p-5 sm:p-6 rounded-xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md space-y-3 shadow-md">
              <div className="text-xs font-bold text-slate-200">Recovery Potential Meter</div>
              <div className="h-3.5 rounded-full bg-slate-800/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 transition-all duration-1500 ease-out"
                  style={{
                    width: `${meterFill}%`,
                    boxShadow: '0 0 20px rgba(16,185,129,0.5)',
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>₹0 baseline</span>
                <span className="text-amber-400 font-semibold">Modeled potential ceiling</span>
                <span className="text-emerald-300 font-bold">₹51.25M</span>
              </div>
            </div>

            {/* Disclosure box */}
            <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-950/20 backdrop-blur-md">
              <div className="text-[10px] font-mono text-amber-300 uppercase tracking-wider mb-1.5 font-bold flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                Methodological Governance Note
              </div>
              <div className="text-xs text-amber-200/80 leading-relaxed">
                ₹51.25M is a <strong>modeled recovery estimate</strong> derived from observed customer leakage and projected 18–25% intervention response rates. Actual capture depends on rollout fidelity and market response.
              </div>
            </div>
          </div>

          {/* Right Column: lever breakdown */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-slate-200 mb-4">Intervention Levers — Waterfall</div>

            {RECOVERY_LEVERS.map((lever) => (
              <div
                key={lever.id}
                className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/90 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-bold text-slate-100">{lever.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{lever.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black metric-counter" style={{ color: lever.color }}>
                      {lever.modeledImpact}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 mt-0.5 font-medium">[{lever.confidence}]</div>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: barsReady ? `${lever.width * 2.5}%` : '0%',
                      backgroundColor: lever.color,
                      boxShadow: `0 0 10px ${lever.color}40`,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3 justify-end pt-2">
              <div className="flex-1 h-px bg-slate-800" />
              <div className="text-xs text-slate-400 font-mono font-bold">Total Modeled Opportunity: ₹51.25M</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
