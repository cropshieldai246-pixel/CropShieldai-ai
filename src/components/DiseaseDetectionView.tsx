import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  FileImage,
  HelpCircle,
  Loader2,
  ShieldAlert,
  Sparkles,
  Upload,
} from 'lucide-react';
import { apiRequest, ApiError } from '../lib/api';
import { useLanguage } from '../i18n/LanguageContext';
import { translateConfidence } from '../i18n/translations';
import { LeafAnalysisResult } from '../types';

interface DiseaseDetectionViewProps {
  token: string;
}

const MAX_BYTES = 8 * 1024 * 1024;

export function DiseaseDetectionView({ token }: DiseaseDetectionViewProps) {
  const { language, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [fileName, setFileName] = useState<string>('');
  const [cropHint, setCropHint] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LeafAnalysisResult | null>(null);

  function readBlobAsBase64(blob: Blob, name: string) {
    setError(null);
    setResult(null);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(blob.type)) {
      setError(t.disease.errInvalidFileType);
      return;
    }
    if (blob.size > MAX_BYTES) {
      setError(t.disease.errMaxSize);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const commaIdx = dataUrl.indexOf(',');
      if (commaIdx === -1) {
        setError(t.disease.errReadFailed);
        return;
      }
      setPreviewUrl(dataUrl);
      setImageBase64(dataUrl.slice(commaIdx + 1));
      setMimeType(blob.type);
      setFileName(name);
    };
    reader.onerror = () => {
      setError(t.disease.errReadFailed);
    };
    reader.readAsDataURL(blob);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      readBlobAsBase64(file, file.name);
    }
  }

  async function handleLoadSampleLeaf() {
    setError(null);
    try {
      const res = await fetch('/src/assets/images/sample_tomato_blight_1795245914354.jpg');
      if (!res.ok) throw new Error('Sample image unavailable');
      const blob = await res.blob();
      setCropHint('Tomato');
      setNotes('Sample leaf photo showing brown rings and yellow leaf edges.');
      readBlobAsBase64(blob, 'sample_tomato_leaf.jpg');
    } catch {
      setError(t.disease.errLoadSample);
    }
  }

  async function handleAnalyze() {
    if (!imageBase64) {
      setError(t.disease.errNoImage);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest<{ analysis: LeafAnalysisResult }>('/api/ai/analyze-leaf', {
        method: 'POST',
        token,
        language,
        body: {
          imageBase64,
          mimeType,
          cropHint,
          notes,
          language,
        },
      });
      setResult(res.analysis);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.disease.errFallback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="rounded-xl border border-[#DCE6DF] bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#1B5E3A]" aria-hidden="true" />
              <h1 className="font-display text-xl font-bold text-[#0F2418]">
                {t.disease.title}
              </h1>
            </div>
            <p className="text-sm text-[#4A6355] mt-1">
              {t.disease.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSampleLeaf}
            className="inline-flex items-center gap-2 rounded-lg border border-[#B9D2C2] bg-[#F2F8F4] hover:bg-[#E5F1E9] px-3.5 py-2 text-xs font-semibold text-[#164A2D] transition-colors whitespace-nowrap shrink-0"
          >
            <FileImage className="w-4 h-4" aria-hidden="true" />
            {t.disease.trySampleBtn}
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upload & Input Card */}
        <section className="lg:col-span-5 rounded-xl border border-[#DCE6DF] bg-white p-6 space-y-4">
          <h2 className="font-display text-base font-bold text-[#0F2418]">
            {t.disease.step1Title}
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
            className="cursor-pointer rounded-xl border-2 border-dashed border-[#B7CEBF] hover:border-[#1B5E3A] bg-[#F7FAF8] p-5 text-center transition-colors"
          >
            {previewUrl ? (
              <div className="space-y-3">
                <img
                  src={previewUrl}
                  alt={t.disease.previewAlt}
                  className="mx-auto max-h-60 rounded-lg object-contain border border-[#DCE6DF]"
                />
                <p className="text-xs font-medium text-[#1D3829] truncate">{fileName}</p>
                <p className="text-xs text-[#1B5E3A] font-semibold">
                  {t.disease.changePhotoText}
                </p>
              </div>
            ) : (
              <div className="py-8 space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-[#E6F2EB] text-[#1B5E3A] flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-[#0F2418]">
                  {t.disease.selectPhotoTitle}
                </p>
                <p className="text-xs text-[#5B7466]">
                  {t.disease.selectPhotoHint}
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="leaf-crop-hint" className="block text-xs font-semibold text-[#1D3829] mb-1">
              {t.disease.cropHintLabel}
            </label>
            <input
              id="leaf-crop-hint"
              type="text"
              value={cropHint}
              onChange={(e) => setCropHint(e.target.value)}
              placeholder={t.disease.cropHintPlaceholder}
              className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
            />
          </div>

          <div>
            <label htmlFor="leaf-notes" className="block text-xs font-semibold text-[#1D3829] mb-1">
              {t.disease.notesLabel}
            </label>
            <textarea
              id="leaf-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.disease.notesPlaceholder}
              className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
            />
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-800">
              {error}
            </div>
          )}

          <button
            type="button"
            disabled={loading || !imageBase64}
            onClick={handleAnalyze}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B5E3A] hover:bg-[#14482C] disabled:opacity-50 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                {t.disease.analyzingBtn}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                {t.disease.analyzeBtn}
              </>
            )}
          </button>

          <p className="text-xs text-[#5B7466] leading-relaxed">
            {t.disease.disclaimer}
          </p>
        </section>

        {/* Analysis Output Card */}
        <section className="lg:col-span-7 rounded-xl border border-[#DCE6DF] bg-white p-6">
          <h2 className="font-display text-base font-bold text-[#0F2418] mb-4">
            {t.disease.step2Title}
          </h2>

          {!result && !loading && (
            <div className="py-16 text-center border border-dashed border-[#DCE6DF] rounded-lg px-6">
              <HelpCircle className="w-8 h-8 text-[#6E8578] mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm font-semibold text-[#1D3829]">
                {t.disease.emptyTitle}
              </p>
              <p className="mt-1.5 text-xs text-[#5B7466] max-w-md mx-auto leading-relaxed">
                {t.disease.emptyDesc}
              </p>
            </div>
          )}

          {loading && (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#1B5E3A] animate-spin mx-auto" aria-hidden="true" />
              <p className="text-sm font-medium text-[#1D3829]">
                {t.disease.loadingDesc}
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5">
              {/* Non-diagnosis Notice */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-950 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-bold">{t.disease.screeningBadgePrefix} </span>
                  {result.expertRecommendation}
                </div>
              </div>

              {!result.isPlantLeaf && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                  {t.disease.notLeafWarning}
                </div>
              )}

              {/* Identification & Confidence Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#E5EFE9]">
                <div>
                  <p className="text-xs font-medium text-[#5B7466]">{t.disease.possibleCropLabel}</p>
                  <p className="mt-1 font-display text-lg font-bold text-[#0F2418]">
                    {result.possibleCrop}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#5B7466]">{t.disease.confidenceUncertaintyLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-[#1B5E3A]">
                    {t.disease.confidencePrefix}: {translateConfidence(result.confidenceLevel, language)}
                  </p>
                  <p className="mt-0.5 text-xs text-[#4A6355] leading-relaxed">
                    {result.uncertaintyNotes}
                  </p>
                </div>
              </div>

              {/* Visible Symptoms */}
              <div>
                <h3 className="text-sm font-bold text-[#0F2418] mb-2">
                  {t.disease.visibleSymptomsTitle}
                </h3>
                {result.visibleSymptoms.length === 0 ? (
                  <p className="text-xs text-[#5B7466]">{t.disease.noSymptomsNote}</p>
                ) : (
                  <ul className="space-y-1.5 text-sm text-[#1D3829] list-disc pl-5">
                    {result.visibleSymptoms.map((sym, idx) => (
                      <li key={idx}>{sym}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Possible Disease Explanations */}
              <div>
                <h3 className="text-sm font-bold text-[#0F2418] mb-2.5">
                  {t.disease.possibleConditionsTitle}
                </h3>
                <div className="space-y-3">
                  {result.possibleConditions.map((cond, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-[#DCE6DF] bg-[#F8FAF9] p-4"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-semibold text-sm text-[#0F2418]">{cond.name}</h4>
                        <span className="text-xs font-medium text-[#4A6355]">
                          {cond.likelihoodNote}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-[#334D3F] leading-relaxed">
                        {cond.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preventive Practices */}
              <div>
                <h3 className="text-sm font-bold text-[#0F2418] mb-2">
                  {t.disease.preventiveTitle}
                </h3>
                <ul className="space-y-2">
                  {result.preventivePractices.map((tip, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-[#1D3829]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1B5E3A] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[#E5EFE9] flex items-center gap-2 text-xs text-[#4A6355]">
                <ShieldAlert className="w-4 h-4 text-[#1B5E3A] shrink-0" aria-hidden="true" />
                <span>{t.disease.kvkFooter}</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
