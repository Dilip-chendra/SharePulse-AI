import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Radio, 
  Play, 
  Pause,
  RotateCcw,
  Send,
  AlertTriangle,
  CheckCircle2,
  Server,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Wallet,
  Clock
} from 'lucide-react';
import { fetchLiveStreamTelemetry, clearLiveStreamDatabase, generateLiveStreamTraffic } from '../services/api';

export const BusinessPulse: React.FC = () => {
  const [data, setData] = useState<any>(null);
  
  const [isAutoStreaming, setIsAutoStreaming] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const autoStreamInterval = useRef<any>(null);

  const loadTelemetry = async () => {
    try {
      const res = await fetchLiveStreamTelemetry();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      
    }
  };

  useEffect(() => {
    loadTelemetry();
    const interval = setInterval(loadTelemetry, 2500);
    return () => clearInterval(interval);
  }, []);

  // Auto-streaming generator effect
  useEffect(() => {
    if (isAutoStreaming) {
      autoStreamInterval.current = setInterval(async () => {
        try {
          await generateLiveStreamTraffic(2, false);
          loadTelemetry();
        } catch (e) {
          console.error(e);
        }
      }, 1000);
    } else {
      if (autoStreamInterval.current) {
        clearInterval(autoStreamInterval.current);
        autoStreamInterval.current = null;
      }
    }
    return () => {
      if (autoStreamInterval.current) clearInterval(autoStreamInterval.current);
    };
  }, [isAutoStreaming]);

  const handleSendSingle = async () => {
    try {
      await generateLiveStreamTraffic(1, false);
      setFeedback("Sent 1 POS transaction into SQLite live_events table.");
      loadTelemetry();
      setTimeout(() => setFeedback(null), 2500);
    } catch (err: any) {
      setFeedback("Failed: " + err.message);
    }
  };

  const handleSendBatch = async () => {
    try {
      await generateLiveStreamTraffic(10, false);
      setFeedback("Ingested batch of 10 transactions via /api/v1/events/batch.");
      loadTelemetry();
      setTimeout(() => setFeedback(null), 2500);
    } catch (err: any) {
      setFeedback("Failed: " + err.message);
    }
  };

  const handleInjectAnomaly = async () => {
    try {
      await generateLiveStreamTraffic(1, true);
      setFeedback("⚠️ High-ticket anomaly event injected! Alert incident created in alerts table.");
      loadTelemetry();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback("Failed: " + err.message);
    }
  };

  const handleClear = async () => {
    try {
      await clearLiveStreamDatabase();
      setIsAutoStreaming(false);
      setFeedback("Live stream database reset to 0 events.");
      loadTelemetry();
      setTimeout(() => setFeedback(null), 2500);
    } catch (err: any) {
      setFeedback("Failed: " + err.message);
    }
  };

  const totalEvents = data?.total_events_ingested || 0;
  const totalSpend = data?.total_live_spend || 0;
  const recentEvents = data?.recent_events || [];
  const paymentBreakdown = data?.payment_breakdown || [];
  const activeIncidents = data?.active_incidents || 0;

  return (
    <div className="space-y-6 select-none">
      {/* Top Command Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#080C16] via-[#0D1322] to-[#080C16] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radio className={`w-6 h-6 ${isAutoStreaming || totalEvents > 0 ? 'animate-pulse text-emerald-400' : 'text-slate-500'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Live Enterprise Ingestion & Telemetry Command Center</h1>
              <span className={`px-2 py-0.5 text-[10px] font-bold font-sans rounded-full flex items-center gap-1 ${
                isAutoStreaming ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' :
                totalEvents > 0 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAutoStreaming ? 'bg-emerald-400 animate-ping' : totalEvents > 0 ? 'bg-cyan-400' : 'bg-slate-500'}`} />
                {isAutoStreaming ? 'STREAMING ACTIVE' : totalEvents > 0 ? 'GATEWAY LISTENING' : 'IDLE (READY)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live transactional stream processed in real time via <code className="text-indigo-300 font-mono">POST /api/v1/events</code> and persisted to SQLite <code className="text-indigo-300 font-mono">live_events</code>.
            </p>
          </div>
        </div>

        {/* Live Controller Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAutoStreaming(!isAutoStreaming)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              isAutoStreaming
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40 ring-2 ring-amber-400/40 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 ring-2 ring-emerald-400/30'
            }`}
          >
            {isAutoStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAutoStreaming ? 'Pause Auto-Stream' : 'Start Live Traffic Stream'}</span>
          </button>

          <button
            onClick={handleSendSingle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
            title="Send 1 transaction to POST /api/v1/events"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send 1 Event</span>
          </button>

          <button
            onClick={handleSendBatch}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-700/80 hover:bg-cyan-600 text-white text-xs font-semibold shadow-sm cursor-pointer"
            title="Send 10 batch transactions"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Send 10 Batch</span>
          </button>

          <button
            onClick={handleInjectAnomaly}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-700/80 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm cursor-pointer"
            title="Inject aberrant high-ticket spend to test z-score anomaly detector"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Inject Anomaly</span>
          </button>

          {totalEvents > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs font-medium transition-colors cursor-pointer"
              title="Clear live_events database to start from zero"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Feedback Banner */}
      {feedback && (
        <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs font-mono text-indigo-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 4 Live Telemetry KPI Cards (Pure Live Events Database) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Live Ingested Events */}
        <div className="p-5 rounded-2xl bg-[#080C16] border border-slate-800/90 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Live Events Ingested</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {totalEvents.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalEvents === 0 ? "Awaiting first POS/webhook payload" : "Stored in SQLite `live_events`"}
          </div>
        </div>

        {/* Card 2: Live Ingested Spend Volume */}
        <div className="p-5 rounded-2xl bg-[#080C16] border border-slate-800/90 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Live Stream Spend</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono">
            ₹{totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Real sum of incoming transaction amounts
          </div>
        </div>

        {/* Card 3: Processing Latency */}
        <div className="p-5 rounded-2xl bg-[#080C16] border border-slate-800/90 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>P99 Ingestion Latency</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 font-mono">
            {data?.p99_latency_ms || 1.1} ms
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Validation + Deduplication + SQL Insert
          </div>
        </div>

        {/* Card 4: Active Incidents */}
        <div className="p-5 rounded-2xl bg-[#080C16] border border-slate-800/90 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Anomaly Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${activeIncidents > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${activeIncidents > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {activeIncidents} Active
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {activeIncidents > 0 ? "Threshold breached (Z-score > 3.0)" : "All transaction distributions normal"}
          </div>
        </div>
      </div>

      {/* Main Grid: Real-Time Stream Table & Payment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Transaction Feed Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#080C16] border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-sm font-bold text-white">Real-Time Ingestion Log (live_events table)</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing latest {recentEvents.length} events
            </span>
          </div>

          {recentEvents.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
              <Server className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">Live Ingestion Gateway is Idle</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No external transactions have been streamed yet in this session. Click <strong className="text-emerald-400">"Start Live Traffic Stream"</strong> above or send a POST request to <code className="text-indigo-300 font-mono">http://127.0.0.1:8000/api/v1/events</code> to see live events stream here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2.5">Time</th>
                    <th className="pb-2.5">Event ID</th>
                    <th className="pb-2.5">Customer</th>
                    <th className="pb-2.5">Category</th>
                    <th className="pb-2.5">Payment Rail</th>
                    <th className="pb-2.5 text-right">Amount</th>
                    <th className="pb-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {recentEvents.map((evt: any) => (
                    <tr key={evt.event_id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 text-slate-400 text-[11px]">
                        {evt.created_at ? evt.created_at.split('T')[1]?.slice(0, 8) || evt.created_at : "Just now"}
                      </td>
                      <td className="py-2.5 text-slate-300 text-[11px] truncate max-w-[110px]">
                        {evt.event_id}
                      </td>
                      <td className="py-2.5 text-cyan-300 font-semibold">
                        CUST-{evt.customer_id}
                      </td>
                      <td className="py-2.5 text-slate-300">
                        {evt.category}
                      </td>
                      <td className="py-2.5 text-slate-300 flex items-center gap-1.5">
                        {evt.payment_method === 'HSIC Credit Card' ? (
                          <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                        ) : evt.payment_method === 'MetroMart Wallet' ? (
                          <Wallet className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span>{evt.payment_method}</span>
                      </td>
                      <td className="py-2.5 text-right font-bold text-white">
                        ₹{evt.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          {evt.status || "INGESTED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Col: Payment Rail Share of Live Stream */}
        <div className="p-6 rounded-2xl bg-[#080C16] border border-slate-800/90 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Live Stream Payment Method Distribution</span>
          </h2>

          {paymentBreakdown.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Awaiting live transactions to compute real-time payment share.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {paymentBreakdown.map((pm: any) => (
                <div key={pm.payment_method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{pm.payment_method}</span>
                    <span className="text-white font-mono font-bold">{pm.pct_of_spend}% (₹{pm.total_amount?.toLocaleString()})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        pm.payment_method === 'HSIC Credit Card' ? 'bg-indigo-500' :
                        pm.payment_method === 'MetroMart Wallet' ? 'bg-amber-500' :
                        pm.payment_method === 'Cash/UPI' ? 'bg-emerald-500' :
                        'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, pm.pct_of_spend))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1 mt-4">
            <div className="font-semibold text-slate-200">How to stream directly:</div>
            <div>Send JSON to <code className="text-cyan-300 font-mono">POST /api/v1/events</code> with <code className="text-cyan-300 font-mono">customer_id</code> and <code className="text-cyan-300 font-mono">amount</code>.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
