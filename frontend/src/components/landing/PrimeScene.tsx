import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Verified data
const CASHBACK_LEAKED = 5516360.84;
const CARDHOLDERS_AFFECTED = 19423;

// Top categories by forfeited cashback (verified from evidence pack)
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
  const [cashbackCount, setCashbackCount] = useState(0);
  const [cardholdersCount, setCardholdersCount] = useState(0);
  const [barsReady, setBarsReady] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
      });

      ScrollTrigger.create({
        trigger: cashbackRef.current,
        start: 'top 80%',
        onEnter: () => {
          setBarsReady(true);
          if (prefersReduced) {
            setCashbackCount(CASHBACK_LEAKED);
            setCardholdersCount(CARDHOLDERS_AFFECTED);
            return;
          }

          gsap.to({ val: 0 }, {
            val: CASHBACK_LEAKED,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: function () { setCashbackCount(this.targets()[0].val); },
          });

          gsap.to({ val: 0 }, {
            val: CARDHOLDERS_AFFECTED,
            duration: 2.0,
            ease: 'power2.out',
            onUpdate: function () { setCardholdersCount(Math.round(this.targets()[0].val)); },
          });

          // Animate stat cards
          gsap.from(cardholdersRef.current, {
            opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', delay: 0.5,
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
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 bg-[#07090E] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/30 text-xs font-mono tracking-wider text-amber-400 uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Prime Reward Intelligence · OBSERVED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Cashback They're{' '}
            <span className="text-gradient-gold">Leaving Behind</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Prime cardholders are unknowingly forfeiting rewards — not because they churned, but because they chose a different payment rail at checkout. This is recoverable today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: main metrics */}
          <div ref={cashbackRef} className="space-y-5">
            {/* Big cashback number */}
            <div className="relative p-6 sm:p-8 rounded-2xl border border-amber-500/25 bg-amber-950/15 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent" />
              {/* Evaporation visual hint */}
              <div className="absolute top-3 right-3 text-amber-400/30 text-4xl select-none">◆</div>
              <div className="relative">
                <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-amber-400 mb-2">
                  Prime Cashback Forfeited · OBSERVED
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-300 metric-counter leading-none mb-2">
                  {formatCurrency(cashbackCount)}
                </div>
                <div className="text-sm text-slate-400">
                  ₹5,516,360.84 total · FY26 · On ₹331.2M qualifying spend
                </div>
              </div>
            </div>

            {/* Cardholders affected */}
            <div ref={cardholdersRef} className="p-5 rounded-xl border border-slate-700/50 bg-slate-900/40">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Cardholders Affected</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white metric-counter">
                  {cardholdersCount.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-400">Prime cardholders</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Avg forfeited per cardholder: <span className="text-amber-400 font-semibold">₹284</span>
              </div>

              {/* Per-cardholder bar */}
              <div className="mt-3">
                <div className="text-[10px] text-slate-600 mb-1 font-mono">₹0 forfeited → ₹284 avg → ₹2,000+ high forfeiture</div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-300 transition-all duration-1500"
                    style={{ width: barsReady ? '62%' : '0%', transition: 'width 1.5s ease' }}
                  />
                </div>
              </div>
            </div>

            {/* Reward rates reminder */}
            <div className="p-4 rounded-xl border border-indigo-800/40 bg-indigo-950/20">
              <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-2">Prime Reward Rates (Unclaimed)</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { cat: 'Grocery', rate: '5%', color: 'text-emerald-400' },
                  { cat: 'Electronics', rate: '3%', color: 'text-indigo-400' },
                  { cat: 'All Other', rate: '1%', color: 'text-slate-400' },
                ].map((r) => (
                  <div key={r.cat} className="text-center">
                    <div className={`text-xl font-black ${r.color}`}>{r.rate}</div>
                    <div className="text-[10px] text-slate-500">{r.cat}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: category breakdown */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-300 mb-4">Forfeited Cashback by Category</div>
            {CATEGORY_DATA.map((cat, idx) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: cat.color }}>
                      {cat.pct}%
                    </span>
                    <span className="text-xs text-slate-500 font-mono w-20 text-right">
                      ₹{(cat.forfeited / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: barsReady ? `${cat.pct * 2.4}%` : '0%',
                      backgroundColor: cat.color,
                      transitionDelay: `${idx * 80 + 300}ms`,
                      transition: 'width 0.9s ease',
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 rounded-xl border border-emerald-800/30 bg-emerald-950/15">
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-2">Recovery Action</div>
              <div className="text-sm text-slate-300 leading-relaxed">
                Deploy <span className="text-emerald-400 font-semibold">point-of-sale checkout prompts</span> highlighting unearned rewards. Show each customer their exact forfeited amount. Expected recovery: 18–25% conversion to HSIC payment rail.
              </div>
              <div className="text-[9px] font-mono text-slate-600 mt-2">[EXPERIMENT CANDIDATE — Not Yet Deployed]</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
