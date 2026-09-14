import React, { useState, useEffect } from 'react';
import { FilterProvider } from './context/FilterContext';
import { fetchOverview } from './services/api';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { GlobalFilterBar } from './components/common/GlobalFilterBar';
import { AIAnalystDrawer } from './components/common/AIAnalystDrawer';
import { CustomerDrawer } from './components/common/CustomerDrawer';
import { ReportModal } from './components/common/ReportModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CommandPalette } from './components/common/CommandPalette';
import { BackendHealthBanner } from './components/common/BackendHealthBanner';

// Pages
import { BusinessPulse } from './pages/BusinessPulse';
import { ExecutiveCommandCenter } from './pages/ExecutiveCommandCenter';
import { AlertsIncidentCenter } from './pages/AlertsIncidentCenter';
import { CustomerIntelligence } from './pages/CustomerIntelligence';
import { CustomerSegmentation } from './pages/CustomerSegmentation';
import { LeakageIntelligence } from './pages/LeakageIntelligence';
import { OpportunityCenter } from './pages/OpportunityCenter';
import { NextBestAction } from './pages/NextBestAction';
import { StrategyLab } from './pages/StrategyLab';
import { ActionCenter } from './pages/ActionCenter';
import { AutomationsCenter } from './pages/AutomationsCenter';
import { ExperimentImpact } from './pages/ExperimentImpact';
import { DataConnections } from './pages/DataConnections';
import { DatasetManager } from './pages/DatasetManager';
import { DataHealthCenter } from './pages/DataHealthCenter';
import { DataLineageCenter } from './pages/DataLineageCenter';
import { AIDiscoveredInsights } from './pages/AIDiscoveredInsights';
import { ModelExplainability } from './pages/ModelExplainability';
import { ModelHealthCenter } from './pages/ModelHealthCenter';
import { AuditSecurityCenter } from './pages/AuditSecurityCenter';
import { DataGovernance } from './pages/DataGovernance';
import { ReturnFrictionIntelligence } from './pages/ReturnFrictionIntelligence';
import { LandingPage } from './pages/LandingPage';
import { DiagnoseWorkspace } from './pages/DiagnoseWorkspace';
import { EvidenceCenter } from './pages/EvidenceCenter';
import { SettingsPage } from './pages/SettingsPage';

import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useFilters } from './context/FilterContext';

const DashboardContent: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('overview');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [overviewData, setOverviewData] = useState<any>(null);

  const {
    appliedFiscalYear,
    appliedMembership,
    appliedCategory,
    appliedSegment,
    filterVersion
  } = useFilters();

  useEffect(() => {
    fetchOverview({
      fiscalYear: appliedFiscalYear,
      membership: appliedMembership,
      category: appliedCategory,
      segment: appliedSegment
    })
      .then(setOverviewData)
      .catch(console.error);
  }, [appliedFiscalYear, appliedMembership, appliedCategory, appliedSegment, filterVersion]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile sidebar when navigating
  const handleNavigate = (page: string) => {
    setActivePage(page);
    setIsMobileSidebarOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'overview':             return <ExecutiveCommandCenter overviewData={overviewData} setActivePage={setActivePage} />;
      case 'diagnose':             return <DiagnoseWorkspace initialTab="sow" onTabChange={(tab) => setActivePage(tab)} />;
      case 'sow':                  return <DiagnoseWorkspace initialTab="sow" onTabChange={(tab) => setActivePage(tab)} />;
      case 'migration':            return <DiagnoseWorkspace initialTab="migration" onTabChange={(tab) => setActivePage(tab)} />;
      case 'category':             return <DiagnoseWorkspace initialTab="category" onTabChange={(tab) => setActivePage(tab)} />;
      case 'big-ticket':           return <DiagnoseWorkspace initialTab="big-ticket" onTabChange={(tab) => setActivePage(tab)} />;
      case 'prime-reward':         return <DiagnoseWorkspace initialTab="rewards" onTabChange={(tab) => setActivePage(tab)} />;
      case 'attrition':            return <DiagnoseWorkspace initialTab="cohorts" onTabChange={(tab) => setActivePage(tab)} />;
      case 'customers':            return <CustomerIntelligence />;
      case 'segmentation':         return <CustomerSegmentation />;
      case 'opportunities':        return <OpportunityCenter onNavigateExperiment={() => setActivePage('experiments')} />;
      case 'opportunity':          return <OpportunityCenter onNavigateExperiment={() => setActivePage('experiments')} />;
      case 'nba':                  return <NextBestAction />;
      case 'strategy':             return <StrategyLab />;
      case 'experiments':          return <ExperimentImpact />;
      case 'data':                 return <DatasetManager />;
      case 'datasets':             return <DatasetManager />;
      case 'evidence':             return <EvidenceCenter />;
      case 'settings':             return <SettingsPage />;
      case 'pulse':                return <BusinessPulse />;
      case 'alerts':               return <AlertsIncidentCenter />;
      case 'actions':              return <ActionCenter />;
      case 'automations':          return <AutomationsCenter />;
      case 'connections':          return <DataConnections />;
      case 'data-health':          return <DataHealthCenter />;
      case 'lineage':              return <DataLineageCenter />;
      case 'ai-discovery':         return <AIDiscoveredInsights />;
      case 'model-explainability': return <ModelExplainability />;
      case 'model-health':         return <ModelHealthCenter />;
      case 'audit':                return <AuditSecurityCenter />;
      case 'governance':           return <DataGovernance />;
      case 'return-friction':      return <ReturnFrictionIntelligence />;
      case 'leakage':              return <LeakageIntelligence />;
      default:                     return <ExecutiveCommandCenter overviewData={overviewData} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#07090E] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — hidden on mobile unless toggled */}
      <div className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:flex lg:flex-shrink-0
      `}>
        <Sidebar
          activePage={activePage}
          setActivePage={handleNavigate}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <BackendHealthBanner />
        <Navbar
          activePage={activePage}
          kpis={(overviewData as { kpis?: unknown } | null)?.kpis}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onNavigateAlerts={() => setActivePage('alerts')}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />
        <GlobalFilterBar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <ErrorBoundary key={activePage}>
              {renderPage()}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      <AIAnalystDrawer />
      <CustomerDrawer />
      <ReportModal />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(route) => handleNavigate(route)}
      />
    </div>
  );
};

const DashboardApp: React.FC = () => {
  return (
    <FilterProvider>
      <DashboardContent />
    </FilterProvider>
  );
};

interface AppProps { clerkEnabled?: boolean; }
export const App: React.FC<AppProps> = () => {
  const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!hasClerkKey) {
    return <DashboardApp />;
  }
  return (
    <>
      <SignedIn>
        <DashboardApp />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  );
};

export default App;
