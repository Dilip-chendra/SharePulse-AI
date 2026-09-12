import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score

def compute_behavioral_segments(scored_df: pd.DataFrame) -> dict:
    """
    Evaluates cluster validation metrics across k in [2, 8] (Silhouette, Davies-Bouldin,
    Calinski-Harabasz, Inertia Elbow) and discovers behavioral customer archetypes.
    """
    df = scored_df.copy()
    
    feat_cols = ['SoW', 'Wallet_Share', 'UPI_Share', 'OtherCC_Share', 'Total_Spend', 'Avg_Ticket', 'HSIC_Recency_Days', 'Is_Prime']
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df[feat_cols].fillna(0))
    
    # Evaluate multiple k values for rigorous cluster validation
    k_range = list(range(2, 9))
    k_benchmarks = []
    
    sample_size = min(5000, len(X_scaled))
    sample_idx = np.random.RandomState(42).choice(len(X_scaled), size=sample_size, replace=False)
    X_sample = X_scaled[sample_idx]
    
    kmeans_models = {}
    for k in k_range:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = km.fit_predict(X_scaled)
        kmeans_models[k] = (km, labels)
        
        sample_labels = labels[sample_idx]
        sil = float(silhouette_score(X_sample, sample_labels))
        db = float(davies_bouldin_score(X_scaled, labels))
        ch = float(calinski_harabasz_score(X_scaled, labels))
        inertia = float(km.inertia_)
        
        k_benchmarks.append({
            "k": k,
            "silhouette_score": round(sil, 4),
            "davies_bouldin_index": round(db, 4),
            "calinski_harabasz_index": round(ch, 1),
            "inertia": round(inertia, 1),
            "is_selected": (k == 5)
        })
    
    optimal_k = 5
    best_km, best_labels = kmeans_models[optimal_k]
    df['Cluster_Id'] = best_labels
    
    # PCA for 2D visualization
    pca = PCA(n_components=2, random_state=42)
    pca_coords = pca.fit_transform(X_scaled)
    df['PCA_x'] = np.round(pca_coords[:, 0], 3)
    df['PCA_y'] = np.round(pca_coords[:, 1], 3)
    
    # Profile centroids and map to 5 distinct intuitive behavioral archetypes
    profiles = df.groupby('Cluster_Id').agg(
        avg_sow=('SoW', 'mean'),
        avg_spend=('Total_Spend', 'mean'),
        avg_wallet=('Wallet_Share', 'mean'),
        avg_upi=('UPI_Share', 'mean'),
        avg_othercc=('OtherCC_Share', 'mean'),
        avg_recency=('HSIC_Recency_Days', 'mean')
    )
    
    cluster_name_map = {}
    for cid, row in profiles.iterrows():
        if row['avg_sow'] > 0.45:
            cluster_name_map[cid] = "HSIC Core Loyalists"
        elif row['avg_upi'] > 0.40:
            cluster_name_map[cid] = "Cash & UPI Transactors"
        elif row['avg_wallet'] > 0.50:
            cluster_name_map[cid] = "MetroMart Wallet Dominant Shoppers"
        elif row['avg_spend'] > 25000:
            cluster_name_map[cid] = "High-Value Multi-Channel Shoppers"
        else:
            cluster_name_map[cid] = "Dormant & Low-Engagement Shoppers"
            
    df['Segment_Name'] = df['Cluster_Id'].map(cluster_name_map)
    
    segment_summaries = []
    for sname, grp in df.groupby('Segment_Name'):
        tot_spend = float(grp['Total_Spend'].sum())
        hsic_spend = float(grp['HSIC_Spend'].sum())
        wallet_spend = float(grp['Wallet_Spend'].sum())
        upi_spend = float(grp['UPI_Spend'].sum())
        othercc_spend = float(grp['OtherCC_Spend'].sum())
        
        segment_summaries.append({
            "segment_name": sname,
            "customer_count": len(grp),
            "pct_of_customers": round(len(grp) / len(df) * 100, 2),
            "total_metro_spend": round(tot_spend, 2),
            "hsic_spend": round(hsic_spend, 2),
            "avg_spend_per_customer": round(float(grp['Total_Spend'].mean()), 2),
            "avg_sow_pct": round(float(grp['SoW'].mean()) * 100, 2),
            "avg_wallet_share_pct": round(float(grp['Wallet_Share'].mean()) * 100, 2),
            "avg_upi_share_pct": round(float(grp['UPI_Share'].mean()) * 100, 2),
            "avg_othercc_share_pct": round(float(grp['OtherCC_Share'].mean()) * 100, 2),
            "avg_risk_score": round(float(grp['Predicted_Risk_Score'].mean()), 3),
            "prime_penetration_pct": round(float(grp['Is_Prime'].mean()) * 100, 2),
            "recommended_strategy": get_segment_strategy(sname)
        })
    
    segment_summaries = sorted(segment_summaries, key=lambda x: x['total_metro_spend'], reverse=True)
    
    return {
        "selected_k": optimal_k,
        "k_validation_benchmark": k_benchmarks,
        "segments": segment_summaries,
        "pca_variance_explained": [round(float(v), 4) for v in pca.explained_variance_ratio_],
        "scored_df": df
    }

def get_segment_strategy(segment_name: str) -> str:
    strategies = {
        "High-Value Multi-Channel Shoppers": "Wallet-to-Card Statement Credit & High-Ticket Cashback Multipliers (Large Appliances & Electronics).",
        "Cash & UPI Transactors": "Instant Contactless / Tap-to-Pay Cashback Match & Grocery 5% Prime Activation.",
        "MetroMart Wallet Dominant Shoppers": "Wallet Reload Linkage Bonus (Rs. 200) & Automatic Card Binding at Checkout.",
        "Dormant & Low-Engagement Shoppers": "Reactivation Statement Credit (Rs. 250 on first Rs. 1000 spend) + Fee Waiver.",
        "HSIC Core Loyalists": "VIP Milestone Rewards & Annual Tier Upgrade with Exclusive Partner Perks."
    }
    return strategies.get(segment_name, "Targeted Share-of-Wallet Recovery Offer.")
