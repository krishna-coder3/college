import React from 'react';
import { Ticket } from '../types';
import { CheckCircle2, Clock, BarChart2, ShieldAlert } from 'lucide-react';

interface TicketDashboardWidgetProps {
  tickets: Ticket[];
  onFilterChange?: (status: string) => void;
  activeStatusFilter?: string;
}

export const TicketDashboardWidget: React.FC<TicketDashboardWidgetProps> = ({
  tickets,
  onFilterChange,
  activeStatusFilter = 'ALL',
}) => {
  const total = tickets.length;

  const counts = {
    open: tickets.filter((t) => t.status === 'OPEN' || t.status === 'SUBMITTED').length,
    inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED' || t.status === 'WAITING_FOR_STUDENT').length,
    escalated: tickets.filter((t) => t.status === 'ESCALATED').length,
    resolved: tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
    reopened: tickets.filter((t) => t.status === 'REOPENED').length,
  };

  // Percentage calculations
  const pctOpen = total > 0 ? (counts.open / total) * 100 : 0;
  const pctInProgress = total > 0 ? (counts.inProgress / total) * 100 : 0;
  const pctEscalated = total > 0 ? (counts.escalated / total) * 100 : 0;
  const pctResolved = total > 0 ? (counts.resolved / total) * 100 : 0;
  const pctReopened = total > 0 ? (counts.reopened / total) * 100 : 0;

  // SVG Doughnut Chart parameters
  const size = 110;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate segment offsets for doughnut
  let accumulatedPercent = 0;
  const segments = [
    { label: 'Open', count: counts.open, color: '#3B82F6', strokeClass: 'stroke-blue-500', filterKey: 'OPEN', pct: pctOpen },
    { label: 'In Progress', count: counts.inProgress, color: '#0EA5E9', strokeClass: 'stroke-sky-500', filterKey: 'IN_PROGRESS', pct: pctInProgress },
    { label: 'Escalated', count: counts.escalated, color: '#EF4444', strokeClass: 'stroke-red-500', filterKey: 'ESCALATED', pct: pctEscalated },
    { label: 'Resolved', count: counts.resolved, color: '#10B981', strokeClass: 'stroke-emerald-500', filterKey: 'RESOLVED', pct: pctResolved },
    { label: 'Reopened', count: counts.reopened, color: '#F59E0B', strokeClass: 'stroke-amber-500', filterKey: 'REOPENED', pct: pctReopened },
  ].filter(s => s.count > 0);

  const resolutionRate = total > 0 ? Math.round((counts.resolved / total) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/40 rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left: Summary and Doughnut Visual */}
        <div className="flex items-center gap-5 sm:gap-6 w-full lg:w-auto">
          {/* Doughnut Chart */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="stroke-slate-100"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {total === 0 ? (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  className="stroke-slate-200"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${circumference} ${circumference}`}
                />
              ) : (
                segments.map((seg, idx) => {
                  const strokeDasharray = `${(seg.pct / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                  accumulatedPercent += seg.pct;
                  return (
                    <circle
                      key={idx}
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke={seg.color}
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  );
                })
              )}
            </svg>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                {total}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Total
              </span>
            </div>
          </div>

          {/* Quick Metrics Text */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-blue-100/70 text-blue-700">
                <BarChart2 className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-slate-900">Complaints Health Overview</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Overall grievance resolution rate is{' '}
              <span className="font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                {resolutionRate}%
              </span>
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {counts.open + counts.inProgress} Active
              </span>
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {counts.resolved} Closed
              </span>
              {counts.escalated > 0 && (
                <span className="flex items-center gap-1 font-semibold text-red-600">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {counts.escalated} Escalated
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Interactive Status Breakdown Cards & Segmented Progress Bar */}
        <div className="w-full lg:max-w-xl space-y-3">
          {/* Segmented Linear Progress Bar */}
          <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
              <span>Status Distribution</span>
              <span>{total} tickets submitted</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner gap-0.5 p-0.5">
              {total === 0 ? (
                <div className="h-full w-full bg-slate-200 rounded-full" />
              ) : (
                <>
                  {counts.open > 0 && (
                    <div
                      style={{ width: `${pctOpen}%` }}
                      className="h-full bg-blue-500 rounded-sm transition-all duration-300"
                      title={`Open: ${counts.open}`}
                    />
                  )}
                  {counts.inProgress > 0 && (
                    <div
                      style={{ width: `${pctInProgress}%` }}
                      className="h-full bg-sky-500 rounded-sm transition-all duration-300"
                      title={`In Progress: ${counts.inProgress}`}
                    />
                  )}
                  {counts.escalated > 0 && (
                    <div
                      style={{ width: `${pctEscalated}%` }}
                      className="h-full bg-red-500 rounded-sm transition-all duration-300"
                      title={`Escalated: ${counts.escalated}`}
                    />
                  )}
                  {counts.resolved > 0 && (
                    <div
                      style={{ width: `${pctResolved}%` }}
                      className="h-full bg-emerald-500 rounded-sm transition-all duration-300"
                      title={`Resolved: ${counts.resolved}`}
                    />
                  )}
                  {counts.reopened > 0 && (
                    <div
                      style={{ width: `${pctReopened}%` }}
                      className="h-full bg-amber-500 rounded-sm transition-all duration-300"
                      title={`Reopened: ${counts.reopened}`}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick-Filter Status Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Open */}
            <button
              onClick={() => onFilterChange && onFilterChange(activeStatusFilter === 'OPEN' ? 'ALL' : 'OPEN')}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all text-left ${
                activeStatusFilter === 'OPEN'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white hover:bg-blue-50/60 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${activeStatusFilter === 'OPEN' ? 'bg-white' : 'bg-blue-500'}`} />
                <span className="font-semibold">Open</span>
              </div>
              <span className={`font-mono font-bold text-xs ${activeStatusFilter === 'OPEN' ? 'text-blue-100' : 'text-slate-900'}`}>
                {counts.open}
              </span>
            </button>

            {/* In Progress */}
            <button
              onClick={() => onFilterChange && onFilterChange(activeStatusFilter === 'IN_PROGRESS' ? 'ALL' : 'IN_PROGRESS')}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all text-left ${
                activeStatusFilter === 'IN_PROGRESS'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white hover:bg-sky-50/60 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${activeStatusFilter === 'IN_PROGRESS' ? 'bg-white' : 'bg-sky-500'}`} />
                <span className="font-semibold">In Progress</span>
              </div>
              <span className={`font-mono font-bold text-xs ${activeStatusFilter === 'IN_PROGRESS' ? 'text-sky-100' : 'text-slate-900'}`}>
                {counts.inProgress}
              </span>
            </button>

            {/* Resolved */}
            <button
              onClick={() => onFilterChange && onFilterChange(activeStatusFilter === 'RESOLVED' ? 'ALL' : 'RESOLVED')}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all text-left ${
                activeStatusFilter === 'RESOLVED'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white hover:bg-emerald-50/60 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${activeStatusFilter === 'RESOLVED' ? 'bg-white' : 'bg-emerald-500'}`} />
                <span className="font-semibold">Resolved</span>
              </div>
              <span className={`font-mono font-bold text-xs ${activeStatusFilter === 'RESOLVED' ? 'text-emerald-100' : 'text-slate-900'}`}>
                {counts.resolved}
              </span>
            </button>

            {/* Escalated or Reopened */}
            <button
              onClick={() => onFilterChange && onFilterChange(activeStatusFilter === 'ESCALATED' ? 'ALL' : 'ESCALATED')}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all text-left ${
                activeStatusFilter === 'ESCALATED'
                  ? 'bg-red-600 text-white border-red-600 shadow-xs'
                  : 'bg-white hover:bg-red-50/60 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${activeStatusFilter === 'ESCALATED' ? 'bg-white' : 'bg-red-500'}`} />
                <span className="font-semibold">Escalated</span>
              </div>
              <span className={`font-mono font-bold text-xs ${activeStatusFilter === 'ESCALATED' ? 'text-red-100' : 'text-slate-900'}`}>
                {counts.escalated}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
