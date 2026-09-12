import React, { createContext, useContext, useState, useCallback } from 'react';

interface FilterContextType {
  // Filter values
  fiscalYear: string;
  setFiscalYear: (fy: string) => void;
  membership: string;
  setMembership: (m: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSegment: string;
  setSelectedSegment: (seg: string) => void;

  // Applied values (kept in sync for instant responsiveness)
  appliedFiscalYear: string;
  appliedMembership: string;
  appliedCategory: string;
  appliedSegment: string;
  filterVersion: number;
  isFilterApplied: boolean;

  // Action methods
  applyFilters: (override?: { fiscalYear?: string; membership?: string; category?: string; segment?: string }) => void;
  resetFilters: () => void;

  // Search & Drawers
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAIAnalystOpen: boolean;
  setIsAIAnalystOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  selectedCustomerId: number | null;
  setSelectedCustomerId: (id: number | null) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fiscalYear, setFiscalYearState] = useState<string>("All");
  const [membership, setMembershipState] = useState<string>("All");
  const [selectedCategory, setSelectedCategoryState] = useState<string>("All");
  const [selectedSegment, setSelectedSegmentState] = useState<string>("All");

  const [appliedFiscalYear, setAppliedFiscalYear] = useState<string>("All");
  const [appliedMembership, setAppliedMembership] = useState<string>("All");
  const [appliedCategory, setAppliedCategory] = useState<string>("All");
  const [appliedSegment, setAppliedSegment] = useState<string>("All");
  const [filterVersion, setFilterVersion] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAIAnalystOpen, setIsAIAnalystOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  // Instantly reactive setters that update both state and applied filter simultaneously
  const setFiscalYear = useCallback((fy: string) => {
    setFiscalYearState(fy);
    setAppliedFiscalYear(fy);
    setFilterVersion((v) => v + 1);
  }, []);

  const setMembership = useCallback((m: string) => {
    setMembershipState(m);
    setAppliedMembership(m);
    setFilterVersion((v) => v + 1);
  }, []);

  const setSelectedCategory = useCallback((cat: string) => {
    setSelectedCategoryState(cat);
    setAppliedCategory(cat);
    setFilterVersion((v) => v + 1);
  }, []);

  const setSelectedSegment = useCallback((seg: string) => {
    setSelectedSegmentState(seg);
    setAppliedSegment(seg);
    setFilterVersion((v) => v + 1);
  }, []);

  const applyFilters = useCallback((override?: { fiscalYear?: string; membership?: string; category?: string; segment?: string }) => {
    const fy = override?.fiscalYear ?? fiscalYear;
    const mem = override?.membership ?? membership;
    const cat = override?.category ?? selectedCategory;
    const seg = override?.segment ?? selectedSegment;

    setFiscalYearState(fy);
    setMembershipState(mem);
    setSelectedCategoryState(cat);
    setSelectedSegmentState(seg);

    setAppliedFiscalYear(fy);
    setAppliedMembership(mem);
    setAppliedCategory(cat);
    setAppliedSegment(seg);
    setFilterVersion((v) => v + 1);
  }, [fiscalYear, membership, selectedCategory, selectedSegment]);

  const resetFilters = useCallback(() => {
    setFiscalYearState("All");
    setMembershipState("All");
    setSelectedCategoryState("All");
    setSelectedSegmentState("All");

    setAppliedFiscalYear("All");
    setAppliedMembership("All");
    setAppliedCategory("All");
    setAppliedSegment("All");
    setFilterVersion((v) => v + 1);
  }, []);

  const isFilterApplied = appliedFiscalYear !== "All" || appliedMembership !== "All" || appliedCategory !== "All" || appliedSegment !== "All";

  return (
    <FilterContext.Provider value={{
      fiscalYear, setFiscalYear,
      membership, setMembership,
      selectedCategory, setSelectedCategory,
      selectedSegment, setSelectedSegment,

      appliedFiscalYear,
      appliedMembership,
      appliedCategory,
      appliedSegment,
      filterVersion,
      isFilterApplied,

      applyFilters,
      resetFilters,

      searchQuery, setSearchQuery,
      isAIAnalystOpen, setIsAIAnalystOpen,
      isReportModalOpen, setIsReportModalOpen,
      selectedCustomerId, setSelectedCustomerId
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilters must be used within FilterProvider");
  return context;
};
