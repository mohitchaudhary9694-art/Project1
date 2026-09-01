import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { APP_TRANSLATIONS, SupportedLanguage } from '../data/translations';

export type { SupportedLanguage };

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
];

export interface LegacyTranslations {
  [key: string]: {
    en: string;
    hi: string;
    pa: string;
  };
}

export const LEGACY_TRANSLATIONS: LegacyTranslations = {
  // Brand & Header
  'gov.india': {
    en: 'Government of India • MoSPI',
    hi: 'भारत सरकार • सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय',
    pa: 'ਭਾਰਤ ਸਰਕਾਰ • ਅੰਕੜਾ ਅਤੇ ਪ੍ਰੋਗਰਾਮ ਲਾਗੂਕਰਨ ਮੰਤਰਾਲਾ',
  },
  'mission.karmayogi': {
    en: 'Mission Karmayogi',
    hi: 'मिशन कर्मयोगी',
    pa: 'ਮਿਸ਼ਨ ਕਰਮਯੋਗੀ',
  },
  'app.name': {
    en: 'Sankhyiki Karmayogi AI',
    hi: 'सांख्यिकी कर्मयोगी एआई',
    pa: 'ਸਾਂਖਿਅਕੀ ਕਰਮਯੋਗੀ ਏਆਈ',
  },
  'app.subtitle': {
    en: 'AI Competency Intelligence Platform for India’s Official Statistical System',
    hi: 'भारत की आधिकारिक सांख्यिकी प्रणाली हेतु एआई-सक्षम क्षमता संवर्धन मंच',
    pa: 'ਭਾਰਤ ਦੀ ਅਧਿਕਾਰਤ ਅੰਕੜਾ ਪ੍ਰਣਾਲੀ ਲਈ ਏਆਈ-ਸਮਰੱਥ ਸਮਰੱਥਾ ਨਿਰਮਾਣ ਪਲੇਟਫਾਰਮ',
  },
  'tagline.headline': {
    en: 'Turn Learning Into Demonstrated Competency',
    hi: 'अध्ययन को सिद्ध दक्षता और व्यवहारिक क्षमता में बदलें',
    pa: 'ਸਿੱਖਿਆ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਯੋਗਤਾ ਵਿੱਚ ਬਦਲੋ',
  },
  'tagline.sub': {
    en: 'AI-powered personalized capacity building for India’s Official Statistical System.',
    hi: 'भारत की आधिकारिक सांख्यिकी प्रणाली के लिए एआई-संचालित व्यक्तिगत क्षमता संवर्धन।',
    pa: 'ਭਾਰਤ ਦੀ ਅਧਿਕਾਰਤ ਅੰਕੜਾ ਪ੍ਰਣਾਲੀ ਲਈ ਏਆਈ-ਅਧਾਰਿਤ ਸਮਰੱਥਾ ਨਿਰਮਾਣ।',
  },

  // Stepper
  'stepper.learn': {
    en: 'Learn',
    hi: 'सीखें (Learn)',
    pa: 'ਸਿੱਖੋ (Learn)',
  },
  'stepper.practice': {
    en: 'Practice',
    hi: 'अभ्यास करें (Practice)',
    pa: 'ਅਭਿਆਸ (Practice)',
  },
  'stepper.prove': {
    en: 'Prove',
    hi: 'प्रमाणित करें (Prove)',
    pa: 'ਸਾਬਤ ਕਰੋ (Prove)',
  },
  'stepper.grow': {
    en: 'Grow',
    hi: 'विकास करें (Grow)',
    pa: 'ਤਰੱਕੀ (Grow)',
  },

  // Navigation
  'nav.dashboard': {
    en: 'Home / Dashboard',
    hi: 'होम / डैशबोर्ड',
    pa: 'ਹੋਮ / ਡੈਸ਼ਬੋਰਡ',
  },
  'nav.gap_engine': {
    en: 'AI Gap Engine',
    hi: 'क्षमता अंतराल इंजन',
    pa: 'ਸਮਰੱਥਾ ਗੈਪ ਇੰਜਣ',
  },
  'nav.learning_assistant': {
    en: 'RAG Assistant',
    hi: 'आरएजी सहायक (RAG)',
    pa: 'ਆਰਏਜੀ ਸਹਾਇਕ (RAG)',
  },
  'nav.quiz_studio': {
    en: 'Quiz Studio',
    hi: 'प्रश्नोत्तरी स्टूडियो',
    pa: 'ਕੁਇਜ਼ ਸਟੂਡੀਓ',
  },
  'nav.passport': {
    en: 'Competency Passport',
    hi: 'क्षमता पासपोर्ट',
    pa: 'ਸਮਰੱਥਾ ਪਾਸਪੋਰਟ',
  },
  'nav.igot_courses': {
    en: 'iGOT Courses',
    hi: 'आईजीओटी पाठ्यक्रम',
    pa: 'iGOT ਕੋਰਸ',
  },
  'nav.stat_lab': {
    en: 'Stat What-If Lab',
    hi: 'सांख्यिकी वॉट-इफ लैब',
    pa: 'ਸਟੈਟ ਲੈਬ',
  },
  'nav.admin_oversight': {
    en: 'Admin Oversight',
    hi: 'प्रशासनिक डैशबोर्ड',
    pa: 'ਪ੍ਰਬੰਧਕੀ ਓਵਰਸਾਈਟ',
  },
  'nav.initial_diagnostic': {
    en: 'Diagnostic Baseline',
    hi: 'आरंभिक नैदानिक परीक्षण',
    pa: 'ਸ਼ੁਰੂਆਤੀ ਡਾਇਗਨੋਸਟਿਕ ਟੈਸਟ',
  },

  // Buttons
  'btn.sahayak': {
    en: 'Karmayogi Sahayak (AI)',
    hi: 'कर्मयोगी सहायक (एआई)',
    pa: 'ਕਰਮਯੋਗੀ ਸਹਾਇਕ (ਏਆਈ)',
  },
  'btn.logout': {
    en: 'Sign Out',
    hi: 'लॉग आउट',
    pa: 'ਸਾਈਨ ਆਊਟ',
  },
  'btn.switch_cadre': {
    en: 'Switch Role / Cadre',
    hi: 'कैडर / भूमिका बदलें',
    pa: 'ਭੂਮਿਕਾ / ਕੈਡਰ ਬਦਲੋ',
  },
  'btn.cpd_hours': {
    en: 'CPD Hours',
    hi: 'सीपीडी घंटे',
    pa: 'ਸੀਪੀਡੀ ਘੰਟੇ',
  },
  'btn.launch_diagnostic': {
    en: 'Launch Diagnostic Assessment',
    hi: 'नैदानिक परीक्षण आरंभ करें',
    pa: 'ਡਾਇਗਨੋਸਟਿਕ ਟੈਸਟ ਸ਼ੁਰੂ ਕਰੋ',
  },
  'btn.retake_diagnostic': {
    en: 'Retake Diagnostic Assessment',
    hi: 'पुनः नैदानिक परीक्षण दें',
    pa: 'ਦੁਬਾਰਾ ਡਾਇਗਨੋਸਟਿਕ ਟੈਸਟ ਲਓ',
  },

  // Competency
  'comp.required_level': {
    en: 'Required Level',
    hi: 'आवश्यक स्तर',
    pa: 'ਲੋੜੀਂਦਾ ਪੱਧਰ',
  },
  'comp.current_level': {
    en: 'Current Level',
    hi: 'वर्तमान स्तर',
    pa: 'ਮੌਜੂਦਾ ਪੱਧਰ',
  },
  'comp.gap': {
    en: 'Competency Gap',
    hi: 'क्षमता अंतराल',
    pa: 'ਸਮਰੱਥਾ ਅੰਤਰਾਲ',
  },
  'comp.priority': {
    en: 'Priority',
    hi: 'प्राथमिकता',
    pa: 'ਤਰਜੀਹ',
  },
  'comp.priority_high': {
    en: 'HIGH PRIORITY',
    hi: 'उच्च प्राथमिकता',
    pa: 'ਉੱਚ ਤਰਜੀਹ',
  },
  'comp.priority_med': {
    en: 'MEDIUM PRIORITY',
    hi: 'मध्यम प्राथमिकता',
    pa: 'ਦਰਮਿਆਨੀ ਤਰਜੀਹ',
  },
  'comp.priority_low': {
    en: 'LOW PRIORITY',
    hi: 'निम्न प्राथमिकता',
    pa: 'ਘੱਟ ਤਰਜੀਹ',
  },
  'comp.status_open': {
    en: 'Gap Open',
    hi: 'अंतराल खुला',
    pa: 'ਗੈਪ ਓਪਨ',
  },
  'comp.status_in_progress': {
    en: 'In Progress',
    hi: 'प्रगति में',
    pa: 'ਪ੍ਰਗਤੀ ਅਧੀਨ',
  },
  'comp.status_closed': {
    en: 'Gap Closed ✓',
    hi: 'अंतराल समाप्त ✓ (Gap Closed)',
    pa: 'ਗੈਪ ਸਮਾਪਤ ✓ (Gap Closed)',
  },
  'comp.evidence': {
    en: 'Evidence of Competency',
    hi: 'दक्षता का साक्ष्य एवं प्रमाण',
    pa: 'ਸਮਰੱਥਾ ਦਾ ਸਬੂਤ',
  },
  'comp.recommended_intervention': {
    en: 'Recommended Intervention',
    hi: 'अनुशंसित प्रशिक्षण हस्तक्षेप',
    pa: 'ਸਿਫਾਰਸ਼ ਕੀਤਾ ਸਿਖਲਾਈ ਦਖਲ',
  },
  'comp.verified_competency': {
    en: 'VERIFIED COMPETENCY',
    hi: 'सत्यापित दक्षता',
    pa: 'ਤਸਦੀਕਸ਼ੁਦਾ ਸਮਰੱਥਾ',
  },
  'comp.closure_loop': {
    en: 'Continuous Competency Closure Engine',
    hi: 'सतत दक्षता संवर्धन एवं अंतराल निवारण चक्र',
    pa: 'ਨਿਰੰਤਰ ਸਮਰੱਥਾ ਸੁਧਾਰ ਚੱਕਰ',
  },

  // Statistical What-If Lab
  'lab.title': {
    en: 'Statistical What-If Decision Lab',
    hi: 'सांख्यिकीय वॉट-इफ निर्णय प्रयोगशाला',
    pa: 'ਅੰਕੜਾ ਵਾਟ-ਇਫ ਲੈਬ',
  },
  'lab.subtitle': {
    en: 'Practice high-stakes statistical design with safe synthetic government survey data',
    hi: 'सुरक्षित सिंथेटिक डेटा के साथ आधिकारिक सर्वेक्षणों का व्यवहारिक निर्णय अभ्यास करें',
    pa: 'ਸੁਰੱਖਿਅਤ ਸਿੰਥੈਟਿਕ ਡੇਟਾ ਨਾਲ ਸਰਕਾਰੀ ਸਰਵੇਖਣਾਂ ਦਾ ਅਭਿਆਸ ਕਰੋ',
  },
  'lab.sample_size': {
    en: 'Sample Size (n)',
    hi: 'प्रतिदर्श आकार (Sample Size)',
    pa: 'ਨਮੂਨਾ ਆਕਾਰ (Sample Size)',
  },
  'lab.sampling_method': {
    en: 'Sampling Method',
    hi: 'प्रतिचयन विधि (Sampling Method)',
    pa: 'ਨਮੂਨਾ ਵਿਧੀ (Sampling Method)',
  },
  'lab.stratification': {
    en: 'Stratification Strategy',
    hi: 'स्तरीकरण रणनीति (Stratification)',
    pa: 'ਵਰਗੀਕਰਨ ਰਣਨੀਤੀ',
  },
  'lab.non_response': {
    en: 'Non-Response Rate (%)',
    hi: 'गैर-प्रतिक्रिया दर (Non-Response Rate)',
    pa: 'ਗੈਰ-ਜਵਾਬ ਦਰ',
  },
  'lab.imputation': {
    en: 'Imputation Technique',
    hi: 'आरोपण तकनीक (Imputation Method)',
    pa: 'ਇਮਪਿਊਟੇਸ਼ਨ ਤਕਨੀਕ',
  },
  'lab.run_sim': {
    en: 'Run What-If Simulation',
    hi: 'वॉट-इफ सिमुलेशन चलाएं',
    pa: 'ਸਿਮੂਲੇਸ਼ਨ ਚਲਾਓ',
  },
  'lab.sim_results': {
    en: 'Simulated Statistical Impact & Metrics',
    hi: 'अनुकरण सांख्यिकीय प्रभाव एवं मापदंड',
    pa: 'ਸਿਮੂਲੇਟਡ ਅੰਕੜਾ ਪ੍ਰਭਾਵ',
  },
  'lab.principle_explained': {
    en: 'Statistical Principle & Causality',
    hi: 'सांख्यिकीय सिद्धांत एवं प्रभाव विश्लेषण',
    pa: 'ਅੰਕੜਾ ਸਿਧਾਂਤ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ',
  },
  'lab.competency_demonstrated': {
    en: 'Competency Demonstrated',
    hi: 'सिद्ध की गई दक्षता (Demonstrated Competency)',
    pa: 'ਪ੍ਰਮਾਣਿਤ ਸਮਰੱਥਾ',
  },

  // Quiz
  'quiz.adaptive_engine': {
    en: 'Adaptive Difficulty Engine',
    hi: 'अनुकूली कठिनाई इंजन (Adaptive Engine)',
    pa: 'ਅਡੈਪਟਿਵ ਮੁਸ਼ਕਲ ਇੰਜਣ',
  },
  'quiz.level1': {
    en: 'Level 1: Definition & Recall',
    hi: 'स्तर 1: परिभाषा एवं स्मरण',
    pa: 'ਪੱਧਰ 1: ਪਰਿਭਾਸ਼ਾ',
  },
  'quiz.level2': {
    en: 'Level 2: Conceptual Understanding',
    hi: 'स्तर 2: वैचारिक समझ',
    pa: 'ਪੱਧਰ 2: ਸੰਕਲਪਿਕ ਸਮਝ',
  },
  'quiz.level3': {
    en: 'Level 3: Practical Application',
    hi: 'स्तर 3: व्यवहारिक अनुप्रयोग',
    pa: 'ਪੱਧਰ 3: ਵਿਹਾਰਕ ਵਰਤੋਂ',
  },
  'quiz.level4': {
    en: 'Level 4: Statistical Scenario',
    hi: 'स्तर 4: सांख्यिकीय परिदृश्य',
    pa: 'ਪੱਧਰ 4: ਅੰਕੜਾ ਦ੍ਰਿਸ਼ਟੀਕੋਣ',
  },
  'quiz.level5': {
    en: 'Level 5: Executive Decision Making',
    hi: 'स्तर 5: नीतिगत निर्णय निर्माण',
    pa: 'ਪੱਧਰ 5: ਨੀਤੀਗਤ ਫੈਸਲੇ',
  },
  'mistake.analyzer_title': {
    en: 'AI Mistake & Misconception Analyzer',
    hi: 'एआई त्रुटि एवं भ्रांति विश्लेषक',
    pa: 'ਏਆਈ ਗਲਤੀ ਵਿਸ਼ਲੇਸ਼ਕ',
  },
  'mistake.weak_area': {
    en: 'Weak Area Identified',
    hi: 'पहचाना गया कमजोर क्षेत्र',
    pa: 'ਕਮਜ਼ੋਰ ਖੇਤਰ',
  },
  'mistake.observation': {
    en: 'AI Diagnostic Observation',
    hi: 'एआई नैदानिक अवलोकन',
    pa: 'ਏਆਈ ਨਿਰੀਖਣ',
  },
  'mistake.misconception': {
    en: 'Likely Root Misconception',
    hi: 'संभावित मूल वैचारिक भ्रांति',
    pa: 'ਸੰਭਾਵਿਤ ਮੂਲ ਗਲਤਫਹਿਮੀ',
  },
  'mistake.correct_answer': {
    en: 'Correct Statutory Interpretation',
    hi: 'सटीक विधिक/सांख्यिकीय व्याख्या',
    pa: 'ਸਹੀ ਵਿਆਖਿਆ',
  },
  'mistake.micro_learning': {
    en: 'Recommended Targeted Micro-Learning',
    hi: 'अनुशंसित सूक्ष्म अध्ययन कैप्सूल',
    pa: 'ਸਿਫਾਰਸ਼ ਕੀਤੀ ਮਾਈਕ੍ਰੋ ਲਰਨਿੰਗ',
  },

  // RAG
  'rag.title': {
    en: 'Trusted Statistical RAG Learning Assistant',
    hi: 'प्रमाणित सांख्यिकी आरएजी शिक्षण सहायक',
    pa: 'ਸਾਂਖਿਅਕੀ ਆਰਏਜੀ ਸਹਾਇਕ',
  },
  'rag.source_grounded': {
    en: 'Strictly Grounded in Official MoSPI & NSSTA Manuals',
    hi: 'आधिकारिक मोस्पी और एनएसएसटीए नियमावली पर आधारित',
    pa: 'ਸਰਕਾਰੀ ਮੈਨੂਅਲ ਉੱਤੇ ਅਧਾਰਿਤ',
  },
  'rag.input_placeholder': {
    en: 'Ask any question on NSS 79th Round, PLFS, CPI Base 2012, DPDPA 2023...',
    hi: 'एनएसएस 79वें दौर, पीएलएफएस, सीपीआई आधार 2012, डीपीडीपीए 2023 पर प्रश्न पूछें...',
    pa: 'ਐਨਐਸਐਸ 79ਵੇਂ ਗੇੜ, ਪੀਐਲਐਫਐਸ, ਸੀਪੀਆਈ ਜਾਂ ਡੀਪੀਡੀਪੀਏ 2023 ਬਾਰੇ ਪੁੱਛੋ...',
  },

  // Passport
  'passport.title': {
    en: 'Official Verified Competency Passport',
    hi: 'आधिकारिक सत्यापित क्षमता पासपोर्ट',
    pa: 'ਅਧਿਕਾਰਤ ਸਮਰੱਥਾ ਪਾਸਪੋਰਟ',
  },
  'passport.cert_badge': {
    en: 'Verified Competency Credential',
    hi: 'सत्यापित सांख्यिकी क्षमता प्रमाण-पत्र',
    pa: 'ਤਸਦੀਕਸ਼ੁਦਾ ਸਮਰੱਥਾ ਸਰਟੀਫਿਕੇਟ',
  },
  'passport.qr_verify': {
    en: 'Scan QR to Verify on MoSPI Portal',
    hi: 'मोस्पी पोर्टल पर प्रामाणिकता जांचने हेतु क्यूआर स्कैन करें',
    pa: 'ਕਿਊਆਰ ਕੋਡ ਸਕੈਨ ਕਰਕੇ ਪੁਸ਼ਟੀ ਕਰੋ',
  },
  'passport.cert_id': {
    en: 'Certificate ID',
    hi: 'प्रमाणपत्र संख्या',
    pa: 'ਸਰਟੀਫਿਕੇਟ ਆਈਡੀ',
  },
  'passport.evidence_status': {
    en: 'Evidence Status: 100% Cryptographically Verified',
    hi: 'साक्ष्य स्थिति: 100% प्रामाणिक रूप से सत्यापित',
    pa: 'ਸਬੂਤ ਸਥਿਤੀ: 100% ਪ੍ਰਮਾਣਿਤ',
  },

  // Dashboard
  'dash.competency_index': {
    en: 'Overall Competency Index',
    hi: 'समग्र दक्षता सूचकांक',
    pa: 'ਸਮੁੱਚਾ ਸਮਰੱਥਾ ਸੂਚਕਾਂਕ',
  },
  'dash.active_gaps': {
    en: 'Active Skill Gaps',
    hi: 'सक्रिय क्षमता अंतराल',
    pa: 'ਸਰਗਰਮ ਗੈਪ',
  },
  'dash.closed_gaps': {
    en: 'Competencies Closed',
    hi: 'पूर्ण रूप से बंद अंतराल',
    pa: 'ਪੂਰੇ ਕੀਤੇ ਗਏ ਗੈਪ',
  },
  'dash.missions_completed': {
    en: 'Statistical Missions Passed',
    hi: 'सफल सांख्यिकीय मिशन',
    pa: 'ਮਿਸ਼ਨ ਪੂਰੇ ਕੀਤੇ',
  },
  'dash.recommended_courses': {
    en: 'Personalized iGOT Recommendations',
    hi: 'व्यक्तिगत आईजीओटी पाठ्यक्रम अनुशंसाएं',
    pa: 'ਨਿੱਜੀ iGOT ਕੋਰਸ ਸਿਫਾਰਸ਼ਾਂ',
  },
  'dash.radar_title': {
    en: '4-Pillar Official Competency Radar',
    hi: '4-स्तंभ आधिकारिक क्षमता रडार',
    pa: '4-ਥੰਮ ਸਮਰੱਥਾ ਰਾਡਾਰ',
  },
  'dash.recent_activity': {
    en: 'Recent Competency Evidence Stream',
    hi: 'हालिया क्षमता साक्ष्य विवरण',
    pa: 'ਤਾਜ਼ਾ ਸਮਰੱਥਾ ਸਬੂਤ',
  },

  // Buttons
  'btn.start_learning': {
    en: 'Start Learning',
    hi: 'अध्ययन आरंभ करें',
    pa: 'ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ',
  },
  'btn.practice_in_lab': {
    en: 'Practice in What-If Lab',
    hi: 'वॉट-इफ लैब में अभ्यास करें',
    pa: 'ਲੈਬ ਵਿੱਚ ਅਭਿਆਸ ਕਰੋ',
  },
  'btn.take_assessment': {
    en: 'Take Adaptive Assessment',
    hi: 'अनुकूली मूल्यांकन दें',
    pa: 'ਮੁਲਾਂਕਣ ਲਓ',
  },
  'btn.view_passport': {
    en: 'View Competency Passport',
    hi: 'क्षमता पासपोर्ट देखें',
    pa: 'ਪਾਸਪੋਰਟ ਦੇਖੋ',
  },
  'btn.generate_mcq': {
    en: 'Generate MCQs from Document',
    hi: 'दस्तावेज़ से प्रश्नोत्तरी तैयार करें',
    pa: 'ਦਸਤਾਵੇਜ਼ ਤੋਂ ਕੁਇਜ਼ ਬਣਾਓ',
  },
  'btn.view_all_gaps': {
    en: 'Explore AI Gap Engine',
    hi: 'क्षमता अंतराल इंजन देखें',
    pa: 'ਸਮਰੱਥਾ ਗੈਪ ਇੰਜਣ ਦੇਖੋ',
  },
  'btn.download_cert': {
    en: 'Download Verified Certificate',
    hi: 'सत्यापित प्रमाणपत्र डाउनलोड करें',
    pa: 'ਸਰਟੀਫਿਕੇਟ ਡਾਊਨਲੋਡ ਕਰੋ',
  },
  'btn.cancel': {
    en: 'Cancel',
    hi: 'रद्द करें',
    pa: 'ਰੱਦ ਕਰੋ',
  },
  'btn.close': {
    en: 'Close',
    hi: 'बंद करें',
    pa: 'ਬੰਦ ਕਰੋ',
  },
  'btn.save': {
    en: 'Save Changes',
    hi: 'परिवर्तन सहेजें',
    pa: 'ਤਬਦੀਲੀਆਂ ਸੰਭਾਲੋ',
  },
};

export const TRANSLATIONS = LEGACY_TRANSLATIONS;

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  supportedLanguages: LanguageOption[];
  currentLanguageDetails: LanguageOption;
  isHindi: boolean;
  isPunjabi: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'statskill_ai_selected_language';

function resolveNestedKey(obj: any, keyPath: string): string | undefined {
  if (!obj) return undefined;
  if (typeof obj[keyPath] === 'string') return obj[keyPath];

  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  const setLanguage = (_lang: SupportedLanguage) => {
    setLanguageState('en');
    try {
      localStorage.setItem(STORAGE_KEY, 'en');
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'en');
    } catch {
      // ignore
    }
    document.documentElement.lang = 'en';
  }, []);

  const t = (key: string, fallback?: string): string => {
    // 1. Try APP_TRANSLATIONS in active language
    const currentLangDict = APP_TRANSLATIONS[language];
    if (currentLangDict) {
      const found = resolveNestedKey(currentLangDict, key);
      if (found) return found;
    }

    // 2. Try LEGACY_TRANSLATIONS
    const legacyItem = LEGACY_TRANSLATIONS[key];
    if (legacyItem && legacyItem[language]) {
      return legacyItem[language];
    }

    // 3. Fallback to English in APP_TRANSLATIONS
    const enDict = APP_TRANSLATIONS.en;
    if (enDict) {
      const enFound = resolveNestedKey(enDict, key);
      if (enFound) return enFound;
    }

    // 4. Fallback to English in LEGACY_TRANSLATIONS
    if (legacyItem && legacyItem.en) {
      return legacyItem.en;
    }

    return fallback || key;
  };

  const currentLanguageDetails =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    supportedLanguages: SUPPORTED_LANGUAGES,
    currentLanguageDetails,
    isHindi: language === 'hi',
    isPunjabi: language === 'pa',
    isEnglish: language === 'en',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
