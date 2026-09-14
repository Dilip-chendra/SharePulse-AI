import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const STAGES = [
  { step: '01', name: 'TRANSACTIONS', desc: '444,118 Ledger Records', color: '#3B82F6' },
  { step: '02', name: 'SIGNALS', desc: 'Velocity & Rail Diversion', color: '#06B6D4' },
  { step: '03', name: 'BEHAVIOR', desc: 'Cohort Clustering', color: '#F97316' },
  { step: '04', name: 'OPPORTUNITY', desc: '₹51.25M Sized & Ranked', color: '#EAB308' },
  { step: '05', name: 'ACTION', desc: 'Unit Economics Filter', color: '#A855F7' },
  { step: '06', name: 'MEASUREMENT', desc: 'Causal RCT Lift Validation', color: '#10B981' },
];

export const ReasoningPipelineScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

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

      // Animate progress line illumination
      if (lineRef.current) {
        tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0);
      }

      // Progressively illuminate stages (Section 15)
      if (pipelineRef.current) {
        const nodes = pipelineRef.current.children;
        tl.fromTo(
          nodes,
          { opacity: 0.3, y: 15, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.25, stagger: 0.14, ease: 'power2.out' },
          0.1
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-decision"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-6xl w-full flex flex-col items-center text-center space-y-10">
        {/* Header */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>SCENE 08 · THE DECISION PIPELINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight font-sans">
            SHAREPULSE-AI TURNS DATA INTO DECISIONS.
          </h2>

          <p className="text-slate-400 text-sm sm:text-base font-mono max-w-xl mx-auto">
            Not a chatbot. Not a decorative visual. A deterministic analytical pipeline moving from raw swipes to measured causal recovery.
          </p>
        </div>

        {/* 6-Stage Illuminated Pipeline (Section 15) */}
        <div className="w-full relative py-6">
          {/* Connecting Track */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2 hidden md:block" />
          
          {/* Illuminated Progress Line */}
          <div
            ref={lineRef}
            className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 -translate-y-1/2 origin-left hidden md:block shadow-[0_0_12px_rgba(99,102,241,0.8)]"
          />

          {/* Pipeline Nodes */}
          <div
            ref={pipelineRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10 font-mono"
          >
            {STAGES.map((st) => (
              <div
                key={st.name}
                className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234] hover:border-slate-700 transition-all text-left space-y-2 relative"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-bold text-white font-mono">STEP {st.step}</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                </div>
                <div className="text-xs font-bold text-slate-100 font-sans tracking-wide">
                  {st.name}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {st.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Guarantee Strip */}
        <div className="text-xs font-mono text-slate-500 flex items-center gap-6 justify-center pt-2">
          <span>Deterministic Analytics</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>No Hallucinated Actions</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>Full Unit Margin Audit</span>
        </div>
      </div>
    </section>
  );
};
