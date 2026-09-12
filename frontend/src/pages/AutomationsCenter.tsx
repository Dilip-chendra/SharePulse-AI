import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Power,
  RefreshCw
} from 'lucide-react';
import { fetchAutomations, toggleAutomationRule, submitAutomationApproval } from '../services/api';
import type { AutomationRule, ApprovalRequest } from '../types';

export const AutomationsCenter: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([]);

  const loadData = async () => {
    try {
      const res = await fetchAutomations();
      setRules(res.rules || []);
      setApprovalQueue(res.approval_queue || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await toggleAutomationRule(id, !active);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproval = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      await submitAutomationApproval(id, decision, 'Approved via Enterprise Console');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0b101d] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Automations & Human-in-the-Loop Governance</h1>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic policy triggers, automated campaign routing, and strict approval barriers for high-budget interventions.
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800/90 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Human-in-the-Loop Approval Barrier ({approvalQueue.filter(a => a.status === 'PENDING_APPROVAL').length} Pending)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Immutable audit log attestation</span>
        </div>

        <div className="space-y-3">
          {approvalQueue.map((item) => (
            <div key={item.approval_id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{item.approval_id}</span>
                  <span className="font-bold text-indigo-300">{item.rule_name}</span>
                  <span className={`px-2 py-0.2 rounded font-mono text-[10px] font-bold ${
                    item.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    item.status === 'REJECTED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-slate-400">{item.action} (Target: <strong className="text-slate-200">{item.target_customers.toLocaleString()} cardholders</strong>)</div>
                <div className="text-slate-500 text-[11px]">Proposed by: {item.proposed_by} | Expected ROI: {item.expected_roi}x</div>
              </div>

              {item.status === 'PENDING_APPROVAL' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproval(item.approval_id, 'APPROVED')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/30 font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(item.approval_id, 'REJECTED')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/30 font-semibold"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#0e131f] border border-slate-800/90 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          Active Automation Policy Rules
        </h2>

        <div className="divide-y divide-slate-800/60">
          {rules.map((rule) => (
            <div key={rule.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-cyan-300 font-bold">{rule.id}</span>
                  <span className="font-semibold text-white">{rule.name}</span>
                  <span className="px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">{rule.governance_mode}</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">IF {rule.trigger} THEN {rule.action}</div>
                <div className="text-slate-500 text-[10px] mt-1">Executions count: {rule.executions_count.toLocaleString()}</div>
              </div>

              <button
                onClick={() => handleToggle(rule.id, rule.active)}
                className={`p-2 rounded-xl transition-all ${
                  rule.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                }`}
                title={rule.active ? 'Disable rule' : 'Enable rule'}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
