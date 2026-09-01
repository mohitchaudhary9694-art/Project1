import React, { useState } from 'react';
import { UserProfile, CompetencyItem, CompetencyDomain, ProficiencyLevel, iGOTCourse } from '../types';
import { 
  Sparkles, 
  Layers, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  BrainCircuit, 
  RefreshCw, 
  ChevronRight, 
  Award,
  Info,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface CompetencyExplorerProps {
  currentUser: UserProfile;
  allCourses: iGOTCourse[];
  onUpdateCompetencyLevel: (competencyId: string, newLevel: ProficiencyLevel) => void;
  onOpenCourseModal: (course: iGOTCourse) => void;
  onEnrollCourse: (courseId: string) => void;
}

export const CompetencyExplorer: React.FC<CompetencyExplorerProps> = ({
  currentUser,
  allCourses,
  onUpdateCompetencyLevel,
  onOpenCourseModal,
  onEnrollCourse,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<CompetencyDomain | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyGaps, setOnlyGaps] = useState<boolean>(false);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const domainTabs: { id: CompetencyDomain | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Domains', count: currentUser.competencies.length },
    { id: 'statistical', label: 'Statistical Methodologies', count: currentUser.competencies.filter(c => c.category === 'statistical').length },
    { id: 'technical', label: 'Technical & Data Tools', count: currentUser.competencies.filter(c => c.category === 'technical').length },
    { id: 'digital_governance', label: 'Digital Governance & Privacy', count: currentUser.competencies.filter(c => c.category === 'digital_governance').length },
    { id: 'managerial', label: 'Leadership & Management', count: currentUser.competencies.filter(c => c.category === 'managerial').length },
  ];

  const filteredCompetencies = currentUser.competencies.filter((c) => {
    const matchesDomain = selectedDomain === 'all' || c.category === selectedDomain;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGap = !onlyGaps || c.gap > 0;
    return matchesDomain && matchesSearch && matchesGap;
  });

  const handleRunAiAnalysis = async () => {
    setIsAnalyzingAI(true);
    setAiError(null);
    try {
      const response = await fetch('/api/competency/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentUser,
          selfAssessment: {
            criticalGapsCount: currentUser.competencies.filter(c => c.gap > 0).length,
            highestPriorityAreas: currentUser.competencies.filter(c => c.priority === 'critical').map(c => c.name),
          },
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setAiReport(json.data);
      } else {
        setAiError(json.error || 'Failed to generate AI diagnostic.');
      }
    } catch (err: any) {
      console.error(err);
      setAiError('Network error connecting to AI analysis engine.');
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const getProficiencyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Level 1: Novice / Awareness';
      case 2: return 'Level 2: Basic Working Knowledge';
      case 3: return 'Level 3: Competent Practitioner';
      case 4: return 'Level 4: Proficient Specialist';
      case 5: return 'Level 5: Master / Expert Director';
      default: return `Level ${level}`;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & AI Analysis Trigger */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA] font-semibold text-xs border border-blue-100">
              National Statistical Competency Framework
            </span>
            <span className="text-xs text-slate-500">
              MoSPI • NSSTA Benchmark
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 font-heading">
            Competency Profiler & Skill-Gap Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
            Evaluate your skills across 16 core competencies defined by MoSPI & NSSTA. Identify developmental gaps and receive customized learning interventions.
          </p>
        </div>

        <button
          type="button"
          disabled={isAnalyzingAI}
          onClick={handleRunAiAnalysis}
          className="py-2.5 px-5 bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold text-xs sm:text-sm rounded-lg transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60 flex-shrink-0"
        >
          {isAnalyzingAI ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Generating Diagnostic Report...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#F4B400]" />
              Generate AI Skill-Gap Diagnostic
            </>
          )}
        </button>
      </section>

      {/* AI Diagnostic Report Drawer / Banner */}
      {aiReport && (
        <section className="bg-white border-2 border-[#1E3ABA] rounded-xl p-5 sm:p-6 shadow-md space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="icon-badge-blue">
                <BrainCircuit className="w-5 h-5 text-[#1E3ABA]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                  Official AI Competency Diagnostic Report
                  <span className="text-[10px] bg-blue-50 text-[#1E3ABA] px-2 py-0.5 rounded font-mono font-semibold border border-blue-100">
                    Gemini 2.5 Flash
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Customized for {currentUser.name} ({currentUser.designation}, {currentUser.department})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAiReport(null)}
              className="text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <strong className="text-[#1E3ABA]">Executive Summary: </strong>
            {aiReport.summary}
          </div>

          {/* Critical Gaps Table */}
          {aiReport.criticalGapAreas && aiReport.criticalGapAreas.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                <AlertTriangle className="w-4 h-4 text-[#E63946]" />
                Critical Developmental Interventions:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {aiReport.criticalGapAreas.map((gap: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2 shadow-xs">
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-semibold uppercase text-[#1E3ABA]">{gap.domain}</span>
                        <span className="px-1.5 py-0.5 rounded bg-red-100 text-[#E63946] font-semibold font-mono">
                          {gap.gapSeverity || 'Critical'}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{gap.skill}</h5>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">{gap.reason}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-[11px]">
                      <span className="text-slate-500">Action: </span>
                      <strong className="text-emerald-700">{gap.recommendedAction}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategic Recommendation */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-3">
            <Compass className="w-5 h-5 text-[#1E3ABA] mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-slate-900">12-Month Strategic Recommendation: </strong>
              {aiReport.strategicRecommendation}
              <div className="mt-1 text-[11px] text-slate-600 font-mono">
                Estimated Closing Time: <span className="text-[#1E3ABA] font-bold">{aiReport.estimatedTimeToCloseGapsWeeks || 8} Weeks</span> with 4 hrs/week dedication on iGOT Karmayogi.
              </div>
            </div>
          </div>
        </section>
      )}

      {aiError && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-[#E63946] text-xs">
          {aiError}
        </div>
      )}

      {/* Filter & Search Bar */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        {/* Domain Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {domainTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedDomain(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                selectedDomain === tab.id
                  ? 'bg-[#1E3ABA] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedDomain === tab.id ? 'bg-blue-800 text-blue-100 font-mono' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Only Gaps Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search competencies, sub-skills, keywords..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3ABA]"
            />
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyGaps}
                onChange={(e) => setOnlyGaps(e.target.checked)}
                className="w-4 h-4 accent-[#1E3ABA] rounded cursor-pointer"
              />
              <span className="font-semibold">Show Skill Gaps Only ({currentUser.competencies.filter(c => c.gap > 0).length})</span>
            </label>

            <span className="text-xs text-slate-500 font-mono">
              Showing {filteredCompetencies.length} of {currentUser.competencies.length}
            </span>
          </div>
        </div>
      </section>

      {/* Competencies List Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCompetencies.map((comp) => {
          const hasGap = comp.gap > 0;
          return (
            <div
              key={comp.id}
              className={`p-5 rounded-xl bg-white border transition shadow-xs flex flex-col justify-between gap-3.5 ${
                hasGap ? 'border-amber-200 hover:border-[#1E3ABA]' : 'border-slate-200 hover:border-emerald-500'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1E3ABA] px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
                    {comp.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {hasGap ? (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase flex items-center gap-1 font-mono ${
                        comp.priority === 'critical'
                          ? 'bg-red-50 text-[#E63946] border border-red-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <AlertTriangle className="w-3 h-3" />
                        Gap: -{comp.gap} Levels
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3" /> Target Closed
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug font-heading">
                  {comp.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {comp.description}
                </p>
              </div>

              {/* Sub-skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                {comp.subSkills.map((sub, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                  >
                    {sub}
                  </span>
                ))}
              </div>

              {/* Interactive Proficiency Level Selector */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Current: <strong className="text-[#1E3ABA]">Level {comp.currentLevel}</strong>
                  </span>
                  <span className="text-slate-600">
                    Role Benchmark: <strong className="text-emerald-700">Level {comp.targetLevel}</strong>
                  </span>
                </div>

                {/* 5-Step Proficiency Buttons */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isSelected = comp.currentLevel === lvl;
                    const isTarget = comp.targetLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => onUpdateCompetencyLevel(comp.id, lvl as ProficiencyLevel)}
                        className={`py-2 rounded-lg text-xs font-semibold transition flex flex-col items-center justify-center relative cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E3ABA] text-white shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                        }`}
                        title={getProficiencyLabel(lvl)}
                      >
                        <span>L{lvl}</span>
                        {isTarget && (
                          <span className={`text-[8px] uppercase tracking-tighter ${isSelected ? 'text-blue-100 font-bold' : 'text-emerald-700 font-bold'}`}>
                            Target
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Course Link */}
              {comp.recommendedCourseIds.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Recommended iGOT Module:</span>
                  {(() => {
                    const course = allCourses.find(c => c.id === comp.recommendedCourseIds[0]);
                    if (!course) return null;
                    return (
                      <button
                        type="button"
                        onClick={() => onOpenCourseModal(course)}
                        className="text-xs font-semibold text-[#1E3ABA] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{course.code}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </section>

    </div>
  );
};
