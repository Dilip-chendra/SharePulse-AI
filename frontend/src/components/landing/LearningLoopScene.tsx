import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const LOOP_STAGES = [
  { name: 'DECIDE', desc: 'Score & evaluate NBA', color: '#8B5CF6' },
  { name: 'ACT', desc: 'Trigger precision offer', color: '#EC4899' },
  { name: 'OBSERVE', desc: 'Stream transaction ledger', color: '#3B82F6' },
  { name: 'MEASURE', desc: 'Compute RCT causal lift', color: '#10B981' },
  { name: 'LEARN', desc: 'Update propensity models', color: '#F59E0B' },
  { name: 'IMPROVE', desc: 'Refine hurdle rates', color: '#06B6D4' },
];

export const LearningLoopScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

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

      // Circular wheel rotation and node illumination (Section 21)
      if (circleRef.current) {
        tl.fromTo(circleRef.current, { rotate: -40 }, { rotate: 20, ease: 'none', duration: 1 }, 0);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-loop"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Editorial Transformation */}
        <div className="md:w-5/12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>SCENE 14 · THE LEARNING FLYWHEEL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
            NOT JUST ANALYTICS.
          </h2>

          <div className="text-2xl sm:text-3xl font-bold text-indigo-300 font-sans">
            A CLOSED-LOOP WALLET RECOVERY SYSTEM.
          </div>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every experiment measures incrementality, updates customer risk propensities, and refines next-best-action hurdles. The system learns continuously from real transaction response.
          </p>
        </div>

        {/* Right Side: Circular Closed Loop Wheel (Section 21) */}
        <div className="md:w-7/12 w-full flex items-center justify-center relative">
          <div
            ref={circleRef}
            className="w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 rounded-full border border-slate-800 relative flex items-center justify-center shadow-2xl bg-[#080B11]/80 backdrop-blur-md"
          >
            {/* Center Hub */}
            <div className="w-28 h-28 rounded-full bg-[#0D1321] border border-indigo-500/40 flex flex-col items-center justify-center text-center p-2 z-10 shadow-lg">
              <span className="text-[9px] font-mono text-slate-500 uppercase">CORE ENGINE</span>
              <span className="text-xs font-bold text-white font-mono mt-0.5">AUTONOMOUS LOOP</span>
            </div>

            {/* 6 Peripheral Flywheel Nodes */}
            {LOOP_STAGES.map((node, i) => {
              const angle = (i / LOOP_STAGES.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 130; // pixels from center
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={node.name}
                  className="absolute p-2 sm:p-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] flex flex-col items-center justify-center text-center font-mono shadow-md w-24 sm:w-28"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <span className="text-[10px] font-bold" style={{ color: node.color }}>
                    {node.name}
                  </span>
                  <span className="text-[8px] text-slate-400 leading-none mt-0.5">
                    {node.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
