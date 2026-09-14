import React, { useRef, useEffect } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import gsap from 'gsap';
import { ArrowDown, ArrowRight } from 'lucide-react';

export const HeroScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(gridRef.current, { opacity: 0, scale: 1.05 }, { opacity: 0.35, scale: 1, duration: 1.2 }, 0)
        .fromTo(pulseRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.4 }, 0.2)
        .fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0 }, 0.4)
        .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.7)
        .fromTo(ctaRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, 0.9);

      // Camera push on scroll
      gsap.to([headlineRef.current, subRef.current, ctaRef.current], {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
        y: -40,
        opacity: 0.2,
        scale: 0.98,
        ease: 'none',
      });

      gsap.to(gridRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        scale: 1.15,
        opacity: 0.5,
        ease: 'none',
      });
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
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 sm:px-12 bg-transparent overflow-hidden select-none"
    >
      {/* Background Architectural Grid & Subtle Horizon */}
      <div 
        ref={gridRef}
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%)'
        }}
      />

      {/* Central Soft Light Horizon & Network Horizon */}
      <div 
        ref={pulseRef}
        className="absolute w-[600px] h-[350px] rounded-full pointer-events-none blur-[140px] opacity-40 bg-gradient-to-tr from-indigo-600/30 via-cyan-500/20 to-transparent"
        style={{ top: '45%', transform: 'translateY(-50%)' }}
      />

      {/* Content Container — Minimal, Expensive, Editorial */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Subtle System Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-[#0B0F19]/80 backdrop-blur-md mb-8 text-[11px] font-mono tracking-widest text-slate-400 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Synchrony Analytics Hackathon 2026 · Ground Truth Engine</span>
        </div>

        {/* Large Restrained Headline (Section 7) */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.04] text-white max-w-4xl mb-6 font-sans"
        >
          SEE WHERE YOUR CUSTOMERS ARE SPENDING.
        </h1>

        {/* Supporting Copy (Section 7) */}
        <p
          ref={subRef}
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
        >
          SharePulse-AI turns transaction data into wallet intelligence, customer signals, and measurable recovery actions.
        </p>

        {/* Primary CTA (Section 7) */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleScrollDown}
            className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-200 transition-all duration-300 shadow-xl shadow-white/5 hover:scale-[1.02] cursor-pointer"
          >
            <span>EXPLORE THE INTELLIGENCE</span>
            <ArrowDown className="w-4 h-4 text-slate-900" />
          </button>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-semibold text-sm transition-all duration-300 backdrop-blur-md cursor-pointer">
                <span>ENTER PLATFORM</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-semibold text-sm transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <span>GO TO DASHBOARD</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </SignedIn>
        </div>
      </div>

      {/* Floating Bottom Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-80 transition-opacity">
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">SCROLL TO DISCOVER</span>
        <div className="w-4 h-7 rounded-full border border-slate-700 flex items-start justify-center p-1">
          <div className="w-1 h-1.5 rounded-full bg-slate-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
