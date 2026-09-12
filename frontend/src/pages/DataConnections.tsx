import React, { useState, useEffect } from 'react';
import { 
  Server, 
  RefreshCw,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { fetchConnections, testConnection, ingestEvent } from '../services/api';
import type { ConnectorInfo } from '../types';

export const DataConnections: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorInfo[]>([]);
  const [testResult, setTestResult] = useState<Record<string, string>>({});
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<{ status: string; event_id: string; message: string; latency_ms: number; payload?: any } | null>(null);

  const loadConnectors = async () => {
    try {
      const res = await fetchConnections();
      setConnectors(res.connectors || []);
    } catch (err) {
      console.error('Failed to load connectors', err);
    }
  };

  useEffect(() => {
    loadConnectors();
  }, []);



  const handleTest = async (id: string) => {
    try {
      const res = await testConnection(id);
      setTestResult(prev => ({ ...prev, [id]: res.message }));
    } catch (err) {
      setTestResult(prev => ({ ...prev, [id]: 'Connection test failed' }));
    }
  };

  // Interactive Live Stream Ingestion Generator
  const handleSendTestEvent = async (type: 'standard' | 'high_ticket' | 'anomaly') => {
    setSimulating(true);
    setSimulationLog(null);
    try {
      const now = new Date().toISOString();
      const randomCustId = Math.floor(Math.random() * 38000) + 1;
      let amount = 3450.0;
      let payment = "MetroMart Wallet";
      let category = "Grocery";

      if (type === 'high_ticket') {
        amount = 45800.0;
        payment = "MetroMart Wallet";
        category = "Electronics";
      } else if (type === 'anomaly') {
        amount = 98500.0;
        payment = "Cash/UPI";
        category = "Large Appliances";
      }

      const payload = {
        event_id: `live_tx_${Date.now()}`,
        tenant_id: "tenant_metromart_prod",
        customer_id: randomCustId,
        timestamp: now,
        amount: amount,
        payment_method: payment,
        category: category,
        channel: "POS Checkout",
        is_prime: true
      };

      const result = await ingestEvent(payload);
      setSimulationLog({
        status: result.status,
        event_id: result.event_id,
        message: result.message,
        latency_ms: result.latency_ms,
        payload
      });
      await loadConnectors();
    } catch (err: any) {
      setSimulationLog({
        status: "FAILED",
        event_id: "err",
        message: err.message || "Failed to post event to /api/v1/events",
        latency_ms: 0
      });
    } finally {
      setSimulating(false);
    }
  };

  const activeConnectors = connectors.filter(c => c.status === 'CONNECTED');
  const standbyConnectors = connectors.filter(c => c.status !== 'CONNECTED');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#080C16] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Data Ingestion Gateway & Streaming Connectors</h1>
            <p className="text-xs text-slate-400 mt-1">
              Active ingestion endpoints listening for live point-of-sale and payment webhooks, alongside standby connectors for enterprise event buses.
            </p>
          </div>
        </div>

        <button
          onClick={loadConnectors}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* Interactive Live Stream Simulator Panel */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1322] via-[#0d1628] to-[#0c1322] border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Live Event Stream Simulator (POST /api/v1/events)</h2>
              <p className="text-xs text-slate-400">
                Trigger real transaction events directly into the SQLite <code>live_events</code> table to test validation, deduplication, and anomaly scoring.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleSendTestEvent('standard')}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Grocery Txn (₹3,450)</span>
            </button>

            <button
              onClick={() => handleSendTestEvent('high_ticket')}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Electronics Txn (₹45,800)</span>
            </button>

            <button
              onClick={() => handleSendTestEvent('anomaly')}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Inject Anomaly Spike (₹98,500)</span>
            </button>
          </div>
        </div>

        {/* Real-time Ingestion Receipt Log */}
        {simulationLog && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Status: {simulationLog.status} (Processed in {simulationLog.latency_ms} ms)</span>
              </span>
              <span className="text-slate-500">Event ID: {simulationLog.event_id}</span>
            </div>
            <div className="text-slate-300">
              Message: {simulationLog.message}
            </div>
            {simulationLog.payload && (
              <pre className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 text-[11px] overflow-x-auto">
                {JSON.stringify(simulationLog.payload, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Section 1: Active Ingestion Gateways */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Ingestion Endpoints (Ready & Listening)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeConnectors.map((c) => (
            <div key={c.connector_id} className="p-5 rounded-2xl bg-[#080C16] border border-emerald-500/30 shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2.5 py-0.5 rounded font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    {c.type}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    LISTENING
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">{c.name}</h3>
                <div className="text-xs text-slate-400 font-mono">ID: {c.connector_id}</div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block">Events Ingested</span>
                    <span className="text-white font-mono font-bold">{c.metrics?.events_today?.toLocaleString() ?? 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Avg Latency</span>
                    <span className="text-cyan-300 font-mono font-bold">{c.metrics?.latency_ms ?? 0} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Data Integrity</span>
                    <span className="text-emerald-400 font-mono font-bold">{c.metrics?.data_quality_score ?? 100}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Error Rate</span>
                    <span className="text-slate-300 font-mono font-bold">{c.metrics?.error_rate_pct ?? 0}%</span>
                  </div>
                </div>

                {testResult[c.connector_id] && (
                  <div className="mt-3 p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono">
                    {testResult[c.connector_id]}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleTest(c.connector_id)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Test Connection Probe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Standby External Connectors */}
      <div className="space-y-3 pt-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          <span>External Streaming Connectors (Standby / Configurable)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {standbyConnectors.map((c) => (
            <div key={c.connector_id} className="p-4 rounded-xl bg-[#080C16] border border-slate-800 shadow flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-900 text-slate-400 border border-slate-800">
                    {c.type}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    STANDBY
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-200 mb-1">{c.name}</h3>
                <div className="text-[10px] text-slate-500 font-mono truncate">ID: {c.connector_id}</div>

                {testResult[c.connector_id] && (
                  <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono">
                    {testResult[c.connector_id]}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2">
                <button
                  onClick={() => handleTest(c.connector_id)}
                  className="w-full py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-all cursor-pointer"
                >
                  Verify Driver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
