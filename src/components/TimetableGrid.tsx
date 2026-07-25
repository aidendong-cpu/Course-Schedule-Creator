import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Star, User, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CourseSection, DayOfWeek, ScheduleCombination } from '../types';
import { minutesToFormattedTime, timeToMinutes, DAYS_ORDER } from '../utils/scheduler';

interface TimetableGridProps {
  schedule: ScheduleCombination | null;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({ schedule }) => {
  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);

  if (!schedule || schedule.sections.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center text-slate-400">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-[1.5]" />
        <h3 className="text-sm font-bold text-slate-700 mb-1">No Schedule Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Select courses in the pool and ensure at least one conflict-free schedule combination is generated.
        </p>
      </div>
    );
  }

  // Check if Saturday classes exist
  const hasSaturday = schedule.sections.some(s =>
    s.timeSlots.some(ts => ts.days.includes('Sat'))
  );
  const activeDays: DayOfWeek[] = hasSaturday ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Calculate day start and end time range for the grid (default 8:00 AM to 9:00 PM)
  const gridStartHour = 8;  // 8:00 AM (480 mins)
  const gridEndHour = 20;   // 8:00 PM (1200 mins)
  const gridStartMins = gridStartHour * 60;
  const gridEndMins = gridEndHour * 60;
  const totalGridMins = gridEndMins - gridStartMins;

  // Hourly time labels
  const hourLabels: number[] = [];
  for (let h = gridStartHour; h <= gridEndHour; h++) {
    hourLabels.push(h);
  }

  // Map course sections by day
  const sectionsByDay: Record<DayOfWeek, { section: CourseSection; startTime: string; endTime: string; startMins: number; endMins: number; location?: string }[]> = {
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []
  };

  // Color palette assignment map
  const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    indigo: { bg: 'bg-indigo-50 hover:bg-indigo-100/90', border: 'border-indigo-300', text: 'text-indigo-950', badge: 'bg-indigo-600 text-white' },
    emerald: { bg: 'bg-emerald-50 hover:bg-emerald-100/90', border: 'border-emerald-300', text: 'text-emerald-950', badge: 'bg-emerald-600 text-white' },
    amber: { bg: 'bg-amber-50 hover:bg-amber-100/90', border: 'border-amber-300', text: 'text-amber-950', badge: 'bg-amber-600 text-white' },
    rose: { bg: 'bg-rose-50 hover:bg-rose-100/90', border: 'border-rose-300', text: 'text-rose-950', badge: 'bg-rose-600 text-white' },
    violet: { bg: 'bg-purple-50 hover:bg-purple-100/90', border: 'border-purple-300', text: 'text-purple-950', badge: 'bg-purple-600 text-white' },
    teal: { bg: 'bg-teal-50 hover:bg-teal-100/90', border: 'border-teal-300', text: 'text-teal-950', badge: 'bg-teal-600 text-white' },
    sky: { bg: 'bg-sky-50 hover:bg-sky-100/90', border: 'border-sky-300', text: 'text-sky-950', badge: 'bg-sky-600 text-white' }
  };

  const paletteKeys = Object.keys(COLOR_MAP);

  schedule.sections.forEach((sec, idx) => {
    const colorKey = paletteKeys[idx % paletteKeys.length];
    sec.timeSlots.forEach(slot => {
      const startMins = timeToMinutes(slot.startTime);
      const endMins = timeToMinutes(slot.endTime);
      slot.days.forEach(day => {
        if (sectionsByDay[day]) {
          sectionsByDay[day].push({
            section: { ...sec, color: colorKey },
            startTime: slot.startTime,
            endTime: slot.endTime,
            startMins,
            endMins,
            location: slot.location || sec.location
          });
        }
      });
    });
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
      
      {/* Timetable Header Bar */}
      <div className="bg-slate-900 text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-extrabold tracking-tight">Weekly Timetable Grid</h2>
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {schedule.compatibilityScore}% Compatibility Score
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-3">
            <span>Avg Prof Rating: <strong className="text-amber-400">⭐ {schedule.avgProfRating}/5.0</strong></span>
            <span>Total Credits: <strong className="text-slate-200">{schedule.totalCredits} hrs</strong></span>
            <span>Gap Idle Time: <strong className="text-slate-200">{schedule.totalGapMinutes} mins/wk</strong></span>
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {schedule.tags.map(tag => (
            <span key={tag} className="text-[10px] font-bold bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-md border border-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] grid" style={{ gridTemplateColumns: `60px repeat(${activeDays.length}, 1fr)` }}>
          
          {/* Header Row: Days */}
          <div className="bg-slate-100/80 border-b border-r border-slate-200 p-2 text-center text-xs font-bold text-slate-500">
            Time
          </div>
          {activeDays.map(day => (
            <div
              key={day}
              className={`p-2.5 text-center border-b border-r border-slate-200 font-bold text-xs ${
                schedule.daysOff.includes(day)
                  ? 'bg-slate-100/50 text-slate-400'
                  : 'bg-slate-50 text-slate-800'
              }`}
            >
              <span>{day}</span>
              {schedule.daysOff.includes(day) && (
                <span className="block text-[10px] font-medium text-emerald-600">(Day Off)</span>
              )}
            </div>
          ))}

          {/* Body Row: Hours & Class Blocks */}
          <div className="relative border-r border-slate-200 bg-slate-50/30">
            {hourLabels.map((h, i) => (
              <div
                key={h}
                className="h-14 border-b border-slate-100 text-[10px] font-semibold text-slate-400 pr-1 pt-1 text-right"
              >
                {h % 12 === 0 ? 12 : h % 12} {h >= 12 ? 'PM' : 'AM'}
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {activeDays.map(day => {
            const dayItems = sectionsByDay[day] || [];
            return (
              <div
                key={day}
                className="relative border-r border-slate-200 bg-white"
                style={{ height: `${hourLabels.length * 56}px` }}
              >
                {/* Horizontal Grid lines */}
                {hourLabels.map(h => (
                  <div key={h} className="h-14 border-b border-slate-100/80" />
                ))}

                {/* Class Blocks */}
                {dayItems.map((item, idx) => {
                  const topPercent = Math.max(0, ((item.startMins - gridStartMins) / totalGridMins) * 100);
                  const heightPercent = Math.max(4, ((item.endMins - item.startMins) / totalGridMins) * 100);
                  const styles = COLOR_MAP[item.section.color || 'indigo'] || COLOR_MAP.indigo;

                  return (
                    <div
                      key={`${item.section.id}-${idx}`}
                      onClick={() => setSelectedSection(item.section)}
                      style={{
                        top: `${topPercent}%`,
                        height: `${heightPercent}%`,
                        left: '4px',
                        right: '4px'
                      }}
                      className={`absolute rounded-xl border p-2 shadow-xs cursor-pointer transition-all hover:scale-[1.02] hover:z-20 flex flex-col justify-between ${styles.bg} ${styles.border} ${styles.text}`}
                      title={`${item.section.courseCode}: ${item.section.courseTitle}\nProf: ${item.section.professor}\nTime: ${item.startTime} - ${item.endTime}`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-extrabold tracking-tight truncate">
                            {item.section.courseCode}
                          </span>
                          <span className="text-[9px] font-extrabold px-1 py-0.2 rounded bg-white/80 text-slate-800 border border-slate-200 shrink-0">
                            ⭐ {item.section.professorRating.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold opacity-90 truncate leading-tight">
                          {item.section.sectionId} • {item.section.professor}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-semibold opacity-80 mt-1">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 shrink-0" />
                          {item.startTime}-{item.endTime}
                        </span>
                        {item.location && (
                          <span className="truncate max-w-[70px] text-right">{item.location}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

        </div>
      </div>

      {/* Section Detail Popup Modal */}
      {selectedSection && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {selectedSection.courseCode}
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1">
                  {selectedSection.courseTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSection(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Section:</span>
                <span className="font-bold text-slate-800">{selectedSection.sectionId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Professor:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {selectedSection.professor}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Professor Rating:</span>
                <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {selectedSection.professorRating.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Meeting Schedule:</span>
                <span className="font-bold text-slate-800">
                  {selectedSection.timeSlots.map(ts => `${ts.days.join(', ')} (${ts.startTime} - ${ts.endTime})`).join('; ')}
                </span>
              </div>
              {selectedSection.location && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">Location:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedSection.location}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedSection(null)}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
