"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { 
  Bot, 
  Send, 
  Sparkles, 
  ExternalLink, 
  AlertCircle, 
  Building2, 
  Info,
  RefreshCw,
  User,
  ShieldCheck
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; url: string; issuingAuthority: string }[];
  uncertaintyFlag?: boolean;
  fallbackTriggered?: boolean;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your **BenefitBridge AI Welfare Guide**. I can explain scheme eligibility rules in simple language, tell you which documents you need, and guide you to official application portals.\n\n*How can I help you today?*",
      sources: [
        { title: "National Portal of India", url: "https://www.india.gov.in", issuingAuthority: "Government of India" },
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "Who is eligible for PM-KISAN income support?",
    "What documents are needed for Ayushman Bharat (PM-JAY)?",
    "Can I apply for Post-Matric Scholarship if my family income is ₹1.5 Lakh?",
    "What is the age requirement for Indira Gandhi Old Age Pension?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) {
        throw new Error("AI service error");
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.reply,
        sources: data.sources,
        uncertaintyFlag: data.uncertaintyFlag,
        fallbackTriggered: data.fallbackTriggered,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I am currently operating in deterministic offline mode. Please review verified schemes in the directory for official guidelines.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="CITIZEN" />

        <main className="flex-1 p-4 sm:p-8 flex flex-col h-[calc(100vh-4rem)]">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                <span>Grounded AI Welfare Guide</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              BenefitBridge AI Assistant
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Source-grounded assistance tethered strictly to verified government departmental guidelines.
            </p>
          </div>

          {/* Chat Container */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 sm:gap-4 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-slate-900 text-white rounded-br-xs"
                        : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-xs"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {/* Source Citations */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs">
                        <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1 mb-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                          <span>Verified Source Links:</span>
                        </p>
                        <div className="space-y-1">
                          {m.sources.map((s, sIdx) => (
                            <a
                              key={sIdx}
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-teal-700 hover:underline text-[11px] font-medium"
                            >
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                              <span>{s.title} ({s.issuingAuthority})</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {m.uncertaintyFlag && (
                      <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          Notice: Detailed assessment may require in-person caseworker review.
                        </span>
                      </div>
                    )}
                  </div>

                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 items-center text-xs text-slate-500 animate-pulse">
                  <div className="w-8 h-8 rounded-xl bg-teal-600/20 text-teal-700 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span>Consulting verified guidelines and eligibility rules...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Sample Inquiries:</span>
              {sampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 hover:border-teal-400 hover:text-teal-700 text-slate-600 whitespace-nowrap transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask any question about schemes, rules, income limits, or required certificates..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <p className="mt-2 text-[10px] text-slate-400 text-center">
                BenefitBridge AI is an informational guide. Answers are grounded in published guidelines and do not constitute government approval.
              </p>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
