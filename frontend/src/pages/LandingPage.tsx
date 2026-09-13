/**
 * SharePulse AI — Cinematic Scroll-Driven Landing Page
 *
 * Architecture:
 * - Lenis for smooth scroll
 * - GSAP + ScrollTrigger for scroll-driven animations within each scene
 * - 9 standalone scroll scenes, each independently managing its own animations
 * - prefers-reduced-motion respected throughout
 * - Clerk auth preserved: SignedIn/SignedOut used in FloatingNav and CTA scenes
 */

import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { LoadingScreen } from '../components/landing/LoadingScreen';
import { FloatingNav } from '../components/landing/FloatingNav';
import { HeroScene } from '../components/landing/HeroScene';
import { CrisisScene } from '../components/landing/CrisisScene';
import { MigrationScene } from '../components/landing/MigrationScene';
import { DefectorScene } from '../components/landing/DefectorScene';
import { PrimeScene } from '../components/landing/PrimeScene';
import { BigTicketScene } from '../components/landing/BigTicketScene';
import { RecoveryScene } from '../components/landing/RecoveryScene';
import { PlatformScene } from '../components/landing/PlatformScene';
import { CTAScene } from '../components/landing/CTAScene';

// Register GSAP plugin once at module level
gsap.registerPlugin(ScrollTrigger);

// Scene boundary scroll positions (rough mid-points by order in the page)
const SCENE_COUNT = 9;

export const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeScene, setActiveScene] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);

  // ── Lenis smooth scroll setup ────────────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || loading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Sync with GSAP ticker
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [loading]);

  // ── Active scene tracker (for nav highlighting) ─────────────────────────
  useEffect(() => {
    if (loading) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? scrollY / docH : 0;
      const scene = Math.min(Math.floor(pct * SCENE_COUNT), SCENE_COUNT - 1);
      setActiveScene(scene);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading]);

  // ── Cleanup ScrollTrigger on unmount ────────────────────────────────────
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  return (
    <>
      {/* Loading screen — shows until onComplete fires */}
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {/* Main landing page — rendered immediately but hidden during loading */}
      <div
        className="landing-root"
        style={{
          visibility: loading ? 'hidden' : 'visible',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        {/* Floating navigation */}
        <FloatingNav activeScene={activeScene} />

        {/* Scene 1: Hero */}
        <HeroScene />

        {/* Scene 2: SoW Crisis */}
        <CrisisScene />

        {/* Scene 3: Payment Migration */}
        <MigrationScene />

        {/* Scene 4: Silent Defectors */}
        <DefectorScene />

        {/* Scene 5: Prime Cashback Leak */}
        <PrimeScene />

        {/* Scene 6: Big-Ticket Opportunity */}
        <BigTicketScene />

        {/* Scene 7: Modeled Recapture */}
        <RecoveryScene />

        {/* Scene 8: Platform Architecture */}
        <PlatformScene />

        {/* Scene 9: CTA */}
        <CTAScene />

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-slate-800/50 bg-[#04060A]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 font-mono text-center sm:text-left">
              © 2026 SharePulse AI · Built for Synchrony Analytics Hackathon 2026
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-700 font-mono">
              <span>All analytics: zero-assumption · verified against source data</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
