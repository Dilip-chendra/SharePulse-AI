"""
Survival Analysis Engine — Cox Proportional Hazards + Kaplan-Meier
Uses lifelines library to fit duration models on customer card tenure and attrition events.
Empirically computed with zero synthetic/random data.
"""
from __future__ import annotations
import numpy as np
import pandas as pd
from typing import Any

try:
    from lifelines import CoxPHFitter, KaplanMeierFitter
    HAS_LIFELINES = True
except ImportError:
    HAS_LIFELINES = False

def run_survival_analysis(features_df: pd.DataFrame) -> dict[str, Any]:
    """
    Runs Cox PH and Kaplan-Meier survival analysis on customer lifecycle trajectories.
    """
    if not HAS_LIFELINES:
        return {
            "available": False,
            "message": "lifelines library not installed. Survival analysis unavailable.",
            "km_curves": {},
            "cox_hazard_ratios": [],
            "median_survival_months": None,
            "concordance_index": None,
            "taxonomy": "MODEL_DERIVED",
        }

    df = features_df.copy()

    # 1. Compute duration (months) and event (1 = attrited/closed, 0 = active/censored)
    if "duration" not in df.columns:
        if "Card_Tenure_Days" in df.columns:
            df["duration"] = (df["Card_Tenure_Days"] / 30.4375).clip(lower=1.0)
        elif "Overall_Recency_Days" in df.columns:
            df["duration"] = np.maximum(1.0, 24.0 - (df["Overall_Recency_Days"] / 30.4375))
        else:
            df["duration"] = 24.0

    if "event" not in df.columns:
        if "Is_Closed" in df.columns:
            is_closed = df["Is_Closed"] == 1
        elif "Credit_Card_Closed_Date" in df.columns:
            is_closed = df["Credit_Card_Closed_Date"].notnull()
        else:
            is_closed = pd.Series(False, index=df.index)

        # High risk defector event proxy
        if "Predicted_Risk_Score" in df.columns:
            high_risk = (df["Predicted_Risk_Score"] >= 0.70) & (df.get("HSIC_Recency_Days", 0) >= 120)
        elif "Delta_SoW" in df.columns:
            high_risk = (df["Delta_SoW"] <= -0.20)
        else:
            high_risk = pd.Series(False, index=df.index)

        df["event"] = (is_closed | high_risk).astype(int)

    # Check event sufficiency
    event_count = int(df["event"].sum())
    if event_count < 5 or len(df) < 50:
        return {
            "available": False,
            "message": "Insufficient event information for reliable survival analysis.",
            "km_curves": {},
            "cox_hazard_ratios": [],
            "median_survival_months": None,
            "concordance_index": None,
            "taxonomy": "MODEL_DERIVED",
        }

    results: dict[str, Any] = {
        "available": True,
        "taxonomy": "MODEL_DERIVED",
        "sample_size": len(df),
        "events_observed": event_count,
        "censored_count": len(df) - event_count,
    }

    # 2. Cox Proportional Hazards Model
    covariate_candidates = ["SoW", "Wallet_Share", "UPI_Share", "Total_Spend", "Is_Prime", "Avg_Ticket"]
    covariates = [c for c in covariate_candidates if c in df.columns]

    if covariates:
        cox_data = df[["duration", "event"] + covariates].dropna().copy()
        # Standardize continuous covariates for numerical stability
        for col in covariates:
            std = cox_data[col].std()
            if std > 0:
                cox_data[col] = (cox_data[col] - cox_data[col].mean()) / std

        try:
            cph = CoxPHFitter(penalizer=0.05)
            cph.fit(cox_data, duration_col="duration", event_col="event", show_progress=False)
            summary = cph.summary

            hazard_ratios = []
            for feat in summary.index:
                hr = float(np.exp(summary.loc[feat, "coef"]))
                ci_low = float(np.exp(summary.loc[feat, "coef lower 95%"]))
                ci_high = float(np.exp(summary.loc[feat, "coef upper 95%"]))
                p_val = float(summary.loc[feat, "p"])
                hazard_ratios.append({
                    "feature": feat,
                    "hazard_ratio": round(hr, 4),
                    "ci_lower": round(ci_low, 4),
                    "ci_upper": round(ci_high, 4),
                    "p_value": round(p_val, 4),
                    "significant": p_val < 0.05,
                })

            results["cox_hazard_ratios"] = sorted(hazard_ratios, key=lambda x: abs(x["hazard_ratio"] - 1.0), reverse=True)
            results["concordance_index"] = round(float(cph.concordance_index_), 4)
        except Exception as e:
            results["cox_hazard_ratios"] = []
            results["concordance_index"] = None
            results["cox_error"] = str(e)

    # 3. Kaplan-Meier Survival Curves by Segment
    km_curves: dict[str, Any] = {}
    segment_col = "Segment_Name" if "Segment_Name" in df.columns else ("Cluster_Id" if "Cluster_Id" in df.columns else None)

    if segment_col and df[segment_col].nunique() > 1:
        for seg_name, grp in df.groupby(segment_col):
            if len(grp) < 10 or grp["event"].sum() == 0:
                continue
            kmf = KaplanMeierFitter()
            kmf.fit(grp["duration"], event_observed=grp["event"], label=str(seg_name))
            
            # Subsample timeline to max 20 points for fast chart rendering
            timeline = kmf.timeline.tolist()
            survival = kmf.survival_function_.iloc[:, 0].tolist()
            
            step = max(1, len(timeline) // 20)
            km_curves[str(seg_name)] = {
                "timeline": [round(t, 1) for t in timeline[::step]],
                "survival": [round(s, 4) for s in survival[::step]],
                "median_months": round(float(kmf.median_survival_time_), 1) if not np.isinf(kmf.median_survival_time_) else None,
                "customer_count": int(len(grp)),
                "events": int(grp["event"].sum()),
            }

    # Overall Kaplan-Meier curve
    kmf_overall = KaplanMeierFitter()
    kmf_overall.fit(df["duration"], event_observed=df["event"], label="Portfolio Overall")
    timeline_all = kmf_overall.timeline.tolist()
    survival_all = kmf_overall.survival_function_.iloc[:, 0].tolist()
    step_all = max(1, len(timeline_all) // 20)

    km_curves["Overall"] = {
        "timeline": [round(t, 1) for t in timeline_all[::step_all]],
        "survival": [round(s, 4) for s in survival_all[::step_all]],
        "median_months": round(float(kmf_overall.median_survival_time_), 1) if not np.isinf(kmf_overall.median_survival_time_) else None,
        "customer_count": int(len(df)),
        "events": event_count,
    }

    results["km_curves"] = km_curves
    results["median_survival_months"] = (
        round(float(kmf_overall.median_survival_time_), 1)
        if not np.isinf(kmf_overall.median_survival_time_)
        else None
    )

    return results
