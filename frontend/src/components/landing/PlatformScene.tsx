import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PLATFORM_NODES = [
  {
    id: 'data',
    label: 'Data Ingestion',
    sublabel: 'CSV · API · Webhook',
    icon: '⬡',
    color: '#22d3ee',
    x: 0,
    outputs: ['ai'],
  },
  {
    id: 'ai',
    label: 'Analytics Engine',
    sublabel: 'SoW · Attrition · Migration',
    icon: '◈',
    color: '#6366f1',
    x: 1,
    outputs: ['actions'],
  },
  {
    id: 'actions',
    label: 'Action Center',
    sublabel: 'NBA · Experiments · Alerts',
    icon: '◉',
    color: '#10b981',
    x: 2,
    outputs: [],
  },
];

const CAPABILITIES = [
  { name: 'Share of Wallet Intelligence',    icon: '📊', desc: 'FY & quarterly SoW trends with category penetration heatmaps' },
  { name: 'Payment Migration Radar',         icon: '🔀', desc: 'Sankey flow mapping of competing payment instruments' },
  { name: 'Attrition Detection',             icon: '🎯', desc: 'Silent defector identification with behavioral signals' },
  { name: 'Prime Reward Intelligence',       icon: '💎', desc: 'Per-cardholder forfeiture tracking with recovery playbooks' },
  { name: 'Big-Ticket Recovery',             icon: '🏷️', desc: 'High-value customer SoW gap analysis and targeting' },
  { name: 'AI Analyst',                      icon: '🤖', desc: 'Natural language query interface over your transaction data' },
  { name: 'Experiment Impact',               icon: '⚗️', desc: 'A/B test results tracking and uplift measurement' },
  { name: 'Executive Command Center',        icon: '📡', desc: 'Real-time KPI dashboard with alert management' },
];

export const PlatformScene: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);
  const capGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
      });

      if (pipelineRef.current) {
        gsap.from(pipelineRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: pipelineRef.current, start: 'top 80%' },
        });
      }

      if (capGridRef.current) {
        gsap.from(capGridRef.current.children, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: capGridRef.current, start: 'top 85%' },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-platform"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-indigo-950/15 rounded-full blur-[130px] pointer-events-none" />


      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-14 sm:mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/30 text-xs font-mono tracking-wider text-indigo-400 uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Platform Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            From raw transaction data to actionable intelligence in minutes. No data science degree required.
          </p>
        </div>

        {/* Pipeline diagram */}
        <div ref={pipelineRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 mb-16 sm:mb-20">
          {PLATFORM_NODES.map((node, idx) => (
            <React.Fragment key={node.id}>
              <div className="flex flex-col items-center text-center w-full sm:w-48">
                {/* Node circle */}
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-3 border"
                  style={{
                    borderColor: node.color + '40',
                    backgroundColor: node.color + '12',
                    boxShadow: `0 0 30px ${node.color}20`,
                  }}
                >
                  {node.icon}
                </div>
                <div className="text-sm sm:text-base font-semibold text-white">{node.label}</div>
                <div className="text-xs text-slate-500 mt-0.5 font-mono">{node.sublabel}</div>
              </div>

              {/* Arrow */}
              {idx < PLATFORM_NODES.length - 1 && (
                <div className="flex items-center justify-center sm:mx-4">
                  <svg
                    className="w-8 h-8 text-slate-600 rotate-90 sm:rotate-0"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M4 16h20M18 8l8 8-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Capabilities grid */}
        <div>
          <div className="text-sm font-semibold text-slate-400 text-center mb-6 uppercase tracking-wider font-mono">
            8 Intelligence Modules
          </div>
          <div ref={capGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.name}
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-700 transition-all duration-200 group"
              >
                <div className="text-xl mb-2">{cap.icon}</div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors mb-1">
                  {cap.name}
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">{cap.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-10 p-4 rounded-xl border border-slate-800/40 bg-slate-900/20">
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-2">Tech Stack</div>
          <div className="flex flex-wrap gap-2">
            {['Python · FastAPI', 'React · TypeScript', 'Pandas · Scikit-learn', 'PostgreSQL', 'Clerk Auth', 'Vercel · Railway', 'Recharts · Tailwind'].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-xs font-mono text-slate-500 bg-slate-800/60 border border-slate-700/40"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
