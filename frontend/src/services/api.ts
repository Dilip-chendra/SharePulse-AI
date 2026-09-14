import type { FilterParams } from "../types";

const resolveApiBase = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return (import.meta.env.VITE_API_URL as string).replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (!host.includes("localhost") && !host.includes("127.0.0.1")) {
      return "https://sharepulse-ai.onrender.com";
    }
  }
  return "http://127.0.0.1:8000";
};

export const API_BASE = resolveApiBase();
export const API_ENDPOINT = `${API_BASE}/api`;
export const API_V1_ENDPOINT = `${API_BASE}/api/v1`;

async function safeFetch(url: string, options?: RequestInit, retries = 2): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 503 && attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      return res;
    } catch (err: any) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      }
    }
  }
  throw lastError || new Error(`Network request failed for ${url}`);
}

function buildFilterQuery(filters?: FilterParams): string {
  if (!filters) return "";
  const query = new URLSearchParams();
  if (filters.fiscalYear && filters.fiscalYear !== "All") query.append("fiscal_year", filters.fiscalYear);
  if (filters.membership && filters.membership !== "All") query.append("membership", filters.membership);
  if (filters.category && filters.category !== "All") query.append("category", filters.category);
  if (filters.segment && filters.segment !== "All") query.append("segment", filters.segment);
  const qStr = query.toString();
  return qStr ? `?${qStr}` : "";
}

// ─── Case-Study Core Endpoints ─────────────────────────────────────────────
export async function fetchOverview(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/overview${q}`);
  if (!res.ok) throw new Error("Failed to fetch overview");
  return res.json();
}

export async function fetchSoW(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/sow${q}`);
  if (!res.ok) throw new Error("Failed to fetch SoW data");
  return res.json();
}

export async function fetchMigration(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/migration${q}`);
  if (!res.ok) throw new Error("Failed to fetch migration data");
  return res.json();
}

export async function fetchAttrition(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/attrition${q}`);
  if (!res.ok) throw new Error("Failed to fetch attrition data");
  return res.json();
}

export async function fetchCustomers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  segment?: string;
  state?: string;
  prime?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.pageSize) query.append("page_size", params.pageSize.toString());
  if (params.search) query.append("search", params.search);
  if (params.segment && params.segment !== "All") query.append("segment", params.segment);
  if (params.state && params.state !== "All") query.append("state", params.state);
  if (params.prime && params.prime !== "All") query.append("prime", params.prime);
  if (params.sortBy) query.append("sort_by", params.sortBy);
  if (params.sortOrder) query.append("sort_order", params.sortOrder);

  const res = await safeFetch(`${API_ENDPOINT}/customers?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch customer directory");
  return res.json();
}

export async function fetchCustomerProfile(customerId: number) {
  const res = await safeFetch(`${API_ENDPOINT}/customers/${customerId}`);
  if (!res.ok) throw new Error(`Failed to fetch customer profile for ID: ${customerId}`);
  return res.json();
}
export const fetchCustomerDetail = fetchCustomerProfile;

export async function fetchSegmentation(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/segmentation${q}`);
  if (!res.ok) throw new Error("Failed to fetch segmentation data");
  return res.json();
}

// FIXED: was /opportunity (404), now /opportunities (correct)
export async function fetchOpportunity(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/opportunities${q}`);
  if (!res.ok) throw new Error("Failed to fetch opportunity data");
  return res.json();
}
export const fetchOpportunities = fetchOpportunity;

// FIXED: was /opportunity (same as above), now /next-best-action (correct)
export async function fetchNextBestAction(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/next-best-action${q}`);
  if (!res.ok) throw new Error("Failed to fetch next best action data");
  return res.json();
}

export async function fetchReturnAnalysis(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/return-analysis${q}`);
  if (!res.ok) throw new Error("Failed to fetch return analysis");
  return res.json();
}

export async function fetchBigTicket(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/big-ticket${q}`);
  if (!res.ok) throw new Error("Failed to fetch big-ticket analysis");
  return res.json();
}

export async function fetchRewardAnalysis(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/reward-analysis${q}`);
  if (!res.ok) throw new Error("Failed to fetch reward analysis");
  return res.json();
}

export async function fetchSurvival(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/survival${q}`);
  if (!res.ok) throw new Error("Failed to fetch survival analysis");
  return res.json();
}

// FIXED: was mapped to fetchSurvival (/survival), now calls /explainability (correct)
export async function fetchExplainability(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/explainability${q}`);
  if (!res.ok) {
    // Graceful fallback to survival for older data
    return fetchSurvival(filters);
  }
  return res.json();
}

// FIXED: was /margin-bleed (404), now /leakage (correct)
export async function fetchMarginBleed(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/leakage${q}`);
  if (!res.ok) throw new Error("Failed to fetch leakage data");
  return res.json();
}
export const fetchLeakage = fetchMarginBleed;

// FIXED: was /ai-discovery (404), now /insights (correct)
export async function fetchAIDiscovery(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/insights${q}`);
  if (!res.ok) throw new Error("Failed to fetch AI discovered insights");
  return res.json();
}
export const fetchInsights = fetchAIDiscovery;

// FIXED: was /dataset/summary (404), now /datasets (correct)
export async function fetchDatasetSummary() {
  const res = await safeFetch(`${API_ENDPOINT}/datasets`);
  if (!res.ok) throw new Error("Failed to fetch dataset summary");
  return res.json();
}

// FIXED: was /governance/audit (404), now /governance (correct)
export async function fetchGovernanceAudit(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/governance${q}`);
  if (!res.ok) throw new Error("Failed to fetch governance audit");
  return res.json();
}
export const fetchGovernance = fetchGovernanceAudit;

// ADDED: /filters endpoint for GlobalFilterBar dynamic population
export async function fetchFilters() {
  const res = await safeFetch(`${API_ENDPOINT}/filters`);
  if (!res.ok) {
    // Return sensible defaults if filters endpoint unavailable
    return {
      fiscal_years: ["All", "FY25", "FY26"],
      memberships: ["All", "Prime", "Non-Prime"],
      categories: ["All", "Grocery", "Electronics", "Large Appliances", "Furniture",
                   "Travel", "Apparel", "Outdoor", "Kids And Toys", "Beauty", "Bill Payments"],
      segments: [
        "All",
        "MetroMart Wallet Dominant Shoppers",
        "High-Value Multi-Channel Shoppers",
        "HSIC Core Loyalists",
        "Cash & UPI Transactors",
        "Dormant & Low-Engagement Shoppers"
      ]
    };
  }
  return res.json();
}

// FIXED: was /strategy/simulate (404), now /simulation (correct)
export async function simulateStrategy(payload: any) {
  const res = await safeFetch(`${API_ENDPOINT}/simulation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Strategy simulation failed");
  return res.json();
}
export const runSimulation = simulateStrategy;

export async function fetchExperiments(filters?: FilterParams) {
  const q = buildFilterQuery(filters);
  const res = await safeFetch(`${API_ENDPOINT}/experiments${q}`);
  if (!res.ok) {
    return fetchSurvival(filters);
  }
  return res.json();
}

export async function postChatMessage(payload: { message: string; customer_id?: number }) {
  const res = await safeFetch(`${API_ENDPOINT}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}
export const sendChatMessage = postChatMessage;

export async function fetchReport() {
  const res = await safeFetch(`${API_ENDPOINT}/report`);
  if (!res.ok) throw new Error("Failed to fetch executive report");
  return res.json();
}

export async function fetchExecutiveBrief() {
  const res = await safeFetch(`${API_V1_ENDPOINT}/executive-brief`);
  if (!res.ok) throw new Error("Failed to fetch executive brief");
  return res.json();
}

// ─── Enterprise API v1 Methods ─────────────────────────────────────────────
export async function fetchBusinessPulse(horizon: string = "24h") {
  const res = await safeFetch(`${API_V1_ENDPOINT}/business-pulse?horizon=${horizon}`);
  if (!res.ok) throw new Error("Failed to fetch business pulse");
  return res.json();
}

export async function fetchAnomalies(limit: number = 20) {
  const res = await safeFetch(`${API_V1_ENDPOINT}/anomalies?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch anomalies");
  return res.json();
}

export async function fetchAlerts() {
  const res = await safeFetch(`${API_V1_ENDPOINT}/alerts`);
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}

export async function acknowledgeAlert(alertId: string, user: string = "Admin User") {
  const res = await safeFetch(`${API_V1_ENDPOINT}/alerts/${alertId}/acknowledge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user }),
  });
  if (!res.ok) throw new Error("Failed to acknowledge alert");
  return res.json();
}

export async function resolveAlert(alertId: string, user: string = "Admin User") {
  const res = await safeFetch(`${API_V1_ENDPOINT}/alerts/${alertId}/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user }),
  });
  if (!res.ok) throw new Error("Failed to resolve alert");
  return res.json();
}

export async function fetchConnections() {
  const res = await safeFetch(`${API_V1_ENDPOINT}/connections`);
  if (!res.ok) throw new Error("Failed to fetch connections");
  return res.json();
}

export async function toggleConnection(connectorId: string, action: "connect" | "pause") {
  const res = await safeFetch(`${API_V1_ENDPOINT}/connections/${connectorId}/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Failed to toggle connector");
  return res.json();
}

export async function testConnection(connectorId: string) {
  const res = await safeFetch(`${API_V1_ENDPOINT}/connections/${connectorId}/test`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to test connection");
  return res.json();
}

export async function ingestEvent(eventPayload: any) {
  const res = await safeFetch(`${API_V1_ENDPOINT}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventPayload),
  });
  if (!res.ok) throw new Error("Event ingestion failed");
  return res.json();
}

export async function replayEvents(count: number = 25) {
  const res = await safeFetch(`${API_V1_ENDPOINT}/events/replay?count=${count}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Event replay failed");
  return res.json();
}

export async function fetchDataHealth() {
  const res = await safeFetch(`${API_V1_ENDPOINT}/data-health`);
  if (!res.ok) throw new Error("Failed to fetch data health");
  return res.json();
}

export async function fetchRootCause(anomalyId: string) {
  const res = await safeFetch(`${API_V1_ENDPOINT}/root-cause/${anomalyId}`);
  if (!res.ok) throw new Error("Failed to fetch root cause analysis");
  return res.json();
}

export async function fetchDecisions(limit: number = 50) {
  const res = await safeFetch(`${API_V1_ENDPOINT}/decisions?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch decisions matrix");
  return res.json();
}

export async function fetchAutomations() {
  const res = await safeFetch(`${API_V1_ENDPOINT}/automations`);
  if (!res.ok) throw new Error("Failed to fetch automations");
  return res.json();
}

export async function toggleAutomationRule(ruleId: string, enabled: boolean) {
  const res = await safeFetch(`${API_V1_ENDPOINT}/automations/${ruleId}/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  });
  if (!res.ok) throw new Error("Failed to toggle automation rule");
  return res.json();
}

export async function submitAutomationApproval(requestId: string, decision: "APPROVED" | "REJECTED", reason?: string) {
  const res = await safeFetch(`${API_V1_ENDPOINT}/automations/approval`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request_id: requestId, decision, reason }),
  });
  if (!res.ok) throw new Error("Failed to submit approval");
  return res.json();
}

export async function fetchLineage() {
  const res = await safeFetch(`${API_V1_ENDPOINT}/lineage`);
  if (!res.ok) throw new Error("Failed to fetch data lineage");
  return res.json();
}

export async function fetchModelHealth() {
  const res = await safeFetch(`${API_V1_ENDPOINT}/model-health`);
  if (!res.ok) throw new Error("Failed to fetch model health");
  return res.json();
}

export async function fetchSystemHealth() {
  const res = await safeFetch(`${API_V1_ENDPOINT}/system/health`);
  if (!res.ok) throw new Error("Failed to fetch system health");
  return res.json();
}

export async function fetchDeadLetterQueue() {
  const res = await safeFetch(`${API_V1_ENDPOINT}/events/dead-letter`);
  if (!res.ok) throw new Error("Failed to fetch dead letter queue");
  return res.json();
}

export async function fetchLiveThroughput() {
  try {
    const res = await fetchBusinessPulse("live");
    return {
      total_events: res?.kpis?.live_event_count || 0,
      events_per_second: res?.kpis?.events_per_second || 0,
      p99_latency_ms: res?.kpis?.p99_latency_ms || 0
    };
  } catch {
    return { total_events: 0, events_per_second: 0, p99_latency_ms: 0 };
  }
}

export async function fetchLiveStreamTelemetry() {
  const res = await safeFetch(`${API_V1_ENDPOINT}/live-stream/metrics`);
  if (!res.ok) throw new Error("Failed to fetch live stream telemetry");
  return res.json();
}

export async function clearLiveStreamDatabase() {
  const res = await safeFetch(`${API_V1_ENDPOINT}/live-stream/clear`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to clear live stream database");
  return res.json();
}

export async function generateLiveStreamTraffic(count: number = 5, anomaly: boolean = false) {
  const res = await safeFetch(`${API_V1_ENDPOINT}/live-stream/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count, anomaly }),
  });
  if (!res.ok) throw new Error("Failed to generate live stream traffic");
  return res.json();
}

export async function fetchSystemStatus() {
  const res = await safeFetch(`${API_ENDPOINT}/system/status`);
  if (!res.ok) throw new Error("Failed to fetch system status");
  return res.json();
}

