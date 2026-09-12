import pytest
import pandas as pd
from backend.analytics.schema_normalizer import detect_schema, apply_mapping

def test_schema_detection_canonical():
    df = pd.DataFrame(columns=[
        "Customer_ID", "Age", "Gender", "Membership_Type",
        "Credit_Card_Open_Date", "Credit_Card_Closed_Date",
        "Credit_Card_Limit", "Credit_Card_APR"
    ])
    result = detect_schema(df)
    assert "customer_id" in result["required_found"]
    assert result["mapping"]["Customer_ID"] == "customer_id"
    assert result["mapping"]["Age"] == "age"

def test_schema_detection_renamed_columns():
    df = pd.DataFrame(columns=[
        "cust_id", "customer_age", "loyalty_tier",
        "account_open_date", "closure_date", "credit_limit", "interest_rate"
    ])
    result = detect_schema(df)
    mapping = result["mapping"]
    assert mapping["cust_id"] == "customer_id"
    assert mapping["customer_age"] == "age"
    assert mapping["loyalty_tier"] == "membership_type"
    assert mapping["account_open_date"] == "credit_card_open_date"

def test_schema_detection_transaction_renamed():
    df = pd.DataFrame(columns=[
        "order_id", "purchase_date", "sales_amount", "order_type", "department", "payment"
    ])
    result = detect_schema(df)
    mapping = result["mapping"]
    assert mapping["order_id"] == "transaction_id"
    assert mapping["purchase_date"] == "transaction_date"
    assert mapping["sales_amount"] == "transaction_amount"
    assert mapping["order_type"] == "transaction_type"
    assert mapping["department"] == "category_code"
    assert mapping["payment"] == "payment_code"
