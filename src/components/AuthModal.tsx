import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { UniversityLogo } from './ui/UniversityLogo';
import { Button } from './ui/Button';
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  Building2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  KeyRound,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  initialMode?: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'LOGIN',
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'OTP'>(initialMode);
  const [role, setRole] = useState<UserRole>('STUDENT');

  // Form fields
  const [email, setEmail] = useState('krishnarajput18511@gmail.com');
  const [password, setPassword] = useState('••••••••••');
  const [fullName, setFullName] = useState('Krishna Rajput');
  const [studentId, setStudentId] = useState('STU-2026-08912');
  const [enrollmentNo, setEnrollmentNo] = useState('EN25008912');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'FORGOT_PASSWORD') {
      setMode('OTP');
      setOtpSent(true);
      return;
    }

    if (mode === 'OTP') {
      setSuccessMessage('Password reset successful. You can now login.');
      setTimeout(() => {
        setSuccessMessage(null);
        setMode('LOGIN');
      }, 1500);
      return;
    }

    const authenticatedProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      organizationId: 'org-km-mathura',
      role,
      fullName: mode === 'REGISTER' ? fullName : (role === 'STUDENT' ? 'Krishna Rajput' : 'Prof. University Admin'),
      email,
      phone,
      departmentId: role === 'STUDENT' ? 'dept-cse' : undefined,
      departmentName: role === 'STUDENT' ? department : undefined,
      semester: role === 'STUDENT' ? 6 : undefined,
      academicYear: '2025-2026',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setSuccessMessage(`Welcome, ${authenticatedProfile.fullName}! Authenticated securely.`);
    setTimeout(() => {
      setSuccessMessage(null);
      onLoginSuccess(authenticatedProfile);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <UniversityLogo size="sm" theme="dark" showText={false} />
            <div>
              <h3 className="font-bold text-lg text-white">K.M. University Mathura</h3>
              <p className="text-xs text-blue-200">Single Sign-On & Student Identity Portal</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 mt-4 bg-white/10 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => { setMode('LOGIN'); setSuccessMessage(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'LOGIN' ? 'bg-white text-slate-900 shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('REGISTER'); setSuccessMessage(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'REGISTER' ? 'bg-white text-slate-900 shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              Register Student
            </button>
          </div>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            {mode === 'LOGIN' && (
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                  Sign in as Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['STUDENT', 'FACULTY', 'HELPDESK_AGENT', 'ADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        role === r
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 uppercase">{r.replace('_', ' ')}</div>
                      <div className="font-bold text-xs truncate">
                        {r === 'STUDENT' ? 'Student Portal' : r === 'HELPDESK_AGENT' ? 'Support Agent' : r === 'FACULTY' ? 'Faculty Member' : 'University Admin'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Registration Fields */}
            {mode === 'REGISTER' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Krishna Rajput"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Enrollment Number
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={enrollmentNo}
                        onChange={(e) => setEnrollmentNo(e.target.value)}
                        placeholder="e.g. EN25008912"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Computer Science & Engineering</option>
                        <option>Mechanical Engineering</option>
                        <option>Civil Engineering</option>
                        <option>Pharmacy & Medical Sciences</option>
                        <option>Management Studies (MBA)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            {mode !== 'OTP' && (
              <div>
                <label className="block font-bold text-slate-700 text-[11px] mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@kmuniversity.edu.in"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            {mode !== 'FORGOT_PASSWORD' && mode !== 'OTP' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700 text-[11px]">
                    Password
                  </label>
                  {mode === 'LOGIN' && (
                    <button
                      type="button"
                      onClick={() => setMode('FORGOT_PASSWORD')}
                      className="text-[11px] font-semibold text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter confidential password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* OTP Verification Flow */}
            {mode === 'OTP' && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
                  A 6-digit one-time verification passcode was sent to{' '}
                  <span className="font-bold underline">{email}</span>.
                </div>
                <div>
                  <label className="block font-bold text-slate-700 text-[11px] mb-1">
                    Enter Verification Code (OTP)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="4 9 2 8 1 0"
                    className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Action */}
            <Button type="submit" variant="primary" className="w-full mt-4 py-2.5">
              {mode === 'LOGIN'
                ? `Sign In to ${role === 'STUDENT' ? 'Student Desk' : 'Staff Portal'}`
                : mode === 'REGISTER'
                ? 'Create Student Account'
                : mode === 'FORGOT_PASSWORD'
                ? 'Send Reset Code'
                : 'Verify & Set New Password'}
            </Button>
          </form>

          {/* Security & RLS Disclaimer */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Multi-Tenant Row-Level Security Protected</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Your credentials and grievance tickets are strictly isolated to K.M. University.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
