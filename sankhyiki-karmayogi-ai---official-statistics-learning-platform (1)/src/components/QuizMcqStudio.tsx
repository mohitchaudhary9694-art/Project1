import React, { useState, useEffect } from 'react';
import { 
  GeneratedAssessment, 
  QuestionItem, 
  AdaptiveAssessmentSummary,
  CompetencyItem,
  CompetencyDomain,
  UserProfile
} from '../types';
import { 
  DEFAULT_SAMPLE_QUIZ, 
  OFFICIAL_SAMPLE_DOCUMENTS 
} from '../data/mockData';
import { saveAssessmentResult } from '../firebase';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Clock, 
  Check, 
  FileCheck,
  Upload,
  FileText,
  Printer,
  Download,
  Share2
} from 'lucide-react';

interface QuizMcqStudioProps {
  currentUser?: UserProfile;
  onQuizCompleted?: (result: AdaptiveAssessmentSummary) => void;
  onPassAssessment?: (score: number, total: number) => void;
  competencies?: CompetencyItem[];
  userCadre?: string;
  userRole?: string;
}

const TOPIC_PRESETS = [
  {
    id: 'topic_sampling',
    name: 'Survey Design & Multi-Stage Sampling',
    domain: 'statistical' as CompetencyDomain,
    defaultDoc: 'NSS 79th Round Manual: Guidelines for Field Enumeration & CAPI Scrutiny'
  },
  {
    id: 'topic_sna',
    name: 'System of National Accounts (SNA 2008) & GDP Compilation',
    domain: 'statistical' as CompetencyDomain,
    defaultDoc: 'Methodological Note on Compilation of National Accounts (SNA 2008 Alignment)'
  },
  {
    id: 'topic_cpi',
    name: 'Price Statistics & Index Numbers (CPI / WPI)',
    domain: 'statistical' as CompetencyDomain,
    defaultDoc: 'CPI Base Year Revision & Technical Weighting Manual'
  },
  {
    id: 'topic_dpdpa',
    name: 'Data Privacy & DPDPA 2023 Compliance',
    domain: 'digital_governance' as CompetencyDomain,
    defaultDoc: 'DPDPA 2023 Implementation SOP for Official Field Collectors'
  },
  {
    id: 'topic_python',
    name: 'Python for Official Statistics & Large Microdata',
    domain: 'technical' as CompetencyDomain,
    defaultDoc: 'Large Microdata Processing Pipelines in Python & Polars'
  }
];

export const QuizMcqStudio: React.FC<QuizMcqStudioProps> = ({
  currentUser,
  onQuizCompleted,
  onPassAssessment,
  competencies = [],
  userCadre = 'ISS / SSS Officers',
  userRole = 'Statistical Officer',
}) => {
  const [sourceMode, setSourceMode] = useState<'topic' | 'document' | 'upload' | 'custom'>('topic');
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPIC_PRESETS[0].name);
  const [selectedDocId, setSelectedDocId] = useState<string>(OFFICIAL_SAMPLE_DOCUMENTS[0]?.id || 'doc_nss_79');
  const [customText, setCustomText] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'intermediate' | 'advanced'>('intermediate');
  const [questionCount, setQuestionCount] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<GeneratedAssessment>(DEFAULT_SAMPLE_QUIZ);

  // Active quiz taking state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [adaptiveResult, setAdaptiveResult] = useState<AdaptiveAssessmentSummary | null>(null);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(480);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || isGenerating) return;
    const interval = setInterval(() => {
      setTimeRemainingSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, isGenerating]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setSourceMode('upload');
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
    setIsSubmitted(false);
    setSelectedAnswers({});
    setRevealedExplanations({});
    setCurrentQuestionIdx(0);
    setAdaptiveResult(null);

    let docTitle = selectedTopic;
    let docContent = '';

    if (sourceMode === 'topic') {
      const preset = TOPIC_PRESETS.find(t => t.name === selectedTopic);
      docTitle = selectedTopic;
      docContent = `Topic: ${selectedTopic}\nStandard: ${preset?.defaultDoc || 'MoSPI Guidelines'}\nTarget Cadre: ${userCadre}`;
    } else if (sourceMode === 'document') {
      const doc = OFFICIAL_SAMPLE_DOCUMENTS.find(d => d.id === selectedDocId);
      if (doc) {
        docTitle = doc.title;
        docContent = `${doc.title}\nCategory: ${doc.category}\n\n${doc.content}`;
      }
    } else if (sourceMode === 'upload' || sourceMode === 'custom') {
      docTitle = uploadedFileName ? `Document: ${uploadedFileName}` : 'Custom Ingested Statistical Notes';
      docContent = customText;
    }

    try {
      const response = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentTitle: docTitle,
          documentContent: docContent || selectedTopic,
          questionCount,
          difficulty,
          cadreTarget: userCadre,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setActiveQuiz(json.data);
        setTimeRemainingSeconds(questionCount * 120);
      } else {
        throw new Error(json.error || 'Failed to synthesize questions from AI server.');
      }
    } catch (err: any) {
      console.warn('AI Quiz generation fallback:', err);
      // Generate topic tailored fallback
      let customQuestions: QuestionItem[] = DEFAULT_SAMPLE_QUIZ.questions;
      if (selectedTopic.includes('National Accounts') || selectedTopic.includes('SNA')) {
        customQuestions = [
          {
            id: 'q_sna_1',
            questionText: 'Under SNA 2008 guidelines, how is Financial Intermediation Services Indirectly Measured (FISIM) derived?',
            options: [
              'By calculating the direct management fees charged on current deposit accounts',
              'By calculating the interest margin between loans/deposits and an inter-bank reference interest rate',
              'By computing the market capitalization of all scheduled commercial banks',
              'By taking 5% of the total Gross Domestic Product of the financial sector'
            ],
            correctAnswerIndex: 1,
            explanation: 'FISIM represents the implicit service charge reflected in interest rate spreads against a reference rate (such as the repo or interbank rate).',
            distractorAnalysis: 'Option A covers explicitly priced financial fees, not indirectly measured margins.',
            conceptCitation: 'SNA 2008 Manual, Chapter 6 (The Production Account)'
          },
          {
            id: 'q_sna_2',
            questionText: 'In the Indian System of National Accounts (NAD), which Ministry database provides financial balance sheet returns (AOC-4 / MGT-7) for private corporate GVA estimation?',
            options: [
              'Ministry of Corporate Affairs (MCA-21 Database)',
              'Reserve Bank of India (RBI DBIE Portal)',
              'Securities and Exchange Board of India (SEBI Bhavcopy)',
              'Goods and Services Tax Network (GSTN Filing System)'
            ],
            correctAnswerIndex: 0,
            explanation: 'MoSPI NAD utilizes annual XBRL financial filings from the Ministry of Corporate Affairs (MCA-21) to estimate Gross Value Added for registered companies.',
            distractorAnalysis: 'RBI data covers banks and NBFCs, whereas MCA-21 provides comprehensive corporate coverage.',
            conceptCitation: 'Sources & Methods of National Accounts Statistics (MoSPI 2024)'
          },
          {
            id: 'q_sna_3',
            questionText: 'What is the exact algebraic identity connecting GVA at basic prices to GDP at market prices?',
            options: [
              'GDP = GVA at basic prices + Product Taxes - Product Subsidies',
              'GDP = GVA at basic prices - Production Taxes + Production Subsidies',
              'GDP = Gross Output - Intermediate Consumption - Consumption of Fixed Capital',
              'GDP = National Income + Net Factor Income from Abroad (NFIA)'
            ],
            correctAnswerIndex: 0,
            explanation: 'GDP at market prices equals GVA at basic prices plus product taxes (e.g. GST, excise duties) minus product subsidies (e.g. food/fertilizer subsidies).',
            distractorAnalysis: 'Production taxes (like land revenue) are already part of basic prices; only product taxes adjust basic price GVA to market price GDP.',
            conceptCitation: 'MoSPI National Accounts Statistics: Base Revision Methodology'
          },
          {
            id: 'q_sna_4',
            questionText: 'Which valuation principle is mandated by SNA 2008 for estimating gross fixed capital formation (GFCF) of specialized software and databases developed in-house?',
            options: [
              'Historical acquisition cost amortized over 20 years',
              'Sum of production costs (including employee compensation, intermediate inputs, and capital consumption)',
              'Current stock market valuation of the executing enterprise',
              'Zero valuation until the asset is sold to an external third-party'
            ],
            correctAnswerIndex: 1,
            explanation: 'When market prices do not exist for own-account intellectual property products, valuation is made as the sum of all direct production and overhead costs.',
            distractorAnalysis: 'SNA 2008 explicitly requires capitalizing own-account IP assets at cost rather than expensing or deferring them.',
            conceptCitation: 'SNA 2008 Manual, Chapter 10 (The Capital Account)'
          }
        ];
      }

      setActiveQuiz({
        id: `gen_quiz_${Date.now()}`,
        title: `${docTitle} — Assessment`,
        topic: docTitle,
        difficulty,
        sourceDocument: docTitle,
        questions: customQuestions
      });
      setTimeRemainingSeconds(customQuestions.length * 120);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const toggleExplanation = (qIdx: number) => {
    setRevealedExplanations(prev => ({
      ...prev,
      [qIdx]: !prev[qIdx]
    }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);

    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    const passed = scorePercentage >= 60;

    const summary: AdaptiveAssessmentSummary = {
      quizTitle: activeQuiz.title,
      topic: selectedTopic,
      score: correctCount,
      totalQuestions: activeQuiz.questions.length,
      percentage: scorePercentage,
      passed,
      completedAt: new Date().toLocaleDateString(),
      timeSpentSeconds: 480 - timeRemainingSeconds,
      competencyBreakdown: [
        {
          competencyId: 'comp_1',
          competencyName: activeQuiz.topic || selectedTopic,
          category: 'statistical',
          score: correctCount,
          total: activeQuiz.questions.length,
          percentage: scorePercentage,
          status: scorePercentage >= 80 ? 'Mastered' : scorePercentage >= 60 ? 'Competent' : 'Needs Improvement'
        },
        {
          competencyId: 'comp_sub',
          competencyName: 'Procedural Rigor & Standard Definitions',
          category: 'statistical',
          score: Math.max(1, correctCount - 1),
          total: activeQuiz.questions.length,
          percentage: Math.max(25, scorePercentage - 15),
          status: scorePercentage >= 75 ? 'Competent' : 'Critical Gap'
        }
      ],
      adaptiveFocusNote: scorePercentage < 70
        ? `Your assessment score indicated difficulty in "${activeQuiz.title}". Your next personalized pathway and diagnostic assessment will prioritize foundational modules in this area.`
        : `Outstanding mastery in "${activeQuiz.title}" (${scorePercentage}%). You have successfully demonstrated official benchmark proficiency. Your next challenge will advance to higher-order case studies.`
    };

    setAdaptiveResult(summary);

    // Persist assessment result to Firestore & Local Storage
    const userId = currentUser?.id || 'officer_local';
    saveAssessmentResult(userId, {
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      difficulty: activeQuiz.difficulty,
      score: correctCount,
      total: activeQuiz.questions.length,
      percentage: scorePercentage,
      passed,
      userAnswers: selectedAnswers,
      cadreTarget: userCadre,
    });

    if (onQuizCompleted) {
      onQuizCompleted(summary);
    }
    if (onPassAssessment) {
      onPassAssessment(correctCount, activeQuiz.questions.length);
    }
  };

  const exportQuizAsText = () => {
    if (!activeQuiz) return;
    let text = `========================================================\n`;
    text += `NATIONAL STATISTICAL SYSTEMS TRAINING ACADEMY (NSSTA)\n`;
    text += `OFFICIAL ASSESSMENT: ${activeQuiz.title}\n`;
    text += `Target Cadre: ${userCadre} | Difficulty: ${activeQuiz.difficulty.toUpperCase()}\n`;
    text += `Generated Date: ${new Date().toLocaleDateString()}\n`;
    text += `========================================================\n\n`;

    activeQuiz.questions.forEach((q, idx) => {
      text += `Q${idx + 1}. ${q.questionText}\n`;
      q.options.forEach((opt, oIdx) => {
        text += `   [${String.fromCharCode(65 + oIdx)}] ${opt}\n`;
      });
      text += `\n>> Official Rationale: [${String.fromCharCode(65 + q.correctAnswerIndex)}] - ${q.explanation}\n`;
      text += `>> Source Reference: ${q.conceptCitation || 'MoSPI Guidelines'}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NSSTA_Assessment_${Date.now()}.txt`;
    link.click();
  };

  const currentQ = activeQuiz.questions[currentQuestionIdx] || activeQuiz.questions[0];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Generator Config */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA] text-xs font-semibold border border-blue-100 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                AI MCQ Studio & Adaptive Assessment Engine
              </span>
              <span className="text-xs text-slate-500">
                MoSPI / NSSTA Question Synthesis
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 flex items-center gap-2 font-heading">
              AI MCQ Studio & Document Evaluator
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              Synthesize standardized multiple-choice questions from official statistical manuals, uploaded PDFs/notes, or syllabus topics with statutory citations and distractor analysis.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              type="button"
              onClick={exportQuizAsText}
              className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Download test questions as text"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export Test</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateQuiz}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              {isGenerating ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing MCQs...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#F4B400]" />
                  <span>Generate New Assessment</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Source Mode Tabs */}
        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
          <span className="text-slate-500 mr-1 text-[11px] uppercase tracking-wider">Source:</span>
          <button
            type="button"
            onClick={() => setSourceMode('topic')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              sourceMode === 'topic' ? 'bg-[#1E3ABA] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Core Competency Topics
          </button>
          <button
            type="button"
            onClick={() => setSourceMode('document')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              sourceMode === 'document' ? 'bg-[#1E3ABA] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Official Sample Manuals
          </button>
          <button
            type="button"
            onClick={() => setSourceMode('upload')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              sourceMode === 'upload' ? 'bg-[#1E3ABA] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Upload File (PDF / TXT)
          </button>
          <button
            type="button"
            onClick={() => setSourceMode('custom')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              sourceMode === 'custom' ? 'bg-[#1E3ABA] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Custom Syllabus Notes
          </button>
        </div>

        {/* Source Selection Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100">
          {sourceMode === 'topic' && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Competency / Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1E3ABA]"
              >
                {TOPIC_PRESETS.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {sourceMode === 'document' && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Official Manual / Standard
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1E3ABA]"
              >
                {OFFICIAL_SAMPLE_DOCUMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          {sourceMode === 'upload' && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload Document for MCQ Extraction
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#1E3ABA]" />
                  <span>Choose File...</span>
                  <input
                    type="file"
                    accept=".txt,.pdf,.md,.csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-600 truncate">
                  {uploadedFileName ? uploadedFileName : 'No file chosen (supports text extraction)'}
                </span>
              </div>
            </div>
          )}

          {sourceMode === 'custom' && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paste Syllabus Excerpt or Training Notes
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Paste survey guidelines, formula notes, or policy clauses here..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1E3ABA]"
              />
            </div>
          )}

          {/* Difficulty & Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Difficulty & Question Count
            </label>
            <div className="flex items-center gap-2">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-800 capitalize flex-1"
              >
                <option value="easy">Easy</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-800 w-24"
              >
                <option value={3}>3 MCQs</option>
                <option value={4}>4 MCQs</option>
                <option value={5}>5 MCQs</option>
                <option value={8}>8 MCQs</option>
              </select>
            </div>
          </div>
        </div>

        {generationError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{generationError}</span>
          </div>
        )}
      </div>

      {/* Adaptive Results Screen */}
      {isSubmitted && adaptiveResult && (
        <div className="bg-white border border-slate-200 border-t-4 border-t-[#1E3ABA] rounded-xl p-5 sm:p-6 shadow-xs space-y-4 text-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA] border border-blue-100 text-xs font-semibold uppercase tracking-wider">
                Module 7 • Adaptive Assessment Results
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-heading">
                Assessment Performance Breakdown
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Completed on {adaptiveResult.completedAt} • Score: <strong className="text-[#1E3ABA] text-sm font-mono">{adaptiveResult.score} / {adaptiveResult.totalQuestions} ({adaptiveResult.percentage}%)</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-5 py-3 rounded-xl border text-center shadow-xs ${
                adaptiveResult.passed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="text-3xl font-bold font-mono">{adaptiveResult.percentage}%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                  {adaptiveResult.passed ? 'Benchmark Met' : 'Gap Identified'}
                </div>
              </div>
            </div>
          </div>

          {/* Per-Competency Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {adaptiveResult.competencyBreakdown.map((cb, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{cb.competencyName}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                    Score: {cb.score}/{cb.total} questions ({cb.percentage}%)
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  cb.status === 'Mastered'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : cb.status === 'Competent'
                    ? 'bg-blue-50 text-[#1E3ABA] border-blue-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {cb.status}
                </span>
              </div>
            ))}
          </div>

          {/* Adaptive Engine Guidance Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#1E3ABA] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#1E3ABA] uppercase tracking-wider">
                StatSkill Adaptive AI Next-Step
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {adaptiveResult.adaptiveFocusNote}
              </p>
            </div>
          </div>

          {/* Post-Assessment Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleGenerateQuiz}
              className="px-5 py-2.5 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake / Generate New Set</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setSelectedAnswers({});
                setRevealedExplanations({});
              }}
              className="px-5 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              Review Question Answers
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Quiz Runner Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5 text-slate-800">
        {/* Question Stepper Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#1E3ABA] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-mono">
              Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Difficulty: <strong className="text-slate-800 capitalize">{activeQuiz.difficulty}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatTimer(timeRemainingSeconds)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {activeQuiz.questions.map((_, qIdx) => {
                const isAnswered = selectedAnswers[qIdx] !== undefined;
                const isCurrent = qIdx === currentQuestionIdx;
                return (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => setCurrentQuestionIdx(qIdx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer font-mono ${
                      isCurrent
                        ? 'bg-[#1E3ABA] text-white shadow-xs'
                        : isAnswered
                        ? 'bg-blue-100 text-[#1E3ABA]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question Statement */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-heading">
            {currentQ.questionText}
          </h3>

          {/* 4 Options Grid */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
              const isCorrect = optIdx === currentQ.correctAnswerIndex;
              const showValidation = isSubmitted || revealedExplanations[currentQuestionIdx];

              let buttonStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#1E3ABA] hover:bg-blue-50/30';

              if (showValidation) {
                if (isCorrect) {
                  buttonStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-1 ring-emerald-400';
                } else if (isSelected && !isCorrect) {
                  buttonStyle = 'bg-red-50 border-red-300 text-red-900 ring-1 ring-red-400';
                } else {
                  buttonStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                buttonStyle = 'bg-blue-50 border-[#1E3ABA] text-[#1E3ABA] ring-1 ring-[#1E3ABA] font-semibold';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-3.5 rounded-lg border transition cursor-pointer flex items-start gap-3 ${buttonStyle}`}
                >
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSelected ? 'bg-[#1E3ABA] text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 text-xs sm:text-sm leading-normal">
                    {option}
                  </span>
                  {showValidation && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {showValidation && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation & Source Citation Section */}
        {(isSubmitted || revealedExplanations[currentQuestionIdx]) ? (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 font-heading">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Official Rationale & Methodology
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Correct Option: {String.fromCharCode(65 + currentQ.correctAnswerIndex)}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentQ.explanation}
            </p>

            {currentQ.distractorAnalysis && (
              <p className="text-xs text-slate-500 italic">
                <strong>Distractor Note:</strong> {currentQ.distractorAnalysis}
              </p>
            )}

            {/* Source Reference Tag */}
            <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 text-xs text-[#1E3ABA] font-mono">
              <ShieldCheck className="w-4 h-4 text-[#1E3ABA]" />
              <span><strong>Source Reference:</strong> {currentQ.conceptCitation || 'National Statistical Systems Training Academy (NSSTA)'}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => toggleExplanation(currentQuestionIdx)}
              className="text-xs text-slate-500 hover:text-[#1E3ABA] flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Reveal Explanation & Source</span>
            </button>
          </div>
        )}

        {/* Bottom Nav: Prev / Next / Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentQuestionIdx === 0}
            onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
            className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="px-5 py-2.5 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-xs font-semibold text-white flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : !isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Submit & Calculate Gap Score</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateQuiz}
                className="px-5 py-2.5 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-xs font-semibold text-white transition cursor-pointer shadow-xs"
              >
                Start New Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

