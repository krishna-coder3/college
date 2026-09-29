import React, { useState } from 'react';
import { UniversityLogo } from './ui/UniversityLogo';
import { Button } from './ui/Button';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Building,
  Palette,
  Layers,
  GraduationCap,
  Calendar,
  LifeBuoy,
  Clock,
  UserCheck,
  Bell,
  Sparkles,
  X,
} from 'lucide-react';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form states across the 10 steps
  const [univName, setUnivName] = useState('K.M. University');
  const [univCode, setUnivCode] = useState('KMU-UP');
  const [city, setCity] = useState('Mathura');
  const [primaryColor, setPrimaryColor] = useState('#1E3A8A');
  const [secondaryColor, setSecondaryColor] = useState('#0284C7');
  const [selectedDepts, setSelectedDepts] = useState([
    'Computer Science & Engineering',
    'Examination & Degree Cell',
    'Accounts & Student Finance',
    'Hostel & Residential Life',
    'Campus IT & Wi-Fi Network',
  ]);
  const [courses, setCourses] = useState(['B.Tech CSE', 'B.Pharm', 'MBA', 'BCA', 'MCA']);
  const [urgentSlaHours, setUrgentSlaHours] = useState(4);
  const [highSlaHours, setHighSlaHours] = useState(24);
  const [normalSlaHours, setNormalSlaHours] = useState(48);
  const [adminEmail, setAdminEmail] = useState('superadmin@kmuniversity.edu.in');
  const [notificationsConfig, setNotificationsConfig] = useState({
    email: true,
    fcmPush: true,
    sms: false,
    whatsApp: true,
  });

  if (!isOpen) return null;

  const totalSteps = 10;

  const stepTitles = [
    'University Information',
    'Institutional Branding',
    'Departments Setup',
    'Courses & Programs',
    'Semesters Structure',
    'Support Categories',
    'SLA Rules Configuration',
    'Super Admin Account',
    'Notification Channels',
    'Launch & Ready',
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({
        univName,
        univCode,
        city,
        primaryColor,
        selectedDepts,
        courses,
        urgentSlaHours,
        adminEmail,
      });
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/15 rounded-xl border border-white/20">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-white">University Onboarding Wizard</h3>
              <p className="text-xs text-blue-200">Multi-tenant provisioning & academic setup</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-blue-200">
              <span>Step {currentStep} of {totalSteps}: <strong>{stepTitles[currentStep - 1]}</strong></span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-xs space-y-4">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Step 1: University Legal & Operational Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">University Name</label>
                  <input
                    type="text"
                    value={univName}
                    onChange={(e) => setUnivName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">University Short Code</label>
                  <input
                    type="text"
                    value={univCode}
                    onChange={(e) => setUnivCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campus City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Portal Domain</label>
                  <input
                    type="text"
                    disabled
                    value="helpdesk.kmuniversity.edu.in"
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-600" />
                Step 2: Theme & Institutional Brand Identity
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Color (Royal Navy)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Secondary Accent (Sky Azure)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Step 3: University Helpdesk Departments
              </h4>
              <div className="space-y-2">
                {[
                  'Computer Science & Engineering',
                  'Examination & Degree Cell',
                  'Accounts & Student Finance',
                  'Scholarship & Social Welfare',
                  'Hostel & Residential Life',
                  'Campus IT & Wi-Fi Network',
                  'Central Knowledge Library',
                  'Transport & Bus Logistics',
                ].map((dept) => (
                  <label key={dept} className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDepts.includes(dept)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDepts([...selectedDepts, dept]);
                        } else {
                          setSelectedDepts(selectedDepts.filter((d) => d !== dept));
                        }
                      }}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="font-medium text-slate-800">{dept}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Step 4: Academic Courses & Degrees
              </h4>
              <p className="text-slate-500">Configured university degree curricula:</p>
              <div className="flex flex-wrap gap-2">
                {courses.map((c) => (
                  <span key={c} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-xl font-bold border border-blue-200">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Step 5: Semesters & Academic Calendars
              </h4>
              <p className="text-slate-500">Standard 8-semester undergraduate and 4-semester postgraduate cycle configured.</p>
              <div className="grid grid-cols-4 gap-2">
                {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map((s) => (
                  <div key={s} className="p-2 bg-slate-50 border border-slate-200 text-center font-bold text-slate-700 rounded-lg">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-blue-600" />
                Step 6: Support Categories & Auto-Routing
              </h4>
              <div className="space-y-1.5 text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Admissions:</strong> Verification, Merit lists, Quota forms
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Examinations:</strong> Hall ticket correction, Re-evaluation, Backlogs
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Hostel & Mess:</strong> Wi-Fi outage, Room maintenance, Hygiene
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Scholarships:</strong> State post-matric, Central NSP, Fee waivers
                </div>
              </div>
            </div>
          )}

          {/* STEP 7 */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Step 7: Service Level Agreements (SLA)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="font-bold text-rose-900 block">Urgent SLA</span>
                  <div className="mt-1 flex items-center gap-1 font-mono text-base font-bold text-rose-700">
                    <input
                      type="number"
                      value={urgentSlaHours}
                      onChange={(e) => setUrgentSlaHours(Number(e.target.value))}
                      className="w-14 p-1 bg-white border border-rose-300 rounded"
                    />
                    <span>Hours</span>
                  </div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-900 block">High Priority</span>
                  <div className="mt-1 flex items-center gap-1 font-mono text-base font-bold text-amber-700">
                    <input
                      type="number"
                      value={highSlaHours}
                      onChange={(e) => setHighSlaHours(Number(e.target.value))}
                      className="w-14 p-1 bg-white border border-amber-300 rounded"
                    />
                    <span>Hours</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="font-bold text-blue-900 block">Standard SLA</span>
                  <div className="mt-1 flex items-center gap-1 font-mono text-base font-bold text-blue-700">
                    <input
                      type="number"
                      value={normalSlaHours}
                      onChange={(e) => setNormalSlaHours(Number(e.target.value))}
                      className="w-14 p-1 bg-white border border-blue-300 rounded"
                    />
                    <span>Hours</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8 */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Step 8: Master University Administrator
              </h4>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dean / Super Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <p className="text-slate-400">
                A root administrative credential will be generated and dispatched with hardware 2FA protection.
              </p>
            </div>
          )}

          {/* STEP 9 */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                Step 9: Notification Gateways
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={notificationsConfig.email}
                    onChange={(e) => setNotificationsConfig({ ...notificationsConfig, email: e.target.checked })}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span>Transactional SMTP Emails (Status changes & alerts)</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={notificationsConfig.fcmPush}
                    onChange={(e) => setNotificationsConfig({ ...notificationsConfig, fcmPush: e.target.checked })}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span>Firebase Cloud Messaging (FCM Mobile Push)</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={notificationsConfig.whatsApp}
                    onChange={(e) => setNotificationsConfig({ ...notificationsConfig, whatsApp: e.target.checked })}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span>WhatsApp Business API (Critical Alerts)</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 10 */}
          {currentStep === 10 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Your University Helpdesk Is Ready!
              </h3>
              <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                Organization <strong>{univName}</strong> ({univCode}) has been provisioned with PostgreSQL RLS isolation, {selectedDepts.length} department desks, and automated SLA timers.
              </p>
              <div className="pt-2">
                <span className="inline-block bg-blue-50 text-blue-800 font-bold px-4 py-2 rounded-xl border border-blue-200 font-mono text-xs">
                  System Status: 100% OPERATIONAL
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={currentStep === 1}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <Button
            variant={currentStep === totalSteps ? 'gold' : 'primary'}
            size="sm"
            onClick={handleNext}
            rightIcon={currentStep === totalSteps ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          >
            {currentStep === totalSteps ? 'Launch Helpdesk Portal' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};
