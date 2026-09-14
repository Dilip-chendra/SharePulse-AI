import React, { useRef, useEffect } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import gsap from 'gsap';
import { ArrowRight, FileCheck, ShieldCheck } from 'lucide-react';

export const GrandFinalScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-finale"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 sm:px-12 bg-[#05070B] overflow-hidden select-none"
    >
      {/* Soft Ambient Horizon Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px] bg-gradient-to-r from-blue-600/15 via-indigo-600/20 to-cyan-500/15 pointer-events-none" />

      <div ref={contentRef} className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center space-y-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-[#0B0F19]/90 text-xs font-mono tracking-widest text-slate-400 uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SYNCHRONY ANALYTICS HACKATHON 2026 AUDITED PLATFORM</span>
        </div>

        {/* Final Statement (Section 22) */}
        <div className="space-y-4 max-w-4xl">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white font-sans">
            Don't Just Measure Lost Share.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Recover It Intelligently.
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Every transaction audited. Every customer classified. Every intervention justified by unit margin.
          </p>
        </div>

        {/* The 6 Verified Ground Truth Pillar Metrics (Section 22) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full font-mono text-xs text-left">
          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-[#1A2234]">
            <span className="text-[10px] text-slate-500 uppercase block">SoW Collapse</span>
            <span className="text-lg font-bold text-rose-400">−9.43 pp</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">28.91% → 19.48%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-[#1A2234]">
            <span className="text-[10px] text-slate-500 uppercase block">Recapture Modeled</span>
            <span className="text-lg font-bold text-emerald-400">₹51.25M</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">4 Priority NBAs</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-[#1A2234]">
            <span className="text-[10px] text-slate-500 uppercase block">Prime Cardholders</span>
            <span className="text-lg font-bold text-amber-400">19,423</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">₹5.52M Unclaimed</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-[#1A2234]">
            <span className="text-[10px] text-slate-500 uppercase block">Big-Ticket Shoppers</span>
            <span className="text-lg font-bold text-blue-400">14,850</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">11.20% SoW on &gt;₹5k</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-[#1A2234]">
            <span className="text-[10px] text-slate-500 uppercase block">Silent Defectors</span>
            <span className="text-lg font-bold text-orange-400">10,098</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">ΔSoW ≤ −15 pp</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-[#1A2234]">
            <span className="text-[10px] text-slate-500 uppercase block">Total Dataset</span>
            <span className="text-lg font-bold text-slate-200">444,118</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Transactions Net</span>
          </div>
        </div>

        {/* CTAs (Section 22) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-200 transition-all duration-300 shadow-xl shadow-white/5 hover:scale-[1.02] cursor-pointer">
                <span>EXPLORE SHAREPULSE-AI</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-200 transition-all duration-300 shadow-xl shadow-white/5 hover:scale-[1.02] cursor-pointer"
            >
              <span>ENTER EXECUTIVE DASHBOARD</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </SignedIn>

          <button
            onClick={() => {
              const el = document.querySelector('#scene-hero');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-semibold text-sm transition-all duration-300 backdrop-blur-md cursor-pointer font-mono"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>REVIEW NARRATIVE ↑</span>
          </button>
        </div>
      </div>
    </section>
  );
};
