import React, { useState, useEffect } from 'react';
import { UserProfile, iGOTCourse, LearningPathway, ProficiencyLevel, OnboardingProfileData, InitialDiagnosticResult } from './types';
import { DEMO_USERS, MOCK_IGOT_COURSES, MOCK_LEARNING_PATHWAYS, INITIAL_COMPETENCIES } from './data/mockData';
import { auth, syncUserProfile, saveUserProfile, signOutUser } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from './context/LanguageContext';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { LearnerDashboard } from './components/LearnerDashboard';
import { CompetencyExplorer } from './components/CompetencyExplorer';
import { CompetencyGapEngine } from './components/CompetencyGapEngine';
import { PersonalizedRecommendations } from './components/PersonalizedRecommendations';
import { RagLearningAssistant } from './components/RagLearningAssistant';
import { QuizMcqStudio } from './components/QuizMcqStudio';
import { CompetencyPassport } from './components/CompetencyPassport';
import { IGOTCoursesHub } from './components/iGOTCoursesHub';
import { QuizGenerator } from './components/QuizGenerator';
import { StatisticalLab } from './components/StatisticalLab';
import { AdminDashboard } from './components/AdminDashboard';
import { KarmayogiAssistant } from './components/KarmayogiAssistant';
import { OnboardingWizard } from './components/OnboardingWizard';
import { InitialSkillDiagnosticTest } from './components/InitialSkillDiagnosticTest';
import { 
  Sparkles, 
  CheckCircle2, 
  X, 
  Target, 
  BookOpen, 
  Layers, 
  FileText 
} from 'lucide-react';

export function App() {
  const { t } = useLanguage();
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USERS[0]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [competencySubTab, setCompetencySubTab] = useState<'gap_engine' | 'recommendations' | 'all_framework'>('gap_engine');
  const [allCourses, setAllCourses] = useState<iGOTCourse[]>(MOCK_IGOT_COURSES);
  const [allPathways, setAllPathways] = useState<LearningPathway[]>(MOCK_LEARNING_PATHWAYS);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [activeCourseModal, setActiveCourseModal] = useState<iGOTCourse | null>(null);
  
  // Post-Registration Onboarding & Profile Editing State
  const [isProfileWizardOpen, setIsProfileWizardOpen] = useState<boolean>(false);
  const [welcomeBanner, setWelcomeBanner] = useState<string | null>(null);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await syncUserProfile(firebaseUser);
          setCurrentUser(profile);
        } catch (error) {
          console.error('Error syncing auth state with Firestore:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle Login / Registration completion
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    saveUserProfile(user);
    setActiveTab(user.role === 'admin' ? 'admin_analytics' : 'dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
    saveUserProfile(user);
    if (user.role === 'admin' && activeTab !== 'admin_analytics') {
      setActiveTab('admin_analytics');
    }
  };

  // Handle Onboarding Profile Completion
  const handleOnboardingComplete = (data: OnboardingProfileData, updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    saveUserProfile(updatedUser);
    setIsProfileWizardOpen(false);

    // If new user has not completed diagnostic, route them directly to diagnostic
    if (!updatedUser.diagnosticCompleted) {
      setActiveTab('initial_diagnostic');
      setWelcomeBanner("Profile calibrated! Please proceed with your 4-Pillar Initial Skill Diagnostic to generate your official baseline.");
    } else {
      setWelcomeBanner("Profile successfully calibrated! Personalized competency roadmap and iGOT pathways generated.");
    }

    // Auto dismiss after 10s
    setTimeout(() => {
      setWelcomeBanner(null);
    }, 10000);
  };

  // Handle Diagnostic Assessment Completion
  const handleDiagnosticComplete = (result: InitialDiagnosticResult, updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    saveUserProfile(updatedUser);
    setActiveTab('dashboard');
    setWelcomeBanner("Initial 4-Pillar Diagnostic completed! Competency baseline, radar, and AI Gap roadmap successfully calibrated.");

    setTimeout(() => {
      setWelcomeBanner(null);
    }, 10000);
  };

  // Handle Course Enrollment
  const handleEnrollCourse = (courseId: string) => {
    if (!currentUser) return;
    if (!currentUser.enrolledCourseIds.includes(courseId)) {
      const updatedUser = {
        ...currentUser,
        enrolledCourseIds: [...currentUser.enrolledCourseIds, courseId],
      };
      setCurrentUser(updatedUser);
      saveUserProfile(updatedUser);
    }
  };

  // Handle Course Progress Sync with iGOT Karmayogi API
  const handleSyncCourseProgress = (courseId: string) => {
    if (!currentUser) return;
    const course = allCourses.find(c => c.id === courseId);
    const addedCredits = course?.credits || 4;

    const newCompletedHours = Math.min(
      currentUser.cpdHoursTarget,
      currentUser.cpdHoursCompleted + addedCredits
    );

    // Also close matching competency gap by +1 level
    const updatedCompetencies = currentUser.competencies.map((comp) => {
      if (comp.recommendedCourseIds.includes(courseId) && comp.currentLevel < comp.targetLevel) {
        const nextLevel = (comp.currentLevel + 1) as ProficiencyLevel;
        return {
          ...comp,
          currentLevel: nextLevel,
          gap: Math.max(0, comp.targetLevel - nextLevel),
        };
      }
      return comp;
    });

    const updatedTrainings = course && !currentUser.completedTrainings.includes(course.title)
      ? [...currentUser.completedTrainings, course.title]
      : currentUser.completedTrainings;

    const updatedProfile = {
      ...currentUser,
      cpdHoursCompleted: newCompletedHours,
      competencies: updatedCompetencies,
      completedTrainings: updatedTrainings,
    };

    setCurrentUser(updatedProfile);
    saveUserProfile(updatedProfile);
  };

  // Handle Competency Level Updates
  const handleUpdateCompetencyLevel = (competencyId: string, newLevel: ProficiencyLevel) => {
    if (!currentUser) return;
    const updatedCompetencies = currentUser.competencies.map((c) => {
      if (c.id === competencyId) {
        return {
          ...c,
          currentLevel: newLevel,
          gap: Math.max(0, c.targetLevel - newLevel),
        };
      }
      return c;
    });

    const updatedProfile = {
      ...currentUser,
      competencies: updatedCompetencies,
    };

    setCurrentUser(updatedProfile);
    saveUserProfile(updatedProfile);
  };

  // Handle Assessment Completion
  const handleAssessmentCompleted = (score: number, total: number) => {
    if (!currentUser) return;
    const passed = (score / total) >= 0.6;
    if (passed) {
      const updatedProfile = {
        ...currentUser,
        cpdHoursCompleted: Math.min(currentUser.cpdHoursTarget, currentUser.cpdHoursCompleted + 2),
      };
      setCurrentUser(updatedProfile);
      saveUserProfile(updatedProfile);
    }
  };

  // If not logged in, render Auth Screen
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // If user just registered and has not completed onboarding wizard, show it immediately before dashboard
  const needsInitialOnboarding = currentUser.onboardingCompleted === false;

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-slate-800 flex flex-col font-sans selection:bg-[#1E3ABA] selection:text-white">
      
      {/* Required Post-Registration Onboarding Modal */}
      {(needsInitialOnboarding || isProfileWizardOpen) && (
        <OnboardingWizard
          currentUser={currentUser}
          isEditMode={!needsInitialOnboarding && isProfileWizardOpen}
          onComplete={handleOnboardingComplete}
          onClose={() => setIsProfileWizardOpen(false)}
        />
      )}

      {/* Top Government Navigation Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onSwitchUser={handleSwitchUser}
        onOpenProfileWizard={() => setIsProfileWizardOpen(true)}
        allDemoUsers={DEMO_USERS}
      />

      {/* Personalized Recommendation / Welcome Toast Banner */}
      {welcomeBanner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 w-full animate-fadeIn">
          <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-3 text-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E3ABA] flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#F4B400]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E3ABA] flex items-center gap-1.5 font-heading">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Profile Synchronized Successfully
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  {welcomeBanner}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('competencies');
                  setWelcomeBanner(null);
                }}
                className="px-4 py-1.5 bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>View Gaps</span>
              </button>
              <button
                type="button"
                onClick={() => setWelcomeBanner(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Applet Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-8">
        
        {/* Tab 1: Learner Dashboard */}
        {activeTab === 'dashboard' && (
          <LearnerDashboard
            currentUser={currentUser}
            allCourses={allCourses}
            allPathways={allPathways}
            onNavigate={(tab) => setActiveTab(tab)}
            onEnrollCourse={handleEnrollCourse}
            onSyncCourseProgress={handleSyncCourseProgress}
            onOpenProfileWizard={() => setIsProfileWizardOpen(true)}
            onOpenCourseModal={(course) => {
              setActiveCourseModal(course);
              setActiveTab('igot_hub');
            }}
          />
        )}

        {/* Tab 2: Competency Gap Engine & Recommendations */}
        {activeTab === 'competencies' && (
           <div className="space-y-5">
             {/* Sub-Tabs for Gap Engine vs Recommendations vs Full Matrix */}
             <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 shadow-xs overflow-x-auto">
               <button
                 type="button"
                 onClick={() => setCompetencySubTab('gap_engine')}
                 className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
                   competencySubTab === 'gap_engine'
                     ? 'bg-[#1E3ABA] text-white shadow-xs'
                     : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                 }`}
               >
                 <Target className="w-4 h-4" />
                 <span>{t('gapEngine.title', 'AI Gap Engine')}</span>
               </button>

              <button
                type="button"
                onClick={() => setCompetencySubTab('recommendations')}
                className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
                  competencySubTab === 'recommendations'
                    ? 'bg-[#1E3ABA] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#F4B400]" />
                <span>{t('gapEngine.gapDrivenPathways', 'Gap-Driven Pathways')}</span>
              </button>

              <button
                type="button"
                onClick={() => setCompetencySubTab('all_framework')}
                className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
                  competencySubTab === 'all_framework'
                    ? 'bg-[#1E3ABA] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{t('gapEngine.fullMatrix', 'Full Competency Matrix & Self-Audit')}</span>
              </button>
            </div>

            {competencySubTab === 'gap_engine' && (
              <CompetencyGapEngine
                competencies={currentUser.competencies}
                userCadre={currentUser.cadre}
                userRole={currentUser.designation}
                onLaunchQuizForCompetency={() => setActiveTab('quiz_studio')}
                onViewCourse={() => setActiveTab('igot_hub')}
                onLaunchDiagnostic={() => setActiveTab('initial_diagnostic')}
              />
            )}

            {competencySubTab === 'recommendations' && (
              <PersonalizedRecommendations
                competencies={currentUser.competencies}
                courses={allCourses}
                userWing={currentUser.department}
                userCadre={currentUser.cadre}
                onEnrollCourse={handleEnrollCourse}
                onOpenAssistant={() => setIsAssistantOpen(true)}
              />
            )}

            {competencySubTab === 'all_framework' && (
              <CompetencyExplorer
                currentUser={currentUser}
                allCourses={allCourses}
                onUpdateCompetencyLevel={handleUpdateCompetencyLevel}
                onOpenCourseModal={(course) => {
                  setActiveCourseModal(course);
                  setActiveTab('igot_hub');
                }}
                onEnrollCourse={handleEnrollCourse}
              />
            )}
          </div>
        )}

        {/* Tab 3: RAG Learning Assistant */}
        {activeTab === 'learning_assistant' && (
          <RagLearningAssistant
            userCadre={currentUser.cadre}
            userName={currentUser.name}
          />
        )}

        {/* Tab 4: AI Quiz & Assessment Studio */}
        {activeTab === 'quiz_studio' && (
          <QuizMcqStudio
            userCadre={currentUser.cadre}
            userRole={currentUser.designation}
            onPassAssessment={handleAssessmentCompleted}
          />
        )}

        {/* Tab 5: Competency Passport */}
        {activeTab === 'competency_passport' && (
          <CompetencyPassport
            currentUser={currentUser}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Tab 6: iGOT Karmayogi & TPAC Courses Hub */}
        {activeTab === 'igot_hub' && (
          <IGOTCoursesHub
            currentUser={currentUser}
            allCourses={allCourses}
            allPathways={allPathways}
            onEnrollCourse={handleEnrollCourse}
            onSyncCourseProgress={handleSyncCourseProgress}
          />
        )}

        {/* Tab 7: Virtual Statistical Sandbox & Lab */}
        {activeTab === 'stat_lab' && (
          <StatisticalLab />
        )}

        {/* Tab 8: Institutional Oversight & Workforce Intelligence */}
        {activeTab === 'admin_analytics' && (
          <AdminDashboard
            currentUser={currentUser}
          />
        )}

        {/* Tab 9: Initial 4-Pillar Skill Diagnostic Test */}
        {activeTab === 'initial_diagnostic' && (
          <InitialSkillDiagnosticTest
            currentUser={currentUser}
            onComplete={handleDiagnosticComplete}
            onCompleteDiagnostic={handleDiagnosticComplete}
            onSkip={() => setActiveTab('dashboard')}
            onNavigateToGapEngine={() => setActiveTab('gap_analysis')}
          />
        )}
      </main>

      {/* Karmayogi Sahayak AI Mentor Drawer */}
      <KarmayogiAssistant
        currentUser={currentUser}
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Official Government Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-heading">StatSkill AI & Sankhyiki Karmayogi</span>
            <span>•</span>
            <span>National Statistical Systems Training Academy (NSSTA)</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Ministry of Statistics & Programme Implementation (MoSPI)</span>
            <span>•</span>
            <span>Mission Karmayogi (DoPT)</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">iGOT API Synced</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
