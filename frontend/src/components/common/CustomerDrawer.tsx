import React, { useEffect, useState } from 'react';
import { useFilters } from '../../context/FilterContext';
import { fetchCustomerDetail } from '../../services/api';
import type { Customer } from '../../types';
import { 
  X, 
  User, 
  Zap, 
  Crown, 
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';

export const CustomerDrawer: React.FC = () => {
  const { selectedCustomerId, setSelectedCustomerId } = useFilters();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [riskDrivers, setRiskDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedCustomerId) return;
    setLoading(true);
    fetchCustomerDetail(selectedCustomerId)
      .then((res: any) => {
        setCustomer(res.profile);
        setRiskDrivers(res.risk_drivers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCustomerId]);

  if (!selectedCustomerId) return null;

  const paymentData = customer ? [
    { name: "HSIC Card", value: customer.HSIC_Spend, color: "#6366F1" },
    { name: "MetroMart Wallet", value: customer.Wallet_Spend, color: "#F59E0B" },
    { name: "Cash/UPI", value: customer.UPI_Spend, color: "#10B981" },
    { name: "Other Credit Cards", value: customer.OtherCC_Spend, color: "#EC4899" },
    { name: "Debit Card", value: customer.Debit_Spend, color: "#06B6D4" },
  ].filter(d => Number(d.value || 0) > 0) : [];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[580px] bg-surface-card border-l border-surface-border shadow-2xl z-50 flex flex-col">
      <div className="h-16 px-6 border-b border-surface-border flex items-center justify-between bg-surface-cardMuted">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white font-mono">Customer #{selectedCustomerId}</h3>
              {customer?.Is_Prime === 1 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/30 flex items-center">
                  <Crown className="w-3 h-3 mr-1" /> PRIME
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">{customer?.Segment_Name} • {customer?.Customer_State}</p>
          </div>
        </div>
        <button
          onClick={() => setSelectedCustomerId(null)}
          className="p-1.5 rounded-lg hover:bg-surface-hover text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {loading || !customer ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Loading 360-degree customer intelligence...
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-sans">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-dark border border-surface-border rounded-lg p-3">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Total Metro Spend</span>
              <p className="text-base font-bold text-white mt-1">₹{customer.Total_Spend.toLocaleString()}</p>
            </div>
            <div className="bg-surface-dark border border-surface-border rounded-lg p-3">
              <span className="text-[10px] text-slate-500 uppercase font-mono">HSIC SoW</span>
              <p className="text-base font-bold text-brand-300 mt-1">{(customer.SoW * 100).toFixed(1)}%</p>
              <span className={`text-[10px] font-semibold ${customer.Delta_SoW >= 0 ? "text-accent-emerald" : "text-accent-rose"}`}>
                {customer.Delta_SoW >= 0 ? "+" : ""}{(customer.Delta_SoW * 100).toFixed(1)} pp FY26
              </span>
            </div>
            <div className="bg-surface-dark border border-surface-border rounded-lg p-3">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Predicted Risk</span>
              <p className="text-base font-bold text-accent-rose mt-1">{customer.Predicted_Risk_Score.toFixed(2)}</p>
              <span className="text-[10px] text-slate-400 font-mono">Recoverability: {customer.Recoverability_Score.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-brand-950/60 to-surface-card border border-brand-500/40 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-brand-300 font-bold mb-1">
              <Zap className="w-4 h-4 text-brand-400" />
              <span>Recommended Next Best Action</span>
            </div>
            <p className="text-sm font-semibold text-white mb-2">{customer.Recommended_NBA}</p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-border text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block">Recoverable Opp:</span>
                <span className="font-bold text-accent-emerald">₹{customer.Recoverable_Opportunity.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Intervention Cost:</span>
                <span className="font-bold text-slate-200">₹{customer.Intervention_Cost}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Net Contribution:</span>
                <span className="font-bold text-brand-300">₹{customer.Expected_Net_Contribution.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2 flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-accent-rose" />
              <span>Model Risk Drivers & Diagnosis</span>
            </h4>
            <div className="space-y-2">
              {riskDrivers.map((d, i) => (
                <div key={i} className="bg-surface-dark border border-surface-border rounded-lg p-3 flex items-start justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">{d.driver}</span>
                    <span className="text-[11px] text-slate-400">{d.detail}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    d.impact.includes("High") 
                      ? "bg-rose-950/60 text-accent-rose border-rose-500/30"
                      : d.impact.includes("Opportunity")
                      ? "bg-amber-950/60 text-accent-amber border-amber-500/30"
                      : "bg-emerald-950/60 text-accent-emerald border-emerald-500/30"
                  }`}>
                    {d.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2">
              Payment Method Spend Allocation
            </h4>
            <div className="bg-surface-dark border border-surface-border rounded-xl p-4 h-48 flex items-center justify-between">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentData} dataKey="value" innerRadius={35} outerRadius={60} paddingAngle={3}>
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, "Spend"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-1.5 pl-2">
                {paymentData.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.color }}></span>
                      <span className="text-slate-400">{p.name}</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-200">₹{(p.value ?? 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-dark border border-surface-border rounded-xl p-4 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between py-1 border-b border-surface-border/50">
              <span className="text-slate-500">Credit Limit</span>
              <span className="text-slate-200 font-semibold">₹{(customer.Credit_Card_Limit ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-border/50">
              <span className="text-slate-500">Card APR</span>
              <span className="text-slate-200 font-semibold">{customer.Credit_Card_APR}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-border/50">
              <span className="text-slate-500">Card Tenure</span>
              <span className="text-slate-200 font-semibold">{((customer.Card_Tenure_Days ?? 0) / 365).toFixed(1)} Years</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Account Status</span>
              <span className={`font-semibold ${(customer.Is_Closed ?? 0) === 1 ? "text-accent-rose" : "text-accent-emerald"}`}>
                {(customer.Is_Closed ?? 0) === 1 ? "Closed" : "Active / Open"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
