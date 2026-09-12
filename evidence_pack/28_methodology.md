# 28. Comprehensive Analytical Methodology & Data Science Architecture

## 1. Zero-Assumption Audit Standards
Every metric in this evidence pack was derived deterministically from the 4 raw source CSV files provided for the Synchrony Analytics Hackathon 2026. Zero external or pre-assumed numbers were accepted.

## 2. Temporal Alignment & Fiscal Year Conventions
- **MetroMart Fiscal Calendar**: August 1 through July 31.
- **FY25**: Aug 1, 2024 - Jul 31, 2025
- **FY26**: Aug 1, 2025 - Jul 31, 2026
- **Longitudinal Evaluation Window**: 24 months continuous tracking across FY25 and FY26.

## 3. Mathematical Share of Wallet (SoW) Definition
$$\text{SoW} = \frac{\sum_{t \in \text{Active}} \text{HSIC\_Net\_Spend}_t}{\sum_{t \in \text{Active}} \text{Total\_MetroMart\_Net\_Spend}_t} \times 100$$
- **Active Tenure Filter**: Transactions are filtered strictly to dates on or after `Credit_Card_Open_Date` and on or before `Credit_Card_Closed_Date` (if closed).
- **Net Sales Accounting**: Returns are subtracted from gross sales; return transaction count weight is 0.

## 4. Machine Learning & Predictive Modeling Architecture
- **Unsupervised Behavioral Segmentation**: K-Means clustering ($k=5$) evaluated via Silhouette scores and Davies-Bouldin Index across RFM, payment mix, and category vectors.
- **Supervised Defection Risk Modeling**: 3-model tournament (Logistic Regression, Random Forest, Hist Gradient Boosting). Evaluated with temporal train/test split, ROC-AUC, PR-AUC, and feature attributions.

## 5. Decision Economics & Uplift Governance
- **Uplift Proxy Distinction**: In the absence of historical randomized campaign logs, scores are explicitly designated as *Intervention Potential / Persuadability Proxies* rather than causal uplift.
- **Net Economic Contribution**:
  $$\text{Net Contribution} = (\text{Recovered Spend} \times \text{Interchange Margin}) - \text{Reward Cost} - \text{Intervention Cost}$$
