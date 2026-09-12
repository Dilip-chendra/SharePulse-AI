import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Shield, X, ArrowRight } from 'lucide-react';
import { fetchAlerts, acknowledgeAlert, resolveAlert } from '../../services/api';
import type { AlertItem } from '../../types';

interface NotificationCenterProps {
  onNavigateAlerts?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onNavigateAlerts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await fetchAlerts();
      setAlerts(data.alerts || []);
    } catch (e) {
      console.error("Failed to load alerts", e);
    }
  };

  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED');
  const criticalCount = activeAlerts.filter(a => a.severity === 'CRITICAL').length;

  const handleAcknowledge = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await acknowledgeAlert(id);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await resolveAlert(id);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        title="Incident Notification Center"
      >
        <Bell className="w-4 h-4 text-slate-300" />
        {activeAlerts.length > 0 && (
          <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full text-white ${criticalCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'}`}>
            {activeAlerts.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-2xl bg-[#0e131f] border border-slate-700/80 shadow-2xl shadow-indigo-950/60 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-white">Active Incidents</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono">
                {activeAlerts.length} Open
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-2">
            {activeAlerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                All active anomaly gates normal. Zero pending incidents.
              </div>
            ) : (
              activeAlerts.map(alert => (
                <div key={alert.id} className="p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        alert.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">{alert.id}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{alert.detected_time}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 mb-1">{alert.title}</div>
                  <div className="text-[11px] text-slate-400 mb-2">Impact: <span className="text-amber-300 font-medium">{alert.estimated_impact}</span></div>

                  <div className="flex items-center gap-2">
                    {alert.status === 'OPEN' && (
                      <button
                        onClick={(e) => handleAcknowledge(alert.id, e)}
                        className="px-2 py-1 text-[11px] rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={(e) => handleResolve(alert.id, e)}
                      className="px-2 py-1 text-[11px] rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/30 transition-colors"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-slate-800 bg-slate-900/60">
            <button
              onClick={() => {
                setIsOpen(false);
                if (onNavigateAlerts) onNavigateAlerts();
              }}
              className="w-full py-2 text-center text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center gap-1"
            >
              View Full Incident Console <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
