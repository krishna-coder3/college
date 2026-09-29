import React from 'react';
import {
  Home,
  Clock,
  Bot,
  CreditCard,
  FileCheck2,
  User,
  Inbox,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  ticketCount: number;
  unreadEmailCount: number;
  onOpenAiBot: () => void;
  onOpenFees: () => void;
  onOpenDocuments: () => void;
  onOpenProfile: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  ticketCount,
  unreadEmailCount,
  onOpenAiBot,
  onOpenFees,
  onOpenDocuments,
  onOpenProfile,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around text-[10px] font-semibold text-slate-500">
      {/* Home */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
          activeTab === 'home' ? 'text-blue-700' : 'hover:text-slate-800'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      {/* Complaints */}
      <button
        onClick={() => onTabChange('tickets')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors relative ${
          activeTab === 'tickets' ? 'text-blue-700' : 'hover:text-slate-800'
        }`}
      >
        <Clock className="w-5 h-5" />
        <span>Complaints</span>
        {ticketCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
            {ticketCount}
          </span>
        )}
      </button>

      {/* AI Assistant */}
      <button
        onClick={onOpenAiBot}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-indigo-700 hover:text-indigo-900 transition-colors"
      >
        <div className="w-8 h-8 -mt-3 rounded-full bg-gradient-to-tr from-blue-900 to-indigo-600 text-white flex items-center justify-center shadow-md">
          <Bot className="w-4 h-4" />
        </div>
        <span>AI Help</span>
      </button>

      {/* Fees */}
      <button
        onClick={onOpenFees}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl hover:text-slate-800 transition-colors"
      >
        <CreditCard className="w-5 h-5" />
        <span>Fees</span>
      </button>

      {/* Docs */}
      <button
        onClick={onOpenDocuments}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl hover:text-slate-800 transition-colors"
      >
        <FileCheck2 className="w-5 h-5" />
        <span>Docs</span>
      </button>

      {/* Profile */}
      <button
        onClick={onOpenProfile}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl hover:text-slate-800 transition-colors"
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </div>
  );
};
