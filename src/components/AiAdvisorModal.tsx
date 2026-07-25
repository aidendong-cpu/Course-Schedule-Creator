import React from 'react';
import { Sparkles, Award, Star, Clock, CalendarDays, CheckCircle2 } from 'lucide-react';
import { ScheduleCombination } from '../types';

interface AiAdvisorModalProps {
  schedule: ScheduleCombination | null;
  critiqueText: string | null;
  isLoading: boolean;
  onClose: () => void;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  schedule,
  critiqueText,
  isLoading,
  onClose
}) => {
  if (!schedule) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">AI Schedule Advisor Assessment</h3>
              <p className="text-xs text-slate-500">Personalized critique powered by Gemini AI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
        </div>

        {/* Schedule Summary Banner */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Option Match Score</span>
            <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              {schedule.compatibilityScore}% Match
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200/60">
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Avg Prof Rating</div>
              <div className="text-xs font-extrabold text-amber-600 flex items-center justify-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                {schedule.avgProfRating}/5.0
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Weekly Idle Gaps</div>
              <div className="text-xs font-extrabold text-slate-800">{schedule.totalGapMinutes} mins</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Days Off</div>
              <div className="text-xs font-extrabold text-slate-800">
                {schedule.daysOff.length > 0 ? schedule.daysOff.join(', ') : 'None'}
              </div>
            </div>
          </div>
        </div>

        {/* Critique Content */}
        <div className="p-4 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 rounded-xl border border-indigo-100/80 mb-5 min-h-[100px] flex items-center">
          {isLoading ? (
            <div className="flex items-center gap-3 text-xs text-indigo-700 font-medium py-2">
              <span className="animate-spin text-base">✨</span>
              <span>Gemini AI is analyzing professor ratings, gap efficiency, and time distribution...</span>
            </div>
          ) : (
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {critiqueText || "No critique available."}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
};
