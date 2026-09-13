import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BIG_TICKET_COUNT = 14850;
const HSIC_BIG_TICKET_SOW = 11.20;
const OVERALL_SOW = 19.48;

export const BigTicketScene: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [meterFill, setMeterFill] = useState(0);
  const [trigFired, setTrigFired] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
      });

      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        onEnter: () => {
          if (trigFired) return;
          setTrigFired(true);

          if (prefersReduced) {
            setCount(BIG_TICKET_COUNT);
            setMeterFill(HSIC_BIG_TICKET_SOW);
            return;
          }

          gsap.to({ val: 0 }, {
            val: BIG_TICKET_COUNT,
            duration: 2.0,
            ease: 'power2.out',
            onUpdate: function () { setCount(Math.round(this.targets()[0].val)); },
          });

          setTimeout(() => {
            setMeterFill(HSIC_BIG_TICKET_SOW);
          }, 300);

          gsap.from('.bt-row', {
            opacity: 0,
            x: 30,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.4,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [trigFired]);

  const OPPORTUNITY_TIERS = [
    { tier: 'Tier 1 · >₹20,000',    customers: 2240,  avgBasket: '₹38,400', color: '#f43f5e', share: 8.1 },
    { tier: 'Tier 2 · ₹10–20,000',  customers: 4890,  avgBasket: '₹13,200', color: '#f59e0b', share: 10.4 },
    { tier: 'Tier 3 · ₹5–10,000',   customers: 7720,  avgBasket: '₹7,100',  color: '#6366f1', share: 12.8 },
  ];

  return (
    <section
      ref={sectionRef}
      id="scene-bigticket"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 bg-[#07090E] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[350px] bg-rose-900/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-950/30 text-xs font-mono tracking-wider text-rose-400 uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Big-Ticket Recovery · OBSERVED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            High-Value Customers,{' '}
            <span className="text-gradient-crisis">Low Card Usage</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            The highest-spending MetroMart customers use HSIC the least on big purchases. Transactions above ₹5,000 show HSIC SoW of only 11.20% — versus 19.48% overall.
          </p>
        </div>

        <div ref={statsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Big number + SoW comparison */}
          <div className="space-y-5">
            {/* Counter */}
            <div className="p-6 sm:p-8 rounded-2xl border border-rose-500/20 bg-rose-950/15">
              <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-rose-400 mb-2">
                Big-Ticket Shoppers Identified · OBSERVED
              </div>
              <div className="text-5xl sm:text-6xl font-black text-white metric-counter leading-none mb-2">
                {count.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-slate-400">
                Customers with avg transaction &gt;₹5,000 at MetroMart · FY26
              </div>
            </div>

            {/* SoW Comparison */}
            <div className="p-5 rounded-xl border border-slate-700/50 bg-slate-900/40 space-y-4">
              <div className="text-sm font-semibold text-slate-300">HSIC SoW — Overall vs Big-Ticket</div>

              {[
                { label: 'Overall SoW', value: OVERALL_SOW, color: '#6366f1', max: 30 },
                { label: 'SoW on >₹5,000 Txns', value: HSIC_BIG_TICKET_SOW, color: '#f43f5e', max: 30 },
              ].map((bar) => (
                <div key={bar.label} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">{bar.label}</span>
                    <span className="text-base font-black metric-counter" style={{ color: bar.color }}>
                      {bar.value}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1200"
                      style={{
                        width: trigFired ? `${(bar.value / bar.max) * 100}%` : '0%',
                        backgroundColor: bar.color,
                        transition: 'width 1.2s ease',
                        boxShadow: `0 0 12px ${bar.color}50`,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="text-xs text-slate-500 pt-1">
                Gap: <span className="text-rose-400 font-semibold">−8.28 pp</span> on highest-value transactions — largest addressable opportunity
              </div>
            </div>

            {/* SoW recovery meter */}
            <div className="p-4 rounded-xl border border-indigo-800/30 bg-indigo-950/15">
              <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-3">
                If We Recover to Overall SoW (Target: 19.48%)
              </div>
              <div className="relative h-4 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-400"
                  style={{
                    width: `${(meterFill / 19.48) * 100}%`,
                    transition: 'width 1.5s ease 0.5s',
                    boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                  }}
                />
                <div
                  className="absolute top-0 h-full border-r-2 border-dashed border-cyan-400/60"
                  style={{ left: '100%' }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-600 mt-1">
                <span>Current: 11.20%</span>
                <span>Target: 19.48%</span>
              </div>
            </div>
          </div>

          {/* Right: tiered table */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-300 mb-4">Customer Tiers by Transaction Size</div>

            {OPPORTUNITY_TIERS.map((row) => (
              <div
                key={row.tier}
                className="bt-row flex items-center gap-4 p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/60 transition-colors"
              >
                <div
                  className="w-1 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: row.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-slate-500 mb-0.5">{row.tier}</div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div>
                      <div className="text-xl font-black metric-counter text-white">
                        {row.customers.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500">customers</div>
                    </div>
                    <div className="w-px h-8 bg-slate-800" />
                    <div>
                      <div className="text-sm font-semibold text-slate-300">{row.avgBasket}</div>
                      <div className="text-[10px] text-slate-500">avg basket</div>
                    </div>
                    <div className="ml-auto">
                      <div className="text-sm font-black metric-counter" style={{ color: row.color }}>
                        {row.share}%
                      </div>
                      <div className="text-[10px] text-slate-500">HSIC SoW</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/20 mt-4">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                [OBSERVED] All figures derived from transaction audit · net of returns
              </div>
              <div className="text-xs text-slate-400">
                14,850 big-ticket customers represent the highest leverage point for SoW recovery — each 1 pp recovery on this segment yields disproportionate revenue.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
