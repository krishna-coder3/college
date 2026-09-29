import React from 'react';
import { SimulatedEmail } from '../types';
import { Mail, CheckCircle2, Clock, X, ExternalLink } from 'lucide-react';

interface EmailNotificationToastProps {
  email: SimulatedEmail | null;
  onOpenPreview: (email: SimulatedEmail) => void;
  onDismiss: () => void;
}

export const EmailNotificationToast: React.FC<EmailNotificationToastProps> = ({
  email,
  onOpenPreview,
  onDismiss,
}) => {
  if (!email) return null;

  const isResolved = email.status === 'RESOLVED';
  const isInProgress = email.status === 'IN_PROGRESS';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 overflow-hidden relative group">
        {/* Top accent line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            isResolved
              ? 'bg-emerald-500'
              : isInProgress
              ? 'bg-blue-500'
              : 'bg-amber-500'
          }`}
        />

        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isResolved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}
          >
            {isResolved ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isInProgress ? (
              <Clock className="w-5 h-5" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                Email Alert Dispatched
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isResolved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                {isResolved ? 'Status: RESOLVED' : 'Status: IN PROGRESS'}
              </span>
            </div>

            <p className="text-sm font-semibold text-white truncate">
              {email.subject}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              Sent to: <span className="text-slate-200 underline font-mono">{email.studentEmail}</span>
            </p>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => onOpenPreview(email)}
                className="text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                View Student Email
              </button>
              <button
                onClick={onDismiss}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
