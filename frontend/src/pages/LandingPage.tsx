/**
 * SharePulse-AI — Premium Landing Page
 * Complete rewrite: clean sections, no overlapping, proper typography
 */

import React, { useState, useEffect, useRef } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatCardProps {
  value: string;
  label: string;
  sub?: string;
  accent?: string;
  tag?: string;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
}

// ─── useInView Hook ──────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard: React.FC<StatCardProps> = ({ value, label, sub, accent = 'text-indigo-400', tag }) => (
  <div className="bg-[#0D1117] border border-[#1C2333] rounded-2xl p-6 flex flex-col gap-2 hover:border-indigo-500/30 transition-colors duration-300">
    <div className={`text-3xl lg:text-4xl font-black tracking-tight ${accent}`}>{value}</div>
    <div className="text-sm font-semibold text-white">{label}</div>
    {sub && <div className="text-xs text-slate-500 leading-relaxed">{sub}</div>}
    {tag && (
      <span className="mt-1 self-start text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-slate-700 text-slate-500">
        {tag}
      </span>
    )}
  </div>
);

// ─── Feature Card ────────────────────────────────────────────────────────────
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc, delay = 0 }) => {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className="bg-[#0D1117] border border-[#1C2333] rounded-2xl p-6 flex flex-col gap-3 hover:border-indigo-500/30 transition-all duration-500 group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s ease`,
      }}
    >
      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors duration-300">
        {icon}
      </div>
      <div className="text-base font-semibold text-white">{title}</div>
      <div className="text-sm text-slate-400 leading-relaxed">{desc}</div>
    </div>
  );
};

// ─── SoW Arc SVG ─────────────────────────────────────────────────────────────
const SoWArc: React.FC<{ percent: number; color: string; label: string; year: string }> = ({ percent, color, label, year }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1C2333" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          strokeDashoffset={circ * 0.25}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        <text x="70" y="65" textAnchor="middle" fill="white" fontSize="20" fontWeight="800" fontFamily="sans-serif">{percent}%</text>
        <text x="70" y="85" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="monospace">{year}</text>
      </svg>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
    </div>
  );
};

// ─── Rail Bar ────────────────────────────────────────────────────────────────
const RailBar: React.FC<{ label: string; pct: number; color: string; active: boolean; delay: number }> = ({ label, pct, color, active, delay }) => (
  <div className="flex items-center gap-4">
    <div className="w-28 text-right text-xs font-mono text-slate-400 shrink-0">{label}</div>
    <div className="flex-1 h-2.5 bg-[#1C2333] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: active ? `${pct}%` : '0%',
          background: color,
          transition: `width 0.9s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
        }}
      />
    </div>
    <div className="w-12 text-xs font-mono font-bold text-white shrink-0">{pct}%</div>
  </div>
);

// ─── Process Step ────────────────────────────────────────────────────────────
const ProcessStep: React.FC<{ n: string; title: string; desc: string; inView: boolean; delay: number }> = ({ n, title, desc, inView, delay }) => (
  <div
    className="flex gap-5"
    style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-20px)',
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    }}
  >
    <div className="flex flex-col items-center gap-0 shrink-0">
      <div className="w-9 h-9 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono text-xs font-bold">
        {n}
      </div>
      <div className="w-px flex-1 bg-gradient-to-b from-indigo-500/20 to-transparent mt-2" />
    </div>
    <div className="pb-8">
      <div className="text-sm font-bold text-white mb-1">{title}</div>
      <div className="text-sm text-slate-400 leading-relaxed">{desc}</div>
    </div>
  </div>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────
export const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  // Scroll state
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Hero entrance
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Stats section
  const statsRef = useRef<HTMLDivElement>(null);

  // SoW section
  const sowRef = useRef<HTMLDivElement>(null);
  const [sowInView, setSowInView] = useState(false);
  useEffect(() => {
    const el = sowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSowInView(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Rail section
  const railRef = useRef<HTMLDivElement>(null);
  const [railInView, setRailInView] = useState(false);
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRailInView(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Process section
  const processRef = useRef<HTMLDivElement>(null);
  const [processInView, setProcessInView] = useState(false);
  useEffect(() => {
    const el = processRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setProcessInView(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Why HSIC', id: 'why' },
    { label: 'Intelligence', id: 'intelligence' },
    { label: 'How It Works', id: 'how' },
    { label: 'Evidence', id: 'evidence' },
  ];

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100">
      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#080B12]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <polyline points="2,12 5,8 8,10 11,5 14,7 16,4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <span className="text-base font-bold text-white tracking-tight">SharePulse<span className="text-indigo-400">-AI</span></span>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollToSection(l.id)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all duration-200"
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.05]">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={() => window.location.reload()}
                  className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.05]"
                >
                  Dashboard
                </button>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-px">
                    Open Platform
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:-translate-y-px"
                >
                  Open Platform
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </SignedIn>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/[0.06] py-3 bg-[#080B12]/98">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollToSection(l.id)}
                  className="block w-full text-left px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center overflow-hidden pt-16">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[80px]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Content */}
        <div
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Synchrony Analytics Hackathon 2026
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.0] text-white">
            Where did your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              customer's spend
            </span>
            <br />go?
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed font-normal">
            SharePulse-AI pinpoints <strong className="text-slate-200">exactly where co-brand card spend is migrating</strong>,
            explains why share of wallet is falling, and turns those signals into measurable recovery actions.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2.5 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base rounded-2xl transition-all duration-200 shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 cursor-pointer">
                  Enter the Platform
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2.5 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base rounded-2xl transition-all duration-200 shadow-2xl shadow-indigo-500/25 hover:-translate-y-0.5"
              >
                Go to Dashboard
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </SignedIn>

            <button
              onClick={() => scrollToSection('why')}
              className="flex items-center gap-2 px-6 py-3.5 text-base text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-2xl transition-all duration-200 bg-white/[0.03] hover:bg-white/[0.06]"
            >
              See the Evidence
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs text-slate-500 font-mono">
            <span>444,118 Transactions Analyzed</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>45,000 Active Cardholders</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>Zero-Assumption Evidence</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-slate-600 to-transparent" />
        </div>
      </section>

      {/* ── WHY SECTION ─────────────────────────────────────────────────────── */}
      <section id="why" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-indigo-500" />
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">The Crisis</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] mb-6">
                HSIC share of wallet<br />
                <span className="text-rose-400">collapsed 9.43 pp</span><br />
                in 12 months.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8 text-base">
                From FY25 to FY26, HSIC's share of total MetroMart customer spend fell from
                <strong className="text-white"> 28.91%</strong> to <strong className="text-white">19.48%</strong>.
                Customers didn't stop spending — they moved their wallet to competing payment rails
                while HSIC sat uninformed.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { c: 'bg-rose-500', l: '₹16.75M net HSIC revenue lost in FY26' },
                  { c: 'bg-amber-500', l: '35.68% of spend captured by MetroMart Wallet' },
                  { c: 'bg-orange-500', l: '10,098 silent defectors — ΔSoW ≤ −15pp' },
                ].map((item) => (
                  <div key={item.l} className="flex items-start gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.c} mt-1.5 shrink-0`} />
                    <span className="text-sm text-slate-300">{item.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SoW Visual */}
            <div ref={sowRef} className="flex flex-col gap-8">
              <div className="bg-[#0D1117] border border-[#1C2333] rounded-3xl p-8">
                <div className="flex items-center justify-center gap-16 mb-8">
                  {sowInView && (
                    <>
                      <SoWArc percent={28.91} color="#6366f1" label="FY25 Baseline" year="FY25" />
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-2xl font-black text-rose-400">−9.43</div>
                        <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">pp decline</div>
                        <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
                          <path d="M2 4 L20 14 L38 4" stroke="#f87171" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <SoWArc percent={19.48} color="#f87171" label="FY26 Actual" year="FY26" />
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-[#1C2333] pt-6">
                  <div>
                    <div className="text-xs text-slate-500 font-mono mb-1">FY25 HSIC GMV</div>
                    <div className="text-lg font-black text-indigo-400">₹85.67M</div>
                    <div className="text-xs text-slate-500">of ₹296.34M total</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono mb-1">FY26 HSIC GMV</div>
                    <div className="text-lg font-black text-rose-400">₹68.92M</div>
                    <div className="text-xs text-slate-500">of ₹353.80M total</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">[OBSERVED] · 444,118 Transactions · Zero Assumption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────────── */}
      <div ref={statsRef} className="border-y border-[#1C2333] bg-[#0A0D14] py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard value="−9.43 pp" label="SoW Contraction" sub="FY25 → FY26 decline" accent="text-rose-400" tag="OBSERVED" />
          <StatCard value="₹5.52M" label="Unclaimed Cashback" sub="19,423 Prime cardholders" accent="text-amber-400" tag="OBSERVED" />
          <StatCard value="10,098" label="Silent Defectors" sub="ΔSoW ≤ −15 percentage points" accent="text-orange-400" tag="MODEL_DERIVED" />
          <StatCard value="₹51.25M" label="Modeled Recapture" sub="Top 4 NBA strategies" accent="text-emerald-400" tag="MODEL_DERIVED" />
        </div>
      </div>

      {/* ── INTELLIGENCE SECTION ─────────────────────────────────────────────── */}
      <section id="intelligence" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-indigo-500" />
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Wallet Intelligence</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Rail migration */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-[1.1] mb-3">
                Where the spend went.
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-10">
                Every rupee that left HSIC has a destination. We track all five competing payment rails with transaction-level precision.
              </p>

              <div ref={railRef} className="flex flex-col gap-4">
                {[
                  { label: 'MetroMart Wallet', pct: 35.68, color: 'linear-gradient(90deg,#8b5cf6,#6366f1)', delay: 0 },
                  { label: 'Cash / UPI', pct: 23.40, color: 'linear-gradient(90deg,#06b6d4,#0ea5e9)', delay: 100 },
                  { label: 'HSIC Credit', pct: 19.48, color: 'linear-gradient(90deg,#22c55e,#10b981)', delay: 200 },
                  { label: 'Other Bank CC', pct: 10.79, color: 'linear-gradient(90deg,#f59e0b,#f97316)', delay: 300 },
                  { label: 'Debit Card', pct: 10.66, color: 'linear-gradient(90deg,#64748b,#475569)', delay: 400 },
                ].map((r) => (
                  <RailBar key={r.label} label={r.label} pct={r.pct} color={r.color} active={railInView} delay={r.delay} />
                ))}
              </div>
              <div className="mt-6 text-xs font-mono text-slate-600 uppercase tracking-widest">[OBSERVED] · Share of Total MetroMart Retail Volume</div>
            </div>

            {/* Big-ticket & Prime */}
            <div className="flex flex-col gap-6">
              {/* Big ticket */}
              <div className="bg-[#0D1117] border border-[#1C2333] rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-mono text-rose-400 uppercase tracking-widest mb-1">Big-Ticket Inversion</div>
                    <div className="text-xl font-black text-white">HSIC wins small, loses big.</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-rose-400">11.20%</div>
                    <div className="text-xs text-slate-500">SoW on &gt;₹5,000</div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: '₹1,000 — Grocery', hsic: 28.4, w: '28%' },
                    { label: '₹3,000 — Fashion', hsic: 21.8, w: '22%' },
                    { label: '₹5,000+ — Electronics', hsic: 11.2, w: '11%', highlight: true },
                    { label: '₹10,000+ — Durables', hsic: 8.4, w: '8%' },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-3 text-xs font-mono">
                      <span className={`w-36 shrink-0 ${t.highlight ? 'text-rose-300 font-bold' : 'text-slate-400'}`}>{t.label}</span>
                      <div className="flex-1 h-2 bg-[#1C2333] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${t.highlight ? 'bg-rose-500' : 'bg-indigo-500/60'}`}
                          style={{ width: t.w }}
                        />
                      </div>
                      <span className={`w-10 text-right ${t.highlight ? 'text-rose-300 font-bold' : 'text-slate-400'}`}>{t.hsic}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  14,850 high-ticket shoppers · 88.8% of &gt;₹5k GMV goes to competitors
                </div>
              </div>

              {/* Prime paradox */}
              <div className="bg-[#0D1117] border border-[#1C2333] rounded-2xl p-6">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">Prime Reward Paradox</div>
                <div className="text-xl font-black text-white mb-3">Value exists. It's not being captured.</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-black text-amber-400">₹5.52M</div>
                    <div className="text-xs text-slate-500 mt-1">Unredeemed Prime cashback pool</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-orange-400">19,423</div>
                    <div className="text-xs text-slate-500 mt-1">Prime cardholders with unclaimed rewards</div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  5% Grocery · 3% Electronics · 1% all other — rewards exist but aren't activating spend behavior
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section id="how" className="py-24 px-4 sm:px-6 bg-[#0A0D14] border-y border-[#1C2333]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-indigo-500" />
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">The Engine</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                DATA → DIAGNOSE → DECIDE → EXPERIMENT → MEASURE → LEARN
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                SharePulse-AI is not a dashboard. It's a complete institutional decision loop — from raw transaction signals to causal experimentation and closed-loop learning.
              </p>
            </div>

            <div ref={processRef} className="flex flex-col">
              {[
                { n: '01', title: 'Wallet Intelligence', desc: 'Transaction-level SoW, rail migration, cohort decay, and big-ticket gap detection across 444K transactions.' },
                { n: '02', title: 'Customer Signals', desc: '360° cardholder profiles with explicit "Why at risk?" drivers and "Why now?" 30–45 day trigger windows.' },
                { n: '03', title: 'Opportunity Ranking', desc: '₹51.25M pipeline ranked by net recapture value across 4 proven NBA strategies.' },
                { n: '04', title: 'Decision Economics', desc: 'Every action is gated by a WAIT/ACT decision with unit economics, hurdle ROI, and margin protection.' },
                { n: '05', title: 'Causal Experimentation', desc: 'Full RCT design with treatment/control splits, 95% CI, p-values, and SCALE/ITERATE/STOP/WAIT verdicts.' },
                { n: '06', title: 'Learning Loop', desc: 'Closed-loop: Decide → Act → Observe → Measure → Learn → Improve → Decide again.' },
              ].map((s, i) => (
                <ProcessStep key={s.n} n={s.n} title={s.title} desc={s.desc} inView={processInView} delay={i * 90} />
              ))}
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
            <FeatureCard
              delay={0}
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              title="Zero-Assumption Evidence"
              desc="Every claim maps directly to dataset columns and verifiable SQL logic. No AI hallucinations, no pre-assumed numbers."
            />
            <FeatureCard
              delay={80}
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 18 18"><polyline points="3,13 6,9 9,11 12,6 15,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              title="Causal Experimentation"
              desc="RCT designer with treatment/control targeting, lift estimation, 95% confidence intervals, and automatic rollout recommendations."
            />
            <FeatureCard
              delay={160}
              icon={<svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>}
              title="9 Enterprise Modules"
              desc="Executive overview, diagnostic studio, customer intelligence, opportunity center, NBA engine, experiment lab, evidence vault, and settings."
            />
          </div>
        </div>
      </section>

      {/* ── EVIDENCE SECTION ──────────────────────────────────────────────────── */}
      <section id="evidence" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-indigo-500" />
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Verified Evidence Pack</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-10 max-w-2xl">
            Every number is traceable to the source data.
          </h2>

          <div className="bg-[#0D1117] border border-[#1C2333] rounded-3xl overflow-hidden">
            <div className="border-b border-[#1C2333] px-6 py-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-mono text-slate-500">EvidenceCenter · Verified Claims Matrix</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1C2333] bg-[#080B12]">
                    <th className="text-left px-6 py-3 text-xs font-mono text-slate-500 uppercase tracking-wider">Metric</th>
                    <th className="text-left px-6 py-3 text-xs font-mono text-slate-500 uppercase tracking-wider">Verified Value</th>
                    <th className="text-left px-6 py-3 text-xs font-mono text-slate-500 uppercase tracking-wider">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2333]">
                  {[
                    { metric: 'FY25 HSIC Share of Wallet', value: '28.91% (₹85.67M / ₹296.34M)', tag: 'OBSERVED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { metric: 'FY26 HSIC Share of Wallet', value: '19.48% (₹68.92M / ₹353.80M)', tag: 'OBSERVED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { metric: 'SoW Contraction', value: '−9.43 percentage points', tag: 'OBSERVED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { metric: 'MetroMart Wallet Share', value: '35.68% of Total Retail Volume', tag: 'OBSERVED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { metric: 'Prime Cashback Unclaimed', value: '₹5,516,360.84 across 19,423 cardholders', tag: 'OBSERVED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { metric: 'Silent Defector Cohort', value: '10,098 cardholders (ΔSoW ≤ −15 pp)', tag: 'MODEL_DERIVED', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                    { metric: 'Big-Ticket SoW (>₹5k)', value: '11.20% vs 19.48% overall', tag: 'OBSERVED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { metric: 'Modeled Recapture Pipeline', value: '₹51.25M across 4 NBA strategies', tag: 'MODEL_DERIVED', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                    { metric: 'Return Rate (Settlement)', value: '4.8% net GMV (latency unobserved)', tag: 'HYPOTHESIS', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  ].map((row) => (
                    <tr key={row.metric} className="hover:bg-white/[0.015] transition-colors">
                      <td className="px-6 py-3.5 text-slate-300 font-medium">{row.metric}</td>
                      <td className="px-6 py-3.5 text-white font-mono text-xs">{row.value}</td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${row.color}`}>
                          {row.tag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-32 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-6">Built for Synchrony Analytics Hackathon 2026</div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Don't just measure lost share.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Recover it intelligently.</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl mx-auto">
            9 enterprise-grade modules. Ground truth data. Causal experimentation. One decision engine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2.5 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-2xl transition-all duration-200 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 cursor-pointer">
                  Open SharePulse-AI
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9h12M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2.5 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-2xl transition-all duration-200 shadow-2xl shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                Enter Dashboard
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9h12M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </SignedIn>
          </div>

          {/* Taxonomy reminder */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            {['OBSERVED', 'MODEL_DERIVED', 'HYPOTHESIS', 'EXPERIMENT DESIGN'].map((t, i) => {
              const colors = ['text-emerald-400 border-emerald-500/30 bg-emerald-500/5', 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5', 'text-amber-400 border-amber-500/30 bg-amber-500/5', 'text-purple-400 border-purple-500/30 bg-purple-500/5'];
              return (
                <span key={t} className={`px-3 py-1 rounded-full border ${colors[i]} uppercase tracking-widest`}>
                  {t}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1C2333] bg-[#080B12] py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <polyline points="2,12 5,8 8,10 11,5 14,7 16,4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-white">SharePulse-AI</span>
          </div>
          <div className="text-xs text-slate-600 font-mono text-center">
            © 2026 SharePulse AI · Synchrony Analytics Hackathon 2026 · Zero-assumption empirical evidence
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Deployed on Vercel · Backend on Render</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
