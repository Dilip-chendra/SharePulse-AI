import React, { useState } from 'react';
import { useFilters } from '../../context/FilterContext';
import { Filter, Crown, Tag, Shapes, RotateCcw, Check, Sparkles } from 'lucide-react';

export const GlobalFilterBar: React.FC = () => {
  const {
    setFiscalYear,
    setMembership,
    setSelectedCategory,
    setSelectedSegment,
    appliedFiscalYear,
    appliedMembership,
    appliedCategory,
    appliedSegment,
    isFilterApplied,
    applyFilters,
    resetFilters
  } = useFilters();

  const [appliedFeedback, setAppliedFeedback] = useState(false);

  const categories = [
    "All", "Grocery", "Electronics", "Large Appliances", "Furniture", 
    "Travel", "Apparel", "Outdoor", "Kids And Toys", "Beauty", "Bill Payments"
  ];

  const segments = [
    "All",
    "MetroMart Wallet Dominant Shoppers",
    "High-Value Multi-Channel Shoppers",
    "HSIC Core Loyalists",
    "Cash & UPI Transactors",
    "Dormant & Low-Engagement Shoppers"
  ];

  const handleApply = () => {
    applyFilters();
    setAppliedFeedback(true);
    setTimeout(() => setAppliedFeedback(false), 2000);
  };

  const handleReset = () => {
    resetFilters();
    setAppliedFeedback(false);
  };

  return (
    <div className="bg-[#0A0E18]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1.5 text-slate-400 font-medium">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-200">Global Filters:</span>
        </div>

        {/* Fiscal Year Toggle */}
        <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
          {["All", "FY25", "FY26"].map((fy) => (
            <button
              key={fy}
              type="button"
              onClick={() => {
                setFiscalYear(fy);
                setAppliedFeedback(true);
                setTimeout(() => setAppliedFeedback(false), 1500);
              }}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                appliedFiscalYear === fy 
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-950 font-bold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {fy}
            </button>
          ))}
        </div>

        {/* Prime Membership Toggle */}
        <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
          {["All", "Prime", "Non-Prime"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMembership(m);
                setAppliedFeedback(true);
                setTimeout(() => setAppliedFeedback(false), 1500);
              }}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center space-x-1 cursor-pointer ${
                appliedMembership === m 
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-950 font-bold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {m === "Prime" && <Crown className="w-3 h-3 text-amber-400 mr-1" />}
              <span>{m}</span>
            </button>
          ))}
        </div>

        {/* Category Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={appliedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setAppliedFeedback(true);
              setTimeout(() => setAppliedFeedback(false), 1500);
            }}
            className="bg-transparent text-slate-200 text-[11px] font-medium py-0.5 focus:outline-none focus:text-white cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-slate-200">
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Segment Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1">
          <Shapes className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={appliedSegment}
            onChange={(e) => {
              setSelectedSegment(e.target.value);
              setAppliedFeedback(true);
              setTimeout(() => setAppliedFeedback(false), 1500);
            }}
            className="bg-transparent text-slate-200 text-[11px] font-medium py-0.5 focus:outline-none focus:text-white cursor-pointer max-w-[170px] sm:max-w-none"
          >
            {segments.map((s) => (
              <option key={s} value={s} className="bg-slate-900 text-slate-200">
                {s === "All" ? "All Segments" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons: Feedback / Active Chip / Reset */}
      <div className="flex items-center space-x-2">
        {/* Instant Feedback indicator or Apply Button */}
        <button
          type="button"
          onClick={handleApply}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md ${
            appliedFeedback
              ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-1 ring-emerald-400"
              : isFilterApplied
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
              : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
          }`}
        >
          {appliedFeedback ? (
            <>
              <Check className="w-3.5 h-3.5 text-white animate-bounce" />
              <span>Filtered Live!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Apply Filters</span>
              {isFilterApplied && (
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              )}
            </>
          )}
        </button>

        {/* Reset Filters Button */}
        {isFilterApplied && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Reset all filters back to All"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
