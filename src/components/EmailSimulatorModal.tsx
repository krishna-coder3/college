import React, { useState } from 'react';
import { SimulatedEmail, Ticket } from '../types';
import { UniversityLogo } from './ui/UniversityLogo';
import {
  Mail,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Inbox,
  Send,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { Button } from './ui/Button';

interface EmailSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: SimulatedEmail[];
  activeEmailId?: string;
  onSelectEmail: (id: string) => void;
  onSimulateAlert: (status: 'IN_PROGRESS' | 'RESOLVED') => void;
  onMarkAllAsRead: () => void;
  onViewTicket: (ticketNumber: string) => void;
}

export const EmailSimulatorModal: React.FC<EmailSimulatorModalProps> = ({
  isOpen,
  onClose,
  emails,
  activeEmailId,
  onSelectEmail,
  onSimulateAlert,
  onMarkAllAsRead,
  onViewTicket,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [reopenRequested, setReopenRequested] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentEmail =
    emails.find((e) => e.id === activeEmailId) || emails[0] || null;

  const isResolved = currentEmail?.status === 'RESOLVED';
  const isInProgress = currentEmail?.status === 'IN_PROGRESS';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh] max-h-[850px]">
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  Student Email Notification System
                </h3>
                <span className="text-[11px] font-semibold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Mock SMTP Simulator
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Simulating transactional automated email dispatches to students via institutional mail servers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Action Bar for testing simulations */}
        <div className="bg-slate-100/90 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Quick Test Trigger:
            </span>
            <button
              onClick={() => onSimulateAlert('IN_PROGRESS')}
              className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 font-medium transition-colors flex items-center gap-1"
            >
              <Clock className="w-3 h-3 text-blue-600" />
              Simulate 'In Progress' Email
            </button>
            <button
              onClick={() => onSimulateAlert('RESOLVED')}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 font-medium transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Simulate 'Resolved' Email
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>
              Total Dispatches: <strong>{emails.length}</strong>
            </span>
            <span>•</span>
            <button
              onClick={onMarkAllAsRead}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          </div>
        </div>

        {/* Main Body: Two Columns */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Email Dispatches List */}
          <div className="w-80 sm:w-96 border-r border-slate-200 bg-slate-50/60 overflow-y-auto shrink-0 flex flex-col">
            <div className="p-3 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Student Inbox (krishna.sharma@kmuniversity.ac.in)</span>
            </div>

            <div className="divide-y divide-slate-200 flex-1">
              {emails.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No email alerts dispatched yet. Change a ticket status to generate an alert.
                </div>
              ) : (
                emails.map((email) => {
                  const isSelected = email.id === currentEmail?.id;
                  const itemResolved = email.status === 'RESOLVED';
                  const itemInProgress = email.status === 'IN_PROGRESS';

                  return (
                    <button
                      key={email.id}
                      onClick={() => onSelectEmail(email.id)}
                      className={`w-full text-left p-4 transition-colors relative flex items-start gap-3 ${
                        isSelected
                          ? 'bg-blue-50/80 border-l-4 border-blue-600'
                          : 'hover:bg-slate-100/70'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          itemResolved
                            ? 'bg-emerald-100 text-emerald-700'
                            : itemInProgress
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {itemResolved ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[11px] font-mono font-bold text-slate-700">
                            {email.ticketNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(email.sentAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <p
                          className={`text-xs truncate ${
                            !email.read ? 'font-bold text-slate-900' : 'text-slate-700'
                          }`}
                        >
                          {email.subject}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {email.departmentName}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                              itemResolved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {email.status}
                          </span>
                          {!email.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Full Transactional HTML Email Preview */}
          <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 flex justify-center">
            {currentEmail ? (
              <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
                {/* Email Client Top Meta bar */}
                <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {currentEmail.subject}
                    </h2>
                    <span
                      className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {currentEmail.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p>
                        <strong className="text-slate-800">From:</strong> K.M. University Helpdesk{' '}
                        <span className="font-mono text-slate-500">&lt;helpdesk@kmuniversity.ac.in&gt;</span>
                      </p>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Signed & Verified (DKIM)
                      </span>
                    </div>
                    <p>
                      <strong className="text-slate-800">To:</strong> {currentEmail.studentName}{' '}
                      <span className="font-mono text-slate-500">&lt;{currentEmail.studentEmail}&gt;</span>
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      <strong>Date:</strong> {new Date(currentEmail.sentAt).toLocaleString()} •{' '}
                      <span className="font-mono">{currentEmail.messageId}</span>
                    </p>
                  </div>
                </div>

                {/* Institutional HTML Email Body */}
                <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
                  {/* University Branded Email Banner */}
                  <div className="border-b border-slate-200 pb-5 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <UniversityLogo size="sm" />
                      <div>
                        <h4 className="font-extrabold text-blue-900 text-sm tracking-tight">
                          K.M. UNIVERSITY MATHURA
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Official University Student Grievance & Helpdesk System
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                      REF: {currentEmail.ticketNumber}
                    </span>
                  </div>

                  {/* Status Banner */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 border ${
                      isResolved
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950'
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-950'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isResolved
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-blue-600 text-white shadow-sm'
                        }`}
                      >
                        {isResolved ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Clock className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-base">
                          {isResolved
                            ? 'Your Complaint Has Been Resolved'
                            : 'Grievance Assigned & Investigation Underway'}
                        </h3>
                        <p className="text-xs mt-1 leading-relaxed opacity-90">
                          {isResolved
                            ? 'The responsible department has concluded the required corrective measures for your submitted ticket. Details and resolution remarks are recorded below.'
                            : 'An engineering specialist or administrative officer has initiated work on your request according to the campus SLA standard.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Salutation */}
                  <div>
                    <p className="font-semibold text-slate-900">
                      Dear {currentEmail.studentName},
                    </p>
                    <p className="mt-2 text-slate-600">
                      This is an official communication regarding your grievance submitted through the
                      K.M. University student portal.
                    </p>
                  </div>

                  {/* Ticket Summary Table */}
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden text-xs">
                    <div className="bg-slate-100/70 px-4 py-2 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Ticket Information
                    </div>
                    <div className="p-4 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <span className="text-slate-400">Subject:</span>
                          <p className="font-semibold text-slate-800">{currentEmail.ticketTitle}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Department:</span>
                          <p className="font-semibold text-slate-800">{currentEmail.departmentName}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Assigned Officer:</span>
                          <p className="font-semibold text-slate-800">{currentEmail.agentName}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">SLA Commitment:</span>
                          <p className="font-semibold text-slate-800">
                            {currentEmail.slaTargetHours || 24} Hours Standard Resolution
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Officer / Resolution Note */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      {isResolved ? 'Official Resolution Remarks' : 'Current Action Note'}
                    </h5>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 text-xs italic leading-relaxed">
                      &ldquo;{currentEmail.resolutionNote}&rdquo;
                    </div>
                  </div>

                  {/* If RESOLVED: Interactive Satisfaction & Reopen Option right in the email */}
                  {isResolved && (
                    <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">
                          Rate Your Resolution Experience
                        </h4>
                        <span className="text-[11px] text-emerald-700 font-medium">
                          Helps improve campus service quality
                        </span>
                      </div>

                      {!feedbackSent ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`p-1.5 rounded-lg transition-transform hover:scale-110 ${
                                  star <= rating ? 'text-amber-500' : 'text-slate-300'
                                }`}
                              >
                                <Star className="w-5 h-5 fill-current" />
                              </button>
                            ))}
                            <span className="ml-2 text-xs font-bold text-slate-700">
                              {rating === 5 ? 'Excellent (5/5)' : `${rating}/5 Stars`}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setFeedbackSent(true)}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Submit Feedback
                            </button>
                            <button
                              onClick={() => setReopenRequested(true)}
                              className="text-xs bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Issue Not Fixed? Request Reopen
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-emerald-100/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          Thank you! Your rating of {rating}/5 has been logged for this ticket.
                        </div>
                      )}

                      {reopenRequested && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
                          Reopen request noted. You can confirm reopen with comments inside the student portal.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Portal CTA Button */}
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => {
                        onViewTicket(currentEmail.ticketNumber);
                        onClose();
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all hover:scale-[1.01]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Full Ticket #{currentEmail.ticketNumber} on Student Portal
                    </button>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Secure authentication token applied • No password required for this link
                    </p>
                  </div>

                  {/* Legal & Institutional Footer */}
                  <div className="border-t border-slate-200 pt-5 text-[11px] text-slate-400 space-y-1">
                    <p>
                      K.M. University Mathura • Delhi-Agra Highway, Mathura, Uttar Pradesh, 281006
                    </p>
                    <p>
                      This is an automated system email. For general assistance, visit{' '}
                      <span className="text-blue-600 underline">https://kmuniversity.ac.in/helpdesk</span>{' '}
                      or call +91 (0565) 240-5000.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 text-sm">
                <Mail className="w-12 h-12 stroke-[1.5] text-slate-300 mb-2" />
                <p>Select an email from the left pane to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
