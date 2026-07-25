export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export interface TimeSlot {
  days: DayOfWeek[];
  startTime: string; // "09:00"
  endTime: string;   // "10:15"
  location?: string;
}

export interface CourseSection {
  id: string;            // Unique id, e.g. "cs101-sec01"
  sectionId: string;     // Section name/code e.g. "Section 01"
  courseCode: string;    // e.g. "CS 101"
  courseTitle: string;   // e.g. "Intro to Computer Science"
  professor: string;
  professorRating: number; // 1.0 to 5.0
  difficultyRating?: number; // 1.0 to 5.0
  location?: string;
  status?: string;        // "Open", "Closed", "Waitlist"
  openSeats?: number;
  timeSlots: TimeSlot[];
  color?: string;         // Tailwind color code or hex for visual differentiation
}

export interface Course {
  id: string;
  code: string;           // "CS 101"
  title: string;          // "Intro to Computer Science"
  credits: number;
  department?: string;
  required?: boolean;     // Whether this course must be included in generation
  selected?: boolean;     // Included in scheduler pool
  sections: CourseSection[];
}

export interface PreferenceWeights {
  professorRatingWeight: number;    // 0 to 100
  preferredTimeOfDay: 'ANY' | 'MORNING' | 'AFTERNOON' | 'EVENING';
  timeOfDayWeight: number;         // 0 to 100
  compactnessMode: 'COMPACT' | 'SPACED' | 'BALANCED';
  compactnessWeight: number;       // 0 to 100
  avoidEarlyMornings: boolean;
  morningAvoidanceWeight: number;  // 0 to 100
  preferredDaysOff: DayOfWeek[];
  daysOffWeight: number;           // 0 to 100
}

export interface ScoreBreakdown {
  profScore: number;      // 0-100
  timeScore: number;      // 0-100
  gapScore: number;       // 0-100
  morningScore: number;   // 0-100
  daysOffScore: number;   // 0-100
}

export interface ScheduleCombination {
  id: string;
  sections: CourseSection[];
  totalCredits: number;
  avgProfRating: number;
  compatibilityScore: number; // Final weighted score 0 - 100%
  scoreBreakdown: ScoreBreakdown;
  daysOff: DayOfWeek[];
  totalGapMinutes: number;
  earliestClass: string;
  latestClass: string;
  tags: string[];
}

export interface PresetCatalog {
  id: string;
  title: string;
  description: string;
  courses: Course[];
}
