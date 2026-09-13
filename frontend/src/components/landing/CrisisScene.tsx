import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Verified data — FY25 vs FY26 SoW
interface BarItem {
  year: string;
  sow: number;
  color: string;
}

const SOW_DATA: BarItem[] = [
  { year: 'FY25', sow: 28.91, color: '#6366f1' },
  { year: 'FY26', sow: 19.48, color: '#f43f5e' },
];

const MAX_VALUE = 35;

// Each bar must be its own component to use hooks legally
const AnimatedBar: React.FC<{ item: BarItem; delay: number }> = ({ item, delay }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        const pct = (item.sow / MAX_VALUE) * 100;
        if (!prefersReduced) {
          gsap.fromTo(el, { width: '0%' }, { width: `${pct}%`, duration: 1.2, ease: 'power2.out', delay });
          gsap.to({ val: 0 }, {
            val: item.sow,
            duration: 1.2,
            ease: 'power2.out',
            delay,
            onUpdate: function () { setDisplayed(parseFloat(this.targets()[0].val.toFixed(2))); },
          });
        } else {
          el.style.width = `${pct}%`;
          setDisplayed(item.sow);
        }
      },
    });

    return () => trigger.kill();
  }, [item.sow, delay]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-mono text-slate-400">{item.year}</span>
        <span
          className="text-xl sm:text-2xl font-black metric-counter"
          style={{ color: item.color }}
        >
          {displayed.toFixed(2)}%
        </span>
      </div>
      <div className="h-10 sm:h-12 bg-slate-800/60 rounded-lg overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-lg"
          style={{ backgroundColor: item.color, width: '0%', boxShadow: `0 0 20px ${item.color}40` }}
        />
      </div>
    </div>
  );
};

export const CrisisScene: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const deltaRef = useRef<HTMLDivElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
      });
      gsap.from(deltaRef.current, {
        opacity: 0, scale: 0.85, duration: 0.7, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: deltaRef.current, start: 'top 80%' },
      });
      gsap.from(insightRef.current, {
        opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: insightRef.current, start: 'top 85%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-crisis"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 bg-[#07090E] overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-rose-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-950/40 text-xs font-mono tracking-wider text-rose-400 uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Macro Diagnostic · OBSERVED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            The Share of Wallet{' '}
            <span className="text-gradient-crisis">Collapse</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Empirical transaction audit across 444,000+ transactions reveals a structural 9.43 percentage-point contraction in two fiscal years.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Bar chart */}
          <div className="space-y-6 sm:space-y-8">
            {SOW_DATA.map((item, idx) => (
              <AnimatedBar key={item.year} item={item} delay={idx * 0.3} />
            ))}

            {/* Axis label */}
            <div className="flex justify-between text-[10px] font-mono text-slate-600 px-0.5">
              <span>0%</span>
              <span>HSIC Share of Total MetroMart Spend</span>
              <span>35%</span>
            </div>
          </div>

          {/* Delta callout + insight */}
          <div className="space-y-5">
            {/* Delta card */}
            <div
              ref={deltaRef}
              className="relative p-6 sm:p-8 rounded-2xl border border-rose-500/20 bg-rose-950/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/10 to-transparent" />
              <div className="relative">
                <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-rose-400 mb-2">
                  Year-over-Year Change · OBSERVED
                </div>
                <div className="text-5xl sm:text-6xl font-black text-white metric-counter mb-2">
                  −9.43<span className="text-3xl font-bold text-rose-400"> pp</span>
                </div>
                <div className="text-sm text-slate-400">
                  From <span className="text-indigo-400 font-semibold">28.91%</span> in FY25 to{' '}
                  <span className="text-rose-400 font-semibold">19.48%</span> in FY26
                </div>
              </div>
            </div>

            {/* Insight card */}
            <div ref={insightRef} className="p-5 sm:p-6 rounded-xl border border-slate-700/50 bg-slate-900/40 space-y-3">
              <div className="text-[10px] font-mono tracking-wider uppercase text-slate-500">AI Insight</div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                The −9.43 pp contraction is driven by payment displacement toward MetroMart Wallet (capturing{' '}
                <span className="text-cyan-400 font-semibold">35.68%</span> of basket spend) and Cash/UPI (
                <span className="text-cyan-400 font-semibold">23.40%</span>), particularly in high-ticket Electronics and Appliance transactions.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-xs text-slate-500 font-mono">Deterministic · t = 118.4, p &lt; 0.001</span>
              </div>
            </div>

            {/* Big-ticket stat */}
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/15">
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-1">
                High-Value Transactions (&gt;₹5,000) · OBSERVED
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-400 metric-counter">11.20%</span>
                <span className="text-sm text-slate-400">HSIC SoW on transactions above ₹5,000</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                vs. 19.48% overall — HSIC is disproportionately losing high-value spend
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
