import React, { useState } from 'react';
import { 
  UserProfile, 
  OnboardingProfileData, 
  EducationProfile, 
  ExperienceProfile, 
  TrainingHistoryItem, 
  SelfAssessedSkill,
  CompetencyItem,
  ProficiencyLevel 
} from '../types';
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  BrainCircuit, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText, 
  X, 
  Info,
  Check,
  Search,
  Building2,
  BookOpen,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface OnboardingWizardProps {
  currentUser: UserProfile;
  isEditMode?: boolean;
  onComplete: (updatedData: OnboardingProfileData, updatedUser: UserProfile) => void;
  onClose?: () => void;
}

const COMMON_TRAININGS = [
  'Basic Statistics & Sampling Theory (NSSTA)',
  'Survey Methodology & CAPI Operations (FOD)',
  'NSS Multi-Stage Household Surveys',
  'Data Analytics with R & Python (MoSPI)',
  'System of National Accounts (SNA 2008) GDP Compilation',
  'Price Statistics & Index Numbers (CPI / WPI / IIP)',
  'Periodic Labour Force Survey (PLFS) Protocols',
  'Digital Personal Data Protection (DPDPA 2023) Compliance',
  'iGOT Karmayogi Official Statistics Foundation Modules',
  'UN Fundamental Principles of Official Statistics',
  'Agricultural & Livestock Census Methodology',
  'Annual Survey of Industries (ASI) Scrutiny',
];

const PRESET_SKILLS = [
  'Excel & Advanced Formulas',
  'SPSS',
  'R Programming',
  'Python for Data Science',
  'SQL & Database Queries',
  'Data Visualization (Power BI / Tableau)',
  'Official Report Writing',
  'Survey & Questionnaire Design',
  'Sampling & Multipliers',
  'Machine Learning & AI',
  'CSPro / CAPI Scrutiny',
  'Stata',
  'Time Series Forecasting',
  'National Accounts GDP Compilation',
];

const WORK_AREAS = [
  'Data Collection & Fieldwork',
  'Survey Design & Sampling',
  'Statistical Analysis & Modeling',
  'Data Visualization & Dashboards',
  'Policy Research & Briefs',
  'IT & Systems Engineering',
  'Quality Assurance & Data Audits',
  'Administration & Coordination',
  'Macroeconomic Accounts',
];

const DEPARTMENTS = [
  'National Accounts Division (NAD)',
  'Field Operations Division (FOD)',
  'Economic Statistics Division (ESD)',
  'Social Statistics Division (SSD)',
  'Survey Design & Research Division (SDRD)',
  'Data Quality Assurance Division (DQAD)',
  'Data Informatics & Innovation Division (DIID)',
  'National Statistical Systems Training Academy (NSSTA)',
  'State Directorate of Economics and Statistics (DES)',
  'Ministry of Finance / CEA Office',
  'NITI Aayog / Development Monitoring Unit',
  'Other Central Ministry / Department',
];

const QUALIFICATIONS = [
  '10th',
  '12th',
  'Diploma',
  "Bachelor's",
  "Master's",
  'PhD',
  'Other',
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  currentUser,
  isEditMode = false,
  onComplete,
  onClose,
}) => {
  // Step tracker: 1 = Education, 2 = Experience, 3 = Trainings, 4 = Skills, 5 = Review
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [analyzingProfile, setAnalyzingProfile] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // STEP 1: EDUCATION STATE
  // --------------------------------------------------------------------------
  const existingOnboarding = currentUser.onboardingData;
  const [highestQualification, setHighestQualification] = useState<string>(
    existingOnboarding?.education?.highestQualification || (currentUser.education.includes('Ph.D') ? 'PhD' : currentUser.education.includes('M.Sc') || currentUser.education.includes('M.Stat') ? "Master's" : "Bachelor's")
  );
  const [fieldOfStudy, setFieldOfStudy] = useState<string>(
    existingOnboarding?.education?.fieldOfStudy || (currentUser.education.replace(/Ph\.D\.|M\.Sc\.|M\.Stat|B\.Sc\.|in/gi, '').trim() || 'Statistics')
  );
  const [institutionName, setInstitutionName] = useState<string>(
    existingOnboarding?.education?.institutionName || ''
  );
  const [educationError, setEducationError] = useState<string>('');

  // --------------------------------------------------------------------------
  // STEP 2: PROFESSIONAL EXPERIENCE STATE
  // --------------------------------------------------------------------------
  const [currentRole, setCurrentRole] = useState<string>(
    existingOnboarding?.experience?.currentRole || currentUser.designation || 'Statistical Officer'
  );
  const [organization, setOrganization] = useState<string>(
    existingOnboarding?.experience?.organization || DEPARTMENTS.find(d => d.includes(currentUser.department)) || 'National Accounts Division (NAD)'
  );
  const [customOrg, setCustomOrg] = useState<string>('');
  const [experienceYearsRange, setExperienceYearsRange] = useState<string>(
    existingOnboarding?.experience?.experienceYearsRange || (currentUser.experienceYears > 10 ? '10+' : currentUser.experienceYears > 5 ? '6–10' : currentUser.experienceYears > 2 ? '3–5' : '0–2')
  );
  const [selectedWorkAreas, setSelectedWorkAreas] = useState<string[]>(
    existingOnboarding?.experience?.areasOfWork || ['Statistical Analysis & Modeling', 'Data Collection & Fieldwork']
  );
  const [experienceError, setExperienceError] = useState<string>('');

  // --------------------------------------------------------------------------
  // STEP 3: PREVIOUS TRAINING COURSES STATE
  // --------------------------------------------------------------------------
  const initialTrainings = existingOnboarding?.trainingHistory?.map(t => t.courseName) || currentUser.completedTrainings || [];
  const [selectedTrainings, setSelectedTrainings] = useState<string[]>(initialTrainings);
  const [customCourseInput, setCustomCourseInput] = useState<string>('');
  const [trainingSearch, setTrainingSearch] = useState<string>('');
  const [uploadedCertName, setUploadedCertName] = useState<string>(
    existingOnboarding?.trainingHistory?.find(t => t.certificateName)?.certificateName || ''
  );
  const [uploadedCertSize, setUploadedCertSize] = useState<string>('');

  // --------------------------------------------------------------------------
  // STEP 4: SKILLS SELF-ASSESSMENT STATE
  // --------------------------------------------------------------------------
  const initialSkills: SelfAssessedSkill[] = existingOnboarding?.skills || [
    { name: 'Excel & Advanced Formulas', level: 'Intermediate' },
    { name: 'R Programming', level: 'Intermediate' },
    { name: 'Survey & Questionnaire Design', level: 'Advanced' },
  ];
  const [skillsList, setSkillsList] = useState<SelfAssessedSkill[]>(initialSkills);
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [customSkillInput, setCustomSkillInput] = useState<string>('');

  // Step definitions
  const steps = [
    { number: 1, title: 'Education', icon: GraduationCap, required: true },
    { number: 2, title: 'Experience', icon: Briefcase, required: true },
    { number: 3, title: 'Training History', icon: Award, required: false },
    { number: 4, title: 'Skills Assessment', icon: BrainCircuit, required: false },
    { number: 5, title: 'Review & Submit', icon: CheckCircle2, required: true },
  ];

  // --------------------------------------------------------------------------
  // STEP NAVIGATION & VALIDATION
  // --------------------------------------------------------------------------
  const handleNext = () => {
    if (currentStep === 1) {
      if (!highestQualification) {
        setEducationError('Please select your highest educational qualification.');
        return;
      }
      if (!fieldOfStudy.trim()) {
        setEducationError('Please specify your field of study / specialization.');
        return;
      }
      setEducationError('');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!currentRole.trim()) {
        setExperienceError('Please enter your current role or official designation.');
        return;
      }
      if (!organization) {
        setExperienceError('Please select or specify your department / ministry.');
        return;
      }
      if (selectedWorkAreas.length === 0) {
        setExperienceError('Please select at least one primary area of work.');
        return;
      }
      setExperienceError('');
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    // Only allow skipping on non-essential steps (3 and 4)
    if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  // --------------------------------------------------------------------------
  // TRAINING HANDLERS
  // --------------------------------------------------------------------------
  const toggleTraining = (courseTitle: string) => {
    if (selectedTrainings.includes(courseTitle)) {
      setSelectedTrainings(selectedTrainings.filter(t => t !== courseTitle));
    } else {
      setSelectedTrainings([...selectedTrainings, courseTitle]);
    }
  };

  const handleAddCustomCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCourseInput.trim()) return;
    if (!selectedTrainings.includes(customCourseInput.trim())) {
      setSelectedTrainings([...selectedTrainings, customCourseInput.trim()]);
    }
    setCustomCourseInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedCertName(file.name);
      const sizeKb = Math.round(file.size / 1024);
      setUploadedCertSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);
    }
  };

  // --------------------------------------------------------------------------
  // SKILL HANDLERS
  // --------------------------------------------------------------------------
  const toggleSkill = (skillName: string) => {
    const exists = skillsList.find(s => s.name === skillName);
    if (exists) {
      setSkillsList(skillsList.filter(s => s.name !== skillName));
    } else {
      setSkillsList([...skillsList, { name: skillName, level: 'Intermediate' }]);
    }
  };

  const updateSkillLevel = (skillName: string, level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setSkillsList(skillsList.map(s => s.name === skillName ? { ...s, level } : s));
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    const exists = skillsList.find(s => s.name.toLowerCase() === customSkillInput.trim().toLowerCase());
    if (!exists) {
      setSkillsList([...skillsList, { name: customSkillInput.trim(), level: 'Intermediate' }]);
    }
    setCustomSkillInput('');
  };

  // --------------------------------------------------------------------------
  // SUBMISSION & PROFILE HARMONIZATION
  // --------------------------------------------------------------------------
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setAnalyzingProfile(true);

    // Map experience range to numeric estimate
    let numericExp = 4;
    if (experienceYearsRange === '0–2') numericExp = 1;
    else if (experienceYearsRange === '3–5') numericExp = 4;
    else if (experienceYearsRange === '6–10') numericExp = 8;
    else if (experienceYearsRange === '10+') numericExp = 12;

    const orgValue = organization === 'Other Central Ministry / Department' && customOrg.trim() 
      ? customOrg.trim() 
      : organization;

    // Construct structured profile JSON
    const structuredOnboardingData: OnboardingProfileData = {
      education: {
        highestQualification,
        fieldOfStudy: fieldOfStudy.trim(),
        institutionName: institutionName.trim() || undefined,
      },
      experience: {
        currentRole: currentRole.trim(),
        organization: orgValue,
        experienceYearsRange,
        experienceYearsNum: numericExp,
        areasOfWork: selectedWorkAreas,
      },
      trainingHistory: selectedTrainings.map(t => ({
        courseName: t,
        isCustom: !COMMON_TRAININGS.includes(t),
        certificateName: uploadedCertName || undefined,
        completedYear: new Date().getFullYear().toString(),
      })),
      skills: skillsList,
      submittedAt: new Date().toISOString(),
    };

    // Calculate intelligent competency levels based on self-assessed skills
    const updatedCompetencies: CompetencyItem[] = currentUser.competencies.map(comp => {
      let boostedLevel = comp.currentLevel;

      // Check if user listed relevant skills with high proficiency
      const hasRelatedAdvancedSkill = skillsList.some(
        s => comp.subSkills.some(sub => sub.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(sub.toLowerCase())) && s.level === 'Advanced'
      );
      const hasRelatedInterSkill = skillsList.some(
        s => comp.subSkills.some(sub => sub.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(sub.toLowerCase())) && s.level === 'Intermediate'
      );

      if (hasRelatedAdvancedSkill) {
        boostedLevel = Math.min(comp.targetLevel, Math.max(boostedLevel, 4)) as ProficiencyLevel;
      } else if (hasRelatedInterSkill) {
        boostedLevel = Math.min(comp.targetLevel, Math.max(boostedLevel, 3)) as ProficiencyLevel;
      }

      return {
        ...comp,
        currentLevel: boostedLevel,
        gap: Math.max(0, comp.targetLevel - boostedLevel),
      };
    });

    const updatedUserProfile: UserProfile = {
      ...currentUser,
      designation: currentRole.trim(),
      education: `${highestQualification} in ${fieldOfStudy.trim()}${institutionName.trim() ? ` (${institutionName.trim()})` : ''}`,
      experienceYears: numericExp,
      completedTrainings: Array.from(new Set([...currentUser.completedTrainings, ...selectedTrainings])),
      competencies: updatedCompetencies,
      onboardingCompleted: true,
      diagnosticCompleted: currentUser.diagnosticCompleted ?? false,
      onboardingData: structuredOnboardingData,
    };

    // Give a brief AI analyzing animation delay
    setTimeout(() => {
      setIsSubmitting(false);
      setAnalyzingProfile(false);
      onComplete(structuredOnboardingData, updatedUserProfile);
    }, 1200);
  };

  const filteredTrainings = COMMON_TRAININGS.filter(t => 
    t.toLowerCase().includes(trainingSearch.toLowerCase())
  );

  const filteredSkills = PRESET_SKILLS.filter(s =>
    s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in font-['Inter',sans-serif]">
      
      <div className="bg-slate-50 border border-slate-200 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Tricolor Ribbon Header */}
        <div className="tricolor-strip" />

        {/* Header Bar */}
        <div className="bg-white text-slate-900 px-5 sm:px-8 py-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E3ABA] text-lg shadow-xs">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1E3ABA]">
                  MoSPI • NSSTA Official System
                </span>
                <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                  {isEditMode ? 'Profile Editor' : 'Officer Onboarding'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight font-heading">
                {isEditMode ? 'Update Professional & Statistical Profile' : 'Capacity Building Profile Wizard'}
              </h2>
            </div>
          </div>

          {isEditMode && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Close Wizard"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Tracker Banner */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
            <span className="text-slate-900 font-bold font-heading">
              Step {currentStep} of 5: <span className="text-[#1E3ABA]">{steps[currentStep - 1].title}</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {Math.round((currentStep / 5) * 100)}% Completed
            </span>
          </div>

          {/* Stepper Dots & Line */}
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isPassed = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              return (
                <button
                  key={step.number}
                  type="button"
                  disabled={!isPassed && !isEditMode}
                  onClick={() => {
                    if (isPassed || isEditMode) setCurrentStep(step.number);
                  }}
                  className={`flex flex-col items-center gap-1 group text-left cursor-pointer transition ${
                    !isPassed && !isCurrent && !isEditMode ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="w-full flex items-center">
                    <div
                      className={`h-1.5 w-full rounded-full transition-all ${
                        isPassed
                          ? 'bg-emerald-600'
                          : isCurrent
                          ? 'bg-[#1E3ABA]'
                          : 'bg-slate-200'
                      }`}
                    />
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-[11px] mt-0.5">
                    <Icon className={`w-3 h-3 ${isCurrent ? 'text-[#1E3ABA]' : isPassed ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className={`font-medium truncate max-w-[85px] ${isCurrent ? 'text-[#1E3ABA] font-bold' : isPassed ? 'text-slate-700' : 'text-slate-400'}`}>
                      {step.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Wizard Form Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 text-slate-800">
          
          {/* ================================================================= */}
          {/* STEP 1: EDUCATION (REQUIRED) */}
          {/* ================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="icon-badge-blue">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Academic Qualifications & Specialization
                    </h3>
                    <p className="text-xs text-slate-500">
                      Helps the system match advanced statistical theory and methodology courses.
                    </p>
                  </div>
                </div>
              </div>

              {educationError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[#E63946] text-xs font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 text-[#E63946]" />
                  <span>{educationError}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Highest Qualification */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Highest Qualification <span className="text-[#E63946]">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {QUALIFICATIONS.map((qual) => (
                      <button
                        key={qual}
                        type="button"
                        onClick={() => {
                          setHighestQualification(qual);
                          setEducationError('');
                        }}
                        className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                          highestQualification === qual
                            ? 'bg-[#1E3ABA] text-white border-[#1E3ABA] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#1E3ABA] hover:bg-blue-50/40'
                        }`}
                      >
                        {qual}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Field of Study / Specialization */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Field of Study / Academic Discipline <span className="text-[#E63946]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fieldOfStudy}
                    onChange={(e) => {
                      setFieldOfStudy(e.target.value);
                      setEducationError('');
                    }}
                    placeholder="e.g., Statistics, Econometrics, Computer Science, Mathematics"
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3ABA] focus:border-[#1E3ABA] transition"
                  />

                  {/* Quick Specialization Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[11px] text-slate-500 mr-1">Quick Select:</span>
                    {['Statistics', 'Econometrics', 'Data Science', 'Computer Science', 'Mathematics', 'Economics', 'Public Policy'].map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => {
                          setFieldOfStudy(spec);
                          setEducationError('');
                        }}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 cursor-pointer transition"
                      >
                        + {spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Institution Name (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    University / Institution Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="e.g., Indian Statistical Institute (ISI) Kolkata, Delhi University, IIT Bombay"
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3ABA] focus:border-[#1E3ABA] transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 2: PROFESSIONAL EXPERIENCE (REQUIRED) */}
          {/* ================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="icon-badge-amber">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Official Designation & Experience
                    </h3>
                    <p className="text-xs text-slate-500">
                      Used to calculate TPAC role-based benchmarks and competency gap priorities.
                    </p>
                  </div>
                </div>
              </div>

              {experienceError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[#E63946] text-xs font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 text-[#E63946]" />
                  <span>{experienceError}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Current Role / Designation */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Current Role / Official Designation <span className="text-[#E63946]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentRole}
                    onChange={(e) => {
                      setCurrentRole(e.target.value);
                      setExperienceError('');
                    }}
                    placeholder="e.g., Senior Statistical Officer (SSO), Director, Deputy Director, Field Investigator"
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3ABA] focus:border-[#1E3ABA] transition"
                  />
                </div>

                {/* Department / Ministry */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Department / Ministry / Organization <span className="text-[#E63946]">*</span>
                  </label>
                  <select
                    value={organization}
                    onChange={(e) => {
                      setOrganization(e.target.value);
                      setExperienceError('');
                    }}
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1E3ABA] cursor-pointer"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>

                  {organization === 'Other Central Ministry / Department' && (
                    <input
                      type="text"
                      value={customOrg}
                      onChange={(e) => setCustomOrg(e.target.value)}
                      placeholder="Enter Ministry / Directorate name"
                      className="mt-2 w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1E3ABA]"
                    />
                  )}
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Total Years in Statistical Service / Government <span className="text-[#E63946]">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['0–2', '3–5', '6–10', '10+'].map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setExperienceYearsRange(range)}
                        className={`py-2.5 px-2 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                          experienceYearsRange === range
                            ? 'bg-[#1E3ABA] text-white border-[#1E3ABA] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#1E3ABA] hover:bg-blue-50/40'
                        }`}
                      >
                        {range} years
                      </button>
                    ))}
                  </div>
                </div>

                {/* Areas of Work (Multi-Select) */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Primary Areas of Work <span className="text-[#E63946]">*</span>{' '}
                    <span className="text-slate-400 font-normal">(Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {WORK_AREAS.map((area) => {
                      const isSelected = selectedWorkAreas.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedWorkAreas(selectedWorkAreas.filter(a => a !== area));
                            } else {
                              setSelectedWorkAreas([...selectedWorkAreas, area]);
                            }
                            setExperienceError('');
                          }}
                          className={`p-2.5 rounded-lg text-xs font-semibold border text-left flex items-center justify-between transition cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-[#1E3ABA] text-[#1E3ABA] font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span>{area}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#1E3ABA] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: PREVIOUS TRAINING COURSES (SKIPPABLE) */}
          {/* ================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="icon-badge-amber">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Previous Training Courses & Certifications
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select courses you have completed at NSSTA, iGOT Karmayogi, or international bodies.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Optional
                </span>
              </div>

              {/* Search Course Filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={trainingSearch}
                  onChange={(e) => setTrainingSearch(e.target.value)}
                  placeholder="Search common government and statistical courses..."
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3ABA]"
                />
              </div>

              {/* Course Checklist */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {filteredTrainings.map((course) => {
                  const isChecked = selectedTrainings.includes(course);
                  return (
                    <div
                      key={course}
                      onClick={() => toggleTraining(course)}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                        isChecked
                          ? 'bg-blue-50 border-[#1E3ABA] text-[#1E3ABA] font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#1E3ABA] border-[#1E3ABA] text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{course}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom / Other Course Field */}
              <form onSubmit={handleAddCustomCourse} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customCourseInput}
                  onChange={(e) => setCustomCourseInput(e.target.value)}
                  placeholder="Add other unlisted training / workshop..."
                  className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3ABA]"
                />
                <button
                  type="submit"
                  disabled={!customCourseInput.trim()}
                  className="px-3.5 py-2 bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>

              {/* Selected Courses Chips Summary */}
              {selectedTrainings.length > 0 && (
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-900 mb-2">
                    Selected Trainings ({selectedTrainings.length}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTrainings.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-[#1E3ABA] font-medium px-2 py-0.5 rounded-md border border-blue-100"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => toggleTraining(t)}
                          className="text-[#1E3ABA] hover:text-[#E63946] ml-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Certificate Upload Field */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#1E3ABA]" />
                    Upload Certificate / Training Proof
                  </label>
                  <span className="text-[11px] text-slate-400 font-normal">Optional (PDF, PNG, JPG)</span>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-white hover:bg-slate-50 transition text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  {uploadedCertName ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{uploadedCertName}</span>
                      <span className="text-slate-400 font-normal">({uploadedCertSize})</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedCertName('');
                          setUploadedCertSize('');
                        }}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <div className="text-xs font-semibold text-slate-700">
                        Drag and drop your certificate here, or <span className="text-[#1E3ABA] underline">browse</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Max size 5 MB</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 4: SKILLS SELF-ASSESSMENT (SKIPPABLE) */}
          {/* ================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="icon-badge-emerald">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Skills Self-Assessment
                    </h3>
                    <p className="text-xs text-slate-500">
                      Rate your proficiency level across key statistical software and methodological tools.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Optional
                </span>
              </div>

              {/* Tag-Style Skill Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Select Tools & Methodologies you use:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-white rounded-lg border border-slate-200">
                  {filteredSkills.map((skillName) => {
                    const isSelected = skillsList.some(s => s.name === skillName);
                    return (
                      <button
                        key={skillName}
                        type="button"
                        onClick={() => toggleSkill(skillName)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-md border transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#1E3ABA] text-white border-[#1E3ABA]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#1E3ABA] hover:bg-blue-50'
                        }`}
                      >
                        <span>{skillName}</span>
                        {isSelected ? <Check className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-slate-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Skill */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom skill or tool (e.g., GeoPandas, CAPI, DDI/SDMX)..."
                  className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3ABA]"
                />
                <button
                  type="submit"
                  disabled={!customSkillInput.trim()}
                  className="px-3.5 py-2 bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>

              {/* Proficiency Sliders / Level Selectors for Selected Skills */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-bold text-slate-900">
                  Proficiency Rating for Selected Skills ({skillsList.length}):
                </label>

                {skillsList.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs bg-white rounded-lg border border-slate-200">
                    No skills selected yet. Choose from above or click "Skip for now".
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {skillsList.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between sm:justify-start gap-2">
                          <span className="text-xs font-bold text-slate-900">{skill.name}</span>
                          <button
                            type="button"
                            onClick={() => toggleSkill(skill.name)}
                            className="text-slate-400 hover:text-red-500 sm:hidden"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => updateSkillLevel(skill.name, lvl)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                                skill.level === lvl
                                  ? lvl === 'Advanced'
                                    ? 'bg-emerald-700 text-white border-emerald-700'
                                    : lvl === 'Intermediate'
                                    ? 'bg-amber-600 text-white border-amber-600'
                                    : 'bg-[#1E3ABA] text-white border-[#1E3ABA]'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => toggleSkill(skill.name)}
                            className="text-slate-400 hover:text-red-500 hidden sm:block p-1 ml-1 cursor-pointer"
                            title="Remove skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 5: REVIEW & SUBMIT */}
          {/* ================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="icon-badge-emerald">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Review & Confirm Your Statistical Profile
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verify your details before submitting for AI-powered competency gap analysis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Card: Education */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#1E3ABA]" />
                    Education Details
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-[11px] text-[#1E3ABA] font-semibold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 text-[11px]">Qualification:</span>
                    <p className="font-semibold text-slate-900">{highestQualification}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Field of Study:</span>
                    <p className="font-semibold text-slate-900">{fieldOfStudy}</p>
                  </div>
                  {institutionName && (
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[11px]">Institution:</span>
                      <p className="font-semibold text-slate-900">{institutionName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Card: Experience */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-amber-700" />
                    Professional Experience
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-[11px] text-[#1E3ABA] font-semibold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 text-[11px]">Designation:</span>
                    <p className="font-semibold text-slate-900">{currentRole}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Experience:</span>
                    <p className="font-semibold text-slate-900">{experienceYearsRange} years</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[11px]">Department / Wing:</span>
                    <p className="font-semibold text-slate-900">
                      {organization === 'Other Central Ministry / Department' && customOrg ? customOrg : organization}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[11px]">Areas of Work:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedWorkAreas.map(a => (
                        <span key={a} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Card: Training History */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-700" />
                    Training History ({selectedTrainings.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-[11px] text-[#1E3ABA] font-semibold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                {selectedTrainings.length === 0 ? (
                  <p className="text-xs text-slate-400 italic pt-1">No prior training courses listed.</p>
                ) : (
                  <ul className="text-xs space-y-1 text-slate-700 list-disc list-inside pt-1">
                    {selectedTrainings.map(t => (
                      <li key={t} className="truncate">{t}</li>
                    ))}
                  </ul>
                )}
                {uploadedCertName && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md mt-1 flex items-center gap-1 border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Attached Proof: {uploadedCertName}
                  </div>
                )}
              </div>

              {/* Review Card: Skills */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-emerald-700" />
                    Skills Self-Assessment ({skillsList.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="text-[11px] text-[#1E3ABA] font-semibold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                {skillsList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic pt-1">No skills self-assessed yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skillsList.map(s => (
                      <span
                        key={s.name}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1 font-medium"
                      >
                        <span>{s.name}</span>
                        <span className={`text-[9px] font-bold px-1 rounded ${
                          s.level === 'Advanced' ? 'bg-emerald-100 text-emerald-800' : s.level === 'Intermediate' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {s.level}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="bg-white border-t border-slate-200 px-5 sm:px-8 py-3.5 flex items-center justify-between gap-3">
          {/* Back Button */}
          {currentStep > 1 ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleBack}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Skip for now on non-essential steps */}
            {(currentStep === 3 || currentStep === 4) && (
              <button
                type="button"
                onClick={handleSkip}
                className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Skip for now
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <span>Next: {steps[currentStep].title}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {analyzingProfile ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Analyzing Competencies & Harmonizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F4B400]" />
                    <span>{isEditMode ? 'Save Profile Changes' : 'Submit & Analyze Profile'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
