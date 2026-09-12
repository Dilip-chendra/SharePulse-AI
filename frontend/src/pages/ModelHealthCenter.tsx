import React, { useState, useEffect } from 'react';
import { 
  Shield
} from 'lucide-react';
import { fetchModelHealth } from '../services/api';
import type { ModelHealthData } from '../types';

export const ModelHealthCenter: React.FC = () => {
  const [data, setData] = useState<ModelHealthData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchModelHealth();
        setData(res);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0b101d] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Model Governance & Population Stability (PSI)</h1>
            <p className="text-xs text-slate-400 mt-1">
              Production ML telemetry tracking ROC-AUC, Brier score loss, calibration drift, and inference latency across all live models.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {data?.models?.map((m, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800/90 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {m.status}
              </span>
              <span className="text-xs text-slate-500 font-mono">{m.version}</span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{m.model_name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{m.role}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 font-mono">
              {m.test_roc_auc && (
                <div>
                  <span className="text-slate-500 block text-[10px]">ROC-AUC</span>
                  <span className="text-emerald-400 font-bold">{m.test_roc_auc}</span>
                </div>
              )}
              {m.brier_score_loss && (
                <div>
                  <span className="text-slate-500 block text-[10px]">Brier Score</span>
                  <span className="text-cyan-300 font-bold">{m.brier_score_loss}</span>
                </div>
              )}
              {m.silhouette_score && (
                <div>
                  <span className="text-slate-500 block text-[10px]">Silhouette</span>
                  <span className="text-emerald-400 font-bold">{m.silhouette_score}</span>
                </div>
              )}
              {m.concordance_index && (
                <div>
                  <span className="text-slate-500 block text-[10px]">C-Index</span>
                  <span className="text-emerald-400 font-bold">{m.concordance_index}</span>
                </div>
              )}
              <div>
                <span className="text-slate-500 block text-[10px]">Avg Latency</span>
                <span className="text-slate-200">{m.avg_inference_latency_ms} ms</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Drift Status</span>
                <span className="text-emerald-400">{m.feature_drift_status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
