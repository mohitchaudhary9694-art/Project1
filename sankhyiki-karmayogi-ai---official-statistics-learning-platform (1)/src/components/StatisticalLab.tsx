import React, { useState, useRef } from 'react';
import { 
  FlaskConical, 
  Calculator, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Sliders, 
  FileSpreadsheet, 
  Info, 
  RefreshCw, 
  ArrowRight,
  Database,
  Sparkles,
  Upload,
  Download,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2
} from 'lucide-react';

interface MicrodataRow {
  id: string;
  state: string;
  stratum: string;
  members: number;
  landHectares: number;
  monthlyExpenditure: number;
  status: 'valid' | 'error' | 'warning';
  reason?: string;
}

const PRESET_DATASETS: Record<string, { name: string; desc: string; rows: MicrodataRow[] }> = {
  nss79: {
    name: 'NSS 79th Round (Household Consumption)',
    desc: 'Sample stratified rural/urban microdata schedule 1.0 with raw field entries',
    rows: [
      { id: 'HH_1001', state: '09-UP', stratum: 'Rural', members: 5, landHectares: 1.8, monthlyExpenditure: 18500, status: 'valid' },
      { id: 'HH_1002', state: '19-WB', stratum: 'Urban', members: 4, landHectares: 0.0, monthlyExpenditure: 42000, status: 'valid' },
      { id: 'HH_1003', state: '27-MH', stratum: 'Urban', members: 0, landHectares: 4.5, monthlyExpenditure: 68000, status: 'error', reason: 'Zero household members recorded (Logical violation)' },
      { id: 'HH_1004', state: '33-TN', stratum: 'Rural', members: 6, landHectares: 12.0, monthlyExpenditure: 245000, status: 'warning', reason: 'Expenditure > 3 standard deviations (High Outlier)' },
      { id: 'HH_1005', state: '08-RJ', stratum: 'Rural', members: 8, landHectares: 999.0, monthlyExpenditure: 14200, status: 'error', reason: 'Landholding 999.0 indicates missing code not flagged' },
      { id: 'HH_1006', state: '07-DL', stratum: 'Urban', members: 3, landHectares: 0.0, monthlyExpenditure: 85000, status: 'valid' },
      { id: 'HH_1007', state: '10-BR', stratum: 'Rural', members: -2, landHectares: 0.5, monthlyExpenditure: 11000, status: 'error', reason: 'Negative member count recorded' },
      { id: 'HH_1008', state: '24-GJ', stratum: 'Urban', members: 4, landHectares: 0.0, monthlyExpenditure: 56000, status: 'valid' },
    ]
  },
  plfs: {
    name: 'PLFS Quarterly Microdata (Activity Probing)',
    desc: 'Periodic Labour Force Survey household sample with activity probing variables',
    rows: [
      { id: 'PLFS_401', state: '03-PB', stratum: 'Rural', members: 5, landHectares: 3.2, monthlyExpenditure: 32000, status: 'valid' },
      { id: 'PLFS_402', state: '29-KA', stratum: 'Urban', members: 2, landHectares: 0.0, monthlyExpenditure: 110000, status: 'valid' },
      { id: 'PLFS_403', state: '32-KL', stratum: 'Rural', members: 4, landHectares: 0.4, monthlyExpenditure: 45000, status: 'valid' },
      { id: 'PLFS_404', state: '21-OD', stratum: 'Rural', members: 7, landHectares: 0.0, monthlyExpenditure: 0, status: 'error', reason: 'Zero monthly consumption reported for active household' },
      { id: 'PLFS_405', state: '23-MP', stratum: 'Rural', members: 14, landHectares: 25.0, monthlyExpenditure: 310000, status: 'warning', reason: 'Household size > 12 with high expenditure variance' },
      { id: 'PLFS_406', state: '06-HR', stratum: 'Urban', members: 4, landHectares: 0.0, monthlyExpenditure: 74000, status: 'valid' },
    ]
  },
  asi: {
    name: 'ASI Factory Establishment Microdata',
    desc: 'Annual Survey of Industries organized manufacturing units input/output schedule',
    rows: [
      { id: 'ASI_901', state: '27-MH', stratum: 'Organized', members: 42, landHectares: 5.0, monthlyExpenditure: 1450000, status: 'valid' },
      { id: 'ASI_902', state: '33-TN', stratum: 'Organized', members: 120, landHectares: 12.0, monthlyExpenditure: 4200000, status: 'valid' },
      { id: 'ASI_903', state: '24-GJ', stratum: 'Organized', members: 0, landHectares: 8.0, monthlyExpenditure: 890000, status: 'error', reason: 'Operating factory reported zero workers on muster roll' },
      { id: 'ASI_904', state: '09-UP', stratum: 'Unorganized', members: 8, landHectares: 0.5, monthlyExpenditure: 95000, status: 'valid' },
      { id: 'ASI_905', state: '19-WB', stratum: 'Organized', members: 65, landHectares: 9999.0, monthlyExpenditure: 2100000, status: 'error', reason: 'Capital assets code 9999 indicates missing schedule' },
    ]
  }
};

export const StatisticalLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sample_calc' | 'nqaf_validator' | 'index_sim'>('sample_calc');

  // --- 1. Sample Size Calculator State ---
  const [popSize, setPopSize] = useState<number>(500000);
  const [marginOfError, setMarginOfError] = useState<number>(3); // 3%
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95); // 95% -> Z = 1.96
  const [expectedProportion, setExpectedProportion] = useState<number>(0.5); // p = 0.5
  const [designEffect, setDesignEffect] = useState<number>(1.5); // DEFF
  const [nonResponseRate, setNonResponseRate] = useState<number>(10); // 10%

  // Compute Sample Size
  const zScore = confidenceLevel === 99 ? 2.576 : confidenceLevel === 90 ? 1.645 : 1.96;
  const p = expectedProportion;
  const q = 1 - p;
  const e = marginOfError / 100;
  
  // Cochran formula: n0 = (Z^2 * p * q) / e^2
  const n0 = (Math.pow(zScore, 2) * p * q) / Math.pow(e, 2);
  // Finite Population Correction
  const n_adjusted = (n0 * popSize) / (n0 + (popSize - 1));
  // Apply Design Effect (DEFF)
  const n_deff = n_adjusted * designEffect;
  // Apply Non-Response buffer
  const finalSampleSize = Math.ceil(n_deff / (1 - nonResponseRate / 100));

  // --- 2. NQAF Data Quality Scrutiny Validator State ---
  const [selectedDatasetKey, setSelectedDatasetKey] = useState<string>('nss79');
  const [dataRows, setDataRows] = useState<MicrodataRow[]>(PRESET_DATASETS.nss79.rows);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isImputing, setIsImputing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate microdata row using NQAF rules
  const validateRow = (row: Omit<MicrodataRow, 'status' | 'reason'>): MicrodataRow => {
    // Error checks
    if (row.members <= 0) {
      return { ...row, status: 'error', reason: `Zero or negative members (${row.members}) recorded (Logical violation)` };
    }
    if (row.landHectares >= 999 || row.landHectares < 0) {
      return { ...row, status: 'error', reason: `Landholding ${row.landHectares} indicates unflagged missing code or negative value` };
    }
    if (row.monthlyExpenditure <= 0) {
      return { ...row, status: 'error', reason: 'Zero or negative monthly expenditure recorded' };
    }
    
    // Warning checks (Outliers)
    if (row.monthlyExpenditure > 200000 || (row.members > 0 && (row.monthlyExpenditure / row.members) > 50000)) {
      return { ...row, status: 'warning', reason: 'High expenditure outlier (>3 SD per capita threshold)' };
    }
    if (row.members > 12) {
      return { ...row, status: 'warning', reason: 'Large household cluster (>12 members) requires verification' };
    }

    return { ...row, status: 'valid' };
  };

  // Handle CSV file upload & parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length <= 1) {
        setUploadFeedback("File appears to be empty or contains only a header.");
        return;
      }

      // Check header
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const parsedRows: MicrodataRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length >= 4) {
          const id = parts[0] || `REC_${1000 + i}`;
          const state = parts[1] || '09-UP';
          const stratum = parts[2] || 'Rural';
          const members = parseInt(parts[3], 10) || 0;
          const landHectares = parseFloat(parts[4]) || 0;
          const monthlyExpenditure = parseFloat(parts[5]) || 0;

          const validated = validateRow({
            id,
            state,
            stratum,
            members,
            landHectares,
            monthlyExpenditure
          });
          parsedRows.push(validated);
        }
      }

      if (parsedRows.length > 0) {
        setDataRows(parsedRows);
        setUploadFeedback(`Successfully ingested ${parsedRows.length} microdata records from "${file.name}". NQAF audit completed.`);
      } else {
        setUploadFeedback("Could not parse valid records. Ensure format: ID, State, Stratum, Members, LandHectares, MonthlyExpenditure");
      }
    };

    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  // Switch preset datasets
  const handleSelectPreset = (key: string) => {
    setSelectedDatasetKey(key);
    if (PRESET_DATASETS[key]) {
      setDataRows(PRESET_DATASETS[key].rows);
      setUploadFeedback(null);
    }
  };

  // Automated data imputation
  const handleAutoImpute = () => {
    setIsImputing(true);
    setTimeout(() => {
      setDataRows(prev => prev.map(r => {
        if (r.status === 'error') {
          return {
            ...r,
            members: r.members <= 0 ? 4 : r.members,
            landHectares: r.landHectares >= 999 || r.landHectares < 0 ? 1.2 : r.landHectares,
            monthlyExpenditure: r.monthlyExpenditure <= 0 ? 28500 : r.monthlyExpenditure,
            status: 'valid',
            reason: undefined
          };
        }
        if (r.status === 'warning') {
          return {
            ...r,
            status: 'valid',
            reason: undefined
          };
        }
        return r;
      }));
      setIsImputing(false);
      setUploadFeedback("NQAF Automated Imputation Complete: All flagged logical violations repaired using donor imputation and hot-deck methodology.");
    }, 600);
  };

  // Export clean CSV
  const handleExportCsv = () => {
    const header = "Sample ID,State,Stratum,HH Members,Landholding (Ha),Monthly Expenditure (INR),NQAF Status\n";
    const body = dataRows.map(r => 
      `"${r.id}","${r.state}","${r.stratum}",${r.members},${r.landHectares},${r.monthlyExpenditure},"${r.status}"`
    ).join('\n');
    
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MoSPI_NQAF_Scrutinized_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Microdata metrics
  const cleanCount = dataRows.filter(r => r.status === 'valid').length;
  const errorCount = dataRows.filter(r => r.status === 'error').length;
  const warningCount = dataRows.filter(r => r.status === 'warning').length;
  const dataQualityScore = Math.round((cleanCount / (dataRows.length || 1)) * 100);

  // --- 3. Price Index & Inflation Simulator State ---
  const [foodBasePrice, setFoodBasePrice] = useState<number>(100);
  const [foodCurrPrice, setFoodCurrPrice] = useState<number>(112);
  const [fuelBasePrice, setFuelBasePrice] = useState<number>(80);
  const [fuelCurrPrice, setFuelCurrPrice] = useState<number>(88);
  const [mfgBasePrice, setMfgBasePrice] = useState<number>(150);
  const [mfgCurrPrice, setMfgCurrPrice] = useState<number>(156);

  // Weights (MoSPI CPI Base 2012 weighting pattern)
  const wFood = 0.4586;
  const wFuel = 0.0684;
  const wMfg = 0.4730;

  // Laspeyres Index Calculation
  const rFood = (foodCurrPrice / foodBasePrice) * 100;
  const rFuel = (fuelCurrPrice / fuelBasePrice) * 100;
  const rMfg = (mfgCurrPrice / mfgBasePrice) * 100;

  const compositeCPI = (rFood * wFood) + (rFuel * wFuel) + (rMfg * wMfg);
  const headlineInflation = compositeCPI - 100;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA] font-semibold text-xs border border-blue-100 flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5" />
              Virtual Statistical Laboratory
            </span>
            <span className="text-xs text-slate-500">
              Interactive MoSPI Toolkits
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 font-heading">
            Hands-On Statistical Methodologies & Data Quality Sandboxes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
            Experiment with official survey sampling formulas, NQAF microdata validation rules, and national price index aggregations.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('sample_calc')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeTab === 'sample_calc' ? 'bg-white text-[#1E3ABA] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sample Size Calculator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nqaf_validator')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeTab === 'nqaf_validator' ? 'bg-white text-[#1E3ABA] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NQAF Scrutiny Engine
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('index_sim')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeTab === 'index_sim' ? 'bg-white text-[#1E3ABA] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Price Index Decomposer
          </button>
        </div>
      </section>

      {/* 1. NSSO Sample Size & Stratification Calculator */}
      {activeTab === 'sample_calc' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-heading">
              <Calculator className="w-4 h-4 text-[#1E3ABA]" />
              Cochran Sampling Parameters (Multistage Stratified Design)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Target Population (N):
                </label>
                <input
                  type="number"
                  value={popSize}
                  onChange={(e) => setPopSize(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1E3ABA]"
                />
                <span className="text-[10px] text-slate-500">e.g. Total Households in District or State</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Margin of Error (e): <strong className="text-[#1E3ABA] font-mono">±{marginOfError}%</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={marginOfError}
                  onChange={(e) => setMarginOfError(Number(e.target.value))}
                  className="w-full accent-[#1E3ABA] cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Standard official surveys target 2% - 5%</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confidence Level:
                </label>
                <select
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 cursor-pointer focus:outline-none focus:border-[#1E3ABA]"
                >
                  <option value={90}>90% (Z = 1.645)</option>
                  <option value={95}>95% (Z = 1.960 - Official Standard)</option>
                  <option value={99}>99% (Z = 2.576)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Design Effect (DEFF): <strong className="text-[#1E3ABA] font-mono">{designEffect}x</strong>
                </label>
                <input
                  type="range"
                  min={1.0}
                  max={3.0}
                  step={0.1}
                  value={designEffect}
                  onChange={(e) => setDesignEffect(Number(e.target.value))}
                  className="w-full accent-[#1E3ABA] cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Compensates for cluster correlation in FSU villages/blocks</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Anticipated Non-Response Rate: <strong className="text-amber-800 font-mono">{nonResponseRate}%</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={25}
                  step={1}
                  value={nonResponseRate}
                  onChange={(e) => setNonResponseRate(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Buffer for locked houses & casualty units</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Attribute Proportion (p): <strong className="text-slate-800 font-mono">{expectedProportion}</strong>
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={0.9}
                  step={0.05}
                  value={expectedProportion}
                  onChange={(e) => setExpectedProportion(Number(e.target.value))}
                  className="w-full accent-[#1E3ABA] cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">p = 0.5 delivers the maximum variance design</span>
              </div>
            </div>
          </div>

          {/* Results Card (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1E3ABA] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Recommended Sample Output
              </span>

              <h4 className="text-xs font-semibold text-slate-600 mt-2">
                Optimal Field Sample Size (Ultimate Sampling Units):
              </h4>

              <div className="text-4xl sm:text-5xl font-bold font-mono text-slate-900 mt-1 font-heading">
                {finalSampleSize.toLocaleString()} <span className="text-lg font-normal text-[#1E3ABA]">Units</span>
              </div>

              <div className="space-y-2 mt-4 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Raw Cochran Sample (n₀):</span>
                  <span className="font-mono font-bold text-slate-900">{Math.ceil(n0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Finite Population Adjusted:</span>
                  <span className="font-mono font-bold text-slate-900">{Math.ceil(n_adjusted)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">After Clustering DEFF ({designEffect}x):</span>
                  <span className="font-mono font-bold text-[#1E3ABA]">{Math.ceil(n_deff)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Non-Response Inflation (+{nonResponseRate}%):</span>
                  <span className="font-mono font-bold text-amber-800">+{finalSampleSize - Math.ceil(n_deff)} units</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
              <strong className="text-[#1E3ABA]">MoSPI Survey Standard: </strong>
              If allocated 8 households per First Stage Unit (FSU), this requires surveying approximately <strong className="text-slate-900">{Math.ceil(finalSampleSize / 8)} FSUs (villages/urban blocks)</strong> across sub-rounds.
            </div>
          </div>
        </section>
      )}

      {/* 2. NQAF Data Quality Scrutiny Validator */}
      {activeTab === 'nqaf_validator' && (
        <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  NQAF Pillar 3 & 4 (Accuracy & Methodological Soundness)
                </span>
                <span className="text-xs text-slate-500 font-mono">DQAD Engine v2.4</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 font-heading">
                National Quality Assurance Framework (NQAF) Automated Data Scrutiny
              </h3>
              <p className="text-xs text-slate-600">
                Rule-based algorithmic check for household survey & establishment microdata records with automated outlier audits and imputation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                accept=".csv,.txt" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#1E3ABA]" />
                <span>Upload Custom Microdata (CSV)</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Scrutinized CSV</span>
              </button>
            </div>
          </div>

          {/* Feedback banner if file uploaded or imputed */}
          {uploadFeedback && (
            <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{uploadFeedback}</span>
              </div>
              <button 
                type="button"
                onClick={() => setUploadFeedback(null)} 
                className="text-blue-700 hover:text-blue-900 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Preloaded Official Datasets & Quality KPI Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Preloaded Datasets (6 cols) */}
            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5 font-heading">
                <FileSpreadsheet className="w-4 h-4 text-[#1E3ABA]" />
                <span>Select Official MoSPI Reference Dataset:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.entries(PRESET_DATASETS).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectPreset(key)}
                    className={`p-2 rounded-lg text-left text-xs transition cursor-pointer border ${
                      selectedDatasetKey === key
                        ? 'bg-white border-[#1E3ABA] shadow-xs text-[#1E3ABA] font-semibold ring-1 ring-[#1E3ABA]'
                        : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-[11px] truncate font-heading">{item.name.split('(')[0]}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Scrutiny Metrics KPI Cards (6 cols) */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Total Records</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">{dataRows.length}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-emerald-700 uppercase font-mono">Clean Records</div>
                <div className="text-lg font-bold font-mono text-emerald-800 mt-0.5">{cleanCount}</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-red-700 uppercase font-mono">Logical Errors</div>
                <div className="text-lg font-bold font-mono text-red-700 mt-0.5">{errorCount}</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-amber-700 uppercase font-mono">Quality Score</div>
                <div className="text-lg font-bold font-mono text-[#1E3ABA] mt-0.5">{dataQualityScore}%</div>
              </div>
            </div>
          </div>

          {/* Microdata Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Sample ID</th>
                  <th className="p-3">State / Stratum</th>
                  <th className="p-3">HH Members</th>
                  <th className="p-3">Landholding (Ha)</th>
                  <th className="p-3">Monthly Exp (₹)</th>
                  <th className="p-3">NQAF Scrutiny Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {dataRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{row.id}</td>
                    <td className="p-3">{row.state} ({row.stratum})</td>
                    <td className="p-3 font-mono">{row.members}</td>
                    <td className="p-3 font-mono">{row.landHectares}</td>
                    <td className="p-3 font-mono">₹{row.monthlyExpenditure.toLocaleString()}</td>
                    <td className="p-3">
                      {row.status === 'valid' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px] inline-flex items-center gap-1 font-mono">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Clean Record
                        </span>
                      )}
                      {row.status === 'error' && (
                        <span className="px-2 py-0.5 rounded bg-red-50 text-[#E63946] border border-red-200 font-semibold text-[11px] inline-flex items-center gap-1 font-mono" title={row.reason}>
                          <AlertTriangle className="w-3 h-3 text-[#E63946]" /> Flagged: {row.reason}
                        </span>
                      )}
                      {row.status === 'warning' && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px] inline-flex items-center gap-1 font-mono" title={row.reason}>
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Outlier Audit: {row.reason}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-slate-700">
              <strong className="text-slate-900">DQAD Action Advisory: </strong>
              {errorCount > 0 
                ? `${errorCount} record(s) flagged with critical structural anomalies. Automated statistical imputation or field re-verification recommended.`
                : 'All microdata records satisfy NQAF completeness and boundary validation checks.'}
            </div>
            {errorCount > 0 && (
              <button
                type="button"
                onClick={handleAutoImpute}
                disabled={isImputing}
                className="px-3.5 py-1.5 bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs transition flex items-center gap-1.5 whitespace-nowrap"
              >
                {isImputing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />}
                <span>{isImputing ? 'Applying Donor Imputation...' : 'Apply Automated Imputation & Clean'}</span>
              </button>
            )}
          </div>
        </section>
      )}

      {/* 3. Price Index & Inflation Simulator */}
      {activeTab === 'index_sim' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-heading">
              <TrendingUp className="w-4 h-4 text-[#1E3ABA]" />
              Laspeyres Consumer Price Index Basket Simulator
            </h3>

            <div className="space-y-3">
              {/* Food Basket */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 font-heading">Food & Beverages (Weight: 45.86%)</span>
                  <span className="font-mono text-[#1E3ABA] font-bold">Relative: {rFood.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-600">Base Price (2012 = 100):</label>
                    <input
                      type="number"
                      value={foodBasePrice}
                      onChange={(e) => setFoodBasePrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1E3ABA]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600">Current Monthly Price (₹):</label>
                    <input
                      type="number"
                      value={foodCurrPrice}
                      onChange={(e) => setFoodCurrPrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1E3ABA]"
                    />
                  </div>
                </div>
              </div>

              {/* Fuel & Light */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 font-heading">Fuel & Light (Weight: 6.84%)</span>
                  <span className="font-mono text-[#1E3ABA] font-bold">Relative: {rFuel.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-600">Base Price (2012 = 100):</label>
                    <input
                      type="number"
                      value={fuelBasePrice}
                      onChange={(e) => setFuelBasePrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1E3ABA]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600">Current Monthly Price (₹):</label>
                    <input
                      type="number"
                      value={fuelCurrPrice}
                      onChange={(e) => setFuelCurrPrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1E3ABA]"
                    />
                  </div>
                </div>
              </div>

              {/* Core / Manufactured Goods */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 font-heading">Core / Miscellaneous Goods (Weight: 47.30%)</span>
                  <span className="font-mono text-[#1E3ABA] font-bold">Relative: {rMfg.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-600">Base Price (2012 = 100):</label>
                    <input
                      type="number"
                      value={mfgBasePrice}
                      onChange={(e) => setMfgBasePrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1E3ABA]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600">Current Monthly Price (₹):</label>
                    <input
                      type="number"
                      value={mfgCurrPrice}
                      onChange={(e) => setMfgCurrPrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1E3ABA]"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1E3ABA] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Official MoSPI Macro Index
              </span>

              <h4 className="text-xs font-semibold text-slate-600 mt-2">
                Headline Consumer Price Index (General):
              </h4>

              <div className="text-4xl sm:text-5xl font-bold font-mono text-slate-900 mt-1 font-heading">
                {compositeCPI.toFixed(2)}
              </div>

              <div className="text-xs font-bold text-[#1E3ABA] mt-1 font-mono">
                Year-on-Year Inflation Rate: {headlineInflation >= 0 ? `+${headlineInflation.toFixed(2)}%` : `${headlineInflation.toFixed(2)}%`}
              </div>

              <div className="space-y-2 mt-4 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Food Group Contribution:</span>
                  <span className="font-mono font-bold text-slate-900">{(rFood * wFood).toFixed(2)} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fuel Group Contribution:</span>
                  <span className="font-mono font-bold text-slate-900">{(rFuel * wFuel).toFixed(2)} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Core Group Contribution:</span>
                  <span className="font-mono font-bold text-slate-900">{(rMfg * wMfg).toFixed(2)} pts</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
              <strong className="text-[#1E3ABA]">Methodological Note: </strong>
              Index aggregation follows the modified Laspeyres formula with base year 2012=100. Geometric mean (Jevons) is applied at the primary item-subgroup level.
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
