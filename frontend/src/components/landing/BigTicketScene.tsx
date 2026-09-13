import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BIG_TICKET_COUNT = 14850;
const HSIC_BIG_TICKET_SOW = 11.20;
const OVERALL_SOW = 19.48;

const OPPORTUNITY_TIERS = [
  { tier: 'Tier 1 · >₹20,000',    customers: 2240,  avgBasket: '₹38,400', color: '#f43f5e', share: 8.1 },
  { tier: 'Tier 2 · ₹10–20,000',  customers: 4890,  avgBasket: '₹13,200', color: '#f59e0b', share: 10.4 },
  { tier: 'Tier 3 · ₹5–10,000',   customers: 7720,  avgBasket: '₹7,100',  color: '#6366f1', share: 12.8 },
];

export const BigTicketScene: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Initialize with verified truth values — NEVER 0 on initial or failed animation!
  const [count, setCount] = useState<number>(BIG_TICKET_COUNT);
  const [meterFill, setMeterFill] = useState<number>(HSIC_BIG_TICKET_SOW);
  const animFired = useRef<boolean>(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
      });

      // Stats entrance & count-up
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 85%',
        onEnter: () => {
          if (animFired.current) return;
          animFired.current = true;

          if (prefersReduced) {
            setCount(BIG_TICKET_COUNT);
            setMeterFill(HSIC_BIG_TICKET_SOW);
            return;
          }

          // Safe closure counter (cannot freeze at 0)
          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: BIG_TICKET_COUNT,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              setCount(Math.round(counterObj.val));
            },
            onComplete: () => {
              setCount(BIG_TICKET_COUNT);
            },
          });

          // Meter fill animation
          setMeterFill(HSIC_BIG_TICKET_SOW);
        },
      });

      // Tiers list entrance (fromTo guarantees opacity: 1)
      if (!prefersReduced && listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
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
      id="scene-bigticket"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden"
    >
      {/* Soft atmospheric ambient glow */}
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-rose-950/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div ref={titleRef} className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-950/40 text-xs font-mono tracking-wider text-rose-300 uppercase mb-4 shadow-sm shadow-rose-950">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Big-Ticket Recovery · OBSERVED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            High-Value Customers,{' '}
            <span className="text-gradient-crisis">Low Card Usage</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            The highest-spending MetroMart customers use HSIC the least on big purchases. Transactions above ₹5,000 show HSIC SoW of only 11.20% — versus 19.48% overall.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column: Big number & SoW gap comparison */}
          <div ref={statsRef} className="space-y-5">
            {/* Counter Card */}
            <div className="p-6 sm:p-8 rounded-2xl border border-rose-500/25 bg-rose-950/20 backdrop-blur-md relative overflow-hidden shadow-xl shadow-black/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-rose-400 font-bold mb-2">
                  Big-Ticket Shoppers Identified · OBSERVED
                </div>
                <div className="text-5xl sm:text-6xl font-black text-white metric-counter leading-none mb-2 tracking-tight">
                  {count.toLocaleString('en-IN')}
                </div>
                <div className="text-sm text-slate-300">
                  Customers with average transaction &gt;₹5,000 at MetroMart · FY26
                </div>
              </div>
            </div>

            {/* SoW Comparison Card */}
            <div className="p-5 sm:p-6 rounded-xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md space-y-4 shadow-lg shadow-black/20">
              <div className="text-sm font-bold text-slate-200">HSIC Share of Wallet — Overall vs Big-Ticket</div>

              {[
                { label: 'Overall Portfolio SoW', value: OVERALL_SOW, color: '#6366f1', max: 30 },
                { label: 'SoW on Transactions >₹5,000', value: HSIC_BIG_TICKET_SOW, color: '#f43f5e', max: 30 },
              ].map((bar) => (
                <div key={bar.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">{bar.label}</span>
                    <span className="text-sm font-black metric-counter" style={{ color: bar.color }}>
                      {bar.value}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(bar.value / bar.max) * 100}%`,
                        backgroundColor: bar.color,
                        boxShadow: `0 0 12px ${bar.color}60`,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="text-xs text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between">
                <span>Big-Ticket Gap:</span>
                <span className="text-rose-400 font-bold font-mono">−8.28 pp under-penetration</span>
              </div>
            </div>

            {/* SoW recovery target meter */}
            <div className="p-4 rounded-xl border border-indigo-500/25 bg-indigo-950/20 backdrop-blur-md">
              <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider mb-2 font-bold">
                Recovery Target to Parity (19.48%)
              </div>
              <div className="relative h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 ease-out"
                  style={{
                    width: `${(meterFill / OVERALL_SOW) * 100}%`,
                    boxShadow: '0 0 16px rgba(99,102,241,0.5)',
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                <span>Current: 11.20%</span>
                <span className="text-cyan-300 font-semibold">Parity Target: 19.48%</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Tiers by Transaction Size */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-slate-200 mb-4">Customer Tiers by Transaction Size</div>

            <div ref={listRef} className="space-y-3">
              {OPPORTUNITY_TIERS.map((row) => (
                <div
                  key={row.tier}
                  className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/90 transition-all flex items-center gap-4 shadow-sm"
                >
                  <div
                    className="w-1.5 self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: row.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-slate-400 mb-1">{row.tier}</div>
                    <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                      <div>
                        <div className="text-xl font-black metric-counter text-white">
                          {row.customers.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400">customers</div>
                      </div>
                      <div className="w-px h-8 bg-slate-800" />
                      <div>
                        <div className="text-sm font-bold text-slate-300">{row.avgBasket}</div>
                        <div className="text-[10px] text-slate-400">avg basket</div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-base font-black metric-counter" style={{ color: row.color }}>
                          {row.share}%
                        </div>
                        <div className="text-[10px] text-slate-400">HSIC SoW</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md mt-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 font-semibold">
                [OBSERVED] Empirical Transaction Audit · Net of Returns
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                14,850 high-ticket shoppers represent the highest single leverage point for revenue recovery. Restoring card preference on purchases &gt;₹5,000 yields disproportionate interchange and interest volume.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
