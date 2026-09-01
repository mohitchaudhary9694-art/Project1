import React, { useState } from 'react';
import { iGOTCourse, CompetencyItem } from '../types';
import { 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle, 
  ExternalLink, 
  Sparkles, 
  Tag, 
  ArrowRight,
  Zap,
  PlayCircle
} from 'lucide-react';

interface PersonalizedRecommendationsProps {
  courses: iGOTCourse[];
  competencies: CompetencyItem[];
  onSelectCourse: (course: iGOTCourse) => void;
  onEnrollCourse?: (courseId: string) => void;
  enrolledCourseIds?: string[];
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  courses,
  competencies,
  onSelectCourse,
  onEnrollCourse,
  enrolledCourseIds = [],
}) => {
  const [filterGapPriority, setFilterGapPriority] = useState<'all' | 'high' | 'medium'>('all');

  // Identify high and medium gap competencies
  const highGapCompetencies = competencies.filter(c => (c.targetLevel - c.currentLevel) >= 2);
  const mediumGapCompetencies = competencies.filter(c => (c.targetLevel - c.currentLevel) === 1);

  // Map courses to their associated competency gap status
  const prioritizedCourses = courses.map((course) => {
    // Check if course matches any high-gap competency
    const matchedHighGap = highGapCompetencies.find(
      c => c.recommendedCourseIds.includes(course.id) || 
           c.name.toLowerCase().includes(course.primaryCompetency.toLowerCase()) ||
           course.primaryCompetency.toLowerCase().includes(c.name.toLowerCase())
    );

    const matchedMediumGap = mediumGapCompetencies.find(
      c => c.recommendedCourseIds.includes(course.id) || 
           c.name.toLowerCase().includes(course.primaryCompetency.toLowerCase()) ||
           course.primaryCompetency.toLowerCase().includes(c.name.toLowerCase())
    );

    let gapPriority: 'high' | 'medium' | 'general' = 'general';
    let gapReason = 'Official Cadre Development';

    if (matchedHighGap) {
      gapPriority = 'high';
      gapReason = `Closes High Gap: ${matchedHighGap.name}`;
    } else if (matchedMediumGap) {
      gapPriority = 'medium';
      gapReason = `Closes Gap: ${matchedMediumGap.name}`;
    } else if (course.tpacApproved) {
      gapReason = 'NSSTA TPAC Mandate';
    }

    return {
      ...course,
      gapPriority,
      gapReason,
    };
  });

  // Sort so high-gap courses come first
  prioritizedCourses.sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, general: 1 };
    return priorityWeight[b.gapPriority] - priorityWeight[a.gapPriority];
  });

  // Filter based on selected button
  const filteredCourses = prioritizedCourses.filter((c) => {
    if (filterGapPriority === 'high') return c.gapPriority === 'high';
    if (filterGapPriority === 'medium') return c.gapPriority === 'medium' || c.gapPriority === 'high';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Section Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#1E3ABA] text-xs font-semibold uppercase tracking-wider">
              Module 3 • Adaptive Recommendations
            </span>
            <span className="text-xs text-slate-500">
              Personalized to Your Identified Gaps
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2 font-heading">
            Recommended for You (iGOT Karmayogi & NSSTA)
            <Sparkles className="w-4 h-4 text-[#F4B400]" />
          </h3>
        </div>

        {/* Priority Filter Pills */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterGapPriority('all')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              filterGapPriority === 'all' ? 'bg-[#1E3ABA] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Courses ({prioritizedCourses.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterGapPriority('high')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              filterGapPriority === 'high' ? 'bg-[#E63946] text-white' : 'text-[#E63946] hover:bg-red-50'
            }`}
          >
            High Gaps Only ({prioritizedCourses.filter(c => c.gapPriority === 'high').length})
          </button>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.slice(0, 6).map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);

          return (
            <div
              key={course.id}
              className={`bg-white border rounded-xl p-4 flex flex-col justify-between transition hover:border-[#1E3ABA] shadow-xs ${
                course.gapPriority === 'high'
                  ? 'border-red-200'
                  : course.gapPriority === 'medium'
                  ? 'border-amber-200'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    course.gapPriority === 'high'
                      ? 'bg-red-50 text-[#E63946] border-red-200'
                      : course.gapPriority === 'medium'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-blue-50 text-[#1E3ABA] border-blue-100'
                  }`}>
                    {course.gapReason}
                  </span>

                  {course.tpacApproved && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1E3ABA] border border-blue-100 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      TPAC
                    </span>
                  )}
                </div>

                {/* Course Title */}
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug font-heading">
                  {course.title}
                </h4>

                {/* Provider & Format */}
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">{course.provider}</span>
                  <span>•</span>
                  <span>{course.format}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Metrics: Hours & Credits */}
                <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {course.durationHours} hrs
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#1E3ABA]" />
                    {course.credits} CPD Credits
                  </span>
                  <span className="ml-auto text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectCourse(course)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition cursor-pointer"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onEnrollCourse ? onEnrollCourse(course.id) : onSelectCourse(course)}
                  className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isEnrolled
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-[#1E3ABA] hover:bg-[#152E99] text-white shadow-xs'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Enrolled</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Start Learning</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
