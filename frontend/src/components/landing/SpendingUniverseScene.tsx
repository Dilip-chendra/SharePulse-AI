import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
  railIndex: number;
}

export const SpendingUniverseScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const railsRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const scrollProgressRef = useRef<number>(0);

  const RAILS = [
    { name: 'HSIC Bank Card', color: '#3B82F6', xFactor: 0.15, yFactor: 0.5 },
    { name: 'MetroMart Wallet', color: '#F59E0B', xFactor: 0.85, yFactor: 0.3 },
    { name: 'Cash / UPI', color: '#10B981', xFactor: 0.85, yFactor: 0.7 },
    { name: 'Other Bank CC', color: '#EC4899', xFactor: 0.5, yFactor: 0.15 },
    { name: 'Debit Card', color: '#06B6D4', xFactor: 0.5, yFactor: 0.85 },
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Pinned timeline controlling scroll progress
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
          },
        },
      });

      // Smooth HUD reveal and rail illumination
      tl.fromTo(hudRef.current, { opacity: 0.85, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.3 }, 0);
      if (railsRef.current) {
        tl.fromTo(
          railsRef.current.children,
          { opacity: 0.4, y: 10 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.4 },
          0.1
        );
      }
    }, containerRef);

    // Canvas particle engine
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cCtx = canvas.getContext('2d');
    if (!cCtx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 8000), 220);
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const railIdx = Math.floor(Math.random() * RAILS.length);
      const rail = RAILS[railIdx];
      const ox = width * 0.5 + (Math.random() - 0.5) * 160;
      const oy = height * 0.5 + (Math.random() - 0.5) * 160;
      return {
        x: ox,
        y: oy,
        originX: ox,
        originY: oy,
        targetX: width * rail.xFactor + (Math.random() - 0.5) * 80,
        targetY: height * rail.yFactor + (Math.random() - 0.5) * 80,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
        size: Math.random() * 2 + 1,
        color: rail.color,
        railIndex: railIdx,
      };
    });

    const render = () => {
      cCtx.clearRect(0, 0, width, height);
      const p = scrollProgressRef.current;

      // Draw central transaction pulse source
      const pulseAlpha = Math.max(0.15, 1 - p * 0.5);
      cCtx.beginPath();
      cCtx.arc(width * 0.5, height * 0.5, 40 + Math.sin(Date.now() * 0.003) * 6, 0, Math.PI * 2);
      cCtx.fillStyle = `rgba(99, 102, 241, ${pulseAlpha * 0.08})`;
      cCtx.fill();

      // If p > 0.3, draw subtle rail destination nodes
      if (p > 0.25) {
        const destAlpha = Math.min(1, (p - 0.25) * 2.5);
        RAILS.forEach((r) => {
          const rx = width * r.xFactor;
          const ry = height * r.yFactor;

          cCtx.beginPath();
          cCtx.arc(rx, ry, 12, 0, Math.PI * 2);
          cCtx.fillStyle = r.color;
          cCtx.globalAlpha = destAlpha * 0.15;
          cCtx.fill();

          cCtx.beginPath();
          cCtx.arc(rx, ry, 4, 0, Math.PI * 2);
          cCtx.fillStyle = r.color;
          cCtx.globalAlpha = destAlpha * 0.8;
          cCtx.fill();
        });
      }

      // Render flowing transaction particles
      particles.forEach((pt) => {
        if (p < 0.2) {
          // Neutral jitter around center
          pt.x = pt.originX + Math.sin(Date.now() * 0.002 + pt.speed * 100) * 8;
          pt.y = pt.originY + Math.cos(Date.now() * 0.002 + pt.speed * 100) * 8;
          cCtx.fillStyle = 'rgba(203, 213, 225, 0.4)';
        } else {
          // Streaming outward towards targets
          const flowIntensity = Math.min(1, (p - 0.2) * 2);
          pt.progress += pt.speed * (1 + flowIntensity * 2);
          if (pt.progress > 1) pt.progress = 0;

          // Interpolate between origin and rail target
          const curX = pt.originX + (pt.targetX - pt.originX) * pt.progress;
          const curY = pt.originY + (pt.targetY - pt.originY) * pt.progress;
          pt.x = curX;
          pt.y = curY;

          cCtx.fillStyle = pt.color;
        }

        cCtx.beginPath();
        cCtx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        cCtx.globalAlpha = 0.7;
        cCtx.fill();
      });

      cCtx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      ctx.revert();
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-universe"
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#07090E] px-4 sm:px-6 select-none"
    >
      {/* 60fps Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Main Glassmorphic Control HUD Card */}
      <div
        ref={hudRef}
        className="relative z-10 w-full max-w-4xl p-6 sm:p-8 rounded-2xl bg-[#0B0F19]/90 border border-[#1A2234] backdrop-blur-xl shadow-2xl shadow-black/60 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[11px] uppercase tracking-wider mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>SCENE 02 · REAL-TIME TRANSACTION DYNAMICS</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-sans">
          Customers Are Still Spending.
          <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            The Question Is Which Rail Absorbs It.
          </span>
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto mt-3 font-normal">
          Across 444,118 net transactions and ₹353.80M in retail turnover (+19.4% YoY), customer volume remained resilient. But checkout spend fractured across five competing payment rails.
        </p>

        {/* Telemetry HUD metrics */}
        <div className="grid grid-cols-3 gap-3 pt-4 mt-6 border-t border-slate-800/80 font-mono text-center">
          <div className="p-3 rounded-xl bg-[#07090E]/80 border border-[#1A2234]">
            <span className="text-[10px] text-slate-500 uppercase block tracking-wider">Net Swipes</span>
            <span className="text-sm sm:text-lg font-bold text-white">444,118</span>
            <span className="text-[9px] text-slate-500 block">[OBSERVED]</span>
          </div>
          <div className="p-3 rounded-xl bg-[#07090E]/80 border border-[#1A2234]">
            <span className="text-[10px] text-slate-500 uppercase block tracking-wider">FY26 Gross Spend</span>
            <span className="text-sm sm:text-lg font-bold text-emerald-400">₹353.80M</span>
            <span className="text-[9px] text-slate-500 block">+19.4% YoY</span>
          </div>
          <div className="p-3 rounded-xl bg-[#07090E]/80 border border-[#1A2234]">
            <span className="text-[10px] text-slate-500 uppercase block tracking-wider">Retail Accounts</span>
            <span className="text-sm sm:text-lg font-bold text-blue-400">45,000</span>
            <span className="text-[9px] text-slate-500 block">Active Shoppers</span>
          </div>
        </div>

        {/* 5 Payment Rail Migration Pills */}
        <div ref={railsRef} className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-4 border-t border-slate-800/60 font-mono text-xs text-left">
          <div className="p-2.5 rounded-lg bg-[#07090E]/90 border border-amber-500/30">
            <span className="text-[10px] text-amber-400 block font-bold">MetroMart Wallet</span>
            <span className="text-sm font-black text-white">35.68%</span>
            <span className="text-[9px] text-slate-400 block">₹126.2M GMV</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#07090E]/90 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 block font-bold">Cash / UPI</span>
            <span className="text-sm font-black text-white">23.40%</span>
            <span className="text-[9px] text-slate-400 block">₹82.8M GMV</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/50 shadow-sm shadow-blue-500/10">
            <span className="text-[10px] text-blue-400 block font-bold">HSIC Co-Brand</span>
            <span className="text-sm font-black text-blue-300">19.48%</span>
            <span className="text-[9px] text-rose-400 block font-semibold">−9.43 pp drop</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#07090E]/90 border border-pink-500/30">
            <span className="text-[10px] text-pink-400 block font-bold">Other Bank CC</span>
            <span className="text-sm font-black text-white">10.79%</span>
            <span className="text-[9px] text-slate-400 block">₹38.2M GMV</span>
          </div>
          <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-[#07090E]/90 border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 block font-bold">Debit Cards</span>
            <span className="text-sm font-black text-white">10.66%</span>
            <span className="text-[9px] text-slate-400 block">₹37.7M GMV</span>
          </div>
        </div>
      </div>
    </section>
  );
};
