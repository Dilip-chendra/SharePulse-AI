"""
Margin Bleed Index (MBI) Engine
Computes per-customer and per-segment net profit margin bleed
due to wallet fee costs and payment method mix changes.
"""
from __future__ import annotations
import pandas as pd
import numpy as np
from typing import Any

# Fee model (assumed rates — labeled PROPOSED since actual rates not in dataset)
PAYMENT_FEE_RATES = {
    "HSIC": 0.018,        # 1.8% interchange revenue (positive for issuer)
    "WALLET": -0.015,     # 1.5% wallet transaction cost (negative for issuer)
    "UPI": -0.005,        # ~0.5% effective cost (merchant discount)
    "DEBIT": -0.008,      # Debit card interchange cost
    "OTHER_CC": 0.012,    # Other credit card (positive but lower than HSIC)
    "CASH": -0.002,       # Cash handling cost
}

WALLET_FEE_LABEL_NOTE = (
    "Fee rates are PROPOSED (business assumptions, not from dataset). "
    "MBI = opportunity cost of wallet/UPI growth vs HSIC retention. "
    "Actual issuer economics require confidential interchange data."
)


def compute_margin_bleed(features_df: pd.DataFrame) -> dict[str, Any]:
    """
    Compute Margin Bleed Index per customer.
    MBI = (HSIC_contribution_loss) + (Wallet_fee_cost_increase)

    Returns per-customer MBI and aggregate segment-level summary.
    """
    df = features_df.copy()

    # Build implied spend per payment method
    spend_cols = {
        "HSIC": "FY26_HSIC",
        "WALLET": None,   # Derived below
        "UPI": None,
        "OTHER_CC": None,
        "DEBIT": None,
        "CASH": None,
    }

    total_col = "FY26_Total" if "FY26_Total" in df.columns else "Total_Spend"

    # Reconstruct payment method spends from share columns
    def get_spend(col_name, share_col, total):
        if col_name in df.columns:
            return df[col_name].fillna(0)
        if share_col in df.columns:
            return (df[share_col].fillna(0) * df[total].fillna(0))
        return pd.Series(0.0, index=df.index)

    hsic_spend   = get_spend("FY26_HSIC",   "HSIC_Share",   total_col)
    wallet_spend = get_spend("Wallet_Spend", "Wallet_Share", total_col)
    upi_spend    = get_spend("UPI_Spend",    "UPI_Share",    total_col)
    debit_spend  = get_spend("Debit_Spend",  "Debit_Share",  total_col)
    other_cc     = get_spend("OtherCC_Spend","OtherCC_Share",total_col)
    total_spend  = df[total_col].fillna(0) if total_col in df.columns else pd.Series(0.0, index=df.index)

    cash_spend = (total_spend - hsic_spend - wallet_spend - upi_spend - debit_spend - other_cc).clip(lower=0)

    # Net contribution per customer (positive = benefit, negative = cost)
    net_contribution = (
        hsic_spend   * PAYMENT_FEE_RATES["HSIC"]     +
        wallet_spend * PAYMENT_FEE_RATES["WALLET"]   +
        upi_spend    * PAYMENT_FEE_RATES["UPI"]      +
        debit_spend  * PAYMENT_FEE_RATES["DEBIT"]    +
        other_cc     * PAYMENT_FEE_RATES["OTHER_CC"] +
        cash_spend   * PAYMENT_FEE_RATES["CASH"]
    )

    # MBI: delta contribution if all spend had been HSIC vs actual mix
    ideal_contribution = total_spend * PAYMENT_FEE_RATES["HSIC"]
    mbi = ideal_contribution - net_contribution  # positive = value being left on table

    df["net_contribution"] = net_contribution.round(2)
    df["ideal_contribution"] = ideal_contribution.round(2)
    df["mbi"] = mbi.round(2)

    # Segment-level MBI
    segment_col = "segment_label" if "segment_label" in df.columns else "Cluster"
    segment_summary = []
    if segment_col in df.columns:
        for seg, grp in df.groupby(segment_col):
            segment_summary.append({
                "segment": str(seg),
                "n": int(len(grp)),
                "avg_mbi": round(float(grp["mbi"].mean()), 2),
                "total_mbi": round(float(grp["mbi"].sum()), 2),
                "avg_net_contribution": round(float(grp["net_contribution"].mean()), 2),
                "avg_hsic_share": round(float((hsic_spend.loc[grp.index] / total_spend.loc[grp.index].replace(0, np.nan)).fillna(0).mean()), 4),
            })

    # Portfolio-level
    portfolio_total_mbi = float(df["mbi"].sum())
    portfolio_avg_net = float(df["net_contribution"].mean())

    return {
        "portfolio_total_mbi": round(portfolio_total_mbi, 2),
        "portfolio_avg_net_contribution": round(portfolio_avg_net, 2),
        "segment_summary": segment_summary,
        "fee_model": {k: v for k, v in PAYMENT_FEE_RATES.items()},
        "taxonomy": "PROPOSED",
        "note": WALLET_FEE_LABEL_NOTE,
        "scored_df": df,
    }
