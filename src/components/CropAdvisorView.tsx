import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Compass,
  Info,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { apiRequest, ApiError } from '../lib/api';
import { useLanguage } from '../i18n/LanguageContext';
import {
  translateAdvisorSeason,
  translateSoilLabel,
  translateWaterOption,
} from '../i18n/translations';
import { CropRecommendationResult, FarmerProfile } from '../types';

interface CropAdvisorViewProps {
  farmer: FarmerProfile;
  token: string;
}

const SOIL_OPTIONS = [
  'Loamy',
  'Black Cotton (Vertisol)',
  'Alluvial',
  'Red & Yellow',
  'Clay',
  'Sandy Loam',
  'Laterite',
];

const WATER_OPTIONS = [
  'Rainfed Only (Monsoon dependent)',
  'Seasonal Borewell / Well Irrigation',
  'Canal + Supplemental Irrigation',
  'Drip / Assured Year-Round Irrigation',
];

const SEASON_OPTIONS = [
  'Kharif (June – October)',
  'Rabi (November – March)',
  'Zaid (March – June)',
];

export function CropAdvisorView({ farmer, token }: CropAdvisorViewProps) {
  const { language, t } = useLanguage();
  const [location, setLocation] = useState(`${farmer.district}, ${farmer.state}`);
  const [soilType, setSoilType] = useState(farmer.soilType || 'Loamy');
  const [soilPh, setSoilPh] = useState('');
  const [temperatureC, setTemperatureC] = useState('28');
  const [rainfallMm, setRainfallMm] = useState('140');
  const [waterAvailability, setWaterAvailability] = useState(WATER_OPTIONS[1]);
  const [season, setSeason] = useState(SEASON_OPTIONS[0]);
  const [isSimulatedData, setIsSimulatedData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CropRecommendationResult | null>(null);

  function handleFillSampleClimate() {
    setLocation(t.advisor.sampleLocationValue);
    setSoilType('Black Cotton (Vertisol)');
    setSoilPh('6.8');
    setTemperatureC('29');
    setRainfallMm('180');
    setWaterAvailability(WATER_OPTIONS[1]);
    setSeason(SEASON_OPTIONS[0]);
    setIsSimulatedData(true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest<{ result: CropRecommendationResult }>(
        '/api/ai/recommend-crops',
        {
          method: 'POST',
          token,
          language,
          body: {
            location,
            soilType,
            soilPh,
            temperatureC,
            rainfallMm,
            waterAvailability,
            season,
            isSimulatedData,
            language,
          },
        }
      );
      setResult(res.result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.advisor.errFallback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#DCE6DF] bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#1B5E3A]" aria-hidden="true" />
            <h1 className="font-display text-xl font-bold text-[#0F2418]">
              {t.advisor.title}
            </h1>
          </div>
          <p className="text-sm text-[#4A6355] mt-1">
            {t.advisor.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillSampleClimate}
          className="rounded-lg border border-[#B9D2C2] bg-[#F2F8F4] hover:bg-[#E5F1E9] px-3.5 py-2 text-xs font-semibold text-[#164A2D] transition-colors whitespace-nowrap shrink-0"
        >
          {t.advisor.fillSampleBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 rounded-xl border border-[#DCE6DF] bg-white p-6 space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold text-[#0F2418]">
              {t.advisor.formTitle}
            </h2>
          </div>

          {isSimulatedData && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-950">
              {t.advisor.simulatedBanner}
            </div>
          )}

          <div>
            <label htmlFor="adv-location" className="block text-xs font-semibold text-[#1D3829] mb-1">
              {t.advisor.locationLabel}
            </label>
            <input
              id="adv-location"
              type="text"
              required
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setIsSimulatedData(false);
              }}
              placeholder={t.advisor.locationPlaceholder}
              className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="adv-soil" className="block text-xs font-semibold text-[#1D3829] mb-1">
                {t.advisor.soilTypeLabel}
              </label>
              <select
                id="adv-soil"
                value={soilType}
                onChange={(e) => {
                  setSoilType(e.target.value);
                  setIsSimulatedData(false);
                }}
                className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
              >
                {SOIL_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {translateSoilLabel(s, language)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="adv-ph" className="block text-xs font-semibold text-[#1D3829] mb-1">
                {t.advisor.soilPhLabel}
              </label>
              <input
                id="adv-ph"
                type="text"
                value={soilPh}
                onChange={(e) => {
                  setSoilPh(e.target.value);
                  setIsSimulatedData(false);
                }}
                placeholder={t.advisor.soilPhPlaceholder}
                className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="adv-temp" className="block text-xs font-semibold text-[#1D3829] mb-1">
                {t.advisor.temperatureLabel}
              </label>
              <input
                id="adv-temp"
                type="number"
                required
                value={temperatureC}
                onChange={(e) => {
                  setTemperatureC(e.target.value);
                  setIsSimulatedData(false);
                }}
                className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="adv-rain" className="block text-xs font-semibold text-[#1D3829] mb-1">
                {t.advisor.rainfallLabel}
              </label>
              <input
                id="adv-rain"
                type="number"
                required
                value={rainfallMm}
                onChange={(e) => {
                  setRainfallMm(e.target.value);
                  setIsSimulatedData(false);
                }}
                className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] tabular-nums"
              />
            </div>
          </div>

          <div>
            <label htmlFor="adv-water" className="block text-xs font-semibold text-[#1D3829] mb-1">
              {t.advisor.waterLabel}
            </label>
            <select
              id="adv-water"
              value={waterAvailability}
              onChange={(e) => {
                setWaterAvailability(e.target.value);
                setIsSimulatedData(false);
              }}
              className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
            >
              {WATER_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {translateWaterOption(w, language)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="adv-season" className="block text-xs font-semibold text-[#1D3829] mb-1">
              {t.advisor.seasonLabel}
            </label>
            <select
              id="adv-season"
              value={season}
              onChange={(e) => {
                setSeason(e.target.value);
                setIsSimulatedData(false);
              }}
              className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
            >
              {SEASON_OPTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  {translateAdvisorSeason(sec, language)}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B5E3A] hover:bg-[#14482C] disabled:opacity-50 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                {t.advisor.generatingBtn}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                {t.advisor.submitBtn}
              </>
            )}
          </button>

          <p className="text-xs text-[#5B7466] leading-relaxed">
            {t.advisor.honestyNote}
          </p>
        </form>

        {/* Results Column */}
        <section className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <div className="rounded-xl border border-dashed border-[#CBDAD0] bg-white p-12 text-center">
              <Compass className="w-8 h-8 text-[#6E8578] mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm font-semibold text-[#1D3829]">
                {t.advisor.emptyTitle}
              </p>
              <p className="mt-1.5 text-xs text-[#5B7466] max-w-md mx-auto leading-relaxed">
                {t.advisor.emptyDesc}
              </p>
            </div>
          )}

          {loading && (
            <div className="rounded-xl border border-[#DCE6DF] bg-white p-14 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#1B5E3A] animate-spin mx-auto" aria-hidden="true" />
              <p className="text-sm font-medium text-[#1D3829]">
                {t.advisor.loadingDesc}
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {isSimulatedData && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-950">
                  {t.advisor.resultsSimulatedNote}
                </div>
              )}

              {result.recommendations.map((rec, idx) => (
                <article
                  key={idx}
                  className="rounded-xl border border-[#DCE6DF] bg-white p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#EEF3EF] pb-3">
                    <h3 className="font-display text-lg font-bold text-[#0F2418]">
                      {idx + 1}. {rec.cropName}
                    </h3>
                    <span className="text-xs font-semibold text-[#1B5E3A]">
                      {rec.seasonFit}
                    </span>
                  </div>

                  <p className="text-sm text-[#1D3829] leading-relaxed">
                    {rec.suitabilitySummary}
                  </p>

                  <div>
                    <p className="text-xs font-bold text-[#0F2418] mb-1.5">
                      {t.advisor.whySuitableTitle}
                    </p>
                    <ul className="space-y-1.5">
                      {rec.whySuitable.map((reason, rIdx) => (
                        <li
                          key={rIdx}
                          className="flex items-start gap-2 text-xs text-[#334D3F]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1B5E3A] shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="rounded-lg bg-[#F4F8F5] p-3">
                      <p className="font-semibold text-[#0F2418]">{t.advisor.soilWaterNotesTitle}</p>
                      <p className="mt-1 text-[#3C5647] leading-relaxed">{rec.waterAndSoilNotes}</p>
                    </div>
                    <div className="rounded-lg bg-[#FBF8F1] p-3">
                      <p className="font-semibold text-[#664400]">{t.advisor.cautionTitle}</p>
                      <p className="mt-1 text-[#5A451C] leading-relaxed">{rec.cautionNote}</p>
                    </div>
                  </div>
                </article>
              ))}

              <div className="rounded-xl border border-[#DCE6DF] bg-[#F4F8F5] p-5 space-y-2 text-xs text-[#1D3829]">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#1B5E3A] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1.5">
                    <p>
                      <span className="font-bold">{t.advisor.generalAdvisoryLabel} </span>
                      {result.generalAdvisory}
                    </p>
                    <p>
                      <span className="font-bold">{t.advisor.missingContextLabel} </span>
                      {result.missingContextNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
