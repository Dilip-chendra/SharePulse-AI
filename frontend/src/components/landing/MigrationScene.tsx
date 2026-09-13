import React, { useRef, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Verified data — FY26 payment destination breakdown
const PAYMENT_DATA = [
  { name: 'MetroMart Wallet', value: 35.68, color: '#22d3ee', share: '35.68%', detail: 'Primary defection vector — instant checkout & closed-loop wallet' },
  { name: 'Cash / UPI',       value: 23.40, color: '#8b5cf6', share: '23.40%', detail: 'UPI & cash rail bypassing the co-brand card ecosystem entirely' },
  { name: 'HSIC Credit Card', value: 19.48, color: '#6366f1', share: '19.48%', detail: 'HSIC Co-brand share — contracted from 28.91% in FY25' },
  { name: 'Other Bank CC',    value: 10.79, color: '#f59e0b', share: '10.79%', detail: 'External premium cards capturing high-tier customer spend' },
  { name: 'Debit Card',       value: 10.66, color: '#64748b', share: '10.66%', detail: 'Everyday debit purchases with zero interchange advantage' },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof PAYMENT_DATA[0] }> }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl px-4 py-3 text-xs shadow-2xl backdrop-blur-md max-w-[240px]">
        <div className="font-bold text-white text-sm mb-1">{d.name}</div>
        <div className="text-2xl font-black metric-counter" style={{ color: d.color }}>{d.share}</div>
        <div className="text-slate-300 mt-1.5 leading-relaxed">{d.detail}</div>
      </div>
    );
  }
  return null;
};

export const MigrationScene: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Title entrance
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
      });

      // Cards entrance (fromTo guarantees opacity: 1 at completion)
      if (!prefersReduced && listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: listRef.current, start: 'top 85%' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-migration"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden"
    >
      {/* Soft atmospheric ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[500px] bg-cyan-900/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[400px] bg-indigo-900/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-xs font-mono tracking-wider text-cyan-300 uppercase mb-4 shadow-sm shadow-cyan-950">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Payment Migration Radar · OBSERVED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Where Did the Money Go?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            FY26 basket spend across 444,000+ MetroMart customer transactions. Every single rupee accounted for across all 5 payment rails.
          </p>
        </div>

        {/* Two-column layout: Donut chart on left, full breakdown cards on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Donut chart & central metric (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm relative">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={PAYMENT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={78}
                    outerRadius={132}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {PAYMENT_DATA.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                        stroke={activeIndex === index ? '#ffffff' : 'transparent'}
                        strokeWidth={activeIndex === index ? 2 : 0}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center donut label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  HSIC Share
                </span>
                <span className="text-3xl font-black text-indigo-400 metric-counter tracking-tight">
                  19.48%
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  FY26 Basket
                </span>
              </div>
            </div>

            {/* Quick summary pill under chart */}
            <div className="mt-2 text-center text-xs text-slate-400 font-mono">
              Hover slices to inspect payment instruments
            </div>
          </div>

          {/* Right Column: Complete Destination Breakdown Cards (7 cols — fully filled, zero blank space) */}
          <div className="lg:col-span-7">
            <div ref={listRef} className="space-y-3">
              {PAYMENT_DATA.map((item, idx) => (
                <div
                  key={item.name}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-default ${
                    activeIndex === idx
                      ? 'border-slate-600 bg-slate-800/80 shadow-lg shadow-black/40 scale-[1.01]'
                      : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                  style={{
                    borderColor: activeIndex === idx ? item.color : undefined,
                  }}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-bold text-white tracking-tight truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 shrink-0">
                      <span className="text-base font-black metric-counter" style={{ color: item.color }}>
                        {item.share}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">of spend</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                    {item.detail}
                  </p>

                  {/* Visual proportion bar */}
                  <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${item.value * 2.2}%`,
                        backgroundColor: item.color,
                        boxShadow: `0 0 10px ${item.color}40`,
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Source & displacement insight callout box */}
              <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-950/20 flex items-start gap-3 mt-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 animate-pulse" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-cyan-300">Key Finding:</span> MetroMart Wallet (35.68%) and Cash/UPI (23.40%) together absorb <span className="font-bold text-white">59.08%</span> of all customer spend — representing the primary displacement rail away from HSIC Bank.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
