import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[SharePulse ErrorBoundary] Uncaught UI error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-[#0C0F17] border border-rose-900/50 shadow-2xl text-center space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              {this.props.fallbackTitle || "Analytical Subsystem Diagnostic Intercept"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              An unexpected state occurred while rendering this module. The rest of the platform remains fully functional.
            </p>
          </div>
          {this.state.error && (
            <div className="bg-surface-dark border border-surface-border p-3 rounded-xl font-mono text-[11px] text-rose-300 text-left max-h-32 overflow-y-auto">
              {this.state.error.message || String(this.state.error)}
            </div>
          )}
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Module</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
