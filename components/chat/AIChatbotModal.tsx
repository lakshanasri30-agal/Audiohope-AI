'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { sendChatMessage } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  ChevronDown,
  Volume2,
  ShieldAlert,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'What is tinnitus?',
  'What causes tinnitus?',
  'How does AudioHope AI work?',
  'Explain my AI assessment.',
  'What is THI?',
  'What is VAS?',
  'What does Moderate Severity mean?',
  'How does sound therapy help?',
  'What are rehabilitation games?',
  'How can I improve my sleep?',
  'How can I reduce stress?',
  'What foods may support hearing health?',
  'When should I consult an ENT specialist?',
];

export const AIChatbotModal: React.FC = () => {
  const { user } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'bot',
      text: `Hello! 👋\n\nI'm AudioHope AI Assistant.\n\nI can help you understand tinnitus, explain your assessment results, guide your rehabilitation journey, and answer general hearing-health questions.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgObj: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Send user context & message to backend API endpoint POST /api/v1/chat
      const response = await sendChatMessage({
        message: text,
        patient_id: user.id,
        user_context: {
          name: user.name,
          tinnitusSeverity: user.tinnitusSeverity || 'Moderate',
          recoveryScore: user.recoveryScore || 85,
          healthScore: user.healthScore || 82,
          hearingScore: user.hearingScore || 78,
          tinnitusPitchHz: user.tinnitusPitchHz || 4200,
        },
      });

      const botMsgObj: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: response.response,
        timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsgObj]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'bot',
          text: 'I encountered an unexpected network response. Please try asking your question again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'bot',
        text: `Hello! 👋\n\nI'm AudioHope AI Assistant.\n\nI can help you understand tinnitus, explain your assessment results, guide your rehabilitation journey, and answer general hearing-health questions.\n\nHow can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/95 border border-cyan-500/40 px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md text-[11px] font-semibold text-cyan-300 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ask AudioHope AI</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isOpen
              ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              : 'bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 shadow-cyan-500/40 hover:scale-110'
          }`}
          title={isOpen ? 'Close Chatbot' : 'Open AudioHope AI Health Assistant'}
          aria-label={isOpen ? 'Close Chatbot' : 'Open AudioHope AI Health Assistant'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        </button>
      </div>

      {/* Modern Glassmorphism Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[80vh] z-50 flex flex-col bg-slate-950/95 border border-cyan-500/40 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  AudioHope AI <Badge variant="cyan">Assistant</Badge>
                </h3>
                <p className="text-[10px] text-slate-400">Hearing Health & Tinnitus Guidance</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
                title="Clear Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-medium rounded-tr-none shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div className="flex items-center gap-2 px-1 text-[10px] text-slate-500">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                        title="Copy message text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-teal-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator Animation */}
            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse delay-300" />
                  <span className="text-[10px] text-slate-400 ml-1 font-mono">Formulating response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Clickable Suggested Question Chips */}
          <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/80">
            <p className="text-[10px] font-semibold text-slate-400 mb-1.5 px-1 uppercase tracking-wider">Suggested Questions</p>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-medium text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question about your tinnitus or therapy..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold hover:opacity-95 transition-all disabled:opacity-40"
              title="Send Message"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
