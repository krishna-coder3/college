import React, { useState } from 'react';
import { Button } from './ui/Button';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Tag,
  GraduationCap,
  Sparkles,
  PartyPopper,
  X,
  ExternalLink,
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  category: 'EXAM' | 'HOLIDAY' | 'DEADLINE' | 'EVENT' | 'WORKSHOP';
  dateStr: string;
  timeStr?: string;
  location?: string;
  description: string;
}

interface AcademicCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicCalendarModal: React.FC<AcademicCalendarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'EXAM' | 'HOLIDAY' | 'DEADLINE' | 'EVENT'>('ALL');

  const events: EventItem[] = [
    {
      id: 'ev-01',
      title: 'Mid-Semester Examinations (All B.Tech & MCA Programs)',
      category: 'EXAM',
      dateStr: 'October 14 – October 22, 2026',
      timeStr: '09:30 AM - 12:30 PM',
      location: 'Central Examination Complex, Block A',
      description: 'Theory and laboratory mid-term examinations. Admit cards must be downloaded from the student portal.',
    },
    {
      id: 'ev-02',
      title: 'UP Post-Matric Scholarship Physical Document Submission Deadline',
      category: 'DEADLINE',
      dateStr: 'October 10, 2026',
      timeStr: '05:00 PM Sharp',
      location: 'Scholarship Nodal Office, Ground Floor Admin',
      description: 'Final deadline for submitting physical hard copies of scholarship income certificates and fee receipts.',
    },
    {
      id: 'ev-03',
      title: 'Dussehra & Autumn Break (Campus Recess)',
      category: 'HOLIDAY',
      dateStr: 'October 24 – October 26, 2026',
      description: 'University academic departments, libraries, and administrative offices will observe official holiday.',
    },
    {
      id: 'ev-04',
      title: 'KMU Annual National Tech Fest "INNOVISION 2026"',
      category: 'EVENT',
      dateStr: 'November 05 – November 07, 2026',
      timeStr: '10:00 AM Onwards',
      location: 'Main University Auditorium & CS Labs',
      description: 'Hackathon, robotics obstacle course, coding sprint, and AI symposium with industry keynote speakers.',
    },
    {
      id: 'ev-05',
      title: 'Campus Placement Drive: Top Tier Technology Firms',
      category: 'EVENT',
      dateStr: 'November 18, 2026',
      timeStr: '09:00 AM',
      location: 'Placement Training Center',
      description: 'For final year B.Tech, BCA, and MBA scholars with 60%+ throughout aggregate.',
    },
  ];

  if (!isOpen) return null;

  const filtered = events.filter((e) => (filter === 'ALL' ? true : e.category === filter));

  const categoryBadges: Record<string, { bg: string; text: string; label: string }> = {
    EXAM: { bg: 'bg-rose-100 border-rose-200', text: 'text-rose-800', label: 'Examinations' },
    HOLIDAY: { bg: 'bg-emerald-100 border-emerald-200', text: 'text-emerald-800', label: 'University Holiday' },
    DEADLINE: { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-800', label: 'Critical Deadline' },
    EVENT: { bg: 'bg-indigo-100 border-indigo-200', text: 'text-indigo-800', label: 'Campus Event' },
    WORKSHOP: { bg: 'bg-cyan-100 border-cyan-200', text: 'text-cyan-800', label: 'Academic Workshop' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Academic Calendar & Campus Events</h3>
              <p className="text-xs text-blue-200">Official semester milestones, exams, deadlines & cultural events</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-semibold text-slate-500 shrink-0">Filter:</span>
          {(['ALL', 'EXAM', 'DEADLINE', 'EVENT', 'HOLIDAY'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
                filter === cat
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Schedules' : cat}
            </button>
          ))}
        </div>

        {/* Events Timeline Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="space-y-3">
            {filtered.map((item) => {
              const badge = categoryBadges[item.category];
              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                    <span className="font-mono text-slate-500 font-semibold flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.dateStr}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h4>

                  <p className="text-slate-600 leading-relaxed text-[11px]">{item.description}</p>

                  {(item.location || item.timeStr) && (
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex-wrap">
                      {item.timeStr && <span>Timing: {item.timeStr}</span>}
                      {item.location && (
                        <span className="flex items-center gap-1 text-blue-700">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Notified via Dean of Academic Affairs Gazette</span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
