// SharePulse AI Enterprise Types

export interface FilterParams {
  fiscalYear?: string;
  membership?: string;
  category?: string;
  segment?: string;
}

export interface OverviewKPIs {
  total_customers: number;
  cardholder_customers: number;
  active_cardholders_with_spend: number;
  overall_sow_pct: number;
  fy25_sow_pct: number;
  fy26_sow_pct: number;
  sow_collapse_pp: number;
  total_metro_spend: number;
  total_hsic_spend: number;
  revenue_at_risk: number;
  recoverable_opportunity: number;
  expected_net_contribution: number;
  portfolio_roi: number;
  customers_at_risk: number;
  data_quality_score: number;
}

export interface MonthlyTrendItem {
  month: string;
  fiscal_year: string;
  total_net_spend: number;
  hsic_net_spend: number;
  sow_pct: number;
  wallet_net_spend: number;
  wallet_share_pct: number;
  upi_net_spend: number;
  upi_share_pct: number;
  other_cc_net_spend: number;
  other_cc_share_pct: number;
  debit_net_spend: number;
  debit_share_pct: number;
  sow_velocity_pp: number;
  active_customers: number;
  hsic_active_customers: number;
}

export interface CategoryItem {
  category: string;
  total_net_spend: number;
  hsic_net_spend: number;
  sow_pct: number;
  fy25_sow_pct: number;
  fy26_sow_pct: number;
  sow_change_pp: number;
  wallet_share_pct: number;
  upi_share_pct: number;
  other_cc_share_pct: number;
  debit_share_pct: number;
  avg_sales_ticket: number;
}

export interface PaymentMixItem {
  payment_method: string;
  net_spend: number;
  share_pct: number;
  transaction_count: number;
  avg_ticket: number;
}

export interface Customer {
  Customer_ID: number;
  Total_Spend: number;
  HSIC_Spend: number;
  Wallet_Spend: number;
  UPI_Spend: number;
  OtherCC_Spend?: number;
  Debit_Spend?: number;
  SoW: number;
  Delta_SoW: number;
  Predicted_Risk_Score: number;
  Customer_State: string;
  Segment_Name: string;
  Is_Prime: number;
  Recoverability_Score: number;
  Revenue_at_Risk: number;
  Recoverable_Opportunity: number;
  Master_Opportunity_Score: number;
  Recommended_NBA: string;
  Intervention_Cost: number;
  Expected_Net_Contribution: number;
  Overall_Recency_Days: number;
  Tx_Count: number;
  net_contribution: number;
  ideal_contribution: number;
  mbi: number;
  Age?: number;
  Gender?: string;
  Membership_Type?: string;
  Credit_Card_Limit?: number;
  Credit_Card_APR?: number;
  Card_Tenure_Days?: number;
  Is_Closed?: number;
  Closed_Date?: string;
}

export type CustomerFeature = Customer;

export interface ModelMetricItem {
  model_name: string;
  roc_auc: number;
  pr_auc: number;
  brier_score: number;
  status: string;
  f1_score?: number;
  accuracy?: number;
  cv_roc_auc_mean?: number;
  cv_roc_auc_std?: number;
  test_roc_auc?: number;
  test_pr_auc?: number;
  brier_score_loss?: number;
  precision?: number;
  recall?: number;
  is_selected?: boolean;
}

export type ModelBenchmarkItem = ModelMetricItem;

export interface SegmentSummary {
  cluster_id: number;
  name: string;
  segment_name?: string;
  customer_count: number;
  pct_of_total: number;
  pct_of_customers?: number;
  avg_total_spend: number;
  avg_spend_per_customer?: number;
  avg_hsic_spend: number;
  avg_sow: number;
  avg_sow_pct?: number;
  avg_wallet_share: number;
  avg_wallet_share_pct?: number;
  avg_upi_share: number;
  avg_upi_share_pct?: number;
  avg_risk_score: number;
  dominant_payment: string;
  primary_strategy: string;
  recommended_strategy?: string;
}

export interface ClusterBenchmarkItem {
  k: number;
  silhouette_score: number;
  davies_bouldin: number;
  davies_bouldin_index?: number;
  calinski_harabasz_index?: number;
  inertia: number;
  is_selected?: boolean;
}

export interface ConnectorMetrics {
  events_per_minute: number;
  events_today: number;
  latency_ms: number;
  data_quality_score: number;
  error_rate_pct: number;
  last_event_time: string;
}

export interface ConnectorInfo {
  connector_id: string;
  name: string;
  type: string;
  status: "CONNECTED" | "PAUSED" | "ERROR" | "DISCONNECTED";
  config: Record<string, any>;
  metrics: ConnectorMetrics;
}

export interface PulseMetrics {
  period_net_spend: number;
  period_hsic_spend: number;
  period_wallet_spend: number;
  period_upi_spend: number;
  hsic_sow_pct: number;
  baseline_sow_pct: number;
  sow_delta_pp: number;
  active_customers: number;
  high_risk_customers: number;
  revenue_at_risk: number;
  recoverable_opportunity: number;
  expected_net_contribution: number;
  portfolio_roi: number;
  events_in_period: number;
  current_throughput_tps: number;
  ingestion_latency_ms: number;
  data_quality_score: number;
}

export interface LiveFeedItem {
  time: string;
  event: string;
  amount: string;
  payment: string;
  customer: string;
  channel: string;
  status: string;
}

export interface BusinessPulseData {
  horizon: string;
  horizon_label: string;
  timestamp: string;
  live_metrics: PulseMetrics;
  live_feed: LiveFeedItem[];
}

export interface AnomalyItem {
  anomaly_id: string;
  metric: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  observed_value: string;
  expected_baseline: string;
  deviation_z_score: number;
  algorithm: string;
  affected_cohort: string;
  estimated_impact: string;
  confidence: number;
  detected_at: string;
  status: string;
}

export interface AlertItem {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  affected_metric: string;
  affected_customers: number;
  estimated_impact: string;
  confidence_pct: number;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  owner: string;
  likely_causes: string[];
  recommended_action: string;
  taxonomy: "OBSERVED" | "MODEL_DERIVED" | "ESTIMATED" | "HYPOTHESIS" | "PROPOSED_ACTION";
  detected_time: string;
}

export interface DecisionItem {
  customer_id: number;
  segment: string;
  current_sow_pct: number;
  risk_score: number;
  recoverability_score: number;
  revenue_at_risk: number;
  recommended_nba: string;
  intervention_cost: number;
  expected_net_contribution: number;
  quadrant: string;
  taxonomy: string;
}

export interface QuadrantSummary {
  quadrant: string;
  cardholder_count: number;
  pct_of_base: number;
  addressable_spend: number;
  recommended_action: string;
  expected_net_contribution: number;
  portfolio_roi: number;
  strategy: string;
}

export interface DecisionMatrixData {
  framework: string;
  economic_gate: string;
  quadrants: QuadrantSummary[];
  customer_decisions: DecisionItem[];
  total_targetable_cardholders: number;
  total_expected_net_value: number;
  overall_roi: number;
  generated_at: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
  requires_approval: boolean;
  executions_count: number;
  governance_mode: string;
}

export interface ApprovalRequest {
  approval_id: string;
  rule_name: string;
  condition: string;
  action: string;
  target_customers: number;
  proposed_by: string;
  expected_roi: number;
  status: string;
  approved_by?: string;
  created_at: string;
}

export interface DataQualityDimension {
  dimension: string;
  score_pct: number;
  status?: string;
  checked_records?: number;
  failures?: number;
  description: string;
}

export type QualityDimension = DataQualityDimension;

export interface DataHealthData {
  overall_health_score: number;
  overall_status: string;
  total_records_monitored: number;
  dimensions: DataQualityDimension[];
  schema_drift: {
    status: string;
    drift_detected: boolean;
    active_schema_version: string;
    drift_alerts: any[];
  };
  last_audit_timestamp: string;
}

export interface LineageNode {
  id: string;
  label: string;
  type: string;
  status: string;
  events?: string;
  latency?: string;
  score?: string;
  records?: string;
  auc?: string;
  silhouette?: string;
  actions?: string;
  sample?: string;
}

export interface LineageLink {
  source: string;
  target: string;
}

export interface LineageGraph {
  nodes: LineageNode[];
  links: LineageLink[];
  last_validated: string;
}

export interface ModelHealthItem {
  model_name: string;
  role: string;
  version: string;
  status: string;
  test_roc_auc?: number;
  test_pr_auc?: number;
  brier_score_loss?: number;
  silhouette_score?: number;
  davies_bouldin?: number;
  concordance_index?: number;
  prediction_volume_24h: number;
  avg_inference_latency_ms: number;
  feature_drift_status: string;
  last_trained: string;
}

export interface ModelHealthData {
  overall_model_status: string;
  models: ModelHealthItem[];
  monitored_features_count: number;
  drift_detection_method: string;
  last_health_check: string;
}

export interface ExecutiveBriefData {
  title: string;
  generated_at: string;
  partnership: string;
  key_signals: {
    signal_num: number;
    headline: string;
    finding: string;
    taxonomy: string;
  }[];
  top_opportunity: {
    opportunity_name: string;
    addressable_spend: string;
    recoverable_spend: string;
    expected_net_value: string;
    portfolio_roi: string;
  };
  recommended_action: {
    action: string;
    target_cohort: string;
    verification_method: string;
  };
}

export interface AIInsight {
  id: string;
  title: string;
  category: string;
  severity: string;
  tier?: string;
  taxonomy?: string;
  finding?: string;
  hypothesis?: any;
  proposed_action?: any;
  business_impact?: string;
  recoverable_spend_potential?: number | string;
  expected_recoverable_value?: number | string;
  statistical_evidence: any;
  monetary_impact_inr?: number;
  recommended_action?: string;
  p_value?: number;
  t_statistic?: number;
}
