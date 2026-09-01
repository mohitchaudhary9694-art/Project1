import { 
  DiagnosticQuestion, 
  DiagnosticPillarScore, 
  InitialDiagnosticResult, 
  UserProfile, 
  CompetencyItem, 
  ProficiencyLevel,
  CompetencyDomain
} from '../types';

export const DIAGNOSTIC_TEST_VERSION = "MoSPI-NSSTA-DIAG-2026.1";

/**
 * 18 Comprehensive Diagnostic Assessment Questions
 * Divided across the 4 core competency pillars:
 * 1. Statistical Methods (5 questions)
 * 2. Technical & Python/AI (5 questions)
 * 3. Digital Governance & DPDPA (4 questions)
 * 4. Leadership & Ethics (4 questions)
 */
export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // ==========================================================================
  // PILLAR 1: STATISTICAL METHODS (5 Questions)
  // ==========================================================================
  {
    id: 'diag_stat_01',
    pillar: 'statistical',
    pillarLabel: 'Statistical Methods',
    type: 'mcq',
    difficulty: 'Easy',
    weight: 1,
    questionText: 'In a multi-stage stratified survey design (e.g., NSS household surveys), what constitutes a First Stage Unit (FSU) in the rural sector?',
    options: [
      { id: 'opt_1', text: 'Individual household members within selected hamlets', isCorrect: false },
      { id: 'opt_2', text: 'Census Villages as per the official Census frame', isCorrect: true, explanation: 'In rural sectors of NSS surveys, Census Villages act as FSUs (selected via PPSWR).' },
      { id: 'opt_3', text: 'District administrative headquarters', isCorrect: false },
      { id: 'opt_4', text: 'Agricultural land parcel holdings', isCorrect: false }
    ],
    explanation: 'Under the MoSPI/NSS sampling frame, Census Villages are designated as First Stage Units (FSUs) in rural strata, whereas Urban Frame Survey (UFS) blocks are FSUs in urban areas.',
    domainRef: 'Survey Design & Multi-Stage Sampling'
  },
  {
    id: 'diag_stat_02',
    pillar: 'statistical',
    pillarLabel: 'Statistical Methods',
    type: 'scenario',
    difficulty: 'Medium',
    weight: 2,
    questionText: 'Scenario: During the compilation of Annual Gross Value Added (GVA) for the manufacturing sector under SNA 2008, an officer notices significant divergence between the MCA-21 corporate filing database and the Annual Survey of Industries (ASI). What is the standard harmonizing step?',
    scenarioContext: 'National Accounts Division (NAD) - Annual GVA Reconciliation',
    options: [
      { id: 'opt_1', text: 'Discard MCA-21 data entirely and rely purely on historical ASI growth rates', isCorrect: false },
      { id: 'opt_2', text: 'Apply the Enterprise Approach for corporate GVA while using ASI establishment data for input-structure verification and unorganized sector blowing-up factors', isCorrect: true, explanation: 'SNA 2008 recommends the Enterprise approach via financial accounts for corporate units, complemented by plant-level ASI data for technical coefficients.' },
      { id: 'opt_3', text: 'Average the two numbers without examining institutional sector coverage differences', isCorrect: false },
      { id: 'opt_4', text: 'Replace manufacturing GVA with the Index of Industrial Production (IIP) physical output index', isCorrect: false }
    ],
    explanation: 'Under the revised SNA 2008 methodology in India, MCA-21 provides enterprise-level value added for the organized corporate sector, while ASI provides establishment-level input/output ratios.',
    domainRef: 'System of National Accounts (SNA 2008) & GDP Compilation'
  },
  {
    id: 'diag_stat_03',
    pillar: 'statistical',
    pillarLabel: 'Statistical Methods',
    type: 'mcq',
    difficulty: 'Hard',
    weight: 3,
    questionText: 'When constructing the Consumer Price Index (CPI), which index formula is officially used to aggregate item price relatives at the elementary subgroup level to eliminate substitution bias?',
    options: [
      { id: 'opt_1', text: 'Arithmetic mean of unweighted price relatives (Carli Index)', isCorrect: false },
      { id: 'opt_2', text: 'Geometric Laspeyres / Jevons formulation at elementary level with modified Laspeyres for higher tiers', isCorrect: true, explanation: 'International best practice (ILO/UN) and MoSPI guidelines use geometric formulations (Jevons) at elementary levels to avoid upward bias.' },
      { id: 'opt_3', text: 'Simple Paasche index using current period quantities exclusively', isCorrect: false },
      { id: 'opt_4', text: 'Unweighted harmonic mean of price quotes (Dutot Index)', isCorrect: false }
    ],
    explanation: 'Official CPI compilation utilizes the Jevons/Geometric Laspeyres formula at elementary item levels, transitioned to weighted Laspeyres aggregation across consumption baskets.',
    domainRef: 'Price Statistics & Index Numbers (CPI / WPI / IIP)'
  },
  {
    id: 'diag_stat_04',
    pillar: 'statistical',
    pillarLabel: 'Statistical Methods',
    type: 'scenario',
    difficulty: 'Medium',
    weight: 2,
    questionText: 'Scenario: In the Periodic Labour Force Survey (PLFS), an individual worked for 2 hours on 3 days during the reference week and was actively seeking work for the rest of the week. Under the Current Weekly Status (CWS) framework, what is their primary classification?',
    scenarioContext: 'Social Statistics Division - PLFS Activity Probing',
    options: [
      { id: 'opt_1', text: 'Unemployed for the entire week because total hours did not exceed 10 hours', isCorrect: false },
      { id: 'opt_2', text: 'Employed in the labour force (since at least 1 hour of economic work occurred during the reference week)', isCorrect: true, explanation: 'Under CWS, working for at least 1 hour on any 1 day of the 7-day reference week qualifies a person as employed during that week.' },
      { id: 'opt_3', text: 'Out of Labour Force (marginal activity)', isCorrect: false },
      { id: 'opt_4', text: 'Underemployed student category', isCorrect: false }
    ],
    explanation: 'The PLFS Current Weekly Status (CWS) criterion considers any person who engaged in economic activity for at least 1 hour on at least 1 day as employed under CWS.',
    domainRef: 'Labour & Employment Statistics (PLFS Framework)'
  },
  {
    id: 'diag_stat_05',
    pillar: 'statistical',
    pillarLabel: 'Statistical Methods',
    type: 'self_rating',
    difficulty: 'Medium',
    weight: 2,
    questionText: 'Self-Assessment: How confident are you in designing complex survey sampling weights, multiplier formulas, and computing sampling variances for national surveys?',
    options: [
      { id: 'opt_1', text: 'Level 1: Novice — Aware of basic concepts but need full guidance on weights and multipliers', scoreValue: 1 },
      { id: 'opt_2', text: 'Level 2: Beginner — Can apply standard multiplier files provided in NSS unit microdata', scoreValue: 2 },
      { id: 'opt_3', text: 'Level 3: Competent — Can formulate PPS multipliers and handle basic non-response weight adjustments', scoreValue: 3 },
      { id: 'opt_4', text: 'Level 4: Proficient — Confidently design multi-stage stratification and calculate Horvitz-Thompson estimators', scoreValue: 4 },
      { id: 'opt_5', text: 'Level 5: Expert — Capable of authoring national sample survey design manuals and post-stratification models', scoreValue: 5 }
    ],
    domainRef: 'Survey Design & Multi-Stage Sampling'
  },

  // ==========================================================================
  // PILLAR 2: TECHNICAL & PYTHON / AI (5 Questions)
  // ==========================================================================
  {
    id: 'diag_tech_01',
    pillar: 'technical',
    pillarLabel: 'Technical & Python/AI',
    type: 'mcq',
    difficulty: 'Easy',
    weight: 1,
    questionText: 'When working with large NSSO / PLFS unit-level microdata in Python, which library/structure is most optimal for memory-efficient out-of-core tabular processing?',
    options: [
      { id: 'opt_1', text: 'Standard Python dictionaries and native json parser', isCorrect: false },
      { id: 'opt_2', text: 'Polars LazyFrame or Pandas with categorical / chunked dtypes', isCorrect: true, explanation: 'Polars LazyFrames and chunked/categorical Pandas data structures enable lightning-fast microdata processing on multi-gigabyte survey schedules.' },
      { id: 'opt_3', text: 'Writing custom while-loops with regex string replacement', isCorrect: false },
      { id: 'opt_4', text: 'Using HTML tables rendered in browser DOM', isCorrect: false }
    ],
    explanation: 'Modern official statistics pipelines utilize Polars (LazyFrame) and vectorized Pandas pipelines to load multi-million record survey microdata without RAM bottlenecking.',
    domainRef: 'Python for Official Statistics & Large Microdata'
  },
  {
    id: 'diag_tech_02',
    pillar: 'technical',
    pillarLabel: 'Technical & Python/AI',
    type: 'scenario',
    difficulty: 'Medium',
    weight: 2,
    questionText: 'Scenario: You have an unorganized enterprise survey dataset with 500,000 free-text business descriptions (e.g., "repairing electric motors and rewinding"). Which AI/NLP technique is best suited to automatically assign 5-digit National Industrial Classification (NIC-2008) codes with high confidence?',
    scenarioContext: 'Data Informatics & Innovation Division (DIID) - Automated Classification',
    options: [
      { id: 'opt_1', text: 'Exact SQL string equality matches on keywords', isCorrect: false },
      { id: 'opt_2', text: 'Fine-tuned Transformer sentence embeddings with semantic cosine similarity search against the official NIC index', isCorrect: true, explanation: 'Dense sentence embeddings capture synonymy, vernacular phrasing, and multi-word semantic equivalence to map text to standardized 5-digit NIC codes.' },
      { id: 'opt_3', text: 'Manual review by field enumerators on paper forms', isCorrect: false },
      { id: 'opt_4', text: 'Random forest trained only on the length of the company name string', isCorrect: false }
    ],
    explanation: 'MoSPI AI modernization pipelines leverage fine-tuned LLM/Transformer embeddings combined with vector indices to automate NIC/NCO coding with over 90% precision.',
    domainRef: 'AI, Machine Learning & NLP for Unstructured Government Data'
  },
  {
    id: 'diag_tech_03',
    pillar: 'technical',
    pillarLabel: 'Technical & Python/AI',
    type: 'mcq',
    difficulty: 'Hard',
    weight: 3,
    questionText: 'In time-series seasonal adjustment of official monthly macroeconomic indicators (e.g., IIP or Trade Data), which diagnostic test evaluates whether identifiable residual seasonality remains after X-13ARIMA-SEATS decomposition?',
    options: [
      { id: 'opt_1', text: 'Durbin-Watson d-statistic exclusively', isCorrect: false },
      { id: 'opt_2', text: 'Combined F-test and Kruskal-Wallis non-parametric test for stable and moving seasonality (M7 metric < 1.0)', isCorrect: true, explanation: 'The X-13ARIMA-SEATS quality metric M7 (< 1.0) confirms that seasonal filters have successfully removed identifiable seasonality.' },
      { id: 'opt_3', text: 'Pearson correlation matrix of raw values', isCorrect: false },
      { id: 'opt_4', text: 'Ordinary Least Squares R-squared value', isCorrect: false }
    ],
    explanation: 'X-13ARIMA-SEATS uses the M-statistics suite (specifically M7 < 1.0 and F-test for stable seasonality) to validate that published seasonally adjusted series are reliable.',
    domainRef: 'R & Advanced Statistical Modeling'
  },
  {
    id: 'diag_tech_04',
    pillar: 'technical',
    pillarLabel: 'Technical & Python/AI',
    type: 'mcq',
    difficulty: 'Medium',
    weight: 2,
    questionText: 'In geo-statistical spatial sampling for agricultural crop yield estimation (e.g., FASAL / Mahalanobis National Crop Forecast Centre), which satellite-derived remote sensing index is standardly used for crop vigor monitoring?',
    options: [
      { id: 'opt_1', text: 'Normalized Difference Vegetation Index (NDVI)', isCorrect: true, explanation: 'NDVI (calculated from Red and Near-Infrared bands) is the primary remote sensing index used to assess vegetation health and crop biomass.' },
      { id: 'opt_2', text: 'Gross Domestic Deflator Index (GDDI)', isCorrect: false },
      { id: 'opt_3', text: 'Consumer Sentiment Spatial Vector (CSSV)', isCorrect: false },
      { id: 'opt_4', text: 'Aadhaar Density Geo-Metric (ADGM)', isCorrect: false }
    ],
    explanation: 'NDVI is standardly extracted across spatial bounding boxes to correlate satellite crop vigor with ground-truth Crop Cutting Experiment (CCE) yields.',
    domainRef: 'GIS, Remote Sensing & Geo-Statistical Analytics'
  },
  {
    id: 'diag_tech_05',
    pillar: 'technical',
    pillarLabel: 'Technical & Python/AI',
    type: 'self_rating',
    difficulty: 'Medium',
    weight: 2,
    questionText: 'Self-Assessment: Rate your hands-on coding comfort in Python or R for statistical data wrangling, automated report generation, and data visualization:',
    options: [
      { id: 'opt_1', text: 'Level 1: Beginner — Familiar with Excel but rarely write custom Python/R scripts', scoreValue: 1 },
      { id: 'opt_2', text: 'Level 2: Basic — Can run pre-existing Python scripts, load CSVs, and inspect summary stats', scoreValue: 2 },
      { id: 'opt_3', text: 'Level 3: Intermediate — Write custom scripts with Pandas/dplyr to merge tables, group, and plot charts', scoreValue: 3 },
      { id: 'opt_4', text: 'Level 4: Advanced — Build automated data pipelines, apply sampling weights, and develop custom modules', scoreValue: 4 },
      { id: 'opt_5', text: 'Level 5: Expert — Architect enterprise data pipelines, train ML models, and maintain production packages', scoreValue: 5 }
    ],
    domainRef: 'Python for Official Statistics & Large Microdata'
  },

  // ==========================================================================
  // PILLAR 3: DIGITAL GOVERNANCE & DPDPA (4 Questions)
  // ==========================================================================
  {
    id: 'diag_gov_01',
    pillar: 'digital_governance',
    pillarLabel: 'Digital Governance',
    type: 'mcq',
    difficulty: 'Easy',
    weight: 1,
    questionText: 'Under the Digital Personal Data Protection Act (DPDPA 2023), which statutory exemption applies to government statistical agencies collecting household data?',
    options: [
      { id: 'opt_1', text: 'Statistical agencies are exempt from all cybersecurity requirements', isCorrect: false },
      { id: 'opt_2', text: 'Personal data processed strictly for statistical, research, or archival purposes is exempt from certain provisions provided no decision is taken specific to the Data Principal and rigorous anonymization is enforced', isCorrect: true, explanation: 'Section 17 of DPDPA 2023 provides exemptions for statistical research under strict confidentiality and anonymization safeguards.' },
      { id: 'opt_3', text: 'Agencies can publicly disclose respondent names and telephone numbers for verification', isCorrect: false },
      { id: 'opt_4', text: 'Data can be sold to commercial advertising networks without consent', isCorrect: false }
    ],
    explanation: 'DPDPA 2023 grants statistical research exemptions provided microdata is completely de-identified and cannot be used to impact an individual Data Principal directly.',
    domainRef: 'Data Privacy & Digital Personal Data Protection (DPDPA 2023)'
  },
  {
    id: 'diag_gov_02',
    pillar: 'digital_governance',
    pillarLabel: 'Digital Governance',
    type: 'scenario',
    difficulty: 'Medium',
    weight: 2,
    questionText: 'Scenario: Before releasing a public microdata file of an enterprise survey, the Data Quality team discovers that in 3 remote districts, only 1 large factory exists in a specific 4-digit industry. Releasing the table would directly reveal that company\'s turnover. What is the mandatory statistical disclosure control action?',
    scenarioContext: 'Data Quality Assurance Division (DQAD) - Microdata Privacy',
    options: [
      { id: 'opt_1', text: 'Publish the figures with a warning disclaimer', isCorrect: false },
      { id: 'opt_2', text: 'Apply Cell Suppression (Primary & Complementary suppression) or group into a broader 2-digit industry / district category to satisfy k-anonymity', isCorrect: true, explanation: 'Statistical disclosure control requires cell suppression or aggregation when single-unit dominance reveals proprietary information.' },
      { id: 'opt_3', text: 'Falsify the numbers with random positive values', isCorrect: false },
      { id: 'opt_4', text: 'Exclude the entire state from the national survey report', isCorrect: false }
    ],
    explanation: 'Cell suppression and threshold aggregation are standard UNECE/MoSPI Statistical Disclosure Control techniques to preserve respondent confidentiality.',
    domainRef: 'Data Privacy & Digital Personal Data Protection (DPDPA 2023)'
  },
  {
    id: 'diag_gov_03',
    pillar: 'digital_governance',
    pillarLabel: 'Digital Governance',
    type: 'mcq',
    difficulty: 'Hard',
    weight: 3,
    questionText: 'Which international metadata standard is adopted by the National Data & Analytics Platform (NDAP) and UN Statistical Division (UNSD) for standardized structural definitions and automated API data exchange?',
    options: [
      { id: 'opt_1', text: 'Statistical Data and Metadata eXchange (SDMX) and Data Documentation Initiative (DDI)', isCorrect: true, explanation: 'SDMX and DDI are the gold standard international specifications for structured macroeconomic and survey metadata exchange.' },
      { id: 'opt_2', text: 'HyperText Markup Language 2.0 (HTML2)', isCorrect: false },
      { id: 'opt_3', text: 'Flash SWF Binary Protocol', isCorrect: false },
      { id: 'opt_4', text: 'Rich Text Format Document Template', isCorrect: false }
    ],
    explanation: 'SDMX provides the universal architecture for exchanging statistical time series and indicators between national statistical offices (MoSPI), RBI, IMF, and UNSD.',
    domainRef: 'National Data & Analytics Platform (NDAP) & Open Data Standards'
  },
  {
    id: 'diag_gov_04',
    pillar: 'digital_governance',
    pillarLabel: 'Digital Governance',
    type: 'self_rating',
    difficulty: 'Medium',
    weight: 2,
    questionText: 'Self-Assessment: How familiar are you with Government Digital Governance mandates, including CERT-In security protocols, MeghRaj cloud guidelines, and DPDPA compliance?',
    options: [
      { id: 'opt_1', text: 'Level 1: Novice — Know general principles but unfamiliar with formal statutory requirements', scoreValue: 1 },
      { id: 'opt_2', text: 'Level 2: Basic — Follow standard password guidelines and departmental security memos', scoreValue: 2 },
      { id: 'opt_3', text: 'Level 3: Competent — Understand DPDPA data fiduciary duties and implement survey de-identification', scoreValue: 3 },
      { id: 'opt_4', text: 'Level 4: Proficient — Implement secure API tokens, RBAC permissions, and statistical disclosure controls', scoreValue: 4 },
      { id: 'opt_5', text: 'Level 5: Expert — Capable of auditing enterprise statistical cloud architectures and authoring security policies', scoreValue: 5 }
    ],
    domainRef: 'Data Privacy & Digital Personal Data Protection (DPDPA 2023)'
  },

  // ==========================================================================
  // PILLAR 4: LEADERSHIP & ETHICS (4 Questions)
  // ==========================================================================
  {
    id: 'diag_mgmt_01',
    pillar: 'managerial',
    pillarLabel: 'Leadership & Ethics',
    type: 'mcq',
    difficulty: 'Easy',
    weight: 1,
    questionText: 'According to the UN Fundamental Principles of Official Statistics, what is the core responsibility of official statisticians regarding methodologies and data sources?',
    options: [
      { id: 'opt_1', text: 'Methods must be kept confidential to avoid public debate', isCorrect: false },
      { id: 'opt_2', text: 'Statistical agencies must facilitate a correct interpretation of data and make sources, methods, and procedures fully transparent and publicly available', isCorrect: true, explanation: 'Principle 3 mandates full transparency of sources, concepts, and methods to maintain public trust and scientific integrity.' },
      { id: 'opt_3', text: 'Data collection methods should change unannounced each quarter', isCorrect: false },
      { id: 'opt_4', text: 'Results should only be shared with select commercial entities first', isCorrect: false }
    ],
    explanation: 'Principle 3 of the UN Fundamental Principles guarantees methodological transparency and accountability to uphold public trust in official statistics.',
    domainRef: 'Data Ethics, Scientific Integrity & Public Trust'
  },
  {
    id: 'diag_mgmt_02',
    pillar: 'managerial',
    pillarLabel: 'Leadership & Ethics',
    type: 'scenario',
    difficulty: 'Medium',
    weight: 2,
    questionText: 'Scenario: During real-time CAPI dashboard monitoring in a nationwide survey, an FOD supervisory officer notices that 3 field enumerators in a sub-district complete 25 long household interviews per day with an average completion duration of only 6 minutes per schedule (normal average is 45 minutes). What is the immediate supervisory action?',
    scenarioContext: 'Field Operations Division (FOD) - Quality Control & Scrutiny',
    options: [
      { id: 'opt_1', text: 'Praise the enumerators for high productivity and approve the batches', isCorrect: false },
      { id: 'opt_2', text: 'Flag the schedules as suspicious for curb-stoning, halt batch approvals, verify GPS timestamps and audio audit logs, and order immediate 10% re-interviews by senior field supervisors', isCorrect: true, explanation: 'Unrealistic completion speeds indicate fraudulent enumeration ("curb-stoning"); automated scrutiny rules mandate immediate audit and field verification.' },
      { id: 'opt_3', text: 'Delete the entire district from the survey without verification', isCorrect: false },
      { id: 'opt_4', text: 'Reduce the sample size by 50% for that state', isCorrect: false }
    ],
    explanation: 'CAPI scrutiny rules flag speeder anomalies. Standard operating procedures mandate halting batch acceptance and deploying independent re-interviews.',
    domainRef: 'Field Survey Project Management & CAPI Operations'
  },
  {
    id: 'diag_mgmt_03',
    pillar: 'managerial',
    pillarLabel: 'Leadership & Ethics',
    type: 'scenario',
    difficulty: 'Hard',
    weight: 3,
    questionText: 'Scenario: Ahead of a major national economic indicator release (e.g., quarterly GDP or CPI base revision), there is intense media and inter-ministerial speculation. As a senior statistical officer drafting the official release and Cabinet brief, what is the best practice for scientific integrity?',
    scenarioContext: 'National Accounts Division / Economic Statistics Division - Official Release',
    options: [
      { id: 'opt_1', text: 'Alter the deflator calculation to match previous quarterly market projections', isCorrect: false },
      { id: 'opt_2', text: 'Provide clear, objective documentation of revisions, data sources (e.g., GSTN/MCA-21 updates), statistical caveats, and maintain strict embargo until the official synchronized release hour', isCorrect: true, explanation: 'Scientific integrity requires strict adherence to standardized release calendars, full explanation of revisions, and unbiased reporting.' },
      { id: 'opt_3', text: 'Delay publication indefinitely until all market commentary subsides', isCorrect: false },
      { id: 'opt_4', text: 'Release preliminary raw spreadsheets without explanatory metadata', isCorrect: false }
    ],
    explanation: 'Adherence to the MoSPI Release Calendar, Advance Release Bulletins, and detailed methodological notes protects institutional credibility against external bias.',
    domainRef: 'Statistical Leadership & Inter-Ministerial Coordination'
  },
  {
    id: 'diag_mgmt_04',
    pillar: 'managerial',
    pillarLabel: 'Leadership & Ethics',
    type: 'self_rating',
    difficulty: 'Medium',
    weight: 2,
    questionText: 'Self-Assessment: Rate your experience in leading statistical working groups, coordinating with line ministries, and translating quantitative data into high-level policy notes:',
    options: [
      { id: 'opt_1', text: 'Level 1: Novice — Primarily focused on individual technical tasks and data entry', scoreValue: 1 },
      { id: 'opt_2', text: 'Level 2: Basic — Participated in internal division meetings and drafted basic technical summaries', scoreValue: 2 },
      { id: 'opt_3', text: 'Level 3: Competent — Supervise field/technical teams and prepare standard departmental reports', scoreValue: 3 },
      { id: 'opt_4', text: 'Level 4: Proficient — Lead inter-agency committees, draft policy briefs, and handle stakeholder coordination', scoreValue: 4 },
      { id: 'opt_5', text: 'Level 5: Expert — Direct national statistical policy formulation, lead international delegations, and manage organizational reform', scoreValue: 5 }
    ],
    domainRef: 'Statistical Leadership & Inter-Ministerial Coordination'
  }
];

/**
 * Role Target Benchmarks:
 * Maps user roles/cadres to expected proficiency targets (1-5 scale) across the 4 pillars.
 */
export const ROLE_PILLAR_TARGETS: Record<string, {
  statistical: number;
  technical: number;
  digital_governance: number;
  managerial: number;
}> = {
  // Director / Joint Director (ISS Senior Admin Grade)
  'Director (National Accounts Division)': { statistical: 5.0, technical: 4.0, digital_governance: 4.8, managerial: 4.8 },
  'Director / Joint Director': { statistical: 5.0, technical: 4.0, digital_governance: 4.8, managerial: 4.8 },
  'Director': { statistical: 5.0, technical: 4.0, digital_governance: 4.8, managerial: 4.8 },
  'Deputy Director': { statistical: 4.5, technical: 4.0, digital_governance: 4.5, managerial: 4.2 },
  'Assistant Director': { statistical: 4.2, technical: 3.8, digital_governance: 4.2, managerial: 3.8 },

  // Senior Statistical Officer (SSS / ISS)
  'Senior Statistical Officer (SSO)': { statistical: 4.2, technical: 4.0, digital_governance: 4.2, managerial: 3.8 },
  'Senior Statistical Officer': { statistical: 4.2, technical: 4.0, digital_governance: 4.2, managerial: 3.8 },
  'Junior Statistical Officer (JSO)': { statistical: 3.8, technical: 3.8, digital_governance: 3.8, managerial: 3.2 },
  'Junior Statistical Officer': { statistical: 3.8, technical: 3.8, digital_governance: 3.8, managerial: 3.2 },
  'Statistical Officer': { statistical: 4.0, technical: 3.8, digital_governance: 4.0, managerial: 3.5 },

  // Field Operations
  'Field Investigator': { statistical: 3.5, technical: 3.2, digital_governance: 4.0, managerial: 3.5 },
  'Primary Enumeration Officer': { statistical: 3.5, technical: 3.2, digital_governance: 4.0, managerial: 3.5 },

  // Data Science / Technical Specialists
  'Data Scientist / Statistical Officer (DIID)': { statistical: 4.0, technical: 5.0, digital_governance: 4.5, managerial: 3.8 },
  'Data Scientist': { statistical: 4.0, technical: 5.0, digital_governance: 4.5, managerial: 3.8 },
  'Informatics Specialist': { statistical: 4.0, technical: 5.0, digital_governance: 4.5, managerial: 3.8 },

  // Default fallback benchmark
  'default': { statistical: 4.0, technical: 3.8, digital_governance: 4.0, managerial: 3.8 }
};

/**
 * Determine Target Levels based on user designation and cadre
 */
export function getRolePillarTargets(designation: string, cadre?: string) {
  const norm = designation?.trim() || '';
  for (const [key, targets] of Object.entries(ROLE_PILLAR_TARGETS)) {
    if (key !== 'default' && norm.toLowerCase().includes(key.toLowerCase())) {
      return targets;
    }
  }

  if (cadre === 'ISS') {
    return { statistical: 4.8, technical: 4.2, digital_governance: 4.5, managerial: 4.5 };
  } else if (cadre === 'SSS') {
    return { statistical: 4.0, technical: 3.8, digital_governance: 4.0, managerial: 3.6 };
  } else if (cadre === 'Field_Investigator') {
    return { statistical: 3.5, technical: 3.2, digital_governance: 4.0, managerial: 3.5 };
  } else if (cadre === 'Data_Scientist_MoSPI') {
    return { statistical: 4.0, technical: 5.0, digital_governance: 4.5, managerial: 3.8 };
  }

  return ROLE_PILLAR_TARGETS['default'];
}

/**
 * Intelligent Scoring & Leveling Engine:
 * - Computes objective score (MCQ & scenario correct answers weighted by difficulty)
 * - Computes self-rating score
 * - Blends objective performance (70%) + self-assessment (30%)
 * - Maps to 1.0 - 5.0 proficiency level
 * - Calculates gaps vs role target benchmarks
 * - Calibrates all individual CompetencyItems in user's profile
 */
export function calculateDiagnosticResult(
  user: UserProfile,
  answers: Record<string, string>,
  timeSpentSeconds: number
): { result: InitialDiagnosticResult; calibratedCompetencies: CompetencyItem[] } {
  const pillars: CompetencyDomain[] = ['statistical', 'technical', 'digital_governance', 'managerial'];
  const targets = getRolePillarTargets(user.designation, user.cadre);

  const pillarScoresAcc: Record<CompetencyDomain, {
    objectiveEarnedWeight: number;
    objectiveTotalWeight: number;
    selfRatingValue: number;
    questionCount: number;
  }> = {
    statistical: { objectiveEarnedWeight: 0, objectiveTotalWeight: 0, selfRatingValue: 3, questionCount: 0 },
    technical: { objectiveEarnedWeight: 0, objectiveTotalWeight: 0, selfRatingValue: 3, questionCount: 0 },
    digital_governance: { objectiveEarnedWeight: 0, objectiveTotalWeight: 0, selfRatingValue: 3, questionCount: 0 },
    managerial: { objectiveEarnedWeight: 0, objectiveTotalWeight: 0, selfRatingValue: 3, questionCount: 0 },
  };

  // Evaluate each answered question
  DIAGNOSTIC_QUESTIONS.forEach((q) => {
    const p = q.pillar;
    const selectedOptionId = answers[q.id];
    const selectedOption = q.options.find(o => o.id === selectedOptionId);

    if (q.type === 'self_rating') {
      if (selectedOption?.scoreValue) {
        pillarScoresAcc[p].selfRatingValue = selectedOption.scoreValue;
      }
    } else {
      pillarScoresAcc[p].objectiveTotalWeight += q.weight;
      pillarScoresAcc[p].questionCount += 1;
      if (selectedOption?.isCorrect) {
        pillarScoresAcc[p].objectiveEarnedWeight += q.weight;
      }
    }
  });

  const pillarScoresFormatted: InitialDiagnosticResult['pillarScores'] = {} as any;
  let overallIndexSum = 0;
  const identifiedGaps: InitialDiagnosticResult['topPriorityGaps'] = [];

  const pillarLabels: Record<CompetencyDomain, string> = {
    statistical: 'Statistical Methods',
    technical: 'Technical & Python/AI',
    digital_governance: 'Digital Governance',
    managerial: 'Leadership & Ethics'
  };

  pillars.forEach((p) => {
    const acc = pillarScoresAcc[p];
    const target = (targets as any)[p] || 4.0;
    
    // Objective accuracy (0.0 to 1.0)
    const objRatio = acc.objectiveTotalWeight > 0 ? (acc.objectiveEarnedWeight / acc.objectiveTotalWeight) : 0.5;
    
    // Convert objective ratio to 1.0 - 5.0 scale (e.g. 0% -> 1.0, 100% -> 5.0)
    const objScaled = 1.0 + (objRatio * 4.0);
    
    // Self rating value (1.0 to 5.0)
    const selfVal = acc.selfRatingValue || 3.0;

    // Blended level: 70% objective performance + 30% self assessment
    const rawCalculated = (objScaled * 0.70) + (selfVal * 0.30);
    const calculatedLevel = Math.max(1.0, Math.min(5.0, Number(rawCalculated.toFixed(1))));

    const gapVal = Math.max(0, Number((target - calculatedLevel).toFixed(1)));

    let severity: DiagnosticPillarScore['severity'] = 'Met';
    if (gapVal >= 2.0) severity = 'Critical';
    else if (gapVal >= 1.0) severity = 'High';
    else if (gapVal >= 0.5) severity = 'Medium';
    else if (gapVal > 0) severity = 'Low';

    const confidenceScore = Math.round((acc.objectiveEarnedWeight / Math.max(1, acc.objectiveTotalWeight)) * 100);

    const scoreObj: DiagnosticPillarScore = {
      pillar: p,
      pillarLabel: pillarLabels[p],
      currentLevel: calculatedLevel,
      targetLevel: target,
      gap: gapVal,
      severity,
      objectiveScore: acc.objectiveEarnedWeight,
      objectiveTotal: acc.objectiveTotalWeight,
      selfRatingLevel: selfVal,
      confidenceScore: isNaN(confidenceScore) ? 75 : confidenceScore
    };

    pillarScoresFormatted[p] = scoreObj;
    overallIndexSum += calculatedLevel;

    if (gapVal > 0) {
      identifiedGaps.push({
        competencyName: pillarLabels[p],
        pillarLabel: pillarLabels[p],
        currentLevel: calculatedLevel,
        targetLevel: target,
        gap: gapVal,
        severity: severity === 'Met' ? 'Low' : severity
      });
    }
  });

  // Sort gaps by severity and magnitude
  identifiedGaps.sort((a, b) => b.gap - a.gap);

  const overallIndex = Number((overallIndexSum / 4).toFixed(1));

  const result: InitialDiagnosticResult = {
    testId: `diag_sub_${Date.now()}`,
    testVersion: DIAGNOSTIC_TEST_VERSION,
    completedAt: new Date().toISOString(),
    overallIndex,
    timeSpentSeconds,
    pillarScores: pillarScoresFormatted,
    answers,
    identifiedGapsCount: identifiedGaps.length,
    topPriorityGaps: identifiedGaps.slice(0, 3)
  };

  // Calibrate user's detailed competencies based on measured pillar scores
  const calibratedCompetencies: CompetencyItem[] = user.competencies.map((comp) => {
    const pScore = pillarScoresFormatted[comp.category];
    if (!pScore) return comp;

    // Convert continuous 1.0-5.0 to integer proficiency 1-5
    const roundedLevel = Math.round(pScore.currentLevel) as ProficiencyLevel;
    const boundedLevel = Math.max(1, Math.min(5, roundedLevel)) as ProficiencyLevel;
    const compTarget = comp.targetLevel || Math.round(pScore.targetLevel) as ProficiencyLevel;
    const gap = Math.max(0, compTarget - boundedLevel);

    let priority: CompetencyItem['priority'] = 'low';
    if (gap >= 2) priority = 'critical';
    else if (gap === 1) priority = 'high';
    else if (gap === 0) priority = 'low';

    return {
      ...comp,
      currentLevel: boundedLevel,
      targetLevel: compTarget,
      gap,
      priority
    };
  });

  return { result, calibratedCompetencies };
}
