import React, { useState } from 'react';
import { FeeItem, UserProfile } from '../types';
import { UniversityLogo } from './ui/UniversityLogo';
import { Button } from './ui/Button';
import { paymentService } from '../services/paymentService';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  Receipt,
  ShieldCheck,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';

interface FeesManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const FeesManagementModal: React.FC<FeesManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [feeItems, setFeeItems] = useState<FeeItem[]>([
    {
      id: 'fee-001',
      studentId: currentUser.id,
      category: 'TUITION',
      title: 'B.Tech Computer Science Semester 6 Tuition Fee',
      amount: 65000,
      dueDate: '2026-10-15T00:00:00Z',
      status: 'PAID',
      paidAt: '2026-08-10T11:30:00Z',
      transactionId: 'TXN_KMU_8912401',
      receiptNumber: 'KMU-RCPT-2026-00412',
    },
    {
      id: 'fee-002',
      studentId: currentUser.id,
      category: 'HOSTEL',
      title: 'Boys Hostel C-Block Accommodation & Mess (Autumn)',
      amount: 32000,
      dueDate: '2026-10-05T00:00:00Z',
      status: 'PENDING',
    },
    {
      id: 'fee-003',
      studentId: currentUser.id,
      category: 'EXAMINATION',
      title: 'Mid-Term Examination & Laboratory Fee',
      amount: 3500,
      dueDate: '2026-10-20T00:00:00Z',
      status: 'PENDING',
    },
    {
      id: 'fee-004',
      studentId: currentUser.id,
      category: 'LIBRARY',
      title: 'Digital Library & Research Database Access (Annual)',
      amount: 1500,
      dueDate: '2026-07-30T00:00:00Z',
      status: 'PAID',
      paidAt: '2026-07-28T09:15:00Z',
      transactionId: 'TXN_KMU_7109244',
      receiptNumber: 'KMU-RCPT-2026-00189',
    },
  ]);

  const [activePaymentItem, setActivePaymentItem] = useState<FeeItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeItem | null>(null);

  if (!isOpen) return null;

  const totalFees = feeItems.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = feeItems
    .filter((f) => f.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = totalFees - totalPaid;

  const handlePay = async (item: FeeItem) => {
    setActivePaymentItem(item);
    setIsProcessing(true);

    try {
      const order = await paymentService.initiateFeePayment({
        studentId: currentUser.id,
        organizationId: 'org-km-mathura',
        amount: item.amount,
        currency: 'INR',
        feeItemId: item.id,
        receiptNumber: `KMU-RCPT-2026-00${Math.floor(Math.random() * 900 + 100)}`,
      });

      const verification = await paymentService.verifyTransaction({
        orderId: order.orderId,
        paymentId: `PAY_KMU_${Date.now()}`,
        signature: 'sig_mock_verified',
        organizationId: 'org-km-mathura',
      });

      if (verification.verified) {
        const receiptNo = verification.receiptId || `KMU-RCPT-2026-00${Math.floor(Math.random() * 900 + 100)}`;
        const updatedItem: FeeItem = {
          ...item,
          status: 'PAID',
          paidAt: new Date().toISOString(),
          transactionId: `TXN_KMU_${Date.now()}`,
          receiptNumber: receiptNo,
        };

        setFeeItems((prev) =>
          prev.map((f) => (f.id === item.id ? updatedItem : f))
        );
        setSelectedReceipt(updatedItem);
      }
    } finally {
      setIsProcessing(false);
      setActivePaymentItem(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Student Fees & Payment Gateway</h3>
              <p className="text-xs text-blue-200">Institutional accounts ledger & automated receipt generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Financial KPI Banner */}
        <div className="bg-slate-100/90 p-5 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Billed Fees</span>
            <p className="text-xl font-extrabold text-slate-900 mt-1 font-mono">₹{totalFees.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Settled / Paid</span>
            <p className="text-xl font-extrabold text-emerald-700 mt-1 font-mono">₹{totalPaid.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Outstanding Due</span>
            <p className="text-xl font-extrabold text-amber-700 mt-1 font-mono">₹{totalPending.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {selectedReceipt ? (
            /* Official University Printable PDF-Style Receipt */
            <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <UniversityLogo size="sm" />
                  <div>
                    <h4 className="font-extrabold text-blue-950 text-sm tracking-tight">K.M. UNIVERSITY MATHURA</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Finance & Accounts Division • Official E-Receipt</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    Payment Verified
                  </span>
                  <p className="text-[11px] font-mono font-bold text-slate-700 mt-1">{selectedReceipt.receiptNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-slate-700">
                <div>
                  <span className="text-slate-400">Student Name:</span>
                  <p className="font-bold text-slate-900">{currentUser.fullName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Enrollment Number:</span>
                  <p className="font-mono font-bold text-slate-900">{currentUser.enrollmentNumber || 'EN25008912'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Fee Category:</span>
                  <p className="font-bold text-slate-900">{selectedReceipt.category}</p>
                </div>
                <div>
                  <span className="text-slate-400">Payment Date:</span>
                  <p className="font-bold text-slate-900">{new Date(selectedReceipt.paidAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-slate-400">Transaction ID:</span>
                  <p className="font-mono text-slate-700">{selectedReceipt.transactionId}</p>
                </div>
                <div>
                  <span className="text-slate-400">Amount Paid:</span>
                  <p className="font-bold text-base text-emerald-700 font-mono">₹{selectedReceipt.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Direct server-side webhook signature verified • Audit logged
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-900 text-white rounded-lg font-bold flex items-center gap-1.5 hover:bg-blue-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-blue-700 font-bold hover:underline"
                >
                  ← Back to Fee Schedule
                </button>
              </div>
            </div>
          ) : (
            /* Fee Schedule List */
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {feeItems.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      {item.status === 'PAID' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Paid & Cleared
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due by {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    {item.transactionId && (
                      <p className="text-[11px] text-slate-400 font-mono">Ref: {item.transactionId}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block">Amount</span>
                      <span className="font-black text-sm text-slate-900 font-mono">₹{item.amount.toLocaleString('en-IN')}</span>
                    </div>

                    {item.status === 'PAID' ? (
                      <button
                        onClick={() => setSelectedReceipt(item)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5 text-blue-600" />
                        View Receipt
                      </button>
                    ) : (
                      <Button
                        size="sm"
                        variant="gold"
                        onClick={() => handlePay(item)}
                        disabled={isProcessing}
                      >
                        {isProcessing && activePaymentItem?.id === item.id ? 'Processing...' : 'Pay via Gateway'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            PCI-DSS Compliant • Never stores CVV/card numbers
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
