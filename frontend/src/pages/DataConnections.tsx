import React, { useState, useEffect } from 'react';
import { 
  RefreshCw,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Code,
  Copy,
  Check,
  Radio,
  Terminal,
  HelpCircle,
  Crown
} from 'lucide-react';
import { fetchConnections, testConnection, ingestEvent, API_V1_ENDPOINT } from '../services/api';
import type { ConnectorInfo } from '../types';

export const DataConnections: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorInfo[]>([]);
  const [testResult, setTestResult] = useState<Record<string, string>>({});
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<{ status: string; event_id: string; message: string; latency_ms: number; payload?: any } | null>(null);
  
  // Custom interactive event dispatcher state
  const [customCustId, setCustomCustId] = useState<number>(1042);
  const [customAmount, setCustomAmount] = useState<number>(3450.0);
  const [customPayment, setCustomPayment] = useState<string>("MetroMart Wallet");
  const [customCategory, setCustomCategory] = useState<string>("Grocery");
  const [customChannel, setCustomChannel] = useState<string>("POS Checkout");
  const [customIsPrime, setCustomIsPrime] = useState<boolean>(true);

  // Active code snippet tab
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'python' | 'javascript' | 'json'>('curl');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

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
  const handleSendTestEvent = async (type: 'standard' | 'high_ticket' | 'anomaly' | 'custom') => {
    setSimulating(true);
    setSimulationLog(null);
    try {
      const now = new Date().toISOString();
      let custId = customCustId;
      let amount = customAmount;
      let payment = customPayment;
      let category = customCategory;
      let channel = customChannel;
      let isPrime = customIsPrime;

      if (type === 'standard') {
        custId = Math.floor(Math.random() * 38000) + 1;
        amount = 3450.0;
        payment = "MetroMart Wallet";
        category = "Grocery";
        channel = "POS Checkout";
        isPrime = true;
      } else if (type === 'high_ticket') {
        custId = Math.floor(Math.random() * 38000) + 1;
        amount = 45800.0;
        payment = "MetroMart Wallet";
        category = "Electronics";
        channel = "Online Web";
        isPrime = true;
      } else if (type === 'anomaly') {
        custId = Math.floor(Math.random() * 38000) + 1;
        amount = 98500.0;
        payment = "Cash/UPI";
        category = "Large Appliances";
        channel = "POS Checkout";
        isPrime = false;
      }

      const payload = {
        event_id: `live_tx_${Date.now()}`,
        tenant_id: "tenant_metromart_prod",
        customer_id: custId,
        timestamp: now,
        amount: amount,
        payment_method: payment,
        category: category,
        channel: channel,
        is_prime: isPrime
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

  const liveEndpointUrl = `${API_V1_ENDPOINT}/events`;

  // Code snippets for developers
  const curlCode = `curl -X POST "${liveEndpointUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": 1042,
    "amount": 3450.00,
    "payment_method": "MetroMart Wallet",
    "category": "Grocery",
    "channel": "POS Checkout",
    "is_prime": true
  }'`;

  const pythonCode = `import requests

url = "${liveEndpointUrl}"
payload = {
    "customer_id": 1042,
    "amount": 3450.00,
    "payment_method": "MetroMart Wallet",
    "category": "Grocery",
    "channel": "POS Checkout",
    "is_prime": True
}

response = requests.post(url, json=payload)
print(response.status_code, response.json())`;

  const jsCode = `const response = await fetch("${liveEndpointUrl}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    customer_id: 1042,
    amount: 3450.00,
    payment_method: "MetroMart Wallet",
    category: "Grocery",
    channel: "POS Checkout",
    is_prime: true
  })
});

const result = await response.json();
console.log(result);`;

  const jsonSchema = `{
  "customer_id": 1042,               // (Required: Integer) Unique Cardholder ID (1 - 38200)
  "amount": 3450.00,                  // (Required: Float) Order monetary total in INR (positive)
  "payment_method": "MetroMart Wallet",// (Required: String) "HSIC Credit Card" | "MetroMart Wallet" | "Cash/UPI" | "Other Bank Credit Card" | "Debit Card"
  "category": "Grocery",              // (Required: String) "Grocery" | "Electronics" | "Large Appliances" | "Apparel" | "Furniture" | etc.
  "channel": "POS Checkout",          // (Optional: String) "POS Checkout" | "Online Web" | "Mobile App"
  "is_prime": true                    // (Optional: Boolean) true for MetroMart Prime members, false otherwise
}`;

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case 'curl': return curlCode;
      case 'python': return pythonCode;
      case 'javascript': return jsCode;
      case 'json': return jsonSchema;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 select-text">
      {/* ─── Top Command Banner ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#080C16] via-[#0D1322] to-[#080C16] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
            <Radio className="w-6 h-6 animate-pulse text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-white tracking-tight">Live Data Ingestion Gateway & API Connectors</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                GATEWAY ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Stream live point-of-sale transactions and external payment webhooks directly into the real-time SQLite database.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadConnectors}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Health</span>
          </button>
        </div>
      </div>

      {/* ─── Plain-English Guide: How to Send Live Data (3 Simple Steps) ─── */}
      <div className="p-6 rounded-3xl bg-[#0C101C] border border-slate-800/90 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">How to Send Live Data (3 Easy Steps)</h2>
          <span className="text-[11px] font-mono text-slate-400 ml-auto">Zero Setup Required</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-xs font-bold font-mono">1</span>
              <span className="text-xs font-bold text-white">Target the Live Endpoint</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Send an <code className="text-indigo-300 font-mono font-bold">HTTP POST</code> request to the live URL:
            </p>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 break-all select-all">
              {liveEndpointUrl}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-xs font-bold font-mono">2</span>
              <span className="text-xs font-bold text-white">Provide Transaction JSON</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Include <code className="text-slate-200 font-mono">customer_id</code>, <code className="text-slate-200 font-mono">amount</code>, <code className="text-slate-200 font-mono">payment_method</code>, and <code className="text-slate-200 font-mono">category</code> in the request body.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Headers: <code className="text-slate-400">Content-Type: application/json</code>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-xs font-bold font-mono">3</span>
              <span className="text-xs font-bold text-white">Watch Real-Time Analytics</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Each event is validated, stored in SQLite <code className="text-slate-300 font-mono">live_events</code>, evaluated for fraud/anomalies, and updated instantly in <strong>Business Pulse</strong> charts.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Interactive Live Event Dispatcher & Testing Workbench ─── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c1322] via-[#0e172a] to-[#0c1322] border border-cyan-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Live Ingestion Sandbox & Quick Dispatcher</h2>
              <p className="text-xs text-slate-400">Dispatch live transactions directly into the database to verify real-time processing.</p>
            </div>
          </div>

          {/* Quick Dispatch Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleSendTestEvent('standard')}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Grocery Txn (₹3,450)</span>
            </button>

            <button
              onClick={() => handleSendTestEvent('high_ticket')}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-950 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Electronics Txn (₹45,800)</span>
            </button>

            <button
              onClick={() => handleSendTestEvent('anomaly')}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Inject Anomaly Spike (₹98,500)</span>
            </button>
          </div>
        </div>

        {/* Custom Event Builder Form */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Send Custom Transaction Payload:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Customer ID</label>
              <input
                type="number"
                value={customCustId}
                onChange={(e) => setCustomCustId(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Amount (₹)</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-cyan-300 font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Payment Rail</label>
              <select
                value={customPayment}
                onChange={(e) => setCustomPayment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="MetroMart Wallet">MetroMart Wallet</option>
                <option value="HSIC Credit Card">HSIC Credit Card</option>
                <option value="Cash/UPI">Cash/UPI</option>
                <option value="Other Bank Credit Card">Other Bank CC</option>
                <option value="Debit Card">Debit Card</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Category</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Grocery">Grocery</option>
                <option value="Electronics">Electronics</option>
                <option value="Large Appliances">Large Appliances</option>
                <option value="Furniture">Furniture</option>
                <option value="Apparel">Apparel</option>
                <option value="Travel">Travel</option>
                <option value="Beauty">Beauty</option>
                <option value="Kids And Toys">Kids And Toys</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Bill Payments">Bill Payments</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Channel</label>
              <select
                value={customChannel}
                onChange={(e) => setCustomChannel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="POS Checkout">POS Checkout</option>
                <option value="Online Web">Online Web</option>
                <option value="Mobile App">Mobile App</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Prime Member</label>
              <button
                type="button"
                onClick={() => setCustomIsPrime(!customIsPrime)}
                className={`w-full h-[34px] rounded-xl px-2.5 flex items-center justify-center gap-1.5 border text-xs font-semibold transition-all cursor-pointer ${
                  customIsPrime
                    ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <Crown className={`w-3.5 h-3.5 ${customIsPrime ? "text-amber-400" : "text-slate-500"}`} />
                <span>{customIsPrime ? "Prime" : "Regular"}</span>
              </button>
            </div>

            <div className="flex items-end sm:col-span-2 lg:col-span-6">
              <button
                onClick={() => handleSendTestEvent('custom')}
                disabled={simulating}
                className="w-full h-10 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-950 transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Custom Live Transaction (POST /api/v1/events)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Processing Receipt */}
        {simulationLog && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Status: {simulationLog.status} (Ingested in {simulationLog.latency_ms} ms)</span>
              </span>
              <span className="text-slate-400">Event ID: {simulationLog.event_id}</span>
            </div>
            <div className="text-slate-300">
              Response: {simulationLog.message}
            </div>
            {simulationLog.payload && (
              <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 text-[11px] overflow-x-auto">
                {JSON.stringify(simulationLog.payload, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* ─── Developer Code Snippets & Payload Schema ─── */}
      <div className="p-6 rounded-3xl bg-[#0C101C] border border-slate-800/90 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">Developer Code Snippets & Schema Format</h2>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-900/90 rounded-xl p-0.5 border border-slate-800">
              {(['curl', 'python', 'javascript', 'json'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer uppercase ${
                    activeCodeTab === tab
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'curl' ? 'cURL' : tab === 'python' ? 'Python' : tab === 'javascript' ? 'JavaScript' : 'JSON Schema'}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-2xl bg-[#04060A] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed select-all">
          {getActiveCode()}
        </pre>
      </div>

      {/* ─── Active Ingestion Endpoints (Ready & Listening) ─── */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Ingestion Connectors (Mounted & Listening)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeConnectors.map((c) => (
            <div key={c.connector_id} className="p-5 rounded-3xl bg-[#080C16] border border-emerald-500/30 shadow-lg flex flex-col justify-between space-y-4">
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

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80">
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

                {/* Connection Status / URL box */}
                <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 break-all">
                  {testResult[c.connector_id] || (
                    c.connector_id === 'conn_rest_gateway' 
                      ? `REST Ingestion Gateway listening on ${liveEndpointUrl} (Ready for POST requests)`
                      : `Case study SQLite database mounted: 444,118 historical transactions across FY24-FY26 verified.`
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleTest(c.connector_id)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Test Connection Probe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Standby External Streaming Drivers ─── */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          <span>External Streaming Connectors (Standby / Configurable)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {standbyConnectors.map((c) => (
            <div key={c.connector_id} className="p-4 rounded-2xl bg-[#080C16] border border-slate-800 shadow flex flex-col justify-between space-y-3">
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
                  <div className="mt-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono">
                    {testResult[c.connector_id]}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2">
                <button
                  onClick={() => handleTest(c.connector_id)}
                  className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-all cursor-pointer"
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
