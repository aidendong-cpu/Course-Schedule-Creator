import React, { useState, useEffect, useMemo } from 'react';
import { SAMPLE_CATALOGS } from './data/sampleCatalogs';
import { Course, CourseSection, PreferenceWeights, ScheduleCombination } from './types';
import { generateSchedules, generateICSFile } from './utils/scheduler';
import { Navbar } from './components/Navbar';
import { PreferencesPanel } from './components/PreferencesPanel';
import { CourseCatalogManager } from './components/CourseCatalogManager';
import { TimetableGrid } from './components/TimetableGrid';
import { ScheduleList } from './components/ScheduleList';
import { AiImportModal } from './components/AiImportModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';

export default function App() {
  // 1. Preset & Active Catalog State
  const [activeCatalogId, setActiveCatalogId] = useState<string>(SAMPLE_CATALOGS[0].id);
  const [courses, setCourses] = useState<Course[]>(SAMPLE_CATALOGS[0].courses);

  // 2. Pinned Sections State (courseId -> sectionId)
  const [pinnedSections, setPinnedSections] = useState<Record<string, string>>({});

  // 3. User Preference Weights State
  const [weights, setWeights] = useState<PreferenceWeights>({
    professorRatingWeight: 80,
    preferredTimeOfDay: 'ANY',
    timeOfDayWeight: 50,
    compactnessMode: 'COMPACT',
    compactnessWeight: 60,
    avoidEarlyMornings: true,
    morningAvoidanceWeight: 70,
    preferredDaysOff: ['Fri'],
    daysOffWeight: 80
  });

  // 4. Generated Schedules State & Optional Courses Count
  const [targetOptionalCount, setTargetOptionalCount] = useState<number | 'ALL'>('ALL');
  const [schedules, setSchedules] = useState<ScheduleCombination[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  // 5. AI Modals & Assistance State
  const [isAiImportOpen, setIsAiImportOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isLoadingAiPrompt, setIsLoadingAiPrompt] = useState(false);
  const [aiPromptExplanation, setAiPromptExplanation] = useState<string | undefined>(undefined);
  const [aiCritiqueSchedule, setAiCritiqueSchedule] = useState<ScheduleCombination | null>(null);
  const [aiCritiqueText, setAiCritiqueText] = useState<string | null>(null);
  const [isLoadingCritique, setIsLoadingCritique] = useState(false);

  // Switch Catalog Preset
  const handleSelectCatalog = (catId: string) => {
    setActiveCatalogId(catId);
    const cat = SAMPLE_CATALOGS.find(c => c.id === catId);
    if (cat) {
      setCourses(cat.courses);
      setPinnedSections({});
    }
  };

  // Re-generate and score schedules whenever courses, pinned sections, weights, or targetOptionalCount change
  useEffect(() => {
    const generated = generateSchedules(courses, pinnedSections, weights, targetOptionalCount);
    setSchedules(generated);
    if (generated.length > 0) {
      setSelectedScheduleId(generated[0].id);
    } else {
      setSelectedScheduleId(null);
    }
  }, [courses, pinnedSections, weights, targetOptionalCount]);

  // Active Schedule Object
  const activeSchedule = useMemo(() => {
    if (!selectedScheduleId) return schedules[0] || null;
    return schedules.find(s => s.id === selectedScheduleId) || schedules[0] || null;
  }, [schedules, selectedScheduleId]);

  // Course handlers
  const handleToggleSelectCourse = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => c.id === courseId ? { ...c, selected: c.selected === false ? true : false } : c)
    );
  };

  const handleToggleCourseRequired = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => c.id === courseId ? { ...c, required: c.required === false ? true : false } : c)
    );
  };

  const handlePinSection = (courseId: string, sectionId: string | null) => {
    setPinnedSections(prev => {
      const updated = { ...prev };
      if (!sectionId) {
        delete updated[courseId];
      } else {
        updated[courseId] = sectionId;
      }
      return updated;
    });
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
  };

  const handleRemoveCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setPinnedSections(prev => {
      const copy = { ...prev };
      delete copy[courseId];
      return copy;
    });
  };

  const handleAddSection = (courseId: string, newSec: CourseSection) => {
    setCourses(prev =>
      prev.map(c => c.id === courseId ? { ...c, sections: [...c.sections, newSec] } : c)
    );
  };

  const handleRemoveSection = (courseId: string, sectionId: string) => {
    setCourses(prev =>
      prev.map(c =>
        c.id === courseId
          ? { ...c, sections: c.sections.filter(s => s.id !== sectionId) }
          : c
      )
    );
  };

  // AI Natural Language Preference Parser
  const handleApplyAiPrompt = async (promptText: string) => {
    setIsLoadingAiPrompt(true);
    setAiPromptExplanation(undefined);

    try {
      const res = await fetch('/api/ai-schedule-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'parse_preferences',
          naturalText: promptText
        })
      });

      if (!res.ok) throw new Error('AI service error');

      const data = await res.json();
      if (data.preferences) {
        const pref = data.preferences;
        setWeights(prev => ({
          ...prev,
          professorRatingWeight: pref.professorRatingWeight ?? prev.professorRatingWeight,
          preferredTimeOfDay: pref.preferredTimeOfDay ?? prev.preferredTimeOfDay,
          timeOfDayWeight: pref.timeOfDayWeight ?? prev.timeOfDayWeight,
          compactnessMode: pref.compactnessMode ?? prev.compactnessMode,
          compactnessWeight: pref.compactnessWeight ?? prev.compactnessWeight,
          avoidEarlyMornings: pref.avoidEarlyMornings ?? prev.avoidEarlyMornings,
          morningAvoidanceWeight: pref.morningAvoidanceWeight ?? prev.morningAvoidanceWeight,
          preferredDaysOff: pref.preferredDaysOff ?? prev.preferredDaysOff,
          daysOffWeight: pref.daysOffWeight ?? prev.daysOffWeight
        }));
        setAiPromptExplanation(pref.summaryExplanation);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingAiPrompt(false);
    }
  };

  // AI Schedule Critique
  const handleRequestAiCritique = async (schedule: ScheduleCombination) => {
    setAiCritiqueSchedule(schedule);
    setAiCritiqueText(null);
    setIsLoadingCritique(true);
    setIsAiAdvisorOpen(true);

    try {
      const summary = {
        compatibilityScore: schedule.compatibilityScore,
        avgProfRating: schedule.avgProfRating,
        totalGapMinutes: schedule.totalGapMinutes,
        daysOff: schedule.daysOff,
        courses: schedule.sections.map(s => `${s.courseCode} (${s.sectionId}) with ${s.professor}`)
      };

      const res = await fetch('/api/ai-schedule-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'critique_schedule',
          userWeights: weights,
          scheduleSummary: summary
        })
      });

      if (!res.ok) throw new Error('Failed to fetch AI critique');

      const data = await res.json();
      setAiCritiqueText(data.critique || 'Generated assessment successfully.');
    } catch (err: any) {
      setAiCritiqueText('Could not generate AI critique at this time.');
    } finally {
      setIsLoadingCritique(false);
    }
  };

  // Export Calendar ICS file
  const handleExportICS = () => {
    if (!activeSchedule) return;
    const icsContent = generateICSFile(activeSchedule);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'class_schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to default weights
  const handleResetToDefaults = () => {
    setWeights({
      professorRatingWeight: 80,
      preferredTimeOfDay: 'ANY',
      timeOfDayWeight: 50,
      compactnessMode: 'COMPACT',
      compactnessWeight: 60,
      avoidEarlyMornings: true,
      morningAvoidanceWeight: 70,
      preferredDaysOff: ['Fri'],
      daysOffWeight: 80
    });
    setAiPromptExplanation(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        catalogs={SAMPLE_CATALOGS}
        activeCatalogId={activeCatalogId}
        onSelectCatalog={handleSelectCatalog}
        onOpenAiAssistant={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTextParser={() => setIsAiImportOpen(true)}
        onResetToDefaults={handleResetToDefaults}
        onExportICS={handleExportICS}
        activeScheduleCount={schedules.length}
        totalCoursesCount={courses.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Preference Weights Tuning Panel */}
        <PreferencesPanel
          weights={weights}
          onChangeWeights={setWeights}
          onApplyAiPrompt={handleApplyAiPrompt}
          isLoadingAi={isLoadingAiPrompt}
          aiExplanation={aiPromptExplanation}
        />

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Course Catalog & Generated Combinations List */}
          <div className="lg:col-span-5 space-y-6">
            
            <CourseCatalogManager
              courses={courses}
              onToggleSelectCourse={handleToggleSelectCourse}
              onToggleCourseRequired={handleToggleCourseRequired}
              onPinSection={handlePinSection}
              pinnedSections={pinnedSections}
              onAddCourse={handleAddCourse}
              onRemoveCourse={handleRemoveCourse}
              onAddSection={handleAddSection}
              onRemoveSection={handleRemoveSection}
              onOpenAiImportModal={() => setIsAiImportOpen(true)}
              targetOptionalCount={targetOptionalCount}
              onChangeTargetOptionalCount={setTargetOptionalCount}
            />

            <ScheduleList
              schedules={schedules}
              activeScheduleId={selectedScheduleId}
              onSelectSchedule={(s) => setSelectedScheduleId(s.id)}
              onRequestAiCritique={handleRequestAiCritique}
            />

          </div>

          {/* Right Column: Visual Timetable Grid */}
          <div className="lg:col-span-7">
            <TimetableGrid schedule={activeSchedule} />
          </div>

        </div>

      </main>

      {/* AI Import List Modal */}
      <AiImportModal
        isOpen={isAiImportOpen}
        onClose={() => setIsAiImportOpen(false)}
        onImportCourses={(newParsedCourses) => {
          setCourses(prev => [...prev, ...newParsedCourses]);
        }}
      />

      {/* AI Schedule Advisor Assessment Modal */}
      <AiAdvisorModal
        schedule={aiCritiqueSchedule}
        critiqueText={aiCritiqueText}
        isLoading={isLoadingCritique}
        onClose={() => setIsAiAdvisorOpen(false)}
      />

    </div>
  );
}
