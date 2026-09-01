import React, { useState } from 'react';
import { UserProfile, CompetencyDomain } from '../types';
import { 
  Building2, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Filter, 
  Sparkles,
  Layers,
  FileCheck,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowUpRight,
  Sliders,
  ChevronRight,
  Check
} from 'lucide-react';
import { DEPARTMENT_HEATMAP_DATA, HeatmapCell } from '../data/mockData';
import { RoleSkillTwinManager } from './RoleSkillTwinManager';
import { CapacitySimulator } from './CapacitySimulator';

interface AdminDashboardProps {
  currentUser: UserProfile;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [adminTab, setAdminTab] = useState<'workforce_intelligence' | 'digital_twins' | 'capacity_simulator'>('workforce_intelligence');
  const [selectedWing, setSelectedWing] = useState<string>('all');
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<HeatmapCell | null>(null);
  const [reportExported, setReportExported] = useState<boolean>(false);

  // Realistic MoSPI / Cadre Analytics Aggregate Data
  const wingStats = [
    { wing: 'NAD', name: 'National Accounts Division', totalOfficers: 142, avgProficiency: 3.8, cpdCompliance: 84, topGap: 'SNA 2008 Supply-Use & SUT' },
    { wing: 'FOD', name: 'Field Operations Division', totalOfficers: 420, avgProficiency: 3.2, cpdCompliance: 71, topGap: 'CAPI & Digital Microdata Scrutiny' },
    { wing: 'ESD', name: 'Economic Statistics Division', totalOfficers: 110, avgProficiency: 3.5, cpdCompliance: 79, topGap: 'Index Number Construction (CPI/IIP)' },
    { wing: 'SDRD', name: 'Survey Design & Research Division', totalOfficers: 95, avgProficiency: 3.9, cpdCompliance: 86, topGap: 'Multi-Stage Complex Sampling' },
    { wing: 'SSD', name: 'Social Statistics Division', totalOfficers: 88, avgProficiency: 3.6, cpdCompliance: 82, topGap: 'SDG Indicator Tracking & Metadata' },
    { wing: 'DIID', name: 'Data Informatics & Innovation Division', totalOfficers: 65, avgProficiency: 4.1, cpdCompliance: 92, topGap: 'Big Data & Cloud Analytics Architecture' },
  ];

  const prioritySkillsRanked = [
    { rank: 1, skill: 'AI & NLP for Survey Scrutiny & Coding', avgGap: 1.8, affectedOfficers: 580, priority: 'Critical', domain: 'Technical' },
    { rank: 2, skill: 'Python / Polars for Large Microdata', avgGap: 1.6, affectedOfficers: 512, priority: 'Critical', domain: 'Technical' },
    { rank: 3, skill: 'DPDPA 2023 Microdata Anonymization', avgGap: 1.4, affectedOfficers: 780, priority: 'Critical', domain: 'Digital Governance' },
    { rank: 4, skill: 'SNA 2008 & 2025 Revision Transition', avgGap: 1.1, affectedOfficers: 260, priority: 'High', domain: 'Statistical' },
    { rank: 5, skill: 'Geospatial & Satellite Imagery (GIS)', avgGap: 1.0, affectedOfficers: 340, priority: 'High', domain: 'Technical' },
  ];

  const quarterlyTrends = [
    { quarter: 'Q1 2025', statistical: 3.2, technical: 2.4, governance: 2.8, cpdTargetMet: 62 },
    { quarter: 'Q2 2025', statistical: 3.4, technical: 2.7, governance: 3.1, cpdTargetMet: 68 },
    { quarter: 'Q3 2025', statistical: 3.5, technical: 2.9, governance: 3.4, cpdTargetMet: 73 },
    { quarter: 'Q4 2025', statistical: 3.7, technical: 3.2, governance: 3.6, cpdTargetMet: 78 },
    { quarter: 'Q1 2026', statistical: 3.8, technical: 3.5, governance: 3.8, cpdTargetMet: 84 },
  ];

  const filteredWings = selectedWing === 'all' ? wingStats : wingStats.filter(w => w.wing === selectedWing);
  const filteredHeatmap = selectedWing === 'all' ? DEPARTMENT_HEATMAP_DATA : DEPARTMENT_HEATMAP_DATA.filter(h => h.wing === selectedWing);

  // Distinct competencies for matrix view
  const matrixCompetencyNames = Array.from(new Set(DEPARTMENT_HEATMAP_DATA.map(h => h.competencyName)));
  const matrixWings = ['NAD', 'FOD', 'ESD', 'SDRD', 'DIID'];

  const exportInstitutionalReport = () => {
    let report = `========================================================================\n`;
    report += `NATIONAL STATISTICAL SYSTEMS TRAINING ACADEMY (NSSTA)\n`;
    report += `MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION (MoSPI)\n`;
    report += `WORKFORCE INTELLIGENCE & TPAC GOVERNANCE AUDIT REPORT\n`;
    report += `Date of Generation: ${new Date().toLocaleDateString()}\n`;
    report += `Authorized Officer: ${currentUser.name} (${currentUser.designation})\n`;
    report += `========================================================================\n\n`;

    report += `1. CADRE CPD COMPLIANCE SUMMARY (MISSION KARMAYOGI 50 HRS TARGET):\n`;
    report += `• Total Statistical Cadre Enrolled: 920 Officers\n`;
    report += `• Average Ministry-Wide CPD Completion: 78.4%\n`;
    report += `• TPAC Accredited Batches Conducted: 48 Residential / Virtual Modules\n\n`;

    report += `2. TOP PRIORITY CADRE COMPETENCY GAPS:\n`;
    prioritySkillsRanked.forEach((s) => {
      report += `• [Rank ${s.rank}] ${s.skill} | Avg Gap: -${s.avgGap} | Affected Staff: ${s.affectedOfficers} | Priority: ${s.priority}\n`;
    });

    report += `\n3. DIVISION-WISE COMPETENCY & GAP PROFILES:\n`;
    wingStats.forEach((w) => {
      report += `• [${w.wing}] ${w.name}\n`;
      report += `  - Total Officers: ${w.totalOfficers} | Avg Proficiency: ${w.avgProficiency}/5.0\n`;
      report += `  - CPD Compliance: ${w.cpdCompliance}% | High Priority Developmental Need: ${w.topGap}\n`;
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MoSPI_NSSTA_Workforce_Intelligence_Report_${new Date().getFullYear()}.txt`;
    a.click();

    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Main Banner & Tab Navigation */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA] text-xs font-semibold border border-blue-100 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>NSSTA & MoSPI Executive Intelligence</span>
            </span>
            <span className="text-xs text-slate-500">
              National Statistical Cadre Oversight
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-heading">
            Workforce Intelligence & Institutional Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
            Integrated command center for competency heatmaps, role-to-skill digital twins, and predictive capacity simulation.
          </p>
        </div>

        <button
          type="button"
          onClick={exportInstitutionalReport}
          className="py-2.5 px-5 bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold text-xs sm:text-sm rounded-lg transition shadow-xs flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          {reportExported ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Report Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#F4B400]" />
              <span>Export Audit Report</span>
            </>
          )}
        </button>
      </section>

      {/* Admin Module Sub-Nav Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg p-1.5 shadow-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setAdminTab('workforce_intelligence')}
          className={`flex-1 min-w-[200px] py-2 px-4 rounded-md text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
            adminTab === 'workforce_intelligence'
              ? 'bg-[#1E3ABA] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Workforce Heatmap & Trends (Mod 8)</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('digital_twins')}
          className={`flex-1 min-w-[200px] py-2 px-4 rounded-md text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
            adminTab === 'digital_twins'
              ? 'bg-[#1E3ABA] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Role Digital Twin Framework (Mod 1)</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('capacity_simulator')}
          className={`flex-1 min-w-[200px] py-2 px-4 rounded-md text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
            adminTab === 'capacity_simulator'
              ? 'bg-[#1E3ABA] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Capacity Simulator (Mod 10)</span>
        </button>
      </div>

      {/* Render Sub-Components based on Tab */}
      {adminTab === 'digital_twins' && (
        <RoleSkillTwinManager />
      )}

      {adminTab === 'capacity_simulator' && (
        <CapacitySimulator />
      )}

      {adminTab === 'workforce_intelligence' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-[#1E3ABA] transition">
              <div className="flex items-center justify-between mb-3">
                <div className="icon-badge-blue">
                  <Users className="w-5 h-5 text-[#1E3ABA]" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA]">
                  ISS / SSS Cadre
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-600">Total Statistical Cadre</div>
              <div className="text-3xl font-bold text-slate-900 font-heading tracking-tight mt-1">
                920 <span className="text-xs font-normal text-slate-500 font-sans">Officers</span>
              </div>
              <p className="text-[11px] text-[#1E3ABA] mt-1.5 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#1E3ABA]" />
                <span>+42 newly inducted ISS probationers</span>
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-600 transition">
              <div className="flex items-center justify-between mb-3">
                <div className="icon-badge-green">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                  Karmayogi Target
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-600">Ministry CPD Compliance</div>
              <div className="text-3xl font-bold text-emerald-700 font-heading tracking-tight mt-1">
                78.4%
              </div>
              <p className="text-[11px] text-emerald-800 mt-1.5 font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>Target: 50 hrs / officer / annum</span>
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-[#1E3ABA] transition">
              <div className="flex items-center justify-between mb-3">
                <div className="icon-badge-blue">
                  <BarChart3 className="w-5 h-5 text-[#1E3ABA]" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA]">
                  National Level
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-600">Avg Competency Index</div>
              <div className="text-3xl font-bold text-slate-900 font-heading tracking-tight mt-1">
                3.6 <span className="text-sm font-normal text-slate-500 font-mono">/ 5.0</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5 font-medium">
                +0.4 increase across 2025–2026 audits
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-[#E63946] transition">
              <div className="flex items-center justify-between mb-3">
                <div className="icon-badge-red">
                  <AlertTriangle className="w-5 h-5 text-[#E63946]" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-[#E63946]">
                  Priority Attention
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-600">Critical Cadre Gaps</div>
              <div className="text-3xl font-bold text-[#E63946] font-heading tracking-tight mt-1">
                3 <span className="text-sm font-normal text-slate-500">Domains</span>
              </div>
              <p className="text-[11px] text-[#E63946] mt-1.5 font-medium truncate">
                AI Coding, Microdata, DPDPA
              </p>
            </div>

          </section>

          {/* Module 8: Cadre Competency Heatmap */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA] border border-blue-100 text-xs font-semibold uppercase tracking-wider">
                  Module 8 • Cadre Competency Heatmap
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 flex items-center gap-2 font-heading">
                  Competency Heatmap Matrix (Wings × Core Competencies)
                </h3>
                <p className="text-xs text-slate-600">
                  Interactive matrix color-coded by average validated proficiency. Red = Critical Gap (≥1.5), Amber = Moderate Gap (0.5–1.4), Green = Met / Benchmark.
                </p>
              </div>

              {/* Heatmap Legend */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-slate-600">Critical Gap</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-slate-600">Moderate Gap</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600" />
                  <span className="text-slate-600">Target Met</span>
                </div>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 min-w-[220px]">Competency Area</th>
                    {matrixWings.map(wing => (
                      <th key={wing} className="p-3.5 text-center min-w-[110px]">
                        {wing}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-mono">
                  {matrixCompetencyNames.map((compName) => (
                    <tr key={compName} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-sans font-semibold text-slate-900">
                        {compName}
                      </td>
                      {matrixWings.map(wing => {
                        const cell = DEPARTMENT_HEATMAP_DATA.find(
                          h => h.wing === wing && h.competencyName === compName
                        );

                        if (!cell) {
                          return (
                            <td key={wing} className="p-3 text-center text-slate-400">
                              —
                            </td>
                          );
                        }

                        let cellClass = 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100';
                        if (cell.status === 'critical') {
                          cellClass = 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100';
                        } else if (cell.status === 'moderate') {
                          cellClass = 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100';
                        }

                        return (
                          <td key={wing} className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedHeatmapCell(cell)}
                              className={`w-full py-2 px-2 rounded-lg border font-bold text-xs transition cursor-pointer flex flex-col items-center justify-center ${cellClass}`}
                            >
                              <span>{cell.avgProficiency} / {cell.targetProficiency}</span>
                              <span className="text-[9px] opacity-80 mt-0.5">
                                {cell.status === 'met' ? 'Met' : `-${cell.gap} Gap`}
                              </span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Cell Drilldown Banner */}
            {selectedHeatmapCell && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1E3ABA] font-mono">
                      {selectedHeatmapCell.wingLabel}
                    </span>
                    <span className="text-xs text-slate-900 font-bold">
                      {selectedHeatmapCell.competencyName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">
                    Avg Proficiency: <strong className="text-slate-900 font-mono">{selectedHeatmapCell.avgProficiency} / 5.0</strong> • Target: <strong className="text-[#1E3ABA] font-mono">{selectedHeatmapCell.targetProficiency}</strong> • Gap: <strong className="text-[#E63946] font-mono">-{selectedHeatmapCell.gap}</strong> • <span className="text-amber-800 font-semibold">{selectedHeatmapCell.criticalGapRatePercent}% of cadre has high severity gap</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setAdminTab('capacity_simulator')}
                    className="px-3 py-1.5 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Simulate Intervention</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedHeatmapCell(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 px-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Priority Skills List & Longitudinal Trends Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Priority Skills List */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                    <AlertTriangle className="w-4 h-4 text-[#E63946]" />
                    Priority Skills List (Highest Organization-Wide Gaps)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Ranked by severity and total volume of affected statistical officers.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {prioritySkillsRanked.map((item) => (
                  <div
                    key={item.rank}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs ${
                        item.priority === 'Critical'
                          ? 'bg-red-100 text-[#E63946]'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        #{item.rank}
                      </span>

                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {item.skill}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Domain: <span className="text-slate-700">{item.domain}</span> • <strong className="text-slate-800">{item.affectedOfficers} Officers Affected</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-mono font-bold text-[#E63946]">
                        -{item.avgGap} Gap
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Longitudinal Trends */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                    <TrendingUp className="w-4 h-4 text-[#1E3ABA]" />
                    Longitudinal Trends (Competency Growth Over Quarters)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Average domain proficiency evolution across 2025–2026.
                  </p>
                </div>
              </div>

              {/* Visual Bars Chart */}
              <div className="space-y-4 pt-1">
                {quarterlyTrends.map((q) => (
                  <div key={q.quarter} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 font-mono">{q.quarter}</span>
                      <span className="text-[#1E3ABA] font-mono font-semibold">
                        CPD Target Met: {q.cpdTargetMet}%
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {/* Statistical Bar */}
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-20 text-slate-600 shrink-0">Statistical</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#1E3ABA] h-full rounded-full"
                            style={{ width: `${(q.statistical / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-slate-800 font-mono w-8 text-right">{q.statistical}</span>
                      </div>

                      {/* Technical Bar */}
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-20 text-slate-600 shrink-0">Technical</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${(q.technical / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-slate-800 font-mono w-8 text-right">{q.technical}</span>
                      </div>

                      {/* Governance Bar */}
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-20 text-slate-600 shrink-0">Governance</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#D97706] h-full rounded-full"
                            style={{ width: `${(q.governance / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-slate-800 font-mono w-8 text-right">{q.governance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
