import pandas as pd
import numpy as np

def build_customer_features(active_tx: pd.DataFrame, cust_df: pd.DataFrame) -> pd.DataFrame:
    """
    Constructs a customer-level 360-degree feature matrix covering RFM,
    payment shares, category shares, trajectories, and account attributes.
    """
    # 0. Dynamic Reference Date
    if 'Transaction_Date' in active_tx.columns and len(active_tx) > 0:
        ref_date = pd.to_datetime(active_tx['Transaction_Date']).max()
    else:
        ref_date = pd.to_datetime('2026-07-31')
    
    # 1. Base aggregations across full observation window
    tot_spend = active_tx.groupby('Customer_ID')['Net_Amount'].sum()
    tx_cnt = active_tx.groupby('Customer_ID')['Tx_Count'].sum()
    sales_cnt = active_tx[active_tx['Transaction_Type']=='Sale'].groupby('Customer_ID').size()
    ret_cnt = active_tx[active_tx['Transaction_Type']=='Return'].groupby('Customer_ID').size()
    
    # Payment-specific net spend
    hsic_spend = active_tx[active_tx['Payment_Code'] == 3].groupby('Customer_ID')['Net_Amount'].sum()
    wallet_spend = active_tx[active_tx['Payment_Code'] == 5].groupby('Customer_ID')['Net_Amount'].sum()
    upi_spend = active_tx[active_tx['Payment_Code'] == 4].groupby('Customer_ID')['Net_Amount'].sum()
    othercc_spend = active_tx[active_tx['Payment_Code'] == 2].groupby('Customer_ID')['Net_Amount'].sum()
    debit_spend = active_tx[active_tx['Payment_Code'] == 1].groupby('Customer_ID')['Net_Amount'].sum()
    
    # Category-specific net spend
    groc_spend = active_tx[active_tx['Category_Code'] == 1].groupby('Customer_ID')['Net_Amount'].sum()
    elec_spend = active_tx[active_tx['Category_Code'] == 2].groupby('Customer_ID')['Net_Amount'].sum()
    furn_spend = active_tx[active_tx['Category_Code'] == 5].groupby('Customer_ID')['Net_Amount'].sum()
    appl_spend = active_tx[active_tx['Category_Code'] == 7].groupby('Customer_ID')['Net_Amount'].sum()
    trav_spend = active_tx[active_tx['Category_Code'] == 9].groupby('Customer_ID')['Net_Amount'].sum()
    
    # High-ticket spend (sales >= 5000)
    high_ticket_spend = active_tx[(active_tx['Transaction_Type']=='Sale') & (active_tx['Transaction_Amount']>=5000)].groupby('Customer_ID')['Transaction_Amount'].sum()
    
    # Recency
    last_tx_date = active_tx.groupby('Customer_ID')['Transaction_Date'].max()
    last_hsic_date = active_tx[active_tx['Payment_Code'] == 3].groupby('Customer_ID')['Transaction_Date'].max()
    
    # Fiscal Year trajectory (dynamically select most recent two periods)
    unique_fys = sorted(active_tx['Fiscal_Year'].unique()) if 'Fiscal_Year' in active_tx.columns and len(active_tx) > 0 else ['FY25', 'FY26']
    fy_prev = unique_fys[-2] if len(unique_fys) >= 2 else (unique_fys[0] if unique_fys else 'FY25')
    fy_curr = unique_fys[-1] if len(unique_fys) >= 2 else (unique_fys[0] if unique_fys else 'FY26')
    
    fy25_tot = active_tx[active_tx['Fiscal_Year'] == fy_prev].groupby('Customer_ID')['Net_Amount'].sum()
    fy26_tot = active_tx[active_tx['Fiscal_Year'] == fy_curr].groupby('Customer_ID')['Net_Amount'].sum()
    fy25_hsic = active_tx[(active_tx['Fiscal_Year'] == fy_prev) & (active_tx['Payment_Code'] == 3)].groupby('Customer_ID')['Net_Amount'].sum()
    fy26_hsic = active_tx[(active_tx['Fiscal_Year'] == fy_curr) & (active_tx['Payment_Code'] == 3)].groupby('Customer_ID')['Net_Amount'].sum()
    
    # Build dataframe for cardholders
    card_custs = cust_df[cust_df['Credit_Card_Open_Date'].notnull()].set_index('Customer_ID')
    
    features = pd.DataFrame(index=card_custs.index)
    features['Total_Spend'] = tot_spend.reindex(features.index).fillna(0)
    features['HSIC_Spend'] = hsic_spend.reindex(features.index).fillna(0)
    features['Wallet_Spend'] = wallet_spend.reindex(features.index).fillna(0)
    features['UPI_Spend'] = upi_spend.reindex(features.index).fillna(0)
    features['OtherCC_Spend'] = othercc_spend.reindex(features.index).fillna(0)
    features['Debit_Spend'] = debit_spend.reindex(features.index).fillna(0)
    
    features['Grocery_Spend'] = groc_spend.reindex(features.index).fillna(0)
    features['Electronics_Spend'] = elec_spend.reindex(features.index).fillna(0)
    features['Furniture_Spend'] = furn_spend.reindex(features.index).fillna(0)
    features['Appliances_Spend'] = appl_spend.reindex(features.index).fillna(0)
    features['Travel_Spend'] = trav_spend.reindex(features.index).fillna(0)
    features['High_Ticket_Spend'] = high_ticket_spend.reindex(features.index).fillna(0)
    
    features['Tx_Count'] = tx_cnt.reindex(features.index).fillna(0)
    features['Sales_Count'] = sales_cnt.reindex(features.index).fillna(0)
    features['Returns_Count'] = ret_cnt.reindex(features.index).fillna(0)
    features['Return_Rate'] = np.where(features['Sales_Count'] > 0, features['Returns_Count'] / features['Sales_Count'], 0.0)
    
    # Shares
    features['SoW'] = np.where(features['Total_Spend'] > 0, (features['HSIC_Spend'] / features['Total_Spend']).clip(0, 1), 0.0)
    features['Wallet_Share'] = np.where(features['Total_Spend'] > 0, (features['Wallet_Spend'] / features['Total_Spend']).clip(0, 1), 0.0)
    features['UPI_Share'] = np.where(features['Total_Spend'] > 0, (features['UPI_Spend'] / features['Total_Spend']).clip(0, 1), 0.0)
    features['OtherCC_Share'] = np.where(features['Total_Spend'] > 0, (features['OtherCC_Spend'] / features['Total_Spend']).clip(0, 1), 0.0)
    features['Debit_Share'] = np.where(features['Total_Spend'] > 0, (features['Debit_Spend'] / features['Total_Spend']).clip(0, 1), 0.0)
    features['Avg_Ticket'] = np.where(features['Tx_Count'] > 0, features['Total_Spend'] / features['Tx_Count'], 0.0)
    
    # Recency
    last_tx_dt = pd.to_datetime(last_tx_date.reindex(features.index))
    last_hs_dt = pd.to_datetime(last_hsic_date.reindex(features.index))
    features['Overall_Recency_Days'] = (ref_date - last_tx_dt).dt.days.fillna(730)
    features['HSIC_Recency_Days'] = (ref_date - last_hs_dt).dt.days.fillna(730)
    
    # FY25 vs FY26 Trajectory
    features['FY25_Total'] = fy25_tot.reindex(features.index).fillna(0)
    features['FY26_Total'] = fy26_tot.reindex(features.index).fillna(0)
    features['FY25_HSIC'] = fy25_hsic.reindex(features.index).fillna(0)
    features['FY26_HSIC'] = fy26_hsic.reindex(features.index).fillna(0)
    
    features['FY25_SoW'] = np.where(features['FY25_Total'] > 0, (features['FY25_HSIC'] / features['FY25_Total']).clip(0, 1), 0.0)
    features['FY26_SoW'] = np.where(features['FY26_Total'] > 0, (features['FY26_HSIC'] / features['FY26_Total']).clip(0, 1), 0.0)
    features['Delta_SoW'] = features['FY26_SoW'] - features['FY25_SoW']
    features['Delta_HSIC_Spend'] = features['FY26_HSIC'] - features['FY25_HSIC']
    
    # Account & Profile
    features['Age'] = card_custs['Age'].fillna(38)
    features['Gender'] = card_custs['Gender'].fillna('Unknown')
    features['Membership_Type'] = card_custs['Membership_Type'].fillna('Non-Prime')
    features['Is_Prime'] = (features['Membership_Type'] == 'Prime').astype(int)
    features['Credit_Card_Limit'] = card_custs['Credit_Card_Limit'].fillna(200000)
    features['Credit_Card_APR'] = card_custs['Credit_Card_APR'].fillna(31.5)
    
    open_dt = pd.to_datetime(card_custs['Credit_Card_Open_Date'])
    close_dt = pd.to_datetime(card_custs['Credit_Card_Closed_Date'])
    features['Card_Tenure_Days'] = (ref_date - open_dt).dt.days
    features['Is_Closed'] = close_dt.notnull().astype(int)
    features['Closed_Date'] = close_dt.dt.strftime('%Y-%m-%d')
    
    return features.reset_index()
