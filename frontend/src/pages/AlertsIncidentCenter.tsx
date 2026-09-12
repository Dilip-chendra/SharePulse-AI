import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  RefreshCw
} from 'lucide-react';
import { fetchAlerts, acknowledgeAlert, resolveAlert } from '../services/api';
import type { AlertItem } from '../types';
import { ClassificationBadge } from '../components/common/ClassificationBadge';

export const AlertsIncidentCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  

  const loadAlerts = async () => {
    try {
      
      const data = await fetchAlerts();
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error(err);
    } finally {
      
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert(id);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await resolveAlert(id);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b101d] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Adaptive Alerts & Incident Center</h1>
            <p className="text-xs text-slate-400 mt-1">
              Statistical and machine learning anomaly detection incidents with multi-dimension root-cause decomposition and actionable playbooks.
            </p>
          </div>
        </div>

        <button
          onClick={loadAlerts}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Incidents</span>
        </button>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-5 rounded-2xl border shadow-lg transition-all ${
              alert.status === 'RESOLVED' ? 'bg-[#0a0e17]/60 border-slate-800/60 opacity-75' :
              alert.severity === 'CRITICAL' ? 'bg-[#120b12] border-red-900/50 shadow-red-950/20' :
              'bg-[#0e131f] border-slate-800/90'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded ${
                  alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                  alert.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  {alert.severity}
                </span>

                <span className="font-mono text-xs font-bold text-slate-300">{alert.id}</span>
                <span className="text-xs text-slate-500">• {alert.detected_time}</span>
                <ClassificationBadge type={alert.taxonomy} />
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                  alert.status === 'OPEN' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  alert.status === 'INVESTIGATING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {alert.status}
                </span>

                {alert.status === 'OPEN' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 text-xs font-semibold transition-all"
                  >
                    Acknowledge
                  </button>
                )}

                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/30 text-xs font-semibold transition-all"
                  >
                    Resolve Incident
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-base font-bold text-white mb-2">{alert.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 text-xs">
              <div>
                <span className="text-slate-500 block">Affected Metric</span>
                <span className="text-slate-200 font-semibold">{alert.affected_metric}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Affected Customer Base</span>
                <span className="text-slate-200 font-semibold">{alert.affected_customers.toLocaleString()} Cardholders</span>
              </div>
              <div>
                <span className="text-slate-500 block">Financial Impact</span>
                <span className="text-amber-300 font-bold font-mono">{alert.estimated_impact}</span>
              </div>
            </div>

            {/* Root Causes */}
            <div className="space-y-1.5 mb-3 text-xs">
              <span className="text-slate-400 font-semibold">Identified Empirical Root Causes:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {alert.likely_causes?.map((cause, cIdx) => (
                  <li key={cIdx}>{cause}</li>
                ))}
              </ul>
            </div>

            {/* Recommended Action */}
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs flex items-center justify-between gap-3">
              <div className="text-indigo-200">
                <strong className="text-white">Recommended Remediation Playbook:</strong> {alert.recommended_action}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
