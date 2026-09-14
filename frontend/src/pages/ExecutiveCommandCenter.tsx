import React from 'react';
import { ClassificationBadge } from '../components/common/ClassificationBadge';
import { useFilters } from '../context/FilterContext';
import { 
  AlertTriangle, 
  Target, 
  ArrowRight, 
  Filter,
  Users,
  ArrowRightLeft,
  FlaskConical
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

interface Props {
  overviewData: any;
  setActivePage: (p: string) => void;
}

export const ExecutiveCommandCenter: React.FC<Props> = ({ overviewData, setActivePage }) => {
  const { 
    appliedFiscalYear, 
    appliedMembership, 
    appliedCategory, 
    appliedSegment,
    isFilterApplied 
  } = useFilters();

  if (!overviewData) {
    return (
      <div className="p-8 text-slate-400 font-mono text-xs animate-pulse">
        Initializing Decision Engine Command Center...
      </div>
    );
  }

  const { kpis, executive_narrative, monthly_trend, payment_mix } = overviewData;

  const displayMonthlyTrend = appliedFiscalYear === "FY25" 
    ? (monthly_trend || []).slice(0, 12)
    : appliedFiscalYear === "FY26"
    ? (monthly_trend || []).slice(12, 24)
    : (monthly_trend || []);

  const paymentColors: Record<string, string> = {
    "MetroMart Wallet": "#22D3EE",
    "Cash/UPI": "#8B5CF6",
    "HSIC Bank Credit Card": "#6366F1",
    "Other Bank Credit Card": "#F59E0B",
    "Debit Card": "#64748B"
  };

  // 4 Priority NBA Strategies with verified & modeled numbers
  const priorityNBAs = [
    {
      id: "NBA-01",
      name: "Prime Statement Transparency Alert",
      target: "19,423 Prime Members",
      modeledSpend: "₹12.85M",
      roi: "4.8x",
      tag: "EXPERIMENT CANDIDATE",
      page: "nba"
    },
    {
      id: "NBA-02",
      name: "0% POS Financing on Durables (>₹5k)",
      target: "14,850 Big-Ticket Shoppers",
      modeledSpend: "₹26.20M",
      roi: "3.4x",
      tag: "EXPERIMENT CANDIDATE",
      page: "nba"
    },
    {
      id: "NBA-03",
      name: "Silent Defector Velocity Interception",
      target: "10,098 At-Risk Shoppers",
      modeledSpend: "₹8.20M",
      roi: "2.9x",
      tag: "EXPERIMENT CANDIDATE",
      page: "nba"
    },
    {
      id: "NBA-04",
      name: "One-Hit Wonder Second-Swipe Ladder",
      target: "Second-Swipe Opportunity",
      modeledSpend: "₹4.00M",
      roi: "2.2x",
      tag: "EXPERIMENT CANDIDATE",
      page: "nba"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Product Loop Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-cyan-400 font-bold">DECISION ENGINE LOOP:</span>
          <span className="text-slate-300">DATA</span>
          <span>→</span>
          <span className="text-indigo-400 font-semibold">DIAGNOSE</span>
          <span>→</span>
          <span className="text-purple-400 font-semibold">DECIDE</span>
          <span>→</span>
          <span className="text-amber-400 font-semibold">EXPERIMENT</span>
          <span>→</span>
          <span className="text-emerald-400 font-semibold">MEASURE</span>
          <span>→</span>
          <span className="text-cyan-400 font-semibold">LEARN</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
            Case Study: MetroMart & HSIC Bank
          </span>
        </div>
      </div>

      {/* Active Filter Notification Bar */}
      {isFilterApplied && (
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl px-4 py-2 flex items-center justify-between text-xs font-mono text-indigo-300">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cohort Filter Applied:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {appliedFiscalYear !== "All" && <span className="bg-indigo-900/80 px-2 py-0.5 rounded text-white border border-indigo-700/50">{appliedFiscalYear}</span>}
              {appliedMembership !== "All" && <span className="bg-amber-950/80 px-2 py-0.5 rounded text-amber-300 border border-amber-700/50">{appliedMembership}</span>}
              {appliedCategory !== "All" && <span className="bg-cyan-950/80 px-2 py-0.5 rounded text-cyan-300 border border-cyan-700/50">{appliedCategory}</span>}
              {appliedSegment !== "All" && <span className="bg-purple-950/80 px-2 py-0.5 rounded text-purple-300 border border-purple-700/50">{appliedSegment}</span>}
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Dynamically Calibrated View</span>
        </div>
      )}

      {/* Question 1: WHERE IS SHARE BEING LOST? */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-slate-900/90 border border-rose-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-rose-950/80 text-rose-400 border border-rose-700/50 flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" /> 1. WHERE IS SHARE BEING LOST?
            </span>
            <ClassificationBadge type="OBSERVED" />
          </div>
          <button
            onClick={() => setActivePage("sow")}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Deep Diagnostics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Portfolio Share-of-Wallet Collapsed by {Math.abs(kpis.sow_collapse_pp)} pp
            </h2>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-indigo-400 font-mono">FY25: {kpis.fy25_sow_pct}%</span>
              <span className="text-slate-500 text-xl font-mono">→</span>
              <span className="text-3xl font-black text-rose-400 font-mono">FY26: {kpis.fy26_sow_pct}%</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {executive_narrative}
            </p>
          </div>

          <div className="lg:col-span-7 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayMonthlyTrend}>
                <defs>
                  <linearGradient id="sowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickFormatter={(v) => `${v}%`} tickLine={false} domain={[12, 35]} />
                <Tooltip 
                  formatter={(val: any) => [`${val}%`, "HSIC SoW"]}
                  contentStyle={{ backgroundColor: "#0B0F19", borderColor: "#1F293D", borderRadius: "8px", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="sow_pct" stroke="#6366F1" strokeWidth={2.5} fill="url(#sowGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Question 2: WHO IS DRIVING IT? */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center">
              <Users className="w-3.5 h-3.5 mr-1 text-cyan-400" /> 2. WHO IS DRIVING IT?
            </span>
            <ClassificationBadge type="OBSERVED" />
          </div>
          <button
            onClick={() => setActivePage("customers")}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Inspect Customer 360</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => setActivePage("attrition")}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-orange-500/40 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider">Silent Defectors</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-orange-950 text-orange-300 border border-orange-700/40">[OBSERVED]</span>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">10,098</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customers active at MetroMart but exhibiting SoW decay &gt;15 pp.
            </p>
          </div>

          <div 
            onClick={() => setActivePage("big-ticket")}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-rose-500/40 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">Big-Ticket Shoppers</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-700/40">[OBSERVED]</span>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">14,850</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customers with basket &gt;₹5,000 where HSIC SoW is depressed to 11.20%.
            </p>
          </div>

          <div 
            onClick={() => setActivePage("prime-reward")}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-amber-500/40 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Prime Cardholders</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700/40">[OBSERVED]</span>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">19,423</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cardholders with unclaimed Prime cashback totaling ₹5.52M in FY26.
            </p>
          </div>
        </div>
      </div>

      {/* Question 3: WHY IS IT HAPPENING? */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center">
              <ArrowRightLeft className="w-3.5 h-3.5 mr-1 text-purple-400" /> 3. WHY IS IT HAPPENING?
            </span>
            <ClassificationBadge type="OBSERVED" />
          </div>
          <button
            onClick={() => setActivePage("migration")}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View Payment Flows</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Payment Mix Bars */}
          <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="text-xs font-semibold text-slate-300 mb-1">Payment Rail Spend Distribution (FY26 Net Spend)</div>
            {payment_mix.map((p: any) => (
              <div key={p.payment_method} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{p.payment_method}</span>
                  <span className="font-mono font-bold text-white">
                    {p.share_pct}% (₹{(p.net_spend/1e6).toFixed(1)}M)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700" 
                    style={{ 
                      width: `${p.share_pct}%`,
                      backgroundColor: paymentColors[p.payment_method] || "#94A3B8" 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Key root-cause callouts */}
          <div className="lg:col-span-4 space-y-3">
            <div className="p-4 rounded-xl border border-cyan-500/25 bg-cyan-950/20 text-xs space-y-1">
              <div className="font-bold text-cyan-300">Wallet & UPI Displacement</div>
              <p className="text-slate-300 leading-relaxed">
                MetroMart Wallet (35.68%) + UPI (23.40%) capture <strong>59.08%</strong> of basket spend, displacing card rails.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-500/25 bg-rose-950/20 text-xs space-y-1">
              <div className="font-bold text-rose-300">Big-Ticket Financing Gap</div>
              <p className="text-slate-300 leading-relaxed">
                HSIC SoW collapses from 19.48% overall to <strong>11.20%</strong> on purchases &gt;₹5,000 due to lack of 0% EMI financing.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-950/20 text-xs space-y-1">
              <div className="font-bold text-amber-300">Unclaimed Cashback Friction</div>
              <p className="text-slate-300 leading-relaxed">
                Prime members lose <strong>₹5,516,360.84</strong> by paying with alternative rails at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Question 4: WHAT SHOULD WE DO? (Opportunity Pipeline & Ranked NBAs) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center">
              <Target className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 4. WHAT SHOULD WE DO?
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/40 font-bold uppercase">
              MODELED RECAPTURABLE SPEND
            </span>
          </div>
          <button
            onClick={() => setActivePage("nba")}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Open Decision Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Modeled Pipeline Banner */}
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-5 mb-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
              Total Modeled Recapturable Spend (Not Guaranteed Revenue)
            </div>
            <div className="text-4xl font-black text-emerald-300 font-mono">₹51.25M</div>
            <p className="text-xs text-slate-400 mt-1">
              Across 4 targeted intervention levers · Assumes 18–25% conversion · Subject to experimental validation
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setActivePage("opportunities")}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Build Target Audience</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ranked 4 Next Best Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {priorityNBAs.map((nba) => (
            <div
              key={nba.id}
              onClick={() => setActivePage(nba.page)}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-indigo-500/40 transition-all cursor-pointer shadow-md flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-indigo-400">{nba.id}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-600/30">
                    {nba.tag}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{nba.name}</h4>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">{nba.target}</div>
              </div>

              <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-500 block">Modeled Spend:</span>
                  <span className="font-bold text-emerald-300">{nba.modeledSpend}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 block">Proj. ROI:</span>
                  <span className="font-bold text-cyan-300">{nba.roi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question 5: WHAT DID WE LEARN? (Experiment Results Summary) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center">
              <FlaskConical className="w-3.5 h-3.5 mr-1 text-cyan-400" /> 5. WHAT DID WE LEARN?
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-bold uppercase">
              EXPERIMENT BACKTEST EVALUATION
            </span>
          </div>
          <button
            onClick={() => setActivePage("experiments")}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Open Experiment Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Prime 1-Click Default Binding</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-600">
                SCALE
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Statistically significant SoW lift of <strong>+14.5 pp</strong> (p &lt; 0.01) with net positive campaign ROI of <strong>4.2x</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">0% POS Financing on Durables</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-300 border border-indigo-600">
                SCALE
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Overcomes Wallet preference on transactions &gt;₹5,000 with <strong>+22.0 pp</strong> lift and <strong>3.8x</strong> net ROI.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Early Decay Velocity Credit</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-900/80 text-amber-300 border border-amber-600">
                ITERATE
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reversed defection for 64% of cohort, but ₹250 voucher cost requires narrower targeting to reach target 3.5x ROI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
