import React, { useState } from 'react';
import { Department, Ticket, TicketPriority } from '../types';
import { Button } from './ui/Button';
import { AlertCircle, CheckCircle2, UploadCloud, Info } from 'lucide-react';

interface SubmitTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onSubmit: (ticketData: Partial<Ticket>) => void;
}

export const SubmitTicketModal: React.FC<SubmitTicketModalProps> = ({
  isOpen,
  onClose,
  departments,
  onSubmit,
}) => {
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [categoryName, setCategoryName] = useState('Wi-Fi & Network Access');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Duplicate complaint heuristic detection simulation
  const isDuplicateSuspicion =
    subject.toLowerCase().includes('wifi') ||
    subject.toLowerCase().includes('hostel') ||
    subject.toLowerCase().includes('internet');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const selectedDept = departments.find((d) => d.id === departmentId);
      onSubmit({
        departmentId,
        departmentName: selectedDept?.name || 'General Administration',
        categoryName,
        priority,
        subject,
        description,
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Student Grievance & Request Portal
            </span>
            <h2 className="text-xl font-bold tracking-tight">Submit New Ticket</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Duplicate Detection Alert */}
          {isDuplicateSuspicion && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 text-xs uppercase tracking-wide">
                  Related Campus Incident In Progress
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  Active Notice: <em>&ldquo;Campus Wi-Fi Switch Maintenance & Hostel C Access Point Outage&rdquo;</em> is currently under investigation by the IT Dept. If your issue matches this, engineers are already actively resolving it.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Department *
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">Low (72 hours SLA)</option>
                <option value="MEDIUM">Medium (48 hours SLA)</option>
                <option value="HIGH">High (24 hours SLA)</option>
                <option value="URGENT">Urgent (4 hours SLA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject / Short Title *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Discrepancy in Mid-Term Examination Result or Hostel Wi-Fi issue"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide specific details including room number, course code, transaction ID or exact problem symptoms..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Attachment Box */}
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-5 text-center bg-slate-50/50 cursor-pointer transition-colors">
            <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">
              Drag & Drop screenshots, fee slips, or documents (PDF, JPG, PNG)
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Maximum 10 MB per file</p>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
