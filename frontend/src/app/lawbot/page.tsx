'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Scale,
  ShieldCheck,
  Home,
  Users,
  AlertCircle,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getLegalAdvice } from '@/lib/lawKnowledge';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const DEFAULT_PROMPTS = [
  {
    text: 'How to get an immediate Protection Order?',
    icon: ShieldCheck,
  },
  {
    text: 'Can I be evicted from my shared household?',
    icon: Home,
  },
  {
    text: 'How do I get free legal aid from DLSA?',
    icon: Scale,
  },
  {
    text: 'Filing a Zero FIR safely at police station',
    icon: AlertCircle,
  },
  {
    text: 'Child custody rights during domestic abuse',
    icon: Users,
  },
];

export default function LawBotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `### Welcome to Sakhi Legal Rights Advisor

I am your confidential legal assistant trained on the **Protection of Women from Domestic Violence Act (PWDVA 2005)**, **Bharatiya Nyaya Sanhita (BNS)**, and **National Legal Services Authority (NALSA)** statutory rights.

All queries are confidential and processed with strict discretion. Click any suggested topic below or ask your specific legal concern.`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // First attempt to query backend if available, fallback instantly to legal knowledge base
      let replyText = '';
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userInput: textToSend }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            replyText = data.reply;
          }
        }
      } catch {
        // Fallback silently to built-in knowledge base
      }

      if (!replyText) {
        // Use verified statutory advice
        replyText = getLegalAdvice(textToSend);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: getLegalAdvice(textToSend),
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs">
            §
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
            Confidential Legal Guidance
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Sakhi Legal Rights Advisor
        </h1>
        <p className="text-xs text-slate-500">
          Statutory knowledge on PWDVA 2005, Anti-Eviction protections, Zero FIRs, and NALSA free representation.
        </p>
      </div>

      {/* Suggested Chips Bar */}
      <div className="py-3 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">
          Suggested:
        </span>
        {DEFAULT_PROMPTS.map((prompt, i) => {
          const Icon = prompt.icon;
          return (
            <button
              key={i}
              onClick={() => handleSend(prompt.text)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 transition-colors"
            >
              <Icon size={12} className="text-slate-500" />
              {prompt.text}
            </button>
          );
        })}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 py-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                §
              </div>
            )}

            <div
              className={`p-4 rounded-md text-xs leading-relaxed max-w-[85%] sm:max-w-[75%] ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
              }`}
            >
              {msg.sender === 'user' ? (
                <p>{msg.text}</p>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-2 text-xs">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                U
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              §
            </div>
            <div className="p-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.4s]" />
              Consulting statutory references...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-3 pb-2 flex items-center gap-2 border-t border-slate-200 dark:border-slate-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a legal question (e.g. Can my husband take away my children?, How to file a DIR?)"
          className="flex-1 text-xs px-3.5 py-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-40 inline-flex items-center gap-1.5 shadow-sm"
        >
          <Send size={13} />
          Send
        </button>
      </form>
    </div>
  );
}
