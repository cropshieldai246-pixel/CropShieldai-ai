import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  MessageSquareText,
  RotateCcw,
  Send,
  ShieldAlert,
  Sprout,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { translateStateLabel } from '../i18n/translations';
import { apiRequest, ApiError } from '../lib/api';
import { ChatMessage, FarmerProfile } from '../types';

interface AssistantViewProps {
  farmer: FarmerProfile;
  token: string;
}

export function AssistantView({ farmer, token }: AssistantViewProps) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      role: 'model',
      text: t.assistant.welcomeMessage(farmer.name),
    },
  ]);
  const [input, setInput] = useState('');
  const [includeFarmContext, setIncludeFarmContext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Keep the static welcome message in the currently selected language
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === 'welcome_msg'
          ? { ...m, text: t.assistant.welcomeMessage(farmer.name) }
          : m
      )
    );
  }, [language, farmer.name, t]);

  async function sendQuestion(textToSend: string) {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    try {
      // Exclude the initial static greeting from Gemini multi-turn history if it was never sent
      const apiMessages = nextHistory
        .filter((m) => m.id !== 'welcome_msg')
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await apiRequest<{ reply: string }>('/api/ai/chat', {
        method: 'POST',
        token,
        language,
        timeoutMs: 45000,
        body: {
          messages: apiMessages,
          includeFarmContext,
          language,
        },
      });

      if (!res || typeof res.reply !== 'string' || !res.reply.trim()) {
        throw new ApiError(
          t.assistant.emptyResponseError,
          502,
          'EMPTY_RESPONSE'
        );
      }

      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'model',
        text: res.reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err) {
      // Remove the failed turn so conversation history stays valid, and restore input for easy retry
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setInput((current) => (current.trim() ? current : trimmed));

      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError(`${err.message} ${t.assistant.signOutHint}`);
        } else {
          setError(err.message);
        }
      } else if (err instanceof Error && err.message) {
        setError(`${t.assistant.unexpectedErrorPrefix}: ${err.message}`);
      } else {
        setError(t.assistant.genericFallbackError);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setError(null);
    setMessages([
      {
        id: 'welcome_msg',
        role: 'model',
        text: t.assistant.welcomeMessage(farmer.name),
      },
    ]);
  }

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-[#1B5E3A]" aria-hidden="true" />
            <h1 className="font-display text-xl font-bold text-[#0F2418]">
              {t.assistant.title}
            </h1>
          </div>
          <p className="text-sm text-[#4A6355] mt-1">
            {t.assistant.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1D3829] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeFarmContext}
              onChange={(e) => setIncludeFarmContext(e.target.checked)}
              className="rounded border-[#9BBAA7] text-[#1B5E3A] focus:ring-[#1B5E3A]"
            />
            {t.assistant.shareContextLabel} ({translateStateLabel(farmer.state, language)})
          </label>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBDAD0] bg-white hover:bg-[#F2F8F4] px-3 py-1.5 text-xs font-semibold text-[#1D3829] transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            {t.assistant.newChatBtn}
          </button>
        </div>
      </div>

      {/* Starter Prompt Buttons */}
      <div className="flex flex-wrap gap-2">
        {t.assistant.starterQuestions.map((q) => (
          <button
            key={q}
            type="button"
            disabled={loading}
            onClick={() => sendQuestion(q)}
            className="text-left rounded-lg border border-[#D4E2D8] bg-white hover:bg-[#EFF7F1] hover:border-[#2E7D4F] px-3 py-2 text-xs font-medium text-[#1D3829] transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Conversation Area */}
      <div className="rounded-xl border border-[#DCE6DF] bg-white flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#1B5E3A] text-white'
                      : 'bg-[#F3F8F5] text-[#0F2418] border border-[#DCE6DF]'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1B5E3A] mb-1.5">
                      <Sprout className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t.assistant.assistantBrand}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl px-4 py-3 text-sm bg-[#F3F8F5] text-[#4A6355] border border-[#DCE6DF]">
                {t.assistant.thinkingText}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div
            role="alert"
            className="mx-5 mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-800 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuestion(input);
          }}
          className="border-t border-[#E5EFE9] p-4 flex items-center gap-3 bg-[#FAFCFB] rounded-b-xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={t.assistant.inputPlaceholder}
            aria-label={t.assistant.inputAria}
            className="flex-1 rounded-lg border border-[#CBDAD0] bg-white px-4 py-2.5 text-sm text-[#0F2418] placeholder:text-[#7E9688] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1B5E3A] hover:bg-[#14482C] disabled:opacity-50 px-4 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {t.assistant.sendBtn}
          </button>
        </form>
      </div>

      {/* Honest Advisory Footer */}
      <div className="rounded-lg border border-[#DCE6DF] bg-[#F4F8F5] px-4 py-3 text-xs text-[#3C5647] flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-[#1B5E3A] shrink-0 mt-0.5" aria-hidden="true" />
        <p>{t.assistant.advisoryFooter}</p>
      </div>
    </div>
  );
}
