"""
Schema Normalizer — Semantic column detection for uploaded CSVs.
Maps arbitrary column names to the canonical internal schema.
"""
from __future__ import annotations
import re
import pandas as pd
from typing import Optional


# ─── Canonical Schema Definition ─────────────────────────────────────────────
CANONICAL_COLUMNS = {
    # Customer data
    "customer_id":        {"aliases": ["customer_id", "customerid", "cust_id", "custid", "customer", "id", "member_id", "account_id"], "dtype": "str",   "required": True},
    "age":                {"aliases": ["age", "customer_age", "age_years"],                                                              "dtype": "float", "required": False},
    "gender":             {"aliases": ["gender", "sex"],                                                                                "dtype": "str",   "required": False},
    "membership_type":    {"aliases": ["membership_type", "membership", "prime", "is_prime", "tier", "plan", "loyalty_tier"],          "dtype": "str",   "required": False},
    "credit_card_open_date": {"aliases": ["credit_card_open_date", "open_date", "card_open_date", "account_open_date", "issue_date"], "dtype": "date",  "required": False},
    "credit_card_closed_date": {"aliases": ["credit_card_closed_date", "closed_date", "card_closed_date", "close_date", "closure_date"], "dtype": "date", "required": False},
    "credit_card_limit":  {"aliases": ["credit_card_limit", "credit_limit", "card_limit", "limit", "assigned_limit"],                  "dtype": "float", "required": False},
    "credit_card_apr":    {"aliases": ["credit_card_apr", "apr", "interest_rate", "rate", "annual_percentage_rate"],                    "dtype": "float", "required": False},

    # Transaction data
    "transaction_id":     {"aliases": ["transaction_id", "txn_id", "transactionid", "trans_id", "order_id", "receipt_id"],             "dtype": "str",   "required": False},
    "transaction_date":   {"aliases": ["transaction_date", "date", "txn_date", "trans_date", "purchase_date", "order_date"],           "dtype": "date",  "required": True},
    "transaction_amount": {"aliases": ["transaction_amount", "amount", "txn_amount", "spend", "purchase_amount", "sales_amount"],      "dtype": "float", "required": True},
    "transaction_type":   {"aliases": ["transaction_type", "txn_type", "type", "order_type", "sale_return"],                           "dtype": "str",   "required": False},
    "category_code":      {"aliases": ["category_code", "category", "cat", "cat_code", "department", "mcc"],                           "dtype": "str",   "required": False},
    "payment_code":       {"aliases": ["payment_code", "payment_method", "payment", "pay_code", "tender_type", "instrument"],           "dtype": "str",   "required": False},
    "number_of_transactions": {"aliases": ["number_of_transactions", "num_transactions", "tx_count", "quantity", "count"],             "dtype": "int",   "required": False},
}



def _normalize_col_name(col: str) -> str:
    """Lowercase, strip spaces and underscores for fuzzy matching."""
    return re.sub(r"[^a-z0-9]", "", col.lower())


def detect_schema(df: pd.DataFrame) -> dict:
    """
    Attempt to map each column in df to a canonical field.
    Returns:
    {
        "mapping": { "original_col": "canonical_col" | None },
        "confidence": { "canonical_col": 0.0..1.0 },
        "unmapped": ["col1", "col2"],
        "coverage": float  # fraction of required fields found
    }
    """
    mapping: dict[str, Optional[str]] = {}
    confidence: dict[str, float] = {}
    used_canonical: set[str] = set()

    # Build alias lookup
    alias_to_canonical: dict[str, str] = {}
    for canonical, meta in CANONICAL_COLUMNS.items():
        for alias in meta["aliases"]:
            alias_to_canonical[_normalize_col_name(alias)] = canonical

    for col in df.columns:
        norm = _normalize_col_name(col)
        # Exact alias match
        if norm in alias_to_canonical:
            target = alias_to_canonical[norm]
            if target not in used_canonical:
                mapping[col] = target
                confidence[target] = 1.0
                used_canonical.add(target)
                continue
        # Substring match
        matched = False
        for alias_norm, canonical in alias_to_canonical.items():
            if canonical in used_canonical:
                continue
            if alias_norm in norm or norm in alias_norm:
                mapping[col] = canonical
                confidence[canonical] = 0.8
                used_canonical.add(canonical)
                matched = True
                break
        if not matched:
            mapping[col] = None

    unmapped = [col for col, target in mapping.items() if target is None]
    required = [c for c, m in CANONICAL_COLUMNS.items() if m["required"]]
    found_required = [r for r in required if r in used_canonical]
    coverage = len(found_required) / len(required) if required else 1.0

    return {
        "mapping": mapping,
        "confidence": confidence,
        "unmapped": unmapped,
        "coverage": coverage,
        "required_found": found_required,
        "required_missing": [r for r in required if r not in used_canonical],
    }


def apply_mapping(df: pd.DataFrame, mapping: dict[str, Optional[str]]) -> pd.DataFrame:
    """Rename columns according to mapping, drop unmapped columns."""
    rename_map = {orig: target for orig, target in mapping.items() if target is not None}
    return df.rename(columns=rename_map)[[v for v in rename_map.values()]]
