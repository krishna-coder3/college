import React, { useState } from 'react';
import { Ticket, UserRole, TicketMessage } from '../types';
import { StatusBadge, PriorityBadge, RoleBadge } from './ui/Badge';
import { Button } from './ui/Button';
import {
  Clock,
  ShieldAlert,
  CheckCircle,
  FileText,
  Send,
  Lock,
  User,
  MessageSquare,
  Paperclip,
} from 'lucide-react';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  currentUserRole: UserRole;
  onStatusChange?: (ticketId: string, newStatus: Ticket['status']) => void;
  onSendMessage?: (ticketId: string, text: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
  currentUserRole,
  onStatusChange,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CHAT'>('OVERVIEW');
  const [replyText, setReplyText] = useState('');
  const [localMessages, setLocalMessages] = useState<TicketMessage[]>([
    {
      id: 'msg-01',
      ticketId: ticket?.id || 'tkt-01',
      senderId: 'usr-student-01',
      senderName: ticket?.studentName || 'Krishna Rajput',
      senderRole: 'STUDENT',
      content: ticket?.description || 'Initial grievance description submitted.',
      isInternalNote: false,
      createdAt: ticket?.createdAt || new Date().toISOString(),
      attachments: [],
    },
    {
      id: 'msg-02',
      ticketId: ticket?.id || 'tkt-01',
      senderId: 'usr-agent-01',
      senderName: ticket?.assignedAgentName || 'Anjali Sharma (IT Officer)',
      senderRole: 'HELPDESK_AGENT',
      content: 'Acknowledged your request. Our campus technical crew is analyzing the access point logs.',
      isInternalNote: false,
      createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      attachments: [],
    },
  ]);

  if (!ticket) return null;

  const canStaffViewInternalNotes =
    currentUserRole !== 'STUDENT' && currentUserRole !== 'FACULTY';

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticketId: ticket.id,
      senderId: currentUserRole === 'STUDENT' ? ticket.studentId : 'usr-staff',
      senderName: currentUserRole === 'STUDENT' ? ticket.studentName : 'University Desk Officer',
      senderRole: currentUserRole,
      content: replyText.trim(),
      isInternalNote: false,
      createdAt: new Date().toISOString(),
      attachments: [],
    };

    setLocalMessages((prev) => [...prev, newMsg]);
    if (onSendMessage) {
      onSendMessage(ticket.id, replyText.trim());
    }
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20">
                {ticket.ticketNumber}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
              {ticket.subject}
            </h2>
            <div className="text-xs text-blue-200 flex items-center gap-4 flex-wrap">
              <span>Dept: <strong>{ticket.departmentName}</strong></span>
              <span>•</span>
              <span>Category: {ticket.categoryName}</span>
              <span>•</span>
              <span>Source: {ticket.source}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Sub-tabs: Overview vs Live Chat */}
        <div className="bg-slate-100/90 px-6 py-2 border-b border-slate-200 flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`pb-1.5 pt-1 border-b-2 transition-all ${
              activeTab === 'OVERVIEW'
                ? 'border-blue-700 text-blue-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Grievance Overview & SLA
          </button>
          <button
            onClick={() => setActiveTab('CHAT')}
            className={`pb-1.5 pt-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'CHAT'
                ? 'border-blue-700 text-blue-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Live Conversation ({localMessages.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {activeTab === 'OVERVIEW' ? (
            <>
              {/* SLA Status Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">SLA Commitment</p>
                    <p className="text-sm font-bold text-slate-800">
                      {ticket.sla.breached ? (
                        <span className="text-rose-600 flex items-center gap-1 font-extrabold">
                          <ShieldAlert className="w-4 h-4" /> SLA Breached
                        </span>
                      ) : (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> On-Track (Target: {ticket.sla.targetHours}h)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Assigned Officer</p>
                  <p className="font-semibold text-slate-800">
                    {ticket.assignedAgentName || 'Unassigned (In Triage)'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Complaint Description
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line">
                  {ticket.description}
                </div>
              </div>

              {/* Internal Staff Notes (RBAC Protected: Invisible to Student & Faculty) */}
              {canStaffViewInternalNotes ? (
                <div className="border border-amber-200 bg-amber-50/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                      <Lock className="w-3.5 h-3.5 text-amber-700" /> Staff Internal Notes (Confidential)
                    </span>
                    <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                      Restricted to Staff
                    </span>
                  </div>
                  <p className="text-xs text-amber-950/80 leading-relaxed italic">
                    &ldquo;Contacted network engineer. Vendor is scheduled for inspection at 4:00 PM. Verified student hostel identity credentials.&rdquo;
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Staff internal triage notes are protected and hidden from student view.
                </div>
              )}

              {/* Status Controls & Email Alert Triggers */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {canStaffViewInternalNotes ? 'Staff Actions & Status Transition' : 'Live Status & Email Alert Simulator'}
                  </h4>
                  <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                    <Send className="w-3 h-3" /> Sends automated email to: {ticket.studentEmail}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={ticket.status === 'IN_PROGRESS' ? 'primary' : 'outline'}
                    onClick={() => onStatusChange && onStatusChange(ticket.id, 'IN_PROGRESS')}
                  >
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Set In Progress (Dispatches Email)
                  </Button>
                  <Button
                    size="sm"
                    variant={ticket.status === 'RESOLVED' ? 'primary' : 'secondary'}
                    onClick={() => onStatusChange && onStatusChange(ticket.id, 'RESOLVED')}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Mark Resolved (Dispatches Email)
                  </Button>
                  {canStaffViewInternalNotes && (
                    <>
                      <Button
                        size="sm"
                        variant={ticket.status === 'WAITING_FOR_STUDENT' ? 'primary' : 'outline'}
                        onClick={() => onStatusChange && onStatusChange(ticket.id, 'WAITING_FOR_STUDENT')}
                      >
                        Wait for Student
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onStatusChange && onStatusChange(ticket.id, 'ESCALATED')}
                      >
                        Escalate
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Realtime Conversation Thread */
            <div className="space-y-4">
              <div className="space-y-3">
                {localMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-2xl border ${
                      msg.senderRole === 'STUDENT'
                        ? 'bg-blue-50/60 border-blue-200 ml-4'
                        : 'bg-white border-slate-200 mr-4 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{msg.senderName}</span>
                        <RoleBadge role={msg.senderRole} size="sm" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{msg.content}</p>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-2 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Type a reply as ${currentUserRole === 'STUDENT' ? 'Student' : 'Staff Officer'}...`}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="submit" size="sm" variant="primary" disabled={!replyText.trim()}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Reply
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Created on {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Window
          </Button>
        </div>
      </div>
    </div>
  );
};
