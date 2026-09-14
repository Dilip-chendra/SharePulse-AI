import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export const SoWContractionScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const altRingRef = useRef<SVGCircleElement>(null);
  const [sowValue, setSowValue] = useState<number>(28.91);
  const [isContracted, setIsContracted] = useState<boolean>(false);

  // SVG ring circumference for r = 140 -> 2 * Math.PI * 140 ≈ 879.64
  const CIRCUMFERENCE = 879.64;

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
          scrub: 0.6,
          onUpdate: (self) => {
            const currentSow = 28.91 - self.progress * (28.91 - 19.48);
            setSowValue(Number(currentSow.toFixed(2)));
            setIsContracted(self.progress > 0.4);

            // Physically update SVG stroke-dasharray
            if (ringRef.current && altRingRef.current) {
              const hsicOffset = (currentSow / 100) * CIRCUMFERENCE;
              ringRef.current.style.strokeDasharray = `${hsicOffset} ${CIRCUMFERENCE}`;
              
              const altOffset = ((100 - currentSow) / 100) * CIRCUMFERENCE;
              altRingRef.current.style.strokeDasharray = `${altOffset} ${CIRCUMFERENCE}`;
              altRingRef.current.style.strokeDashoffset = `${-hsicOffset}`;
            }
          },
        },
      });

      // Subtle scale and rotation timeline
      tl.to(containerRef.current, { ease: 'none' });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-sow"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Editorial Narrative */}
        <div className="md:w-1/2 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>SCENE 03 · THE SHARE OF WALLET COLLAPSE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            HSIC SHARE CONTRACTS.
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Between FY25 and FY26, total customer retail spend at MetroMart grew from <strong>₹296.34M</strong> to <strong>₹353.80M</strong>. But HSIC co-branded card net capture collapsed.
          </p>

          <div className="pt-2 flex items-baseline gap-4 font-mono">
            <div className="text-rose-400 font-extrabold text-2xl sm:text-3xl">
              −9.43 pp
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              Net Contraction [OBSERVED]
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#0B0F19] border border-[#1A2234]">
              <span className="text-slate-500 block text-[10px] uppercase">FY25 Benchmark</span>
              <span className="text-blue-400 font-bold text-base">28.91%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">₹85.67M / ₹296.34M</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0B0F19] border border-[#1A2234]">
              <span className="text-slate-500 block text-[10px] uppercase">FY26 Reality</span>
              <span className="text-rose-400 font-bold text-base">19.48%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">₹68.92M / ₹353.80M</span>
            </div>
          </div>
        </div>

        {/* Right Circular Radial Contraction Visualization (Section 10) */}
        <div className="md:w-1/2 flex items-center justify-center relative">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Ambient Backing Glow */}
            <div 
              className={`absolute inset-0 rounded-full blur-[70px] transition-colors duration-500 pointer-events-none opacity-30 ${
                isContracted ? 'bg-rose-500' : 'bg-blue-500'
              }`}
            />

            {/* SVG Radial Visualization */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 320 320">
              {/* Background Ring Track */}
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="#1E293B"
                strokeWidth="20"
                className="opacity-40"
              />

              {/* Alternative Rails Arc (Expands) */}
              <circle
                ref={altRingRef}
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="20"
                strokeLinecap="round"
                style={{
                  strokeDasharray: `${(71.09 / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`,
                  strokeDashoffset: `${-(28.91 / 100) * CIRCUMFERENCE}`,
                  transition: 'stroke 0.3s ease',
                }}
              />

              {/* HSIC Share Arc (Physically Contracts from 28.91% to 19.48%) */}
              <circle
                ref={ringRef}
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="22"
                strokeLinecap="round"
                style={{
                  strokeDasharray: `${(28.91 / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`,
                  filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.4))',
                }}
              />
            </svg>

            {/* Central Metric Value Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
                HSIC SHARE OF WALLET
              </span>
              <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight my-1">
                {sowValue.toFixed(2)}%
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                {isContracted ? 'FY26 Ground Truth' : 'FY25 Initial Baseline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
