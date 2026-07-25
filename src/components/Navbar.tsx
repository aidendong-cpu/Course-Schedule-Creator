import React from 'react';
import { Calendar, Sparkles, SlidersHorizontal, BookOpen, Download, RotateCcw } from 'lucide-react';
import { PresetCatalog } from '../types';

interface NavbarProps {
  catalogs: PresetCatalog[];
  activeCatalogId: string;
  onSelectCatalog: (id: string) => void;
  onOpenAiAssistant: () => void;
  onOpenTextParser: () => void;
  onResetToDefaults: () => void;
  onExportICS: () => void;
  activeScheduleCount: number;
  totalCoursesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  catalogs,
  activeCatalogId,
  onSelectCatalog,
  onOpenAiAssistant,
  onOpenTextParser,
  onResetToDefaults,
  onExportICS,
  activeScheduleCount,
  totalCoursesCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Course Schedule Builder
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Conflict-Free Generator & Prof Rating Optimizer
            </p>
          </div>
        </div>

        {/* Catalog Preset Selector */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-slate-300 font-medium">Preset:</span>
          <select
            value={activeCatalogId}
            onChange={(e) => onSelectCatalog(e.target.value)}
            className="bg-transparent text-xs text-indigo-200 font-semibold focus:outline-none cursor-pointer pr-2"
          >
            {catalogs.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Parser / Copy Paste */}
          <button
            onClick={onOpenTextParser}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="Import course list from raw text using AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI Import List</span>
          </button>

          {/* AI Preference Smart Bar */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>AI Preference Prompt</span>
          </button>

          {/* Export to ICS */}
          <button
            onClick={onExportICS}
            disabled={activeScheduleCount === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeScheduleCount > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
            }`}
            title="Download iCal (.ics) file for Google/Apple Calendar"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export Calendar (.ics)</span>
          </button>

          {/* Reset */}
          <button
            onClick={onResetToDefaults}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            title="Reset to default settings"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
