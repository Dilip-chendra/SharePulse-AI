import React, { useEffect, useState } from 'react';
import { fetchCustomers } from '../services/api';
import { useFilters } from '../context/FilterContext';
import type { Customer } from '../types';
import { 
  Search, 
  Crown, 
  Eye, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export const CustomerIntelligence: React.FC = () => {
  const { 
    setSelectedCustomerId, 
    appliedMembership, 
    appliedSegment, 
    filterVersion 
  } = useFilters();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Master_Opportunity_Score");
  const [loading, setLoading] = useState(true);

  // Synchronize local dropdown with global applied segment on filterVersion update
  useEffect(() => {
    setSegmentFilter(appliedSegment);
    setPage(1);
  }, [appliedSegment, filterVersion]);

  const loadData = () => {
    setLoading(true);
    const activeSegment = segmentFilter !== "All" ? segmentFilter : (appliedSegment !== "All" ? appliedSegment : undefined);
    const primeParam = appliedMembership === "Prime" ? "1" : appliedMembership === "Non-Prime" ? "0" : undefined;
    
    fetchCustomers({
      page,
      pageSize: 20,
      search,
      segment: activeSegment,
      state: stateFilter !== "All" ? stateFilter : undefined,
      prime: primeParam,
      sortBy
    })
      .then(res => {
        setCustomers(res.customers || []);
        setTotalPages(res.total_pages || 1);
        setTotalCount(res.total_count || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page, segmentFilter, stateFilter, sortBy, appliedMembership, appliedSegment, filterVersion]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Customer 360 Intelligence</h2>
          <p className="text-xs text-slate-400">Search and inspect individual cardholder profiles, risk drivers, and Next Best Actions.</p>
        </div>
        <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-slate-300">
          Total Filtered: <strong className="text-white">{totalCount.toLocaleString()}</strong> Cardholders
        </span>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-72">
          <input
            type="text"
            placeholder="Search Customer ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-dark border border-surface-border rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={segmentFilter}
            onChange={(e) => { setSegmentFilter(e.target.value); setPage(1); }}
            className="bg-surface-dark border border-surface-border text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Segments</option>
            <option value="MetroMart Wallet Dominant Shoppers">MetroMart Wallet Dominant Shoppers</option>
            <option value="High-Value Multi-Channel Shoppers">High-Value Multi-Channel Shoppers</option>
            <option value="HSIC Core Loyalists">HSIC Core Loyalists</option>
            <option value="Cash & UPI Transactors">Cash & UPI Transactors</option>
            <option value="Dormant & Low-Engagement Shoppers">Dormant & Low-Engagement Shoppers</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}
            className="bg-surface-dark border border-surface-border text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All States</option>
            <option value="Healthy">Healthy</option>
            <option value="Warning">Warning</option>
            <option value="Declining">Declining</option>
            <option value="Dormant">Dormant</option>
            <option value="Hard Attrition">Hard Attrition</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="bg-surface-dark border border-surface-border text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500 font-mono"
          >
            <option value="Master_Opportunity_Score">Sort: Master Opportunity</option>
            <option value="Total_Spend">Sort: Total Spend</option>
            <option value="HSIC_Spend">Sort: HSIC Spend</option>
            <option value="Predicted_Risk_Score">Sort: Predicted Risk</option>
            <option value="Revenue_at_Risk">Sort: Revenue at Risk</option>
            <option value="Recoverable_Opportunity">Sort: Recoverable Opp</option>
          </select>
        </div>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-dark text-slate-400 uppercase font-mono text-[10px] border-b border-surface-border">
              <tr>
                <th className="py-3.5 px-4">Customer ID</th>
                <th className="py-3.5 px-4">Prime</th>
                <th className="py-3.5 px-4">Segment</th>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">Total Spend</th>
                <th className="py-3.5 px-4">HSIC SoW</th>
                <th className="py-3.5 px-4">Risk Score</th>
                <th className="py-3.5 px-4">Recoverable Opp</th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-mono text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">Loading customers...</td>
                </tr>
              ) : customers.map((c) => (
                <tr 
                  key={c.Customer_ID} 
                  onClick={() => setSelectedCustomerId(c.Customer_ID)}
                  className="hover:bg-surface-hover/60 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-white">#{c.Customer_ID}</td>
                  <td className="py-3.5 px-4">
                    {c.Is_Prime === 1 ? (
                      <span className="text-amber-400 flex items-center"><Crown className="w-3 h-3 mr-1" /> Yes</span>
                    ) : <span className="text-slate-500">No</span>}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-200">{c.Segment_Name}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${
                      c.Customer_State === 'Healthy' ? 'bg-emerald-950/60 text-accent-emerald border-emerald-500/30' :
                      c.Customer_State === 'Warning' ? 'bg-amber-950/60 text-accent-amber border-amber-500/30' :
                      c.Customer_State === 'Declining' ? 'bg-rose-950/60 text-accent-rose border-rose-500/30' :
                      c.Customer_State === 'Dormant' ? 'bg-purple-950/60 text-purple-400 border-purple-500/30' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {c.Customer_State}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">₹{c.Total_Spend.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{(c.SoW * 100).toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-accent-rose">{c.Predicted_Risk_Score.toFixed(2)}</td>
                  <td className="py-3.5 px-4 font-bold text-accent-emerald">₹{c.Recoverable_Opportunity.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedCustomerId(c.Customer_ID); }}
                      className="p-1.5 rounded-lg bg-surface-dark hover:bg-brand-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="h-14 px-6 border-t border-surface-border bg-surface-cardMuted flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Page {page} of {totalPages}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-surface-dark border border-surface-border text-slate-300 disabled:opacity-40 hover:bg-surface-hover cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-surface-dark border border-surface-border text-slate-300 disabled:opacity-40 hover:bg-surface-hover cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
