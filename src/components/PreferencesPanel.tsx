import React, { useState } from 'react';
import { Sliders, Star, Clock, CalendarDays, Zap, Sparkles, AlertCircle, Sun, SunMedium, Moon } from 'lucide-react';
import { DayOfWeek, PreferenceWeights } from '../types';

interface PreferencesPanelProps {
  weights: PreferenceWeights;
  onChangeWeights: (newWeights: PreferenceWeights) => void;
  onApplyAiPrompt: (promptText: string) => Promise<void>;
  isLoadingAi: boolean;
  aiExplanation?: string;
}

export const PreferencesPanel: React.FC<PreferencesPanelProps> = ({
  weights,
  onChangeWeights,
  onApplyAiPrompt,
  isLoadingAi,
  aiExplanation
}) => {
  const [naturalText, setNaturalText] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSliderChange = (field: keyof PreferenceWeights, value: number) => {
    onChangeWeights({
      ...weights,
      [field]: value
    });
  };

  const handleToggleDayOff = (day: DayOfWeek) => {
    const current = weights.preferredDaysOff;
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    onChangeWeights({
      ...weights,
      preferredDaysOff: updated
    });
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalText.trim()) return;
    await onApplyAiPrompt(naturalText);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Schedule Preference Weights</h2>
            <p className="text-xs text-slate-500">Tune what matters most to calculate your Schedule Compatibility Score</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 transition"
        >
          {isExpanded ? 'Collapse Preferences' : 'Expand Preferences'}
        </button>
      </div>

      {/* Natural Language Prompt Assistant Bar */}
      <div className="p-4 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-slate-50 border-b border-slate-200/60">
        <form onSubmit={handleAiSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Sparkles className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
            <input
              type="text"
              value={naturalText}
              onChange={(e) => setNaturalText(e.target.value)}
              placeholder="e.g. 'I want Fridays off, high professor ratings, and no 8 AM classes'"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-indigo-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoadingAi || !naturalText.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
          >
            {isLoadingAi ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>AI Tune Weights</span>
          </button>
        </form>

        {aiExplanation && (
          <div className="mt-2.5 px-3 py-2 rounded-lg bg-indigo-100/70 border border-indigo-200/80 text-xs text-indigo-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span><strong>AI Tuning Result:</strong> {aiExplanation}</span>
          </div>
        )}
      </div>

      {/* Expanded Weight Controls Grid */}
      {isExpanded && (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Weight 1: Professor Rating */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  Professor Rating
                </span>
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {weights.professorRatingWeight}% Weight
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Prioritizes schedule options with highly-rated professors (e.g. 4.5+ / 5.0).
              </p>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.professorRatingWeight}
              onChange={(e) => handleSliderChange('professorRatingWeight', parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Weight 2: Preferred Time of Day */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Preferred Time of Day
                </span>
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {weights.timeOfDayWeight}% Weight
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 mb-3">
                {[
                  { id: 'ANY', label: 'Any', icon: Clock },
                  { id: 'MORNING', label: 'Morning', icon: Sun },
                  { id: 'AFTERNOON', label: 'Afternoon', icon: SunMedium },
                  { id: 'EVENING', label: 'Evening', icon: Moon },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = weights.preferredTimeOfDay === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChangeWeights({ ...weights, preferredTimeOfDay: item.id as any })}
                      className={`px-1.5 py-1.5 rounded-lg text-[11px] font-semibold border flex flex-col items-center gap-1 transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.timeOfDayWeight}
              onChange={(e) => handleSliderChange('timeOfDayWeight', parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Weight 3: Class Compactness vs Spacing */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  Compact vs. Spaced
                </span>
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {weights.compactnessWeight}% Weight
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {[
                  { id: 'COMPACT', label: 'Compact', desc: 'Minimal Gaps' },
                  { id: 'BALANCED', label: 'Balanced', desc: 'Moderate' },
                  { id: 'SPACED', label: 'Spaced', desc: 'Study Breaks' },
                ].map((mode) => {
                  const isSelected = weights.compactnessMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => onChangeWeights({ ...weights, compactnessMode: mode.id as any })}
                      className={`p-1.5 rounded-lg text-center border transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{mode.label}</div>
                      <div className={`text-[9px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {mode.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.compactnessWeight}
              onChange={(e) => handleSliderChange('compactnessWeight', parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Weight 4: Avoid Early Mornings */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Avoid Early Mornings
                </span>
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {weights.morningAvoidanceWeight}% Weight
                </span>
              </div>
              <div className="flex items-center justify-between mb-3 bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-600 font-medium">Penalize classes before 9:30 AM</span>
                <input
                  type="checkbox"
                  checked={weights.avoidEarlyMornings}
                  onChange={(e) => onChangeWeights({ ...weights, avoidEarlyMornings: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.morningAvoidanceWeight}
              onChange={(e) => handleSliderChange('morningAvoidanceWeight', parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Weight 5: Preferred Days Off */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-purple-500" />
                  Preferred Days Off
                </span>
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {weights.daysOffWeight}% Weight
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as DayOfWeek[]).map((day) => {
                  const isChecked = weights.preferredDaysOff.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDayOff(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        isChecked
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      {isChecked ? `✓ ${day} Off` : `${day}`}
                    </button>
                  );
                })}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.daysOffWeight}
              onChange={(e) => handleSliderChange('daysOffWeight', parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

        </div>
      )}

    </div>
  );
};
