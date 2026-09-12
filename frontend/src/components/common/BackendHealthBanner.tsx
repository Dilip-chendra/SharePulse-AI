import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../services/api';
import { Radio, RefreshCw } from 'lucide-react';

export const BackendHealthBanner: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'waking' | 'offline'>('checking');
  const [isDismissed, setIsDismissed] = useState(false);

  const checkHealth = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        setStatus('online');
      } else {
        setStatus('waking');
      }
    } catch {
      setStatus('waking');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 12000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'online' || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 border-b border-amber-500/30 px-4 py-2 text-xs flex items-center justify-between text-amber-200 select-none animate-fadeIn">
      <div className="flex items-center gap-2 max-w-2xl">
        <Radio className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
        <span>
          <strong className="text-amber-100">Connecting to Cloud Analytics Engine:</strong> Render backend is spinning up from sleep. Real-time data will populate automatically.
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={checkHealth}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Retry</span>
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
