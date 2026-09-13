import React, { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  alphaDir: number;
  color: string;
}

const COLORS = ['#6366f1', '#22d3ee', '#818cf8', '#06b6d4', '#a855f7'];

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const lastScrollY = useRef<number>(0);
  const scrollVelocity = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(width, height);
    };

    const initParticles = (w: number, h: number) => {
      // Density based on viewport size (approx 90-120 particles on desktop)
      const count = Math.min(Math.max(Math.floor((w * h) / 14000), 60), 120);
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.45 + 0.15,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const drawConnections = (particles: Particle[]) => {
      const maxDist = 130;
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.12 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Decay scroll velocity
      scrollVelocity.current *= 0.92;
      const sVel = scrollVelocity.current;

      particles.forEach((p) => {
        // Mouse interaction (gentle attraction / repulsion bubble)
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          const force = (140 - mdist) / 140;
          p.vx += (mdx / mdist) * force * 0.04;
          p.vy += (mdy / mdist) * force * 0.04;
        }

        // Scroll drift (subtle parallax feeling when scrolling)
        p.y -= sVel * 0.15;

        // Velocity damping & clamping
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.vx = Math.max(-1.2, Math.min(1.2, p.vx));
        p.vy = Math.max(-1.2, Math.min(1.2, p.vy));

        p.x += p.vx;
        p.y += p.vy;

        // Wrap viewport edges seamlessly
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Alpha breathing effect
        p.alpha += p.alphaDir * 0.004;
        if (p.alpha > 0.65) {
          p.alpha = 0.65;
          p.alphaDir = -1;
        } else if (p.alpha < 0.1) {
          p.alpha = 0.1;
          p.alphaDir = 1;
        }

        // Draw particle with soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Draw constellation network lines
      drawConnections(particles);

      animRef.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity.current = Math.max(-20, Math.min(20, currentScrollY - lastScrollY.current));
      lastScrollY.current = currentScrollY;
    };

    resize();
    animate();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className ?? ''}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};
