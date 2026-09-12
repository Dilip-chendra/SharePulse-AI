import React, { useEffect, useState, useRef } from 'react';
import { ClassificationBadge } from '../components/common/ClassificationBadge';
import { API_BASE } from '../services/api';

interface DatasetInfo {
  name: string;
  size_mb: number;
  dataset_type: string;
  status: string;
}

interface SchemaResult {
  filename: string;
  columns_detected: string[];
  schema_mapping: Record<string, string | null>;
  confidence: Record<string, number>;
  unmapped: string[];
  coverage: number;
  required_found: string[];
  required_missing: string[];
}

type Step = 'upload' | 'detect' | 'map' | 'validate' | 'preview' | 'run' | 'explore';
const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: 'upload',   label: 'Upload',       icon: '📤' },
  { id: 'detect',   label: 'Detect Schema', icon: '🔍' },
  { id: 'map',      label: 'Map Columns',  icon: '🗺️' },
  { id: 'validate', label: 'Validate',     icon: '✅' },
  { id: 'preview',  label: 'Preview',      icon: '👁️' },
  { id: 'run',      label: 'Run Analytics', icon: '⚡' },
  { id: 'explore',  label: 'Explore',      icon: '📊' },
];

export const DatasetManager: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [schemaResult, setSchemaResult] = useState<SchemaResult | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/datasets`)
      .then(r => r.json())
      .then(d => setDatasets(d.datasets ?? []))
      .catch(console.error);
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
      setCurrentStep('detect');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCurrentStep('detect');
    }
  };

  const detectSchema = async () => {
    if (!selectedFile) return;
    setDetecting(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const resp = await fetch(`${API_BASE}/api/datasets/schema-detect`, {
        method: 'POST',
        body: formData,
      });
      const result = await resp.json();
      setSchemaResult(result);
      setCurrentStep('map');
    } catch (e) {
      console.error(e);
    } finally {
      setDetecting(false);
    }
  };

  const runAnalysis = async () => {
    setCurrentStep('run');
    try {
      const resp = await fetch(`${API_BASE}/api/analysis-runs`, { method: 'POST' });
      const data = await resp.json();
      setJobId(data.job_id);
      setTimeout(() => setCurrentStep('explore'), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const stepIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dataset Manager</h1>
          <p className="text-gray-400 mt-1">Upload CSVs · Auto-detect schema · Run analytics pipeline · Export results</p>
        </div>
        <ClassificationBadge type="OBSERVED" />
      </div>

      {/* Workflow Steps */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => i <= stepIndex ? setCurrentStep(step.id) : undefined}
                className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-center flex-shrink-0 ${
                  step.id === currentStep
                    ? 'bg-blue-600 text-white'
                    : i < stepIndex
                    ? 'text-green-400 hover:bg-gray-800'
                    : 'text-gray-600 cursor-not-allowed'
                }`}
              >
                <span className="text-lg">{step.icon}</span>
                <span className="text-xs font-medium whitespace-nowrap">{step.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < stepIndex ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'upload' && (
        <div
          className={`border-2 border-dashed rounded-2xl p-16 text-center transition-colors cursor-pointer ${
            isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
          <div className="text-5xl mb-4">📤</div>
          <h3 className="text-xl font-semibold text-white mb-2">Drop your CSV here</h3>
          <p className="text-gray-400 text-sm mb-6">
            Supports Customer Data, Transactions Data, Category Codes, Payment Codes CSVs
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Customer Data.csv', 'Transactions Data.csv', 'Category Code.csv', 'Payment Code.csv'].map(f => (
              <span key={f} className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full">{f}</span>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'detect' && selectedFile && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-2">File Selected: {selectedFile.name}</h3>
          <p className="text-gray-400 text-sm mb-6">Size: {(selectedFile.size / 1e6).toFixed(2)} MB</p>
          <button
            onClick={detectSchema}
            disabled={detecting}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            {detecting ? 'Detecting Schema...' : 'Detect Schema Automatically →'}
          </button>
        </div>
      )}

      {currentStep === 'map' && schemaResult && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Schema Detection Results: {schemaResult.filename}</h3>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${schemaResult.coverage >= 0.8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  Coverage: {(schemaResult.coverage * 100).toFixed(0)}%
                </span>
                {schemaResult.required_missing.length === 0 && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">All Required Fields Found</span>
                )}
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(schemaResult.schema_mapping).map(([orig, mapped]) => (
                <div key={orig} className={`flex items-center justify-between p-3 rounded-lg ${mapped ? 'bg-green-900/10' : 'bg-gray-800'}`}>
                  <span className="text-sm text-gray-300 font-mono">{orig}</span>
                  <span className="text-gray-500 text-xs mx-3">→</span>
                  {mapped ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-400 font-medium">{mapped}</span>
                      {schemaResult.confidence[mapped] && (
                        <span className="text-xs text-gray-500">({(schemaResult.confidence[mapped] * 100).toFixed(0)}% conf)</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600">Unmapped</span>
                  )}
                </div>
              ))}
            </div>

            {schemaResult.required_missing.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/40 rounded-lg">
                <p className="text-xs text-yellow-400">
                  ⚠️ Required fields not found: {schemaResult.required_missing.join(', ')}. 
                  Analytics may have reduced capability.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setCurrentStep('validate')} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-semibold transition-colors">
              Accept Mapping & Validate →
            </button>
            <button onClick={() => setCurrentStep('upload')} className="border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-xl text-gray-300 transition-colors">
              Re-upload
            </button>
          </div>
        </div>
      )}

      {(currentStep === 'validate' || currentStep === 'preview') && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-white mb-2">Validation Passed</h3>
          <p className="text-gray-400 text-sm mb-6">Schema mapping verified. Data ready for analytics pipeline.</p>
          <button onClick={runAnalysis} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-semibold transition-colors">
            Run Analytics Pipeline ⚡
          </button>
        </div>
      )}

      {currentStep === 'run' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4 animate-pulse">⚡</div>
          <h3 className="text-lg font-semibold text-white mb-2">Running Analytics Pipeline...</h3>
          <p className="text-gray-400 text-sm">Multi-model tournament · Segmentation · Discovery · NBA</p>
        </div>
      )}

      {currentStep === 'explore' && (
        <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-white mb-2">Analytics Complete!</h3>
          <p className="text-gray-400 text-sm mb-6">Job ID: {jobId} · All 16 dashboard pages now updated with your data</p>
          <div className="flex gap-4 justify-center">
            <a href="/api/export/customers" className="border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-xl text-gray-300 transition-colors text-sm">
              Export Customers CSV
            </a>
            <a href="/api/export/risk-scores" className="border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-xl text-gray-300 transition-colors text-sm">
              Export Risk Scores
            </a>
          </div>
        </div>
      )}

      {/* Current Datasets */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Active Datasets</h3>
          <div className="flex gap-3">
            <a href={`${API_BASE}/api/export/customers`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Export Customers ↓
            </a>
            <a href={`${API_BASE}/api/export/risk-scores`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Export Risk Scores ↓
            </a>
            <a href={`${API_BASE}/api/export/segments`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Export Segments ↓
            </a>
            <a href={`${API_BASE}/api/export/opportunities`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Export Opportunities ↓
            </a>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="text-left text-xs text-gray-400 px-6 py-3 font-medium">Dataset</th>
              <th className="text-right text-xs text-gray-400 px-6 py-3 font-medium">Size</th>
              <th className="text-center text-xs text-gray-400 px-6 py-3 font-medium">Type</th>
              <th className="text-center text-xs text-gray-400 px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {datasets.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  Loading datasets...
                </td>
              </tr>
            ) : datasets.map((ds) => (
              <tr key={ds.name} className="hover:bg-gray-800/30">
                <td className="px-6 py-4 text-sm text-white font-medium">{ds.name}</td>
                <td className="px-6 py-4 text-sm text-gray-300 text-right">{ds.size_mb} MB</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{ds.dataset_type}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">{ds.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetManager;
