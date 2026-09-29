import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UniversityLogo } from './ui/UniversityLogo';
import { Button } from './ui/Button';
import { INITIAL_FAQS, INITIAL_DEPARTMENTS } from '../services/dataService';
import {
  Bot,
  Send,
  User,
  Sparkles,
  HelpCircle,
  PlusCircle,
  PhoneCall,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'BOT' | 'STUDENT';
  text: string;
  timestamp: string;
  suggestedAction?: 'CREATE_TICKET' | 'CONTACT_DEPT';
  deptId?: string;
}

interface AiHelpdeskBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTicketClick: () => void;
}

export const AiHelpdeskBotModal: React.FC<AiHelpdeskBotModalProps> = ({
  isOpen,
  onClose,
  onCreateTicketClick,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'BOT',
      text: 'Namaste! I am the K.M. University Virtual Support Assistant. I can assist you with officially approved guidelines for Wi-Fi access, scholarship verification, hall tickets, hostel maintenance, and academic schedules. How may I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'STUDENT',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Grounding context from approved university FAQs
      const approvedKnowledgeBase = INITIAL_FAQS.map(
        (f) => `Question: ${f.question}\nAnswer: ${f.answer}\nCategory: ${f.category}`
      ).join('\n---\n');

      const systemInstruction = `You are the official K.M. University Mathura Student Helpdesk AI Assistant.
CRITICAL UNIVERSITY POLICY RULES:
1. ONLY answer using verified facts from this university knowledge base:
${approvedKnowledgeBase}
2. The university has 7 official desks: Computer Science, Examination Cell, Accounts, Scholarship Welfare, Hostel, Campus IT, and Library.
3. You MUST NOT invent or hallucinate fee amounts, examination dates, marks, or scholarship deadlines not in the official facts.
4. If the student query is not found or is specific to an unresolved personal issue, clearly state: "I could not find this information in the university knowledge base. Please submit an official grievance ticket or contact the department desk directly."
5. Be concise, polite, professional, and helpful.`;

      let botReply = '';
      try {
        const ai = new GoogleGenAI({});
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nStudent Query: ${userText}` }],
            },
          ],
        });
        botReply = response.text || '';
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local rule-based KB match:', err);
        // Fallback to local match if offline
        const matched = INITIAL_FAQS.find((f) =>
          f.question.toLowerCase().includes(userText.toLowerCase()) ||
          userText.toLowerCase().includes(f.category.toLowerCase())
        );
        if (matched) {
          botReply = `${matched.answer} (Verified from K.M. University ${matched.category} desk)`;
        } else {
          botReply = 'I could not find this information in the university knowledge base. Please lodge an official grievance ticket so our department officers can investigate your case.';
        }
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: 'CREATE_TICKET',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'BOT',
          text: 'I could not find this information in the university knowledge base. Please submit a grievance ticket directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: 'CREATE_TICKET',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh] max-h-[750px]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">University AI Assistant</h3>
                <span className="text-[10px] font-bold bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                  Grounded • Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                Official Knowledge-Base Grounded • Anti-Hallucination Guardrails
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/70 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'STUDENT' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'STUDENT'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {m.sender === 'STUDENT' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] space-y-2`}>
                <div
                  className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    m.sender === 'STUDENT'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  {m.text}
                </div>

                <div
                  className={`flex items-center gap-2 text-[10px] text-slate-400 ${
                    m.sender === 'STUDENT' ? 'justify-end' : ''
                  }`}
                >
                  <span>{m.timestamp}</span>
                </div>

                {/* Quick Action Button for Bot responses */}
                {m.sender === 'BOT' && m.suggestedAction === 'CREATE_TICKET' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        onCreateTicketClick();
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl font-semibold transition-colors text-[11px]"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Lodge Official Complaint
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic">
              <Bot className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Consulting university knowledge base & policy archives...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-100/90 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="font-semibold text-slate-500 shrink-0">Popular queries:</span>
          <button
            onClick={() => setInputQuery('How to apply for UP State Scholarship verification?')}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 rounded-lg border border-slate-300 text-slate-700 shrink-0"
          >
            Scholarship Verification
          </button>
          <button
            onClick={() => setInputQuery('Who to contact for hostel Wi-Fi outage?')}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 rounded-lg border border-slate-300 text-slate-700 shrink-0"
          >
            Hostel Wi-Fi
          </button>
          <button
            onClick={() => setInputQuery('When is the Mid-Term Admit Card issued?')}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 rounded-lg border border-slate-300 text-slate-700 shrink-0"
          >
            Admit Cards
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about university policies, exams, hostel, fees..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" variant="primary" size="sm" disabled={!inputQuery.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
