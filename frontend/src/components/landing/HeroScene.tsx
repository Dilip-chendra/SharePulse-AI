import React, { useRef, useEffect } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import gsap from 'gsap';

export const HeroScene: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(taglineRef.current, { opacity: 0, y: 12, duration: 0.6 }, 0.1)
      .from(headlineRef.current, { opacity: 0, y: 24, duration: 0.8 }, 0.25)
      .from(subRef.current, { opacity: 0, y: 16, duration: 0.7 }, 0.5)
      .from(metricsRef.current, { opacity: 0, y: 16, duration: 0.6 }, 0.7)
      .from(ctaRef.current, { opacity: 0, y: 12, duration: 0.5 }, 0.85)
      .from(scrollPromptRef.current, { opacity: 0, y: 8, duration: 0.5 }, 1.0);
  }, []);

  const handleScrollDown = () => {
    document.querySelector('#scene-crisis')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="scene-hero"
      className="relative min-h-screen flex flex-col items-center justify-center py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden"
    >
      {/* Ambient center hero glow */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-60" />

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-5xl mx-auto w-full flex flex-col items-center">
        {/* Tagline chip */}
        <div ref={taglineRef} className="inline-flex items-center gap-2 mb-5 sm:mb-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/50 text-xs font-mono tracking-wider text-cyan-300 uppercase shadow-sm shadow-indigo-950">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Share of Wallet Intelligence · Powered by Deterministic Analytics
          </span>
        </div>

        {/* Main headline */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-5 text-white max-w-4xl"
        >
          Your customers are{' '}
          <span className="text-gradient-brand">spending elsewhere.</span>
          <br />
          <span className="text-slate-300 font-light">We know exactly where.</span>
        </h1>

        {/* Sub-headline */}
        <p
          ref={subRef}
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
        >
          SharePulse AI discovers where co-brand card spend is migrating, explains why Share of Wallet is contracting, and turns those signals into measurable recovery actions.
        </p>

        {/* Key metrics strip */}
        <div ref={metricsRef} className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-8 sm:mb-10">
          {[
            { value: '−9.43 pp', label: 'SoW Contraction', color: 'text-rose-400', tag: 'OBSERVED' },
            { value: '₹5.52M', label: 'Cashback Leaking', color: 'text-amber-400', tag: 'OBSERVED' },
            { value: '10,098', label: 'Silent Defectors', color: 'text-orange-400', tag: 'OBSERVED' },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <div className={`text-2xl sm:text-3xl font-black metric-counter ${m.color}`}>{m.value}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">{m.label}</div>
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-0.5 font-semibold">[{m.tag}]</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300">
                <span>Open the Platform</span>
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
              <span>Go to Dashboard</span>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </SignedIn>

          <button
            onClick={handleScrollDown}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-slate-700/80 bg-slate-900/60 backdrop-blur-md text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/80 font-medium text-sm sm:text-base transition-all duration-200"
          >
            <span>See the Evidence</span>
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Scroll Indicator — in normal document flow with guaranteed spacing, NEVER overlapping */}
        <button
          ref={scrollPromptRef}
          onClick={handleScrollDown}
          className="mt-8 sm:mt-12 inline-flex flex-col items-center gap-1.5 cursor-pointer group opacity-60 hover:opacity-100 transition-all duration-300 focus:outline-none"
          aria-label="Scroll to explore"
        >
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-slate-400 group-hover:text-cyan-300 transition-colors">
            Scroll to explore
          </span>
          <svg
            className="w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition-transform animate-bounce"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 3v10M4 9l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};
