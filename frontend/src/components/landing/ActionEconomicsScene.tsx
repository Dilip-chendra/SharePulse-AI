import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const ActionEconomicsScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formulaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.8,
        },
      });

      // Sequential equation breakdown (Section 18)
      if (formulaRef.current) {
        tl.fromTo(
          formulaRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.12, ease: 'power2.out' },
          0
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-economics"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Editorial Philosophy */}
        <div className="md:w-5/12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SCENE 11 · UNIT MARGIN DISCIPLINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
            Unit Margin Discipline
            <span className="block text-2xl sm:text-3xl font-semibold text-cyan-300 mt-2 font-sans">
              Is the Recovery Truly Worth the Cost?
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every intervention is gated by transparent unit economics. No recommendation is deployed unless expected incremental spend exceeds incentive and operational hurdles.
          </p>

          <div className="text-xs font-mono text-slate-500 pt-2">
            Hurdle Rate: <span className="text-emerald-400 font-bold">&gt; 2.0x Capital Multiplier</span>
          </div>
        </div>

        {/* Right Side: Visual Netting Equation (Section 18) */}
        <div ref={formulaRef} className="md:w-7/12 w-full space-y-3 font-mono text-xs">
          {/* Term 1: Incremental Spend */}
          <div className="p-4 rounded-xl bg-[#0B0F19] border border-emerald-500/40 flex items-center justify-between">
            <div>
              <span className="text-emerald-400 font-bold uppercase text-[10px] block">Gross Upside</span>
              <span className="text-sm font-bold text-white font-sans">Expected Incremental Spend</span>
            </div>
            <span className="text-xl font-black text-emerald-400 font-mono">+₹51.25M</span>
          </div>

          {/* Minus Operator */}
          <div className="text-center text-slate-500 font-black text-lg py-0.5">−</div>

          {/* Term 2: Offer Cost */}
          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234] flex items-center justify-between">
            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px] block">Incentive Budget</span>
              <span className="text-sm font-bold text-slate-200 font-sans">Offer Cost &amp; Subvention</span>
            </div>
            <span className="text-base font-bold text-amber-400 font-mono">−₹9.20M</span>
          </div>

          {/* Minus Operator */}
          <div className="text-center text-slate-500 font-black text-lg py-0.5">−</div>

          {/* Term 3: Comms & Op Cost */}
          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234] flex items-center justify-between">
            <div>
              <span className="text-blue-400 font-bold uppercase text-[10px] block">Delivery Overhead</span>
              <span className="text-sm font-bold text-slate-200 font-sans">Communication &amp; Op Cost</span>
            </div>
            <span className="text-base font-bold text-blue-400 font-mono">−₹5.60M</span>
          </div>

          {/* Equals Operator */}
          <div className="text-center text-cyan-400 font-black text-lg py-0.5">=</div>

          {/* Net Result & ROI */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-[#0B0F19] border border-cyan-500/50 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-cyan-300 font-bold uppercase text-[10px] block">Net Value Contribution</span>
              <span className="text-2xl font-black text-white font-mono">₹36.45 Million</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block">Portfolio ROI</span>
              <span className="text-2xl font-black text-cyan-300 font-mono">3.4x</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
