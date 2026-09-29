import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import {
  Layers,
  Database,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  Code2,
} from 'lucide-react';

interface ArchitectureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDrawer: React.FC<ArchitectureDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'security' | 'flutter' | 'design'>('roadmap');

  if (!isOpen) return null;

  const PHASES = [
    { num: 1, title: 'Architecture + Folder Structure + Design System', status: 'COMPLETED' },
    { num: 2, title: 'Supabase PostgreSQL Schema + Migrations + RLS', status: 'READY' },
    { num: 3, title: 'Authentication + Roles + Multi-Tenant Profiles', status: 'PLANNED' },
    { num: 4, title: 'University Onboarding Wizard + Academic Hierarchy', status: 'PLANNED' },
    { num: 5, title: 'Student Dashboard + Mobile Bottom Navigation', status: 'PLANNED' },
    { num: 6, title: 'Ticketing Core Engine + SLA Timers', status: 'PLANNED' },
    { num: 7, title: 'Ticket Chat + Realtime + Attachments', status: 'PLANNED' },
    { num: 8, title: 'SLA Automation + Agent Assignment + Escalation Engine', status: 'PLANNED' },
    { num: 9, title: 'Duplicate Detection + Incident Management', status: 'PLANNED' },
    { num: 10, title: 'FAQ + Knowledge Base Categorization', status: 'PLANNED' },
    { num: 11, title: 'Announcements + Emergency Broadcasts', status: 'PLANNED' },
    { num: 12, title: 'Gemini AI Helpdesk Bot + Live Support', status: 'PLANNED' },
    { num: 13, title: 'Fees Ledger + Payment Gateway + PDF Receipts', status: 'PLANNED' },
    { num: 14, title: 'Document Verification + Review Workflow', status: 'PLANNED' },
    { num: 15, title: 'Academic Calendar & University Events', status: 'PLANNED' },
    { num: 16, title: 'Resolution Feedback + CSAT Rating Matrix', status: 'PLANNED' },
    { num: 17, title: 'Admin & Department Analytics Dashboard', status: 'PLANNED' },
    { num: 18, title: 'Reports + CSV/Excel/PDF Scheduled Exports', status: 'PLANNED' },
    { num: 19, title: 'Append-Only Audit Logs + Impersonation Guard', status: 'PLANNED' },
    { num: 20, title: 'App Version Force-Update + Maintenance Mode', status: 'PLANNED' },
    { num: 21, title: 'Automated Test Suites (Unit, Widget, Integration)', status: 'PLANNED' },
    { num: 22, title: 'Android AAB & macOS Native Release Package', status: 'PLANNED' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl border-l border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30">
              <Layers className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">System Architecture & Roadmap</h2>
              <p className="text-xs text-blue-200">Phase 1: Architecture & Design System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-semibold">
          {[
            { id: 'roadmap', label: '22 Phases', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'security', label: 'RLS & Multi-Tenant', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            { id: 'flutter', label: 'Flutter Structure', icon: <Smartphone className="w-3.5 h-3.5" /> },
            { id: 'design', label: 'Color Tokens', icon: <Code2 className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 bg-white font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 text-sm space-y-4">
          {activeTab === 'roadmap' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-3">
                Complete phase breakdown adhering to controlled software engineering delivery:
              </p>
              {PHASES.map((p) => (
                <div
                  key={p.num}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    p.status === 'COMPLETED'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-semibold'
                      : p.status === 'READY'
                      ? 'bg-blue-50/70 border-blue-200 text-blue-950 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-200/80 flex items-center justify-center font-mono font-bold text-[11px]">
                      {p.num}
                    </span>
                    <span>{p.title}</span>
                  </div>
                  {p.status === 'COMPLETED' ? (
                    <Badge variant="success" size="sm" dot>Phase 1 Done</Badge>
                  ) : p.status === 'READY' ? (
                    <Badge variant="primary" size="sm">Up Next</Badge>
                  ) : (
                    <span className="text-[11px] text-slate-400">Scheduled</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <h4 className="font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" /> PostgreSQL Multi-Tenant Isolation
                </h4>
                <p>
                  Every tenant record contains an <code>organization_id</code>. PostgreSQL Row Level Security (RLS) guarantees that Organization A can never query or manipulate records from Organization B.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-[11px] space-y-1.5 overflow-x-auto">
                <div className="text-slate-400 font-sans font-bold uppercase text-[10px]">Sample Student RLS Policy</div>
                <div className="text-blue-700">CREATE POLICY &ldquo;student_own_tickets_only&rdquo;</div>
                <div>ON tickets FOR SELECT</div>
                <div>USING (</div>
                <div className="pl-4 text-slate-600">auth.uid() = student_id AND</div>
                <div className="pl-4 text-slate-600">organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())</div>
                <div>);</div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-amber-950 mb-1">Zero-Trust Staff Notes</h4>
                <p>
                  <code>ticket_internal_notes</code> has a strict RLS filter: Only users with roles <code>HELPDESK_AGENT</code>, <code>DEPARTMENT_ADMIN</code>, <code>ADMIN</code>, and <code>UNIVERSITY_OWNER</code> can read or write internal triage notes. Students never see internal notes.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'flutter' && (
            <div className="font-mono text-xs text-slate-700 space-y-2 bg-slate-900 text-slate-200 p-4 rounded-2xl overflow-x-auto">
              <div className="text-amber-400 font-bold font-sans">lib/ (Production Flutter Architecture)</div>
              <div>├── core/</div>
              <div>│   ├── config/ (app_config.dart)</div>
              <div>│   ├── constants/ (app_constants.dart)</div>
              <div>│   ├── network/ (supabase_client.dart)</div>
              <div>│   ├── security/ (security_guard.dart)</div>
              <div>│   ├── theme/ (app_theme.dart - Royal Navy & Cyan)</div>
              <div>│   └── widgets/ (heraldic_crest.dart, status_chip.dart)</div>
              <div>├── features/</div>
              <div>│   ├── auth/ (login, registration, password reset)</div>
              <div>│   ├── tickets/ (create, details, realtime chat)</div>
              <div>│   ├── departments/ (routing & auto-assignment)</div>
              <div>│   ├── fees/ (payments & receipt generation)</div>
              <div>│   └── announcements/ (emergency push notifications)</div>
              <div>├── models/ (ticket_model.dart, user_role.dart)</div>
              <div>├── services/ (notification_service.dart, payment_service.dart)</div>
              <div>└── main.dart (App entry point)</div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-900 text-white rounded-xl">
                  <div className="text-xs font-bold">Royal Navy Blue</div>
                  <div className="text-[11px] opacity-80">#1E3A8A (Primary)</div>
                </div>
                <div className="p-3 bg-sky-600 text-white rounded-xl">
                  <div className="text-xs font-bold">Sky Azure</div>
                  <div className="text-[11px] opacity-80">#0284C7 (Secondary)</div>
                </div>
                <div className="p-3 bg-amber-500 text-white rounded-xl">
                  <div className="text-xs font-bold">Laurel Gold</div>
                  <div className="text-[11px] opacity-80">#D97706 (Accent)</div>
                </div>
                <div className="p-3 bg-slate-900 text-white rounded-xl">
                  <div className="text-xs font-bold">Dark Slate</div>
                  <div className="text-[11px] opacity-80">#0F172A (Surfaces)</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs mb-1">Visual Inspiration Reference</h4>
                <p className="text-xs text-slate-600">
                  Directly adopted from the uploaded K.M. University Mathura heraldic crest:
                  Mortarboard cap, peacock plume jewel, dual rising aspirant figures, golden laurel wreath, and banner typography.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
};
