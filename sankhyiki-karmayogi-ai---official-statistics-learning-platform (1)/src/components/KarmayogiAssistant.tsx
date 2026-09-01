import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UserProfile, ChatMessage } from '../types';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  User, 
  Copy, 
  Check, 
  BookOpen, 
  BrainCircuit, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface KarmayogiAssistantProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const KarmayogiAssistant: React.FC<KarmayogiAssistantProps> = ({
  currentUser,
  isOpen,
  onClose,
}) => {
  const { language, isHindi, isPunjabi } = useLanguage();

  const getInitialWelcome = () => {
    if (isHindi) {
      return `नमस्ते **${currentUser.name}**! मैं **कर्मयोगी सहायक** हूँ — भारत की आधिकारिक सांख्यिकी प्रणाली (MoSPI/NSSTA) के लिए आपका एआई सांख्यिकीय पद्धति एवं क्षमता-निर्माण संरक्षक।\n\nमैं आपकी सहायता कर सकता हूँ:\n• **आधिकारिक सर्वेक्षण पद्धतियां** (NSSO, PLFS, ASHE, कोचरन नमूनाकरण एवं CAPI)\n• **राष्ट्रीय लेखा एवं व्यापक सूचकांक** (SNA 2008, SUT, CPI/IIP आधार संशोधन)\n• **पायथन / आर कोड** (सर्वेक्षण माइक्रोडाटा विश्लेषण एवं NQAF गुणवत्ता ऑडिट)\n• **iGOT कर्मयोगी एवं NSSTA पाठ्यक्रम** (${currentUser.cadre} • ${currentUser.department})\n\nआज मैं आपके सीखने के सफर में कैसे मदद कर सकता हूँ?`;
    }
    if (isPunjabi) {
      return `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ **${currentUser.name}**! ਮੈਂ **ਕਰਮਯੋਗੀ ਸਹਾਇਕ** ਹਾਂ — ਭਾਰਤ ਦੀ ਸਰਕਾਰੀ ਅੰਕੜਾ ਪ੍ਰਣਾਲੀ ਲਈ ਤੁਹਾਡਾ AI ਸਲਾਹਕਾਰ।\n\nਮੈਂ ਹੇਠ ਲਿਖੇ ਵਿਸ਼ਿਆਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ:\n• **ਸਰਕਾਰੀ ਸਰਵੇਖਣ ਵਿਧੀਆਂ** (NSSO, PLFS, CAPI)\n• **ਰਾਸ਼ਟਰੀ ਖਾਤੇ ਅਤੇ ਸੂਚਕਾਂਕ** (SNA 2008, CPI/IIP)\n• **ਪਾਈਥਨ ਅਤੇ R ਕੋਡ**\n• **iGOT ਕਰਮਯੋਗੀ ਕੋਰਸ**\n\nਅੱਜ ਤੁਸੀਂ ਕੀ ਸਿੱਖਣਾ ਚਾਹੁੰਦੇ ਹੋ?`;
    }
    return `Namaste **${currentUser.name}**! I am **Karmayogi Sahayak**, your AI Statistical Methodology & Capacity-Building Mentor for India's Official Statistical System.\n\nI can assist you with:\n• **Official Survey Methodologies** (NSSO, PLFS, ASHE, Cochran sampling & CAPI)\n• **National Accounts & Macro Indices** (SNA 2008, SUT, CPI/IIP base revision)\n• **Python / R Code** for survey microdata processing & NQAF quality audits\n• **iGOT Karmayogi & NSSTA Pathways** aligned with your role (${currentUser.cadre} • ${currentUser.department})\n\nHow may I support your learning journey today?`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_initial',
      role: 'assistant',
      content: getInitialWelcome(),
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = isHindi ? [
    "पायथन में NSSO सैंपलिंग वेट्स और मल्टीप्लायर की गणना कैसे करें?",
    "SNA 2008 में उत्पादन और व्यय दृष्टिकोण के बीच GDP अंतर समझाएं।",
    "जनगणना माइक्रोडाटा जारी करने के लिए धारा 17 DPDPA सुरक्षा उपाय क्या हैं?",
    "पायथन माइक्रोडाटा प्रोसेसिंग के लिए कौन सा iGOT कर्मयोगी कोर्स उपयुक्त है?",
  ] : [
    "How do I estimate NSSO sampling weights with multiplier in Python?",
    "Explain the GDP estimation difference between Output and Expenditure approaches in SNA 2008.",
    "What are the mandatory Section 17 DPDPA safeguards for releasing census microdata?",
    "Which iGOT Karmayogi course will help me close my Python Microdata processing gap?",
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            officerName: currentUser.name,
            cadre: currentUser.cadre,
            department: currentUser.department,
            designation: currentUser.designation,
            experienceYears: currentUser.experienceYears,
            language: language,
            history: messages.slice(-4).map(m => ({ role: m.role, content: m.content })),
          },
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        const assistantMsg: ChatMessage = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: json.data.reply,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: isHindi ? `प्रणाली से संपर्क में समस्या आई। कृपया पुनः प्रयास करें।` : `I encountered a transient issue processing your query. Please try again.`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: isHindi ? `एआई सेवा से संपर्क करने में त्रुटि।` : `Error connecting to AI service. Please check connection.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white border-l border-slate-200 w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Topbar */}
        <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="icon-badge-blue">
              <Bot className="w-5 h-5 text-[#1E3ABA]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 leading-tight font-heading">
                  Karmayogi Sahayak
                </h3>
                <span className="text-[10px] bg-blue-50 text-[#1E3ABA] font-semibold px-2 py-0.5 rounded border border-blue-100">
                  AI Statistical Mentor
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                MoSPI Domain-Trained AI Copilot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMessages(messages.slice(0, 1))}
              title="Clear Conversation"
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 text-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 text-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isAsst = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAsst ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                  isAsst
                    ? 'icon-badge-blue'
                    : 'bg-[#1E3ABA] text-white'
                }`}>
                  {isAsst ? <Bot className="w-4 h-4 text-[#1E3ABA]" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed space-y-2 relative group shadow-xs ${
                  isAsst
                    ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                    : 'bg-[#1E3ABA] text-white font-medium rounded-tr-xs'
                }`}>
                  <div className="whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {isAsst && (
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Accredited MoSPI Guidance</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-slate-800 inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-[#1E3ABA] bg-blue-50 p-3 rounded-lg border border-blue-100 w-fit">
              <span className="w-3.5 h-3.5 border-2 border-[#1E3ABA] border-t-transparent rounded-full animate-spin"></span>
              <span>Karmayogi Sahayak is formulating official statistical guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Prompts */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2">
          <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F4B400]" />
            Recommended Prompts:
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-[#1E3ABA] px-2.5 py-1 rounded-lg whitespace-nowrap transition text-left cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input Box */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask about official statistical methods, SNA 2008, Python code..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3ABA]"
          />
          <button
            type="button"
            disabled={!inputQuery.trim() || isLoading}
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-lg bg-[#1E3ABA] hover:bg-[#152E99] text-white font-semibold transition disabled:opacity-40 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
