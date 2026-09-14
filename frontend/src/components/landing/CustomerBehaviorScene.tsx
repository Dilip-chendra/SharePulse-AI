import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const COHORTS = [
  { name: 'Silent Defectors', count: '10,098', sub: 'ΔSoW ≤ −15 pp with active store visits', color: '#F97316', risk: 'Critical' },
  { name: 'Big-Ticket Defectors', count: '14,850', sub: 'Avg ticket > ₹5,000 using competitor CC', color: '#3B82F6', risk: 'High' },
  { name: 'Prime Inactive Pool', count: '19,423', sub: 'Accrued unredeemed reward balances', color: '#F59E0B', risk: 'Medium' },
  { name: 'One-Hit Wonders', count: '4,000', sub: 'Single post-issuance swipe dormant >90d', color: '#A855F7', risk: 'Evaluation' },
];

export const CustomerBehaviorScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);

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

      // Crossfade narrative (Section 14)
      tl.fromTo(text1Ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
        .to(text1Ref.current, { opacity: 0, y: -20, duration: 0.2 }, 0.35)
        .fromTo(text2Ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35 }, 0.45);

      // Animate cluster nodes
      if (clusterRef.current) {
        tl.fromTo(
          clusterRef.current.children,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.08 },
          0.3
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-behavior"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Editorial Story Crossfade */}
        <div className="md:w-5/12 relative h-48 flex items-center">
          {/* Phase 1: Beyond aggregate swipes */}
          <div ref={text1Ref} className="absolute inset-x-0">
            <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase mb-3">
              SCENE 07 · BEHAVIORAL ARCHETYPES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-sans">
              Beyond Aggregate Swipes.
            </h2>
            <p className="text-slate-400 text-sm mt-3 font-mono">
              Aggregated spend tables hide the underlying human habit decay.
            </p>
          </div>

          {/* Phase 2: Behavioral archetypes */}
          <div ref={text2Ref} className="absolute inset-x-0 opacity-0">
            <div className="text-[11px] font-mono tracking-widest text-orange-400 uppercase mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span>COHORT DISCOVERY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-sans">
              Deconstructing <span className="text-orange-400">Behavioral Archetypes.</span>
            </h2>
            <p className="text-slate-300 text-sm mt-3 font-mono">
              Cardholders group into predictive migration vectors based on velocity and basket profile.
            </p>
          </div>
        </div>

        {/* Right Side: Clustered Cohort Cards */}
        <div ref={clusterRef} className="md:w-7/12 w-full space-y-3 font-mono">
          {COHORTS.map((c) => (
            <div
              key={c.name}
              className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234] hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="font-bold text-slate-100 font-sans text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="text-base font-black" style={{ color: c.color }}>
                  {c.count}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{c.sub}</span>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {c.risk} Priority
                </span>
              </div>
            </div>
          ))}

          <div className="pt-2 text-right text-[11px] font-mono text-slate-500">
            <span>Primary Focus: 10,098 Silent Defectors [MODEL_DERIVED]</span>
          </div>
        </div>
      </div>
    </section>
  );
};
