import React, { useEffect, useState } from 'react';
import {
  Camera,
  CloudSun,
  Compass,
  Droplets,
  MapPin,
  MessageSquareText,
  Plus,
  ShoppingBag,
  Sprout,
  Thermometer,
  Trash2,
  User,
  Wind,
} from 'lucide-react';
import { apiRequest, ApiError } from '../lib/api';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getDisplaySampleCrop,
  translateCropSeason,
  translateSoilLabel,
  translateStateLabel,
} from '../i18n/translations';
import {
  ActivityRecord,
  FarmerProfile,
  NavTab,
  TrackedCrop,
  WeatherPreset,
} from '../types';

interface DashboardViewProps {
  farmer: FarmerProfile;
  token: string;
  onNavigate: (tab: NavTab) => void;
}

export function DashboardView({ farmer, token, onNavigate }: DashboardViewProps) {
  const { language, t } = useLanguage();
  const [crops, setCrops] = useState<TrackedCrop[]>([]);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [weather, setWeather] = useState<WeatherPreset | null>(null);
  const [weatherPresets, setWeatherPresets] = useState<WeatherPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add crop form
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [season, setSeason] = useState<'Kharif' | 'Rabi' | 'Zaid' | 'Perennial'>('Kharif');
  const [areaAcres, setAreaAcres] = useState('1.0');
  const [sowingStage, setSowingStage] = useState(t.dashboard.defaultGrowthStage);
  const [notes, setNotes] = useState('');
  const [savingCrop, setSavingCrop] = useState(false);

  const [heroImgFailed, setHeroImgFailed] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [cropsRes, weatherRes, historyRes] = await Promise.all([
          apiRequest<{ crops: TrackedCrop[] }>('/api/farmer/crops', { token, language }),
          apiRequest<{ current: WeatherPreset; presets: WeatherPreset[] }>(
            `/api/weather?state=${encodeURIComponent(farmer.state)}&lang=${encodeURIComponent(language)}`,
            { token, language }
          ),
          apiRequest<{ activities: ActivityRecord[] }>('/api/farmer/history', { token, language }),
        ]);
        if (!active) return;
        setCrops(cropsRes.crops);
        setWeather(weatherRes.current);
        setWeatherPresets(weatherRes.presets);
        setActivities(historyRes.activities);
      } catch (err) {
        if (!active) return;
        setError(err instanceof ApiError ? err.message : t.dashboard.loadError);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDashboardData();
    return () => {
      active = false;
    };
  }, [token, farmer.state, language, t.dashboard.loadError]);

  async function handleSelectWeatherRegion(stateName: string) {
    const matched = weatherPresets.find((w) => w.state === stateName);
    if (matched) setWeather(matched);
  }

  async function handleAddCrop(e: React.FormEvent) {
    e.preventDefault();
    if (!cropName.trim()) return;
    setSavingCrop(true);
    try {
      const res = await apiRequest<{ crop: TrackedCrop }>('/api/farmer/crops', {
        method: 'POST',
        token,
        language,
        body: {
          cropName,
          variety,
          season,
          areaAcres: Number(areaAcres) || 1,
          sowingStage,
          notes,
        },
      });
      setCrops((prev) => [res.crop, ...prev]);
      setCropName('');
      setVariety('');
      setNotes('');
      setShowAddCrop(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.dashboard.saveCropError);
    } finally {
      setSavingCrop(false);
    }
  }

  async function handleDeleteCrop(id: string) {
    try {
      await apiRequest(`/api/farmer/crops/${id}`, {
        method: 'DELETE',
        token,
        language,
      });
      setCrops((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.dashboard.deleteCropError);
    }
  }

  function getCropThumbnail(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('wheat')) return '/src/assets/images/crop_wheat_field_1795245915224.jpg';
    if (lower.includes('tomato')) return '/src/assets/images/sample_tomato_blight_1795245914354.jpg';
    return '/src/assets/images/crop_paddy_rice_1795245915417.jpg';
  }

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <section className="relative overflow-hidden rounded-xl border border-[#DCE6DF] bg-[#133322] text-white">
        {!heroImgFailed ? (
          <img
            src="/src/assets/images/hero_indian_farm_1795245915928.jpg"
            alt={t.dashboard.heroAlt}
            referrerPolicy="no-referrer"
            onError={() => setHeroImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-[#102A1C]/95 via-[#133322]/85 to-[#133322]/60" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#9EE6BC] tracking-wide">
              {t.dashboard.greetingPrefix}, {farmer.name} · {farmer.village}, {farmer.district},{' '}
              {translateStateLabel(farmer.state, language)}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mt-2 text-balance">
              {t.dashboard.welcomeTitle}
            </h1>
            <p className="mt-2 text-sm text-[#D9EAE0] leading-relaxed">
              {t.dashboard.welcomeSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('disease')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D4F] hover:bg-[#256841] px-4 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap"
            >
              <Camera className="w-4 h-4" aria-hidden="true" />
              {t.dashboard.scanLeafBtn}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('assistant')}
              className="inline-flex items-center gap-2 rounded-lg bg-white/12 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap"
            >
              <MessageSquareText className="w-4 h-4" aria-hidden="true" />
              {t.dashboard.askAiBtn}
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Module Quick Launchers (4 Core Modules) */}
      <section aria-label={t.nav.dashboard}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('assistant')}
            className="text-left rounded-xl border border-[#DCE6DF] bg-white hover:border-[#2E7D4F] p-5 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EAF4EE] text-[#1B5E3A] flex items-center justify-center mb-3.5">
              <MessageSquareText className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-base font-bold text-[#0F2418] group-hover:text-[#1B5E3A]">
              {t.dashboard.cardAssistantTitle}
            </h2>
            <p className="mt-1 text-xs text-[#4A6355] leading-relaxed">
              {t.dashboard.cardAssistantDesc}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('disease')}
            className="text-left rounded-xl border border-[#DCE6DF] bg-white hover:border-[#2E7D4F] p-5 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EAF4EE] text-[#1B5E3A] flex items-center justify-center mb-3.5">
              <Camera className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-base font-bold text-[#0F2418] group-hover:text-[#1B5E3A]">
              {t.dashboard.cardDiseaseTitle}
            </h2>
            <p className="mt-1 text-xs text-[#4A6355] leading-relaxed">
              {t.dashboard.cardDiseaseDesc}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('advisor')}
            className="text-left rounded-xl border border-[#DCE6DF] bg-white hover:border-[#2E7D4F] p-5 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EAF4EE] text-[#1B5E3A] flex items-center justify-center mb-3.5">
              <Compass className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-base font-bold text-[#0F2418] group-hover:text-[#1B5E3A]">
              {t.dashboard.cardAdvisorTitle}
            </h2>
            <p className="mt-1 text-xs text-[#4A6355] leading-relaxed">
              {t.dashboard.cardAdvisorDesc}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('marketplace')}
            className="text-left rounded-xl border border-[#DCE6DF] bg-white hover:border-[#2E7D4F] p-5 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EAF4EE] text-[#1B5E3A] flex items-center justify-center mb-3.5">
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-base font-bold text-[#0F2418] group-hover:text-[#1B5E3A]">
              {t.dashboard.cardMarketplaceTitle}
            </h2>
            <p className="mt-1 text-xs text-[#4A6355] leading-relaxed">
              {t.dashboard.cardMarketplaceDesc}
            </p>
          </button>
        </div>
      </section>

      {/* Farmer Profile + Simulated Weather Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Farmer Profile Summary */}
        <section className="lg:col-span-5 rounded-xl border border-[#DCE6DF] bg-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-[#1B5E3A]" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-[#0F2418]">
                  {t.dashboard.farmerProfileTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className="text-xs font-semibold text-[#1B5E3A] hover:underline whitespace-nowrap"
              >
                {t.dashboard.editProfile}
              </button>
            </div>

            <dl className="divide-y divide-[#EEF3EF] text-sm">
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-[#5B7466]">{t.dashboard.farmerName}</dt>
                <dd className="font-semibold text-[#0F2418] text-right">{farmer.name}</dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-[#5B7466]">{t.dashboard.location}</dt>
                <dd className="font-medium text-[#0F2418] text-right">
                  {farmer.village}, {farmer.district}, {translateStateLabel(farmer.state, language)}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-[#5B7466]">{t.dashboard.farmArea}</dt>
                <dd className="font-mono tabular-nums font-medium text-[#0F2418]">
                  {farmer.farmSizeAcres} {t.dashboard.acresUnit}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-[#5B7466]">{t.dashboard.soilType}</dt>
                <dd className="font-medium text-[#0F2418] text-right">
                  {translateSoilLabel(farmer.soilType, language)}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-[#5B7466]">{t.dashboard.primaryCrops}</dt>
                <dd className="font-medium text-[#0F2418] text-right">
                  {farmer.primaryCrops.join(', ') || t.dashboard.notListed}
                </dd>
              </div>
            </dl>
          </div>

          <p className="mt-4 pt-3 border-t border-[#EEF3EF] text-xs text-[#5B7466]">
            {farmer.isDemo
              ? t.dashboard.demoFooterNote
              : `${t.dashboard.accountIdLabel}: ${farmer.identifier}`}
          </p>
        </section>

        {/* Weather Information Section (Explicitly Labeled Simulated Data) */}
        <section className="lg:col-span-7 rounded-xl border border-[#DCE6DF] bg-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-[#1B5E3A]" aria-hidden="true" />
                  <h2 className="font-display text-lg font-bold text-[#0F2418]">
                    {t.dashboard.weatherTitle}
                  </h2>
                </div>
                <p className="text-xs text-[#7A5400] mt-0.5 font-medium">
                  {t.dashboard.simulatedBadge}
                </p>
              </div>

              {weatherPresets.length > 0 && (
                <select
                  aria-label={t.dashboard.selectWeatherStateAria}
                  value={weather?.state || farmer.state}
                  onChange={(e) => handleSelectWeatherRegion(e.target.value)}
                  className="rounded-lg border border-[#CBDAD0] bg-[#F8FAF9] px-3 py-1.5 text-xs font-medium text-[#0F2418] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                >
                  {weatherPresets.map((preset) => (
                    <option key={preset.state} value={preset.state}>
                      {translateStateLabel(preset.state, language)} ({t.dashboard.sampleSuffix})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {loading || !weather ? (
              <div className="py-10 text-center text-sm text-[#5B7466]">
                {t.dashboard.loadingWeather}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs text-[#4A6355] mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#1B5E3A]" aria-hidden="true" />
                  <span>{weather.regionLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{weather.condition}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg bg-[#F7FAF8] border border-[#E5EFE9] p-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#5B7466]">
                      <Thermometer className="w-3.5 h-3.5 text-[#1B5E3A]" aria-hidden="true" />
                      <span>{t.dashboard.tempLabel}</span>
                    </div>
                    <p className="mt-1.5 font-mono tabular-nums text-xl font-bold text-[#0F2418]">
                      {weather.temperatureC}°C
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F7FAF8] border border-[#E5EFE9] p-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#5B7466]">
                      <Droplets className="w-3.5 h-3.5 text-[#1B5E3A]" aria-hidden="true" />
                      <span>{t.dashboard.humidityLabel}</span>
                    </div>
                    <p className="mt-1.5 font-mono tabular-nums text-xl font-bold text-[#0F2418]">
                      {weather.humidityPercent}%
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F7FAF8] border border-[#E5EFE9] p-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#5B7466]">
                      <CloudSun className="w-3.5 h-3.5 text-[#1B5E3A]" aria-hidden="true" />
                      <span>{t.dashboard.monthlyRainLabel}</span>
                    </div>
                    <p className="mt-1.5 font-mono tabular-nums text-xl font-bold text-[#0F2418]">
                      {weather.rainfallMmMonthly} mm
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F7FAF8] border border-[#E5EFE9] p-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#5B7466]">
                      <Wind className="w-3.5 h-3.5 text-[#1B5E3A]" aria-hidden="true" />
                      <span>{t.dashboard.windLabel}</span>
                    </div>
                    <p className="mt-1.5 font-mono tabular-nums text-xl font-bold text-[#0F2418]">
                      {weather.windKmh} km/h
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-[#1D3829] bg-[#F2F8F4] rounded-lg px-4 py-2.5">
                  <span className="font-semibold">{t.dashboard.fieldTipLabel}: </span>
                  {weather.farmingTip}
                </p>
              </>
            )}
          </div>

          {weather && (
            <p className="mt-3 text-xs text-[#5B7466]">{weather.disclaimer}</p>
          )}
        </section>
      </div>

      {/* Crop Information Section */}
      <section className="rounded-xl border border-[#DCE6DF] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#1B5E3A]" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-[#0F2418]">
                {t.dashboard.myCropsTitle}
              </h2>
            </div>
            <p className="text-xs text-[#5B7466] mt-0.5">
              {t.dashboard.myCropsSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCrop((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B5E3A] hover:bg-[#14482C] px-3.5 py-2 text-xs font-semibold text-white transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {showAddCrop ? t.dashboard.cancelBtn : t.dashboard.addCropBtn}
          </button>
        </div>

        {showAddCrop && (
          <form
            onSubmit={handleAddCrop}
            className="mb-6 rounded-lg border border-[#DCE6DF] bg-[#F7FAF8] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            <div>
              <label htmlFor="new-crop-name" className="block text-xs font-semibold text-[#1D3829] mb-1">
                {t.dashboard.cropNameLabel}
              </label>
              <input
                id="new-crop-name"
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder={t.dashboard.cropNamePlaceholder}
                className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
              />
            </div>

            <div>
              <label htmlFor="new-crop-var" className="block text-xs font-semibold text-[#1D3829] mb-1">
                {t.dashboard.varietyLabel}
              </label>
              <input
                id="new-crop-var"
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder={t.dashboard.varietyPlaceholder}
                className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
              />
            </div>

            <div>
              <label htmlFor="new-crop-season" className="block text-xs font-semibold text-[#1D3829] mb-1">
                {t.dashboard.seasonLabel}
              </label>
              <select
                id="new-crop-season"
                value={season}
                onChange={(e) => setSeason(e.target.value as TrackedCrop['season'])}
                className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
              >
                <option value="Kharif">{translateCropSeason('Kharif', language)}</option>
                <option value="Rabi">{translateCropSeason('Rabi', language)}</option>
                <option value="Zaid">{translateCropSeason('Zaid', language)}</option>
                <option value="Perennial">{translateCropSeason('Perennial', language)}</option>
              </select>
            </div>

            <div>
              <label htmlFor="new-crop-area" className="block text-xs font-semibold text-[#1D3829] mb-1">
                {t.dashboard.areaAcresLabel}
              </label>
              <input
                id="new-crop-area"
                type="number"
                step="0.1"
                min="0.1"
                value={areaAcres}
                onChange={(e) => setAreaAcres(e.target.value)}
                className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="new-crop-stage" className="block text-xs font-semibold text-[#1D3829] mb-1">
                {t.dashboard.growthStageLabel}
              </label>
              <input
                id="new-crop-stage"
                type="text"
                value={sowingStage}
                onChange={(e) => setSowingStage(e.target.value)}
                placeholder={t.dashboard.growthStagePlaceholder}
                className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
              />
            </div>

            <div>
              <label htmlFor="new-crop-notes" className="block text-xs font-semibold text-[#1D3829] mb-1">
                {t.dashboard.notesLabel}
              </label>
              <input
                id="new-crop-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.dashboard.notesPlaceholder}
                className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={savingCrop}
                className="rounded-lg bg-[#1B5E3A] hover:bg-[#14482C] px-4 py-2 text-sm font-semibold text-white transition-colors"
              >
                {savingCrop ? t.dashboard.savingCropBtn : t.dashboard.saveCropBtn}
              </button>
            </div>
          </form>
        )}

        {crops.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-[#CBDAD0] rounded-lg">
            <p className="text-sm font-medium text-[#4A6355]">{t.dashboard.noCropsYet}</p>
            <button
              type="button"
              onClick={() => setShowAddCrop(true)}
              className="mt-3 rounded-lg bg-[#1B5E3A] px-4 py-2 text-xs font-semibold text-white"
            >
              {t.dashboard.addFirstCropBtn}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {crops.map((crop) => {
              const displayCrop = getDisplaySampleCrop(crop, language);
              return (
                <article
                  key={crop.id}
                  className="rounded-xl border border-[#DCE6DF] bg-[#FCFDFC] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 bg-[#EAF4EE] overflow-hidden">
                      <img
                        src={getCropThumbnail(crop.cropName)}
                        alt={displayCrop.cropName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base font-bold text-[#0F2418]">
                          {displayCrop.cropName}
                        </h3>
                        <button
                          type="button"
                          aria-label={`${t.dashboard.removeCropAria} ${displayCrop.cropName}`}
                          onClick={() => handleDeleteCrop(crop.id)}
                          className="text-[#6E8578] hover:text-red-700 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-[#4A6355] tabular-nums">
                        {crop.variety} · {translateCropSeason(crop.season, language)} · {crop.areaAcres}{' '}
                        {t.dashboard.acresUnit}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-[#1B5E3A]">
                        {t.dashboard.stageLabel}: {displayCrop.sowingStage}
                      </p>
                      {displayCrop.notes && (
                        <p className="mt-2 text-xs text-[#4A6355] leading-relaxed">
                          {displayCrop.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  {crop.isSample && (
                    <div className="px-4 py-2 bg-[#F4F8F5] border-t border-[#E5EFE9] text-[11px] text-[#5B7466]">
                      {t.dashboard.sampleCropNote}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Activity Strip */}
      {activities.length > 0 && (
        <section className="rounded-xl border border-[#DCE6DF] bg-white p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-display text-base font-bold text-[#0F2418]">
              {t.dashboard.recentActivityTitle}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="text-xs font-semibold text-[#1B5E3A] hover:underline"
            >
              {t.dashboard.viewAllBtn}
            </button>
          </div>
          <div className="divide-y divide-[#EEF3EF]">
            {activities.slice(0, 4).map((act) => (
              <div key={act.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <p className="text-sm font-semibold text-[#0F2418]">{act.title}</p>
                  <p className="text-xs text-[#4A6355]">{act.summary}</p>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#647D6F] shrink-0">
                  {new Date(act.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
