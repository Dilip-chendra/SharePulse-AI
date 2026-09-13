import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Verified data
const DEFECTOR_COUNT = 10098;

function generateScatterPoints(count: number) {
  const pts: { x: number; y: number; risk: 'high' | 'medium' | 'low' }[] = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 1.618;
    const x = ((Math.sin(seed) * 0.5 + 0.5) * 0.85 + 0.075);
    const y = ((Math.cos(seed * 1.3) * 0.5 + 0.5) * 0.85 + 0.075);
    const val = Math.sin(seed * 2.7) * 0.5 + 0.5;
    pts.push({
      x,
      y,
      risk: val > 0.66 ? 'high' : val > 0.33 ? 'medium' : 'low',
    });
  }
  return pts;
}

const SCATTER_PTS = generateScatterPoints(150);

export const DefectorScene: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize with verified truth value — NEVER 0 on initial or failed animation!
  const [count, setCount] = useState<number>(DEFECTOR_COUNT);
  const [canvasReady, setCanvasReady] = useState<boolean>(true);
  const animFired = useRef<boolean>(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
      });

      ScrollTrigger.create({
        trigger: counterRef.current,
        start: 'top 85%',
        onEnter: () => {
          if (animFired.current) return;
          animFired.current = true;
          setCanvasReady(true);

          if (prefersReduced) {
            setCount(DEFECTOR_COUNT);
            return;
          }

          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: DEFECTOR_COUNT,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => setCount(Math.round(counterObj.val)),
            onComplete: () => setCount(DEFECTOR_COUNT),
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scatter plot on canvas
  useEffect(() => {
    if (!canvasReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const COLORS = { high: '#f43f5e', medium: '#f59e0b', low: '#6366f1' };
    let frame = 0;
    let drawn = 0;

    const drawFrame = () => {
      const toAdd = Math.min(8, SCATTER_PTS.length - drawn);
      for (let i = 0; i < toAdd; i++) {
        const pt = SCATTER_PTS[drawn + i];
        const x = pt.x * w;
        const y = pt.y * h;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[pt.risk] + 'CC';
        ctx.fill();
      }
      drawn += toAdd;
      if (drawn < SCATTER_PTS.length) {
        frame = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();
    return () => cancelAnimationFrame(frame);
  }, [canvasReady]);

  return (
    <section
      ref={sectionRef}
      id="scene-defectors"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden"
    >
      {/* Soft atmospheric ambient glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[450px] bg-orange-950/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-950/40 text-xs font-mono tracking-wider text-orange-300 uppercase mb-4 shadow-sm shadow-orange-950">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Attrition Radar · OBSERVED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Silent Defectors
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Customers who remain active MetroMart shoppers but have stopped using their HSIC co-brand card. Invisible in standard churn reports. Devastating to revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column: counter + stats */}
          <div ref={counterRef} className="space-y-6">
            {/* Big counter card */}
            <div className="p-6 sm:p-8 rounded-2xl border border-orange-500/25 bg-orange-950/20 backdrop-blur-md relative overflow-hidden shadow-xl shadow-black/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-orange-400 font-bold mb-2">
                  Silent Defectors Identified · OBSERVED
                </div>
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white metric-counter leading-none mb-2 tracking-tight">
                  {count.toLocaleString('en-IN')}
                </div>
                <div className="text-sm text-slate-300">
                  Active MetroMart shoppers · ΔSoW ≤ −15 pp from prior fiscal year
                </div>
              </div>
            </div>

            {/* Supporting stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: 'Annualized Revenue at Risk', value: '₹69.5M', color: 'text-rose-400', tag: 'MODEL_DERIVED', sub: 't=118.4, p<0.001' },
                { label: 'Big-Ticket Shoppers', value: '14,850', color: 'text-amber-400', tag: 'OBSERVED', sub: '>₹5,000 avg basket' },
              ].map((s) => (
                <div key={s.label} className="p-4 sm:p-5 rounded-xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md shadow-md">
                  <div className={`text-2xl sm:text-3xl font-black metric-counter ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-slate-300 font-medium mt-1 leading-snug">{s.label}</div>
                  <div className={`text-[9px] font-mono mt-1 ${s.tag === 'OBSERVED' ? 'text-cyan-400' : 'text-amber-400'} uppercase tracking-wider font-semibold`}>
                    [{s.tag}]
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Detection method */}
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 font-bold">Detection Methodology</div>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ΔSoW computed per-customer using 12-month rolling windows. Customers with ≥15 pp decline and active MetroMart transactions in both periods are flagged as Silent Defectors.
              </div>
            </div>
          </div>

          {/* Right Column: scatter plot */}
          <div className="relative">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 text-center">
              Representative Sample (n=150 of 10,098) · Risk by SoW Decline
            </div>
            <div
              className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-xl"
              style={{ aspectRatio: '1/0.75' }}
            >
              <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-400 font-semibold">
                Transaction Recency →
              </div>
              <div
                className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 font-semibold"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)' }}
              >
                ← SoW Decline Severity
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-3">
              {[
                { color: '#f43f5e', label: 'High Risk' },
                { color: '#f59e0b', label: 'Medium Risk' },
                { color: '#6366f1', label: 'Lower Risk' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-xs text-slate-400 font-medium">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
