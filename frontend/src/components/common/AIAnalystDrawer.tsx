import React, { useState, useRef, useEffect } from 'react';
import { useFilters } from '../../context/FilterContext';
import { sendChatMessage } from '../../services/api';
import { Bot, X, Send, User, RefreshCw } from 'lucide-react';

export const AIAnalystDrawer: React.FC = () => {
  const { isAIAnalystOpen, setIsAIAnalystOpen, selectedCustomerId } = useFilters();
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string; time: string }>>([
    {
      sender: "ai",
      text: "Hello! I am your **SharePulse-AI Executive Analyst**. I am grounded directly in the 444,118 transactions and 45,000 customers from the MetroMart & HSIC partnership.\n\nAsk me anything regarding Share-of-Wallet decline, payment migration destinations, Prime reward underutilization, customer risk, or budget simulations.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isAIAnalystOpen) return null;

  const quickPrompts = [
    "Why is HSIC SoW declining?",
    "Which payment method is taking the most share?",
    "Show Prime missed reward analysis",
    "What customer segments represent the largest opportunity?",
    "What happens if we allocate ₹10 Lakh to recovery?"
  ];

  const handleSend = async (msgText: string) => {
    const query = msgText.trim();
    if (!query || isLoading) return;

    const userMsg = {
      sender: "user" as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await sendChatMessage({ message: query, customer_id: selectedCustomerId ?? undefined });
      const aiMsg = {
        sender: "ai" as const,
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, {
        sender: "ai",
        text: "Error communicating with the analytics engine. Please ensure backend service is running.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-surface-card border-l border-surface-border shadow-2xl z-50 flex flex-col">
      <div className="h-16 px-5 border-b border-surface-border flex items-center justify-between bg-surface-cardMuted">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>SharePulse AI Analyst</span>
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">Grounded Analytical Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setIsAIAnalystOpen(false)}
          className="p-1.5 rounded-lg hover:bg-surface-hover text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-start space-x-2.5 ${m.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              m.sender === "user" ? "bg-slate-700 text-slate-200" : "bg-brand-600 text-white"
            }`}>
              {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
              m.sender === "user" 
                ? "bg-brand-600 text-white" 
                : "bg-surface-cardMuted text-slate-200 border border-surface-border leading-relaxed"
            }`}>
              <div className="whitespace-pre-line">{m.text}</div>
              <span className="text-[9px] text-slate-400 block mt-1 text-right font-mono">{m.time}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-400" />
            <span>Querying verified dataset & ML models...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="px-4 py-2 border-t border-surface-border bg-surface-dark overflow-x-auto whitespace-nowrap space-x-2 flex items-center">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300 transition-colors shrink-0 cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 border-t border-surface-border bg-surface-cardMuted flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder="Ask a question or simulate strategy..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-surface-dark border border-surface-border text-xs rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
