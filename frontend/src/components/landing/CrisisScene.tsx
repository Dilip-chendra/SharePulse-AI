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

// Each bar component defaults to its actual value, preventing 0-freeze
const AnimatedBar: React.FC<{ item: BarItem; delay: number }> = ({ item, delay }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState<number>(item.sow);
  const animFired = useRef<boolean>(false);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (animFired.current) return;
        animFired.current = true;
        const pct = (item.sow / MAX_VALUE) * 100;
        if (!prefersReduced) {
          gsap.fromTo(el, { width: '0%' }, { width: `${pct}%`, duration: 1.2, ease: 'power2.out', delay });
          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: item.sow,
            duration: 1.2,
            ease: 'power2.out',
            delay,
            onUpdate: () => setDisplayed(parseFloat(counterObj.val.toFixed(2))),
            onComplete: () => setDisplayed(item.sow),
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
        <span className="text-sm font-mono text-slate-300 font-semibold">{item.year}</span>
        <span
          className="text-xl sm:text-2xl font-black metric-counter"
          style={{ color: item.color }}
        >
          {displayed.toFixed(2)}%
        </span>
      </div>
      <div className="h-10 sm:h-12 bg-slate-800/80 rounded-xl overflow-hidden p-1 border border-slate-700/40">
        <div
          ref={barRef}
          className="h-full rounded-lg transition-all"
          style={{
            backgroundColor: item.color,
            width: `${(item.sow / MAX_VALUE) * 100}%`,
            boxShadow: `0 0 24px ${item.color}60`,
          }}
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
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
      });
      gsap.from(deltaRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: deltaRef.current, start: 'top 85%' },
      });
      gsap.from(insightRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: insightRef.current, start: 'top 85%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-crisis"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden"
    >
      {/* Soft atmospheric ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-rose-950/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-950/40 text-xs font-mono tracking-wider text-rose-300 uppercase mb-4 shadow-sm shadow-rose-950">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Macro Diagnostic · OBSERVED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            The Share of Wallet{' '}
            <span className="text-gradient-crisis">Collapse</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Empirical transaction audit across 444,000+ transactions reveals a structural 9.43 percentage-point contraction in two fiscal years.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Bar chart */}
          <div className="space-y-6 sm:space-y-8">
            {SOW_DATA.map((item, idx) => (
              <AnimatedBar key={item.year} item={item} delay={idx * 0.25} />
            ))}

            {/* Axis label */}
            <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
              <span>0%</span>
              <span className="text-slate-500">HSIC Share of Total MetroMart Spend</span>
              <span>35% Max Scale</span>
            </div>
          </div>

          {/* Delta callout + insight */}
          <div className="space-y-5">
            {/* Delta card */}
            <div
              ref={deltaRef}
              className="relative p-6 sm:p-8 rounded-2xl border border-rose-500/25 bg-rose-950/20 backdrop-blur-md overflow-hidden shadow-xl shadow-black/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/15 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-rose-400 font-bold mb-2">
                  Year-over-Year Change · OBSERVED
                </div>
                <div className="text-5xl sm:text-6xl font-black text-white metric-counter mb-2 tracking-tight">
                  −9.43<span className="text-3xl font-bold text-rose-400"> pp</span>
                </div>
                <div className="text-sm text-slate-300">
                  From <span className="text-indigo-400 font-bold">28.91%</span> in FY25 to{' '}
                  <span className="text-rose-400 font-bold">19.48%</span> in FY26
                </div>
              </div>
            </div>

            {/* Insight card */}
            <div ref={insightRef} className="p-5 sm:p-6 rounded-xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md space-y-3 shadow-lg">
              <div className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-semibold">AI Diagnostic Summary</div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                The −9.43 pp contraction is driven by payment displacement toward MetroMart Wallet (capturing{' '}
                <span className="text-cyan-400 font-bold">35.68%</span> of basket spend) and Cash/UPI (
                <span className="text-cyan-400 font-bold">23.40%</span>), particularly in high-ticket Electronics and Appliance transactions.
              </p>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-xs text-slate-400 font-mono">Deterministic · t = 118.4, p &lt; 0.001</span>
              </div>
            </div>

            {/* Big-ticket stat */}
            <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-950/20 backdrop-blur-md">
              <div className="text-[10px] font-mono text-amber-300 uppercase tracking-wider mb-1 font-bold">
                High-Value Transactions (&gt;₹5,000) · OBSERVED
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-400 metric-counter">11.20%</span>
                <span className="text-sm text-slate-300">HSIC SoW on transactions above ₹5,000</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                vs. 19.48% portfolio overall — HSIC is disproportionately losing high-ticket transactions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
