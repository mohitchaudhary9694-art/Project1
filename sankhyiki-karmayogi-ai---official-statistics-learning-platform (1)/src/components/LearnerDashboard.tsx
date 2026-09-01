import React, { useState } from 'react';
import { UserProfile, iGOTCourse, LearningPathway, CompetencyDomain } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { RadarChart } from './RadarChart';
import { LearnPracticeProveStepper, LearningStage } from './LearnPracticeProveStepper';
import { 
  Sparkles, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Award, 
  RefreshCw, 
  ExternalLink, 
  ChevronRight, 
  PlayCircle,
  FileCheck,
  TrendingUp,
  BrainCircuit,
  Sliders,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap,
  Target,
  UserCog,
  Search,
  Users,
  Building2,
  MapPin,
  Bot,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  Compass,
  FileSearch,
  Check
} from 'lucide-react';

interface LearnerDashboardProps {
  currentUser: UserProfile;
  allCourses: iGOTCourse[];
  allPathways: LearningPathway[];
  onNavigate: (tab: string) => void;
  onEnrollCourse: (courseId: string) => void;
  onSyncCourseProgress: (courseId: string) => void;
  onOpenCourseModal: (course: iGOTCourse) => void;
  onOpenAIQuizWithDocument?: (docId: string) => void;
  onOpenProfileWizard?: () => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  currentUser,
  allCourses,
  allPathways,
  onNavigate,
  onEnrollCourse,
  onSyncCourseProgress,
  onOpenCourseModal,
  onOpenAIQuizWithDocument,
  onOpenProfileWizard,
}) => {
  const { t, isHindi, isPunjabi } = useLanguage();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackingId, setTrackingId] = useState<string>('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);

  // Compute domain proficiency averages for radar
  const domainAverages = [
    {
      label: t('competencyMatrix.statistical', 'Statistical Methods'),
      domain: 'statistical' as CompetencyDomain,
      current: Number(
        (currentUser.competencies.filter(c => c.category === 'statistical').reduce((acc, c) => acc + c.currentLevel, 0) /
        (currentUser.competencies.filter(c => c.category === 'statistical').length || 1)).toFixed(1)
      ),
      target: Number(
        (currentUser.competencies.filter(c => c.category === 'statistical').reduce((acc, c) => acc + c.targetLevel, 0) /
        (currentUser.competencies.filter(c => c.category === 'statistical').length || 1)).toFixed(1)
      ),
    },
    {
      label: t('competencyMatrix.technical', 'Technical & Python/AI'),
      domain: 'technical' as CompetencyDomain,
      current: Number(
        (currentUser.competencies.filter(c => c.category === 'technical').reduce((acc, c) => acc + c.currentLevel, 0) /
        (currentUser.competencies.filter(c => c.category === 'technical').length || 1)).toFixed(1)
      ),
      target: Number(
        (currentUser.competencies.filter(c => c.category === 'technical').reduce((acc, c) => acc + c.targetLevel, 0) /
        (currentUser.competencies.filter(c => c.category === 'technical').length || 1)).toFixed(1)
      ),
    },
    {
      label: t('competencyMatrix.digital_governance', 'Digital Governance'),
      domain: 'digital_governance' as CompetencyDomain,
      current: Number(
        (currentUser.competencies.filter(c => c.category === 'digital_governance').reduce((acc, c) => acc + c.currentLevel, 0) /
        (currentUser.competencies.filter(c => c.category === 'digital_governance').length || 1)).toFixed(1)
      ),
      target: Number(
        (currentUser.competencies.filter(c => c.category === 'digital_governance').reduce((acc, c) => acc + c.targetLevel, 0) /
        (currentUser.competencies.filter(c => c.category === 'digital_governance').length || 1)).toFixed(1)
      ),
    },
    {
      label: t('competencyMatrix.managerial', 'Leadership & Ethics'),
      domain: 'managerial' as CompetencyDomain,
      current: Number(
        (currentUser.competencies.filter(c => c.category === 'managerial').reduce((acc, c) => acc + c.currentLevel, 0) /
        (currentUser.competencies.filter(c => c.category === 'managerial').length || 1)).toFixed(1)
      ),
      target: Number(
        (currentUser.competencies.filter(c => c.category === 'managerial').reduce((acc, c) => acc + c.targetLevel, 0) /
        (currentUser.competencies.filter(c => c.category === 'managerial').length || 1)).toFixed(1)
      ),
    },
  ];

  // Filter critical gap areas (gap >= 1)
  const criticalGaps = currentUser.competencies.filter(c => c.gap > 0).sort((a, b) => b.gap - a.gap);
  const closedCompetencies = currentUser.competencies.filter(c => c.gap <= 0);

  // Enrolled Courses
  const enrolledCourses = allCourses.filter(c => currentUser.enrolledCourseIds.includes(c.id));

  // Find Best Pathway for user's wing
  const recommendedPathway = allPathways.find(p => p.targetWing === currentUser.department) || allPathways[0];

  const handleTriggerSync = (courseId: string) => {
    setSyncingId(courseId);
    setSyncSuccessMsg(null);
    setTimeout(() => {
      onSyncCourseProgress(courseId);
      setSyncingId(null);
      setSyncSuccessMsg(t('dashboard.syncSuccessMsg', 'Progress successfully synchronized with iGOT Karmayogi API! CPD credit hours recorded.'));
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    }, 800);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setTrackingResult(`${t('dashboard.trackStatusFor', 'Assessment / Verification Status for')} "${trackingId}": ${t('dashboard.verifiedByNssta', 'Verified by NSSTA Cadre Cell on 15-Aug-2026. 4 CPD hours credited.')}`);
  };

  const quickServices = [
    { id: 'competencies', name: t('nav.gap_engine', 'AI Gap Engine'), desc: t('dashboard.identifyGaps', 'Identify competency gaps'), icon: Target, badgeClass: 'icon-badge-blue' },
    { id: 'quiz_studio', name: t('nav.quiz_studio', 'Quiz Studio'), desc: t('dashboard.testSkills', 'Generate MCQs & test skills'), icon: FileCheck, badgeClass: 'icon-badge-amber' },
    { id: 'learning_assistant', name: t('nav.learning_assistant', 'RAG Assistant'), desc: t('dashboard.officialAiAssistant', 'Official statistics AI assistant'), icon: Bot, badgeClass: 'icon-badge-blue' },
    { id: 'competency_passport', name: t('nav.passport', 'Passport'), desc: t('dashboard.verifiableCredentials', 'Verifiable credentials'), icon: ShieldCheck, badgeClass: 'icon-badge-green' },
    { id: 'igot_hub', name: t('nav.igot_courses', 'iGOT Courses'), desc: t('dashboard.tpacCurriculum', 'TPAC curriculum'), icon: GraduationCap, badgeClass: 'icon-badge-blue' },
    { id: 'stat_lab', name: t('nav.stat_lab', 'Stat Lab'), desc: t('dashboard.virtualSandbox', 'Virtual statistical sandbox'), icon: FlaskConical, badgeClass: 'icon-badge-green' },
    { id: 'admin_analytics', name: t('nav.admin_oversight', 'Cadre Oversight'), desc: t('dashboard.institutionalAnalytics', 'Institutional analytics'), icon: Building2, badgeClass: 'icon-badge-slate' },
  ];

  return (
    <div className="space-y-6 pb-12">

      {/* Mobile-Only Blue Greeting Card */}
      <div className="sm:hidden bg-[#1E3ABA] text-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-100 font-medium">{t('dashboard.goodDay', 'Good Day,')}</div>
            <h2 className="text-lg font-bold font-heading">{currentUser.name.split(',')[0]}</h2>
            <div className="text-[11px] text-blue-200 mt-0.5">{currentUser.cadre} • {currentUser.department}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white">
            {currentUser.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Hero / Dashboard Header Section */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Top subtle tricolor accent line */}
        <div className="tricolor-strip-thin absolute top-0 left-0 right-0"></div>

        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-[#1E3ABA]">
            <Award className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>{t('dashboard.heroTag', 'Ministry of Statistics & Programme Implementation • Official Capacity Portal')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-tight font-heading">
            {t('dashboard.heroTitle', 'One Officer. Many Competencies. Limitless Growth.')}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-body">
            {t('dashboard.heroDesc', 'Empowering ISS, SSS, and State statistical personnel with automated competency gap intelligence, personalized iGOT Karmayogi learning pathways, and verifiable digital capacity credentials.')}
          </p>

          {/* Search Bar for competencies/courses/documents */}
          <div className="pt-2">
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('dashboard.searchPlaceholder', 'Search competencies, manuals (e.g., PLFS, ASI, SNA 2008, Python), or iGOT courses...')}
                className="w-full bg-slate-50 border border-slate-300 rounded-full pl-4 pr-12 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1E3ABA] focus:bg-white shadow-xs"
              />
              <button
                type="button"
                onClick={() => onNavigate('igot_hub')}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#1E3ABA] hover:bg-[#152E99] text-white rounded-full flex items-center justify-center transition cursor-pointer"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stat Highlights in Small White Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6 mt-6 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
            <div className="icon-badge-blue flex-shrink-0">
              <Target className="w-5 h-5 text-[#1E3ABA]" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-none">50+ {t('dashboard.areas', 'Areas')}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{t('dashboard.competencyFramework', 'Competency Framework')}</div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
            <div className="icon-badge-green flex-shrink-0">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-none">200+ {t('dashboard.coursesCount', 'Courses')}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{t('dashboard.igotNsstaModules', 'iGOT & NSSTA Modules')}</div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
            <div className="icon-badge-amber flex-shrink-0">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-none">920+ {t('dashboard.officersCount', 'Officers')}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{t('dashboard.cadreAssessed', 'Cadre Members Assessed')}</div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
            <div className="icon-badge-slate flex-shrink-0">
              <Building2 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-none">28 {t('dashboard.statesCount', 'States & UTs')}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{t('dashboard.statisticalDesks', 'Official Statistical Desks')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services / Quick Access Section */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              {t('dashboard.popularServices', 'Popular Services & Quick Access')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('dashboard.popularServicesDesc', 'Direct access to MoSPI core statistical capacity systems and AI intelligence tools')}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#1E3ABA] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            {t('dashboard.digitalIndiaServices', 'Digital India Services')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {quickServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <button
                key={srv.id}
                type="button"
                onClick={() => onNavigate(srv.id)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-[#1E3ABA] bg-white hover:bg-slate-50 transition flex flex-col items-center text-center gap-2 group cursor-pointer"
              >
                <div className={`${srv.badgeClass} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#1E3ABA] transition-colors leading-tight">
                    {srv.name}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {srv.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Track Your Application / Assessment (UMANG / Digital India Style Strip) */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="icon-badge-blue">
              <FileSearch className="w-5 h-5 text-[#1E3ABA]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                {t('dashboard.trackAssessment', 'Track Assessment / Verification Request')}
              </h4>
              <p className="text-[11px] text-slate-500">
                {t('dashboard.trackAssessmentDesc', 'Enter your Assessment Ref No, NSSTA TPAC Request ID, or iGOT Enrolment No.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. TPAC-2026-NSS-442"
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1E3ABA] w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer"
            >
              {t('dashboard.trackStatusBtn', 'Track Status')}
            </button>
          </div>
        </form>

        {trackingResult && (
          <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{trackingResult}</span>
            </div>
            <button
              type="button"
              onClick={() => setTrackingResult(null)}
              className="text-xs font-semibold text-emerald-900 underline"
            >
              {t('common.dismiss', 'Dismiss')}
            </button>
          </div>
        )}
      </section>

      {/* Mandatory Initial Diagnostic Test Callout Banner (If not completed or available to retake) */}
      {!currentUser.diagnosticCompleted ? (
        <section className="bg-gradient-to-r from-blue-900 via-[#1E3ABA] to-indigo-900 text-white rounded-xl p-5 sm:p-6 shadow-md border border-blue-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('dashboard.pendingDiagnostic', 'Mandatory Onboarding Step Pending')}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-heading">
                {t('diagnostic.heroTitle', 'Initial 4-Pillar Competency Diagnostic Assessment')}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                {t('diagnostic.heroDesc', 'Take the 18-question diagnostic test to establish your verified proficiency baseline across Statistical Methods, Technical & AI, Digital Governance, and Leadership & Ethics. Automatically configures your AI Gap Engine and iGOT learning roadmap.')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('initial_diagnostic')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-lg text-xs sm:text-sm transition shadow-md cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-slate-900" />
              <span>{t('diagnostic.startTest', 'Launch Diagnostic Assessment')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-900">{t('dashboard.baselineActive', '4-Pillar Diagnostic Baseline Active: ')}</span>
              <span className="text-emerald-800">
                {t('dashboard.calibratedOn', 'Calibrated on')} {currentUser.diagnosticResult?.completedAt ? new Date(currentUser.diagnosticResult.completedAt).toLocaleDateString() : t('diagnostic.initialAssessment', 'Initial Assessment')} • {t('dashboard.overallIndex', 'Overall Index')} {currentUser.diagnosticResult?.overallScore.toFixed(1) || '3.4'} / 5.0
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('initial_diagnostic')}
            className="text-xs font-semibold text-[#1E3ABA] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap self-end sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('dashboard.retakeAssessment', 'Retake Diagnostic Assessment')}</span>
          </button>
        </div>
      )}

      {/* Official Officer Profile & Capacity Status Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#1E3ABA] font-bold text-xs">
                {currentUser.cadre} {t('onboarding.cadre', 'Cadre')} • {currentUser.department} {t('onboarding.wingDepartment', 'Wing')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono">
                {t('onboarding.employeeId', 'Employee ID')}: {currentUser.govEmployeeId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {t('auth.parichayVerified', 'Parichay SSO Verified')}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading">
              {currentUser.name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{currentUser.designation}</span> — {currentUser.currentAssignment}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span>{t('dashboard.serviceExperience', 'Service Experience')}: <strong className="text-slate-800">{currentUser.experienceYears} {t('common.years', 'Years')}</strong></span>
              <span>•</span>
              <span>{t('dashboard.academicBackground', 'Academic Background')}: <strong className="text-slate-800">{currentUser.education}</strong></span>
              <span>•</span>
              <span>{t('dashboard.competenciesMet', 'Competencies Met')}: <strong className="text-emerald-700">{closedCompetencies.length} / {currentUser.competencies.length}</strong></span>
              {onOpenProfileWizard && (
                <>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={onOpenProfileWizard}
                    className="inline-flex items-center gap-1 text-[#1E3ABA] hover:underline font-semibold cursor-pointer"
                  >
                    <UserCog className="w-3.5 h-3.5" />
                    {t('dashboard.editProfile', 'Edit Profile')}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* CPD Annual Credit Hours Progress Gauge */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-center min-w-[270px] w-full lg:w-auto">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-heading">
                <Award className="w-4 h-4 text-[#D97706]" />
                {t('dashboard.annualCpdHours', 'Annual CPD Credit Hours')}
              </span>
              <span className="text-xs font-mono font-bold text-[#1E3ABA]">
                {currentUser.cpdHoursCompleted} / {currentUser.cpdHoursTarget} {t('dashboard.hrs', 'hrs')}
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden my-1">
              <div 
                className="bg-[#1E3ABA] h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.round((currentUser.cpdHoursCompleted / currentUser.cpdHoursTarget) * 100))}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>{t('dashboard.karmayogiMandate', 'Mission Karmayogi Mandate')}</span>
              <span className="font-bold text-emerald-700">
                {Math.round((currentUser.cpdHoursCompleted / currentUser.cpdHoursTarget) * 100)}% {t('dashboard.fulfilled', 'Fulfilled')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('competencies')}
              className="mt-3 py-2 px-4 bg-[#1E3ABA] hover:bg-[#152E99] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
              {t('dashboard.viewHeatmap', 'View Skill Gap Heatmap')}
            </button>
          </div>
        </div>

        {syncSuccessMsg && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{syncSuccessMsg}</span>
          </div>
        )}
      </section>

      {/* Metric Cards with Colored Left-Accent Bars & Circular Soft Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Competency Index (Blue) */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 border-l-4 border-l-[#1E3ABA] shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-3">
            <div className="icon-badge-blue">
              <Target className="w-5 h-5 text-[#1E3ABA]" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA]">
              {t('dashboard.benchmark', 'ISS/SSS Benchmark')}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-500">{t('dashboard.competencyIndex', 'Competency Index')}</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
            3.4 <span className="text-sm font-normal text-slate-500 font-mono">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#1E3ABA]" />
            <span>{t('dashboard.fourPillarBaseline', '4-Pillar framework baseline')}</span>
          </p>
        </div>

        {/* Metric 2: Gaps in Progress (Red) */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 border-l-4 border-l-[#E63946] shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-3">
            <div className="icon-badge-red">
              <AlertTriangle className="w-5 h-5 text-[#E63946]" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-[#E63946]">
              {t('dashboard.attentionRequired', 'Attention Required')}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-500">{t('dashboard.gapsInProgress', 'Gaps in Progress')}</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
            {criticalGaps.length} <span className="text-sm font-normal text-slate-500">{t('dashboard.skillAreas', 'Skill Areas')}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium truncate">
            {t('dashboard.topGap', 'Top gap')}: <strong className="text-slate-800">{criticalGaps[0]?.name || t('dashboard.microdataScrutiny', 'Microdata scrutiny')}</strong>
          </p>
        </div>

        {/* Metric 3: CPD Hours Completed (Green) */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 border-l-4 border-l-emerald-600 shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-3">
            <div className="icon-badge-green">
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {t('dashboard.karmayogiCpd', 'Karmayogi CPD')}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-500">{t('dashboard.cpdHoursCompleted', 'CPD Hours Completed')}</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
            {currentUser.cpdHoursCompleted} <span className="text-sm font-normal text-slate-500 font-mono">/ {currentUser.cpdHoursTarget} {t('dashboard.hrs', 'hrs')}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{Math.round((currentUser.cpdHoursCompleted / currentUser.cpdHoursTarget) * 100)}% {t('dashboard.annualReq', 'of annual requirement')}</span>
          </p>
        </div>

        {/* Metric 4: iGOT Enrolled Courses (Amber) */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 border-l-4 border-l-amber-500 shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-3">
            <div className="icon-badge-amber">
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
              {t('dashboard.activeEnrolments', 'Active Enrolments')}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-500">{t('dashboard.coursesActive', 'iGOT Courses Active')}</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
            {enrolledCourses.length} <span className="text-sm font-normal text-slate-500">{t('dashboard.enrolled', 'Enrolled')}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
            {closedCompetencies.length} {t('dashboard.of', 'of')} {currentUser.competencies.length} {t('dashboard.competenciesMetCount', 'competencies met')}
          </p>
        </div>

      </section>

      {/* Continuous Learning Stepper (White Card) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <LearnPracticeProveStepper
          currentStage="measure"
          completedStages={['learn', 'practice']}
          officerName={currentUser.name}
          onNavigateStage={(stage: LearningStage) => {
            switch (stage) {
              case 'learn':
                onNavigate('igot_hub');
                break;
              case 'practice':
                onNavigate('learning_assistant');
                break;
              case 'prove':
                onNavigate('quiz_studio');
                break;
              case 'measure':
                onNavigate('competencies');
                break;
              case 'improve':
                onNavigate('competency_passport');
                break;
            }
          }}
        />
      </div>

      {/* Competency Radar & Skill Gap Diagnostics Section (Light Formal Styling) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 cols): Competency Radar Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <Layers className="w-4 h-4 text-[#1E3ABA]" />
                {t('dashboard.radarTitle', '4-Pillar Competency Intelligence Radar')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('dashboard.radarDesc', 'Evaluated against MoSPI National Competency Framework for')} <strong className="text-slate-800">{currentUser.designation}</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('competencies')}
              className="text-xs font-semibold text-[#1E3ABA] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {t('dashboard.fullBreakdown', 'Full Breakdown')}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-2 flex justify-center">
            <RadarChart data={domainAverages} size={300} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 text-center">
            {domainAverages.map((da, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-semibold text-slate-600 truncate">{da.label}</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                  {t('common.level', 'Lvl')} {da.current} <span className="text-[10px] text-slate-400 font-normal">/ {da.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (5 cols): High-Priority Skill Gaps Requiring Attention */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <AlertTriangle className="w-4 h-4 text-[#E63946]" />
                {t('dashboard.identifiedGaps', 'Identified Competency Gaps')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('dashboard.identifiedGapsDesc', 'Targeted recommendations to bridge cadence skill gaps.')}
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-[#E63946] border border-red-200">
              {criticalGaps.length} {t('dashboard.gapsCount', 'Gaps')}
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[310px] pr-1">
            {criticalGaps.slice(0, 4).map((gap) => (
              <div
                key={gap.id}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#1E3ABA] transition flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      {gap.category.replace('_', ' ')}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {gap.name}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0 font-mono ${
                    gap.priority === 'critical' 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {t('common.gap', 'Gap')} -{gap.gap}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                  <span>{t('dashboard.currentLvl', 'Current')}: <strong>{t('common.level', 'Lvl')} {gap.currentLevel}</strong> → {t('dashboard.targetLvl', 'Target')}: <strong>{t('common.level', 'Lvl')} {gap.targetLevel}</strong></span>
                  {gap.recommendedCourseIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const course = allCourses.find(c => c.id === gap.recommendedCourseIds[0]);
                        if (course) onOpenCourseModal(course);
                      }}
                      className="text-[#1E3ABA] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {t('dashboard.igotPathway', 'iGOT Pathway')}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('competencies')}
            className="w-full mt-3 py-2.5 bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs font-semibold rounded-lg text-center transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{t('dashboard.exploreAllCompetencies', 'Explore All')} {currentUser.competencies.length} {t('dashboard.exploreAllCompetenciesSuffix', 'Competencies & Skill Matrix')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Recommended NSSTA TPAC & iGOT Karmayogi Learning Pathway (White Formal Card) */}
      {recommendedPathway && (
        <section className="bg-white border border-slate-200 border-t-4 border-t-[#1E3ABA] rounded-xl p-5 sm:p-6 shadow-xs relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1E3ABA] text-xs font-semibold flex items-center gap-1 border border-blue-100">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
                  {t('dashboard.aiRecommendedPathway', 'AI Recommended • NSSTA TPAC Approved Pathway')}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Ref: {recommendedPathway.tpacRefNumber}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 font-heading">
                {recommendedPathway.title}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {recommendedPathway.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 font-mono">{recommendedPathway.totalHours} {t('dashboard.hours', 'Hours')}</div>
                <div className="text-[10px] text-slate-500">{recommendedPathway.estimatedWeeks} {t('dashboard.weeksTrack', 'Weeks Track')}</div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('igot_hub')}
                className="py-2.5 px-5 bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold text-xs rounded-lg transition flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                {t('dashboard.explorePathwayCourses', 'Explore Pathway Courses')} ({recommendedPathway.courseIds.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            {recommendedPathway.courseIds.slice(0, 3).map((cId) => {
              const course = allCourses.find(c => c.id === cId);
              if (!course) return null;
              const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);

              return (
                <div
                  key={course.id}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#1E3ABA] transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-semibold text-[#1E3ABA]">{course.provider}</span>
                      <span className="font-mono text-slate-500">{course.durationHours} {t('dashboard.hrs', 'hrs')}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                      {course.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded-full font-mono border border-slate-200">
                      {course.level}
                    </span>
                    {isEnrolled ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {t('dashboard.enrolledStatus', 'Enrolled')}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onEnrollCourse(course.id)}
                        className="text-xs font-semibold text-white bg-[#1E3ABA] hover:bg-[#152E99] px-3 py-1 rounded-lg transition cursor-pointer"
                      >
                        + {t('dashboard.enrollOnIgot', 'Enroll on iGOT')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Active Enrolled Modules & Circular Progress Rings (White Card) */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
              <BookOpen className="w-4 h-4 text-[#1E3ABA]" />
              {t('dashboard.activeEnrolledModules', 'Active Enrolled iGOT & NSSTA Modules')} ({enrolledCourses.length})
            </h3>
            <p className="text-xs text-slate-500">
              {t('dashboard.activeEnrolledDesc', 'Synchronize learning hours and update competency levels upon completing assessments.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('igot_hub')}
            className="text-xs font-semibold text-[#1E3ABA] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {t('dashboard.browseFullCatalog', 'Browse Full iGOT Catalog')}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((course, idx) => {
            const simulatedProgress = idx === 0 ? 80 : idx === 1 ? 45 : 20;
            const isSyncing = syncingId === course.id;

            const radius = 20;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (simulatedProgress / 100) * circumference;

            return (
              <div
                key={course.id}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#1E3ABA] transition flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA] font-semibold font-mono text-[10px] border border-blue-100">
                        {course.code}
                      </span>
                      <span className="text-slate-500 font-medium text-xs">
                        {course.provider} • {course.credits} {t('dashboard.credits', 'Credits')}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Circular Progress Ring */}
                  <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        stroke="#E2E8F0"
                        strokeWidth="3.5"
                        fill="transparent"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        stroke={simulatedProgress > 60 ? '#10B981' : '#1E3ABA'}
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-mono font-bold text-slate-800">
                      {simulatedProgress}%
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => onOpenCourseModal(course)}
                    className="text-xs font-semibold text-slate-700 hover:text-[#1E3ABA] flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 text-[#1E3ABA]" />
                    {t('dashboard.continueLearning', 'Continue Learning')}
                  </button>

                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={() => handleTriggerSync(course.id)}
                    className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1 rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? t('dashboard.syncing', 'Syncing...') : t('dashboard.syncProgress', 'Sync Progress')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Highlights Strip (Footer Area - UMANG / Digital India 4-Column Layout) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="icon-badge-blue flex-shrink-0">
              <Users className="w-5 h-5 text-[#1E3ABA]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">{t('dashboard.officerFirst', 'Officer First')}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {t('dashboard.officerFirstDesc', 'Personalized capability paths tailored to cadre, wing, and current posting mandates.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="icon-badge-green flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">{t('dashboard.secureTrusted', 'Secure & Trusted')}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {t('dashboard.secureTrustedDesc', 'Parichay SSO integrated, verifiable digital certificates and tamper-proof credentials.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="icon-badge-amber flex-shrink-0">
              <Compass className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">{t('dashboard.allServicesInOne', 'All Services in One')}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {t('dashboard.allServicesInOneDesc', 'Unified access to iGOT Karmayogi, NSSTA training, RAG AI & Quiz Studio.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="icon-badge-slate flex-shrink-0">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">{t('dashboard.realTimeUpdates', 'Real-Time Updates')}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {t('dashboard.realTimeUpdatesDesc', 'Automated competency sync, live progress tracking, and instant MCQ feedback.')}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
