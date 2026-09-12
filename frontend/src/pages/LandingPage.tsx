import React, { useState, useEffect } from 'react';
import { 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut, 
  UserButton 
} from '@clerk/clerk-react';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  Cpu,
  ChevronRight,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  PieChart,
  Terminal,
  Award,
  Clock,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import { BackgroundNetwork } from '../components/common/BackgroundNetwork';
import { TypewriterEffect } from '../components/common/TypewriterEffect';

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
  const [aiTyping, setAiTyping] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [simBudget, setSimBudget] = useState<number>(500000);
  const [simCashback, setSimCashback] = useState<number>(2.0);

  // AI Analyst Interactive Demo prompts
  const AI_PROMPTS = [
    {
      q: "Why did HSIC Share of Wallet contract by 9.43 pp in FY26?",
      a: "Empirical transaction auditing reveals that the -9.43 pp contraction (from 28.91% in FY25 to 19.48% in FY26) was driven by payment displacement toward MetroMart Wallet (48.6% of defected spend) and UPI (29.4%), particularly in high-ticket Electronics and Appliance transactions where Wallet captured 55.24% of volume.",
      taxonomy: "OBSERVED",
      metric: "₹48.1M displaced spend",
      rec: "Deploy category-boosted cashback on Electronics (3% → 5%) to re-anchor HSIC as the primary payment method."
    },
    {
      q: "What is the true revenue risk from Silent Defectors?",
      a: "Our attrition model identified 10,838 Silent Defectors representing ₹69,464,242.24 in annualized revenue at risk (t = 118.4, p < 0.001). These customers remain highly active at MetroMart but have completely ceased using their HSIC co-brand card.",
      taxonomy: "MODEL_DERIVED",
      metric: "10,838 customers at risk",
      rec: "Trigger automated Next-Best-Action reminders for forfeited Prime cashback (₹284 avg/customer)."
    },
    {
      q: "How much cashback are Prime cardholders forfeiting?",
      a: "Active Prime cardholders forfeited ₹5,516,360.84 across 19,423 customers by using non-HSIC payment rails on ₹331.2M of qualifying spend (₹2.23M forfeited in Electronics, ₹898K in Grocery).",
      taxonomy: "OBSERVED",
      metric: "₹5.52M forfeited rewards",
      rec: "Send immediate point-of-sale checkout prompts highlighting unearned rewards."
    }
  ];

  useEffect(() => {
    setAiTyping(true);
    setAiResponse('');
    const fullText = AI_PROMPTS[selectedPrompt].a;
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setAiResponse((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        setAiTyping(false);
        clearInterval(interval);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [selectedPrompt]);

  // Showcase Modules Data
  const SHOWCASE_MODULES = [
    {
      id: "sow",
      title: "Share of Wallet Intelligence",
      category: "Macro Diagnostics",
      badge: "OBSERVED",
      stat: "19.48%",
      statSub: "FY26 SoW (-9.43 pp)",
      desc: "Continuous temporal and category-level tracking of co-brand card spend versus total merchant basket across 444k+ transactions.",
      highlights: ["Fiscal Year & Quarterly Trendlines", "Category Penetration Decay", "Prime vs Non-Prime Disparity"]
    },
    {
      id: "migration",
      title: "Payment Migration Radar",
      category: "Defection Destinations",
      badge: "OBSERVED",
      stat: "48.6%",
      statSub: "Wallet Capture Share",
      desc: "Sankey flow mapping that reveals exactly which competing payment instruments (MetroMart Wallet, UPI, Other CCs, Debit) capture lost HSIC volume.",
      highlights: ["5-Instrument Displacement Matrix", "Big-Ticket Inversion (>₹9k)", "Defector Flow Velocity"]
    },
    {
      id: "attrition",
      title: "Silent Attrition Radar",
      category: "Predictive Risk",
      badge: "MODEL_DERIVED",
      stat: "10,838",
      statSub: "Silent Defectors (p < 0.001)",
      desc: "Detects customers who continue shopping at the retailer but quietly abandon the co-brand card long before formal card cancellation.",
      highlights: ["5-State Customer Lifecycle", "Statistically Verified Attrition", "Recency Deterioration Tracker"]
    },
    {
      id: "ml",
      title: "ML Risk Tournament",
      category: "Model Leaderboard",
      badge: "MODEL_DERIVED",
      stat: "0.9312",
      statSub: "Champion ROC-AUC (HGB)",
      desc: "Automated 5-model tournament (Hist Gradient Boosting, Random Forest, XGBoost, LogReg, Decision Tree) with full SHAP TreeExplainer interpretability.",
      highlights: ["5-Fold Cross Validation", "21 Engineered Behavioral Features", "SHAP Feature Attribution"]
    },
    {
      id: "survival",
      title: "Survival & Hazard Engine",
      category: "Tenure Projection",
      badge: "MODEL_DERIVED",
      stat: "0.6229",
      statSub: "Cox Concordance Index",
      desc: "Parametric and non-parametric survival analysis evaluating time-to-attrition hazards across all 5 customer behavioral archetypes.",
      highlights: ["Kaplan-Meier Retention Curves", "Cox Proportional Hazards", "Segment-Specific Median Survival"]
    },
    {
      id: "nba",
      title: "Next-Best-Action (NBA) Engine",
      category: "Intervention Engine",
      badge: "ESTIMATED",
      stat: "₹71.01M",
      statSub: "Total Revenue Recoverable",
      desc: "Customer-level intervention recommendation engine ranking personalized treatments by Expected Net Contribution.",
      highlights: ["Persuadability & Uplift Scoring", "Prime Cashback Reminders", "Disciplined 'No Action' Policy"]
    },
    {
      id: "simulator",
      title: "Margin Bleed & Profit Simulator",
      category: "Economic Decisioning",
      badge: "HYPOTHETICAL",
      stat: "3.42x",
      statSub: "Estimated Portfolio ROI",
      desc: "Real-time mathematical budget allocator optimizing campaign spend while preventing unprofitable over-discounting.",
      highlights: ["Custom Budget Constraints", "Cashback Boost Sensitivity", "Net Margin Protection"]
    },
    {
      id: "governance",
      title: "Data Governance & Audit",
      category: "Enterprise Trust",
      badge: "OBSERVED",
      stat: "100.0%",
      statSub: "5-Dimension Quality Index",
      desc: "Automated data verification auditing completeness, validity, uniqueness, consistency, and temporal integrity with CSV formula injection defense.",
      highlights: ["5-Dimension Quality Audit", "Dynamic Multi-Year Ingestion", "Complete Lineage Logging"]
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-indigo-500/25 selection:text-indigo-200 overflow-x-hidden">
      
      {/* Interactive Neural Particle Constellation Background */}
      <BackgroundNetwork particleCount={55} interactive={true} />

      {/* Dynamic Laser Grid & Radial Aurora Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial-gradient bg-grid-pattern opacity-70" />
      
      {/* 1. TOP ANNOUNCEMENT & NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090E]/85 border-b border-[#1E263B]/80 shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* World-Class Brand Logo */}
          <a href="#" className="flex items-center group">
            <BrandLogo size="md" />
          </a>

          {/* Nav Anchors */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#problem" className="hover:text-white transition-colors">The Paradox</a>
            <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
            <a href="#showcase" className="hover:text-white transition-colors">Intelligence</a>
            <a href="#architecture" className="hover:text-white transition-colors">ML Architecture</a>
            <a href="#economics" className="hover:text-white transition-colors">Economics</a>
            <a href="#analyst" className="hover:text-white transition-colors">AI Analyst</a>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-slate-800/60 transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-medium bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-4 py-2 rounded-lg shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]">
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <a 
                href="/dashboard" 
                className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>Launch App</span>
                <Maximize2 className="w-3.5 h-3.5" />
              </a>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden">
        
        {/* Ambient Pulsing Light Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-600/15 via-cyan-500/10 to-violet-600/15 blur-[150px] pointer-events-none rounded-full animate-pulse-subtle" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 shadow-lg shadow-indigo-950/40 text-xs font-medium text-slate-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 font-semibold">
                SYNCHRONY ANALYTICS 2026 · SHARE OF WALLET RECOVERY
              </span>
            </div>
          </div>

          {/* Master Headline with Live Typewriter Animation */}
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] mb-6 min-h-[160px] sm:min-h-[190px] lg:min-h-[220px]">
              See where your customers are going <br className="hidden sm:inline" />
              <TypewriterEffect 
                words={[
                  "before your revenue follows.",
                  "before your share of wallet collapses.",
                  "before silent defection happens.",
                  "before competitors capture them.",
                  "before margins bleed away."
                ]}
                className="mt-2 block sm:inline"
              />
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
              SharePulse AI transforms raw multi-channel transactions into early silent attrition detection, payment displacement dynamics, and precision profit-optimized interventions.
            </p>
          </div>

          {/* Floating Pill Telemetry Indicators */}
          <div className="hidden lg:flex justify-between items-center max-w-5xl mx-auto px-4 mb-10 pointer-events-none">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 shadow-xl backdrop-blur-md animate-float">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Quality Score · 444k Txns</span>
            </div>

            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 shadow-xl backdrop-blur-md animate-float" style={{ animationDelay: '2s' }}>
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>0.9312 Champion ROC-AUC (Hist Gradient Boosting)</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto text-base font-semibold bg-white hover:bg-slate-100 text-slate-950 px-8 py-3.5 rounded-xl shadow-xl shadow-white/10 transition-all flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98]">
                  <span>Start Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <a 
                href="/dashboard"
                className="w-full sm:w-auto text-base font-semibold bg-white hover:bg-slate-100 text-slate-950 px-8 py-3.5 rounded-xl shadow-xl shadow-white/10 transition-all flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Enter Enterprise Console</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </SignedIn>

            <a 
              href="#showcase" 
              className="w-full sm:w-auto text-base font-medium text-slate-300 hover:text-white px-7 py-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2 backdrop-blur-md hover:bg-slate-800/80"
            >
              <span>Explore Live Intelligence</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </a>
          </div>

          {/* 3. HERO COMMAND-CENTER VISUALIZATION */}
          <div className="relative mx-auto max-w-6xl rounded-2xl bg-gradient-to-b from-[#1E263B] to-[#0C0F17] p-[1px] shadow-2xl shadow-indigo-950/50">
            <div className="rounded-[15px] bg-[#0C0F17] p-4 sm:p-7 overflow-hidden">
              
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#1E263B]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">sharepulse.enterprise.internal/live-telemetry</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 45,000 Cardholders Audited
                  </span>
                  <span className="hidden sm:inline text-slate-600">|</span>
                  <span className="hidden sm:inline">444,118 Transactions</span>
                </div>
              </div>

              {/* Top 4 Real Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                <div className="p-4 rounded-xl bg-[#111622] border border-[#1E263B]">
                  <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
                    <span>Active Cardholder SoW</span>
                    <span className="text-xs font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900/50">-9.43 pp</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-display text-white">19.48%</div>
                  <div className="text-[11px] text-slate-500 mt-1">Down from 28.91% in FY25</div>
                </div>

                <div className="p-4 rounded-xl bg-[#111622] border border-[#1E263B]">
                  <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
                    <span>Revenue at Risk</span>
                    <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-900/50">Defection</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-display text-amber-400">₹71.01M</div>
                  <div className="text-[11px] text-slate-500 mt-1">10,838 Silent Defectors identified</div>
                </div>

                <div className="p-4 rounded-xl bg-[#111622] border border-[#1E263B]">
                  <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
                    <span>Tournament Champion</span>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-900/50">5 Models</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-display text-cyan-400">0.9312</div>
                  <div className="text-[11px] text-slate-500 mt-1">Hist Gradient Boosting ROC-AUC</div>
                </div>

                <div className="p-4 rounded-xl bg-[#111622] border border-[#1E263B]">
                  <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
                    <span>Prime Cashback Forfeited</span>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-900/50">19.4k Users</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-display text-indigo-400">₹5.52M</div>
                  <div className="text-[11px] text-slate-500 mt-1">₹331.2M non-HSIC Prime spend</div>
                </div>

              </div>

              {/* Data Flow Visualization */}
              <div className="p-5 rounded-xl bg-[#111622] border border-[#1E263B]">
                <div className="text-xs font-mono text-slate-400 mb-3 flex items-center justify-between">
                  <span>LIVE INTELLIGENCE FLOW TELEMETRY</span>
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-time Pipeline
                  </span>
                </div>

                {/* Animated Pipeline Nodes */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
                  
                  <div className="p-3 rounded-lg bg-[#171E2E] border border-slate-700/50">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">01. INGESTION</div>
                    <div className="text-xs font-semibold text-white">444k Txns</div>
                    <div className="text-[10px] text-slate-500 mt-1">Multi-Channel Streams</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#171E2E] border border-slate-700/50">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">02. SIGNALS</div>
                    <div className="text-xs font-semibold text-indigo-300">21 Features</div>
                    <div className="text-[10px] text-slate-500 mt-1">SoW · Velocity · Recency</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#171E2E] border border-slate-700/50">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">03. DISCOVERY</div>
                    <div className="text-xs font-semibold text-amber-300">₹48.1M Leak</div>
                    <div className="text-[10px] text-slate-500 mt-1">Wallet & UPI Drift</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#171E2E] border border-slate-700/50">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">04. ML RISK</div>
                    <div className="text-xs font-semibold text-rose-300">10.8k Attrited</div>
                    <div className="text-[10px] text-slate-500 mt-1">SHAP Interpreted</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#171E2E] border border-slate-700/50">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">05. SEGMENTS</div>
                    <div className="text-xs font-semibold text-cyan-300">5 Archetypes</div>
                    <div className="text-[10px] text-slate-500 mt-1">K-Means Validated</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#171E2E] border border-emerald-800/40 bg-emerald-950/20">
                    <div className="text-[11px] font-mono text-emerald-400 mb-1">06. NEXT ACTION</div>
                    <div className="text-xs font-semibold text-emerald-300">ROI-Optimized</div>
                    <div className="text-[10px] text-emerald-500/80 mt-1">Zero Margin Bleed</div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. THE CORE PROBLEM — SILENT SPEND MIGRATION */}
      <section id="problem" className="py-24 border-t border-[#1E263B] bg-[#090C12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <div className="text-xs font-mono text-indigo-400 tracking-wider uppercase mb-3">THE CORE ENTERPRISE PARADOX</div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
              Your customers don't disappear.<br />
              <span className="text-slate-400">They quietly change how they pay.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              Traditional churn models only flag customers when they stop shopping altogether. In retail co-brand portfolios, cardholders remain highly active at the merchant while silently diverting 100% of their spending to proprietary wallets and instant payments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: The Displacement Flow */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="p-5 rounded-xl bg-[#0C0F17] border border-[#1E263B] hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="font-semibold text-white text-sm">HSIC Co-Brand Credit Card</span>
                  </div>
                  <span className="text-xs font-mono text-rose-400">-9.43 pp Contraction</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Historical share contracted from 28.91% in FY25 to 19.48% in FY26. Displaced cardholders represent ₹69.46M in abandoned co-brand volume.
                </p>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '19.48%' }} />
                </div>
              </div>

              {/* Competing Destinations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl bg-[#0C0F17] border border-[#1E263B]">
                  <div className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>MetroMart Wallet</span>
                    <span className="text-xs font-mono text-emerald-400">48.6% Capture</span>
                  </div>
                  <div className="text-xl font-bold text-white font-display">₹23.4M Gained</div>
                  <p className="text-[11px] text-slate-500 mt-1">Surges from 40.87% to 55.24% in ₹9k+ big-ticket baskets.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0C0F17] border border-[#1E263B]">
                  <div className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>Cash & Instant UPI</span>
                    <span className="text-xs font-mono text-emerald-400">29.4% Capture</span>
                  </div>
                  <div className="text-xl font-bold text-white font-display">₹14.1M Gained</div>
                  <p className="text-[11px] text-slate-500 mt-1">High frequency, everyday grocery & routine checkout displacement.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0C0F17] border border-[#1E263B]">
                  <div className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>Other Bank Credit Cards</span>
                    <span className="text-xs font-mono text-slate-400">14.2% Capture</span>
                  </div>
                  <div className="text-xl font-bold text-white font-display">₹6.8M Gained</div>
                  <p className="text-[11px] text-slate-500 mt-1">Competitor bank promotions capturing high-margin categories.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0C0F17] border border-[#1E263B]">
                  <div className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>Debit Cards</span>
                    <span className="text-xs font-mono text-slate-400">7.8% Capture</span>
                  </div>
                  <div className="text-xl font-bold text-white font-display">₹3.7M Gained</div>
                  <p className="text-[11px] text-slate-500 mt-1">Risk-averse shoppers shifting away from revolving credit.</p>
                </div>

              </div>

            </div>

            {/* Right: Big-Ticket Basket Inversion Insight */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#111622] border border-[#1E263B]">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium mb-4">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Empirical Discovery: Basket Inversion</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">
                Big-Ticket Wallet Inversion
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                Contrary to the industry assumption that credit cards dominate large transactions, MetroMart Wallet share scales from 40.87% (at ₹1k) to a staggering <strong className="text-white">55.24% in ₹9k+ transactions</strong>, while HSIC stays trapped at ~14-15%.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>₹1,000 Tier Wallet Share</span>
                    <span className="text-white">40.87%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-500 h-full rounded-full" style={{ width: '40.87%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>₹5,000 Tier Wallet Share</span>
                    <span className="text-amber-400">47.31%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '47.31%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>₹9,000+ Tier Wallet Share</span>
                    <span className="text-rose-400 font-bold">55.24%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '55.24%' }} />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. 7-STAGE ENTERPRISE DATA INTELLIGENCE PIPELINE */}
      <section id="pipeline" className="py-24 border-t border-[#1E263B] bg-[#07090E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono text-indigo-400 tracking-wider uppercase mb-3">END-TO-END PIPELINE</div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              From Raw Transactions to Measurable Net ROI
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Every data point flows through seven deterministic and machine learning stages with 100% provenance and zero synthetic hallucinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-6 rounded-xl bg-[#0C0F17] border border-[#1E263B] hover:border-indigo-500/50 transition-all">
              <div className="text-xs font-mono text-indigo-400 mb-2">STAGE 01</div>
              <h3 className="text-lg font-bold text-white mb-2">Data Quality & Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                5-dimension verification (Completeness, Validity, Uniqueness, Consistency, Timeliness) achieving a verified 100% quality score.
              </p>
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 444,118 Txns Ingested
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0C0F17] border border-[#1E263B] hover:border-indigo-500/50 transition-all">
              <div className="text-xs font-mono text-indigo-400 mb-2">STAGE 02</div>
              <h3 className="text-lg font-bold text-white mb-2">Feature Engineering</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Extracts 21 behavioral signals per customer: historical SoW, velocity, recency gaps, category affinity, and return frequency.
              </p>
              <div className="text-xs font-mono text-indigo-300 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> 21 Predictive Signals
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0C0F17] border border-[#1E263B] hover:border-indigo-500/50 transition-all">
              <div className="text-xs font-mono text-indigo-400 mb-2">STAGE 03</div>
              <h3 className="text-lg font-bold text-white mb-2">Tournament ML</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Benchmarks 5 classifiers under 5-fold cross validation. Champion Hist Gradient Boosting achieves 0.9312 ROC-AUC.
              </p>
              <div className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> 0.9312 Champion AUC
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0C0F17] border border-[#1E263B] hover:border-indigo-500/50 transition-all">
              <div className="text-xs font-mono text-indigo-400 mb-2">STAGE 04</div>
              <h3 className="text-lg font-bold text-white mb-2">SHAP Interpretability</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                TreeExplainer quantifies exact feature contributions for each prediction: FY25 SoW (0.2105) and FY25 HSIC Spend (0.1066) lead.
              </p>
              <div className="text-xs font-mono text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Exact SHAP Values
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0C0F17] border border-[#1E263B] hover:border-indigo-500/50 transition-all">
              <div className="text-xs font-mono text-indigo-400 mb-2">STAGE 05</div>
              <h3 className="text-lg font-bold text-white mb-2">Survival Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Kaplan-Meier retention curves and Cox Proportional Hazards (C-index 0.6229) modeling cardholder lifetime risk.
              </p>
              <div className="text-xs font-mono text-purple-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Cox & Kaplan-Meier
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0C0F17] border border-[#1E263B] hover:border-indigo-500/50 transition-all">
              <div className="text-xs font-mono text-indigo-400 mb-2">STAGE 06</div>
              <h3 className="text-lg font-bold text-white mb-2">K-Means Archetypes</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                5 validated behavioral clusters (High-Value Multi-Channel, Wallet Dominant, Core Loyalists, Cash/UPI, Dormant).
              </p>
              <div className="text-xs font-mono text-blue-400 flex items-center gap-1">
                <PieChart className="w-3.5 h-3.5" /> k=5 Optimal Clusters
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0C0F17] border border-[#1E263B] hover:border-indigo-500/50 transition-all">
              <div className="text-xs font-mono text-indigo-400 mb-2">STAGE 07</div>
              <h3 className="text-lg font-bold text-white mb-2">Next Best Action</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Generates individual customer interventions, enforcing negative expected value rejection to eliminate margin bleed.
              </p>
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Capital-Disciplined
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#111622] border border-emerald-800/50 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-emerald-400 mb-2">FINAL OUTPUT</div>
                <h3 className="text-lg font-bold text-white mb-2">Measurable Net Value</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Clear financial recovery: ₹71.01M in identified risk with targeted ROI projections.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-900/40 text-xs font-mono text-emerald-400 font-bold">
                ✓ 100% PRODUCTION VERIFIED
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. PRODUCT INTELLIGENCE SHOWCASE (8 CORE MODULES) */}
      <section id="showcase" className="py-24 border-t border-[#1E263B] bg-[#090C12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-mono text-indigo-400 tracking-wider uppercase mb-3">PRODUCT INTELLIGENCE SHOWCASE</div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Eight Specialized Analytical Engines
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md mt-4 md:mt-0">
              Explore the dedicated analytical subsystems powering executive decision-making across the SharePulse platform.
            </p>
          </div>

          {/* Module Selector Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {SHOWCASE_MODULES.map((mod, idx) => (
              <button
                key={mod.id}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  activeTab === idx
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                    : 'bg-[#0C0F17] text-slate-400 border-[#1E263B] hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{`0${idx + 1}`}</span>
                <span>{mod.title}</span>
              </button>
            ))}
          </div>

          {/* Active Module Display */}
          {(() => {
            const current = SHOWCASE_MODULES[activeTab];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Left: Module Details */}
                <div className="lg:col-span-5 p-8 rounded-2xl bg-[#0C0F17] border border-[#1E263B] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-indigo-400 uppercase">{current.category}</span>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {current.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                      {current.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      {current.desc}
                    </p>

                    <div className="space-y-2 mb-8">
                      <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Key Capabilities</div>
                      {current.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#111622] border border-[#1E263B]">
                    <div className="text-xs text-slate-400 mb-1">Key Empirical Signal</div>
                    <div className="text-2xl font-bold text-white font-display">{current.stat}</div>
                    <div className="text-xs text-indigo-400 mt-0.5">{current.statSub}</div>
                  </div>
                </div>

                {/* Right: Interactive UI Preview */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0C0F17] border border-[#1E263B] flex flex-col justify-center">
                  <div className="rounded-xl bg-[#111622] border border-[#1E263B] p-5">
                    
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1E263B]">
                      <span className="text-xs font-mono text-slate-400">ENGINE_MODULE // {current.id.toUpperCase()}</span>
                      <span className="text-xs font-mono text-emerald-400">STATUS: CALIBRATED</span>
                    </div>

                    {/* Dynamic Simulated Preview Based on Selected Tab */}
                    {activeTab === 0 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xs text-slate-400">FY25 Co-Brand Share</div>
                            <div className="text-xl font-bold text-indigo-400">28.91%</div>
                          </div>
                          <div className="text-center font-mono text-xs text-rose-400 font-bold">
                            ↓ -9.43 pp
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-400">FY26 Co-Brand Share</div>
                            <div className="text-xl font-bold text-slate-300">19.48%</div>
                          </div>
                        </div>
                        <div className="space-y-2 pt-2">
                          <div className="text-xs text-slate-400 flex justify-between">
                            <span>Electronics Category SoW</span>
                            <span className="text-rose-400 font-mono">14.2% (-11.8 pp)</span>
                          </div>
                          <div className="text-xs text-slate-400 flex justify-between">
                            <span>Grocery Category SoW</span>
                            <span className="text-amber-400 font-mono">22.8% (-6.4 pp)</span>
                          </div>
                          <div className="text-xs text-slate-400 flex justify-between">
                            <span>Apparel Category SoW</span>
                            <span className="text-indigo-400 font-mono">24.1% (-4.1 pp)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 1 && (
                      <div className="space-y-3">
                        <div className="text-xs text-slate-400 mb-2">Defected HSIC Volume Leakage Routing</div>
                        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex justify-between items-center text-xs">
                          <span className="text-slate-300">MetroMart Proprietary Wallet</span>
                          <span className="font-mono text-emerald-400 font-bold">₹23,412,890 (48.6%)</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex justify-between items-center text-xs">
                          <span className="text-slate-300">Instant Cash & UPI</span>
                          <span className="font-mono text-indigo-300 font-bold">₹14,142,100 (29.4%)</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex justify-between items-center text-xs">
                          <span className="text-slate-300">Other Bank Credit Cards</span>
                          <span className="font-mono text-slate-400 font-bold">₹6,831,450 (14.2%)</span>
                        </div>
                      </div>
                    )}

                    {activeTab === 2 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Silent Defection Statistical Significance</span>
                          <span className="text-xs font-mono text-emerald-400">t = 118.4, p = 0.000</span>
                        </div>
                        <div className="p-3 rounded bg-rose-950/20 border border-rose-900/40 text-xs text-rose-300">
                          10,838 cardholders show regular monthly grocery/electronics store visits with 0 HSIC transactions over the last 90 days.
                        </div>
                      </div>
                    )}

                    {activeTab === 3 && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-center text-slate-400">
                          <span>Top Tournament Classifier</span>
                          <span className="text-emerald-400 font-bold">Hist Gradient Boosting (0.9312 AUC)</span>
                        </div>
                        <div className="p-3 rounded bg-slate-900/70 border border-slate-800 flex justify-between">
                          <span className="text-slate-400">1. FY25_SoW</span>
                          <span className="text-indigo-400 font-bold">SHAP: 0.2105 (Primary Retention Signal)</span>
                        </div>
                        <div className="p-3 rounded bg-slate-900/70 border border-slate-800 flex justify-between">
                          <span className="text-slate-400">2. FY25_HSIC</span>
                          <span className="text-indigo-400 font-bold">SHAP: 0.1066 (Co-brand Base Volume)</span>
                        </div>
                        <div className="p-3 rounded bg-slate-900/70 border border-slate-800 flex justify-between">
                          <span className="text-slate-400">3. HSIC_Recency</span>
                          <span className="text-amber-400 font-bold">SHAP: 0.0751 (Inactivity Velocity)</span>
                        </div>
                      </div>
                    )}

                    {activeTab === 4 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Cox Proportional Hazards Model</span>
                          <span className="text-purple-400 font-mono font-bold">Concordance Index: 0.6229</span>
                        </div>
                        <div className="p-3 rounded bg-slate-900/70 border border-slate-800 space-y-2 text-xs">
                          <div className="flex justify-between text-slate-300">
                            <span>High-Value Multi-Channel Median Tenure</span>
                            <span className="font-mono text-emerald-400">38.4 Months</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Wallet Dominant Shoppers Median Tenure</span>
                            <span className="font-mono text-amber-400">19.2 Months</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Dormant Shoppers Median Tenure</span>
                            <span className="font-mono text-rose-400">8.1 Months</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 5 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Customer Intervention Recommendation</span>
                          <span className="text-emerald-400 font-mono">Uplift Confidence: 94.2%</span>
                        </div>
                        <div className="p-3 rounded bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                          <div className="font-semibold text-white">Target: Cardholder #CUST_10482 (High-Value Prime)</div>
                          <div className="text-slate-400">Signal: Displaced ₹18.5k in Electronics to MetroMart Wallet.</div>
                          <div className="text-indigo-300 font-mono">Action: ₹350 instant cashback reminder on next electronics swipe.</div>
                        </div>
                      </div>
                    )}

                    {activeTab === 6 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 flex items-center gap-1.5 font-semibold text-white">
                            <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Interactive Campaign Optimizer
                          </span>
                          <span className="text-xs font-mono text-emerald-400 font-bold">
                            {(3.42 * (simCashback / 2.0)).toFixed(2)}x Projected ROI
                          </span>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-3 pt-1 text-xs">
                          <div>
                            <div className="flex justify-between text-slate-300 mb-1">
                              <span>Campaign Budget</span>
                              <span className="font-mono text-indigo-400 font-bold">₹{simBudget.toLocaleString('en-IN')}</span>
                            </div>
                            <input 
                              type="range" 
                              min="100000" 
                              max="2000000" 
                              step="50000" 
                              value={simBudget}
                              onChange={(e) => setSimBudget(Number(e.target.value))}
                              className="w-full accent-indigo-500 cursor-pointer"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-slate-300 mb-1">
                              <span>Cashback Boost Incentive</span>
                              <span className="font-mono text-emerald-400 font-bold">+{simCashback.toFixed(1)}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="1.0" 
                              max="5.0" 
                              step="0.5" 
                              value={simCashback}
                              onChange={(e) => setSimCashback(Number(e.target.value))}
                              className="w-full accent-emerald-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Real-time Dynamic Yield */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                            <div className="text-[10px] text-slate-400">Targeted Cardholders</div>
                            <div className="text-white font-bold">{Math.round(simBudget / (simCashback * 150 + 200)).toLocaleString()} Users</div>
                          </div>
                          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                            <div className="text-[10px] text-slate-400">Estimated Gross Recovery</div>
                            <div className="text-emerald-400 font-bold">₹{Math.round(simBudget * 3.42 * (simCashback / 2.0)).toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 7 && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Automated 5-Dimension Audit</span>
                          <span className="text-emerald-400 font-bold">100.0% QUALITY SCORE</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">✓ Completeness: 100%</div>
                          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">✓ Validity: 100%</div>
                          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">✓ Uniqueness: 100%</div>
                          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">✓ Temporal Consistency: 100%</div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* 7. MACHINE LEARNING ARCHITECTURE */}
      <section id="architecture" className="py-24 border-t border-[#1E263B] bg-[#07090E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <div className="text-xs font-mono text-indigo-400 tracking-wider uppercase mb-3">MACHINE LEARNING TOURNAMENT</div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
              Automated Classifier Tournament & Explainability
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              We benchmark five distinct machine learning model architectures on 45,000 customers under 5-fold cross-validation. The winning champion model is explained through empirical SHAP TreeExplainer attribution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Tournament Leaderboard Table */}
            <div className="lg:col-span-7 rounded-2xl bg-[#0C0F17] border border-[#1E263B] overflow-hidden">
              <div className="p-5 border-b border-[#1E263B] flex justify-between items-center">
                <span className="text-xs font-mono font-semibold text-white">MODEL BENCHMARK LEADERBOARD</span>
                <span className="text-xs font-mono text-indigo-400">5-FOLD CV</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#111622] text-slate-400 border-b border-[#1E263B]">
                    <tr>
                      <th className="py-3 px-4">Rank & Model</th>
                      <th className="py-3 px-4">ROC-AUC</th>
                      <th className="py-3 px-4">F1-Score</th>
                      <th className="py-3 px-4">Brier</th>
                      <th className="py-3 px-4">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E263B] text-slate-300">
                    <tr className="bg-indigo-950/20 font-bold text-white">
                      <td className="py-3.5 px-4 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-[10px] text-slate-950 flex items-center justify-center">1</span>
                        <span>Hist Gradient Boosting</span>
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400">0.9312</td>
                      <td className="py-3.5 px-4">0.8641</td>
                      <td className="py-3.5 px-4 text-emerald-400">0.0612</td>
                      <td className="py-3.5 px-4 text-indigo-300">Champion</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] text-slate-400 flex items-center justify-center">2</span>
                        <span>Random Forest (100 Trees)</span>
                      </td>
                      <td className="py-3.5 px-4">0.9274</td>
                      <td className="py-3.5 px-4">0.8589</td>
                      <td className="py-3.5 px-4">0.0638</td>
                      <td className="py-3.5 px-4 text-slate-500">Benchmark</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] text-slate-400 flex items-center justify-center">3</span>
                        <span>XGBoost (GBDT)</span>
                      </td>
                      <td className="py-3.5 px-4">0.9258</td>
                      <td className="py-3.5 px-4">0.8562</td>
                      <td className="py-3.5 px-4">0.0649</td>
                      <td className="py-3.5 px-4 text-slate-500">Benchmark</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] text-slate-400 flex items-center justify-center">4</span>
                        <span>Logistic Regression (L2)</span>
                      </td>
                      <td className="py-3.5 px-4">0.8741</td>
                      <td className="py-3.5 px-4">0.7920</td>
                      <td className="py-3.5 px-4">0.0984</td>
                      <td className="py-3.5 px-4 text-slate-500">Baseline</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] text-slate-400 flex items-center justify-center">5</span>
                        <span>Decision Tree (Depth 8)</span>
                      </td>
                      <td className="py-3.5 px-4">0.8410</td>
                      <td className="py-3.5 px-4">0.7652</td>
                      <td className="py-3.5 px-4">0.1245</td>
                      <td className="py-3.5 px-4 text-slate-500">Interpretability</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SHAP TreeExplainer Rankings */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0C0F17] border border-[#1E263B]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold text-white">TOP SHAP EXPLAINABILITY SIGNALS</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-900 text-indigo-300">TreeExplainer</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Mean absolute SHAP value impact on predicting cardholder attrition:
              </p>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>1. Historical FY25 Share of Wallet</span>
                    <span className="text-indigo-400 font-bold">0.2105</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>2. Historical FY25 HSIC Spend</span>
                    <span className="text-indigo-400 font-bold">0.1066</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '50.6%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>3. HSIC Recency Days Gap</span>
                    <span className="text-indigo-400 font-bold">0.0751</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '35.7%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>4. Overall Customer Spend Volume</span>
                    <span className="text-indigo-400 font-bold">0.0097</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>5. MetroMart Wallet Share Velocity</span>
                    <span className="text-indigo-400 font-bold">0.0067</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '9%' }} />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 8. PROFIT OPTIMIZATION & NEXT-BEST ACTION (NBA) */}
      <section id="economics" className="py-24 border-t border-[#1E263B] bg-[#090C12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <div className="text-xs font-mono text-indigo-400 tracking-wider uppercase mb-3">ECONOMIC DECISION FRAMEWORK</div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
              Don't optimize for engagement.<br />
              <span className="text-slate-400">Optimize for incremental net value.</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Most churn tools blindly distribute expensive discounts. SharePulse computes the exact net economic yield of every customer intervention and enforces a strict <strong className="text-white">"NO ACTION"</strong> policy when expected recovery is negative.
            </p>
          </div>

          {/* Mathematical Equation Card */}
          <div className="p-8 rounded-2xl bg-[#0C0F17] border border-[#1E263B] mb-12">
            <div className="text-xs font-mono text-indigo-400 mb-4 uppercase">THE NET VALUE EQUATION</div>
            <div className="font-mono text-sm sm:text-lg text-white bg-[#111622] p-5 rounded-xl border border-[#1E263B] overflow-x-auto text-center">
              Expected Net Contribution = (Recovered Spend × Margin) - Reward Cost - Intervention Friction
            </div>
          </div>

          {/* Scenario Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-xl bg-[#0C0F17] border border-emerald-800/40">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-emerald-400">HIGH YIELD INTERVENTION</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">Approved</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Prime Electronics Incentive</h4>
              <p className="text-xs text-slate-400 mb-4">
                Targeting Prime cardholders with high basket size (over ₹5,000) forfeiting rewards.
              </p>
              <div className="space-y-1.5 font-mono text-xs pt-3 border-t border-[#1E263B]">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Recovery:</span>
                  <span className="text-white">₹4,250</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reward Cost:</span>
                  <span className="text-rose-400">-₹120</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-slate-800">
                  <span>Net Contribution:</span>
                  <span>+₹4,130</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0C0F17] border border-emerald-800/40">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-emerald-400">RETENTION ACTION</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">Approved</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Grocery Recurring Cashback</h4>
              <p className="text-xs text-slate-400 mb-4">
                Targeting weekly grocery transactors who shifted routine swipes to UPI.
              </p>
              <div className="space-y-1.5 font-mono text-xs pt-3 border-t border-[#1E263B]">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Recovery:</span>
                  <span className="text-white">₹1,850</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reward Cost:</span>
                  <span className="text-rose-400">-₹75</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-slate-800">
                  <span>Net Contribution:</span>
                  <span>+₹1,775</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0C0F17] border border-rose-900/40 bg-rose-950/10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-rose-400">DISCIPLINED FILTER</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300">NO ACTION</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Low-Tenure Dormant Churn</h4>
              <p className="text-xs text-slate-400 mb-4">
                Customers with negligible historical basket size and extreme churn probability.
              </p>
              <div className="space-y-1.5 font-mono text-xs pt-3 border-t border-[#1E263B]">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Recovery:</span>
                  <span className="text-slate-400">₹80</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Incentive Cost:</span>
                  <span className="text-rose-400">-₹150</span>
                </div>
                <div className="flex justify-between font-bold text-rose-400 pt-1 border-t border-slate-800">
                  <span>Net Contribution:</span>
                  <span>-₹70 (Bleed)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. AI ANALYST INTERACTIVE DEMO */}
      <section id="analyst" className="py-24 border-t border-[#1E263B] bg-[#07090E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-mono text-indigo-400 tracking-wider uppercase mb-3">AI ANALYST & NATURAL LANGUAGE QUERY</div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
              Grounded AI Dialogue with 100% Provenance
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Query your data in plain English. The AI Analyst synthesizes real mathematical engines with multi-tiered taxonomy tagging.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Prompt Selector */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase mb-2">Select an Executive Question:</div>
              {AI_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPrompt(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs transition-all ${
                    selectedPrompt === idx
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                      : 'bg-[#0C0F17] border-[#1E263B] text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold mb-1 flex items-center justify-between">
                    <span>{`Question 0${idx + 1}`}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.taxonomy}
                    </span>
                  </div>
                  <div className="line-clamp-2">{item.q}</div>
                </button>
              ))}
            </div>

            {/* Terminal Response */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0C0F17] border border-[#1E263B] font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1E263B]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-300 font-semibold">SHAREPULSE_AI_ANALYST_REPL</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>3-TIER GATEWAY</span>
                  <span>·</span>
                  <span className="text-emerald-400">GROUNDED EVIDENCE</span>
                </div>
              </div>

              <div className="space-y-4">
                
                <div className="p-3 rounded bg-[#111622] text-slate-300">
                  <span className="text-indigo-400 font-bold">EXECUTIVE QUERY &gt; </span>
                  <span>{AI_PROMPTS[selectedPrompt].q}</span>
                </div>

                <div className="p-4 rounded bg-[#111622] border border-[#1E263B] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> AI SYNTHESIS
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-800">
                      {AI_PROMPTS[selectedPrompt].taxonomy}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-sm">
                    {aiResponse}
                    {aiTyping && <span className="inline-block w-2 h-4 bg-indigo-400 ml-1 animate-pulse" />}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded bg-[#171E2E] border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Supporting Empirical Proof</div>
                    <div className="text-xs font-bold text-white mt-0.5 font-mono">{AI_PROMPTS[selectedPrompt].metric}</div>
                  </div>
                  <div className="p-3 rounded bg-emerald-950/20 border border-emerald-900/40">
                    <div className="text-[10px] text-emerald-400 uppercase">Recommended Next-Best Action</div>
                    <div className="text-xs font-medium text-emerald-200 mt-0.5 font-sans">{AI_PROMPTS[selectedPrompt].rec}</div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 10. ENTERPRISE TRUST & DATASET FLEXIBILITY */}
      <section className="py-24 border-t border-[#1E263B] bg-[#090C12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono text-indigo-400 tracking-wider uppercase mb-3">ENTERPRISE CREDIBILITY & GOVERNANCE</div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Built for Regulatory Audit & Multi-Year Flexibility
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              SharePulse is not a static case study dashboard. It is an enterprise platform engineered to ingest arbitrary 2, 3, or 4-year retail banking datasets with automatic schema normalization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-xl bg-[#0C0F17] border border-[#1E263B]">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Zero Secret Exposure</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full client bundle verification guarantees zero backend API keys (`GEMINI_API_KEY`, `OPENROUTER_API_KEY`) are leaked to the browser.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0C0F17] border border-[#1E263B]">
              <Database className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Dynamic Schema Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload custom multi-year CSVs. The engine automatically maps column variants, validates temporal boundaries, and scales feature stores.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0C0F17] border border-[#1E263B]">
              <Lock className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">CSV Injection Defense</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All data export endpoints automatically sanitize untrusted inputs against spreadsheet formula injection attacks (`=`, `+`, `-`, `@`).
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 11. FINAL HEROIC CTA */}
      <section className="py-24 border-t border-[#1E263B] bg-gradient-to-b from-[#090C12] via-[#0C0F17] to-[#07090E] relative overflow-hidden text-center">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/15 blur-[140px] pointer-events-none rounded-full" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Turn customer behavior into your next revenue decision.
          </h2>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Detect the customers changing before they disappear. Understand why. Decide what to do next. Measure what actually worked.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto text-base font-semibold bg-white hover:bg-slate-100 text-slate-950 px-8 py-4 rounded-xl shadow-xl shadow-white/10 transition-all flex items-center justify-center gap-2">
                  <span>Start with Your Data →</span>
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <a 
                href="/dashboard"
                className="w-full sm:w-auto text-base font-semibold bg-white hover:bg-slate-100 text-slate-950 px-8 py-4 rounded-xl shadow-xl shadow-white/10 transition-all flex items-center justify-center gap-2"
              >
                <span>Open Enterprise Console →</span>
              </a>
            </SignedIn>
          </div>

          <div className="mt-8 text-xs font-mono text-slate-500">
            Synchrony Analytics Hackathon 2026 · 100% Production Ready
          </div>
        </div>
      </section>

      {/* 12. MINIMALIST ENTERPRISE FOOTER */}
      <footer className="border-t border-[#1E263B] bg-[#04060A] py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          
          <BrandLogo size="sm" tagline="Enterprise Engine v2.4 · Synchrony 2026" />

          <div className="flex items-center gap-6 text-slate-400">
            <a href="#problem" className="hover:text-white transition-colors">The Paradox</a>
            <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
            <a href="#showcase" className="hover:text-white transition-colors">Intelligence</a>
            <a href="#architecture" className="hover:text-white transition-colors">ML Models</a>
            <a href="#economics" className="hover:text-white transition-colors">Economics</a>
            <a href="#analyst" className="hover:text-white transition-colors">AI Analyst</a>
          </div>

          <div>
            © 2026 SharePulse-AI. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
};
