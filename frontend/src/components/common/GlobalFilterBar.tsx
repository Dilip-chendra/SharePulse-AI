import React, { useState } from 'react';
import { useFilters } from '../../context/FilterContext';
import { Filter, Crown, Tag, Shapes, RotateCcw, Check, Sparkles, ChevronDown } from 'lucide-react';

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
    <div className="bg-[#080C16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs select-none shadow-sm">
      {/* ─── Filter Pills & Dropdowns Group ─── */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Label Tag */}
        <div className="flex items-center space-x-1.5 text-slate-400 font-medium py-1">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-200">Global Filters:</span>
        </div>

        {/* Fiscal Year Toggle */}
        <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800 shadow-inner">
          {["All", "FY25", "FY26"].map((fy) => (
            <button
              key={fy}
              type="button"
              onClick={() => {
                setFiscalYear(fy);
                setAppliedFeedback(true);
                setTimeout(() => setAppliedFeedback(false), 1500);
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
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
        <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800 shadow-inner">
          {["All", "Prime", "Non-Prime"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMembership(m);
                setAppliedFeedback(true);
                setTimeout(() => setAppliedFeedback(false), 1500);
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center space-x-1 cursor-pointer whitespace-nowrap ${
                appliedMembership === m
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-950 font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {m === "Prime" && <Crown className="w-3 h-3 text-amber-400 mr-0.5" />}
              <span>{m}</span>
            </button>
          ))}
        </div>

        {/* Category Selector */}
        <div className="relative flex items-center bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-2.5 py-1.5 transition-colors shadow-sm">
          <Tag className="w-3.5 h-3.5 text-indigo-400 mr-1.5 shrink-0" />
          <select
            value={appliedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setAppliedFeedback(true);
              setTimeout(() => setAppliedFeedback(false), 1500);
            }}
            className="bg-transparent text-slate-200 text-[11px] font-medium pr-5 focus:outline-none focus:text-white cursor-pointer appearance-none"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-slate-200">
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
        </div>

        {/* Segment Selector */}
        <div className="relative flex items-center bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-2.5 py-1.5 transition-colors shadow-sm">
          <Shapes className="w-3.5 h-3.5 text-indigo-400 mr-1.5 shrink-0" />
          <select
            value={appliedSegment}
            onChange={(e) => {
              setSelectedSegment(e.target.value);
              setAppliedFeedback(true);
              setTimeout(() => setAppliedFeedback(false), 1500);
            }}
            className="bg-transparent text-slate-200 text-[11px] font-medium pr-5 focus:outline-none focus:text-white cursor-pointer appearance-none max-w-[150px] sm:max-w-[200px] truncate"
          >
            {segments.map((s) => (
              <option key={s} value={s} className="bg-slate-900 text-slate-200">
                {s === "All" ? "All Segments" : s}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* ─── Action Buttons: Apply & Reset ─── */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* Apply Filters Button */}
        <button
          type="button"
          onClick={handleApply}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
            appliedFeedback
              ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-1 ring-emerald-400"
              : isFilterApplied
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 ring-1 ring-indigo-400/40"
              : "bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80"
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
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              )}
            </>
          )}
        </button>

        {/* Reset Filters Button */}
        {isFilterApplied && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Reset all filters back to All"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
