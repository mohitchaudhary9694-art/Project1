import React, { useState } from 'react';
import { 
  UserProfile, 
  CompetencyItem, 
  EvidenceLog, 
  CompetencyPassportData 
} from '../types';
import { 
  MOCK_COMPETENCY_PASSPORTS, 
  MOCK_EVIDENCE_LOGS 
} from '../data/mockData';
import { 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle2, 
  FileCheck, 
  Calendar, 
  User, 
  Building2, 
  Download, 
  QrCode, 
  Filter, 
  ExternalLink,
  Sparkles,
  Check
} from 'lucide-react';

interface CompetencyPassportProps {
  currentUser?: UserProfile;
  user?: UserProfile;
  onNavigate?: (tab: string) => void;
}

export const CompetencyPassport: React.FC<CompetencyPassportProps> = ({ currentUser, user: propUser, onNavigate }) => {
  const user = currentUser || propUser;
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-600 bg-white rounded-xl border border-slate-200">
        Officer profile not loaded.
      </div>
    );
  }

  const passportData: CompetencyPassportData = (user.id && MOCK_COMPETENCY_PASSPORTS[user.id]) || {
    passportId: `MoSPI-PASS-2026-${user.cadre}-${user.govEmployeeId ? user.govEmployeeId.slice(-4) : '9921'}`,
    issueDate: '2025-04-01',
    lastVerified: '2026-08-28',
    issuingAuthority: 'National Statistical Systems Training Academy (NSSTA) & MoSPI-TPAC',
    overallReadiness: 78,
    verifiedBadgesCount: 6,
    evidenceHistory: MOCK_EVIDENCE_LOGS,
    trendMap: {
      'comp_stat_1': 'improving',
      'comp_stat_2': 'improving',
      'comp_stat_3': 'stable',
      'comp_stat_4': 'declining',
      'comp_tech_1': 'improving',
      'comp_tech_3': 'stable',
      'comp_tech_5': 'improving',
      'comp_gov_1': 'improving',
    }
  };

  const filteredCompetencies = user.competencies.filter(c => 
    filterDomain === 'all' || c.category === filterDomain
  );

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining' = 'stable') => {
    switch (trend) {
      case 'improving':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Improving (↗)
          </span>
        );
      case 'declining':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E63946] bg-red-50 px-2 py-0.5 rounded border border-red-200">
            <TrendingDown className="w-3.5 h-3.5 text-[#E63946]" />
            Needs Attention (↘)
          </span>
        );
      case 'stable':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <Minus className="w-3.5 h-3.5" />
            Stable (→)
          </span>
        );
    }
  };

  const handleExportPassport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Official MoSPI Competency Passport Header Card */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Officer Info & Credentials */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1E3ABA] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E3ABA]" />
                Verified Digital Competency Passport
              </span>
              <span className="text-xs font-mono font-semibold text-[#1E3ABA]">
                {passportData.passportId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
              {user.name}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Designation: <strong className="text-slate-900">{user.designation}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#1E3ABA] shrink-0" />
                <span>Cadre & Wing: <strong className="text-slate-900">{user.cadre} • {user.department}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Issued: <strong className="text-slate-900">{passportData.issueDate}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Last Verified: <strong className="text-slate-900">{passportData.lastVerified}</strong></span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-mono pt-1">
              Issuing Authority: {passportData.issuingAuthority}
            </p>
          </div>

          {/* Readiness Score & Action */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4 self-start md:self-auto bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <div className="text-center sm:text-right">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Overall Cadre Readiness
              </div>
              <div className="text-3xl font-bold text-[#1E3ABA] font-heading">
                {passportData.overallReadiness}%
              </div>
              <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                {passportData.verifiedBadgesCount} Verified Competency Badges
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportPassport}
              className="px-4 py-2 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Exported PDF!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export Passport</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Module 9: Current vs Target Level per Competency Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Award className="w-5 h-5 text-[#1E3ABA]" />
              Official Competency Breakdown & Trend Indicators
            </h3>
            <p className="text-xs text-slate-600">
              Evaluated against MoSPI cadre benchmarks with longitudinal trend tracking (Improving ↗ / Stable → / Declining ↘).
            </p>
          </div>

          {/* Domain Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1E3ABA]"
            >
              <option value="all">All Domains</option>
              <option value="statistical">Statistical Methodologies</option>
              <option value="technical">Technical & Computing</option>
              <option value="digital_governance">Digital Governance</option>
            </select>
          </div>
        </div>

        {/* Competencies Table / Card List */}
        <div className="space-y-3">
          {filteredCompetencies.map((comp) => {
            const trend = passportData.trendMap[comp.id] || 'improving';
            const currentPct = (comp.currentLevel / 5) * 100;
            const targetPct = (comp.targetLevel / 5) * 100;
            const gap = comp.targetLevel - comp.currentLevel;

            return (
              <div
                key={comp.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition hover:border-[#1E3ABA] space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-[#1E3ABA] uppercase tracking-wider">
                      {comp.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {comp.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {getTrendIcon(trend)}
                    <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                      gap <= 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {gap <= 0 ? 'Target Met' : `Gap: -${gap}`}
                    </span>
                  </div>
                </div>

                {/* Level Comparison Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      Current: <strong className="text-slate-900 font-mono">Level {comp.currentLevel}/5</strong>
                    </span>
                    <span>
                      Cadre Target: <strong className="text-[#1E3ABA] font-mono">Level {comp.targetLevel}/5</strong>
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-blue-200 rounded-full"
                      style={{ width: `${targetPct}%` }}
                    />
                    <div
                      className="h-full rounded-full bg-[#1E3ABA]"
                      style={{ width: `${currentPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module 9: Evidence & Assessment History Log */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-heading">
              <FileCheck className="w-5 h-5 text-[#1E3ABA]" />
              Evidence & Assessment History Log
            </h3>
            <p className="text-xs text-slate-600">
              Cryptographically timestamped assessments, accredited iGOT certifications, and supervisory audits.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#1E3ABA] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
            {passportData.evidenceHistory.length} Logged Records
          </span>
        </div>

        {/* Evidence Logs List */}
        <div className="divide-y divide-slate-100">
          {passportData.evidenceHistory.map((ev) => (
            <div key={ev.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#1E3ABA] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-mono">
                    {ev.evidenceType}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {ev.date}
                  </span>
                  {ev.verified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      In Review
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  {ev.title}
                </h4>
                <p className="text-xs text-slate-600">
                  Issuer: <span className="text-slate-800">{ev.issuer}</span> {ev.certificateRef && `• Ref: ${ev.certificateRef}`}
                </p>
              </div>

              {ev.score !== undefined && (
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <div className="text-lg font-bold text-[#1E3ABA] font-heading">
                    {ev.score}%
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Score Achieved
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
