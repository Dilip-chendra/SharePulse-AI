import React from 'react';

const PLATFORM_NODES = [
  {
    id: 'data',
    label: 'Data Ingestion',
    sublabel: 'CSV · API · Webhook',
    icon: '⬡',
    color: '#22d3ee',
  },
  {
    id: 'ai',
    label: 'Analytics Engine',
    sublabel: 'SoW · Attrition · Migration',
    icon: '◈',
    color: '#6366f1',
  },
  {
    id: 'actions',
    label: 'Action Center',
    sublabel: 'NBA · Experiments · Alerts',
    icon: '◉',
    color: '#10b981',
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
  return (
    <section
      id="scene-platform"
      className="relative min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[450px] bg-indigo-950/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10 sm:mb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-xs font-mono tracking-wider text-indigo-300 uppercase mb-3 shadow-sm shadow-indigo-950">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Platform Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            How It Works
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From raw transaction data to actionable intelligence in minutes. No data science degree required.
          </p>
        </div>

        {/* 3-Step Pipeline Diagram — Always 100% visible */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 mb-12 sm:mb-14">
          {PLATFORM_NODES.map((node, idx) => (
            <React.Fragment key={node.id}>
              <div className="flex flex-col items-center text-center w-full sm:w-52 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-lg transition-all hover:scale-[1.02]">
                {/* Node icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-3 border shadow-md"
                  style={{
                    borderColor: node.color + '50',
                    backgroundColor: node.color + '15',
                    boxShadow: `0 0 24px ${node.color}25`,
                  }}
                >
                  {node.icon}
                </div>
                <div className="text-sm sm:text-base font-bold text-white tracking-tight">{node.label}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">{node.sublabel}</div>
              </div>

              {/* Connecting Arrow */}
              {idx < PLATFORM_NODES.length - 1 && (
                <div className="flex items-center justify-center sm:mx-2 my-1 sm:my-0">
                  <svg
                    className="w-7 h-7 text-indigo-400/70 rotate-90 sm:rotate-0 animate-pulse"
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

        {/* 8 Intelligence Modules Grid — Always 100% visible, never blank */}
        <div>
          <div className="text-xs font-mono font-bold text-slate-400 text-center mb-5 uppercase tracking-[0.2em]">
            8 Native Intelligence Modules
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.name}
                className="p-4 sm:p-5 rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/90 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5 transition-all duration-200 group cursor-default"
              >
                <div className="text-2xl mb-2.5 transform group-hover:scale-110 transition-transform">{cap.icon}</div>
                <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5 leading-snug">
                  {cap.name}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">{cap.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Footer Card */}
        <div className="mt-8 p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">Enterprise Tech Stack</div>
          <div className="flex flex-wrap gap-2">
            {['Python · FastAPI', 'React · TypeScript', 'Pandas · Scikit-learn', 'PostgreSQL', 'Clerk Auth', 'Vercel · Render', 'Recharts · Tailwind CSS'].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-xs font-mono text-slate-300 bg-slate-800/70 border border-slate-700/50"
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
