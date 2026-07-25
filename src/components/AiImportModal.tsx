import React, { useState } from 'react';
import { Sparkles, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Course } from '../types';

interface AiImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCourses: (parsedCourses: Course[]) => void;
}

export const AiImportModal: React.FC<AiImportModalProps> = ({
  isOpen,
  onClose,
  onImportCourses
}) => {
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExtract = async () => {
    if (!rawText.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/parse-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });

      if (!res.ok) {
        throw new Error('Failed to parse courses from text');
      }

      const data = await res.json();
      if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
        // Map into Course format with IDs
        const formatted: Course[] = data.courses.map((c: any, index: number) => ({
          id: `ai-course-${Date.now()}-${index}`,
          code: c.code || 'UNKN 101',
          title: c.title || 'Untitled Course',
          credits: c.credits || 3,
          department: c.department || '',
          selected: true,
          sections: (c.sections || []).map((s: any, sIdx: number) => ({
            id: `ai-sec-${Date.now()}-${index}-${sIdx}`,
            sectionId: s.sectionId || `Sec 0${sIdx + 1}`,
            courseCode: c.code || '',
            courseTitle: c.title || '',
            professor: s.professor || 'Staff',
            professorRating: Number(s.professorRating) || 4.0,
            location: s.location || 'Campus Hall',
            status: s.status || 'Open',
            timeSlots: (s.timeSlots || []).map((ts: any) => ({
              days: ts.days || ['Mon', 'Wed'],
              startTime: ts.startTime || '10:00',
              endTime: ts.endTime || '11:15',
              location: ts.location || s.location
            })),
            color: 'indigo'
          }))
        }));

        onImportCourses(formatted);
        onClose();
        setRawText('');
      } else {
        setError('No valid courses could be detected in the pasted text. Please check the text and try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error communicating with AI parser service.');
    } finally {
      setIsLoading(false);
    }
  };

  const samplePlaceholder = `Example pasted text from university catalog:

CS 101 Intro to Programming (4 Credits)
Section 01: Prof. Alan Turing (Rating: 4.8), Mon/Wed/Fri 09:00 - 10:15, Room Turing 101
Section 02: Prof. Grace Hopper (Rating: 4.9), Tue/Thu 13:00 - 14:30, Room Science 302

MATH 201 Linear Algebra (3 Credits)
Section 01: Prof. Katherine Johnson (Rating: 4.7), Mon/Wed/Fri 10:30 - 11:45, Room Euler 204
Section 02: Prof. Carl Gauss (Rating: 4.1), Tue/Thu 10:00 - 11:30, Room Euler 105`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">AI Course List Extractor</h3>
              <p className="text-xs text-slate-500">Paste raw text from your university portal, syllabus, or catalog</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
        </div>

        {/* Text Area */}
        <div className="mb-4">
          <textarea
            rows={8}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={samplePlaceholder}
            className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setRawText(samplePlaceholder)}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            Load Sample Snippet
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleExtract}
              disabled={isLoading || !rawText.trim()}
              className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  <span>Extracting with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Extract & Add Courses</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
