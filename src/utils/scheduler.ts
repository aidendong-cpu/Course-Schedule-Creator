import { Course, CourseSection, DayOfWeek, PreferenceWeights, ScheduleCombination, TimeSlot } from '../types';

export const DAYS_ORDER: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Helper to convert "HH:MM" (24h) to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

// Helper to convert minutes from midnight to "HH:MM AM/PM"
export function minutesToFormattedTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${displayHours}:${displayMinutes} ${period}`;
}

// Check if two time slots overlap on any day
export function doSlotsOverlap(slotA: TimeSlot, slotB: TimeSlot): boolean {
  // Check if they share any common day
  const commonDays = slotA.days.filter(d => slotB.days.includes(d));
  if (commonDays.length === 0) return false;

  const startA = timeToMinutes(slotA.startTime);
  const endA = timeToMinutes(slotA.endTime);
  const startB = timeToMinutes(slotB.startTime);
  const endB = timeToMinutes(slotB.endTime);

  // Overlap if max(startA, startB) < min(endA, endB)
  return Math.max(startA, startB) < Math.min(endA, endB);
}

// Check if two sections have any overlapping time slots
export function doSectionsOverlap(secA: CourseSection, secB: CourseSection): boolean {
  for (const slotA of secA.timeSlots) {
    for (const slotB of secB.timeSlots) {
      if (doSlotsOverlap(slotA, slotB)) {
        return true;
      }
    }
  }
  return false;
}

// Check if a candidate section overlaps with any existing sections in a partial schedule
export function hasAnyConflict(candidate: CourseSection, schedule: CourseSection[]): boolean {
  return schedule.some(sec => doSectionsOverlap(candidate, sec));
}

// Generate all valid non-overlapping schedule combinations
export function generateSchedules(
  courses: Course[],
  pinnedSections: Record<string, string> = {}, // courseId -> sectionId
  weights: PreferenceWeights,
  targetOptionalCount: number | 'ALL' = 'ALL'
): ScheduleCombination[] {
  // Filter active selected courses that have sections
  const selectedCourses = courses.filter(c => c.selected !== false && c.sections.length > 0);
  if (selectedCourses.length === 0) return [];

  // Separate required courses vs optional courses
  const requiredCourses = selectedCourses.filter(c => c.required !== false);
  const optionalCourses = selectedCourses.filter(c => c.required === false);

  // Determine subsets of optional courses to include
  let optionalSubsets: Course[][] = [];

  if (targetOptionalCount === 'ALL' || typeof targetOptionalCount !== 'number' || targetOptionalCount >= optionalCourses.length) {
    // Include all optional courses
    optionalSubsets = [optionalCourses];
  } else if (targetOptionalCount <= 0) {
    // Include 0 optional courses
    optionalSubsets = [[]];
  } else {
    // Generate combinations of optionalCourses of length targetOptionalCount
    optionalSubsets = getCombinations(optionalCourses, targetOptionalCount);
  }

  const allCombinations: CourseSection[][] = [];

  // For each subset of optional courses, run backtracking on requiredCourses + subset
  for (const subset of optionalSubsets) {
    const activeCourses = [...requiredCourses, ...subset];
    if (activeCourses.length === 0) continue;

    const results: CourseSection[][] = [];

    function backtrack(courseIndex: number, currentSchedule: CourseSection[]) {
      if (courseIndex === activeCourses.length) {
        results.push([...currentSchedule]);
        return;
      }

      const course = activeCourses[courseIndex];
      const pinnedSectionId = pinnedSections[course.id];

      let sectionsToTry = course.sections;
      if (pinnedSectionId) {
        const pinned = course.sections.find(s => s.id === pinnedSectionId);
        if (pinned) {
          sectionsToTry = [pinned];
        }
      }

      for (const section of sectionsToTry) {
        if (!hasAnyConflict(section, currentSchedule)) {
          currentSchedule.push(section);
          backtrack(courseIndex + 1, currentSchedule);
          currentSchedule.pop();
        }
      }
    }

    backtrack(0, []);
    allCombinations.push(...results);
  }

  // Score and format each valid combination
  const scoredSchedules: ScheduleCombination[] = allCombinations.map((sections, index) => {
    return evaluateSchedule(sections, weights, `sched-${index + 1}`);
  });

  // Sort descending by compatibility score
  scoredSchedules.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return scoredSchedules;
}

// Helper to get combinations of k elements from array
function getCombinations<T>(array: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (array.length === 0) return [];
  const head = array[0];
  const tail = array.slice(1);
  const withHead = getCombinations(tail, k - 1).map(c => [head, ...c]);
  const withoutHead = getCombinations(tail, k);
  return [...withHead, ...withoutHead];
}

// Score a single schedule combination based on user preference weights
export function evaluateSchedule(
  sections: CourseSection[],
  weights: PreferenceWeights,
  id: string
): ScheduleCombination {
  const totalCredits = sections.reduce((sum, s) => {
    // try to get credits from course or default 3
    return sum + 3; 
  }, 0);

  // 1. Professor Rating Score (0 - 100)
  const ratings = sections.map(s => s.professorRating);
  const avgProfRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  // Map 1.0..5.0 rating to 0..100
  const profScore = Math.max(0, Math.min(100, ((avgProfRating - 1.0) / 4.0) * 100));

  // 2. Day-by-day stats: active days, gaps, earliest & latest class
  const daySchedules: Record<DayOfWeek, { start: number; end: number; duration: number }[]> = {
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []
  };

  sections.forEach(sec => {
    sec.timeSlots.forEach(slot => {
      const start = timeToMinutes(slot.startTime);
      const end = timeToMinutes(slot.endTime);
      slot.days.forEach(day => {
        if (daySchedules[day]) {
          daySchedules[day].push({ start, end, duration: end - start });
        }
      });
    });
  });

  let totalGapMinutes = 0;
  let totalClassMinutes = 0;
  let morningClassMinutes = 0;
  let earlyMorningCount = 0; // Classes before 9:30 AM
  let earliestMinute = 24 * 60;
  let latestMinute = 0;
  const activeDaysSet = new Set<DayOfWeek>();

  DAYS_ORDER.forEach(day => {
    const slots = daySchedules[day];
    if (slots.length > 0) {
      activeDaysSet.add(day);
      // Sort slots by start time
      slots.sort((a, b) => a.start - b.start);

      earliestMinute = Math.min(earliestMinute, slots[0].start);
      latestMinute = Math.max(latestMinute, slots[slots.length - 1].end);

      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        totalClassMinutes += slot.duration;

        // Check if early morning (before 09:30 AM = 570 mins)
        if (slot.start < 570) {
          earlyMorningCount++;
        }

        // Calculate preferred time window match
        if (slot.start >= 480 && slot.end <= 720) { // Morning 8am-12pm
          if (weights.preferredTimeOfDay === 'MORNING') morningClassMinutes += slot.duration;
        } else if (slot.start >= 720 && slot.end <= 960) { // Afternoon 12pm-4pm
          if (weights.preferredTimeOfDay === 'AFTERNOON') morningClassMinutes += slot.duration;
        } else if (slot.start >= 960) { // Evening 4pm onwards
          if (weights.preferredTimeOfDay === 'EVENING') morningClassMinutes += slot.duration;
        }

        // Gaps between consecutive classes on same day
        if (i < slots.length - 1) {
          const gap = slots[i + 1].start - slot.end;
          if (gap > 0) {
            totalGapMinutes += gap;
          }
        }
      }
    }
  });

  // Days off calculation
  const daysOff = DAYS_ORDER.filter(day => !activeDaysSet.has(day));

  // Time of Day Score (0 - 100)
  let timeScore = 80;
  if (weights.preferredTimeOfDay !== 'ANY') {
    timeScore = totalClassMinutes > 0 ? (morningClassMinutes / totalClassMinutes) * 100 : 50;
  }

  // Compactness Score (0 - 100)
  let gapScore = 100;
  if (weights.compactnessMode === 'COMPACT') {
    // 0 gap is 100, 300+ mins gap drops to 20
    gapScore = Math.max(10, 100 - (totalGapMinutes / 3));
  } else if (weights.compactnessMode === 'SPACED') {
    // Reward moderate gaps (e.g. 60-180 mins total gap)
    if (totalGapMinutes >= 60 && totalGapMinutes <= 240) {
      gapScore = 100;
    } else if (totalGapMinutes < 60) {
      gapScore = 60;
    } else {
      gapScore = Math.max(20, 100 - ((totalGapMinutes - 240) / 4));
    }
  }

  // Morning Avoidance Score (0 - 100)
  let morningScore = 100;
  if (weights.avoidEarlyMornings) {
    morningScore = Math.max(0, 100 - (earlyMorningCount * 35));
  }

  // Days Off Score (0 - 100) (excluding Saturday from preferred days off calculation)
  let daysOffScore = 50;
  const validPreferredDaysOff = weights.preferredDaysOff.filter(d => d !== 'Sat');
  if (validPreferredDaysOff.length > 0) {
    const matchedDaysOff = validPreferredDaysOff.filter(d => daysOff.includes(d));
    daysOffScore = (matchedDaysOff.length / validPreferredDaysOff.length) * 100;
  } else {
    // General reward for having 3-day or 4-day week
    if (daysOff.includes('Fri')) daysOffScore += 25;
    if (daysOff.includes('Mon')) daysOffScore += 25;
  }

  // Calculate Weighted Composite Score
  const totalWeight =
    weights.professorRatingWeight +
    weights.timeOfDayWeight +
    weights.compactnessWeight +
    weights.morningAvoidanceWeight +
    weights.daysOffWeight;

  let compatibilityScore = 85; // default if all weights are zero
  if (totalWeight > 0) {
    const weightedSum =
      profScore * weights.professorRatingWeight +
      timeScore * weights.timeOfDayWeight +
      gapScore * weights.compactnessWeight +
      morningScore * weights.morningAvoidanceWeight +
      daysOffScore * weights.daysOffWeight;

    compatibilityScore = Math.round(weightedSum / totalWeight);
  }

  // Dynamic tags for highlighting highlights
  const tags: string[] = [];
  if (avgProfRating >= 4.7) tags.push('Top Professors ⭐');
  if (daysOff.includes('Fri')) tags.push('No Friday Classes 🎉');
  if (daysOff.includes('Mon')) tags.push('No Monday Classes ☕');
  if (earlyMorningCount === 0) tags.push('No Early Mornings 💤');
  if (totalGapMinutes <= 30) tags.push('Super Compact ⏱️');
  if (daysOff.length >= 3) tags.push(`${daysOff.length}-Day Weekend 🏖️`);

  return {
    id,
    sections,
    totalCredits,
    avgProfRating: Math.round(avgProfRating * 10) / 10,
    compatibilityScore: Math.max(0, Math.min(100, compatibilityScore)),
    scoreBreakdown: {
      profScore: Math.round(profScore),
      timeScore: Math.round(timeScore),
      gapScore: Math.round(gapScore),
      morningScore: Math.round(morningScore),
      daysOffScore: Math.round(daysOffScore)
    },
    daysOff,
    totalGapMinutes,
    earliestClass: earliestMinute < 24 * 60 ? minutesToFormattedTime(earliestMinute) : 'N/A',
    latestClass: latestMinute > 0 ? minutesToFormattedTime(latestMinute) : 'N/A',
    tags
  };
}

// Generate .ics calendar file content string
export function generateICSFile(schedule: ScheduleCombination): string {
  let icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Course Schedule Builder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  const dayToICSDay: Record<DayOfWeek, string> = {
    Mon: 'MO', Tue: 'TU', Wed: 'WE', Thu: 'TH', Fri: 'FR', Sat: 'SA'
  };

  // Base date for next semester start (e.g. Next Monday)
  const now = new Date();
  const nextMonday = new Date(now.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7)));

  schedule.sections.forEach((sec, idx) => {
    sec.timeSlots.forEach((slot, sIdx) => {
      slot.days.forEach(day => {
        const rruleDay = dayToICSDay[day];
        const [startH, startM] = slot.startTime.split(':').map(Number);
        const [endH, endM] = slot.endTime.split(':').map(Number);

        // Format dates YYYYMMDDTHHMMSSZ
        const dtStart = `${nextMonday.getFullYear()}${String(nextMonday.getMonth() + 1).padStart(2, '0')}${String(nextMonday.getDate()).padStart(2, '0')}T${String(startH).padStart(2, '0')}${String(startM).padStart(2, '0')}00`;
        const dtEnd = `${nextMonday.getFullYear()}${String(nextMonday.getMonth() + 1).padStart(2, '0')}${String(nextMonday.getDate()).padStart(2, '0')}T${String(endH).padStart(2, '0')}${String(endM).padStart(2, '0')}00`;

        icsLines.push('BEGIN:VEVENT');
        icsLines.push(`UID:course-${sec.id}-${sIdx}-${day}-${idx}@schedulebuilder.com`);
        icsLines.push(`SUMMARY:${sec.courseCode}: ${sec.courseTitle} (${sec.sectionId})`);
        icsLines.push(`DESCRIPTION:Professor: ${sec.professor} (Rating: ${sec.professorRating}/5.0)`);
        if (sec.location) icsLines.push(`LOCATION:${sec.location}`);
        icsLines.push(`DTSTART;TZID=America/New_York:${dtStart}`);
        icsLines.push(`DTEND;TZID=America/New_York:${dtEnd}`);
        icsLines.push(`RRULE:FREQ=WEEKLY;BYDAY=${rruleDay};COUNT=15`);
        icsLines.push('END:VEVENT');
      });
    });
  });

  icsLines.push('END:VCALENDAR');
  return icsLines.join('\r\n');
}
