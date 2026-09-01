import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  BookOpen, 
  Code2, 
  Award, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Play
} from 'lucide-react';

export type LearningStage = 'learn' | 'practice' | 'prove' | 'measure' | 'improve';

interface LearnPracticeProveStepperProps {
  currentStage: LearningStage;
  onNavigateStage: (stage: LearningStage) => void;
  completedStages?: LearningStage[];
  officerName: string;
}

interface StageInfo {
  id: LearningStage;
  labelEn: string;
  labelHi: string;
  labelPa: string;
  sublabelEn: string;
  sublabelHi: string;
  sublabelPa: string;
  icon: React.ElementType;
  descEn: string;
  descHi: string;
  descPa: string;
  actionTextEn: string;
  actionTextHi: string;
  actionTextPa: string;
  metric: string;
}

export const STAGES: StageInfo[] = [
  {
    id: 'learn',
    labelEn: '1. Learn',
    labelHi: '1. सीखें (Learn)',
    labelPa: '1. ਸਿੱਖੋ (Learn)',
    sublabelEn: 'iGOT & NSSTA Courses',
    sublabelHi: 'आईजीओटी एवं एनएसएसटीए पाठ्यक्रम',
    sublabelPa: 'iGOT ਅਤੇ NSSTA ਕੋਰਸ',
    icon: BookOpen,
    descEn: 'Acquire official MoSPI competencies via accredited digital modules and TPAC curriculum.',
    descHi: 'प्रमाणित डिजिटल मॉड्यूल और टीपैक पाठ्यक्रम के माध्यम से आधिकारिक मोस्पी दक्षता प्राप्त करें।',
    descPa: 'ਪ੍ਰਮਾਣਿਤ ਡਿਜੀਟਲ ਮਾਡਿਊਲਾਂ ਰਾਹੀਂ ਅਧਿਕਾਰਤ ਮੋਸਪੀ ਯੋਗਤਾਵਾਂ ਹਾਸਲ ਕਰੋ।',
    actionTextEn: 'Explore Courses',
    actionTextHi: 'पाठ्यक्रम देखें',
    actionTextPa: 'ਕੋਰਸ ਵੇਖੋ',
    metric: '3 In-Progress',
  },
  {
    id: 'practice',
    labelEn: '2. Practice',
    labelHi: '2. अभ्यास (Practice)',
    labelPa: '2. ਅਭਿਆਸ (Practice)',
    sublabelEn: 'What-If Labs & Sandbox',
    sublabelHi: 'वॉट-इफ लैब एवं सांख्यिकी सैंडबॉक्स',
    sublabelPa: 'ਵਾਟ-ਇਫ ਲੈਬ ਅਤੇ ਸੈਂਡਬਾਕਸ',
    icon: Code2,
    descEn: 'Practice high-stakes survey sampling, data quality checks, and scenario decisions with synthetic data.',
    descHi: 'सिंथेटिक डेटा के साथ नमूनाकरण, डेटा गुणवत्ता जांच और परिदृश्य निर्णयों का अभ्यास करें।',
    descPa: 'ਸਿੰਥੈਟਿਕ ਡੇਟਾ ਨਾਲ ਸਰਵੇਖਣ ਨਮੂਨਾ ਲੈਣ ਅਤੇ ਦ੍ਰਿਸ਼ਟੀਕੋਣ ਫੈਸਲਿਆਂ ਦਾ ਅਭਿਆਸ ਕਰੋ।',
    actionTextEn: 'Open What-If Lab',
    actionTextHi: 'वॉट-इफ लैब खोलें',
    actionTextPa: 'ਲੈਬ ਖੋਲ੍ਹੋ',
    metric: 'What-If Ready',
  },
  {
    id: 'prove',
    labelEn: '3. Prove',
    labelHi: '3. प्रमाणित करें (Prove)',
    labelPa: '3. ਸਾਬਤ ਕਰੋ (Prove)',
    sublabelEn: 'AI Quiz & Adaptive Tests',
    sublabelHi: 'एआई प्रश्नोत्तरी एवं अनुकूली मूल्यांकन',
    sublabelPa: 'ਏਆਈ ਕੁਇਜ਼ ਅਤੇ ਮੁਲਾਂਕਣ',
    icon: Award,
    descEn: 'Demonstrate subject mastery through proctored MCQs and 5-level adaptive competency tests.',
    descHi: '5-स्तरीय अनुकूली वस्तुनिष्ठ प्रश्नों के माध्यम से विषय पर अपना प्रभुत्व सिद्ध करें।',
    descPa: '5-ਪੱਧਰੀ ਅਡੈਪਟਿਵ ਟੈਸਟਾਂ ਰਾਹੀਂ ਆਪਣੀ ਮੁਹਾਰਤ ਸਾਬਤ ਕਰੋ।',
    actionTextEn: 'Take Adaptive Test',
    actionTextHi: 'अनुकूली परीक्षा दें',
    actionTextPa: 'ਟੈਸਟ ਲਓ',
    metric: '4 Tests Passed',
  },
  {
    id: 'measure',
    labelEn: '4. Measure',
    labelHi: '4. मापें (Measure)',
    labelPa: '4. ਮਾਪੋ (Measure)',
    sublabelEn: 'AI Gap Engine',
    sublabelHi: 'एआई क्षमता अंतराल इंजन',
    sublabelPa: 'ਏਆਈ ਸਮਰੱਥਾ ਗੈਪ ਇੰਜਣ',
    icon: BarChart3,
    descEn: 'Evaluate proficiency against designated cadre benchmarks and identify high-priority gaps.',
    descHi: 'कैडर बेंचमार्क के विरुद्ध दक्षता का मूल्यांकन करें और उच्च प्राथमिकता वाले अंतरालों की पहचान करें।',
    descPa: 'ਕੈਡਰ ਮਾਪਦੰਡਾਂ ਵਿਰੁੱਧ ਮੁਲਾਂਕਣ ਕਰੋ ਅਤੇ ਗੈਪਸ ਦੀ ਪਛਾਣ ਕਰੋ।',
    actionTextEn: 'View AI Gaps',
    actionTextHi: 'अंतराल देखें',
    actionTextPa: 'ਗੈਪਸ ਵੇਖੋ',
    metric: '68% Readiness',
  },
  {
    id: 'improve',
    labelEn: '5. Grow & Close',
    labelHi: '5. क्षमता संवर्धन (Grow)',
    labelPa: '5. ਤਰੱਕੀ ਕਰੋ (Grow)',
    sublabelEn: 'Competency Passport',
    sublabelHi: 'सत्यापित क्षमता पासपोर्ट',
    sublabelPa: 'ਤਸਦੀਕਸ਼ੁਦਾ ਸਮਰੱਥਾ ਪਾਸਪੋਰਟ',
    icon: Sparkles,
    descEn: 'Earn verifiable digital credentials, track upward skill velocity, and unlock career milestones.',
    descHi: 'सत्यापित डिजिटल प्रमाणपत्र अर्जित करें, दक्षता गति को ट्रैक करें और करियर की उपलब्धियां प्राप्त करें।',
    descPa: 'ਤਸਦੀਕਸ਼ੁਦਾ ਡਿਜੀਟਲ ਸਰਟੀਫਿਕੇਟ ਪ੍ਰਾਪਤ ਕਰੋ ਅਤੇ ਤਰੱਕੀ ਕਰੋ।',
    actionTextEn: 'Open Passport',
    actionTextHi: 'पासपोर्ट देखें',
    actionTextPa: 'ਪਾਸਪੋਰਟ ਖੋਲ੍ਹੋ',
    metric: '6 Badges Earned',
  }
];

export const LearnPracticeProveStepper: React.FC<LearnPracticeProveStepperProps> = ({
  currentStage,
  onNavigateStage,
  completedStages = ['learn', 'practice'],
}) => {
  const { isHindi, isPunjabi } = useLanguage();
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#1E3ABA] text-[11px] font-bold uppercase tracking-wider">
              {isHindi ? 'सतत क्षमता संवर्धन चक्र' : isPunjabi ? 'ਨਿਰੰਤਰ ਸਮਰੱਥਾ ਨਿਰਮਾਣ ਚੱਕਰ' : 'StatSkill Continuous Learning Cycle'}
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              {isHindi ? 'सीखें → अभ्यास → प्रमाण → मापन → संवर्धन' : isPunjabi ? 'ਸਿੱਖੋ → ਅਭਿਆਸ → ਸਾਬਤ → ਮਾਪੋ → ਤਰੱਕੀ' : 'Learn → Practice → Prove → Measure → Improve'}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 flex items-center gap-2 font-heading">
            {isHindi ? 'दक्षता महारत एवं अधिगम मार्ग' : isPunjabi ? 'ਸਮਰੱਥਾ ਪ੍ਰਵੀਨਤਾ ਮਾਰਗ' : 'Competency Mastery Pathway'}
          </h3>
        </div>

        {/* Current Active Step Banner */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E3ABA] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1E3ABA]"></span>
          </span>
          <span className="text-xs font-semibold text-slate-700">
            {isHindi ? 'सक्रिय चरण:' : isPunjabi ? 'ਸਰਗਰਮ ਪੜਾਅ:' : 'Active Stage:'}{' '}
            <strong className="text-[#1E3ABA]">
              {isHindi ? STAGES[currentIndex]?.labelHi : isPunjabi ? STAGES[currentIndex]?.labelPa : STAGES[currentIndex]?.labelEn}
            </strong>
          </span>
        </div>
      </div>

      {/* Horizontal Stepper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = stage.id === currentStage;
          const isCompleted = completedStages.includes(stage.id) && !isActive;
          const isPast = idx < currentIndex;

          const label = isHindi ? stage.labelHi : isPunjabi ? stage.labelPa : stage.labelEn;
          const sublabel = isHindi ? stage.sublabelHi : isPunjabi ? stage.sublabelPa : stage.sublabelEn;
          const desc = isHindi ? stage.descHi : isPunjabi ? stage.descPa : stage.descEn;
          const actionText = isHindi ? stage.actionTextHi : isPunjabi ? stage.actionTextPa : stage.actionTextEn;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onNavigateStage(stage.id)}
              className={`text-left p-3.5 rounded-lg transition-all relative border cursor-pointer group flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-50/70 border-[#1E3ABA] shadow-xs ring-1 ring-[#1E3ABA]/30'
                  : isCompleted || isPast
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/70'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
              }`}
            >
              {/* Top Row: Icon & Status */}
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                  isActive
                    ? 'bg-[#1E3ABA] text-white'
                    : isCompleted || isPast
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600 group-hover:text-slate-900'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {isCompleted || isPast ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    {isHindi ? 'पूर्ण' : isPunjabi ? 'ਪੂਰਾ' : 'Done'}
                  </span>
                ) : isActive ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#1E3ABA] bg-blue-100 px-1.5 py-0.5 rounded">
                    <Play className="w-2.5 h-2.5 fill-current" />
                    {isHindi ? 'सक्रिय' : isPunjabi ? 'ਸਰਗਰਮ' : 'Active'}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">
                    Step {idx + 1}
                  </span>
                )}
              </div>

              {/* Middle: Labels */}
              <div>
                <div className={`text-xs font-bold transition ${
                  isActive ? 'text-[#1E3ABA]' : 'text-slate-900'
                }`}>
                  {label}
                </div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5 leading-tight">
                  {sublabel}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {desc}
                </p>
              </div>

              {/* Bottom: Action Trigger */}
              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-mono">
                  {stage.metric}
                </span>
                <span className={`font-semibold flex items-center gap-1 transition ${
                  isActive ? 'text-[#1E3ABA]' : 'text-slate-600 group-hover:text-slate-900'
                }`}>
                  {actionText}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
