import React, { useState, useEffect } from 'react';
import { 
  RoleDigitalTwin, 
  RoleCompetencyRequirement, 
  ProficiencyLevel, 
  EvidenceType, 
  AssessmentMethod,
  CompetencyDomain
} from '../types';
import { 
  MOCK_ROLE_DIGITAL_TWINS 
} from '../data/mockData';
import { 
  saveRoleDigitalTwin, 
  fetchRoleDigitalTwins 
} from '../firebase';
import { 
  Layers, 
  Edit3, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  ShieldCheck, 
  Award, 
  Building2, 
  Sparkles,
  ChevronRight,
  BookOpen,
  CloudCheck,
  RefreshCw
} from 'lucide-react';

const EVIDENCE_OPTIONS: EvidenceType[] = [
  'iGOT Course Certificate',
  'NSSTA Assessment',
  'Field Work Quality Audit',
  'Research Publication',
  'Code & Model Sandbox',
  'Supervisor Endorsement'
];

const ASSESSMENT_METHODS: AssessmentMethod[] = [
  'AI Quiz & MCQ Test',
  'Practical Lab Simulation',
  'Supervisor Review',
  'Self-Assessment',
  'Peer Review'
];

export const RoleSkillTwinManager: React.FC = () => {
  const [roles, setRoles] = useState<RoleDigitalTwin[]>(MOCK_ROLE_DIGITAL_TWINS);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(MOCK_ROLE_DIGITAL_TWINS[0]?.id || 'role_stat_officer');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Load from Firestore / Local Storage on mount
  useEffect(() => {
    async function loadRoles() {
      try {
        const storedRoles = await fetchRoleDigitalTwins();
        if (storedRoles && storedRoles.length > 0) {
          // Merge with mock defaults if needed
          const merged = MOCK_ROLE_DIGITAL_TWINS.map(mock => {
            const found = storedRoles.find(s => s.id === mock.id);
            return found ? { ...mock, ...found } : mock;
          });
          // Add any custom newly created roles not in mock
          const customOnly = storedRoles.filter(s => !MOCK_ROLE_DIGITAL_TWINS.some(m => m.id === s.id));
          setRoles([...merged, ...customOnly]);
        }
      } catch (e) {
        console.warn('Could not load custom role digital twins:', e);
      }
    }
    loadRoles();
  }, []);

  // New Competency Form State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCompName, setNewCompName] = useState<string>('');
  const [newCompDomain, setNewCompDomain] = useState<CompetencyDomain>('statistical');
  const [newCompTargetLevel, setNewCompTargetLevel] = useState<ProficiencyLevel>(4);
  const [newCompEvidence, setNewCompEvidence] = useState<EvidenceType>('iGOT Course Certificate');
  const [newCompMethod, setNewCompMethod] = useState<AssessmentMethod>('AI Quiz & MCQ Test');
  const [newCompImportance, setNewCompImportance] = useState<'Core' | 'Specialized' | 'Prerequisite'>('Core');

  const activeRole = roles.find(r => r.id === selectedRoleId) || roles[0] || MOCK_ROLE_DIGITAL_TWINS[0];

  const handleUpdateRequirement = (
    competencyId: string,
    field: keyof RoleCompetencyRequirement,
    value: any
  ) => {
    if (!activeRole) return;
    const updatedRoles = roles.map(r => {
      if (r.id !== activeRole.id) return r;
      const updatedComp = r.competencies.map(c => {
        if (c.competencyId === competencyId) {
          return { ...c, [field]: value };
        }
        return c;
      });
      const updatedR = { ...r, competencies: updatedComp };
      saveRoleDigitalTwin(updatedR);
      return updatedR;
    });
    setRoles(updatedRoles);
  };

  const handleDeleteRequirement = (competencyId: string) => {
    if (!activeRole) return;
    const updatedRoles = roles.map(r => {
      if (r.id !== activeRole.id) return r;
      const updatedComp = r.competencies.filter(c => c.competencyId !== competencyId);
      const updatedR = { ...r, competencies: updatedComp };
      saveRoleDigitalTwin(updatedR);
      return updatedR;
    });
    setRoles(updatedRoles);
  };

  const handleAddCompetency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim() || !activeRole) return;

    const newReq: RoleCompetencyRequirement = {
      competencyId: `comp_custom_${Date.now()}`,
      competencyName: newCompName.trim(),
      category: newCompDomain,
      targetLevel: newCompTargetLevel,
      evidenceType: newCompEvidence,
      assessmentMethod: newCompMethod,
      importance: newCompImportance,
      description: `Target benchmark for ${activeRole.roleTitle}`
    };

    const updatedRoles = roles.map(r => {
      if (r.id !== activeRole.id) return r;
      const updatedR = {
        ...r,
        competencies: [...r.competencies, newReq]
      };
      saveRoleDigitalTwin(updatedR);
      return updatedR;
    });

    setRoles(updatedRoles);
    setNewCompName('');
    setShowAddModal(false);
  };

  const handleSaveChanges = async () => {
    setIsSyncing(true);
    if (activeRole) {
      await saveRoleDigitalTwin(activeRole);
    }
    setIsSyncing(false);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };


  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#1E3ABA] text-xs font-semibold uppercase tracking-wider">
                Module 1 • Digital Twin Architecture
              </span>
              <span className="text-xs text-slate-500">
                MoSPI Competency Framework Engine
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2 font-heading">
              Role-to-Skill Digital Twin Manager
              <Layers className="w-5 h-5 text-[#1E3ABA]" />
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              Map and calibrate official job roles against target proficiency levels (1–5), requisite evidence artifacts (e.g. iGOT certificates, NSSTA exams), and proctoring assessment methods.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-[#1E3ABA] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Map New Competency</span>
            </button>

            <button
              type="button"
              onClick={handleSaveChanges}
              className="px-4 py-2 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved Framework!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Role Mappings</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
          {roles.map((r) => {
            const isSelected = r.id === selectedRoleId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoleId(r.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#1E3ABA] border-[#1E3ABA] text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{r.roleTitle.split('(')[0].trim()}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-700'}`}>
                  {r.cadre}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Details & Mapped Competencies Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        {/* Role Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {activeRole.roleTitle}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Wing: {activeRole.department}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {activeRole.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg">
            <div>
              <div className="text-slate-500 text-[10px]">Min. Experience</div>
              <div className="font-bold text-slate-900 font-mono">{activeRole.minimumExperienceYears} Years</div>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <div className="text-slate-500 text-[10px]">Annual CPD Target</div>
              <div className="font-bold text-[#1E3ABA] font-mono">{activeRole.cpdAnnualTargetHours} Hours</div>
            </div>
          </div>
        </div>

        {/* Competencies Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider font-mono border-b border-slate-200">
              <tr>
                <th className="p-3">Competency Name</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Target Level (1–5)</th>
                <th className="p-3">Evidence Artifact</th>
                <th className="p-3">Assessment Method</th>
                <th className="p-3">Priority</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {activeRole.competencies.map((comp) => (
                <tr key={comp.competencyId} className="hover:bg-slate-50/80 transition">
                  {/* Name & Description */}
                  <td className="p-3 max-w-xs">
                    <div className="font-bold text-slate-900">{comp.competencyName}</div>
                    {comp.description && (
                      <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {comp.description}
                      </div>
                    )}
                  </td>

                  {/* Domain */}
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#1E3ABA] border border-blue-100">
                      {comp.category}
                    </span>
                  </td>

                  {/* Target Level Selector */}
                  <td className="p-3">
                    <select
                      value={comp.targetLevel}
                      onChange={(e) => handleUpdateRequirement(comp.competencyId, 'targetLevel', Number(e.target.value) as ProficiencyLevel)}
                      className="bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold rounded px-2 py-1 focus:outline-none focus:border-[#1E3ABA]"
                    >
                      <option value={1}>Level 1 (Novice)</option>
                      <option value={2}>Level 2 (Beginner)</option>
                      <option value={3}>Level 3 (Competent)</option>
                      <option value={4}>Level 4 (Proficient)</option>
                      <option value={5}>Level 5 (Expert)</option>
                    </select>
                  </td>

                  {/* Evidence Type */}
                  <td className="p-3">
                    <select
                      value={comp.evidenceType}
                      onChange={(e) => handleUpdateRequirement(comp.competencyId, 'evidenceType', e.target.value as EvidenceType)}
                      className="bg-slate-50 border border-slate-300 text-slate-800 rounded px-2 py-1 focus:outline-none focus:border-[#1E3ABA]"
                    >
                      {EVIDENCE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Assessment Method */}
                  <td className="p-3">
                    <select
                      value={comp.assessmentMethod}
                      onChange={(e) => handleUpdateRequirement(comp.competencyId, 'assessmentMethod', e.target.value as AssessmentMethod)}
                      className="bg-slate-50 border border-slate-300 text-slate-800 rounded px-2 py-1 focus:outline-none focus:border-[#1E3ABA]"
                    >
                      {ASSESSMENT_METHODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Importance */}
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      comp.importance === 'Core'
                        ? 'bg-red-50 text-[#E63946] border border-red-200'
                        : 'bg-blue-50 text-[#1E3ABA] border border-blue-200'
                    }`}>
                      {comp.importance}
                    </span>
                  </td>

                  {/* Delete Action */}
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteRequirement(comp.competencyId)}
                      title="Remove competency from role"
                      className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Competency Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-heading">
                <Plus className="w-5 h-5 text-[#1E3ABA]" />
                Add Competency to {activeRole.roleTitle.split('(')[0]}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCompetency} className="space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Competency Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hedonic Price Regression in CPI"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#1E3ABA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Domain
                  </label>
                  <select
                    value={newCompDomain}
                    onChange={(e) => setNewCompDomain(e.target.value as CompetencyDomain)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#1E3ABA]"
                  >
                    <option value="statistical">Statistical</option>
                    <option value="technical">Technical</option>
                    <option value="digital_governance">Digital Governance</option>
                    <option value="managerial">Managerial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Target Level
                  </label>
                  <select
                    value={newCompTargetLevel}
                    onChange={(e) => setNewCompTargetLevel(Number(e.target.value) as ProficiencyLevel)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#1E3ABA]"
                  >
                    <option value={1}>Level 1 (Novice)</option>
                    <option value={2}>Level 2 (Beginner)</option>
                    <option value={3}>Level 3 (Competent)</option>
                    <option value={4}>Level 4 (Proficient)</option>
                    <option value={5}>Level 5 (Expert)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Evidence Type
                  </label>
                  <select
                    value={newCompEvidence}
                    onChange={(e) => setNewCompEvidence(e.target.value as EvidenceType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#1E3ABA]"
                  >
                    {EVIDENCE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Assessment Method
                  </label>
                  <select
                    value={newCompMethod}
                    onChange={(e) => setNewCompMethod(e.target.value as AssessmentMethod)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#1E3ABA]"
                  >
                    {ASSESSMENT_METHODS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Add Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
