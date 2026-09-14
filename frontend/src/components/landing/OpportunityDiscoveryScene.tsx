import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const OPPORTUNITIES = [
  { rank: '#1', name: 'Big-Ticket POS Subvention', value: '₹26.2M', audience: '14,850 Shoppers', roi: '3.4x', color: '#3B82F6' },
  { rank: '#2', name: 'Prime Statement Transparency', value: '₹12.85M', audience: '19,423 Members', roi: '4.8x', color: '#F59E0B' },
  { rank: '#3', name: 'Silent Defector Interception', value: '₹8.2M', audience: '10,098 Shoppers', roi: '2.9x', color: '#F97316' },
  { rank: '#4', name: 'Second-Swipe Ladder', value: '₹4.0M', audience: '4,000 Inactive', roi: '2.2x', color: '#A855F7' },
];

export const OpportunityDiscoveryScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);

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

      // Field reorganization and ranking emergence (Section 16)
      if (cardsRef.current) {
        tl.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 30, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
          0
        );
      }

      tl.fromTo(totalRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 }, 0.5);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-opportunity"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Editorial Narrative */}
        <div className="md:w-5/12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>SCENE 09 · OPPORTUNITY DISCOVERY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
            THE SYSTEM IDENTIFIES & RANKS THE OPPORTUNITY.
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Rather than spreading uniform discounts across all 45,000 cardholders, SharePulse-AI isolates four concentrated spend pools with high behavioral feasibility.
          </p>

          {/* Master Sizing Callout (Section 16) */}
          <div ref={totalRef} className="pt-2 font-mono">
            <span className="text-[10px] text-slate-500 uppercase block tracking-wider font-semibold">
              Combined Modeled Recapturable Spend
            </span>
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight mt-1">
              ₹51.25M
            </div>
            <span className="text-xs text-slate-400 block mt-1">
              Ranked across 44,371 addressable customer accounts [MODELED]
            </span>
          </div>
        </div>

        {/* Right Side: Reorganized Ranked Nodes */}
        <div ref={cardsRef} className="md:w-7/12 w-full space-y-3 font-mono">
          {OPPORTUNITIES.map((opp) => (
            <div
              key={opp.rank}
              className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234] hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-black text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                    {opp.rank}
                  </span>
                  <span className="text-sm font-bold text-white font-sans">{opp.name}</span>
                </div>
                <span className="text-lg font-black text-emerald-400">{opp.value}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Audience: {opp.audience}</span>
                <span className="text-blue-400 font-semibold">Modeled ROI: {opp.roi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
