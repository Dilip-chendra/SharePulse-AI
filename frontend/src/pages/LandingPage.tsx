/**
 * SharePulse AI — Cinematic Scroll-Driven Landing Page
 *
 * Architecture:
 * - Persistent global particle background across ALL scenes (reacts to mouse & scroll)
 * - Lenis for smooth scroll
 * - GSAP + ScrollTrigger for scene-level transitions
 * - 9 standalone scroll scenes with verified data and zero-assumption metrics
 * - Robust counter animations with closure state to prevent zero-value freeze
 */

import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { LoadingScreen } from '../components/landing/LoadingScreen';
import { FloatingNav } from '../components/landing/FloatingNav';
import { ParticleCanvas } from '../components/landing/ParticleCanvas';

// The 15 Pinned Cinematic Scroll Narrative Scenes
import { HeroScene } from '../components/landing/HeroScene';
import { SpendingUniverseScene } from '../components/landing/SpendingUniverseScene';
import { SoWContractionScene } from '../components/landing/SoWContractionScene';
import { RailMigrationScene } from '../components/landing/RailMigrationScene';
import { BigTicketScene } from '../components/landing/BigTicketScene';
import { PrimeParadoxScene } from '../components/landing/PrimeParadoxScene';
import { CustomerBehaviorScene } from '../components/landing/CustomerBehaviorScene';
import { ReasoningPipelineScene } from '../components/landing/ReasoningPipelineScene';
import { OpportunityDiscoveryScene } from '../components/landing/OpportunityDiscoveryScene';
import { NextBestActionScene } from '../components/landing/NextBestActionScene';
import { ActionEconomicsScene } from '../components/landing/ActionEconomicsScene';
import { WaitDecisionScene } from '../components/landing/WaitDecisionScene';
import { ExperimentationScene } from '../components/landing/ExperimentationScene';
import { LearningLoopScene } from '../components/landing/LearningLoopScene';
import { GrandFinalScene } from '../components/landing/GrandFinalScene';

// Register GSAP plugin once at module level
gsap.registerPlugin(ScrollTrigger);

const SCENE_COUNT = 15;

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
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
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

      {/* Main landing container */}
      <div
        className="landing-root relative min-h-screen bg-[#07090E] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200"
        style={{
          visibility: loading ? 'hidden' : 'visible',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        {/* ── PERSISTENT GLOBAL AMBIENT BACKGROUND (visible across ALL scenes on scroll) ── */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Constellation Particle & Dot Mesh Canvas */}
          <ParticleCanvas />

          {/* Deep ambient radial glow centers */}
          <div className="absolute inset-0 bg-radial-gradient opacity-70" />

          {/* Subtle architectural grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-25" />

          {/* Vignette border */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,9,14,0.7)_100%)]" />
        </div>

        {/* Floating navigation */}
        <FloatingNav activeScene={activeScene} />

        {/* ── 15 PINNED CINEMATIC SCROLL NARRATIVE SCENES ── */}
        <div className="relative z-10">
          {/* Scene 01: Hero / Opening */}
          <HeroScene />

          {/* Scene 02: Customer Spending Universe */}
          <SpendingUniverseScene />

          {/* Scene 03: Share of Wallet Contraction */}
          <SoWContractionScene />

          {/* Scene 04: Spend Migration */}
          <RailMigrationScene />

          {/* Scene 05: Big-Ticket Reveal */}
          <BigTicketScene />

          {/* Scene 06: Prime Reward Paradox */}
          <PrimeParadoxScene />

          {/* Scene 07: Customer Intelligence & Behavioral Clustering */}
          <CustomerBehaviorScene />

          {/* Scene 08: AI Intelligence Layer / Reasoning Pipeline */}
          <ReasoningPipelineScene />

          {/* Scene 09: Opportunity Discovery */}
          <OpportunityDiscoveryScene />

          {/* Scene 10: Next Best Action Layer */}
          <NextBestActionScene />

          {/* Scene 11: Action Economics */}
          <ActionEconomicsScene />

          {/* Scene 12: The "WAIT / DO NOTHING" Decision */}
          <WaitDecisionScene />

          {/* Scene 13: Causal Experimentation */}
          <ExperimentationScene />

          {/* Scene 14: Closed-Loop Learning Flywheel */}
          <LearningLoopScene />

          {/* Scene 15: Final Grand Composition & Call to Action */}
          <GrandFinalScene />

          {/* Footer */}
          <footer className="py-10 px-4 border-t border-slate-800/60 bg-[#04060A]/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-mono text-center sm:text-left">
                © 2026 SharePulse AI · Synchrony Analytics Hackathon 2026
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                <span>Zero-assumption empirical evidence</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>Deterministic analytics & ML</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
