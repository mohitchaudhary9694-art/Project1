import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  DiagnosticQuestion, 
  InitialDiagnosticResult, 
  DiagnosticPillarScore,
  CompetencyDomain 
} from '../types';
import { 
  DIAGNOSTIC_QUESTIONS, 
  calculateDiagnosticResult,
  DIAGNOSTIC_TEST_VERSION,
  getRolePillarTargets 
} from '../data/diagnosticTestConfig';
import { RadarChart } from './RadarChart';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  HelpCircle, 
  AlertCircle, 
  Sparkles, 
  Target, 
  Layers, 
  BarChart3, 
  BookOpen, 
  Check, 
  TrendingUp, 
  AlertTriangle,
  Award,
  ChevronRight,
  Info,
  CheckCircle,
  FileText
} from 'lucide-react';

interface InitialSkillDiagnosticTestProps {
  currentUser: UserProfile;
  onComplete?: (result: InitialDiagnosticResult, updatedUser: UserProfile) => void;
  onCompleteDiagnostic?: (result: InitialDiagnosticResult, updatedUser: UserProfile) => void;
  onSkip?: () => void;
  onNavigateToGapEngine?: () => void;
}

export const InitialSkillDiagnosticTest: React.FC<InitialSkillDiagnosticTestProps> = ({
  currentUser,
  onComplete,
  onCompleteDiagnostic,
  onSkip,
  onNavigateToGapEngine,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Timer & State
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<InitialDiagnosticResult | null>(null);
  const [completedUser, setCompletedUser] = useState<UserProfile | null>(null);

  // Pillar categories list
  const pillars: { id: CompetencyDomain; label: string; icon: string; short: string }[] = [
    { id: 'statistical', label: 'Statistical Methods', icon: '📊', short: 'Pillar 1: Statistics' },
    { id: 'technical', label: 'Technical & Python/AI', icon: '💻', short: 'Pillar 2: Technical & AI' },
    { id: 'digital_governance', label: 'Digital Governance & DPDPA', icon: '🔒', short: 'Pillar 3: Governance' },
    { id: 'managerial', label: 'Leadership & Ethics', icon: '⚖️', short: 'Pillar 4: Leadership' },
  ];

  // Soft timer count up
  useEffect(() => {
    if (diagnosticResult) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [diagnosticResult]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion: DiagnosticQuestion = DIAGNOSTIC_QUESTIONS[currentIndex];
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Group questions by pillar to calculate pillar progress
  const getPillarProgress = (pillarId: CompetencyDomain) => {
    const pillarQs = DIAGNOSTIC_QUESTIONS.filter(q => q.pillar === pillarId);
    const answeredInPillar = pillarQs.filter(q => answers[q.id] !== undefined).length;
    return {
      total: pillarQs.length,
      answered: answeredInPillar,
      isComplete: answeredInPillar === pillarQs.length,
    };
  };

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
    setValidationError(null);
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      setValidationError('Please select a response to proceed to the next question.');
      return;
    }
    setValidationError(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleJumpToPillar = (pillarId: CompetencyDomain) => {
    const firstQIdx = DIAGNOSTIC_QUESTIONS.findIndex(q => q.pillar === pillarId);
    if (firstQIdx !== -1) {
      setCurrentIndex(firstQIdx);
      setValidationError(null);
    }
  };

  const handleSubmitTest = () => {
    // Check if any question remains unanswered
    const unanswered = DIAGNOSTIC_QUESTIONS.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      const firstUnansweredIndex = DIAGNOSTIC_QUESTIONS.findIndex(q => !answers[q.id]);
      setCurrentIndex(firstUnansweredIndex);
      setValidationError(`Please complete all questions before submitting. (${unanswered.length} question(s) remaining)`);
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    setTimeout(() => {
      // Calculate real scores and calibrated competencies
      const { result, calibratedCompetencies } = calculateDiagnosticResult(
        currentUser,
        answers,
        elapsedSeconds
      );

      const updatedUserProfile: UserProfile = {
        ...currentUser,
        competencies: calibratedCompetencies,
        diagnosticCompleted: true,
        diagnosticResult: result,
      };

      setDiagnosticResult(result);
      setCompletedUser(updatedUserProfile);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleFinishAndProceed = () => {
    if (diagnosticResult && completedUser) {
      if (typeof onComplete === 'function') {
        onComplete(diagnosticResult, completedUser);
      } else if (typeof onCompleteDiagnostic === 'function') {
        onCompleteDiagnostic(diagnosticResult, completedUser);
      }
    }
  };

  const handleFinishAndGoToGaps = () => {
    if (diagnosticResult && completedUser) {
      if (typeof onComplete === 'function') {
        onComplete(diagnosticResult, completedUser);
      } else if (typeof onCompleteDiagnostic === 'function') {
        onCompleteDiagnostic(diagnosticResult, completedUser);
      }
      if (typeof onNavigateToGapEngine === 'function') {
        onNavigateToGapEngine();
      }
    }
  };

  // Convert calculated pillar scores for the RadarChart component
  const radarData = diagnosticResult ? [
    {
      label: 'Statistical Methods',
      domain: 'statistical' as CompetencyDomain,
      current: diagnosticResult.pillarScores.statistical.currentLevel,
      target: diagnosticResult.pillarScores.statistical.targetLevel,
    },
    {
      label: 'Technical & Python/AI',
      domain: 'technical' as CompetencyDomain,
      current: diagnosticResult.pillarScores.technical.currentLevel,
      target: diagnosticResult.pillarScores.technical.targetLevel,
    },
    {
      label: 'Digital Governance',
      domain: 'digital_governance' as CompetencyDomain,
      current: diagnosticResult.pillarScores.digital_governance.currentLevel,
      target: diagnosticResult.pillarScores.digital_governance.targetLevel,
    },
    {
      label: 'Leadership & Ethics',
      domain: 'managerial' as CompetencyDomain,
      current: diagnosticResult.pillarScores.managerial.currentLevel,
      target: diagnosticResult.pillarScores.managerial.targetLevel,
    },
  ] : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#F5F6F8] border border-slate-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* National Tricolor Top Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

        {/* Modal Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E3ABA] flex-shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#1E3ABA]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1E3ABA] border border-blue-200 px-2 py-0.5 rounded">
                  Mandatory Baseline Assessment
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  v{DIAGNOSTIC_TEST_VERSION}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                Initial Skill Diagnostic Test
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Soft Timer */}
            {!diagnosticResult && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-[#1E3ABA]" />
                <span className="font-mono">{formatTimer(elapsedSeconds)}</span>
                <span className="text-[10px] text-slate-400 font-normal">(Est. ~15m)</span>
              </div>
            )}

            {onSkip && !diagnosticResult && (
              <button
                type="button"
                onClick={onSkip}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition cursor-pointer border border-slate-200"
              >
                Skip for now
              </button>
            )}

            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500">{currentUser.designation} • {currentUser.cadre}</p>
            </div>
          </div>
        </div>

        {/* BODY AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ================================================================ */}
          {/* VIEW 1: RESULTS & CALIBRATION SUMMARY (AFTER SUBMISSION)          */}
          {/* ================================================================ */}
          {diagnosticResult ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Success Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900 font-heading">
                      Diagnostic Assessment Completed Successfully
                    </h3>
                    <p className="text-xs text-emerald-700">
                      We have calibrated your baseline proficiency levels and mapped them against your role benchmark (<span className="font-semibold">{currentUser.designation}</span>).
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="text-xs text-slate-500">Completed in</span>
                  <p className="text-sm font-bold text-slate-800 font-mono">{formatTimer(diagnosticResult.timeSpentSeconds)}</p>
                </div>
              </div>

              {/* Grid: Radar Chart + Index Score */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Radar Chart Card */}
                <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col items-center justify-center">
                  <div className="w-full flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-heading">
                        4-Pillar Competency Radar
                      </h4>
                      <p className="text-xs text-slate-500">
                        Measured baseline vs. Role Target Requirements
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-[#1E3ABA] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                      Calibrated Live
                    </span>
                  </div>

                  <RadarChart data={radarData} size={300} />
                </div>

                {/* Score & Summary Card */}
                <div className="md:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Overall Baseline Calibration
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#1E3ABA] font-heading">
                        {diagnosticResult.overallIndex.toFixed(1)}
                      </span>
                      <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      We've identified <span className="font-bold text-[#E63946]">{diagnosticResult.identifiedGapsCount} competency gaps</span> across your 4 core official domains based on your objective responses and self-rating.
                    </p>
                  </div>

                  {/* 4 Pillars Breakdown List */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    {(Object.values(diagnosticResult.pillarScores) as DiagnosticPillarScore[]).map((ps) => (
                      <div key={ps.pillar} className="flex items-center justify-between text-xs py-1">
                        <span className="text-slate-700 font-medium">{ps.pillarLabel}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-slate-900">Lv {ps.currentLevel}</span>
                          <span className="text-slate-400">→</span>
                          <span className="font-bold font-mono text-emerald-700">Lv {ps.targetLevel}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            ps.severity === 'Critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                            ps.severity === 'High' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                            ps.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            ps.severity === 'Low' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {ps.severity === 'Met' ? 'Met' : `Gap -${ps.gap}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Priority Gaps Identified */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#E63946]" />
                    <h4 className="text-sm font-bold text-slate-900 font-heading">
                      Identified Priority Competency Gaps
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Automatically queued for AI Gap Engine & iGOT Courses
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {diagnosticResult.topPriorityGaps.map((gap, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-500">
                            {gap.pillarLabel}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            gap.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                            gap.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {gap.severity} Priority
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">
                          {gap.competencyName}
                        </h5>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Current → Target</span>
                        <span className="font-bold text-[#1E3ABA] font-mono">
                          Lv {gap.currentLevel} → {gap.targetLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleFinishAndGoToGaps}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Target className="w-4 h-4 text-[#1E3ABA]" />
                  <span>View Full Gap Analysis</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinishAndProceed}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Go to Officer Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (

            /* ================================================================ */
            /* VIEW 2: ACTIVE QUESTION TEST INTERFACE                           */
            /* ================================================================ */
            <div className="space-y-5">
              
              {/* Pillar Tabs / Step Navigator */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {pillars.map((p) => {
                  const prog = getPillarProgress(p.id);
                  const isCurrentPillar = currentQuestion.pillar === p.id;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleJumpToPillar(p.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isCurrentPillar
                          ? 'bg-blue-50/80 border-[#1E3ABA] ring-1 ring-[#1E3ABA] shadow-xs'
                          : prog.isComplete
                          ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{p.icon}</span>
                        {prog.isComplete ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {prog.answered}/{prog.total}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-bold mt-1 line-clamp-1 ${
                        isCurrentPillar ? 'text-[#1E3ABA]' : 'text-slate-700'
                      }`}>
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      Question {currentIndex + 1} of {totalQuestions}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-medium">
                      {currentQuestion.pillarLabel}
                    </span>
                  </div>
                  <span className="font-bold text-[#1E3ABA] font-mono">
                    {progressPercent}% Complete ({answeredCount}/{totalQuestions})
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#1E3ABA] h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
                
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-[#1E3ABA] border border-blue-100 rounded-md text-[11px] font-bold">
                      {currentQuestion.pillarLabel}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      currentQuestion.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      currentQuestion.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-purple-50 text-purple-700 border border-purple-100'
                    }`}>
                      {currentQuestion.difficulty} Level
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Weight: {currentQuestion.weight}x
                    </span>
                  </div>

                  {currentQuestion.type === 'self_rating' && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
                      Self-Proficiency Audit
                    </span>
                  )}
                </div>

                {/* Scenario Context Badge if present */}
                {currentQuestion.scenarioContext && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-[#1E3ABA] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-700">Official Operational Context:</span>
                      <p className="text-slate-600 mt-0.5 font-medium">
                        {currentQuestion.scenarioContext}
                      </p>
                    </div>
                  </div>
                )}

                {/* Question Prompt */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQuestion.questionText}
                </h3>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = answers[currentQuestion.id] === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption(option.id)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/90 border-[#1E3ABA] ring-1.5 ring-[#1E3ABA] shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                          isSelected
                            ? 'border-[#1E3ABA] bg-[#1E3ABA] text-white'
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div className="flex-1">
                          <p className={`text-xs sm:text-sm font-medium ${
                            isSelected ? 'text-[#1E3ABA] font-semibold' : 'text-slate-800'
                          }`}>
                            {option.text}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Validation Message if attempted next without answering */}
                {validationError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-xs text-red-700 font-medium animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

              </div>

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer ${
                    currentIndex === 0
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                      : 'border-slate-300 text-slate-700 hover:bg-white bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-3">
                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-5 py-2.5 bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitTest}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Calibrating Competency Baseline...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Submit & Calibrate Profile</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
