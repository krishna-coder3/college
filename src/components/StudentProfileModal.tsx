import React, { useState } from 'react';
import { UserProfile } from '../types';
import { UniversityLogo } from './ui/UniversityLogo';
import { Button } from './ui/Button';
import {
  User,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  Calendar,
  Shield,
  Bell,
  Languages,
  Moon,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'PREFERENCES' | 'SECURITY' | 'DELETION'>('DETAILS');
  const [phone, setPhone] = useState(profile.phone || '+91 98765 43210');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile({ phone });
    setSaveMessage('Profile information saved successfully.');
    setTimeout(() => setSaveMessage(null), 2500);
  };

  const handleDeleteRequest = () => {
    if (!deleteReason) return;
    setDeleteRequested(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 font-black text-2xl flex items-center justify-center border-2 border-white/20 shadow-md">
              {profile.fullName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{profile.fullName}</h3>
                <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Active Student
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Enrollment: <strong className="font-mono text-white">{profile.enrollmentNumber || 'EN25008912'}</strong> • ID: STU-2026-08912
              </p>
              <p className="text-[11px] text-blue-300">
                Department of Computer Science & Engineering • Semester 6
              </p>
            </div>
          </div>

          {/* Navigation Sub-tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-white/10 pb-1 text-xs">
            <button
              onClick={() => setActiveTab('DETAILS')}
              className={`pb-2 px-1 font-semibold transition-colors border-b-2 ${
                activeTab === 'DETAILS' ? 'border-cyan-400 text-cyan-300 font-bold' : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              Academic Profile
            </button>
            <button
              onClick={() => setActiveTab('PREFERENCES')}
              className={`pb-2 px-1 font-semibold transition-colors border-b-2 ${
                activeTab === 'PREFERENCES' ? 'border-cyan-400 text-cyan-300 font-bold' : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              Notifications & Language
            </button>
            <button
              onClick={() => setActiveTab('SECURITY')}
              className={`pb-2 px-1 font-semibold transition-colors border-b-2 ${
                activeTab === 'SECURITY' ? 'border-cyan-400 text-cyan-300 font-bold' : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('DELETION')}
              className={`pb-2 px-1 font-semibold transition-colors border-b-2 ${
                activeTab === 'DELETION' ? 'border-rose-400 text-rose-300 font-bold' : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              Account Deletion
            </button>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5">
          {saveMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{saveMessage}</span>
            </div>
          )}

          {activeTab === 'DETAILS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Institutional Email</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>{profile.email}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Mobile</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white px-2 py-0.5 border border-slate-300 rounded font-medium text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Academic Year</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>2025 - 2026 (Third Year)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Degree Program</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>B.Tech in Computer Science</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'PREFERENCES' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  Grievance Alerts & Channels
                </h4>
                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-semibold text-slate-800">Email Notifications</p>
                      <p className="text-[11px] text-slate-500">Receive status updates when tickets change to In Progress or Resolved</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifs}
                      onChange={(e) => setEmailNotifs(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                  </label>
                  <div className="border-t border-slate-200 pt-2" />
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-semibold text-slate-800">Push Notifications (FCM)</p>
                      <p className="text-[11px] text-slate-500">Instant desktop and mobile notifications for urgent university alerts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pushNotifs}
                      onChange={(e) => setPushNotifs(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                  </label>
                  <div className="border-t border-slate-200 pt-2" />
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-semibold text-slate-800">SMS / WhatsApp Alerts</p>
                      <p className="text-[11px] text-slate-500">Critical campus closure and fee deadline alerts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsNotifs}
                      onChange={(e) => setSmsNotifs(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-blue-600" />
                  Language & Regional Settings
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`p-3 rounded-xl border text-left font-medium transition-all ${
                      language === 'en' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="font-bold">English (Default)</div>
                    <div className="text-[10px] text-slate-500">Official university English</div>
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`p-3 rounded-xl border text-left font-medium transition-all ${
                      language === 'hi' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="font-bold">हिन्दी (Hindi)</div>
                    <div className="text-[10px] text-slate-500">भारतीय राजभाषा माध्यम</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Password Management
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Change your password or terminate all other active device sessions.
                </p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    Change Password
                  </Button>
                  <Button size="sm" variant="outline">
                    Sign Out All Devices
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DELETION' && (
            <div className="space-y-4">
              <div className="border border-rose-200 bg-rose-50/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h4>Request Account Deletion & Record Anonymization</h4>
                </div>
                <p className="text-rose-900/80 leading-relaxed text-[11px]">
                  In compliance with statutory university academic retention policies, active enrollment, examination degrees, and audited financial ledgers cannot be deleted instantly. Your request will be queued for University Registrar review.
                </p>

                {!deleteRequested ? (
                  <div className="space-y-2 pt-2">
                    <label className="block font-bold text-rose-950 text-[11px]">
                      Reason for Deletion Request:
                    </label>
                    <textarea
                      rows={3}
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      placeholder="e.g. Graduated from university / transferring to another institution..."
                      className="w-full p-2.5 bg-white border border-rose-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={handleDeleteRequest}
                      disabled={!deleteReason.trim()}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Submit Deletion Request
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 bg-white border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Account deletion request has been submitted to the University Registrar. Request ID: DEL-2026-891.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <Button variant="danger" size="sm" onClick={onLogout}>
            Sign Out
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
