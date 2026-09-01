import React, { useState } from 'react';
import { UserProfile, iGOTCourse, LearningPathway, CompetencyDomain } from '../types';
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  Award, 
  Star, 
  PlayCircle, 
  Layers, 
  ExternalLink, 
  ChevronRight, 
  RefreshCw, 
  Check, 
  UserCheck, 
  ShieldCheck, 
  Sparkles,
  FileCheck2,
  X,
  GraduationCap
} from 'lucide-react';

interface IGOTCoursesHubProps {
  currentUser: UserProfile;
  allCourses: iGOTCourse[];
  allPathways: LearningPathway[];
  onEnrollCourse: (courseId: string) => void;
  onSyncCourseProgress: (courseId: string) => void;
}

export const IGOTCoursesHub: React.FC<IGOTCoursesHubProps> = ({
  currentUser,
  allCourses,
  allPathways,
  onEnrollCourse,
  onSyncCourseProgress,
}) => {
  const [activeView, setActiveView] = useState<'courses' | 'pathways'>('courses');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<CompetencyDomain | 'all'>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [onlyTpacApproved, setOnlyTpacApproved] = useState<boolean>(false);
  const [selectedCourseModal, setSelectedCourseModal] = useState<iGOTCourse | null>(null);
  const [simulatedPlayerOpen, setSimulatedPlayerOpen] = useState<boolean>(false);
  const [activeModuleIdx, setActiveModuleIdx] = useState<number>(0);
  const [syncingCourseId, setSyncingCourseId] = useState<string | null>(null);

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skillsGained.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDomain = selectedDomain === 'all' || course.competencyDomain === selectedDomain;
    const matchesProvider = selectedProvider === 'all' || course.provider === selectedProvider;
    const matchesTpac = !onlyTpacApproved || course.tpacApproved;

    return matchesSearch && matchesDomain && matchesProvider && matchesTpac;
  });

  const handleLaunchSimulatedLMS = (course: iGOTCourse) => {
    setSelectedCourseModal(course);
    setSimulatedPlayerOpen(true);
    setActiveModuleIdx(0);
  };

  const handleCompleteModuleInSimulator = (course: iGOTCourse) => {
    setSyncingCourseId(course.id);
    setTimeout(() => {
      onSyncCourseProgress(course.id);
      setSyncingCourseId(null);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA] font-semibold text-xs border border-blue-100 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              iGOT Karmayogi National Portal Integration
            </span>
            <span className="text-xs text-slate-500">
              DoPT • MoSPI • NSSTA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-heading">
            Official Statistical Learning Hub & TPAC Repository
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
            Curated capacity-building programmes accredited under the Training Programme Approval Committee (TPAC) and synced with the national iGOT Karmayogi ecosystem.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveView('courses')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeView === 'courses'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Course Catalog ({allCourses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('pathways')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeView === 'pathways'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Learning Pathways ({allPathways.length})
          </button>
        </div>
      </section>

      {/* Main Catalog View */}
      {activeView === 'courses' && (
        <>
          {/* Search and Filters */}
          <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Search */}
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, code (e.g. STAT-401), skill or keyword..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E3ABA]"
                />
              </div>

              {/* Domain Filter */}
              <div>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1E3ABA]"
                >
                  <option value="all">All Competency Domains</option>
                  <option value="statistical">Statistical Methodologies</option>
                  <option value="technical">Technical & Python Tools</option>
                  <option value="digital_governance">Digital Governance & DPDPA</option>
                  <option value="managerial">Leadership & Ethics</option>
                </select>
              </div>

              {/* Provider Filter */}
              <div>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1E3ABA]"
                >
                  <option value="all">All Accreditations</option>
                  <option value="NSSTA">NSSTA Academy</option>
                  <option value="MoSPI-TPAC">MoSPI TPAC Certified</option>
                  <option value="iGOT Karmayogi">iGOT Karmayogi Portal</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyTpacApproved}
                  onChange={(e) => setOnlyTpacApproved(e.target.checked)}
                  className="w-4 h-4 accent-[#1E3ABA] rounded cursor-pointer"
                />
                <span className="font-semibold text-slate-800">
                  ⭐ Show NSSTA TPAC Approved Programmes Only
                </span>
              </label>

              <span className="text-slate-500 font-mono">
                Showing {filteredCourses.length} of {allCourses.length} accredited courses
              </span>
            </div>
          </section>

          {/* Courses Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => {
              const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);

              return (
                <div
                  key={course.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#1E3ABA] transition shadow-xs flex flex-col justify-between gap-3 group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1E3ABA] border border-blue-100">
                        {course.code}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="font-bold">{course.rating}</span>
                        <span className="text-slate-400 text-[10px]">({course.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#1E3ABA] transition line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1">
                    {course.skillsGained.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#1E3ABA]" />
                        {course.durationHours} hrs ({course.credits} CPD Credits)
                      </span>
                      <span className="font-semibold text-slate-700">
                        {course.level}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCourseModal(course)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center transition border border-slate-200 cursor-pointer"
                      >
                        Syllabus Details
                      </button>

                      {isEnrolled ? (
                        <button
                          type="button"
                          onClick={() => handleLaunchSimulatedLMS(course)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition shadow-xs cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          Launch LMS
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onEnrollCourse(course.id)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs font-semibold flex items-center justify-center gap-1 transition shadow-xs cursor-pointer"
                        >
                          + Enroll on iGOT
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}

      {/* Learning Pathways View */}
      {activeView === 'pathways' && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {allPathways.map((pathway) => (
              <div
                key={pathway.id}
                className="p-6 rounded-xl bg-white border border-slate-200 border-t-4 border-t-[#1E3ABA] hover:border-[#1E3ABA] transition shadow-xs flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA] font-bold font-mono">
                      {pathway.tpacRefNumber}
                    </span>
                    <span className="text-slate-700 font-semibold">
                      {pathway.estimatedWeeks} Weeks Track
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug font-heading">
                    {pathway.title}
                  </h3>

                  <div className="text-xs font-semibold text-[#1E3ABA] mt-1">
                    Target: {pathway.targetRole} ({pathway.targetWing})
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {pathway.description}
                  </p>
                </div>

                {/* Courses included */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Curated Modules ({pathway.courseIds.length}):
                  </span>
                  <div className="space-y-1.5">
                    {pathway.courseIds.map((cId) => {
                      const c = allCourses.find(item => item.id === cId);
                      if (!c) return null;
                      return (
                        <div
                          key={c.id}
                          className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-800"
                        >
                          <span className="truncate pr-2">{c.title}</span>
                          <span className="text-[10px] font-mono text-[#1E3ABA] font-bold flex-shrink-0">{c.durationHours}h</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      pathway.courseIds.forEach(id => onEnrollCourse(id));
                      setActiveView('courses');
                    }}
                    className="w-full py-2.5 px-4 bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    Enroll in Entire Pathway ({pathway.totalHours} CPD Hours)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Course Details Modal */}
      {selectedCourseModal && !simulatedPlayerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1E3ABA] font-bold font-mono text-xs">
                    {selectedCourseModal.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedCourseModal.provider}
                  </span>
                  {selectedCourseModal.tpacApproved && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      TPAC Approved
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-heading">
                  {selectedCourseModal.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourseModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedCourseModal.description}
            </p>

            {/* Learning Objectives */}
            <div className="space-y-2 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-[#1E3ABA]" />
                Key Learning Outcomes & Competency Standards:
              </h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {selectedCourseModal.learningObjectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#1E3ABA] font-bold">✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modules Syllabus */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Course Curriculum ({selectedCourseModal.modules.length} Modules):
              </h4>
              <div className="space-y-2">
                {selectedCourseModal.modules.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{m.title}</span>
                      <span className="font-mono text-[#1E3ABA] text-[11px]">{m.duration}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-1.5">
                      {m.topics.map((t, tIdx) => (
                        <span key={tIdx} className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          • {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructors */}
            <div className="text-xs text-slate-500 border-t border-slate-100 pt-3">
              <strong className="text-slate-800">Faculty & Resource Persons: </strong>
              {selectedCourseModal.instructors.join(', ')}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCourseModal(null)}
                className="py-2 px-4 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleLaunchSimulatedLMS(selectedCourseModal)}
                className="py-2 px-5 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                Launch iGOT Interactive Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated iGOT Karmayogi LMS Player Modal */}
      {selectedCourseModal && simulatedPlayerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white border border-slate-300 rounded-xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
            
            {/* Player Topbar */}
            <div className="bg-slate-900 text-white px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-white font-mono">
                  iGOT Karmayogi Interactive Player
                </span>
                <span className="text-slate-300 text-xs hidden sm:inline">
                  | {selectedCourseModal.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSimulatedPlayerOpen(false)}
                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Player Content Body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50">
              
              {/* Left Stage (8 cols): Simulated Video / Interactive Sandbox */}
              <div className="lg:col-span-8 space-y-4">
                <div className="w-full aspect-video rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden shadow-inner">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-3">
                    <PlayCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {selectedCourseModal.modules[activeModuleIdx]?.title || 'Interactive Lesson'}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mt-1">
                    Streaming accredited lecture from {selectedCourseModal.instructors[0] || 'NSSTA Faculty'} with embedded interactive checks.
                  </p>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg">
                    <span>Lesson {activeModuleIdx + 1} of {selectedCourseModal.modules.length}</span>
                    <span className="font-mono text-emerald-400">● Live LMS Telemetry Active</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5 font-heading">
                    <Sparkles className="w-4 h-4 text-[#F4B400]" />
                    Key Methodological Takeaways for Official Practice:
                  </h5>
                  <div className="text-slate-600 leading-relaxed space-y-1">
                    <div>• Ensure all primary sampling units are matched against the latest Urban Frame Survey (UFS) boundary maps.</div>
                    <div>• For National Accounts aggregates, cross-validate enterprise records with MCA-21 XBRL e-filings using the prescribed blow-up factor.</div>
                    <div>• Enforce strict Section 17 DPDPA statistical privacy safeguards before releasing unit-level tabulations.</div>
                  </div>
                </div>
              </div>

              {/* Right Stage (4 cols): Modules Playlist & Progress Sync */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-heading">
                    Curriculum Modules
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {selectedCourseModal.modules.map((m, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveModuleIdx(idx)}
                        className={`w-full p-2.5 rounded-lg text-left text-xs transition flex items-center justify-between cursor-pointer ${
                          activeModuleIdx === idx
                            ? 'bg-blue-50 text-[#1E3ABA] border border-blue-200 font-bold'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        <span className="truncate pr-2">{m.title}</span>
                        <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">{m.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={Boolean(syncingCourseId)}
                    onClick={() => handleCompleteModuleInSimulator(selectedCourseModal)}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {syncingCourseId ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Syncing with iGOT API...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Mark Lesson Complete & Sync CPD Credits
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-slate-500">
                    Automatically credits {selectedCourseModal.credits} hours to your MoSPI official transcript.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export const iGOTCoursesHub = IGOTCoursesHub;
