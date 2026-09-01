import React, { useState } from 'react';
import { UserProfile, GeneratedAssessment, QuestionItem } from '../types';
import { OFFICIAL_SAMPLE_DOCUMENTS, DEFAULT_SAMPLE_QUIZ } from '../data/mockData';
import { saveAssessmentResult } from '../firebase';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Award, 
  Download, 
  RefreshCw, 
  HelpCircle, 
  ChevronRight, 
  RotateCcw, 
  Check, 
  FileCheck,
  BrainCircuit,
  Sliders,
  CheckCircle2,
  XCircle,
  Share2,
  Printer
} from 'lucide-react';

interface QuizGeneratorProps {
  currentUser: UserProfile;
  onAssessmentCompleted?: (score: number, total: number) => void;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  currentUser,
  onAssessmentCompleted,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(OFFICIAL_SAMPLE_DOCUMENTS[0]?.id || 'doc_nss_79');
  const [customText, setCustomText] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'intermediate' | 'advanced'>('intermediate');
  const [targetCadre, setTargetCadre] = useState<string>(currentUser.cadre);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Active Assessment State
  const [activeQuiz, setActiveQuiz] = useState<GeneratedAssessment | null>(DEFAULT_SAMPLE_QUIZ);
  const [quizMode, setQuizMode] = useState<'config' | 'taking' | 'results'>('taking');
  
  // Test Taker State
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(600); // 10 mins

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setSelectedDocId('custom');
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCustomText(content || '');
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    let docTitle = 'Uploaded Statistical Material';
    let docContent = customText;

    if (selectedDocId !== 'custom') {
      const doc = OFFICIAL_SAMPLE_DOCUMENTS.find(d => d.id === selectedDocId);
      if (doc) {
        docTitle = doc.title;
        docContent = `${doc.title}\nCategory: ${doc.category}\nTarget Cadre: ${(doc as any).targetCadre || 'MoSPI / Cadre Officers'}\n\n${doc.content}`;
      }
    }

    if (!docContent.trim()) {
      setGenerationError('Please provide learning material content or select an official document.');
      setIsGenerating(false);
      return;
    }

    try {
      const response = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentTitle: docTitle,
          documentContent: docContent,
          questionCount,
          difficulty,
          cadreTarget: targetCadre,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setActiveQuiz(json.data);
        setUserAnswers({});
        setCurrentQIndex(0);
        setIsSubmitted(false);
        setQuizMode('taking');
        setTimeRemainingSeconds(questionCount * 120); // 2 mins per question
      } else {
        setGenerationError(json.error || 'Failed to generate quiz.');
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError('Network error connecting to AI quiz generator.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleFinishQuiz = () => {
    setIsSubmitted(true);
    setQuizMode('results');

    if (activeQuiz && onAssessmentCompleted) {
      const correctCount = activeQuiz.questions.reduce((acc, q) => {
        return acc + (userAnswers[q.id] === q.correctAnswerIndex ? 1 : 0);
      }, 0);
      onAssessmentCompleted(correctCount, activeQuiz.questions.length);

      // Persist to Cloud Firestore
      saveAssessmentResult(currentUser.id, {
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        cadreTarget: activeQuiz.cadreTarget,
        difficulty: activeQuiz.difficulty,
        score: correctCount,
        total: activeQuiz.questions.length,
        percentage: Math.round((correctCount / activeQuiz.questions.length) * 100),
        userAnswers,
      });
    }
  };

  const calculateScore = () => {
    if (!activeQuiz) return { correct: 0, total: 0, percentage: 0 };
    const total = activeQuiz.questions.length;
    const correct = activeQuiz.questions.reduce((acc, q) => {
      return acc + (userAnswers[q.id] === q.correctAnswerIndex ? 1 : 0);
    }, 0);
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  };

  const exportQuizAsText = () => {
    if (!activeQuiz) return;
    let text = `========================================================\n`;
    text += `NATIONAL STATISTICAL SYSTEMS TRAINING ACADEMY (NSSTA)\n`;
    text += `OFFICIAL ASSESSMENT: ${activeQuiz.title}\n`;
    text += `Target Cadre: ${activeQuiz.cadreTarget} | Difficulty: ${activeQuiz.difficulty.toUpperCase()}\n`;
    text += `Generated Date: ${new Date(activeQuiz.createdAt).toLocaleDateString()}\n`;
    text += `========================================================\n\n`;

    activeQuiz.questions.forEach((q, idx) => {
      text += `Q${idx + 1}. ${q.questionText}\n`;
      q.options.forEach((opt, oIdx) => {
        text += `   [${String.fromCharCode(65 + oIdx)}] ${opt}\n`;
      });
      text += `\n>> Correct Answer: [${String.fromCharCode(65 + q.correctAnswerIndex)}]\n`;
      text += `>> Official Rationale: ${q.explanation}\n`;
      text += `>> Concept Citation: ${q.conceptCitation}\n\n`;
      text += `--------------------------------------------------------\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NSSTA_Assessment_${activeQuiz.title.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA] font-semibold text-xs border border-blue-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Assessment & Quiz Engine
            </span>
            <span className="text-xs text-slate-500">
              MoSPI • NSSTA Capacity Building
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-heading">
            MCQ & Diagnostic Quiz Generator from Official Materials
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
            Synthesize high-validity multiple choice questions, psychometric distractors, and concept citations directly from uploaded survey manuals, manuals, or standard compendiums.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {quizMode !== 'config' && (
            <button
              type="button"
              onClick={() => setQuizMode('config')}
              className="py-2 px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              Configure New Assessment
            </button>
          )}
        </div>
      </section>

      {/* Mode 1: Configuration & Material Upload */}
      {quizMode === 'config' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Material Selection & Upload (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-heading">
              <FileText className="w-4 h-4 text-[#1E3ABA]" />
              1. Select or Upload Learning Material
            </h3>

            {/* Preloaded Official Documents */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Choose Official MoSPI / NSSTA Statistical Compendium:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OFFICIAL_SAMPLE_DOCUMENTS.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => { setSelectedDocId(doc.id); setUploadedFileName(''); }}
                    className={`p-3 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                      selectedDocId === doc.id
                        ? 'bg-blue-50/70 border-[#1E3ABA] text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-[#1E3ABA] uppercase">{doc.category}</span>
                      <span className="font-mono text-slate-500">{(doc as any).targetCadre || 'ISS / SSS'}</span>
                    </div>
                    <h4 className="text-xs font-bold leading-snug line-clamp-2 text-slate-900 font-heading">
                      {doc.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Upload Option */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Or Upload Custom Document / Guidelines (PDF, TXT, CSV, DOCX):
              </label>
              
              <div className="relative border-2 border-dashed border-slate-300 hover:border-[#1E3ABA] rounded-xl p-4 text-center transition bg-slate-50">
                <input
                  type="file"
                  accept=".txt,.csv,.json,.doc,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                  <Upload className="w-6 h-6 text-[#1E3ABA]" />
                  <span className="text-xs font-semibold text-slate-700">
                    {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Drag & drop file here or click to browse'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Supports Survey Questionnaires, Scrutiny Manuals, Census instructions.
                  </span>
                </div>
              </div>

              {selectedDocId === 'custom' && (
                <div className="space-y-1 pt-1">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Raw Document Text Excerpt:
                  </label>
                  <textarea
                    rows={4}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Paste statistical material text or guidelines here..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3ABA] font-mono"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right: Assessment Parameters & AI Generator (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-heading">
                <Sliders className="w-4 h-4 text-[#1E3ABA]" />
                2. Assessment Parameters
              </h3>

              {/* Number of Questions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Number of MCQs to Synthesize:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        questionCount === num
                          ? 'bg-[#1E3ABA] text-white'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num} MCQs
                    </button>
                  ))}
                </div>
              </div>

              {/* Cognitive Difficulty */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Cognitive Rigour / Difficulty Level:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'intermediate', 'advanced'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                        difficulty === diff
                          ? 'bg-[#1E3ABA] text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Cadre Profile */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Cadre / Audience:
                </label>
                <select
                  value={targetCadre}
                  onChange={(e) => setTargetCadre(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#1E3ABA]"
                >
                  <option value="ISS">ISS (Indian Statistical Service)</option>
                  <option value="SSS">SSS (Subordinate Statistical Service)</option>
                  <option value="DES">DES (State Directorate)</option>
                  <option value="Field_Investigator">Field Operations Investigator</option>
                  <option value="All Cadres">All Cadres & Trainees</option>
                </select>
              </div>

              {generationError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[#E63946] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#E63946] flex-shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateQuiz}
                className="w-full py-3 px-4 bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold text-xs sm:text-sm rounded-lg transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Synthesizing MCQs with Gemini AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F4B400]" />
                    Generate Objective Assessment Now
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-500 mt-2">
                Generates questions with rationales, distractor explanations, and citation links.
              </p>
            </div>

          </div>
        </section>
      )}

      {/* Mode 2: Interactive Assessment Taking */}
      {quizMode === 'taking' && activeQuiz && (
        <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
          
          {/* Top Test Meta */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1E3ABA] font-mono text-[11px] font-semibold border border-blue-100">
                  {activeQuiz.difficulty.toUpperCase()} LEVEL
                </span>
                <span className="text-xs text-slate-500">
                  Target: <strong className="text-slate-900">{activeQuiz.cadreTarget}</strong>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 font-heading">
                {activeQuiz.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-[#1E3ABA]">
                <Clock className="w-3.5 h-3.5 text-[#1E3ABA]" />
                <span>Q {currentQIndex + 1} of {activeQuiz.questions.length}</span>
              </div>

              <button
                type="button"
                onClick={exportQuizAsText}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs cursor-pointer"
                title="Export / Print Test Paper"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Step & Options */}
          {(() => {
            const currentQ = activeQuiz.questions[currentQIndex];
            if (!currentQ) return null;
            const selectedOption = userAnswers[currentQ.id];

            return (
              <div className="space-y-5">
                {/* Question Text */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-semibold text-[#1E3ABA] uppercase tracking-wider mb-1">
                    Question {currentQIndex + 1}:
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed font-heading">
                    {currentQ.questionText}
                  </h4>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentQ.options.map((option, oIdx) => {
                    const isChosen = selectedOption === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, oIdx)}
                        className={`w-full p-3.5 rounded-lg border text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${
                          isChosen
                            ? 'bg-blue-50/80 border-[#1E3ABA] text-slate-900 font-semibold shadow-xs ring-1 ring-[#1E3ABA]'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${
                            isChosen ? 'bg-[#1E3ABA] text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-snug">{option}</span>
                        </div>

                        {isChosen && (
                          <CheckCircle2 className="w-4 h-4 text-[#1E3ABA] flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              className="py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              ← Previous
            </button>

            {/* Question Quick Jump Badges */}
            <div className="hidden sm:flex items-center gap-1.5">
              {activeQuiz.questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = currentQIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                      isCurrent
                        ? 'bg-[#1E3ABA] text-white'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {currentQIndex < activeQuiz.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                className="py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Next Question →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishQuiz}
                className="py-2 px-5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs cursor-pointer"
              >
                Submit Official Assessment
              </button>
            )}
          </div>

        </section>
      )}

      {/* Mode 3: Assessment Results & Rationales Review */}
      {quizMode === 'results' && activeQuiz && (
        <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
          
          {/* Results Scorecard */}
          {(() => {
            const { correct, total, percentage } = calculateScore();
            const isPassed = percentage >= 60;

            return (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isPassed ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-[#E63946] border border-red-200'
                    }`}>
                      {isPassed ? 'Official Assessment Passed' : 'Needs Review & Retake'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Accredited by NSSTA
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                    Official Diagnostic Performance Report
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-md">
                    Results have been recorded toward your Continuous Professional Development (CPD) competency profile.
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold font-mono text-[#1E3ABA] font-heading">
                      {percentage}%
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {correct} of {total} Correct
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUserAnswers({});
                        setCurrentQIndex(0);
                        setIsSubmitted(false);
                        setQuizMode('taking');
                      }}
                      className="py-2 px-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Retake Test
                    </button>

                    <button
                      type="button"
                      onClick={exportQuizAsText}
                      className="py-2 px-3.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1E3ABA] text-xs font-semibold flex items-center gap-1.5 border border-blue-200 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Transcript
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Comprehensive Question-by-Question Review with Rationales */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-heading">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Detailed Answers, Psychometric Rationales & Concept Citations:
            </h4>

            <div className="space-y-4">
              {activeQuiz.questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border space-y-3 ${
                      isCorrect
                        ? 'bg-emerald-50/30 border-emerald-200'
                        : 'bg-red-50/30 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                        <span className="text-[#1E3ABA] font-mono mr-1.5">Q{idx + 1}.</span>
                        {q.questionText}
                      </h5>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase flex items-center gap-1 flex-shrink-0 ${
                        isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-[#E63946] border border-red-200'
                      }`}>
                        {isCorrect ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-[#E63946]" />}
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    {/* Options list showing right vs wrong */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isRightAnswer = oIdx === q.correctAnswerIndex;
                        const isUserChoice = userAns === oIdx;

                        return (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border flex items-center justify-between ${
                              isRightAnswer
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                : isUserChoice
                                ? 'bg-red-50 border-red-300 text-[#E63946]'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="font-bold font-mono">[{String.fromCharCode(65 + oIdx)}]</span>
                              <span className="truncate">{opt}</span>
                            </div>
                            {isRightAnswer && (
                              <span className="text-[10px] font-bold uppercase text-emerald-700">Correct</span>
                            )}
                            {!isRightAnswer && isUserChoice && (
                              <span className="text-[10px] font-bold uppercase text-[#E63946]">Your Choice</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Official Rationale & Citation */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      <div className="text-slate-700">
                        <strong className="text-[#1E3ABA]">Official Rationale: </strong>
                        {q.explanation}
                      </div>

                      {q.distractorAnalysis && (
                        <div className="text-[11px] text-slate-600">
                          <strong className="text-slate-800">Distractor Analysis: </strong>
                          {q.distractorAnalysis}
                        </div>
                      )}

                      <div className="text-[10px] font-mono text-slate-600 flex items-center gap-1 pt-1 border-t border-slate-200">
                        <BrainCircuit className="w-3 h-3 text-[#1E3ABA]" />
                        <span>Source Citation: {q.conceptCitation}</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setQuizMode('config')}
              className="py-2.5 px-5 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold text-xs shadow-xs cursor-pointer"
            >
              Generate Next Quiz from New Material →
            </button>
          </div>

        </section>
      )}

    </div>
  );
};
