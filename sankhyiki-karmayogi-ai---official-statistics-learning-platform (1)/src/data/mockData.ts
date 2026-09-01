import { 
  CompetencyItem, 
  iGOTCourse, 
  LearningPathway, 
  UserProfile, 
  AdminAnalytics, 
  GeneratedAssessment, 
  LearningDocument,
  DepartmentWing,
  CapacitySimulationResult,
  EvidenceLog,
  CompetencyPassportData,
  RoleDigitalTwin
} from '../types';

export const INITIAL_COMPETENCIES: CompetencyItem[] = [
  // Statistical Competencies
  {
    id: 'comp_stat_1',
    name: 'Survey Design & Multi-Stage Sampling',
    category: 'statistical',
    description: 'Design of complex nationwide sample surveys, stratified multi-stage cluster sampling, and weight estimation (NSSO framework).',
    targetLevel: 4,
    currentLevel: 3,
    gap: 1,
    priority: 'high',
    subSkills: ['Stratified Sampling', 'Probability Proportional to Size (PPS)', 'Multiplier & Weight Formulation', 'Non-sampling Error Controls'],
    recommendedCourseIds: ['igot_stat_101', 'igot_stat_104'],
  },
  {
    id: 'comp_stat_2',
    name: 'System of National Accounts (SNA 2008) & GDP Compilation',
    category: 'statistical',
    description: 'Compilation of Gross Value Added (GVA), Gross Domestic Product (GDP), Input-Output Tables, and Sequence of Accounts.',
    targetLevel: 5,
    currentLevel: 3,
    gap: 2,
    priority: 'critical',
    subSkills: ['Institutional Sector Classification', 'Supply and Use Tables (SUT)', 'Deflators & Constant Price Estimation', 'MCA-21 Enterprise Data Integration'],
    recommendedCourseIds: ['igot_stat_102', 'igot_tpac_201'],
  },
  {
    id: 'comp_stat_3',
    name: 'Price Statistics & Index Numbers (CPI / WPI / IIP)',
    category: 'statistical',
    description: 'Compilation methodologies, Laspeyres / Fisher index formulation, item basket weighting, and quality adjustments.',
    targetLevel: 4,
    currentLevel: 4,
    gap: 0,
    priority: 'low',
    subSkills: ['Geometric Mean Weighting', 'Hedonic Price Adjustments', 'Item Substitution Rules', 'Base Year Revision Mechanics'],
    recommendedCourseIds: ['igot_stat_103'],
  },
  {
    id: 'comp_stat_4',
    name: 'Labour & Employment Statistics (PLFS Framework)',
    category: 'statistical',
    description: 'Periodic Labour Force Survey concepts, Usual Principal & Subsidiary Status (UPSS), Current Weekly Status (CWS), and Worker Population Ratio.',
    targetLevel: 4,
    currentLevel: 2,
    gap: 2,
    priority: 'critical',
    subSkills: ['CWS/UPSS Labour Force Classification', 'Informal Economy Estimation', 'Sampling Variance in Quarterly Estimates'],
    recommendedCourseIds: ['igot_stat_105', 'igot_tpac_203'],
  },
  {
    id: 'comp_stat_5',
    name: 'National Quality Assurance Framework (NQAF) & Data Audits',
    category: 'statistical',
    description: 'UN-NQAF and MoSPI Quality Guidelines for official microdata, metadata documentation (DDI/SDMX), and statistical confidentiality.',
    targetLevel: 4,
    currentLevel: 3,
    gap: 1,
    priority: 'medium',
    subSkills: ['SDMX Metadata Structuring', 'Imputation Diagnostics', 'Confidentiality Protection', 'Relevance & Timeliness Metrics'],
    recommendedCourseIds: ['igot_stat_106'],
  },
  {
    id: 'comp_stat_6',
    name: 'SDG Indicators & Environmental-Economic Accounting (SEEA)',
    category: 'statistical',
    description: 'Monitoring 330+ National Indicator Framework (NIF) metrics and Natural Capital Accounting (SEEA).',
    targetLevel: 3,
    currentLevel: 2,
    gap: 1,
    priority: 'medium',
    subSkills: ['National Indicator Framework (NIF)', 'Ecosystem Extent & Condition Accounts', 'Data Disaggregation Standards'],
    recommendedCourseIds: ['igot_stat_107'],
  },

  // Technical Competencies
  {
    id: 'comp_tech_1',
    name: 'Python for Official Statistics & Large Microdata',
    category: 'technical',
    description: 'Processing massive NSSO / PLFS unit-level microdata with Pandas, Polars, NumPy, and automated tabulations.',
    targetLevel: 4,
    currentLevel: 2,
    gap: 2,
    priority: 'critical',
    subSkills: ['Microdata Wrangling', 'Sampling Weights Application', 'Automated Report Pipelines', 'Parallel Processing'],
    recommendedCourseIds: ['igot_tech_301', 'igot_tpac_202'],
  },
  {
    id: 'comp_tech_2',
    name: 'R & Advanced Statistical Modeling',
    category: 'technical',
    description: 'Survey analysis packages (survey, srvyr), time-series seasonal adjustment (X-13ARIMA-SEATS), and econometric regression.',
    targetLevel: 4,
    currentLevel: 3,
    gap: 1,
    priority: 'high',
    subSkills: ['Complex Survey Design in R', 'Seasonal Adjustments', 'Generalized Linear Models', 'R Markdown Automated Publishing'],
    recommendedCourseIds: ['igot_tech_302'],
  },
  {
    id: 'comp_tech_3',
    name: 'SQL & Relational Database Engineering for Registries',
    category: 'technical',
    description: 'Querying statistical business registers, administrative data matching, window functions, and enterprise data linkage.',
    targetLevel: 4,
    currentLevel: 4,
    gap: 0,
    priority: 'low',
    subSkills: ['Complex Joins & Fuzzy Matching', 'Window Functions', 'Query Optimization', 'ETL Data Pipelines'],
    recommendedCourseIds: ['igot_tech_303'],
  },
  {
    id: 'comp_tech_4',
    name: 'GIS, Remote Sensing & Geo-Statistical Analytics',
    category: 'technical',
    description: 'Spatial sampling, satellite imagery for crop yield estimation (FASAL framework), and administrative boundary mapping.',
    targetLevel: 3,
    currentLevel: 1,
    gap: 2,
    priority: 'critical',
    subSkills: ['QGIS / ArcGIS Vector Analysis', 'NDVI Satellite Index Extraction', 'Spatial Autocorrelation (Moran\'s I)', 'Geo-tagging Validation'],
    recommendedCourseIds: ['igot_tech_304', 'igot_tpac_204'],
  },
  {
    id: 'comp_tech_5',
    name: 'AI, Machine Learning & NLP for Unstructured Government Data',
    category: 'technical',
    description: 'Automated classification of industry (NIC codes) and occupation (NCO codes), text mining of enterprise reports, and anomaly detection in returns.',
    targetLevel: 4,
    currentLevel: 1,
    gap: 3,
    priority: 'critical',
    subSkills: ['Automated NIC/NCO Classification', 'LLMs for Document Summarization', 'Outlier Detection in Survey Data', 'Predictive Modeling'],
    recommendedCourseIds: ['igot_tech_305', 'igot_tpac_205'],
  },

  // Digital Governance Competencies
  {
    id: 'comp_gov_1',
    name: 'Data Privacy & Digital Personal Data Protection (DPDPA 2023)',
    category: 'digital_governance',
    description: 'Compliance with India\'s DPDPA 2023, statistical anonymization, differential privacy, and Consent Management Architecture.',
    targetLevel: 5,
    currentLevel: 3,
    gap: 2,
    priority: 'critical',
    subSkills: ['Anonymization & Pseudonymization', 'Data Principal Rights Handling', 'Consent Management in Field Surveys', 'Audit Logging'],
    recommendedCourseIds: ['igot_gov_401'],
  },
  {
    id: 'comp_gov_2',
    name: 'Cybersecurity & Government MeghRaj Cloud Best Practices',
    category: 'digital_governance',
    description: 'CERT-In guidelines, secure API integration, role-based encryption, and safe handling of sensitive economic registries.',
    targetLevel: 4,
    currentLevel: 3,
    gap: 1,
    priority: 'medium',
    subSkills: ['Zero Trust Principles', 'Secure API Keys Management', 'Data at Rest/Transit Encryption', 'Vulnerability Assessment'],
    recommendedCourseIds: ['igot_gov_402'],
  },
  {
    id: 'comp_gov_3',
    name: 'National Data & Analytics Platform (NDAP) & Open Data Standards',
    category: 'digital_governance',
    description: 'Interoperability schemas, API publishing, metadata discoverability, and data dissemination on data.gov.in and NDAP.',
    targetLevel: 4,
    currentLevel: 4,
    gap: 0,
    priority: 'low',
    subSkills: ['API Schema Standards', 'FAIR Data Principles', 'Data Dissemination Guidelines'],
    recommendedCourseIds: ['igot_gov_403'],
  },

  // Managerial & Behavioural Competencies
  {
    id: 'comp_mgmt_1',
    name: 'Statistical Leadership & Inter-Ministerial Coordination',
    category: 'managerial',
    description: 'Leading technical working groups, coordinating with line ministries (RBI, Finance, Agriculture), and translating data into policy briefs.',
    targetLevel: 4,
    currentLevel: 3,
    gap: 1,
    priority: 'high',
    subSkills: ['Policy Translation', 'Inter-Agency Data Harmonization', 'Technical Committee Leadership', 'Stakeholder Communication'],
    recommendedCourseIds: ['igot_mgmt_501'],
  },
  {
    id: 'comp_mgmt_2',
    name: 'Field Survey Project Management & CAPI Operations',
    category: 'managerial',
    description: 'Supervision of Computer-Assisted Personal Interviewing (CAPI), enumerator quality checks, logistics, and real-time dashboard monitoring.',
    targetLevel: 4,
    currentLevel: 4,
    gap: 0,
    priority: 'low',
    subSkills: ['CAPI Tablet Management', 'Field Scrutiny Rules', 'Enumerator Performance Tracking', 'Conflict Resolution in Field'],
    recommendedCourseIds: ['igot_mgmt_502'],
  },
  {
    id: 'comp_mgmt_3',
    name: 'Data Ethics, Scientific Integrity & Public Trust',
    category: 'managerial',
    description: 'Adherence to UN Fundamental Principles of Official Statistics, objective statistical reporting, and ethical crisis communication.',
    targetLevel: 5,
    currentLevel: 4,
    gap: 1,
    priority: 'medium',
    subSkills: ['UN Fundamental Principles', 'Handling Revisions & Discrepancies', 'Conflict of Interest Management'],
    recommendedCourseIds: ['igot_mgmt_503'],
  },
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr_iss_01',
    name: 'Dr. Rajeshwar Sharma, ISS',
    email: 'rajeshwar.sharma@gov.in',
    govEmployeeId: 'ISS/2014/1042',
    designation: 'Director (National Accounts Division)',
    cadre: 'ISS',
    department: 'NAD',
    currentAssignment: 'Compilation of Annual & Quarterly GDP Estimates, Supply-Use Tables (SUT) & Base Revision 2020-21',
    experienceYears: 12,
    education: 'Ph.D. in Econometrics, M.Stat (Indian Statistical Institute)',
    role: 'learner',
    cpdHoursCompleted: 34,
    cpdHoursTarget: 50,
    completedTrainings: ['Advanced National Accounts (IMF)', 'SNA 2008 Implementation Workshop (NSSTA)'],
    enrolledCourseIds: ['igot_stat_102', 'igot_tech_301', 'igot_tech_305', 'igot_gov_401'],
    competencies: INITIAL_COMPETENCIES,
    careerGoal: 'Transition to Senior Deputy Director General & lead AI-enabled macro-economic forecasting unit.',
    mfaEnabled: true,
    onboardingCompleted: true,
    diagnosticCompleted: true,
    onboardingData: {
      education: {
        highestQualification: "PhD",
        fieldOfStudy: 'Econometrics & Statistics',
        institutionName: 'Indian Statistical Institute (ISI) Kolkata',
      },
      experience: {
        currentRole: 'Director (National Accounts Division)',
        organization: 'National Accounts Division (NAD), MoSPI',
        experienceYearsRange: '10+',
        experienceYearsNum: 12,
        areasOfWork: ['Statistical Analysis', 'Policy Research', 'Survey Design'],
      },
      trainingHistory: [
        { courseName: 'Advanced National Accounts (IMF)' },
        { courseName: 'SNA 2008 Implementation Workshop (NSSTA)' },
      ],
      skills: [
        { name: 'R Programming', level: 'Advanced' },
        { name: 'Python for Data Science', level: 'Intermediate' },
        { name: 'Sampling & Multipliers', level: 'Advanced' },
        { name: 'Official Report Writing', level: 'Advanced' },
      ],
    },
  },
  {
    id: 'usr_sss_02',
    name: 'Ananya Sengupta, SSS',
    email: 'ananya.sengupta@mospi.gov.in',
    govEmployeeId: 'SSS/2019/3981',
    designation: 'Senior Statistical Officer (SSO)',
    cadre: 'SSS',
    department: 'FOD',
    currentAssignment: 'Field Operations Division - Periodic Labour Force Survey (PLFS) & Annual Survey of Industries (ASI) Supervision',
    experienceYears: 6,
    education: 'M.Sc. in Statistics (University of Calcutta)',
    role: 'learner',
    cpdHoursCompleted: 42,
    cpdHoursTarget: 50,
    completedTrainings: ['CAPI Field Protocol Training', 'Sampling Techniques for Household Surveys'],
    enrolledCourseIds: ['igot_stat_101', 'igot_stat_105', 'igot_tech_304'],
    competencies: INITIAL_COMPETENCIES.map(c => {
      if (c.id === 'comp_mgmt_2') return { ...c, currentLevel: 5 as const, gap: 0 };
      if (c.id === 'comp_stat_2') return { ...c, currentLevel: 2 as const, gap: 3 };
      if (c.id === 'comp_tech_4') return { ...c, currentLevel: 2 as const, gap: 1 };
      return c;
    }),
    careerGoal: 'Become a specialist in Geo-statistical field verification and automated CAPI scrutiny protocols.',
    mfaEnabled: true,
    onboardingCompleted: true,
    diagnosticCompleted: true,
    onboardingData: {
      education: {
        highestQualification: "Master's",
        fieldOfStudy: 'Statistics',
        institutionName: 'University of Calcutta',
      },
      experience: {
        currentRole: 'Senior Statistical Officer (SSO)',
        organization: 'Field Operations Division (FOD), MoSPI',
        experienceYearsRange: '6–10',
        experienceYearsNum: 6,
        areasOfWork: ['Data Collection', 'Survey Design', 'Quality Assurance'],
      },
      trainingHistory: [
        { courseName: 'CAPI Field Protocol Training' },
        { courseName: 'Sampling Techniques for Household Surveys' },
      ],
      skills: [
        { name: 'CSPro / CAPI Scrutiny', level: 'Advanced' },
        { name: 'Excel & Advanced Formulas', level: 'Advanced' },
        { name: 'SPSS', level: 'Intermediate' },
        { name: 'Survey & Questionnaire Design', level: 'Advanced' },
      ],
    },
  },
  {
    id: 'usr_admin_03',
    name: 'Vikramaditya Mehta, ISS',
    email: 'v.mehta.nssta@gov.in',
    govEmployeeId: 'ISS/2006/0491',
    designation: 'Joint Director & Training Coordinator (NSSTA)',
    cadre: 'ISS',
    department: 'NSSTA',
    currentAssignment: 'Overseeing Capacity Building, TPAC Annual Training Calendar & iGOT Karmayogi Curricula Harmonization',
    experienceYears: 18,
    education: 'M.Phil in Applied Statistics (Delhi School of Economics)',
    role: 'admin',
    cpdHoursCompleted: 48,
    cpdHoursTarget: 50,
    completedTrainings: ['Executive Leadership (LBSNAA)', 'Global Statistical Modernization (UNSD)'],
    enrolledCourseIds: ['igot_mgmt_501', 'igot_stat_106'],
    competencies: INITIAL_COMPETENCIES.map(c => ({ ...c, currentLevel: 4 as const, gap: 0 })),
    careerGoal: 'Modernize the training infrastructure across all 6 central statistical divisions and State DES units.',
    mfaEnabled: true,
    onboardingCompleted: true,
    diagnosticCompleted: true,
    onboardingData: {
      education: {
        highestQualification: "Master's",
        fieldOfStudy: 'Applied Statistics',
        institutionName: 'Delhi School of Economics',
      },
      experience: {
        currentRole: 'Joint Director & Training Coordinator',
        organization: 'National Statistical Systems Training Academy (NSSTA)',
        experienceYearsRange: '10+',
        experienceYearsNum: 18,
        areasOfWork: ['Administration', 'Policy Research', 'Statistical Analysis'],
      },
      trainingHistory: [
        { courseName: 'Executive Leadership (LBSNAA)' },
        { courseName: 'Global Statistical Modernization (UNSD)' },
      ],
      skills: [
        { name: 'Official Report Writing', level: 'Advanced' },
        { name: 'Sampling & Multipliers', level: 'Advanced' },
        { name: 'Data Visualization (Power BI / Tableau)', level: 'Intermediate' },
      ],
    },
  },
];

export const IGOT_COURSES: iGOTCourse[] = [
  {
    id: 'igot_stat_101',
    title: 'Advanced Survey Design & Multi-Stage Sampling in Official Statistics',
    provider: 'NSSTA',
    code: 'NSSTA-STAT-401',
    durationHours: 16,
    credits: 4,
    rating: 4.8,
    reviewCount: 342,
    enrolledCount: 1890,
    competencyDomain: 'statistical',
    primaryCompetency: 'Survey Design & Multi-Stage Sampling',
    level: 'Intermediate',
    format: 'Virtual Instructor-Led',
    tpacApproved: true,
    tpacRefNumber: 'TPAC-2025/MoSPI/NSSTA/042',
    description: 'Comprehensive course covering practical multi-stage stratification, circular systematic sampling, selection probability calculations, and sample weight calibration for national surveys.',
    learningObjectives: [
      'Master primary and secondary stage sampling unit formulation',
      'Compute design effects (DEFF) and intra-class correlation coefficients',
      'Handle household non-response using ratio and regression imputation methods',
      'Construct survey weighting matrices compliant with MoSPI NQAF'
    ],
    modules: [
      { title: 'Module 1: Sampling Frame Architecture & PSUs', duration: '3.5 hrs', topics: ['Urban Frame Survey (UFS) blocks', 'Census enumeration blocks', 'Frame validation'] },
      { title: 'Module 2: Multi-Stage Stratified Sampling Calculations', duration: '4.5 hrs', topics: ['Neyman allocation', 'PPS with replacement vs without replacement', 'Horvitz-Thompson estimator'] },
      { title: 'Module 3: Non-sampling Errors & Weight Calibration', duration: '4.0 hrs', topics: ['Post-stratification weighting', 'GREG estimators', 'Item non-response correction'] },
      { title: 'Module 4: Case Study - NSS 79th Round Sample Design', duration: '4.0 hrs', topics: ['Practical hands-on calculation in R & Python'] },
    ],
    skillsGained: ['Sample Allocation', 'Weight Formulation', 'Design Effect Analysis', 'Imputation Logic'],
    instructors: ['Prof. K. R. Ramanathan (ISI Kolkata)', 'Shri P. C. Mohanan (Retd. Member, NSC)'],
    bannerGradient: 'from-blue-600 to-indigo-900',
  },
  {
    id: 'igot_stat_102',
    title: 'System of National Accounts (SNA 2008) & Modern GDP Compilation',
    provider: 'MoSPI-TPAC',
    code: 'MoSPI-NAD-502',
    durationHours: 24,
    credits: 6,
    rating: 4.9,
    reviewCount: 512,
    enrolledCount: 1420,
    competencyDomain: 'statistical',
    primaryCompetency: 'System of National Accounts (SNA 2008) & GDP Compilation',
    level: 'Advanced',
    format: 'Residential Workshop',
    tpacApproved: true,
    tpacRefNumber: 'TPAC-2025/MoSPI/NAD/018',
    description: 'Master the international standards of SNA 2008. Learn institutional sector accounts, FISIM allocation, Supply-Use Tables (SUT), double deflation, and quarterly GDP estimation.',
    learningObjectives: [
      'Implement SNA 2008 sequence of accounts from production to balance sheet',
      'Utilize MCA-21 corporate e-filings for private corporate sector GVA compilation',
      'Construct 140x140 Supply and Use Tables for inter-industry modeling',
      'Apply double deflation using Producer Price Indices and CPI sub-indices'
    ],
    modules: [
      { title: 'Module 1: Foundations of SNA 2008 & Institutional Sectors', duration: '5.0 hrs', topics: ['Financial corporations', 'General government', 'NPISH', 'Household sector'] },
      { title: 'Module 2: Production Boundary & Output Valuation', duration: '6.0 hrs', topics: ['Basic prices vs Purchaser prices', 'FISIM allocation', 'R&D as Capital Formation'] },
      { title: 'Module 3: Supply and Use Tables (SUT) & Input-Output', duration: '7.0 hrs', topics: ['Matrix balancing', 'Trade and transport margins', 'CIF/FOB adjustments'] },
      { title: 'Module 4: Base Year Revision Methodologies', duration: '6.0 hrs', topics: ['Splicing techniques', 'Chain-volume measures', 'Deflator selection'] },
    ],
    skillsGained: ['SNA 2008 Sequence of Accounts', 'SUT Matrix Balancing', 'Double Deflation', 'MCA-21 Processing'],
    instructors: ['Dr. Savita Sharma (Former ADG, NAD)', 'Shri Rajiv Sharma (Senior Consultant, IMF-SARTTAC)'],
    bannerGradient: 'from-emerald-700 to-teal-950',
  },
  {
    id: 'igot_stat_103',
    title: 'Price Indices Compilation: CPI, WPI & Producer Price Index (PPI)',
    provider: 'iGOT Karmayogi',
    code: 'iGOT-ECON-312',
    durationHours: 12,
    credits: 3,
    rating: 4.7,
    reviewCount: 420,
    enrolledCount: 2600,
    competencyDomain: 'statistical',
    primaryCompetency: 'Price Statistics & Index Numbers (CPI / WPI / IIP)',
    level: 'Intermediate',
    format: 'Self-Paced e-Learning',
    tpacApproved: true,
    tpacRefNumber: 'TPAC-2024/MoSPI/ESD/089',
    description: 'Detailed analysis of consumer and wholesale price index formulations, geometric mean price relatives, item substitution, and core inflation calculation.',
    learningObjectives: [
      'Calculate elementary and higher-level aggregates using Jevons and Laspeyres indices',
      'Perform web-scraping and scanner data integration for real-time price monitoring',
      'Execute item substitution without introducing synthetic inflation spikes',
      'Re-base index series using chained linking methods'
    ],
    modules: [
      { title: 'Module 1: Elementary Aggregates & Formula Properties', duration: '3.0 hrs', topics: ['Dutot vs Jevons indices', 'Axiomatic properties', 'Sampling of varieties'] },
      { title: 'Module 2: CPI (Rural/Urban/Combined) Compilation Protocol', duration: '3.5 hrs', topics: ['Housing index imputation', 'Clothing & Footwear seasonality', 'Sub-group weighting'] },
      { title: 'Module 3: Producer Price Index (PPI) vs Wholesale Price Index', duration: '3.0 hrs', topics: ['Stage of processing', 'Service price indices', 'Input cost tracking'] },
      { title: 'Module 4: Quality Adjustment Techniques', duration: '2.5 hrs', topics: ['Hedonic regression', 'Matched model method', 'Overlapping pricing'] },
    ],
    skillsGained: ['Laspeyres & Jevons Formulation', 'Hedonic Price Adjustments', 'Index Linking', 'Core Inflation Tracking'],
    instructors: ['Shri S. V. Ramana (Director, Price Statistics Division, MoSPI)'],
    bannerGradient: 'from-amber-600 to-orange-950',
  },
  {
    id: 'igot_stat_105',
    title: 'Periodic Labour Force Survey (PLFS) Concepts & Analytical Methods',
    provider: 'NSSTA',
    code: 'NSSTA-SOC-305',
    durationHours: 14,
    credits: 3.5,
    rating: 4.8,
    reviewCount: 310,
    enrolledCount: 1650,
    competencyDomain: 'statistical',
    primaryCompetency: 'Labour & Employment Statistics (PLFS Framework)',
    level: 'Intermediate',
    format: 'Virtual Instructor-Led',
    tpacApproved: true,
    tpacRefNumber: 'TPAC-2025/MoSPI/SSD/031',
    description: 'In-depth training on labour market indicators, activity status definitions (UPSS, CWS), rotation panel designs, and computing worker participation rates.',
    learningObjectives: [
      'Differentiate between Usual Status (ps+ss) and Current Weekly Status (CWS)',
      'Analyze 4-visit rotational panel sampling in urban areas',
      'Calculate Labour Force Participation Rate (LFPR), WPR, and Unemployment Rate (UR)',
      'Interpret informal sector and gig-worker data tables'
    ],
    modules: [
      { title: 'Module 1: Labour Market Conceptual Frameworks (ILO & NSSO)', duration: '3.5 hrs', topics: ['Activity status criteria', 'Subsidiary status rules', 'Seeking/available for work tests'] },
      { title: 'Module 2: PLFS Sampling & Rotational Panel Mechanics', duration: '3.5 hrs', topics: ['Panel attrition correction', 'Quarterly estimates variance', 'Rural annual vs Urban quarterly'] },
      { title: 'Module 3: Derivation of National Indicators in Python/R', duration: '4.0 hrs', topics: ['Unit-level data analysis', 'Standard error calculation', 'Disaggregation by gender & age'] },
      { title: 'Module 4: Informal Employment & Gig Economy Measurement', duration: '3.0 hrs', topics: ['Enterprise type mapping', 'Social security benefits check', 'Platform worker diagnostics'] },
    ],
    skillsGained: ['UPSS & CWS Matrix', 'Rotational Panel Estimation', 'LFPR/WPR/UR Derivations', 'Informal Economy Analytics'],
    instructors: ['Dr. Nilanjana Das (Deputy Director General, SSD)', 'Dr. Amitabh Kundu (Chairman, Labour Statistics Expert Group)'],
    bannerGradient: 'from-cyan-700 to-blue-950',
  },
  {
    id: 'igot_tech_301',
    title: 'Python for Official Statistics: Unit-Level Microdata Processing & Automation',
    provider: 'iGOT Karmayogi',
    code: 'iGOT-DATA-402',
    durationHours: 20,
    credits: 5,
    rating: 4.9,
    reviewCount: 780,
    enrolledCount: 3450,
    competencyDomain: 'technical',
    primaryCompetency: 'Python for Official Statistics & Large Microdata',
    level: 'Intermediate',
    format: 'Hands-on Sandbox',
    tpacApproved: true,
    tpacRefNumber: 'TPAC-2025/MoSPI/DIID/014',
    description: 'Practical data science workflow for government statisticians: handling multi-gigabyte unit-level surveys, applying sampling weights, automated validation, and export to official tables.',
    learningObjectives: [
      'Load, clean, and merge complex raw text fixed-width layout NSS microdata files',
      'Apply sampling multipliers to compute national aggregates with confidence intervals',
      'Automate monthly/quarterly statistical bulletin generation using Python scripts',
      'Integrate data validation pipelines using Pydantic and Polars for fast processing'
    ],
    modules: [
      { title: 'Module 1: Python Data Science Stack Setup for MoSPI', duration: '4.0 hrs', topics: ['Pandas', 'Polars for 10M+ rows', 'NumPy vectorization', 'Jupyter Lab workflow'] },
      { title: 'Module 2: Parsing Fixed-Width & Raw Unit-Level Microdata', duration: '5.0 hrs', topics: ['Layout file parsing', 'Block-wise record merging', 'Missing value treatment'] },
      { title: 'Module 3: Survey Weighting & Multipliers Math in Code', duration: '5.0 hrs', topics: ['Household vs Person multipliers', 'Stratum-level variance', 'Sub-sample estimates'] },
      { title: 'Module 4: Building Automated Reporting Pipelines', duration: '6.0 hrs', topics: ['Automated Excel generation', 'Chart generation with Seaborn', 'CI/CD data pipelines'] },
    ],
    skillsGained: ['Polars & Pandas', 'Microdata Wrangling', 'Sampling Weights in Code', 'Automated Tabulation'],
    instructors: ['Dr. A. K. Biswas (Director, DIID)', 'Saurabh Srivastava (Lead Data Scientist, NIC-MoSPI Unit)'],
    bannerGradient: 'from-violet-700 to-purple-950',
  },
  {
    id: 'igot_tech_304',
    title: 'Geo-Spatial Statistics & Satellite Earth Observation for Agriculture (FASAL)',
    provider: 'NSSTA',
    code: 'NSSTA-GIS-415',
    durationHours: 18,
    credits: 4.5,
    rating: 4.8,
    reviewCount: 290,
    enrolledCount: 1180,
    competencyDomain: 'technical',
    primaryCompetency: 'GIS, Remote Sensing & Geo-Statistical Analytics',
    level: 'Intermediate',
    format: 'Hands-on Sandbox',
    tpacApproved: true,
    tpacRefNumber: 'TPAC-2025/MoSPI/NSSTA/077',
    description: 'Integration of Sentinel & Landsat satellite imagery with General Crop Estimation Surveys (GCES), NDVI calculation, and village boundary cadastral mapping.',
    learningObjectives: [
      'Process multispectral remote sensing bands using open source QGIS and Python rasterio',
      'Calculate Normalized Difference Vegetation Index (NDVI) for crop condition assessment',
      'Design spatial sampling schemes incorporating land use / land cover (LULC) rasters',
      'Geo-validate field survey points using GPS bounding boxes and anti-spoofing checks'
    ],
    modules: [
      { title: 'Module 1: Principles of Geo-Spatial Data in Official Surveys', duration: '4.0 hrs', topics: ['Coordinate Reference Systems (EPSG)', 'Vector vs Raster', 'Bhuvan/ISRO portals'] },
      { title: 'Module 2: Satellite Imagery Processing for Crop Statistics', duration: '5.0 hrs', topics: ['Sentinel-2 data pipelines', 'Cloud masking', 'Crop signature classification'] },
      { title: 'Module 3: Geo-Statistical Interpolation & Spatial Autocorrelation', duration: '4.5 hrs', topics: ['Kriging', 'Moran\'s I spatial test', 'Local Indicators of Spatial Association'] },
      { title: 'Module 4: Mobile CAPI Geo-Tagging & Quality Assurance', duration: '4.5 hrs', topics: ['Spatial buffer checks', 'Polygon perimeter verification', 'Real-time telemetry'] },
    ],
    skillsGained: ['QGIS & Python Rasterio', 'NDVI Extraction', 'Spatial Sampling Design', 'Geo-Telemetry Auditing'],
    instructors: ['Dr. Shailesh Nayak (Former Secretary, MoES)', 'Dr. Vinay Sehgal (Principal Scientist, IARI-ISRO Project)'],
    bannerGradient: 'from-emerald-600 to-green-950',
  },
  {
    id: 'igot_tech_305',
    title: 'AI, Machine Learning & NLP for Automated Classification in Official Statistics',
    provider: 'MoSPI-TPAC',
    code: 'MoSPI-AI-501',
    durationHours: 20,
    credits: 5,
    rating: 4.9,
    reviewCount: 460,
    enrolledCount: 1950,
    competencyDomain: 'technical',
    primaryCompetency: 'AI, Machine Learning & NLP for Unstructured Government Data',
    level: 'Advanced',
    format: 'Hands-on Sandbox',
    tpacApproved: true,
    tpacRefNumber: 'TPAC-2025/MoSPI/DIID/029',
    description: 'Harness Large Language Models and Supervised Machine Learning to automate 5-digit National Industrial Classification (NIC 2008) and National Classification of Occupations (NCO 2004) text coding.',
    learningObjectives: [
      'Build fine-tuned NLP transformers for multilingual business activity classification',
      'Deploy anomaly detection models to detect synthetic or falsified enumerator responses',
      'Utilize LLMs to summarize district-level economic indicators and policy memos',
      'Implement human-in-the-loop validation for automated survey coders'
    ],
    modules: [
      { title: 'Module 1: Machine Learning Foundations for Official Statisticians', duration: '4.0 hrs', topics: ['Scikit-learn pipelines', 'Feature engineering from survey text', 'Evaluation metrics (F1/ROC)'] },
      { title: 'Module 2: Automated NIC & NCO Semantic Text Classification', duration: '6.0 hrs', topics: ['Sentence Transformers', 'Vector embeddings', 'Hierarchical classification algorithms'] },
      { title: 'Module 3: Statistical Quality Audits & Anomaly Detection', duration: '5.0 hrs', topics: ['Isolation Forests', 'Benford\'s Law tests', 'Enumerator velocity checks'] },
      { title: 'Module 4: Generative AI & LLMs in Government Reporting', duration: '5.0 hrs', topics: ['Prompt engineering for official briefs', 'Retrieval Augmented Generation (RAG)', 'Safe AI deployment'] },
    ],
    skillsGained: ['Transformers & Embeddings', 'Automated NIC/NCO Coding', 'Anomaly Detection in Surveys', 'RAG & LLM Integration'],
    instructors: ['Dr. Mausam (Head, Yardi School of AI, IIT Delhi)', 'Dr. C. S. Mohanty (DDG, DIID, MoSPI)'],
    bannerGradient: 'from-fuchsia-700 to-purple-950',
  },
  {
    id: 'igot_gov_401',
    title: 'Digital Personal Data Protection Act (DPDPA 2023) for Statistical Organizations',
    provider: 'iGOT Karmayogi',
    code: 'iGOT-LAW-308',
    durationHours: 10,
    credits: 2.5,
    rating: 4.8,
    reviewCount: 650,
    enrolledCount: 4200,
    competencyDomain: 'digital_governance',
    primaryCompetency: 'Data Privacy & Digital Personal Data Protection (DPDPA 2023)',
    level: 'Foundation',
    format: 'Self-Paced e-Learning',
    tpacApproved: true,
    tpacRefNumber: 'TPAC-2024/MoSPI/Legal/005',
    description: 'Mandatory compliance course for all statistical officers: Data Fiduciary duties, Data Principal consent in survey enumeration, microdata anonymization, and Data Protection Board mandates.',
    learningObjectives: [
      'Understand the statutory scope of DPDPA 2023 in government statistical surveys',
      'Apply k-anonymity, l-diversity, and differential privacy to public microdata files',
      'Implement digital notice and consent workflows on CAPI tablets',
      'Establish incident reporting protocols for statistical database breaches'
    ],
    modules: [
      { title: 'Module 1: DPDPA 2023 Key Provisions & Exemption Criteria', duration: '2.5 hrs', topics: ['Data Fiduciary obligations', 'Research/statistical exemption scope (Section 17)', 'Significant Data Fiduciaries'] },
      { title: 'Module 2: Anonymization & Microdata Disclosure Control', duration: '3.0 hrs', topics: ['Direct vs indirect identifiers', 'Cell suppression in tables', 'Microdata perturbation techniques'] },
      { title: 'Module 3: Consent Protocols in Field Surveys & Registries', duration: '2.5 hrs', topics: ['Multilingual consent forms', 'Withdrawal of consent mechanisms', 'Minor/child data safeguards'] },
      { title: 'Module 4: Penalty Frameworks & Compliance Checklists', duration: '2.0 hrs', topics: ['Audit trails', 'Data Protection Officer role', 'MoSPI internal SOPs'] },
    ],
    skillsGained: ['DPDPA 2023 Legal Framework', 'Microdata Anonymization', 'Statistical Confidentiality', 'Consent Architecture'],
    instructors: ['Shri R. S. Sharma (Former CEO, NHA & DPDPA Advisory Panel)', 'Adv. Aparna Ghosh (Cyber Law Specialist, GoI)'],
    bannerGradient: 'from-slate-700 to-zinc-950',
  },
  {
    id: 'igot_mgmt_501',
    title: 'Strategic Leadership & Policy Communication for Senior Statisticians',
    provider: 'NSSTA',
    code: 'NSSTA-LDR-501',
    durationHours: 15,
    credits: 4,
    rating: 4.9,
    reviewCount: 220,
    enrolledCount: 940,
    competencyDomain: 'managerial',
    primaryCompetency: 'Statistical Leadership & Inter-Ministerial Coordination',
    level: 'Executive',
    format: 'Residential Workshop',
    tpacApproved: true,
    tpacRefNumber: 'TPAC-2025/MoSPI/NSSTA/001',
    description: 'Designed for Joint Directors, Directors, and DDGs to effectively lead multidisciplinary technical teams, communicate complex numbers to Parliament & media, and manage statistical diplomacy.',
    learningObjectives: [
      'Transform complex tabular outputs into actionable high-level policy briefs for Cabinet & NITI Aayog',
      'Manage crisis communication during macroeconomic indicator releases and base revisions',
      'Negotiate bilateral and multilateral data exchanges with international organizations (UN, IMF, World Bank)',
      'Drive agile change management during organizational digitization transitions'
    ],
    modules: [
      { title: 'Module 1: Data-Driven Policy Translation & Cabinet Notes', duration: '4.0 hrs', topics: ['Structuring executive summaries', 'Visual storytelling for ministers', 'Addressing data caveats'] },
      { title: 'Module 2: Press Conferences & Media Communication on Statistics', duration: '3.5 hrs', topics: ['Demystifying GDP and inflation numbers', 'Handling hostile queries', 'Transparency standards'] },
      { title: 'Module 3: International Statistical Diplomacy & Global Standards', duration: '4.0 hrs', topics: ['UN Statistical Commission protocol', 'G20 Data Gaps Initiative', 'SDG global reporting'] },
      { title: 'Module 4: Agile Leadership in Survey Modernization', duration: '3.5 hrs', topics: ['Team upskilling strategies', 'Fostering psychological safety', 'Managing tech adoption resistance'] },
    ],
    skillsGained: ['Cabinet Briefing', 'Media Communications', 'Statistical Diplomacy', 'Organizational Leadership'],
    instructors: ['Dr. Pronab Sen (First Chief Statistician of India)', 'Ms. Sujatha Singh (Former Foreign Secretary & Public Policy Mentor)'],
    bannerGradient: 'from-amber-700 to-stone-900',
  },
];

export const LEARNING_PATHWAYS: LearningPathway[] = [
  {
    id: 'path_nad_specialist',
    title: 'National Accounts & Macro-Economic Aggregates Specialist',
    targetRole: 'Director / Joint Director (NAD)',
    targetWing: 'NAD',
    description: 'Complete capacity building track for mastering SNA 2008, Supply-Use Tables, MCA-21 processing, and Python-driven GDP tabulation.',
    estimatedWeeks: 10,
    totalHours: 64,
    tpacRefNumber: 'TPAC-PATHWAY-2025-NAD-01',
    courseIds: ['igot_stat_102', 'igot_tech_301', 'igot_gov_401', 'igot_mgmt_501'],
    competencyGains: {
      'System of National Accounts (SNA 2008) & GDP Compilation': 2,
      'Python for Official Statistics & Large Microdata': 2,
      'Data Privacy & Digital Personal Data Protection (DPDPA 2023)': 1,
      'Statistical Leadership & Inter-Ministerial Coordination': 1,
    },
    prerequisites: ['Basic Econometrics', 'Familiarity with MoSPI National Accounts Blue Book'],
    badgeName: 'National Accounts Master Practitioner',
  },
  {
    id: 'path_fod_modernizer',
    title: 'Digital Field Operations & CAPI/GIS Survey Master',
    targetRole: 'Senior Statistical Officer / Assistant Director (FOD)',
    targetWing: 'FOD',
    description: 'Designed for field leaders to modernize household survey enumeration, leverage satellite GIS analytics for sample validation, and enforce DPDPA privacy.',
    estimatedWeeks: 8,
    totalHours: 48,
    tpacRefNumber: 'TPAC-PATHWAY-2025-FOD-04',
    courseIds: ['igot_stat_101', 'igot_stat_105', 'igot_tech_304', 'igot_gov_401'],
    competencyGains: {
      'Survey Design & Multi-Stage Sampling': 1,
      'Labour & Employment Statistics (PLFS Framework)': 2,
      'GIS, Remote Sensing & Geo-Statistical Analytics': 2,
      'Data Privacy & Digital Personal Data Protection (DPDPA 2023)': 1,
    },
    prerequisites: ['Field Survey Experience', 'Basic Android CAPI Operation'],
    badgeName: 'Geo-Enabled Field Survey Specialist',
  },
  {
    id: 'path_ai_modernizer',
    title: 'Next-Gen AI & Machine Learning for Official Statistics',
    targetRole: 'Data Scientist / Statistical Officer (DIID & DQAD)',
    targetWing: 'DIID',
    description: 'Accelerate the adoption of AI/ML across MoSPI: automated NIC/NCO coding, anomaly detection in raw returns, and LLM-powered statistical assistants.',
    estimatedWeeks: 12,
    totalHours: 72,
    tpacRefNumber: 'TPAC-PATHWAY-2025-AI-09',
    courseIds: ['igot_tech_301', 'igot_tech_305', 'igot_stat_101', 'igot_gov_401'],
    competencyGains: {
      'Python for Official Statistics & Large Microdata': 2,
      'AI, Machine Learning & NLP for Unstructured Government Data': 3,
      'Survey Design & Multi-Stage Sampling': 1,
      'Data Privacy & Digital Personal Data Protection (DPDPA 2023)': 2,
    },
    prerequisites: ['Python basics', 'Fundamental Probability & Statistics'],
    badgeName: 'MoSPI Certified AI Statistics Specialist',
  },
];

export const SAMPLE_LEARNING_DOCUMENTS = [
  {
    id: 'doc_nss_79',
    title: 'NSS 79th Round Manual: Guidelines for Field Enumeration & CAPI Scrutiny',
    domain: 'statistical' as const,
    category: 'Household Surveys',
    summary: 'Official field manual defining household composition, enterprise classification, multi-stage stratified sampling of urban frame blocks, and CAPI field validation rules.',
    content: `GOVERNMENT OF INDIA - MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
NATIONAL SAMPLE SURVEY OFFICE - FIELD OPERATIONS DIVISION
NSS 79TH ROUND: COMPREHENSIVE MODULAR SURVEY ON AYUSH & DOMESTIC TOURISM

SECTION 1: CONCEPTS AND DEFINITIONS
1.1 Household: A group of persons normally living together and taking food from a common kitchen constitutes a household. The word "normally" means that temporary visitors are excluded but temporary absentees are included. Thus, a son or daughter residing in a hostel for education is not treated as a household member.
1.2 Sample Design: A stratified two-stage design has been adopted for the survey. The First Stage Units (FSU) are the Census 2011 villages in the rural sector and Urban Frame Survey (UFS) blocks in the urban sector. The Second Stage Units (SSU) are households in both sectors.
1.3 Stratification: Each district is divided into two basic strata - rural stratum and urban stratum. Within rural stratum of a district, if the population of a tehsil/sub-division exceeds 1.5 lakhs as per Census 2011, it is divided into sub-strata of roughly equal size.
1.4 Selection of FSUs: In rural sector, FSUs are selected with Probability Proportional to Size With Replacement (PPSWR), size being the Census 2011 population. In urban sector, FSUs are selected using Simple Random Sampling Without Replacement (SRSWOR).

SECTION 2: FIELD SCRUTINY AND QUALITY ASSURANCE
2.1 Computer Assisted Personal Interviewing (CAPI): Data collection is strictly conducted using encrypted CAPI tablets. Every completed schedule undergoes three validation stages:
a) On-device automated range checks and skip pattern enforcement.
b) Immediate upload to the Central Server with timestamp and GPS geolocation bounding box.
c) Scrutiny by Senior Statistical Officer (SSO) within 48 hours of field capture.
2.2 Non-response handling: If a sample household cannot be contacted after 3 consecutive visits on separate days, it is classified as 'Casualty' and replaced strictly from the pre-selected reserve list using standard replacement protocols. Substitution by the field enumerator on their own discretion is strictly prohibited.`
  },
  {
    id: 'doc_sna_gdp',
    title: 'National Accounts Statistics: GDP Compilation Methodology & SNA 2008',
    domain: 'statistical' as const,
    category: 'National Accounts',
    summary: 'Technical guidance on compiling Gross Domestic Product, Gross Value Added at basic prices, FISIM treatment, and Corporate Sector estimation via MCA-21 database.',
    content: `CENTRAL STATISTICS OFFICE (CSO) - NATIONAL ACCOUNTS DIVISION (NAD)
METHODOLOGICAL NOTE ON COMPILATION OF NATIONAL ACCOUNTS (SNA 2008 ALIGNMENT)

1. PRODUCTION BOUNDARY AND GROSS VALUE ADDED (GVA)
Gross Value Added (GVA) at basic prices is defined as the value of output of goods and services produced less the value of intermediate consumption used in the production process.
Formula: GVA at basic prices = Gross Output at basic prices - Intermediate Consumption at purchasers' prices.
GDP at market prices is derived as:
GDP = GVA at basic prices + Product Taxes - Product Subsidies.

2. TREATMENT OF FINANCIAL INTERMEDIATION SERVICES INDIRECTLY MEASURED (FISIM)
Financial institutions provide services for which they do not charge explicit fees, but rather operate on interest rate margins. As per SNA 2008:
- FISIM output is calculated as: (Interest Received on Loans - (Reference Rate * Total Loans)) + ((Reference Rate * Total Deposits) - Interest Paid on Deposits).
- FISIM is allocated across consuming institutional sectors (Corporations, General Government, Households) based on transaction volume. FISIM consumed by intermediate enterprises is deducted as intermediate consumption, while FISIM consumed by households constitutes Final Consumption Expenditure.

3. CORPORATE SECTOR ESTIMATION USING MCA-21 DATABASE
The Non-Financial Private Corporate Sector GVA is estimated using annual financial returns (Form AOC-4 and MGT-7) submitted electronically by companies to the Ministry of Corporate Affairs (MCA).
- Data coverage: Around 5 to 6 lakh active companies are analyzed using XBRL (eXtensible Business Reporting Language).
- Scaling factor: For companies whose current year returns are delayed, blow-up factors are computed based on the ratio of paid-up capital of reporting companies to total active registered companies in each 2-digit NIC industry group.`
  },
  {
    id: 'doc_dpdpa_survey',
    title: 'DPDPA 2023 Implementation SOP for Official Statistical Survey Collectors',
    domain: 'digital_governance' as const,
    category: 'Data Governance & Privacy',
    summary: 'Standard Operating Procedure governing field data collection, Data Principal rights, digital consent on CAPI tablets, and anonymization of public research microdata.',
    content: `MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
STANDARD OPERATING PROCEDURE: COMPLIANCE WITH DIGITAL PERSONAL DATA PROTECTION ACT, 2023 (DPDPA)

1. STATUTORY STATUS OF STATISTICAL ENUMERATION
Under Section 17 of DPDPA 2023, data processing necessary for statistical, research, or econometric purposes is granted specific processing exemptions, provided the personal data is not utilized to make individual-level administrative decisions regarding the Data Principal.

2. FIELD PROTOCOL FOR CAPI CONSENT & NOTICE
2.1 Notice Specification: Before commencing an interview, the enumerator must read out or present the digital consent notice in the preferred official Eighth Schedule language of the respondent.
2.2 The notice must explicitly state:
a) The statutory purpose of survey data collection under the Collection of Statistics Act, 2008.
b) Confirmation that individual identifying attributes (Name, Aadhaar, Mobile Number, Precise Geolocation) will be stripped prior to public microdata release.
c) Contact details of the MoSPI Data Protection Officer (DPO) and Data Protection Board of India grievance mechanism.

3. MICRODATA ANONYMIZATION & DISCLOSURE CONTROL
3.1 De-identification Standard: Prior to uploading data to the National Data & Analytics Platform (NDAP) or Data.gov.in:
- Direct Identifiers (Names, exact address, household serial number within village) must be permanently purged.
- Quasi-identifiers (Age, Village Census Code, Detailed Occupation) must satisfy k-anonymity (k >= 5) through top-coding and geographical aggregation at district level.
- Cell suppression is mandatory in public tabulations where any frequency cell contains fewer than 3 reporting sample units.`
  },
  {
    id: 'doc_cpi_revision',
    title: 'Consumer Price Index (CPI) Base Year Revision & Technical Weighting Manual',
    domain: 'statistical' as const,
    category: 'Price Statistics',
    summary: 'Guidelines on item basket weight derivation from Household Consumption Expenditure Survey (HCES), Jevons price relatives, and hedonic quality adjustment.',
    content: `MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION - ECONOMIC STATISTICS DIVISION
TECHNICAL MANUAL: ALL-INDIA CONSUMER PRICE INDEX (CPI) COMPILATION

1. BASKET DERIVATION AND WEIGHTING PATTERN
The item basket and weighting diagrams for All-India CPI (Rural, Urban, Combined) are derived from the latest quinquennial Household Consumption Expenditure Survey (HCES).
- Item eligibility: Any commodity or service accounting for at least 0.1% of the total monthly per capita consumer expenditure (MPCE) is included in the representative index basket.
- Weight formulation: Weights are calculated using modified Laspeyres methodology with base period budget shares.

2. ELEMENTARY AGGREGATE CALCULATION
Elementary price relatives for each selected item across designated rural markets and urban price collection centers are computed using the Geometric Mean of Price Relatives (Jevons Index):
P_J = \\prod_{i=1}^{n} (P_{it} / P_{i0})^{1/n}
Why Jevons: The Jevons index satisfies both the Time Reversal Test and Transitivity Test, and partially captures consumer substitution behavior under unitary price elasticity.

3. QUALITY ADJUSTMENT & ITEM REPLACEMENT
When a specific brand/model of an item is permanently discontinued in a sample market:
- Overlap method: If the old and replacement item are simultaneously available in the transition period, the ratio of their prices is used to link the price series.
- Hedonic regression: For electronic consumer durables (smartphones, televisions), multi-attribute hedonic regression models are used to separate pure price inflation from technological specification improvements.`
  }
];

export const MOCK_ADMIN_ANALYTICS: AdminAnalytics = {
  totalOfficers: 1420,
  activeLearnersLast30Days: 1184,
  averageCPDHours: 37.4,
  tpacCompliancePercentage: 92.6,
  wingWiseCompetencyIndex: [
    { wing: 'NAD', wingName: 'National Accounts Division', officersCount: 185, avgProficiency: 3.8, topGapDomain: 'Python & Large Data Tabulation', criticalGapRate: 28 },
    { wing: 'FOD', wingName: 'Field Operations Division', officersCount: 620, avgProficiency: 3.4, topGapDomain: 'GIS & Satellite Verification', criticalGapRate: 42 },
    { wing: 'ESD', wingName: 'Economic Statistics Division', officersCount: 190, avgProficiency: 3.9, topGapDomain: 'AI Anomaly Detection in Indices', criticalGapRate: 22 },
    { wing: 'SSD', wingName: 'Social Statistics Division', officersCount: 165, avgProficiency: 3.6, topGapDomain: 'PLFS Rotational Panel Variance', criticalGapRate: 31 },
    { wing: 'DQAD', wingName: 'Data Quality Assurance Division', officersCount: 120, avgProficiency: 4.1, topGapDomain: 'DPDPA Differential Privacy', criticalGapRate: 18 },
    { wing: 'DIID', wingName: 'Data Informatics & Innovation Division', officersCount: 140, avgProficiency: 4.3, topGapDomain: 'Transformer Models for NIC/NCO', criticalGapRate: 15 },
  ],
  domainProficiencyAverages: [
    { domain: 'statistical', domainLabel: 'Statistical Methodologies', avgScore: 3.7, benchmark: 4.2 },
    { domain: 'technical', domainLabel: 'Technical & Data Tools', avgScore: 2.9, benchmark: 4.0 },
    { domain: 'digital_governance', domainLabel: 'Digital Governance & Privacy', avgScore: 3.4, benchmark: 4.5 },
    { domain: 'managerial', domainLabel: 'Leadership & Policy Translation', avgScore: 3.8, benchmark: 4.0 },
  ],
  emergingSkillRequirements: [
    { skill: 'Python / Polars for Billion-Record NSS Datasets', demandGrowth: '+140%', currentCapacityPercentage: 38, recommendedAction: 'Enroll in TPAC-2025/MoSPI/DIID/014 sandbox cohorts' },
    { skill: 'Automated NIC 2008 & NCO Classification using NLP', demandGrowth: '+210%', currentCapacityPercentage: 22, recommendedAction: 'Mandate AI-501 workshop for all Scrutiny Officers' },
    { skill: 'Satellite Earth Observation (NDVI/GIS) for Agriculture', demandGrowth: '+115%', currentCapacityPercentage: 29, recommendedAction: 'Deploy NSSTA-GIS-415 field lab program' },
    { skill: 'DPDPA 2023 Anonymization & Consent Architecture', demandGrowth: '+300%', currentCapacityPercentage: 45, recommendedAction: 'Compulsory 10-hr iGOT e-module for all field cadres' },
  ],
  recentAssessmentsGenerated: 342,
};

export const OFFICIAL_SAMPLE_DOCUMENTS = SAMPLE_LEARNING_DOCUMENTS;
export const MOCK_IGOT_COURSES = IGOT_COURSES;
export const MOCK_LEARNING_PATHWAYS = LEARNING_PATHWAYS;

export const DEFAULT_SAMPLE_QUIZ: GeneratedAssessment = {
  id: 'quiz_init_01',
  title: 'Diagnostic Assessment on NSS 79th Round & Official Sampling Methodologies',
  sourceDocumentTitle: 'NSS 79th Round Manual: Guidelines for Field Enumeration & CAPI Scrutiny',
  difficulty: 'intermediate',
  cadreTarget: 'ISS / SSS Officers',
  totalQuestions: 4,
  estimatedTimeMinutes: 10,
  createdAt: new Date().toISOString(),
  questions: [
    {
      id: 'q1',
      questionText: 'According to official NSS survey definitions, how is a son or daughter residing away in a hostel for higher education categorized during household enumeration?',
      options: [
        'Included as a temporary absentee member of the household',
        'Excluded from the sample household membership since they do not normally take food from the common kitchen',
        'Treated as a dependent co-earner under subsidiary status',
        'Enumerated separately with a half-sample weight multiplier'
      ],
      correctAnswerIndex: 1,
      explanation: 'In official NSS surveys, a household consists of persons normally living together and taking food from a common kitchen. Students residing in hostels eat in their hostel mess and are therefore excluded from the sample household composition.',
      distractorAnalysis: 'Option A confuses temporary short-term visitors with prolonged residential education arrangements. Option D invents an illegitimate weighting mechanism.',
      conceptCitation: 'NSS 79th Round Instructions to Field Staff, Section 1.1'
    },
    {
      id: 'q2',
      questionText: 'Under the System of National Accounts (SNA 2008), what is the correct formulation for computing Gross Domestic Product (GDP) at market prices from Gross Value Added (GVA) at basic prices?',
      options: [
        'GDP = GVA at basic prices - Subsidies on production + Indirect Taxes',
        'GDP = GVA at basic prices + Product Taxes - Product Subsidies',
        'GDP = Gross Output - Intermediate Consumption - FISIM deduction',
        'GDP = GVA at factor cost + Net Factor Income from Abroad (NFIA)'
      ],
      correctAnswerIndex: 1,
      explanation: 'Under SNA 2008 and MoSPI base revisions, GDP at market prices equals GVA at basic prices plus product taxes (like GST, excise, customs) minus product subsidies (like food and fertilizer subsidies).',
      distractorAnalysis: 'Option A incorrectly refers to production taxes rather than product taxes. Option D describes Gross National Income (GNI).',
      conceptCitation: 'MoSPI National Accounts Statistics: Sources & Methods (SNA 2008)'
    },
    {
      id: 'q3',
      questionText: 'What critical sampling design property makes the Jevons Geometric Mean index preferred over the Dutot index for computing elementary price aggregates in the Consumer Price Index (CPI)?',
      options: [
        'It satisfies the Time Reversal and Transitivity tests while partially accounting for consumer substitution',
        'It produces higher inflation figures required for statutory dearness allowance formulas',
        'It completely eliminates the requirement to collect rural market prices',
        'It converts Laspeyres weights into Paasche current-period expenditure shares'
      ],
      correctAnswerIndex: 0,
      explanation: 'The Jevons index satisfies both the time reversal test and the transitivity test, is invariant to changes in measurement units, and accommodates consumer substitution under the assumption of unitary elasticity.',
      distractorAnalysis: 'Option B is factually incorrect as Jevons generally lowers upward index bias. Option C and D describe unrelated index operations.',
      conceptCitation: 'IMF / ILO Consumer Price Index Manual: Theory and Practice, Chapter 6'
    },
    {
      id: 'q4',
      questionText: 'Under Section 17 of the Digital Personal Data Protection Act (DPDPA 2023), what condition must be satisfied for statistical and research processing exemptions to apply to official government microdata?',
      options: [
        'The survey data must only be collected through paper schedules and never on digital tablets',
        'The personal data must strictly not be used to take any individual-level administrative or legal decision regarding the Data Principal',
        'All survey questionnaires must be approved by the Supreme Court of India',
        'Only public sector enterprises can be surveyed, excluding individual citizens'
      ],
      correctAnswerIndex: 1,
      explanation: 'Section 17 of DPDPA 2023 grants statutory research and statistical exemptions provided the data is not used to take any measure or decision directed at any specific Data Principal.',
      distractorAnalysis: 'Option A is counter to CAPI digital modernization. Option C and D invent non-existent statutory hurdles.',
      conceptCitation: 'Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023), Section 17(2)(b)'
    }
  ]
};

// Module 1: Role-to-Skill Digital Twins Mock Data
export const MOCK_ROLE_DIGITAL_TWINS: RoleDigitalTwin[] = [
  {
    id: 'role_stat_officer',
    roleTitle: 'Statistical Officer (Junior Time Scale / SSS)',
    cadre: 'SSS',
    department: 'NAD',
    description: 'Responsible for survey data collection, preliminary tabulation, national accounts compilation, and primary quality validation under MoSPI guidelines.',
    minimumExperienceYears: 2,
    cpdAnnualTargetHours: 40,
    competencies: [
      {
        competencyId: 'comp_stat_1',
        competencyName: 'Survey Design & Multi-Stage Sampling',
        category: 'statistical',
        targetLevel: 4,
        evidenceType: 'NSSTA Assessment',
        assessmentMethod: 'AI Quiz & MCQ Test',
        importance: 'Core',
        description: 'Formulating sampling frames, PPS selection, and weight multiplier verification.',
      },
      {
        competencyId: 'comp_stat_2',
        competencyName: 'System of National Accounts (SNA 2008) & GDP Compilation',
        category: 'statistical',
        targetLevel: 4,
        evidenceType: 'iGOT Course Certificate',
        assessmentMethod: 'AI Quiz & MCQ Test',
        importance: 'Core',
        description: 'Compilation of GVA at basic prices, intermediate consumption, and FISIM estimation.',
      },
      {
        competencyId: 'comp_stat_3',
        competencyName: 'Price Statistics & Index Numbers (CPI / WPI)',
        category: 'statistical',
        targetLevel: 4,
        evidenceType: 'iGOT Course Certificate',
        assessmentMethod: 'Practical Lab Simulation',
        importance: 'Core',
        description: 'Jevons elementary aggregation, item substitution rules, and market quotation audits.',
      },
      {
        competencyId: 'comp_tech_1',
        competencyName: 'Python for Official Statistics & Large Microdata',
        category: 'technical',
        targetLevel: 4,
        evidenceType: 'Code & Model Sandbox',
        assessmentMethod: 'Practical Lab Simulation',
        importance: 'Core',
        description: 'Pandas/Polars microdata pipelines, automated tabulation, and outlier sanitization.',
      },
      {
        competencyId: 'comp_gov_1',
        competencyName: 'Data Privacy & DPDPA 2023 Compliance',
        category: 'digital_governance',
        targetLevel: 4,
        evidenceType: 'iGOT Course Certificate',
        assessmentMethod: 'AI Quiz & MCQ Test',
        importance: 'Core',
        description: 'Consent management on CAPI tablets and k-anonymity microdata scrub protocols.',
      },
      {
        competencyId: 'comp_stat_5',
        competencyName: 'National Quality Assurance Framework (NQAF)',
        category: 'statistical',
        targetLevel: 3,
        evidenceType: 'Supervisor Endorsement',
        assessmentMethod: 'Supervisor Review',
        importance: 'Specialized',
        description: 'Adherence to UN-NQAF accuracy, timeliness, and metadata documentation standards.',
      }
    ]
  },
  {
    id: 'role_director_iss',
    roleTitle: 'Director / Joint Director (Senior Administrative Grade)',
    cadre: 'ISS',
    department: 'NAD',
    description: 'Senior statistical leadership responsible for national macroeconomic policy formulation, survey governance, international reporting (UNSD/IMF), and inter-ministerial data coordination.',
    minimumExperienceYears: 10,
    cpdAnnualTargetHours: 50,
    competencies: [
      {
        competencyId: 'comp_stat_2',
        competencyName: 'System of National Accounts (SNA 2008) & GDP Compilation',
        category: 'statistical',
        targetLevel: 5,
        evidenceType: 'Research Publication',
        assessmentMethod: 'Peer Review',
        importance: 'Core',
        description: 'Institutional sector accounts, Supply & Use Tables (SUT), and base revision policy.',
      },
      {
        competencyId: 'comp_gov_1',
        competencyName: 'Data Privacy & DPDPA 2023 Compliance',
        category: 'digital_governance',
        targetLevel: 5,
        evidenceType: 'Supervisor Endorsement',
        assessmentMethod: 'Supervisor Review',
        importance: 'Core',
        description: 'Statutory compliance governance, data principal protocols, and high-level breach mitigation.',
      },
      {
        competencyId: 'comp_mgmt_1',
        competencyName: 'Strategic Statistical Governance & Public Policy Translation',
        category: 'managerial',
        targetLevel: 5,
        evidenceType: 'Supervisor Endorsement',
        assessmentMethod: 'Supervisor Review',
        importance: 'Core',
        description: 'Translating complex official microdata into actionable cabinet notes and policy briefings.',
      },
      {
        competencyId: 'comp_tech_5',
        competencyName: 'AI, Machine Learning & NLP for Unstructured Data',
        category: 'technical',
        targetLevel: 4,
        evidenceType: 'iGOT Course Certificate',
        assessmentMethod: 'AI Quiz & MCQ Test',
        importance: 'Specialized',
        description: 'Directing AI roadmap for automated enterprise classification and text extraction.',
      }
    ]
  },
  {
    id: 'role_field_investigator',
    roleTitle: 'Field Investigator / Primary Enumeration Officer',
    cadre: 'Field_Investigator',
    department: 'FOD',
    description: 'Frontline field statistical officer conducting household listings, CAPI tablet interviews, crop area inspections, and regional enterprise surveys.',
    minimumExperienceYears: 1,
    cpdAnnualTargetHours: 35,
    competencies: [
      {
        competencyId: 'comp_stat_1',
        competencyName: 'Survey Design & Multi-Stage Sampling',
        category: 'statistical',
        targetLevel: 3,
        evidenceType: 'Field Work Quality Audit',
        assessmentMethod: 'Supervisor Review',
        importance: 'Core',
        description: 'Accurate household listing, random start selection, and sample unit substitution protocols.',
      },
      {
        competencyId: 'comp_stat_4',
        competencyName: 'Labour & Employment Statistics (PLFS Framework)',
        category: 'statistical',
        targetLevel: 4,
        evidenceType: 'NSSTA Assessment',
        assessmentMethod: 'AI Quiz & MCQ Test',
        importance: 'Core',
        description: 'Rigorous CWS and UPSS status probing, activity code classification, and earnings validation.',
      },
      {
        competencyId: 'comp_tech_4',
        competencyName: 'GIS, Remote Sensing & Geo-Statistical Analytics',
        category: 'technical',
        targetLevel: 3,
        evidenceType: 'Field Work Quality Audit',
        assessmentMethod: 'Practical Lab Simulation',
        importance: 'Core',
        description: 'Geo-tagging sample households, boundary polygon capture, and mobile GPS verification.',
      },
      {
        competencyId: 'comp_gov_1',
        competencyName: 'Data Privacy & DPDPA 2023 Compliance',
        category: 'digital_governance',
        targetLevel: 4,
        evidenceType: 'iGOT Course Certificate',
        assessmentMethod: 'AI Quiz & MCQ Test',
        importance: 'Core',
        description: 'Field consent notices, non-disclosure of respondent details, and secure tablet transmission.',
      }
    ]
  },
  {
    id: 'role_data_scientist',
    roleTitle: 'Statistical Data Scientist / Informatics Specialist',
    cadre: 'Data_Scientist_MoSPI',
    department: 'DIID',
    description: 'Technical specialist architecting automated analytics pipelines, LLM-based classification engines (NIC/NCO), big data linkage, and open data APIs on NDAP.',
    minimumExperienceYears: 3,
    cpdAnnualTargetHours: 50,
    competencies: [
      {
        competencyId: 'comp_tech_1',
        competencyName: 'Python for Official Statistics & Large Microdata',
        category: 'technical',
        targetLevel: 5,
        evidenceType: 'Code & Model Sandbox',
        assessmentMethod: 'Practical Lab Simulation',
        importance: 'Core',
        description: 'Polars/Pandas high-throughput processing, distributed workflows, and package development.',
      },
      {
        competencyId: 'comp_tech_5',
        competencyName: 'AI, Machine Learning & NLP for Unstructured Data',
        category: 'technical',
        targetLevel: 5,
        evidenceType: 'Research Publication',
        assessmentMethod: 'Peer Review',
        importance: 'Core',
        description: 'Developing fine-tuned transformer models for 5-digit NIC-2008 classification and anomaly detection.',
      },
      {
        competencyId: 'comp_tech_3',
        competencyName: 'SQL & Relational Database Engineering for Registries',
        category: 'technical',
        targetLevel: 5,
        evidenceType: 'Code & Model Sandbox',
        assessmentMethod: 'Practical Lab Simulation',
        importance: 'Core',
        description: 'Statistical business register deduplication, fuzzy record linkage, and cloud data lakes.',
      },
      {
        competencyId: 'comp_gov_3',
        competencyName: 'NDAP & Open Data Standards',
        category: 'digital_governance',
        targetLevel: 5,
        evidenceType: 'Supervisor Endorsement',
        assessmentMethod: 'Supervisor Review',
        importance: 'Core',
        description: 'Publishing machine-readable FAIR schemas, automated REST APIs, and SDMX datasets.',
      }
    ]
  }
];

// Module 9: Evidence & Competency Passport Mock Data
export const MOCK_EVIDENCE_LOGS: EvidenceLog[] = [
  {
    id: 'ev_001',
    competencyId: 'comp_stat_3',
    competencyName: 'Price Statistics & Index Numbers (CPI / WPI / IIP)',
    category: 'statistical',
    evidenceType: 'iGOT Course Certificate',
    assessmentMethod: 'AI Quiz & MCQ Test',
    title: 'Advanced Consumer Price Index (CPI) Compilation & Jevons Relatives',
    score: 94,
    date: '2026-05-14',
    verified: true,
    issuer: 'iGOT Karmayogi / ESD Division',
    certificateRef: 'iGOT-CPI-2026-8891',
    status: 'verified'
  },
  {
    id: 'ev_002',
    competencyId: 'comp_tech_3',
    competencyName: 'SQL & Relational Database Engineering for Registries',
    category: 'technical',
    evidenceType: 'Code & Model Sandbox',
    assessmentMethod: 'Practical Lab Simulation',
    title: 'MCA-21 & GSTN Record Linkage Practical Benchmark',
    score: 89,
    date: '2026-06-20',
    verified: true,
    issuer: 'MoSPI Data Informatics Lab',
    certificateRef: 'DIID-SQL-LAB-441',
    status: 'verified'
  },
  {
    id: 'ev_003',
    competencyId: 'comp_gov_3',
    competencyName: 'National Data & Analytics Platform (NDAP) & Open Data Standards',
    category: 'digital_governance',
    evidenceType: 'NSSTA Assessment',
    assessmentMethod: 'AI Quiz & MCQ Test',
    title: 'NDAP Open Data & SDMX Metadata Publishing Certification',
    score: 92,
    date: '2026-07-08',
    verified: true,
    issuer: 'NSSTA Greater Noida',
    certificateRef: 'NSSTA-NDAP-2026-102',
    status: 'verified'
  },
  {
    id: 'ev_004',
    competencyId: 'comp_stat_1',
    competencyName: 'Survey Design & Multi-Stage Sampling',
    category: 'statistical',
    evidenceType: 'NSSTA Assessment',
    assessmentMethod: 'AI Quiz & MCQ Test',
    title: 'Diagnostic Assessment on NSS 79th Round & Official Sampling',
    score: 75,
    date: '2026-08-12',
    verified: true,
    issuer: 'StatSkill AI Automated Proctored Quiz',
    certificateRef: 'STATSKILL-QUIZ-79-04',
    status: 'verified'
  },
  {
    id: 'ev_005',
    competencyId: 'comp_stat_2',
    competencyName: 'System of National Accounts (SNA 2008) & GDP Compilation',
    category: 'statistical',
    evidenceType: 'Field Work Quality Audit',
    assessmentMethod: 'Supervisor Review',
    title: 'Quarterly GVA Compilation Review — Manufacturing & Services Sub-sectors',
    score: 68,
    date: '2026-08-22',
    verified: false,
    issuer: 'National Accounts Division (NAD) Scrutiny Board',
    status: 'in_review'
  }
];

export const MOCK_COMPETENCY_PASSPORTS: Record<string, CompetencyPassportData> = {
  'user_iss_01': {
    passportId: 'MoSPI-PASS-2026-ISS-4891',
    issueDate: '2025-04-01',
    lastVerified: '2026-08-28',
    issuingAuthority: 'National Statistical Systems Training Academy (NSSTA) & MoSPI-TPAC',
    overallReadiness: 76,
    verifiedBadgesCount: 6,
    evidenceHistory: MOCK_EVIDENCE_LOGS,
    trendMap: {
      'comp_stat_1': 'improving',
      'comp_stat_2': 'improving',
      'comp_stat_3': 'stable',
      'comp_stat_4': 'declining',
      'comp_tech_1': 'improving',
      'comp_tech_3': 'stable',
      'comp_tech_5': 'improving',
      'comp_gov_1': 'improving',
      'comp_gov_3': 'stable',
    }
  }
};

// Module 8: Department Heatmap Matrix Data (Competencies x Divisions)
export interface HeatmapCell {
  competencyId: string;
  competencyName: string;
  wing: DepartmentWing;
  wingLabel: string;
  avgProficiency: number;
  targetProficiency: number;
  gap: number;
  criticalGapRatePercent: number; // percentage of officers with gap >= 2
  status: 'critical' | 'moderate' | 'met';
}

export const DEPARTMENT_HEATMAP_DATA: HeatmapCell[] = [
  // NAD (National Accounts)
  { competencyId: 'comp_stat_2', competencyName: 'SNA 2008 & GDP Compilation', wing: 'NAD', wingLabel: 'NAD (National Accounts)', avgProficiency: 3.9, targetProficiency: 4.8, gap: 0.9, criticalGapRatePercent: 28, status: 'moderate' },
  { competencyId: 'comp_tech_1', competencyName: 'Python for Large Microdata', wing: 'NAD', wingLabel: 'NAD (National Accounts)', avgProficiency: 2.6, targetProficiency: 4.2, gap: 1.6, criticalGapRatePercent: 44, status: 'critical' },
  { competencyId: 'comp_stat_1', competencyName: 'Survey Design & Sampling', wing: 'NAD', wingLabel: 'NAD (National Accounts)', avgProficiency: 3.8, targetProficiency: 4.0, gap: 0.2, criticalGapRatePercent: 12, status: 'met' },
  { competencyId: 'comp_gov_1', competencyName: 'DPDPA 2023 Privacy Compliance', wing: 'NAD', wingLabel: 'NAD (National Accounts)', avgProficiency: 3.2, targetProficiency: 4.5, gap: 1.3, criticalGapRatePercent: 36, status: 'critical' },

  // FOD (Field Operations)
  { competencyId: 'comp_stat_1', competencyName: 'Survey Design & Sampling', wing: 'FOD', wingLabel: 'FOD (Field Operations)', avgProficiency: 3.4, targetProficiency: 4.2, gap: 0.8, criticalGapRatePercent: 32, status: 'moderate' },
  { competencyId: 'comp_stat_4', competencyName: 'PLFS Labour Statistics', wing: 'FOD', wingLabel: 'FOD (Field Operations)', avgProficiency: 3.2, targetProficiency: 4.5, gap: 1.3, criticalGapRatePercent: 41, status: 'critical' },
  { competencyId: 'comp_tech_4', competencyName: 'GIS & Geo-Spatial Field Tools', wing: 'FOD', wingLabel: 'FOD (Field Operations)', avgProficiency: 2.3, targetProficiency: 3.8, gap: 1.5, criticalGapRatePercent: 48, status: 'critical' },
  { competencyId: 'comp_gov_1', competencyName: 'DPDPA 2023 Privacy Compliance', wing: 'FOD', wingLabel: 'FOD (Field Operations)', avgProficiency: 3.0, targetProficiency: 4.0, gap: 1.0, criticalGapRatePercent: 30, status: 'moderate' },

  // ESD (Economic Statistics)
  { competencyId: 'comp_stat_3', competencyName: 'CPI / WPI Index Numbers', wing: 'ESD', wingLabel: 'ESD (Economic Statistics)', avgProficiency: 4.1, targetProficiency: 4.5, gap: 0.4, criticalGapRatePercent: 14, status: 'met' },
  { competencyId: 'comp_tech_5', competencyName: 'AI / NLP for NIC Classification', wing: 'ESD', wingLabel: 'ESD (Economic Statistics)', avgProficiency: 2.1, targetProficiency: 4.0, gap: 1.9, criticalGapRatePercent: 55, status: 'critical' },
  { competencyId: 'comp_tech_1', competencyName: 'Python for Large Microdata', wing: 'ESD', wingLabel: 'ESD (Economic Statistics)', avgProficiency: 3.1, targetProficiency: 4.0, gap: 0.9, criticalGapRatePercent: 26, status: 'moderate' },
  { competencyId: 'comp_gov_1', competencyName: 'DPDPA 2023 Privacy Compliance', wing: 'ESD', wingLabel: 'ESD (Economic Statistics)', avgProficiency: 3.5, targetProficiency: 4.2, gap: 0.7, criticalGapRatePercent: 20, status: 'moderate' },

  // SDRD (Survey Design & Research)
  { competencyId: 'comp_stat_1', competencyName: 'Survey Design & Sampling', wing: 'SDRD', wingLabel: 'SDRD (Survey Design)', avgProficiency: 4.4, targetProficiency: 4.8, gap: 0.4, criticalGapRatePercent: 9, status: 'met' },
  { competencyId: 'comp_tech_2', competencyName: 'R & Advanced Statistical Modeling', wing: 'SDRD', wingLabel: 'SDRD (Survey Design)', avgProficiency: 3.8, targetProficiency: 4.5, gap: 0.7, criticalGapRatePercent: 22, status: 'moderate' },
  { competencyId: 'comp_tech_5', competencyName: 'AI / NLP for NIC Classification', wing: 'SDRD', wingLabel: 'SDRD (Survey Design)', avgProficiency: 2.4, targetProficiency: 4.2, gap: 1.8, criticalGapRatePercent: 49, status: 'critical' },
  { competencyId: 'comp_stat_5', competencyName: 'NQAF Quality Assurance', wing: 'SDRD', wingLabel: 'SDRD (Survey Design)', avgProficiency: 4.2, targetProficiency: 4.5, gap: 0.3, criticalGapRatePercent: 8, status: 'met' },

  // DIID (Data Informatics & Innovation)
  { competencyId: 'comp_tech_1', competencyName: 'Python for Large Microdata', wing: 'DIID', wingLabel: 'DIID (Informatics)', avgProficiency: 4.5, targetProficiency: 4.8, gap: 0.3, criticalGapRatePercent: 6, status: 'met' },
  { competencyId: 'comp_tech_3', competencyName: 'SQL & Database Linkage', wing: 'DIID', wingLabel: 'DIID (Informatics)', avgProficiency: 4.6, targetProficiency: 4.8, gap: 0.2, criticalGapRatePercent: 4, status: 'met' },
  { competencyId: 'comp_tech_5', competencyName: 'AI / NLP for NIC Classification', wing: 'DIID', wingLabel: 'DIID (Informatics)', avgProficiency: 3.6, targetProficiency: 4.8, gap: 1.2, criticalGapRatePercent: 31, status: 'moderate' },
  { competencyId: 'comp_gov_3', competencyName: 'NDAP & Open Data Standards', wing: 'DIID', wingLabel: 'DIID (Informatics)', avgProficiency: 4.7, targetProficiency: 4.8, gap: 0.1, criticalGapRatePercent: 3, status: 'met' },
];

// Module 10: Capacity Simulator Pre-loaded Scenarios
export const SAMPLE_CAPACITY_SCENARIOS: Record<string, CapacitySimulationResult> = {
  'comp_tech_1': {
    scenarioName: 'National Upskilling in Python Microdata Analytics for Large Surveys',
    targetCompetency: 'Python for Official Statistics & Large Microdata',
    baselineProficiency: 2.6,
    targetProficiency: 4.0,
    targetOfficersCount: 420,
    priorityLearnersHighGap: 248,
    estimatedCohortDurationWeeks: 8,
    recommendedCourseHours: 40,
    estimatedTrainingCostPerOfficer: 4500,
    totalEstimatedBudgetINR: 1890000,
    wingImpact: [
      { wing: 'NAD', officersCount: 82, gapClosingPercent: 78 },
      { wing: 'FOD', officersCount: 195, gapClosingPercent: 72 },
      { wing: 'ESD', officersCount: 78, gapClosingPercent: 84 },
      { wing: 'SSD', officersCount: 65, gapClosingPercent: 80 }
    ]
  },
  'comp_stat_2': {
    scenarioName: 'SNA 2008 & Next-Gen GDP Base Revision Transition',
    targetCompetency: 'System of National Accounts (SNA 2008) & GDP Compilation',
    baselineProficiency: 3.2,
    targetProficiency: 4.5,
    targetOfficersCount: 260,
    priorityLearnersHighGap: 112,
    estimatedCohortDurationWeeks: 6,
    recommendedCourseHours: 35,
    estimatedTrainingCostPerOfficer: 5500,
    totalEstimatedBudgetINR: 1430000,
    wingImpact: [
      { wing: 'NAD', officersCount: 145, gapClosingPercent: 92 },
      { wing: 'ESD', officersCount: 65, gapClosingPercent: 82 },
      { wing: 'DQAD', officersCount: 50, gapClosingPercent: 88 }
    ]
  },
  'comp_gov_1': {
    scenarioName: 'Digital Personal Data Protection Act (DPDPA 2023) Fieldwork Mandate',
    targetCompetency: 'Data Privacy & Digital Personal Data Protection (DPDPA 2023)',
    baselineProficiency: 2.9,
    targetProficiency: 4.2,
    targetOfficersCount: 780,
    priorityLearnersHighGap: 360,
    estimatedCohortDurationWeeks: 4,
    recommendedCourseHours: 20,
    estimatedTrainingCostPerOfficer: 2200,
    totalEstimatedBudgetINR: 1716000,
    wingImpact: [
      { wing: 'FOD', officersCount: 480, gapClosingPercent: 89 },
      { wing: 'NAD', officersCount: 95, gapClosingPercent: 94 },
      { wing: 'ESD', officersCount: 110, gapClosingPercent: 91 },
      { wing: 'DIID', officersCount: 95, gapClosingPercent: 98 }
    ]
  }
};

