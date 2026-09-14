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
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
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

      // Crossfade copy: "CUSTOMERS ARE STILL SPENDING." -> "THE QUESTION IS WHERE."
      tl.fromTo(text1Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
        .to(text1Ref.current, { opacity: 0, y: -20, duration: 0.25 }, 0.4)
        .fromTo(text2Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35 }, 0.5)
        .to(text2Ref.current, { opacity: 0.9, duration: 0.15 }, 0.85);

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
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#07090E] select-none"
    >
      {/* 60fps Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Center Narrative Typographic Layer */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pointer-events-none">
        <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase mb-4">
          SCENE 02 · TRANSACTION UNIVERSE
        </div>

        {/* Phase 1 Text */}
        <div ref={text1Ref} className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans">
            CUSTOMERS ARE STILL SPENDING.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4 font-mono">
            444,118 transactions streaming across 45,000 active retail accounts.
          </p>
        </div>

        {/* Phase 2 Text */}
        <div ref={text2Ref} className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-cyan-300 leading-tight font-sans">
            THE QUESTION IS WHERE.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4 font-mono max-w-xl mx-auto">
            Spend is separating into 5 competing payment rails at store checkout.
          </p>
        </div>
      </div>
    </section>
  );
};
