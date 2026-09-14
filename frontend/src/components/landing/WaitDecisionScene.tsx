import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const WaitDecisionScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

      // Card appears, then the "WAIT" stamp slams in (Section 19)
      tl.fromTo(cardRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 }, 0)
        .fromTo(stampRef.current, { opacity: 0, scale: 1.5, rotate: -8 }, { opacity: 1, scale: 1, rotate: -2, duration: 0.4, ease: 'back.out(1.7)' }, 0.4);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-wait"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Product Philosophy */}
        <div className="md:w-5/12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>SCENE 12 · COUNTERFACTUAL RESTRAINT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
            Counterfactual Restraint
            <span className="block text-2xl sm:text-3xl font-semibold text-amber-300 mt-2 font-sans">
              Knowing When to Act, and When to Hold.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            If a customer's organic recovery probability is already high, sending a discount voucher is margin cannibalization. The engine explicitly holds back marketing capital.
          </p>

          <div className="text-xs font-mono text-slate-500 pt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Counterfactual Test: Natural Rebound &gt; 40% → Hold Policy</span>
          </div>
        </div>

        {/* Right Side: Evaluated Customer Profile & Stamp (Section 19) */}
        <div className="md:w-7/12 w-full flex items-center justify-center relative">
          <div
            ref={cardRef}
            className="w-full max-w-md p-6 rounded-2xl bg-[#0B0F19] border border-[#1A2234] shadow-2xl relative space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Auditing Customer #28941</span>
              <span className="text-slate-500">Cohort: One-Hit Wonder</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Card Tenure:</span>
                <span className="text-slate-200 font-semibold">95 Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Intervention Candidate:</span>
                <span className="text-slate-200">NBA 04 (₹250 Voucher)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Organic Rebound Probability:</span>
                <span className="text-amber-400 font-bold">48.2% Natural Recovery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Projected Margin Cannibalization:</span>
                <span className="text-rose-400 font-bold">High Risk</span>
              </div>
            </div>

            {/* The Big "WAIT" Stamp */}
            <div
              ref={stampRef}
              className="mt-4 p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500 text-center shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-widest uppercase">
                DECISION: WAIT
              </div>
              <div className="text-[10px] text-amber-200/80 mt-1 font-sans">
                Natural organic rebound expected. Suppress campaign to preserve margin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
