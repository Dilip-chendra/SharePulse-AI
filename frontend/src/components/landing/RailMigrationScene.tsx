import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface RailData {
  name: string;
  share: string;
  shareNum: number;
  amount: string;
  role: string;
  color: string;
}

const RAILS: RailData[] = [
  { name: 'MetroMart Wallet', share: '35.68%', shareNum: 35.68, amount: '₹126.2M', role: 'Primary Share Absorber', color: '#F59E0B' },
  { name: 'Cash / UPI', share: '23.40%', shareNum: 23.40, amount: '₹82.8M', role: 'Everyday Frictionless', color: '#10B981' },
  { name: 'HSIC Bank Card', share: '19.48%', shareNum: 19.48, amount: '₹68.9M', role: 'Contracted Co-Brand', color: '#3B82F6' },
  { name: 'Other Bank CC', share: '10.79%', shareNum: 10.79, amount: '₹38.2M', role: 'High-Tier Competitors', color: '#EC4899' },
  { name: 'Debit Card', share: '10.66%', shareNum: 10.66, amount: '₹37.7M', role: 'Direct Account Rail', color: '#06B6D4' },
];

export const RailMigrationScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

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

      // Narrative text transition (Section 11)
      tl.fromTo(text1Ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
        .to(text1Ref.current, { opacity: 0, y: -20, duration: 0.2 }, 0.35)
        .fromTo(text2Ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35 }, 0.45);

      // Animate rail bars expansion and illumination
      if (barsRef.current) {
        const barElements = barsRef.current.querySelectorAll('.rail-progress-bar');
        tl.fromTo(
          barElements,
          { width: '0%' },
          {
            width: (i) => `${(RAILS[i].shareNum / 40) * 100}%`,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
          },
          0.3
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-migration"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Narrative Text (Cross-Fading Story) */}
        <div className="md:w-5/12 relative h-48 flex items-center">
          {/* Phase 1: Store traffic remained strong */}
          <div ref={text1Ref} className="absolute inset-x-0">
            <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase mb-3">
              SCENE 04 · SPEND REDIRECTION
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-sans">
              Store Visits Remained Strong.
            </h2>
            <p className="text-slate-400 text-sm mt-3 font-mono">
              Total sales rose +19.4% in FY26. Store traffic and checkout volume grew consistently.
            </p>
          </div>

          {/* Phase 2: Payment rail changed */}
          <div ref={text2Ref} className="absolute inset-x-0 opacity-0">
            <div className="text-[11px] font-mono tracking-widest text-amber-400 uppercase mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>THE CO-BRAND DISPLACEMENT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-sans">
              Payment Rails <span className="text-amber-400">Shifted Away.</span>
            </h2>
            <p className="text-slate-300 text-sm mt-3 font-mono">
              MetroMart Wallet and Cash/UPI absorbed 59.08% of total retail turnover.
            </p>
          </div>
        </div>

        {/* Right Flowing Rail Distribution Cards */}
        <div ref={barsRef} className="md:w-7/12 w-full space-y-3.5">
          {RAILS.map((rail) => (
            <div
              key={rail.name}
              className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234] hover:border-slate-700 transition-colors font-mono relative overflow-hidden"
            >
              {/* Background fill track */}
              <div
                className="rail-progress-bar absolute left-0 top-0 bottom-0 opacity-10 pointer-events-none transition-all"
                style={{ backgroundColor: rail.color }}
              />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: rail.color, boxShadow: `0 0 10px ${rail.color}66` }}
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-100 font-sans block">{rail.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{rail.role}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-white" style={{ color: rail.color }}>
                    {rail.share}
                  </span>
                  <span className="text-[11px] text-slate-400 block font-normal">{rail.amount} Net Spend</span>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
            <span>Source: 444,118 Net Transactions</span>
            <span className="text-emerald-400 font-semibold">[VERIFIED OBSERVED]</span>
          </div>
        </div>
      </div>
    </section>
  );
};
