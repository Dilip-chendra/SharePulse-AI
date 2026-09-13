import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Verified data
const CASHBACK_LEAKED = 5516360.84;
const CARDHOLDERS_AFFECTED = 19423;

const CATEGORY_DATA = [
  { name: 'Electronics',    forfeited: 2230000, pct: 40.4, color: '#6366f1' },
  { name: 'Grocery',        forfeited: 898000,  pct: 16.3, color: '#10b981' },
  { name: 'Apparel',        forfeited: 720000,  pct: 13.1, color: '#8b5cf6' },
  { name: 'Large Appliances', forfeited: 580000, pct: 10.5, color: '#f59e0b' },
  { name: 'Other',          forfeited: 1088361, pct: 19.7, color: '#64748b' },
];

export const PrimeScene: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cashbackRef = useRef<HTMLDivElement>(null);
  const cardholdersRef = useRef<HTMLDivElement>(null);

  // Initialize with verified truth values — NEVER 0!
  const [cashbackCount, setCashbackCount] = useState<number>(CASHBACK_LEAKED);
  const [cardholdersCount, setCardholdersCount] = useState<number>(CARDHOLDERS_AFFECTED);
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
        trigger: cashbackRef.current,
        start: 'top 85%',
        onEnter: () => {
          if (animFired.current) return;
          animFired.current = true;
          setBarsReady(true);

          if (prefersReduced) {
            setCashbackCount(CASHBACK_LEAKED);
            setCardholdersCount(CARDHOLDERS_AFFECTED);
            return;
          }

          const objCash = { val: 0 };
          gsap.to(objCash, {
            val: CASHBACK_LEAKED,
            duration: 2.0,
            ease: 'power2.out',
            onUpdate: () => setCashbackCount(objCash.val),
            onComplete: () => setCashbackCount(CASHBACK_LEAKED),
          });

          const objCards = { val: 0 };
          gsap.to(objCards, {
            val: CARDHOLDERS_AFFECTED,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => setCardholdersCount(Math.round(objCards.val)),
            onComplete: () => setCardholdersCount(CARDHOLDERS_AFFECTED),
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const formatCurrency = (v: number) => {
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
    return `₹${Math.round(v).toLocaleString('en-IN')}`;
  };

  return (
    <section
      ref={sectionRef}
      id="scene-prime"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden"
    >
      {/* Soft atmospheric ambient glow */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] bg-amber-950/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 text-xs font-mono tracking-wider text-amber-300 uppercase mb-4 shadow-sm shadow-amber-950">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Prime Reward Intelligence · OBSERVED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Cashback They're{' '}
            <span className="text-gradient-gold">Leaving Behind</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Prime cardholders are unknowingly forfeiting rewards — not because they churned, but because they chose a different payment rail at checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column: main metrics */}
          <div ref={cashbackRef} className="space-y-5">
            {/* Big cashback number card */}
            <div className="relative p-6 sm:p-8 rounded-2xl border border-amber-500/25 bg-amber-950/20 backdrop-blur-md overflow-hidden shadow-xl shadow-black/30">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/15 to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 text-amber-400/20 text-4xl select-none">◆</div>
              <div className="relative">
                <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-amber-400 font-bold mb-2">
                  Prime Cashback Forfeited · OBSERVED
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-300 metric-counter leading-none mb-2 tracking-tight">
                  {formatCurrency(cashbackCount)}
                </div>
                <div className="text-sm text-slate-300">
                  ₹5,516,360.84 total forfeited · FY26 · On ₹331.2M qualifying spend
                </div>
              </div>
            </div>

            {/* Cardholders affected */}
            <div ref={cardholdersRef} className="p-5 sm:p-6 rounded-xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md shadow-md">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">Cardholders Impacted</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white metric-counter">
                  {cardholdersCount.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-400 font-medium">Prime cardholders</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Average forfeited per cardholder: <span className="text-amber-400 font-bold">₹284</span>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="text-[10px] text-slate-400 mb-1 font-mono">₹0 baseline → ₹284 avg → ₹2,000+ high-forfeiture tier</div>
                <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-300 transition-all duration-1000 ease-out"
                    style={{ width: barsReady ? '64%' : '0%' }}
                  />
                </div>
              </div>
            </div>

            {/* Reward rates reference */}
            <div className="p-4 rounded-xl border border-indigo-500/25 bg-indigo-950/20 backdrop-blur-md">
              <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider mb-2 font-bold">Prime Reward Rates (Unclaimed)</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { cat: 'Grocery', rate: '5%', color: 'text-emerald-400' },
                  { cat: 'Electronics', rate: '3%', color: 'text-indigo-400' },
                  { cat: 'All Other', rate: '1%', color: 'text-slate-300' },
                ].map((r) => (
                  <div key={r.cat} className="text-center p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
                    <div className={`text-xl font-black ${r.color}`}>{r.rate}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{r.cat}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: category breakdown */}
          <div className="space-y-4">
            <div className="text-sm font-bold text-slate-200 mb-3">Forfeited Cashback by Category</div>
            {CATEGORY_DATA.map((cat, idx) => (
              <div key={cat.name} className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-200">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold" style={{ color: cat.color }}>
                      {cat.pct}%
                    </span>
                    <span className="text-xs text-slate-400 font-mono w-20 text-right">
                      ₹{(cat.forfeited / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: barsReady ? `${cat.pct * 2.3}%` : '0%',
                      backgroundColor: cat.color,
                      transitionDelay: `${idx * 60}ms`,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-950/20 backdrop-blur-md mt-4">
              <div className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider mb-1.5 font-bold">Recommended Intervention</div>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Deploy <span className="text-emerald-300 font-semibold">POS checkout prompts</span> alerting customers to forfeited rewards before payment confirmation. Estimated 18–25% payment-method switch rate.
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-2 font-semibold">[EXPERIMENT CANDIDATE — Not Yet Deployed]</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
