import React, { useEffect, useState } from 'react';
import { useFilters } from '../../context/FilterContext';
import { fetchReport } from '../../services/api';
import { X, Copy, Download, Check, FileText } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen } = useFilters();
  const [reportMd, setReportMd] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isReportModalOpen) return;
    fetchReport().then((res: any) => setReportMd(res.report_markdown || JSON.stringify(res, null, 2))).catch(console.error);
  }, [isReportModalOpen]);

  if (!isReportModalOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportMd], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SharePulse_Executive_Report_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="h-16 px-6 border-b border-surface-border flex items-center justify-between bg-surface-cardMuted rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-brand-400" />
            <div>
              <h3 className="text-base font-bold text-white">Executive Revenue Recovery Report</h3>
              <p className="text-xs text-slate-400 font-mono">Synchrony Analytics Hackathon 2026 Submission</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-surface-dark border border-surface-border text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy MD"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs text-white transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="p-1.5 rounded-lg hover:bg-surface-hover text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-surface-dark/50">
          {reportMd || "Generating executive report..."}
        </div>
      </div>
    </div>
  );
};
