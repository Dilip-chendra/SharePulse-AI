import React, { useRef, useEffect } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { ParticleCanvas } from './ParticleCanvas';
import gsap from 'gsap';

export const HeroScene: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(taglineRef.current, { opacity: 0, y: 12, duration: 0.6 }, 0.1)
      .from(headlineRef.current, { opacity: 0, y: 28, duration: 0.8 }, 0.25)
      .from(subRef.current, { opacity: 0, y: 18, duration: 0.7 }, 0.5)
      .from(metricsRef.current, { opacity: 0, y: 16, duration: 0.6 }, 0.7)
      .from(ctaRef.current, { opacity: 0, y: 12, duration: 0.5 }, 0.9);
  }, []);

  return (
    <section
      id="scene-hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#07090E]"
    >
      {/* Particle canvas */}
      <div className="absolute inset-0">
        <ParticleCanvas />
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20">
        {/* Tagline chip */}
        <div ref={taglineRef} className="inline-flex items-center gap-2 mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/50 text-xs font-mono tracking-wider text-cyan-300 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Share of Wallet Intelligence · Powered by Deterministic Analytics
          </span>
        </div>

        {/* Main headline */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-white"
        >
          Your customers are{' '}
          <span className="text-gradient-brand">spending elsewhere.</span>
          <br />
          <span className="text-slate-300 font-light">We know exactly where.</span>
        </h1>

        {/* Sub-headline */}
        <p
          ref={subRef}
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          SharePulse AI discovers where co-brand card spend is migrating, explains why Share of Wallet is contracting, and turns those signals into measurable recovery actions — all from your existing transaction data.
        </p>

        {/* Key metrics strip */}
        <div ref={metricsRef} className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-10">
          {[
            { value: '−9.43 pp', label: 'SoW Contraction', color: 'text-rose-400', tag: 'OBSERVED' },
            { value: '₹5.52M', label: 'Cashback Leaking', color: 'text-amber-400', tag: 'OBSERVED' },
            { value: '10,098', label: 'Silent Defectors', color: 'text-orange-400', tag: 'OBSERVED' },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <div className={`text-2xl sm:text-3xl font-black metric-counter ${m.color}`}>{m.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{m.label}</div>
              <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider mt-0.5">{m.tag}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300">
                Open the Platform
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Go to Dashboard
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </SignedIn>

          <button
            onClick={() => {
              document.querySelector('#scene-crisis')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/60 font-medium text-sm sm:text-base transition-all duration-200"
          >
            See the Evidence
            <svg className="w-4 h-4 animate-bounce" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500">Scroll to explore</span>
        <svg className="w-4 h-4 text-slate-500 animate-bounce" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
};
