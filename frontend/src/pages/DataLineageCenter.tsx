import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Layers
} from 'lucide-react';
import { fetchLineage } from '../services/api';
import type { LineageGraph } from '../types';

export const DataLineageCenter: React.FC = () => {
  const [lineage, setLineage] = useState<LineageGraph | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchLineage();
        setLineage(res);
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
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">End-to-End Visual Data Lineage Graph</h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time pipeline dependency graph from raw ingestion sources through data quality gates, feature stores, ML inference, and actuation.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#0e131f] border border-slate-800/90 shadow-lg space-y-6">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Pipeline Stages & Flow Graph
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lineage?.nodes?.map((node) => (
            <div key={node.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">{node.type}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">{node.status}</span>
                </div>
                <h3 className="font-bold text-white text-sm">{node.label}</h3>
              </div>

              <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/60">
                {node.events && <div>Throughput: <strong className="text-slate-200">{node.events}</strong></div>}
                {node.latency && <div>Latency: <strong className="text-cyan-300">{node.latency}</strong></div>}
                {node.score && <div>Health: <strong className="text-emerald-400">{node.score}</strong></div>}
                {node.auc && <div>ROC-AUC: <strong className="text-amber-300">{node.auc}</strong></div>}
                {node.actions && <div>Actions: <strong className="text-slate-200">{node.actions}</strong></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
