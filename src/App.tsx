import React, { useState, useEffect } from 'react';
import {
  DEFAULT_KM_UNIVERSITY,
  INITIAL_DEPARTMENTS,
  INITIAL_USERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_FAQS,
  INITIAL_FEES,
  INITIAL_DOCUMENTS,
} from './services/dataService';
import { UserRole, Ticket, TicketStatus, SimulatedEmail, UserProfile } from './types';
import { UniversityLogo } from './components/ui/UniversityLogo';
import { Button } from './components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/Card';
import { StatusBadge, PriorityBadge, RoleBadge } from './components/ui/Badge';
import { HeroWave } from './components/ui/HeroWave';
import { TicketDetailModal } from './components/TicketDetailModal';
import { SubmitTicketModal } from './components/SubmitTicketModal';
import { ArchitectureDrawer } from './components/ArchitectureDrawer';
import { TicketDashboardWidget } from './components/TicketDashboardWidget';
import { EmailNotificationToast } from './components/EmailNotificationToast';
import { EmailSimulatorModal } from './components/EmailSimulatorModal';
import { notificationService } from './services/notificationService';
import { AuthModal } from './components/AuthModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { AiHelpdeskBotModal } from './components/AiHelpdeskBotModal';
import { FeesManagementModal } from './components/FeesManagementModal';
import { DocumentsModal } from './components/DocumentsModal';
import { AcademicCalendarModal } from './components/AcademicCalendarModal';
import { AdminAnalyticsModal } from './components/AdminAnalyticsModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  Search,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileCheck2,
  CreditCard,
  Building2,
  Users,
  Eye,
  Layers,
  ArrowRight,
  ShieldAlert,
  PhoneCall,
  Mail,
  MapPin,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Inbox,
  Trash2,
  ShieldCheck,
  Bot,
  Calendar,
  BarChart3,
  User,
  GraduationCap,
  Settings,
} from 'lucide-react';

export default function App() {
  // State management
  const [currentRole, setCurrentRole] = useState<UserRole>('STUDENT');
  const [isImpersonating, setIsImpersonating] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USERS.STUDENT);

  // Tickets state: Load only REAL student complaints from localStorage. Default to empty (NO fake complaints!).
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem('kmu_real_student_complaints');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return []; // Clean empty start: No fake complaints shown
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'home' | 'tickets' | 'faqs' | 'announcements'>('home');
  
  // Modals & Drawers
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isArchitectureDrawerOpen, setIsArchitectureDrawerOpen] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-001');

  // Enterprise Feature Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isAiBotModalOpen, setIsAiBotModalOpen] = useState(false);
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isAdminAnalyticsModalOpen, setIsAdminAnalyticsModalOpen] = useState(false);

  // Simulated Email Notification System State
  const [simulatedEmails, setSimulatedEmails] = useState<SimulatedEmail[]>(() =>
    notificationService.getSimulatedEmails()
  );
  const [activeEmailToast, setActiveEmailToast] = useState<SimulatedEmail | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [activeEmailId, setActiveEmailId] = useState<string | undefined>(undefined);

  const currentUser = INITIAL_USERS[currentRole];
  const org = DEFAULT_KM_UNIVERSITY;

  // Persist real tickets in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kmu_real_student_complaints', JSON.stringify(tickets));
    } catch {
      // ignore
    }
  }, [tickets]);

  // Subscribe to real-time email dispatch notifications
  useEffect(() => {
    const unsubscribe = notificationService.subscribeEmails((newEmail) => {
      setSimulatedEmails(notificationService.getSimulatedEmails());
      setActiveEmailToast(newEmail);
      // Automatically dismiss floating toast after 8 seconds
      const timer = setTimeout(() => {
        setActiveEmailToast((curr) => (curr?.id === newEmail.id ? null : curr));
      }, 8000);
      return () => clearTimeout(timer);
    });
    return unsubscribe;
  }, []);

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'OPEN'
        ? t.status === 'OPEN' || t.status === 'SUBMITTED'
        : statusFilter === 'IN_PROGRESS'
        ? t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED' || t.status === 'WAITING_FOR_STUDENT'
        : statusFilter === 'RESOLVED'
        ? t.status === 'RESOLVED' || t.status === 'CLOSED'
        : t.status === statusFilter;

    // Student privacy boundary: Student only sees own tickets
    if (currentRole === 'STUDENT' && t.studentId !== currentUser.id) {
      return false;
    }

    return matchesSearch && matchesStatus;
  });

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setIsImpersonating(role !== 'STUDENT');
  };

  const handleCreateTicket = (ticketData: Partial<Ticket>) => {
    const newTicket: Ticket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `CHD-2026-000${tickets.length + 101}`,
      organizationId: org.id,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentEmail: currentUser.email,
      studentEnrollmentNo: currentUser.enrollmentNumber || 'KMU-2026-REG',
      departmentId: ticketData.departmentId || 'dept-cse',
      departmentName: ticketData.departmentName || 'Computer Science & Engineering',
      categoryId: ticketData.categoryId || 'cat-general',
      categoryName: ticketData.categoryName || 'General Query',
      subject: ticketData.subject || 'Student Grievance',
      description: ticketData.description || '',
      priority: ticketData.priority || 'MEDIUM',
      status: 'SUBMITTED',
      sla: {
        targetHours: ticketData.priority === 'URGENT' ? 4 : ticketData.priority === 'HIGH' ? 24 : 48,
        dueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        breached: false,
        remainingMinutes: 1440,
      },
      reopenCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'WEB',
      attachments: [],
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicket(newTicket);

    // Simulated email confirmation
    notificationService.dispatchTicketCreated({
      studentEmail: currentUser.email,
      studentName: currentUser.fullName,
      ticketNumber: newTicket.ticketNumber,
      subject: newTicket.subject,
      organizationId: org.id,
    });
  };

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    let affectedTicket: Ticket | undefined;
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updated = {
            ...t,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString() : t.resolvedAt,
          };
          affectedTicket = updated;
          return updated;
        }
        return t;
      })
    );

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    // Trigger simulated email notification if status is IN_PROGRESS or RESOLVED
    if (affectedTicket && (newStatus === 'IN_PROGRESS' || newStatus === 'RESOLVED' || newStatus === 'ESCALATED')) {
      notificationService.dispatchStatusChangeAlert({
        ticket: affectedTicket,
        newStatus,
        studentEmail: affectedTicket.studentEmail || currentUser.email,
        studentName: affectedTicket.studentName || currentUser.fullName,
      });
    }
  };

  const handleClearAllTickets = () => {
    if (confirm('Clear all submitted complaints from your local student session?')) {
      setTickets([]);
      localStorage.removeItem('kmu_real_student_complaints');
      setSelectedTicket(null);
    }
  };

  // Trigger manual simulation test
  const handleSimulateAlert = (status: 'IN_PROGRESS' | 'RESOLVED') => {
    const dummyTicket: Ticket = tickets[0] || {
      id: 'demo-sample-01',
      ticketNumber: 'CHD-2026-000101',
      organizationId: org.id,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentEmail: currentUser.email,
      studentEnrollmentNo: currentUser.enrollmentNumber || 'KMU-2026-REG',
      departmentId: 'dept-it',
      departmentName: 'Campus IT & Wi-Fi Network',
      categoryId: 'cat-wifi',
      categoryName: 'Wi-Fi & Network Access',
      subject: 'Wi-Fi Access Disconnection in Hostel Block B',
      description: 'Hostel access point reboots frequently.',
      priority: 'HIGH',
      status: status,
      assignedAgentId: 'usr-agent-01',
      assignedAgentName: 'Anjali Sharma (IT Officer)',
      sla: {
        targetHours: 24,
        dueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        breached: false,
        remainingMinutes: 720,
      },
      reopenCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'WEB',
      attachments: [],
    };

    const newEmail = notificationService.dispatchStatusChangeAlert({
      ticket: dummyTicket,
      newStatus: status,
      studentEmail: currentUser.email,
      studentName: currentUser.fullName,
    });

    if (newEmail) {
      setActiveEmailId(newEmail.id);
    }
  };

  const unreadEmailCount = simulatedEmails.filter((e) => !e.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white pb-14 md:pb-0">
      {/* Persistent Impersonation / Support Mode Banner */}
      {isImpersonating && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-inner sticky top-0 z-50">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="p-1 bg-white/20 rounded-md">
              <Eye className="w-3.5 h-3.5" />
            </span>
            <span>
              <strong>Support Mode Active:</strong> You are viewing the system as{' '}
              <span className="underline font-bold">{currentUser.fullName}</span> ({currentUser.role}). Actions will be logged in the audit trail.
            </span>
            <button
              onClick={() => {
                setCurrentRole('STUDENT');
                setIsImpersonating(false);
              }}
              className="ml-auto text-xs bg-white text-amber-900 px-2 py-0.5 rounded font-bold hover:bg-amber-100 transition-colors"
            >
              Exit Support Mode
            </button>
          </div>
        </div>
      )}

      {/* Main University Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo and Crest */}
          <div className="flex items-center gap-4">
            <UniversityLogo
              name={org.branding.universityName}
              subText={org.branding.city}
              motto={org.branding.tagline}
              size="md"
            />
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 font-semibold text-xs text-slate-600">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                activeTab === 'home' ? 'text-blue-700 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                activeTab === 'tickets' ? 'text-blue-700 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              My Complaints ({tickets.length})
            </button>
            <button
              onClick={() => setIsAiBotModalOpen(true)}
              className="px-3 py-2 rounded-xl transition-colors text-indigo-700 hover:bg-indigo-50 font-bold flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5" />
              AI Assistant
            </button>
            <button
              onClick={() => setIsFeesModalOpen(true)}
              className="px-3 py-2 rounded-xl transition-colors hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              Fees & Pay
            </button>
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="px-3 py-2 rounded-xl transition-colors hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              Documents
            </button>
            <button
              onClick={() => setIsCalendarModalOpen(true)}
              className="px-3 py-2 rounded-xl transition-colors hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                activeTab === 'faqs' ? 'text-blue-700 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              FAQs
            </button>
          </nav>

          {/* Role Switcher & Header Actions */}
          <div className="flex items-center gap-2">
            {/* Student Email Inbox Simulator Button */}
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="relative p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 transition-all flex items-center gap-1.5 shadow-2xs"
              title="Open Student Email Notification Simulator"
            >
              <Inbox className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline text-xs font-semibold">Student Mail</span>
              {unreadEmailCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 animate-pulse">
                  {unreadEmailCount}
                </span>
              )}
            </button>

            {/* Analytics button for Admin/Staff */}
            <button
              onClick={() => setIsAdminAnalyticsModalOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all flex items-center gap-1"
              title="Helpdesk Analytics & SLA Performance"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline text-xs font-semibold">Analytics</span>
            </button>

            {/* University Onboarding Wizard */}
            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all flex items-center gap-1"
              title="University Setup Wizard (10 Steps)"
            >
              <Settings className="w-4 h-4 text-blue-600" />
              <span className="hidden xl:inline text-xs font-semibold">Onboard</span>
            </button>

            {/* Student Profile Modal Trigger */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="p-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 transition-all flex items-center gap-1.5"
              title="Student Profile & Settings"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-700 text-white font-bold text-[10px] flex items-center justify-center">
                KR
              </div>
              <span className="hidden md:inline text-xs font-bold">{currentUser.fullName.split(' ')[0]}</span>
            </button>

            {/* Role Simulator Pill */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="bg-transparent text-xs font-bold text-blue-900 focus:outline-none cursor-pointer"
              >
                <option value="STUDENT">Student (Krishna)</option>
                <option value="FACULTY">Faculty (Dr. Mishra)</option>
                <option value="HELPDESK_AGENT">Helpdesk Agent (Anjali)</option>
                <option value="DEPARTMENT_ADMIN">Dept Head (Er. Alok)</option>
                <option value="ADMIN">University Admin</option>
                <option value="UNIVERSITY_OWNER">University Owner</option>
                <option value="SUPER_ADMIN">Platform Super Admin</option>
              </select>
            </div>

            {/* Submit Ticket Action */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSubmitModalOpen(true)}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Submit Ticket
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* HERO SECTION (Faithful to Reference Layout) */}
        {activeTab === 'home' && (
          <>
            <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white pt-16 pb-20 overflow-hidden">
              {/* Background ambient accents */}
              <div className="absolute top-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* Left Column: Hero Text */}
                  <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{org.branding.universityName} • Student Support Portal</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                      Official University{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-200">
                        Helpdesk Portal
                      </span>
                    </h1>

                    <p className="text-base sm:text-lg text-blue-100 max-w-2xl leading-relaxed">
                      Lodge, track, and resolve academic grievances, hostel requests, fee verification, and campus facilities online with guaranteed university SLA turnaround.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 justify-center lg:justify-start flex-wrap">
                      <Button
                        size="lg"
                        variant="gold"
                        onClick={() => setIsSubmitModalOpen(true)}
                        leftIcon={<PlusCircle className="w-5 h-5 text-blue-950" />}
                      >
                        Submit a Complaint
                      </Button>
                      <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => setActiveTab('tickets')}
                        leftIcon={<Clock className="w-5 h-5" />}
                      >
                        Track My Status ({tickets.length})
                      </Button>
                      <button
                        onClick={() => setIsAiBotModalOpen(true)}
                        className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md backdrop-blur-md"
                      >
                        <Sparkles className="w-4 h-4 text-cyan-300" />
                        Ask AI Assistant
                      </button>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 text-left">
                      <div>
                        <p className="text-2xl font-black text-cyan-300">24/7</p>
                        <p className="text-xs text-blue-200">Online Support</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-white">7 Desks</p>
                        <p className="text-xs text-blue-200">Academic & Hostel</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-amber-300">&lt;24 Hrs</p>
                        <p className="text-xs text-blue-200">Target SLA Turnaround</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Heraldic University Crest & Quick Action Box */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-sm">
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 rounded-3xl blur-2xl transform rotate-3" />
                      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center space-y-6">
                        <div className="flex justify-center">
                          <UniversityLogo
                            name={org.branding.universityName}
                            subText={org.branding.city}
                            motto={org.branding.tagline}
                            size="lg"
                            theme="dark"
                          />
                        </div>

                        <div className="space-y-2 text-white">
                          <h3 className="font-extrabold text-lg text-white">
                            Student Grievance Cell
                          </h3>
                          <p className="text-xs text-blue-100 leading-relaxed">
                            Serving 8,400+ undergraduate and postgraduate scholars with transparent grievance tracking and email alerts.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            onClick={() => setIsFeesModalOpen(true)}
                            className="py-2.5 px-3 bg-white/15 hover:bg-white/25 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-colors border border-white/20"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-cyan-300" /> Fee Portal
                          </button>
                          <button
                            onClick={() => setIsDocsModalOpen(true)}
                            className="py-2.5 px-3 bg-white/15 hover:bg-white/25 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-colors border border-white/20"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-cyan-300" /> Verify Docs
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Curved Wave Transition */}
              <HeroWave />
            </section>

            {/* THREE PRIMARY FEATURE CARDS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <Card
                  hoverEffect
                  borderAccent="blue"
                  className="cursor-pointer group"
                  onClick={() => setIsSubmitModalOpen(true)}
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <PlusCircle className="w-6 h-6" />
                    </div>
                    <CardTitle>Submit a Complaint</CardTitle>
                    <CardDescription>
                      Log academic, hostel, scholarship, examination, fee, or campus IT issues directly to assigned university officers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                      <span>Lodge Grievance</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2 */}
                <Card
                  hoverEffect
                  borderAccent="cyan"
                  className="cursor-pointer group"
                  onClick={() => setActiveTab('tickets')}
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Clock className="w-6 h-6" />
                    </div>
                    <CardTitle>Track Status & Emails</CardTitle>
                    <CardDescription>
                      Monitor real-time progress, assigned desk agents, SLA timers, and automated email alerts sent to your inbox.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 flex items-center text-xs font-bold text-cyan-700 group-hover:translate-x-1 transition-transform">
                      <span>View My Complaints ({tickets.length})</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3 */}
                <Card
                  hoverEffect
                  borderAccent="amber"
                  className="cursor-pointer group"
                  onClick={() => setIsAiBotModalOpen(true)}
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Bot className="w-6 h-6" />
                    </div>
                    <CardTitle>AI Helpdesk & Knowledge Base</CardTitle>
                    <CardDescription>
                      Instant intelligent answers on semester schedules, hall tickets, fee structures, and scholarship criteria via Gemini 3.8.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
                      <span>Chat with Virtual Assistant</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </>
        )}

        {/* COMPLAINTS & TICKETS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {activeTab === 'tickets' ? 'My Official Complaints' : 'Registered Complaints'}
                </h2>
                <RoleBadge role={currentRole} size="sm" />
                <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  Real Student Records Only
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentRole === 'STUDENT'
                  ? `Showing grievances lodged under ${currentUser.fullName} (${currentUser.email})`
                  : 'Authorized personnel view across department triage desks'}
              </p>
            </div>

            {/* Filter, Search Bar, and Clear Action */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by ID, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-56"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open / Submitted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ESCALATED">Escalated</option>
                <option value="RESOLVED">Resolved / Closed</option>
                <option value="REOPENED">Reopened</option>
              </select>

              {tickets.length > 0 && (
                <button
                  onClick={handleClearAllTickets}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Clear My Complaints"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mini Dashboard Widget: Summary by Status with Doughnut & Progress Visualization */}
          <TicketDashboardWidget
            tickets={
              currentRole === 'STUDENT'
                ? tickets.filter((t) => t.studentId === currentUser.id)
                : tickets
            }
            activeStatusFilter={statusFilter}
            onFilterChange={(newStatus) => setStatusFilter(newStatus)}
          />

          {/* Tickets Grid / List: Displays Real Complaints Only */}
          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 border border-blue-100">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {tickets.length === 0 ? 'No Complaints Submitted Yet' : 'No Matching Complaints'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {tickets.length === 0
                    ? 'Your student grievance record is completely clean. Only real complaints submitted by students will appear here—no fake placeholder records.'
                    : 'No complaints match your active filter criteria. Clear the filter to view all submissions.'}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                <Button size="sm" variant="primary" onClick={() => setIsSubmitModalOpen(true)}>
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Submit Your Complaint
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEmailModalOpen(true)}>
                  <Inbox className="w-4 h-4 mr-1.5 text-blue-600" />
                  Simulate Student Email Alert
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTickets.map((t) => (
                <Card
                  key={t.id}
                  hoverEffect
                  className="cursor-pointer flex flex-col justify-between"
                  onClick={() => setSelectedTicket(t)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {t.ticketNumber}
                      </span>
                      <StatusBadge status={t.status} size="sm" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 py-3">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                      {t.subject}
                    </h3>

                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{t.departmentName}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100">
                      <PriorityBadge priority={t.priority} size="sm" />
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        SLA: {t.sla.targetHours}h
                      </span>
                    </div>
                  </CardContent>

                  <div className="px-5 py-2.5 bg-slate-50/80 rounded-b-2xl border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate">Student: {t.studentName.split(' ')[0]}</span>
                    <span className="text-blue-700 font-semibold hover:underline">
                      View Details →
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* DEPARTMENT DESKS DIRECTORY */}
        <section className="bg-slate-100/70 border-t border-b border-slate-200/80 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                University Helpdesk Departments
              </h2>
              <p className="text-xs text-slate-500">
                Direct specialized desks ensuring quick turnaround under University Service Level Agreements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {INITIAL_DEPARTMENTS.slice(0, 4).map((dept) => (
                <div
                  key={dept.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {dept.code}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Auto-Routing On
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{dept.name}</h3>

                  <div className="text-xs text-slate-500 space-y-1">
                    <p className="truncate">Desk Head: {dept.headName}</p>
                    <p className="truncate">Active Agents: {dept.agentCount} staff</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS PREVIEW */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Instant Knowledge Base
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">
              Verified answers to common queries regarding admissions, scholarship, exams, and hostel.
            </p>
          </div>

          <div className="space-y-3">
            {INITIAL_FAQS.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                  className="w-full p-4 text-left font-bold text-sm text-slate-800 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      expandedFaqId === faq.id ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {expandedFaqId === faq.id && (
                  <div className="p-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Was this helpful?</span>
                      <button className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Yes ({faq.helpfulCount})
                      </button>
                      <button className="text-[10px] text-slate-500 hover:text-slate-700">
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* University Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <UniversityLogo
              name={org.branding.universityName}
              subText={org.branding.city}
              motto={org.branding.tagline}
              size="sm"
              theme="dark"
            />
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              {org.branding.universityName} is committed to fostering academic excellence, transparent governance, and rapid resolution of student grievances across all colleges.
            </p>
            <div className="text-slate-400 text-xs space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> {org.branding.address}, {org.branding.city}, {org.branding.state}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> {org.branding.contactEmail}
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-blue-400" /> {org.branding.contactPhone}
              </p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Helpdesk Portals</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={() => setActiveTab('tickets')} className="hover:text-white">Track Grievance</button></li>
              <li><button onClick={() => setIsAiBotModalOpen(true)} className="hover:text-white">AI Virtual Assistant</button></li>
              <li><button onClick={() => setIsFeesModalOpen(true)} className="hover:text-white">Fee Receipts Portal</button></li>
              <li><button onClick={() => setIsDocsModalOpen(true)} className="hover:text-white">Document Verification</button></li>
              <li><button onClick={() => setIsCalendarModalOpen(true)} className="hover:text-white">Academic Calendar</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Emergency Helplines</h4>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-1 text-[11px]">
              <p className="text-rose-400 font-bold">Campus Security: 1800-180-5522</p>
              <p className="text-slate-300">Anti-Ragging Squad: 1800-180-5522</p>
              <p className="text-slate-300">Women Cell Helpline: +91 5662 250911</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 py-4 text-center text-slate-500 text-[11px]">
          {org.branding.footerText}
        </div>
      </footer>

      {/* Floating Real-time Email Notification Toast */}
      <EmailNotificationToast
        email={activeEmailToast}
        onOpenPreview={(email) => {
          setActiveEmailId(email.id);
          setIsEmailModalOpen(true);
          setActiveEmailToast(null);
        }}
        onDismiss={() => setActiveEmailToast(null)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        ticketCount={tickets.length}
        unreadEmailCount={unreadEmailCount}
        onOpenAiBot={() => setIsAiBotModalOpen(true)}
        onOpenFees={() => setIsFeesModalOpen(true)}
        onOpenDocuments={() => setIsDocsModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Ticket Details Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        currentUserRole={currentRole}
        onStatusChange={handleStatusChange}
      />

      {/* Submit Ticket Modal */}
      <SubmitTicketModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        departments={INITIAL_DEPARTMENTS}
        onSubmit={handleCreateTicket}
      />

      {/* Student Email Inbox & Notification Simulator Modal */}
      <EmailSimulatorModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emails={simulatedEmails}
        activeEmailId={activeEmailId}
        onSelectEmail={(id) => {
          setActiveEmailId(id);
          notificationService.markAsRead(id);
          setSimulatedEmails(notificationService.getSimulatedEmails());
        }}
        onSimulateAlert={handleSimulateAlert}
        onMarkAllAsRead={() => {
          notificationService.markAllAsRead();
          setSimulatedEmails(notificationService.getSimulatedEmails());
        }}
        onViewTicket={(ticketNumber) => {
          const match = tickets.find((t) => t.ticketNumber === ticketNumber);
          if (match) {
            setSelectedTicket(match);
          } else {
            setActiveTab('tickets');
          }
        }}
      />

      {/* Auth & Identity Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(profile) => {
          setUserProfile(profile);
          setCurrentRole(profile.role);
        }}
      />

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onUpdateProfile={(updated) => setUserProfile({ ...userProfile, ...updated })}
        onLogout={() => {
          setIsProfileModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* University Onboarding Wizard */}
      <OnboardingWizardModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onComplete={(data) => {
          alert(`University ${data.univName} onboarding configured successfully!`);
        }}
      />

      {/* AI Helpdesk Bot Modal */}
      <AiHelpdeskBotModal
        isOpen={isAiBotModalOpen}
        onClose={() => setIsAiBotModalOpen(false)}
        onCreateTicketClick={() => setIsSubmitModalOpen(true)}
      />

      {/* Fees & Payment Gateway Modal */}
      <FeesManagementModal
        isOpen={isFeesModalOpen}
        onClose={() => setIsFeesModalOpen(false)}
        currentUser={userProfile}
      />

      {/* Student Documents Vault Modal */}
      <DocumentsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        currentUser={userProfile}
        currentUserRole={currentRole}
      />

      {/* Academic Calendar Modal */}
      <AcademicCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />

      {/* Admin Analytics & Report Modal */}
      <AdminAnalyticsModal
        isOpen={isAdminAnalyticsModalOpen}
        onClose={() => setIsAdminAnalyticsModalOpen(false)}
        tickets={tickets}
        departments={INITIAL_DEPARTMENTS}
      />

      {/* Architecture & Roadmap Drawer */}
      <ArchitectureDrawer
        isOpen={isArchitectureDrawerOpen}
        onClose={() => setIsArchitectureDrawerOpen(false)}
      />
    </div>
  );
}
