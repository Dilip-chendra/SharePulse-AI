import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const ExperimentationScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const armsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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

      // Split streams, then reveal results (Section 20)
      if (armsRef.current) {
        tl.fromTo(armsRef.current.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.15 }, 0);
      }

      tl.fromTo(resultsRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 }, 0.4);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-experiment"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Causal Integrity Narrative */}
        <div className="md:w-5/12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>SCENE 13 · CAUSAL EXPERIMENTATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
            Prove Causality.
            <span className="block text-emerald-400 mt-1">Eliminate Marketing Assumptions.</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Never confuse correlation with causation. Before committing full institutional capital, campaigns run as randomized controlled trials (RCTs) against true holdouts.
          </p>

          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-300 font-mono">
            <strong>Methodology Notice:</strong> Labeled <span className="font-bold">[EXPERIMENT DESIGN / SIMULATION]</span>. Eliminates selection bias via statistical power analysis (alpha = 0.05, 80% power).
          </div>
        </div>

        {/* Right Side: Split Control vs Treatment Stream (Section 20) */}
        <div className="md:w-7/12 w-full space-y-4 font-mono text-xs">
          <div ref={armsRef} className="grid grid-cols-2 gap-4">
            {/* Treatment Stream */}
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-400">
                <span>Treatment Arm</span>
                <span>Active Offer</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">2,500</div>
              <div className="text-[11px] text-slate-400">Prime Statement Alert Active</div>
              <div className="text-[11px] text-emerald-400 font-bold">Outcome: ₹18.45M Spend</div>
            </div>

            {/* Control Stream */}
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Control Arm</span>
                <span>Silent Holdout</span>
              </div>
              <div className="text-2xl font-black text-slate-300 font-mono">2,500</div>
              <div className="text-[11px] text-slate-400">Zero Marketing Touchpoint</div>
              <div className="text-[11px] text-slate-300 font-bold">Outcome: ₹15.12M Spend</div>
            </div>
          </div>

          {/* Measured Results & CI (Section 20) */}
          <div
            ref={resultsRef}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#0B0F19] to-[#0D1321] border border-[#1A2234] space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-300 font-bold uppercase text-[10px]">Causal Lift Validation</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                VERDICT: SCALE
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 text-[10px] block">Incremental Lift</span>
                <span className="text-xl font-bold text-emerald-400">+22.0%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">95% CI: [18.2%, 25.8%]</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">Net Value</span>
                <span className="text-xl font-bold text-blue-400">+₹2.68M</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">After intervention cost</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">Significance</span>
                <span className="text-xl font-bold text-white">p = 0.0004</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Highly Significant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
