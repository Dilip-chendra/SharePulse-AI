import React, { useRef, useEffect } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BrandLogo } from '../common/BrandLogo';

gsap.registerPlugin(ScrollTrigger);

const TERMINAL_LINES = [
  { delay: 0,    color: 'text-slate-600', text: '# SharePulse AI — Connect your data in 3 steps' },
  { delay: 300,  color: 'text-cyan-400',  text: '$ curl -X POST https://api.sharepulse.ai/v1/ingest \\' },
  { delay: 500,  color: 'text-slate-400', text: '     -H "Authorization: Bearer <your-api-key>" \\' },
  { delay: 700,  color: 'text-slate-400', text: '     -F "file=@transactions.csv"' },
  { delay: 1000, color: 'text-emerald-400', text: '✓ Ingested 444,218 transactions · Processing...' },
  { delay: 1400, color: 'text-indigo-400', text: '✓ SoW model computed · Defectors flagged · Alerts live' },
  { delay: 1800, color: 'text-white',     text: '→ Dashboard ready at https://share-pulse-ai.vercel.app' },
];

export const CTAScene: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [linesVisible, setLinesVisible] = React.useState<boolean[]>(Array(TERMINAL_LINES.length).fill(false));

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        opacity: 0, y: 40, duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: contentRef.current, start: 'top 80%' },
      });

      ScrollTrigger.create({
        trigger: terminalRef.current,
        start: 'top 85%',
        onEnter: () => {
          TERMINAL_LINES.forEach((line, idx) => {
            if (prefersReduced) {
              setLinesVisible((prev) => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            } else {
              setTimeout(() => {
                setLinesVisible((prev) => {
                  const next = [...prev];
                  next[idx] = true;
                  return next;
                });
              }, line.delay);
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-cta"
      className="relative min-h-screen flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-950/20 rounded-full blur-[150px] pointer-events-none" />


      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BrandLogo size="lg" animate tagline="Financial Intelligence Platform" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
          Your Intelligence Platform{' '}
          <span className="text-gradient-brand">Awaits</span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10">
          Connect your transaction data. Discover where spend is going. Deploy recovery actions. All from a single platform — no data science team required.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-base shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300">
                Open the Platform — It's Free
                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-base shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Go to Your Dashboard
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </SignedIn>
        </div>

        {/* Terminal */}
        <div
          ref={terminalRef}
          className="relative scanlines rounded-2xl border border-slate-800/60 bg-slate-900/80 overflow-hidden text-left shadow-2xl"
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/60 bg-slate-900">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="ml-3 text-xs font-mono text-slate-500">sharepulse-ai — bash</div>
          </div>

          {/* Terminal body */}
          <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm space-y-1 min-h-[200px]">
            {TERMINAL_LINES.map((line, idx) => (
              <div
                key={idx}
                className={`transition-opacity duration-300 ${linesVisible[idx] ? 'opacity-100' : 'opacity-0'} ${line.color}`}
              >
                {line.text}
              </div>
            ))}
            {/* Blinking cursor */}
            <div className="flex items-center gap-1 mt-2">
              <span className="text-slate-600">$</span>
              <span className="w-2 h-4 bg-indigo-400 opacity-75 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <div className="text-xs text-slate-600 font-mono">
            Deployed on Vercel · Backend on Railway · Auth by Clerk
          </div>
          <div className="text-xs text-slate-700 font-mono">
            All analytics are computed from your own transaction data · Zero-assumption methodology
          </div>
        </div>
      </div>
    </section>
  );
};
