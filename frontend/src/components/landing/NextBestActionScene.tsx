import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const ACTIONS = [
  {
    code: 'NBA 01',
    title: 'Prime Statement Transparency Alert',
    audience: '19,423 Prime Members',
    opportunity: '₹12.85M Modeled',
    roi: '4.8x ROI',
    mechanic: 'Push & SMS notification disclosing unredeemed balance before statement close',
    color: '#F59E0B'
  },
  {
    code: 'NBA 02',
    title: '0% POS Financing on Durables >₹5k',
    audience: '14,850 Big-Ticket Shoppers',
    opportunity: '₹26.2M Modeled',
    roi: '3.4x ROI',
    mechanic: '3-month zero-cost EMI subvention split between merchant and co-brand issuer',
    color: '#3B82F6'
  },
  {
    code: 'NBA 03',
    title: 'Silent Defector Velocity Interception',
    audience: '10,098 At-Risk Shoppers',
    opportunity: '₹8.2M Modeled',
    roi: '2.9x ROI',
    mechanic: 'Accelerated 5% grocery rebate triggered on day 30–45 of spend velocity collapse',
    color: '#F97316'
  },
  {
    code: 'NBA 04',
    title: 'One-Hit Wonder Second-Swipe Ladder',
    audience: '4,000 Inactive Cardholders',
    opportunity: '₹4.0M Modeled',
    roi: '2.2x ROI',
    mechanic: 'Milestone ₹250 voucher evaluated against 48% organic natural recovery baseline',
    color: '#A855F7'
  }
];

export const NextBestActionScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const actionsListRef = useRef<HTMLDivElement>(null);

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

      // Progressive reveal of the 4 actions (Section 17)
      if (actionsListRef.current) {
        tl.fromTo(
          actionsListRef.current.children,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.15, ease: 'power2.out' },
          0
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-actions"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Editorial Narrative */}
        <div className="md:w-5/12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>SCENE 10 · PRESCRIPTIVE DECISION LAYER</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
            Prescribing Targeted
            <span className="block text-purple-400 mt-1">High-ROI Interventions.</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Data and diagnostic dashboards inform. But the executive engine must prescribe specific, costed interventions tailored to the root cause.
          </p>

          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234] font-mono text-xs text-slate-400 space-y-1">
            <div className="text-slate-200 font-bold">Empirical Governance Rule:</div>
            <div>All figures represent <span className="text-purple-400 font-bold">[MODELED OPPORTUNITY]</span>.</div>
            <div className="text-slate-500 text-[10px]">Subject to randomized controlled trial (RCT) validation.</div>
          </div>
        </div>

        {/* Right Side: Progressive 4 Action Cards (Section 17) */}
        <div ref={actionsListRef} className="md:w-7/12 w-full space-y-3 font-mono">
          {ACTIONS.map((act) => (
            <div
              key={act.code}
              className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234] hover:border-slate-700 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                    {act.code}
                  </span>
                  <span className="text-xs font-bold text-white font-sans">{act.title}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">{act.opportunity}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{act.audience}</span>
                <span className="text-blue-400 font-semibold">{act.roi}</span>
              </div>

              <div className="text-[10px] text-slate-500 font-sans pt-0.5">
                {act.mechanic}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
