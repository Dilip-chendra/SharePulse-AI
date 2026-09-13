import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Verified / labeled data
const MODELED_RECOVERY_M = 51.25; // ₹51.25M — MODELED label required

const RECOVERY_LEVERS = [
  {
    id: 'checkout',
    label: 'Checkout Prompt',
    description: 'POS reminders of unclaimed Prime cashback',
    modeledImpact: '₹12.3M',
    confidence: 'EXPERIMENT CANDIDATE',
    color: '#10b981',
    width: 24,
  },
  {
    id: 'bigticket',
    label: 'Big-Ticket Nudge',
    description: 'Targeted HSIC offer on transactions >₹5,000',
    modeledImpact: '₹18.7M',
    confidence: 'EXPERIMENT CANDIDATE',
    color: '#6366f1',
    width: 36.5,
  },
  {
    id: 'defector',
    label: 'Defector Re-engagement',
    description: 'NBA campaign for 10,098 silent defectors',
    modeledImpact: '₹11.2M',
    confidence: 'EXPERIMENT CANDIDATE',
    color: '#f59e0b',
    width: 21.9,
  },
  {
    id: 'category',
    label: 'Category Boost',
    description: 'Electronics cashback 3% → 5% for 90 days',
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
  const [meterFill, setMeterFill] = useState(0);
  const [barsReady, setBarsReady] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
      });

      ScrollTrigger.create({
        trigger: meterRef.current,
        start: 'top 80%',
        onEnter: () => {
          setBarsReady(true);

          if (prefersReduced) {
            setMeterFill(100);
            setCount(MODELED_RECOVERY_M);
            return;
          }

          gsap.to({ val: 0 }, {
            val: MODELED_RECOVERY_M,
            duration: 2.5,
            ease: 'power2.out',
            onUpdate: function () { setCount(parseFloat(this.targets()[0].val.toFixed(2))); },
          });

          setTimeout(() => setMeterFill(100), 200);

          gsap.from('.rl-row', {
            opacity: 0,
            x: 30,
            duration: 0.5,
            stagger: 0.12,
            ease: 'power2.out',
            delay: 0.5,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-recovery"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 bg-[#07090E] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-900/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-xs font-mono tracking-wider text-emerald-400 uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Recovery Modeling · MODELED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Modeled{' '}
            <span className="text-gradient-brand">Recapture Opportunity</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            If targeted interventions achieve estimated conversion rates, the modeled recapturable spend represents significant revenue. These are{' '}
            <span className="text-amber-400 font-semibold">experiment candidates — not guaranteed outcomes.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: main meter */}
          <div ref={meterRef} className="space-y-5">
            {/* Modeled recovery amount */}
            <div className="relative p-6 sm:p-8 rounded-2xl border border-emerald-500/25 bg-emerald-950/15 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-transparent" />
              <div className="relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-emerald-400">
                    Modeled Recapturable Spend
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-900/50 border border-amber-600/40 text-amber-400 uppercase tracking-wider">
                    MODELED
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-emerald-300 metric-counter leading-none mb-1">
                  ₹{count.toFixed(2)}M
                </div>
                <div className="text-sm text-slate-400">
                  Across 4 recovery levers · Assumes 18–25% conversion · Not guaranteed revenue
                </div>
              </div>
            </div>

            {/* Recovery progress meter */}
            <div className="p-5 rounded-xl border border-slate-700/50 bg-slate-900/40 space-y-3">
              <div className="text-xs font-semibold text-slate-300">Recovery Potential Meter</div>
              <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-cyan-500 to-indigo-500 transition-all duration-2000"
                  style={{
                    width: `${meterFill}%`,
                    transition: 'width 2s ease 0.3s',
                    boxShadow: '0 0 20px rgba(16,185,129,0.4)',
                  }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-600">
                <span>₹0</span>
                <span className="text-amber-500">↑ Modeled maximum if all levers deployed</span>
                <span>₹51.25M</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-xl border border-amber-800/30 bg-amber-950/15">
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                Important Disclosure
              </div>
              <div className="text-xs text-amber-200/70 leading-relaxed">
                ₹51.25M is a <strong>modeled estimate</strong> based on observed defection volumes and assumed intervention conversion rates of 18–25%. Actual outcomes depend on execution, customer response, and market conditions. Label: <span className="font-mono text-amber-400">[MODELED RECAPTURABLE SPEND]</span>
              </div>
            </div>
          </div>

          {/* Right: lever breakdown */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-300 mb-4">Recovery Levers — Waterfall</div>

            {RECOVERY_LEVERS.map((lever) => (
              <div
                key={lever.id}
                className="rl-row p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/60 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{lever.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{lever.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black metric-counter" style={{ color: lever.color }}>
                      {lever.modeledImpact}
                    </div>
                    <div className="text-[8px] font-mono text-slate-600 mt-0.5">[{lever.confidence}]</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: barsReady ? `${lever.width}%` : '0%',
                      backgroundColor: lever.color,
                      boxShadow: `0 0 8px ${lever.color}50`,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="flex items-center gap-2 justify-end pt-2">
              <div className="flex-1 h-px bg-slate-800" />
              <div className="text-xs text-slate-400 font-mono">Total MODELED: ₹51.25M</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
