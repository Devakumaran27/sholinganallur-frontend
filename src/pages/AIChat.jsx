import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  Info,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import ChatMessage from '../components/ui/ChatMessage';
import { askTransitAssistant } from '../services/chatService';

const SUGGESTED_QUESTIONS = [
  'Which buses serve Sholinganallur?',
  'Which direct buses go from Sholinganallur to T. Nagar?',
  'What is the next scheduled departure after 08:00?',
  'Explain the available transport information for Sholinganallur.',
];

const INITIAL_GREETING = {
  id: 'init-greeting',
  role: 'assistant',
  content:
    'Vanakkam! I am your RouteWise AI Transit Assistant for Chennai and the Sholinganallur corridor.\n\nI answer transport queries strictly based on verified MTC GTFS timetable records and 145 grounded semantic RAG chunks powered by Google Gemini. How can I assist your transit journey today?',
  timestamp: 'Ready',
  groundingSources: [
    {
      title: 'Corridor Guide: Sholinganallur to T. Nagar Transit System',
      chunk_id: 'doc_corridor_sholinganallur_t_nagar_c000',
    },
    {
      title: 'System Governance & Limitations',
      chunk_id: 'doc_system_governance_limitations_c000',
    },
  ],
  limitations: [
    'Static GTFS schedule feed only; does not provide real-time GPS vehicle tracking.',
  ],
};

export default function AIChat() {
  const [messages, setMessages] = useState([INITIAL_GREETING]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = useCallback(
    async (textToSend) => {
      const query = (textToSend || inputValue).trim();
      if (!query || query.length < 2 || isTyping) return;

      const userMessageId = `user-${Date.now()}`;
      const userMessage = {
        id: userMessageId,
        role: 'user',
        content: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);
      setLastFailedQuery(null);

      try {
        const response = await askTransitAssistant({
          question: query,
          top_k: 4,
        });

        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          groundingSources: response.grounding_sources || [],
          limitations: response.limitations || [],
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        console.error('Failed to get answer from chat service:', err);
        const detail =
          err?.response?.data?.detail ||
          err?.message ||
          'Failed to reach the RouteWise AI backend service at http://127.0.0.1:8000. Please ensure the server is running.';

        setLastFailedQuery(query);

        const errorMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Unable to complete request: ${detail}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
          onRetry: () => handleRetry(query),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, isTyping]
  );

  const handleRetry = (queryToRetry) => {
    // Remove the error message from the list before retrying
    setMessages((prev) => prev.filter((m) => !m.isError));
    handleSendMessage(queryToRetry);
  };

  const handleReset = () => {
    setMessages([INITIAL_GREETING]);
    setInputValue('');
    setLastFailedQuery(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Page Header */}
      <PageHeader
        title="RouteWise AI Assistant"
        description="Ask complex natural language questions grounded in official Chennai MTC timetable data via Google Gemini."
        badge={
          <StatusBadge variant="success">FastAPI RAG Live</StatusBadge>
        }
        actions={
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        }
        className="mb-2 pb-4"
      />

      {/* Suggested Questions Carousel */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-500">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>Authoritative Questions (Click to query live AI):</span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            FastAPI POST /api/v1/chat/ask
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((question, i) => (
            <button
              key={i}
              type="button"
              disabled={isTyping}
              onClick={() => handleSendMessage(question)}
              className="text-xs bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition font-medium text-left"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-sm overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}

        {isTyping && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span>Retrieving corridor vectors & synthesizing with Gemini</span>
              <span className="flex gap-1 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce delay-200" />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-sm flex items-center gap-2 sm:gap-3"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          placeholder="Ask about MTC routes, Sholinganallur stops, or departure times (Enter to send)..."
          className="flex-1 px-3 sm:px-4 py-2 text-sm bg-transparent border-0 focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || inputValue.trim().length < 2 || isTyping}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs transition shadow-sm flex items-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isTyping ? 'Sending...' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
}
