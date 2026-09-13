import React, { useRef, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Verified data — FY26 payment destination breakdown
const PAYMENT_DATA = [
  { name: 'MetroMart Wallet', value: 35.68, color: '#22d3ee', detail: 'Largest single destination — digital-first capture' },
  { name: 'Cash / UPI',       value: 23.40, color: '#8b5cf6', detail: 'UPI rails bypassing co-brand ecosystem entirely' },
  { name: 'HSIC Credit Card', value: 19.48, color: '#6366f1', detail: 'Our share — needs recovery' },
  { name: 'Other Bank CC',    value: 10.79, color: '#f59e0b', detail: 'Competitor credit cards gaining ground' },
  { name: 'Debit Card',       value: 10.66, color: '#64748b', detail: 'Debit spend — lost interchange revenue' },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof PAYMENT_DATA[0] }> }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl max-w-[200px]">
        <div className="font-semibold text-white mb-0.5">{d.name}</div>
        <div className="text-2xl font-black metric-counter" style={{ color: d.color }}>{d.value}%</div>
        <div className="text-slate-400 mt-1">{d.detail}</div>
      </div>
    );
  }
  return null;
};

export const MigrationScene: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [chartReady, setChartReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
          setChartReady(true);
          if (!prefersReduced && listRef.current) {
            gsap.from(listRef.current.children, {
              opacity: 0,
              x: 30,
              duration: 0.5,
              stagger: 0.08,
              ease: 'power2.out',
              delay: 0.4,
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-migration"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 bg-[#07090E] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-900/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-xs font-mono tracking-wider text-cyan-400 uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Payment Migration Radar · OBSERVED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Where Did the Money Go?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            FY26 basket spend — 100% of MetroMart customer transactions, broken down by payment instrument. Every rupee is accounted for.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Donut chart */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={chartReady ? PAYMENT_DATA : []}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={130}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1200}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {PAYMENT_DATA.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                        stroke={activeIndex === index ? entry.color : 'transparent'}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center label */}
              <div className="text-center -mt-4">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">HSIC SoW</div>
                <div className="text-3xl font-black text-indigo-400 metric-counter">19.48%</div>
                <div className="text-xs text-slate-500">of basket · FY26</div>
              </div>
            </div>
          </div>

          {/* Legend + insight */}
          <div ref={listRef} className="space-y-3">
            {PAYMENT_DATA.map((item, idx) => (
              <div
                key={item.name}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-default ${
                  activeIndex === idx
                    ? 'border-opacity-60 bg-slate-800/60'
                    : 'border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/60'
                }`}
                style={{
                  borderColor: activeIndex === idx ? item.color + '60' : undefined,
                  boxShadow: activeIndex === idx ? `0 0 20px ${item.color}20` : undefined,
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200 truncate">{item.name}</span>
                    <span className="text-sm font-black metric-counter ml-2" style={{ color: item.color }}>
                      {item.value}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.detail}</div>
                  {/* Progress bar */}
                  <div className="mt-1.5 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: chartReady ? `${item.value}%` : '0%',
                        backgroundColor: item.color,
                        transitionDelay: `${idx * 80}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4 p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                Source: 444,000+ MetroMart transactions · FY26 · Net of returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
