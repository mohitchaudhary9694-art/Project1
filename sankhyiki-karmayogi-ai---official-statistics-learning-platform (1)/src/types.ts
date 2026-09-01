export type UserRole = 'learner' | 'admin' | 'trainer';

export type CadreType = 'ISS' | 'SSS' | 'DES' | 'Field_Investigator' | 'Data_Scientist_MoSPI';

export type DepartmentWing = 
  | 'NAD' // National Accounts Division
  | 'ESD' // Economic Statistics Division
  | 'FOD' // Field Operations Division
  | 'SSD' // Social Statistics Division
  | 'SDRD' // Survey Design & Research Division
  | 'DQAD' // Data Quality Assurance Division
  | 'DIID' // Data Informatics & Innovation Division
  | 'NSSTA'; // National Statistical Systems Training Academy

export type CompetencyDomain = 'statistical' | 'technical' | 'digital_governance' | 'managerial';

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5; // 1: Novice, 2: Beginner, 3: Competent, 4: Proficient, 5: Expert

export interface CompetencyItem {
  id: string;
  name: string;
  category: CompetencyDomain;
  description: string;
  targetLevel: ProficiencyLevel; // Benchmark for their designation
  currentLevel: ProficiencyLevel;
  gap: number; // targetLevel - currentLevel (if > 0, there is a gap)
  priority: 'critical' | 'high' | 'medium' | 'low';
  subSkills: string[];
  recommendedCourseIds: string[];
}

export interface EducationProfile {
  highestQualification: string;
  fieldOfStudy: string;
  institutionName?: string;
}

export interface ExperienceProfile {
  currentRole: string;
  organization: string;
  experienceYearsRange: string;
  experienceYearsNum: number;
  areasOfWork: string[];
}

export interface TrainingHistoryItem {
  courseName: string;
  isCustom?: boolean;
  certificateName?: string;
  certificateDataUrl?: string;
  completedYear?: string;
}

export interface SelfAssessedSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface OnboardingProfileData {
  education: EducationProfile;
  experience: ExperienceProfile;
  trainingHistory: TrainingHistoryItem[];
  skills: SelfAssessedSkill[];
  submittedAt?: string;
}

export interface DiagnosticQuestion {
  id: string;
  pillar: 'statistical' | 'technical' | 'digital_governance' | 'managerial';
  pillarLabel: string;
  type: 'mcq' | 'scenario' | 'self_rating';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  weight: number; // 1, 2, 3
  questionText: string;
  scenarioContext?: string;
  options: {
    id: string;
    text: string;
    scoreValue?: number; // for self-rating: 1-5, for MCQ: 1 (if correct) or 0
    isCorrect?: boolean;
    explanation?: string;
  }[];
  explanation?: string;
  domainRef?: string;
}

export interface DiagnosticPillarScore {
  pillar: CompetencyDomain;
  pillarLabel: string;
  currentLevel: number; // 1.0 - 5.0
  targetLevel: number;  // 1.0 - 5.0
  gap: number;          // targetLevel - currentLevel
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Met';
  objectiveScore: number;
  objectiveTotal: number;
  selfRatingLevel: number;
  confidenceScore: number; // percentage
}

export interface InitialDiagnosticResult {
  testId: string;
  testVersion: string;
  completedAt: string;
  overallIndex: number; // e.g. 3.2 / 5.0
  timeSpentSeconds: number;
  pillarScores: {
    statistical: DiagnosticPillarScore;
    technical: DiagnosticPillarScore;
    digital_governance: DiagnosticPillarScore;
    managerial: DiagnosticPillarScore;
  };
  answers: Record<string, string>; // questionId -> selected option id
  identifiedGapsCount: number;
  topPriorityGaps: {
    competencyName: string;
    pillarLabel: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    recommendedPathwayId?: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  govEmployeeId: string;
  designation: string;
  cadre: CadreType;
  department: DepartmentWing;
  currentAssignment: string;
  experienceYears: number;
  education: string;
  role: UserRole;
  cpdHoursCompleted: number;
  cpdHoursTarget: number;
  completedTrainings: string[];
  enrolledCourseIds: string[];
  competencies: CompetencyItem[];
  careerGoal: string;
  mfaEnabled: boolean;
  avatarUrl?: string;
  onboardingCompleted?: boolean;
  onboardingData?: OnboardingProfileData;
  diagnosticCompleted?: boolean;
  diagnosticResult?: InitialDiagnosticResult;
}

export interface iGOTCourse {
  id: string;
  title: string;
  provider: 'iGOT Karmayogi' | 'NSSTA' | 'MoSPI-TPAC' | 'UNSD' | 'IMF-SARTTAC';
  code: string;
  durationHours: number;
  credits: number;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  competencyDomain: CompetencyDomain;
  primaryCompetency: string;
  level: 'Foundation' | 'Intermediate' | 'Advanced' | 'Executive';
  format: 'Self-Paced e-Learning' | 'Virtual Instructor-Led' | 'Residential Workshop' | 'Hands-on Sandbox';
  tpacApproved: boolean;
  tpacRefNumber?: string;
  description: string;
  learningObjectives: string[];
  modules: {
    title: string;
    duration: string;
    topics: string[];
  }[];
  skillsGained: string[];
  instructors: string[];
  bannerGradient: string;
}

export interface LearningPathway {
  id: string;
  title: string;
  targetRole: string;
  targetWing: DepartmentWing;
  description: string;
  estimatedWeeks: number;
  totalHours: number;
  tpacRefNumber: string;
  courseIds: string[];
  competencyGains: Record<string, number>;
  prerequisites: string[];
  badgeName: string;
}

export interface QuestionItem {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  distractorAnalysis?: string;
  conceptCitation: string;
}

export interface GeneratedAssessment {
  id: string;
  title: string;
  sourceDocumentTitle: string;
  difficulty: 'easy' | 'intermediate' | 'advanced';
  cadreTarget: string;
  totalQuestions: number;
  estimatedTimeMinutes: number;
  createdAt: string;
  questions: QuestionItem[];
}

export interface LearningDocument {
  id: string;
  title: string;
  domain: CompetencyDomain;
  category: string;
  summary: string;
  content: string;
  targetCadre?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  conceptRef: string;
  domain: CompetencyDomain;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Case Study';
}

export interface QuizAssessment {
  id: string;
  title: string;
  topic: string;
  domain: CompetencyDomain;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Case Study';
  sourceMaterialName: string;
  questions: QuizQuestion[];
  createdAt: string;
  timeLimitMinutes: number;
  totalMarks: number;
  passingScorePercentage: number;
  authorRole?: string;
}

export interface QuizSubmission {
  quizId: string;
  userId: string;
  submittedAt: string;
  selectedAnswers: Record<string, number>;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  domainBreakdown: Record<string, { correct: number; total: number }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  sender?: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
  codeSnippet?: {
    language: string;
    code: string;
  };
  references?: string[];
}

export interface AdminAnalytics {
  totalOfficers: number;
  activeLearnersLast30Days: number;
  averageCPDHours: number;
  tpacCompliancePercentage: number;
  wingWiseCompetencyIndex: {
    wing: DepartmentWing;
    wingName: string;
    officersCount: number;
    avgProficiency: number;
    topGapDomain: string;
    criticalGapRate: number;
  }[];
  domainProficiencyAverages: {
    domain: CompetencyDomain;
    domainLabel: string;
    avgScore: number;
    benchmark: number;
  }[];
  emergingSkillRequirements: {
    skill: string;
    demandGrowth: string;
    currentCapacityPercentage: number;
    recommendedAction: string;
  }[];
  recentAssessmentsGenerated: number;
}

// Module 1: Role-to-Skill Digital Twin Types
export type EvidenceType = 
  | 'iGOT Course Certificate'
  | 'NSSTA Assessment'
  | 'Field Work Quality Audit'
  | 'Research Publication'
  | 'Code & Model Sandbox'
  | 'Supervisor Endorsement';

export type AssessmentMethod = 
  | 'AI Quiz & MCQ Test'
  | 'Practical Lab Simulation'
  | 'Supervisor Review'
  | 'Self-Assessment'
  | 'Peer Review';

export interface RoleCompetencyRequirement {
  competencyId: string;
  competencyName: string;
  category: CompetencyDomain;
  targetLevel: ProficiencyLevel;
  evidenceType: EvidenceType;
  assessmentMethod: AssessmentMethod;
  importance: 'Core' | 'Specialized' | 'Prerequisite';
  description?: string;
}

export interface RoleDigitalTwin {
  id: string;
  roleTitle: string;
  cadre: CadreType;
  department: DepartmentWing;
  description: string;
  minimumExperienceYears: number;
  cpdAnnualTargetHours: number;
  competencies: RoleCompetencyRequirement[];
}

// Module 7 & 9: Evidence & Passport Types
export interface EvidenceLog {
  id: string;
  competencyId: string;
  competencyName: string;
  category: CompetencyDomain;
  evidenceType: EvidenceType;
  assessmentMethod: AssessmentMethod;
  title: string;
  score?: number;
  date: string;
  verified: boolean;
  issuer: string;
  certificateRef?: string;
  status: 'verified' | 'pending' | 'in_review';
}

export interface CompetencyPassportData {
  passportId: string;
  issueDate: string;
  lastVerified: string;
  issuingAuthority: string;
  overallReadiness: number;
  verifiedBadgesCount: number;
  evidenceHistory: EvidenceLog[];
  trendMap: Record<string, 'improving' | 'stable' | 'declining'>;
}

// Module 7: Adaptive Assessment Result
export interface AdaptiveAssessmentSummary {
  quizTitle: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  timeSpentSeconds: number;
  competencyBreakdown: {
    competencyId: string;
    competencyName: string;
    category: CompetencyDomain;
    score: number;
    total: number;
    percentage: number;
    status: 'Mastered' | 'Competent' | 'Needs Improvement' | 'Critical Gap';
  }[];
  adaptiveFocusNote: string;
  recommendedFollowupCourseId?: string;
}

// Module 10: Capacity Building Simulator
export interface CapacitySimulationResult {
  scenarioName: string;
  targetCompetency: string;
  baselineProficiency: number;
  targetProficiency: number;
  targetOfficersCount: number;
  priorityLearnersHighGap: number;
  estimatedCohortDurationWeeks: number;
  recommendedCourseHours: number;
  estimatedTrainingCostPerOfficer: number;
  totalEstimatedBudgetINR: number;
  wingImpact: {
    wing: DepartmentWing;
    officersCount: number;
    gapClosingPercent: number;
  }[];
}
