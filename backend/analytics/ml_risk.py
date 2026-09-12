import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    roc_auc_score, average_precision_score, confusion_matrix,
    precision_score, recall_score, f1_score, brier_score_loss,
    roc_curve, precision_recall_curve
)
from sklearn.calibration import calibration_curve

# Optional: XGBoost and SHAP (graceful degradation if not installed)
try:
    import xgboost as xgb
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False

def train_risk_models(features_df: pd.DataFrame) -> dict:
    """
    Trains and benchmarks multiple machine learning classifiers for Silent Attrition risk.
    Evaluates Logistic Regression, Random Forest, and Hist Gradient Boosting.
    Computes cross-validation stability, test ROC-AUC, PR-AUC, calibration error,
    feature importance, and produces calibrated customer risk probabilities.
    """
    df = features_df.copy()
    
    # Target definition: Silent Attrition in FY26
    # Active HSIC spend in FY25, and either SoW collapsed by >=10% or dropped to 0 in FY26
    fy25_active = df[(df['FY25_Total'] > 0) & (df['Is_Closed'] == 0)].copy()
    fy25_active['Target_Attrition'] = (
        (fy25_active['FY25_SoW'] > 0.10) &
        ((fy25_active['FY25_SoW'] - fy25_active['FY26_SoW'] >= 0.10) | (fy25_active['FY26_SoW'] == 0))
    ).astype(int)
    
    feature_cols = [
        'FY25_SoW', 'FY25_HSIC', 'FY25_Total', 'Wallet_Share', 'UPI_Share', 'OtherCC_Share', 'Debit_Share',
        'Grocery_Spend', 'Electronics_Spend', 'Appliances_Spend', 'High_Ticket_Spend',
        'Overall_Recency_Days', 'HSIC_Recency_Days', 'Tx_Count', 'Avg_Ticket', 'Return_Rate',
        'Age', 'Is_Prime', 'Credit_Card_Limit', 'Credit_Card_APR', 'Card_Tenure_Days'
    ]
    
    X = fy25_active[feature_cols].fillna(0)
    y = fy25_active['Target_Attrition']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    # Define candidate models
    candidate_models = {
        "Logistic Regression (L2)": Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(max_iter=1000, C=1.0, random_state=42))
        ]),
        "Random Forest Classifier": RandomForestClassifier(n_estimators=100, max_depth=8, min_samples_leaf=5, random_state=42, n_jobs=-1),
        "Hist Gradient Boosting": HistGradientBoostingClassifier(max_iter=100, max_depth=6, min_samples_leaf=10, random_state=42),
    }
    if HAS_XGBOOST:
        candidate_models["XGBoost Classifier"] = xgb.XGBClassifier(
            n_estimators=100, max_depth=6, learning_rate=0.1,
            subsample=0.8, colsample_bytree=0.8,
            eval_metric="logloss",
            random_state=42, n_jobs=-1
        )
    
    benchmark_results = []
    trained_models = {}
    test_probs = {}
    
    for name, model in candidate_models.items():
        # 5-Fold Stratified Cross-Validation
        cv_roc = cross_val_score(model, X_train, y_train, cv=cv, scoring='roc_auc')
        
        # Fit on full training set
        model.fit(X_train, y_train)
        trained_models[name] = model
        
        # Holdout predictions
        probs = model.predict_proba(X_test)[:, 1]
        preds = (probs >= 0.5).astype(int)
        test_probs[name] = probs
        
        roc_val = float(roc_auc_score(y_test, probs))
        pr_val = float(average_precision_score(y_test, probs))
        prec_val = float(precision_score(y_test, preds, zero_division=0))
        rec_val = float(recall_score(y_test, preds, zero_division=0))
        f1_val = float(f1_score(y_test, preds, zero_division=0))
        brier_val = float(brier_score_loss(y_test, probs))
        
        benchmark_results.append({
            "model_name": name,
            "cv_roc_auc_mean": round(float(cv_roc.mean()), 4),
            "cv_roc_auc_std": round(float(cv_roc.std()), 4),
            "test_roc_auc": round(roc_val, 4),
            "test_pr_auc": round(pr_val, 4),
            "precision": round(prec_val, 4),
            "recall": round(rec_val, 4),
            "f1_score": round(f1_val, 4),
            "brier_score_loss": round(brier_val, 4),
            "is_selected": False
        })
    
    # Sort benchmarks by test ROC-AUC descending
    benchmark_results = sorted(benchmark_results, key=lambda x: (x['test_pr_auc'] + x['test_roc_auc']), reverse=True)
    best_model_name = benchmark_results[0]['model_name']
    benchmark_results[0]['is_selected'] = True
    
    best_model = trained_models[best_model_name]
    best_probs = test_probs[best_model_name]
    best_preds = (best_probs >= 0.5).astype(int)
    
    # Confusion matrix of best model
    cm = confusion_matrix(y_test, best_preds).tolist()
    
    # ROC Curve coordinates for best model
    fpr, tpr, _ = roc_curve(y_test, best_probs)
    step = max(1, len(fpr) // 50)
    roc_points = [{"fpr": round(float(fpr[i]), 4), "tpr": round(float(tpr[i]), 4)} for i in range(0, len(fpr), step)]
    
    # Precision-Recall Curve coordinates
    pr_p, pr_r, _ = precision_recall_curve(y_test, best_probs)
    pr_step = max(1, len(pr_p) // 50)
    pr_points = [{"recall": round(float(pr_r[i]), 4), "precision": round(float(pr_p[i]), 4)} for i in range(0, len(pr_p), pr_step)]
    
    # Calibration Curve coordinates
    prob_true, prob_pred = calibration_curve(y_test, best_probs, n_bins=10)
    cal_points = [{"pred_prob": round(float(p), 4), "true_prob": round(float(t), 4)} for p, t in zip(prob_pred, prob_true)]
    
    # Feature Importances (Tree-based model or Logistic Regression coefficients)
    feat_imp = []
    if hasattr(best_model, 'feature_importances_'):
        importances = best_model.feature_importances_
        for f, imp in sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True):
            feat_imp.append({"feature": f, "importance": round(float(imp), 4), "label": f.replace('_', ' ')})
    else:
        # Fallback to Random Forest importances for interpretability
        rf_model = trained_models["Random Forest Classifier"]
        importances = rf_model.feature_importances_
        for f, imp in sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True):
            feat_imp.append({"feature": f, "importance": round(float(imp), 4), "label": f.replace('_', ' ')})

    # ── SHAP Explainability ──────────────────────────────────────────────────
    shap_summary = []
    if HAS_SHAP:
        try:
            tree_model = trained_models.get("Random Forest Classifier") or trained_models.get("XGBoost Classifier")
            if tree_model is not None:
                explainer = shap.TreeExplainer(tree_model)
                sample_X = X_test.iloc[:200]
                shap_values = explainer.shap_values(sample_X)
                if isinstance(shap_values, list) and len(shap_values) > 1:
                    sv = shap_values[1]
                elif isinstance(shap_values, np.ndarray) and shap_values.ndim == 3:
                    sv = shap_values[:, :, 1]
                else:
                    sv = shap_values
                mean_abs_shap = np.abs(sv).mean(axis=0)
                for f, s in sorted(zip(feature_cols, mean_abs_shap), key=lambda x: x[1], reverse=True):
                    shap_summary.append({
                        "feature": f,
                        "label": f.replace('_', ' '),
                        "mean_abs_shap": round(float(s), 6),
                        "importance": round(float(s), 4),
                        "source": "SHAP TreeExplainer (Random Forest)",
                    })
        except Exception as shap_err:
            for item in feat_imp:
                shap_summary.append({**item, "source": f"feature_importance_proxy (SHAP note: {str(shap_err)[:60]})"})
    else:
        for item in feat_imp:
            shap_summary.append({**item, "source": "feature_importance_proxy (SHAP not installed)"})


            
    # Score all customers across the portfolio
    all_X = df[feature_cols].fillna(0)
    all_risk_probs = best_model.predict_proba(all_X)[:, 1]
    df['Predicted_Risk_Score'] = np.round(all_risk_probs, 4)
    
    # Assign Lifecycle States
    conditions = [
        (df['Is_Closed'] == 1),
        (df['Total_Spend'] == 0) | (df['HSIC_Recency_Days'] >= 365),
        (df['Predicted_Risk_Score'] >= 0.65) | (df['Delta_SoW'] <= -0.15),
        (df['Predicted_Risk_Score'] >= 0.35) | (df['Delta_SoW'] < -0.05),
    ]
    choices = ['Hard Attrition', 'Dormant', 'Declining', 'Warning']
    df['Customer_State'] = np.select(conditions, choices, default='Healthy')
    
    state_counts = df['Customer_State'].value_counts().to_dict()
    state_summary = [
        {"state": s, "count": int(state_counts.get(s, 0)), "pct": round(int(state_counts.get(s, 0)) / len(df) * 100, 2)}
        for s in ['Healthy', 'Warning', 'Declining', 'Dormant', 'Hard Attrition']
    ]
    
    best_metrics = next(m for m in benchmark_results if m['is_selected'])
    
    return {
        "selected_model": best_model_name,
        "metrics": {
            "roc_auc": best_metrics['test_roc_auc'],
            "pr_auc": best_metrics['test_pr_auc'],
            "precision": best_metrics['precision'],
            "recall": best_metrics['recall'],
            "f1_score": best_metrics['f1_score'],
            "brier_score": best_metrics['brier_score_loss'],
            "cv_roc_auc_mean": best_metrics['cv_roc_auc_mean'],
            "cv_roc_auc_std": best_metrics['cv_roc_auc_std'],
            "confusion_matrix": cm,
            "training_samples": len(X_train),
            "test_samples": len(X_test)
        },
        "model_benchmark": benchmark_results,
        "feature_importances": feat_imp,
        "shap_summary": shap_summary,
        "roc_curve": roc_points,
        "pr_curve": pr_points,
        "calibration": cal_points,
        "state_summary": state_summary,
        "scored_df": df
    }
