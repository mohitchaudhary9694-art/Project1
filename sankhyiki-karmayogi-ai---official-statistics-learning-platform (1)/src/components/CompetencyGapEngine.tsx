import React, { useState } from 'react';
import { CompetencyItem, CompetencyDomain, ProficiencyLevel } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Award, 
  Filter, 
  ArrowUpRight, 
  Sparkles, 
  ChevronRight,
  BarChart2,
  Zap,
  Target,
  Search
} from 'lucide-react';

interface CompetencyGapEngineProps {
  competencies: CompetencyItem[];
  userCadre: string;
  userRole: string;
  onLaunchQuizForCompetency?: (competencyName: string) => void;
  onViewCourse?: (courseId: string) => void;
  onLaunchDiagnostic?: () => void;
}

export const CompetencyGapEngine: React.FC<CompetencyGapEngineProps> = ({
  competencies,
  userCadre,
  userRole,
  onLaunchQuizForCompetency,
  onViewCourse,
  onLaunchDiagnostic,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate gaps dynamically
  const enrichedCompetencies = competencies.map((comp) => {
    const computedGap = Math.max(0, comp.targetLevel - comp.currentLevel);
    let severity: 'high' | 'medium' | 'low' = 'low';
    if (computedGap >= 2) {
      severity = 'high';
    } else if (computedGap === 1) {
      severity = 'medium';
    } else {
      severity = 'low';
    }

    return {
      ...comp,
      gap: computedGap,
      severity,
    };
  });

  // Filter competencies
  const filteredCompetencies = enrichedCompetencies.filter((comp) => {
    const matchesDomain = selectedDomain === 'all' || comp.category === selectedDomain;
    const matchesSeverity = selectedSeverity === 'all' || comp.severity === selectedSeverity;
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.subSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSeverity && matchesSearch;
  });

  // Summary counts
  const highGapsCount = enrichedCompetencies.filter(c => c.severity === 'high').length;
  const mediumGapsCount = enrichedCompetencies.filter(c => c.severity === 'medium').length;
  const lowGapsCount = enrichedCompetencies.filter(c => c.severity === 'low').length;

  const getSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-[#E63946] border border-red-200">
            <AlertTriangle className="w-3 h-3 text-[#E63946]" />
            High Gap (-2+)
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Medium Gap (-1)
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Benchmark Met
          </span>
        );
    }
  };

  const getDomainLabel = (category: CompetencyDomain) => {
    switch (category) {
      case 'statistical':
        return 'Statistical Methodology';
      case 'technical':
        return 'Data Tools & Computing';
      case 'digital_governance':
        return 'Digital Governance & DPDPA';
      case 'managerial':
        return 'Leadership & Policy Translation';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#1E3ABA] text-xs font-semibold">
                MoSPI National Competency Framework • Module 2
              </span>
              <span className="text-xs text-slate-500">
                Cadre Benchmark: <strong className="text-slate-800">{userCadre}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2 font-heading">
              AI Competency Gap Engine
              <Target className="w-5 h-5 text-[#1E3ABA]" />
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              Automated comparison of your validated assessment scores against statutory role requirements. High-gap areas automatically trigger priority learning recommendations.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-slate-50 border border-red-200 px-3.5 py-2 rounded-lg text-center">
              <div className="text-lg font-bold text-[#E63946] font-mono leading-none">{highGapsCount}</div>
              <div className="text-[10px] text-slate-600 font-semibold mt-1">High Gaps</div>
            </div>
            <div className="bg-slate-50 border border-amber-200 px-3.5 py-2 rounded-lg text-center">
              <div className="text-lg font-bold text-amber-600 font-mono leading-none">{mediumGapsCount}</div>
              <div className="text-[10px] text-slate-600 font-semibold mt-1">Medium Gaps</div>
            </div>
            <div className="bg-slate-50 border border-emerald-200 px-3.5 py-2 rounded-lg text-center">
              <div className="text-lg font-bold text-emerald-600 font-mono leading-none">{lowGapsCount}</div>
              <div className="text-[10px] text-slate-600 font-semibold mt-1">Target Met</div>
            </div>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Domain Filter */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1E3ABA]"
            >
              <option value="all">All Domains</option>
              <option value="statistical">Statistical Methodologies</option>
              <option value="technical">Technical & Computing</option>
              <option value="digital_governance">Digital Governance & DPDPA</option>
              <option value="managerial">Managerial & Policy</option>
            </select>

            {/* Severity Filter */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedSeverity('all')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  selectedSeverity === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({enrichedCompetencies.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedSeverity('high')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  selectedSeverity === 'high' ? 'bg-[#E63946] text-white shadow-xs' : 'text-red-700 hover:text-red-800'
                }`}
              >
                High ({highGapsCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedSeverity('medium')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  selectedSeverity === 'medium' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700 hover:text-amber-800'
                }`}
              >
                Med ({mediumGapsCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedSeverity('low')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  selectedSeverity === 'low' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-800'
                }`}
              >
                Met ({lowGapsCount})
              </button>
            </div>
          </div>

          {/* Search Input and Diagnostic Button */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="w-full md:w-64 relative">
              <input
                type="text"
                placeholder="Search skill (e.g. Sampling, Python)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3ABA]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {onLaunchDiagnostic && (
              <button
                type="button"
                onClick={onLaunchDiagnostic}
                className="px-3 py-1.5 bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer shadow-xs flex items-center gap-1.5"
                title="Launch the 4-Pillar Diagnostic Test to recalculate your baseline"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
                <span className="hidden sm:inline">Diagnostic Recalibration</span>
                <span className="sm:hidden">Diagnostic</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Competencies Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredCompetencies.map((comp) => {
          const currentPct = (comp.currentLevel / 5) * 100;
          const targetPct = (comp.targetLevel / 5) * 100;

          return (
            <div
              key={comp.id}
              className={`bg-white rounded-xl p-4 border transition flex flex-col justify-between shadow-xs hover:border-[#1E3ABA] ${
                comp.severity === 'high'
                  ? 'border-l-4 border-l-[#E63946] border-slate-200'
                  : comp.severity === 'medium'
                  ? 'border-l-4 border-l-amber-500 border-slate-200'
                  : 'border-l-4 border-l-emerald-600 border-slate-200'
              }`}
            >
              <div>
                {/* Card Top: Domain & Severity Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#1E3ABA] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {getDomainLabel(comp.category)}
                  </span>
                  {getSeverityBadge(comp.severity)}
                </div>

                {/* Competency Name & Description */}
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {comp.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {comp.description}
                </p>

                {/* Sub-skills Tags */}
                {comp.subSkills && comp.subSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {comp.subSkills.slice(0, 3).map((sub, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-50 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-mono"
                      >
                        {sub}
                      </span>
                    ))}
                    {comp.subSkills.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-mono py-0.5">
                        +{comp.subSkills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Progress & Actions Section */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                {/* Level Comparison Bar */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      Current: <strong className="text-slate-900 font-mono">Level {comp.currentLevel}/5</strong>
                    </span>
                    <span className="text-slate-600 flex items-center gap-1 font-mono">
                      Target: <strong className="text-slate-900">Level {comp.targetLevel}/5</strong>
                      {comp.gap > 0 ? ` (Gap: -${comp.gap})` : ' (Achieved)'}
                    </span>
                  </div>

                  {/* Dual Bar Graphic */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 relative overflow-hidden border border-slate-200">
                    {/* Target level ghost marker */}
                    <div
                      className="absolute top-0 bottom-0 bg-[#1E3ABA]/20 rounded-full"
                      style={{ width: `${targetPct}%` }}
                    />
                    {/* Current level solid bar */}
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        comp.severity === 'high'
                          ? 'bg-[#E63946]'
                          : comp.severity === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${currentPct}%` }}
                    />
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  {onLaunchQuizForCompetency && (
                    <button
                      type="button"
                      onClick={() => onLaunchQuizForCompetency(comp.name)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-200 transition cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Take Quiz</span>
                    </button>
                  )}

                  {comp.recommendedCourseIds && comp.recommendedCourseIds.length > 0 && onViewCourse && (
                    <button
                      type="button"
                      onClick={() => onViewCourse(comp.recommendedCourseIds[0])}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-xs font-semibold text-white transition cursor-pointer shadow-xs"
                    >
                      <span>Recommended Course</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
