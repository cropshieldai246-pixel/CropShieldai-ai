import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGE_OPTIONS } from '../i18n/translations';

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBDAD0] bg-[#F7FAF8] p-1"
      role="group"
      aria-label={t.languageLabel}
    >
      {!compact && (
        <span className="hidden md:inline-flex items-center gap-1 pl-2 pr-1 text-xs font-medium text-[#4A6355]">
          <Languages className="w-3.5 h-3.5 text-[#1B5E3A]" aria-hidden="true" />
          <span>{t.languageLabel}</span>
        </span>
      )}
      {LANGUAGE_OPTIONS.map((opt) => {
        const active = language === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            aria-pressed={active}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
              active
                ? 'bg-[#1B5E3A] text-white shadow-xs'
                : 'text-[#1D3829] hover:bg-[#E7F1EB]'
            }`}
          >
            {opt.nativeLabel}
          </button>
        );
      })}
    </div>
  );
}
