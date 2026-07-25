import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Pin, ChevronDown, ChevronRight, Star, Clock, MapPin, Check, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { Course, CourseSection, DayOfWeek } from '../types';

interface CourseCatalogManagerProps {
  courses: Course[];
  onToggleSelectCourse: (courseId: string) => void;
  onToggleCourseRequired: (courseId: string) => void;
  onPinSection: (courseId: string, sectionId: string | null) => void;
  pinnedSections: Record<string, string>; // courseId -> sectionId
  onAddCourse: (newCourse: Course) => void;
  onRemoveCourse: (courseId: string) => void;
  onAddSection: (courseId: string, newSection: CourseSection) => void;
  onRemoveSection: (courseId: string, sectionId: string) => void;
  onOpenAiImportModal: () => void;
  targetOptionalCount: number | 'ALL';
  onChangeTargetOptionalCount: (count: number | 'ALL') => void;
}

export const CourseCatalogManager: React.FC<CourseCatalogManagerProps> = ({
  courses,
  onToggleSelectCourse,
  onToggleCourseRequired,
  onPinSection,
  pinnedSections,
  onAddCourse,
  onRemoveCourse,
  onAddSection,
  onRemoveSection,
  onOpenAiImportModal,
  targetOptionalCount,
  onChangeTargetOptionalCount
}) => {
  const [expandedCourseIds, setExpandedCourseIds] = useState<string[]>(courses.map(c => c.id));
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddSectionCourseId, setShowAddSectionCourseId] = useState<string | null>(null);

  // New course form state
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newIsRequired, setNewIsRequired] = useState(true);

  // New section form state
  const [secId, setSecId] = useState('Sec 01');
  const [secProf, setSecProf] = useState('');
  const [secProfRating, setSecProfRating] = useState(4.5);
  const [secLocation, setSecLocation] = useState('Hall 101');
  const [secDays, setSecDays] = useState<DayOfWeek[]>(['Mon', 'Wed']);
  const [secStart, setSecStart] = useState('10:00');
  const [secEnd, setSecEnd] = useState('11:15');

  const selectedCourses = courses.filter(c => c.selected !== false);
  const requiredCourses = selectedCourses.filter(c => c.required !== false);
  const optionalCourses = selectedCourses.filter(c => c.required === false);

  const toggleExpand = (id: string) => {
    setExpandedCourseIds(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTitle.trim()) return;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim(),
      credits: Number(newCredits) || 3,
      required: newIsRequired,
      selected: true,
      sections: []
    };

    onAddCourse(newCourse);
    setNewCode('');
    setNewTitle('');
    setNewIsRequired(true);
    setShowAddCourseModal(false);
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddSectionCourseId || !secProf.trim()) return;

    const targetCourse = courses.find(c => c.id === showAddSectionCourseId);

    const newSec: CourseSection = {
      id: `sec-${Date.now()}`,
      sectionId: secId,
      courseCode: targetCourse?.code || '',
      courseTitle: targetCourse?.title || '',
      professor: secProf.trim(),
      professorRating: Number(secProfRating),
      location: secLocation.trim(),
      status: 'Open',
      timeSlots: [{
        days: secDays,
        startTime: secStart,
        endTime: secEnd
      }],
      color: 'indigo'
    };

    onAddSection(showAddSectionCourseId, newSec);
    setShowAddSectionCourseId(null);
    setSecProf('');
  };

  const toggleDaySelection = (day: DayOfWeek) => {
    setSecDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
      
      {/* Title & Action Bar */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Target Course Pool ({courses.length})</h2>
            <p className="text-xs text-slate-500">Select courses and sections to include in conflict-free schedule combinations</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiImportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Bulk Extract</span>
          </button>

          <button
            onClick={() => setShowAddCourseModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Optional Courses Inclusion Goal Selector */}
      <div className="bg-gradient-to-r from-amber-50/70 via-amber-50/40 to-slate-50 px-5 py-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-amber-100 text-amber-800">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800">Optional Electives per Schedule:</span>
            <p className="text-[11px] text-slate-500">
              <strong className="text-amber-800">{optionalCourses.length} optional course{optionalCourses.length === 1 ? '' : 's'}</strong> available ({requiredCourses.length} required)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => onChangeTargetOptionalCount('ALL')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
              targetOptionalCount === 'ALL'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Optional ({optionalCourses.length})
          </button>
          {Array.from({ length: optionalCourses.length + 1 }, (_, i) => i).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChangeTargetOptionalCount(num)}
              className={`px-2 py-1 text-xs font-bold rounded-lg border transition ${
                targetOptionalCount === num
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {num === 0 ? '0 Optional' : `Include ${num}`}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Accordion List */}
      <div className="divide-y divide-slate-100">
        {courses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No courses in catalog. Click <strong>Add Course</strong> or <strong>AI Bulk Extract</strong> to start.
          </div>
        ) : (
          courses.map((course) => {
            const isExpanded = expandedCourseIds.includes(course.id);
            const isSelected = course.selected !== false;
            const isRequired = course.required !== false;
            const pinnedSecId = pinnedSections[course.id];

            return (
              <div key={course.id} className="transition bg-white hover:bg-slate-50/40">
                {/* Course Header */}
                <div className="px-5 py-3 flex items-center justify-between gap-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectCourse(course.id)}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      title="Include in schedule generator"
                    />
                    <div onClick={() => toggleExpand(course.id)} className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <span className="text-xs font-extrabold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 mr-2">
                          {course.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{course.title}</span>
                        <span className="text-[11px] text-slate-400 ml-2">({course.credits} Credits, {course.sections.length} Sections)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Required vs Optional classification toggle badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCourseRequired(course.id);
                      }}
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border transition flex items-center gap-1 ${
                        isRequired
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                      title={isRequired ? 'Required course. Click to switch to Optional.' : 'Optional elective. Click to switch to Required.'}
                    >
                      {isRequired ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                          <span>Required</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Optional</span>
                        </>
                      )}
                    </button>

                    {pinnedSecId && (
                      <span className="text-[11px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-purple-600" />
                        Pinned
                      </span>
                    )}
                    <button
                      onClick={() => setShowAddSectionCourseId(course.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Section</span>
                    </button>
                    <button
                      onClick={() => onRemoveCourse(course.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sections Sub-List */}
                {isExpanded && (
                  <div className="px-5 pb-3 pt-1 pl-12 bg-slate-50/60 border-t border-slate-100 space-y-2">
                    {course.sections.length === 0 ? (
                      <p className="text-[11px] text-slate-400 py-1">No sections added yet for this course.</p>
                    ) : (
                      course.sections.map((sec) => {
                        const isPinned = pinnedSecId === sec.id;
                        return (
                          <div
                            key={sec.id}
                            className={`p-2.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                              isPinned
                                ? 'bg-purple-50/80 border-purple-300 shadow-sm'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1 flex-wrap">
                              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {sec.sectionId}
                              </span>

                              {/* Professor & Rating */}
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-800">{sec.professor}</span>
                                <span className="text-[11px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-amber-200">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                  {sec.professorRating.toFixed(1)}
                                </span>
                              </div>

                              {/* Time slots */}
                              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>
                                  {sec.timeSlots.map(ts => `${ts.days.join('/')} ${ts.startTime}-${ts.endTime}`).join('; ')}
                                </span>
                              </div>

                              {/* Location */}
                              {sec.location && (
                                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                  <MapPin className="w-3 h-3" />
                                  <span>{sec.location}</span>
                                </div>
                              )}
                            </div>

                            {/* Pin / Delete Controls */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <button
                                onClick={() => onPinSection(course.id, isPinned ? null : sec.id)}
                                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 transition ${
                                  isPinned
                                    ? 'bg-purple-600 text-white border-purple-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-700'
                                }`}
                                title={isPinned ? 'Unpin this section' : 'Pin section to force inclusion'}
                              >
                                <Pin className={`w-3 h-3 ${isPinned ? 'fill-white' : ''}`} />
                                <span>{isPinned ? 'Pinned' : 'Pin'}</span>
                              </button>

                              <button
                                onClick={() => onRemoveSection(course.id, sec.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 transition"
                                title="Remove section"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add New Course */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Add New Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS 102"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures & Algorithms"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newCredits}
                    onChange={(e) => setNewCredits(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Classification</label>
                  <div className="flex gap-1 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setNewIsRequired(true)}
                      className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border transition ${
                        newIsRequired
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Required
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewIsRequired(false)}
                      className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border transition ${
                        !newIsRequired
                          ? 'bg-amber-500 text-slate-950 border-amber-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Optional
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Section */}
      {showAddSectionCourseId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Add Course Section</h3>
            <form onSubmit={handleCreateSection} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Code</label>
                  <input
                    type="text"
                    required
                    value={secId}
                    onChange={(e) => setSecId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prof. Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={secProfRating}
                    onChange={(e) => setSecProfRating(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Professor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Richard Feynman"
                  value={secProf}
                  onChange={(e) => setSecProf(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Days</label>
                <div className="flex gap-1.5">
                  {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as DayOfWeek[]).map((day) => {
                    const selected = secDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDaySelection(day)}
                        className={`px-2 py-1 rounded text-xs font-bold border transition ${
                          selected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={secStart}
                    onChange={(e) => setSecStart(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={secEnd}
                    onChange={(e) => setSecEnd(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location / Classroom</label>
                <input
                  type="text"
                  value={secLocation}
                  onChange={(e) => setSecLocation(e.target.value)}
                  placeholder="e.g. Science Center 201"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSectionCourseId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
