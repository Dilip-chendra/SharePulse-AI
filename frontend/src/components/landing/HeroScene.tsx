import React, { useRef, useEffect } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import gsap from 'gsap';
import { ArrowDown, ArrowRight, TrendingDown, Target, Users } from 'lucide-react';

export const HeroScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Gentle ambient pulse
      gsap.to(pulseRef.current, {
        scale: 1.1,
        opacity: 0.5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Subtle fade out ONLY when scrolling well past top
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: '40% top',
            end: 'bottom top',
            scrub: 0.8,
          },
          y: -40,
          opacity: 0.15,
          ease: 'none',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleScrollDown = () => {
    document.querySelector('#scene-universe')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      id="scene-hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center pt-28 sm:pt-36 pb-20 px-4 sm:px-8 bg-transparent overflow-hidden select-none"
    >
      {/* Background Architectural Grid & Subtle Horizon */}
      <div 
        ref={gridRef}
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%)'
        }}
      />

      {/* Central Soft Light Horizon Glow */}
      <div 
        ref={pulseRef}
        className="absolute w-[640px] h-[360px] rounded-full pointer-events-none blur-[140px] opacity-35 bg-gradient-to-tr from-indigo-600/30 via-cyan-500/20 to-transparent"
        style={{ top: '40%', transform: 'translateY(-50%)' }}
      />

      {/* Content Container — High-contrast, Guaranteed Visible, No Navbar Collision */}
      <div ref={contentRef} className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center w-full">
        {/* Subtle System Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md mb-6 text-[11px] font-mono tracking-wider text-indigo-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYNCHRONY ANALYTICS HACKATHON 2026 · VERIFIED EVIDENCE ENGINE</span>
        </div>

        {/* Master Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.06] max-w-5xl mb-6 font-sans">
          Where Did Customer Spend Go?
          <span className="block mt-2 bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            We Uncovered the Lost Share.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
          SharePulse-AI discovers where retail spend migrated, explains why share of wallet contracted −9.43 pp, and turns granular customer signals into ₹51.25M in verified recovery value.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <span>OPEN RECOVERY ENGINE</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>GO TO DASHBOARD</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </SignedIn>

          <button
            onClick={handleScrollDown}
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-[#0B0F19]/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-semibold text-sm transition-all duration-300 backdrop-blur-md cursor-pointer"
          >
            <span>EXPLORE DATA STORY</span>
            <ArrowDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* 3 Ground-Truth Verified Metric Cards (Grounded in Hackathon Ledger) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#1A2234] backdrop-blur-md text-left transition-all hover:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                <span>Share of Wallet</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">OBSERVED</span>
            </div>
            <div className="text-3xl font-black text-rose-400 font-mono mt-2">−9.43 pp</div>
            <div className="text-xs text-slate-400 mt-1">28.91% → 19.48% across FY25–FY26</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#1A2234] backdrop-blur-md text-left transition-all hover:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recapture Pipeline</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">MODELED</span>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-2">₹51.25M</div>
            <div className="text-xs text-slate-400 mt-1">Across 4 Prescriptive Next-Best-Actions</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#1A2234] backdrop-blur-md text-left transition-all hover:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Silent Defectors</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">OBSERVED</span>
            </div>
            <div className="text-3xl font-black text-amber-400 font-mono mt-2">10,098</div>
            <div className="text-xs text-slate-400 mt-1">Active store shoppers with ΔSoW ≤ −15 pp</div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Scroll Indicator */}
      <button
        onClick={handleScrollDown}
        className="mt-12 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group"
      >
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase group-hover:text-cyan-300 transition-colors">
          SCROLL TO DISCOVER
        </span>
        <div className="w-4 h-7 rounded-full border border-slate-700 flex items-start justify-center p-1 group-hover:border-cyan-500/50">
          <div className="w-1 h-1.5 rounded-full bg-slate-400 animate-bounce group-hover:bg-cyan-400" />
        </div>
      </button>
    </section>
  );
};
