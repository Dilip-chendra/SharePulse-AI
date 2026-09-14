import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const PrimeParadoxScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rewardRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

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

      // Card elevation and reward pool separation (Section 13)
      tl.fromTo(cardRef.current, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.3 }, 0)
        .fromTo(rewardRef.current, { opacity: 0, scale: 0.8, x: -20 }, { opacity: 1, scale: 1, x: 0, duration: 0.4 }, 0.25)
        .fromTo(counterRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35 }, 0.5);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-prime"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] px-6 select-none"
    >
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Editorial Narrative */}
        <div className="md:w-5/12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>SCENE 06 · THE PRIME REWARD PARADOX</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
            Value Exists.
            <span className="block text-amber-400 mt-1">Yet It Isn't Being Captured.</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Prime members earn 5% on Grocery and 3% on Electronics. Yet millions of rupees in accrued cashback remain dormant and unredeemed on statements, creating zero top-of-wallet retention.
          </p>

          <div className="pt-2 font-mono">
            <span className="text-[10px] text-slate-500 uppercase block tracking-wider font-semibold">Unclaimed Cashback Pool</span>
            <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight mt-1">
              ₹5,516,360.84
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Across <strong className="text-slate-200">19,423 Prime cardholders</strong> (Avg ₹284 unredeemed)
            </div>
          </div>
        </div>

        {/* Right Side: Abstract Financial Representation of Unclaimed Value */}
        <div className="md:w-7/12 w-full flex flex-col items-center justify-center relative">
          <div 
            ref={cardRef}
            className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0E17] border border-amber-500/30 shadow-2xl relative overflow-hidden"
          >
            {/* Holographic metallic sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-indigo-500/10 pointer-events-none" />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
                  Prime Co-Brand Credit Card
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">[OBSERVED]</span>
            </div>

            {/* Separated Value Bubble (Section 13) */}
            <div
              ref={rewardRef}
              className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2 mb-4 backdrop-blur-md"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-200 font-bold">Unclaimed Accrued Cashback</span>
                <span className="text-amber-400 font-semibold">FORFEITED ATTRITION RISK</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ₹5.52 Million
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Cardholders who never redeem rewards show a <strong>3.2x higher rate of wallet defection</strong> within 90 days.
              </p>
            </div>

            <div ref={counterRef} className="grid grid-cols-2 gap-3 font-mono text-xs pt-2">
              <div className="p-2.5 rounded-lg bg-[#080B11] border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Eligible Audience</span>
                <span className="text-slate-200 font-bold">19,423 Members</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080B11] border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Intervention Playbook</span>
                <span className="text-emerald-400 font-bold">NBA 01 Alert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
