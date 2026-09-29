import React, { useState } from 'react';
import { StudentDocument, UserProfile, UserRole } from '../types';
import { Button } from './ui/Button';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck2,
  ShieldCheck,
  AlertCircle,
  X,
  Eye,
} from 'lucide-react';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  currentUserRole: UserRole;
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentUserRole,
}) => {
  const [documents, setDocuments] = useState<StudentDocument[]>([
    {
      id: 'doc-001',
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      docType: 'ID_CARD',
      fileName: 'university_student_id_krishna.pdf',
      fileUrl: '#',
      fileSize: 1240000,
      status: 'APPROVED',
      reviewerName: 'Prof. S. K. Gupta (Dean Office)',
      reviewComment: 'Verified with physical enrollment ledger.',
      uploadedAt: '2026-08-01T10:00:00Z',
      reviewedAt: '2026-08-02T14:30:00Z',
    },
    {
      id: 'doc-002',
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      docType: 'SCHOLARSHIP',
      fileName: 'up_post_matric_income_certificate.pdf',
      fileUrl: '#',
      fileSize: 3400000,
      status: 'UNDER_REVIEW',
      reviewerName: 'Dr. Sunita Rajput (Scholarship Nodal)',
      reviewComment: 'Tehsildar stamp verified. Pending institute quota sign-off.',
      uploadedAt: '2026-09-12T09:15:00Z',
    },
    {
      id: 'doc-003',
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      docType: 'MARKSHEET',
      fileName: 'semester_5_gradecard_provisional.pdf',
      fileUrl: '#',
      fileSize: 850000,
      status: 'APPROVED',
      reviewerName: 'Controller of Exams Desk',
      reviewComment: 'Verified SGPA 8.74 and zero backlogs.',
      uploadedAt: '2026-07-20T11:00:00Z',
      reviewedAt: '2026-07-21T09:00:00Z',
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [newDocType, setNewDocType] = useState<StudentDocument['docType']>('BONAFIDE');
  const [newFileName, setNewFileName] = useState('');

  if (!isOpen) return null;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newDoc: StudentDocument = {
      id: `doc-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      docType: newDocType,
      fileName: `${newFileName.replace(/\s+/g, '_').toLowerCase()}.pdf`,
      fileUrl: '#',
      fileSize: Math.floor(Math.random() * 2000000 + 500000),
      status: 'SUBMITTED',
      uploadedAt: new Date().toISOString(),
    };

    setDocuments([newDoc, ...documents]);
    setIsUploading(false);
    setNewFileName('');
  };

  const handleStatusUpdate = (docId: string, newStatus: StudentDocument['status']) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status: newStatus,
              reviewerName: currentUser.fullName,
              reviewedAt: new Date().toISOString(),
            }
          : d
      )
    );
  };

  const isStaff = currentUserRole !== 'STUDENT' && currentUserRole !== 'FACULTY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Student Documents & Verification Vault</h3>
              <p className="text-xs text-blue-200">
                Encrypted repository for marksheets, ID cards, bonafide & scholarships
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="gold"
              onClick={() => setIsUploading(!isUploading)}
              leftIcon={<Upload className="w-4 h-4 text-blue-950" />}
            >
              Upload Document
            </Button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload Form Drawer */}
        {isUploading && (
          <form onSubmit={handleUploadSubmit} className="bg-blue-50/70 p-5 border-b border-blue-200 text-xs space-y-3">
            <h4 className="font-bold text-blue-950 text-sm">Upload Student Document for Official Verification</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Category</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as StudentDocument['docType'])}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ID_CARD">University Student ID Card</option>
                  <option value="ADMISSION_LETTER">Admission Allotment Letter</option>
                  <option value="FEE_RECEIPT">Paid Fee Challan / E-Receipt</option>
                  <option value="SCHOLARSHIP">State / Central Scholarship Form</option>
                  <option value="MARKSHEET">Semester Grade Card / Marksheet</option>
                  <option value="BONAFIDE">Bonafide Student Certificate</option>
                  <option value="OTHER">Other Academic Clearance</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title / File Name</label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. Hosteler_Bonafide_Certificate"
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setIsUploading(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="primary">
                Confirm & Submit Document
              </Button>
            </div>
          </form>
        )}

        {/* Documents Grid / Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 text-xs">
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {doc.docType}
                      </span>
                      {doc.status === 'APPROVED' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Approved by Registrar
                        </span>
                      ) : doc.status === 'UNDER_REVIEW' ? (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Under Review
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Submitted
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm font-mono">{doc.fileName}</h4>
                    <p className="text-[11px] text-slate-500">
                      Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {doc.reviewComment && (
                      <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                        Officer remarks: &ldquo;{doc.reviewComment}&rdquo; ({doc.reviewerName})
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Staff verification actions */}
                  {isStaff && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStatusUpdate(doc.id, 'APPROVED')}
                        className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-bold transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(doc.id, 'REJECTED')}
                        className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg font-bold transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => alert(`Opening secure signed URL for ${doc.fileName}...`)}
                    className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-xl transition-colors"
                    title="View Document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Supabase Storage Signed URL Architecture • Zero Public Exposure
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
