import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
  accentColor?: "brand" | "rose" | "emerald" | "amber" | "cyan";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  delta,
  isPositive,
  icon: Icon,
  accentColor = "brand"
}) => {
  const colorMap = {
    brand: "text-brand-400 border-brand-500/20 bg-brand-950/20",
    rose: "text-accent-rose border-accent-rose/20 bg-rose-950/20",
    emerald: "text-accent-emerald border-accent-emerald/20 bg-emerald-950/20",
    amber: "text-accent-amber border-accent-amber/20 bg-amber-950/20",
    cyan: "text-accent-cyan border-accent-cyan/20 bg-cyan-950/20"
  };

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5 hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase font-mono">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${colorMap[accentColor]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        {delta && (
          <span className={`text-xs font-semibold ${isPositive ? "text-accent-emerald" : "text-accent-rose"}`}>
            {delta}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-1.5">{subtitle}</p>
      )}
    </div>
  );
};
