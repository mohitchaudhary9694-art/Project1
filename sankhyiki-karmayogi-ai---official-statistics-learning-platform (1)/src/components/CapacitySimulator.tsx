import React, { useState } from 'react';
import { 
  CapacitySimulationResult 
} from '../types';
import { 
  SAMPLE_CAPACITY_SCENARIOS 
} from '../data/mockData';
import { 
  Sliders, 
  Users, 
  Clock, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Play,
  IndianRupee,
  Building2,
  Check
} from 'lucide-react';

interface ScenarioOption {
  id: string;
  title: string;
  description: string;
  data: CapacitySimulationResult;
}

export const CapacitySimulator: React.FC = () => {
  const scenarioKeys = Object.keys(SAMPLE_CAPACITY_SCENARIOS);
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>(scenarioKeys[0] || 'comp_tech_1');
  const activeScenario = SAMPLE_CAPACITY_SCENARIOS[selectedScenarioKey] || SAMPLE_CAPACITY_SCENARIOS['comp_tech_1'];

  const [customCohortSize, setCustomCohortSize] = useState<number>(activeScenario.targetOfficersCount);
  const [customHoursPerWeek, setCustomHoursPerWeek] = useState<number>(4);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedFeedback, setSimulatedFeedback] = useState<boolean>(false);

  // Re-calculate when scenario selection changes
  const handleSelectScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = SAMPLE_CAPACITY_SCENARIOS[key];
    if (sc) {
      setCustomCohortSize(sc.targetOfficersCount);
    }
  };

  // Proportional math
  const baseCount = activeScenario.targetOfficersCount || 400;
  const ratio = customCohortSize / baseCount;
  const computedHighGapOfficers = Math.round(activeScenario.priorityLearnersHighGap * ratio);
  const totalTrainingHours = Math.round(customCohortSize * activeScenario.recommendedCourseHours);
  const estimatedBudgetINR = Math.round(customCohortSize * activeScenario.estimatedTrainingCostPerOfficer);
  const avgWeeksNeeded = ((activeScenario.recommendedCourseHours / customHoursPerWeek)).toFixed(1);
  const avgMonthsNeeded = (Number(avgWeeksNeeded) / 4.3).toFixed(1);

  const handleRunSim = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulatedFeedback(true);
      setTimeout(() => setSimulatedFeedback(false), 2500);
    }, 400);
  };

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#1E3ABA] text-xs font-semibold uppercase tracking-wider">
                Module 10 • Strategic Capacity Simulation
              </span>
              <span className="text-xs text-slate-500">
                MoSPI Executive Planning & Budget Modeler
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2 font-heading">
              Capacity-Building "What-If" Simulator
              <Sliders className="w-5 h-5 text-[#1E3ABA]" />
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              Model workforce upskilling trajectories, resource investments, and operational timelines for institutional reforms prior to launching training campaigns.
            </p>
          </div>
        </div>

        {/* Mandatory Official Disclaimer Banner */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
          <div className="text-xs text-amber-900">
            <strong>Scenario Estimate — not a guaranteed outcome.</strong> Predictions are calibrated using NSSTA historical completion velocities, initial gap distributions, and accredited iGOT Karmayogi assessment metrics.
          </div>
        </div>
      </div>

      {/* Simulator Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Scenario Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
            <Sliders className="w-4 h-4 text-[#1E3ABA]" />
            Simulation Parameters
          </h3>

          {/* Scenario Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Strategic Policy / Cadre Initiative
            </label>
            <div className="space-y-2">
              {Object.entries(SAMPLE_CAPACITY_SCENARIOS).map(([key, sc]) => {
                const isSelected = key === selectedScenarioKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectScenario(key)}
                    className={`w-full text-left p-3 rounded-lg border transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#1E3ABA] ring-1 ring-[#1E3ABA] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      {sc.scenarioName}
                    </div>
                    <div className="text-[11px] text-[#1E3ABA] mt-0.5 font-mono font-semibold">
                      Target: {sc.targetCompetency}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Officers Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
              <span className="font-semibold">Target Officers Cohort</span>
              <span className="font-mono font-bold text-[#1E3ABA]">{customCohortSize.toLocaleString()} Officers</span>
            </div>
            <input
              type="range"
              min={50}
              max={2000}
              step={25}
              value={customCohortSize}
              onChange={(e) => setCustomCohortSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E3ABA]"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>50</span>
              <span>1,000</span>
              <span>2,000</span>
            </div>
          </div>

          {/* Weekly Dedicated Hours */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
              <span className="font-semibold">Weekly Study Allocation</span>
              <span className="font-mono font-bold text-emerald-700">{customHoursPerWeek} hrs / week</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={customHoursPerWeek}
              onChange={(e) => setCustomHoursPerWeek(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>1 hr/wk (Self-paced)</span>
              <span>4 hrs/wk (Standard)</span>
              <span>10 hrs/wk (Intensive)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunSim}
            className="w-full py-2.5 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
          >
            {isSimulating ? (
              <span>Computing Projections...</span>
            ) : simulatedFeedback ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Simulated Successfully!</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Recalculate Projections</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Projected Outcomes Dashboard (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-semibold text-[#1E3ABA] uppercase tracking-wider">
                Simulated Output Model
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                {activeScenario.scenarioName}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              Baseline: {activeScenario.baselineProficiency} → Target: {activeScenario.targetProficiency}
            </span>
          </div>

          {/* 4 Big Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-center">
              <Users className="w-4 h-4 text-[#1E3ABA] mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
                {computedHighGapOfficers.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-600 font-semibold mt-0.5">
                High-Gap Priority Learners
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-center">
              <Clock className="w-4 h-4 text-[#1E3ABA] mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-bold text-[#1E3ABA] font-mono">
                {totalTrainingHours.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-600 font-semibold mt-0.5">
                Total Training Hours
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-center">
              <TrendingUp className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-bold text-emerald-700 font-mono">
                +{(activeScenario.targetProficiency - activeScenario.baselineProficiency).toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-600 font-semibold mt-0.5">
                Avg. Level Lift (1–5)
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-center">
              <Calendar className="w-4 h-4 text-[#1E3ABA] mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
                {avgMonthsNeeded} Mos
              </div>
              <div className="text-[10px] text-slate-600 font-semibold mt-0.5">
                Timeline to Readiness
              </div>
            </div>
          </div>

          {/* Estimated Budget & Runway */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                Estimated Institutional Budget Required
              </span>
              <span className="text-emerald-700 font-mono font-bold text-sm">
                ₹{(estimatedBudgetINR / 100000).toFixed(2)} Lakhs (₹{activeScenario.estimatedTrainingCostPerOfficer}/officer)
              </span>
            </div>

            {/* Timeline Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Cadre Completion Runway</span>
                <span className="text-slate-900 font-mono font-bold">{avgWeeksNeeded} Weeks ({customHoursPerWeek} hrs/week)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 relative overflow-hidden border border-slate-300">
                <div
                  className="h-full bg-gradient-to-r from-[#1E3ABA] to-emerald-600 rounded-full"
                  style={{ width: `85%` }}
                />
              </div>
            </div>
          </div>

          {/* Wing-Wise Impact Projections Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#1E3ABA]" />
              <span>Projected Wing-Wise Gap Closure</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activeScenario.wingImpact.map((w, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900 font-mono">{w.wing}</span>
                    <span className="text-slate-600 font-mono">{Math.round(w.officersCount * ratio)} Staff</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Closure:</span>
                    <span className="font-bold text-emerald-700">{w.gapClosingPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
