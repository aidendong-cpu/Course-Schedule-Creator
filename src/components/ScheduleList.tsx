import React from 'react';
import { Star, Clock, CalendarDays, CheckCircle2, Sparkles, ChevronRight, Award } from 'lucide-react';
import { ScheduleCombination } from '../types';

interface ScheduleListProps {
  schedules: ScheduleCombination[];
  activeScheduleId: string | null;
  onSelectSchedule: (schedule: ScheduleCombination) => void;
  onRequestAiCritique: (schedule: ScheduleCombination) => void;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  activeScheduleId,
  onSelectSchedule,
  onRequestAiCritique
}) => {
  if (schedules.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 text-center text-slate-400 mb-6">
        <p className="text-xs text-slate-500 font-medium">
          No valid non-overlapping schedules could be formed from the selected courses.
          Try unpinning sections or selecting a different set of courses.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">
            Ranked Schedule Combinations ({schedules.length} Options)
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">Ordered by Weighted Match %</span>
      </div>

      {/* Cards List */}
      <div className="p-4 space-y-3 max-h-[550px] overflow-y-auto">
        {schedules.map((schedule, rank) => {
          const isSelected = activeScheduleId === schedule.id;

          return (
            <div
              key={schedule.id}
              onClick={() => onSelectSchedule(schedule)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                
                {/* Score & Rank */}
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                    rank === 0
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : rank === 1
                      ? 'bg-slate-200 text-slate-800'
                      : rank === 2
                      ? 'bg-amber-700/20 text-amber-900'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{rank + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900">
                        {schedule.compatibilityScore}% Match
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Previewing
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                        <strong>{schedule.avgProfRating}</strong> Prof Rating
                      </span>
                      <span>•</span>
                      <span><strong>{schedule.totalGapMinutes}m</strong> Gap/Wk</span>
                    </div>
                  </div>
                </div>

                {/* Score breakdown bar */}
                <div className="w-full sm:w-48 bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <div
                    style={{ width: `${schedule.compatibilityScore}%` }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                  />
                </div>

                {/* AI Critique Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestAiCritique(schedule);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition"
                  title="Get AI personalized review for this option"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>AI Review</span>
                </button>
              </div>

              {/* Sections list summary */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {schedule.sections.map((sec) => (
                  <span
                    key={sec.id}
                    className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200 flex items-center gap-1"
                  >
                    <strong>{sec.courseCode}</strong> ({sec.sectionId}): {sec.professor} (⭐{sec.professorRating})
                  </span>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {schedule.tags.map(t => (
                  <span key={t} className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                    {t}
                  </span>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
