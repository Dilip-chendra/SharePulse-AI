import React from 'react';

interface ClassificationBadgeProps {
  type: "OBSERVED" | "MODEL_DERIVED" | "HYPOTHESIS" | "PROPOSED" | "Observed" | "Model-Derived" | "Hypothesis" | "Proposed" | string;
  size?: "sm" | "md";
}

export const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({ type, size = "sm" }) => {
  const normType = (type || "").toUpperCase().replace("-", "_");

  const config: Record<string, { label: string; style: string }> = {
    "OBSERVED": {
      label: "OBSERVED FACT",
      style: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
    },
    "MODEL_DERIVED": {
      label: "MODEL DERIVED",
      style: "bg-indigo-950/80 text-indigo-300 border-indigo-500/40"
    },
    "HYPOTHESIS": {
      label: "HYPOTHESIS",
      style: "bg-amber-950/80 text-amber-300 border-amber-500/40"
    },
    "PROPOSED": {
      label: "PROPOSED ACTION",
      style: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40"
    }
  };

  const item = config[normType] || {
    label: (type || "UNKNOWN").toUpperCase(),
    style: "bg-slate-800 text-slate-300 border-slate-700"
  };

  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span className={`inline-flex items-center font-mono font-bold tracking-wider rounded border shadow-sm ${sizeClasses} ${item.style}`}>
      {item.label}
    </span>
  );
};
