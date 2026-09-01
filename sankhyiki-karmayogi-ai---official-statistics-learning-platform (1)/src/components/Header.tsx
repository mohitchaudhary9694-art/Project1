import React from 'react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  BookOpen, 
  FlaskConical, 
  BarChart3, 
  Bot, 
  Clock, 
  CheckCircle2, 
  UserCog, 
  FileCheck, 
  Target, 
  Building2 
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onOpenAssistant: () => void;
  onSwitchUser: (user: UserProfile) => void;
  onOpenProfileWizard?: () => void;
  allDemoUsers: UserProfile[];
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenAssistant,
  onSwitchUser,
  onOpenProfileWizard,
  allDemoUsers,
}) => {
  const { t } = useLanguage();
  const cpdProgress = Math.min(100, Math.round((currentUser.cpdHoursCompleted / currentUser.cpdHoursTarget) * 100));

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard', 'Home / Dashboard'), icon: BarChart3 },
    { id: 'competencies', label: t('nav.gap_engine', 'AI Gap Engine'), icon: Target },
    { id: 'learning_assistant', label: t('nav.learning_assistant', 'RAG Assistant'), icon: Bot, badge: 'RAG' },
    { id: 'quiz_studio', label: t('nav.quiz_studio', 'Quiz Studio'), icon: FileCheck, badge: 'MCQ' },
    { id: 'competency_passport', label: t('nav.passport', 'Passport'), icon: ShieldCheck, badge: 'Verifiable' },
    { id: 'igot_hub', label: t('nav.igot_courses', 'iGOT Courses'), icon: BookOpen },
    { id: 'stat_lab', label: t('nav.stat_lab', 'Stat Lab'), icon: FlaskConical },
    { id: 'admin_analytics', label: t('nav.admin_oversight', 'Admin Oversight'), icon: Building2, badge: 'TPAC' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Tricolor Government Top Strip */}
      <div className="tricolor-strip"></div>

      {/* Top Bar: Government Identity and Profile Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-100">
        
        {/* Left: Official Emblem & Department Name */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {/* Ashoka Lion Emblem / State Emblem Vector Placeholder */}
            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1E3ABA]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" stroke="currentColor" />
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" strokeOpacity="0.3" />
                <circle cx="12" cy="12" r="3" fill="#1E3ABA" fillOpacity="0.15" />
              </svg>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#1E3ABA] tracking-wider uppercase">
                  {t('gov.india', 'Government of India • MoSPI')}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.2 border border-emerald-200 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {t('mission.karmayogi', 'Mission Karmayogi')}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-heading">
                  Sankhyiki Karmayogi <span className="text-[#1E3ABA] italic font-normal">AI</span>
                </h1>
                <span className="text-xs text-slate-500 font-devanagari hidden sm:inline">
                  (सांख्यिकी कर्मयोगी)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5 hidden lg:block">
                National Statistical Systems Training Academy (NSSTA) • Official Capacity Portal
              </p>
            </div>
          </div>

          {/* Mobile Right Action Icons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAssistant}
              className="p-1.5 rounded-full bg-[#1E3ABA] text-white text-xs flex items-center gap-1 font-medium shadow-xs"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{t('btn.sahayak', 'Sahayak')}</span>
            </button>
            {onOpenProfileWizard && (
              <button
                type="button"
                onClick={onOpenProfileWizard}
                className="p-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs"
                title="Profile"
              >
                <UserCog className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Center: Live iGOT Synced & Cloud Sync Status */}
        <div className="hidden xl:flex items-center gap-3 text-xs bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>iGOT Karmayogi Synced</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-[#1E3ABA]">
            <Clock className="w-3.5 h-3.5 text-[#1E3ABA]" />
            <span className="text-slate-600">Annual Target:</span>
            <span className="font-bold text-slate-900">{currentUser.cpdHoursCompleted} / {currentUser.cpdHoursTarget} hrs</span>
            <div className="w-14 bg-slate-200 rounded-full h-1.5 overflow-hidden ml-1">
              <div 
                className="bg-[#1E3ABA] h-full rounded-full transition-all"
                style={{ width: `${cpdProgress}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-semibold text-slate-500">{cpdProgress}%</span>
          </div>
        </div>

        {/* Right: Sahayak AI, & Profile */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Solid Primary-Blue Karmayogi Sahayak Pill Button */}
          <button
            type="button"
            onClick={onOpenAssistant}
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs font-semibold transition shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>{t('btn.sahayak', 'Karmayogi Sahayak (AI)')}</span>
          </button>

          {/* Officer Profile Badge & Cadre Switcher */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
            <button
              type="button"
              onClick={onOpenProfileWizard}
              title="Click to view profile"
              className="w-7 h-7 rounded-full bg-[#1E3ABA] text-white font-bold text-xs flex items-center justify-center shadow-xs"
            >
              {currentUser.name.charAt(0)}
            </button>
            
            <div className="text-left hidden sm:block">
              <button
                type="button"
                onClick={onOpenProfileWizard}
                className="text-xs font-bold text-slate-900 leading-tight hover:text-[#1E3ABA] text-left block"
              >
                {currentUser.name.split(',')[0]}
              </button>
              <div className="text-[10px] text-slate-500 leading-none">
                {currentUser.cadre} • {currentUser.department}
              </div>
            </div>

            {/* Quick Profile Dropdown Switcher */}
            <select
              title="Switch Cadre Officer Profile"
              value={currentUser.id}
              onChange={(e) => {
                const selected = allDemoUsers.find(u => u.id === e.target.value);
                if (selected) onSwitchUser(selected);
              }}
              className="bg-white text-slate-700 border border-slate-200 text-[11px] rounded-md px-1.5 py-0.5 focus:outline-none focus:border-[#1E3ABA] cursor-pointer"
            >
              {allDemoUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.cadre} - {u.name.split(',')[0]} ({u.role})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onLogout}
              title={t('btn.logout', 'Sign Out')}
              className="p-1 rounded-full text-slate-400 hover:text-[#E63946] hover:bg-red-50 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Horizontal Navigation Bar with Amber Underline for Active Links */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1 scrollbar-none border-t border-slate-100">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium whitespace-nowrap transition cursor-pointer relative border-b-2 ${
                isActive
                  ? 'border-[#F4B400] text-[#1E3ABA] font-bold bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1E3ABA]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                  isActive
                    ? 'bg-[#1E3ABA] text-white'
                    : item.badge === 'TPAC'
                    ? 'bg-blue-100 text-[#1E3ABA]'
                    : item.badge === 'Verifiable'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

