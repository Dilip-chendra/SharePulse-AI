import React, { useEffect, useRef } from 'react';

interface BackgroundNetworkProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}

export const BackgroundNetwork: React.FC<BackgroundNetworkProps> = ({
  className = '',
  particleCount = 50,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates
    const mouse = {
      x: width / 2,
      y: height / 3,
      radius: 180,
      active: false
    };

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Particle class
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseColor: string;
      alpha: number;
      pulseSpeed: number;
      pulseOffset: number;
    }

    const colors = [
      'rgba(99, 102, 241,', // Indigo
      'rgba(6, 182, 212,',  // Cyan
      'rgba(168, 85, 247,', // Violet
      'rgba(56, 189, 248,'  // Sky Blue
    ];

    const particles: Particle[] = [];
    const count = Math.min(particleCount, Math.floor((width * height) / 25000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 1,
        baseColor: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle ambient grid lines
      const gridSize = 64;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Update & Render Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Wrap edges smoothly
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          // Mouse proximity reaction
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
              const force = (1 - dist / mouse.radius) * 0.02;
              p.x += dx * force;
              p.y += dy * force;
            }
          }
        }

        // Pulsing alpha
        const currentAlpha = p.alpha + Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.15;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.baseColor}${Math.max(0.1, Math.min(1, currentAlpha))})`;
        ctx.shadowColor = `${p.baseColor}0.8)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const linkAlpha = (1 - dist / 110) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${linkAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140) {
            const cursorAlpha = (1 - mdist / 140) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${cursorAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [particleCount, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.85 }}
    />
  );
};
