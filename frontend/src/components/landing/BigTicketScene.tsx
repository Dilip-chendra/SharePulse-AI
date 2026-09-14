import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export const BigTicketScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const [activeTier, setActiveTier] = useState<string>('5k');

  const TIERS = [
    { id: '1k', label: '₹1,000', sub: 'Grocery & Essentials', hsicSoW: '28.4%', altSoW: '71.6%', width: '70%' },
    { id: '3k', label: '₹3,000', sub: 'Fashion & Household', hsicSoW: '21.8%', altSoW: '78.2%', width: '54%' },
    { id: '5k', label: '₹5,000+', sub: 'Electronics & Appliances', hsicSoW: '11.20%', altSoW: '88.80%', width: '28%' },
    { id: '10k', label: '₹10,000+', sub: 'Major Durables & Laptops', hsicSoW: '8.4%', altSoW: '91.6%', width: '20%' },
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.7,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.25) setActiveTier('1k');
            else if (p < 0.5) setActiveTier('3k');
            else if (p < 0.75) setActiveTier('5k');
            else setActiveTier('10k');
          },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-bigticket"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Editorial Narrative & Evidence */}
        <div className="md:w-5/12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>SCENE 05 · THE BIG-TICKET INVERSION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
            The Larger the Basket,
            <span className="block text-blue-400 mt-1">The Smaller Our Share.</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            On routine groceries (&lt;₹1,000), HSIC retains healthy top-of-wallet habits. But on high-ticket electronics, appliances, and durables, <strong>88.8% of GMV migrates to competitor cards</strong>.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 font-mono">
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234]">
              <span className="text-[10px] text-slate-500 uppercase block">High-Ticket SoW (&gt;₹5k)</span>
              <span className="text-3xl font-black text-rose-400">11.20%</span>
              <span className="text-[10px] text-slate-500 block mt-1">Versus 19.48% Overall [OBSERVED]</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234]">
              <span className="text-[10px] text-slate-500 uppercase block">Big-Ticket Shoppers</span>
              <span className="text-3xl font-black text-emerald-400">14,850</span>
              <span className="text-[10px] text-slate-500 block mt-1">Prime Candidates for POS Financing</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Basket Size Axis & Thinning Stream (Section 12) */}
        <div className="md:w-7/12 w-full space-y-5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-800">
            <span>Transaction Ticket Size Axis</span>
            <span>HSIC Capture Rate</span>
          </div>

          <div ref={streamRef} className="space-y-3 font-mono">
            {TIERS.map((tier) => (
              <div
                key={tier.label}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  activeTier === tier.id
                    ? 'border-blue-500/80 bg-blue-950/20 shadow-lg shadow-blue-500/10 scale-[1.01]'
                    : 'bg-[#0B0F19] border-[#1A2234]'
                }`}
              >
                <div className="flex items-center justify-between mb-2 text-xs">
                  <div>
                    <span className="text-sm font-bold text-white font-sans mr-2">{tier.label}</span>
                    <span className="text-slate-500 text-[11px]">{tier.sub}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-blue-400 mr-2">{tier.hsicSoW} HSIC</span>
                    <span className="text-slate-500 text-[10px]">({tier.altSoW} Alt Rails)</span>
                  </div>
                </div>

                {/* Relative Thickness Bar representing HSIC share collapse */}
                <div className="h-3 w-full bg-slate-800/60 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: tier.hsicSoW }}
                  />
                  <div
                    className="h-full bg-amber-500/20 rounded-full flex-1"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-slate-300 font-mono flex items-center justify-between">
            <span>Critical Finding: ₹26.2M recoverable via 0% POS Financing</span>
            <span className="text-blue-400 font-bold">[VERIFIED CORRELATION]</span>
          </div>
        </div>
      </div>
    </section>
  );
};
