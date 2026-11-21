import React, { useEffect, useState } from 'react';
import { CheckCircle2, History, Save, User } from 'lucide-react';
import { apiRequest, ApiError } from '../lib/api';
import { useLanguage } from '../i18n/LanguageContext';
import { translateSoilLabel, translateStateLabel } from '../i18n/translations';
import { LanguageSelector } from './LanguageSelector';
import { ActivityRecord, FarmerProfile } from '../types';

interface ProfileViewProps {
  farmer: FarmerProfile;
  token: string;
  onFarmerUpdated: (updated: FarmerProfile) => void;
}

const INDIAN_STATES = [
  'Maharashtra',
  'Punjab',
  'Uttar Pradesh',
  'Karnataka',
  'Tamil Nadu',
  'Madhya Pradesh',
  'Gujarat',
  'Andhra Pradesh',
  'Telangana',
  'West Bengal',
  'Rajasthan',
  'Bihar',
  'Haryana',
];

const SOIL_TYPES = [
  'Loamy',
  'Black Cotton (Vertisol)',
  'Alluvial',
  'Red & Yellow',
  'Clay',
  'Sandy Loam',
];

export function ProfileView({ farmer, token, onFarmerUpdated }: ProfileViewProps) {
  const { language, t } = useLanguage();
  const [name, setName] = useState(farmer.name);
  const [village, setVillage] = useState(farmer.village);
  const [district, setDistrict] = useState(farmer.district);
  const [state, setState] = useState(farmer.state);
  const [farmSizeAcres, setFarmSizeAcres] = useState(String(farmer.farmSizeAcres));
  const [soilType, setSoilType] = useState(farmer.soilType);
  const [primaryCropsText, setPrimaryCropsText] = useState(farmer.primaryCrops.join(', '));

  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    let active = true;
    apiRequest<{ activities: ActivityRecord[] }>('/api/farmer/history', { token, language })
      .then((res) => {
        if (active) setActivities(res.activities);
      })
      .catch(() => {
        // Non-blocking history read
      });
    return () => {
      active = false;
    };
  }, [token, language]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedNotice(false);
    setError(null);
    try {
      const primaryCrops = primaryCropsText
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const res = await apiRequest<{ farmer: FarmerProfile }>('/api/farmer/profile', {
        method: 'PUT',
        token,
        language,
        body: {
          name,
          village,
          district,
          state,
          farmSizeAcres: Number(farmSizeAcres) || 1,
          soilType,
          primaryCrops,
        },
      });
      onFarmerUpdated(res.farmer);
      setSavedNotice(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.profile.errUpdate);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Edit Profile Form */}
      <form
        onSubmit={handleSave}
        className="lg:col-span-6 rounded-xl border border-[#DCE6DF] bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-[#EEF3EF] pb-3">
          <User className="w-5 h-5 text-[#1B5E3A]" aria-hidden="true" />
          <h1 className="font-display text-lg font-bold text-[#0F2418]">
            {t.profile.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#F7FAF8] border border-[#E5EFE9] px-3.5 py-2.5">
          <span className="text-xs font-semibold text-[#1D3829]">
            {t.profile.languagePreferenceLabel}
          </span>
          <LanguageSelector />
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-800">
            {error}
          </div>
        )}

        {savedNotice && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
            <span>{t.profile.savedNotice}</span>
          </div>
        )}

        <div>
          <label htmlFor="prof-name" className="block text-xs font-semibold text-[#1D3829] mb-1">
            {t.profile.farmerNameLabel}
          </label>
          <input
            id="prof-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="prof-village" className="block text-xs font-semibold text-[#1D3829] mb-1">
              {t.profile.villageLabel}
            </label>
            <input
              id="prof-village"
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
            />
          </div>
          <div>
            <label htmlFor="prof-district" className="block text-xs font-semibold text-[#1D3829] mb-1">
              {t.profile.districtLabel}
            </label>
            <input
              id="prof-district"
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="prof-state" className="block text-xs font-semibold text-[#1D3829] mb-1">
              {t.profile.stateLabel}
            </label>
            <select
              id="prof-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {translateStateLabel(st, language)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="prof-size" className="block text-xs font-semibold text-[#1D3829] mb-1">
              {t.profile.farmSizeLabel}
            </label>
            <input
              id="prof-size"
              type="number"
              step="0.1"
              min="0.1"
              value={farmSizeAcres}
              onChange={(e) => setFarmSizeAcres(e.target.value)}
              className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] tabular-nums"
            />
          </div>
        </div>

        <div>
          <label htmlFor="prof-soil" className="block text-xs font-semibold text-[#1D3829] mb-1">
            {t.profile.soilTypeLabel}
          </label>
          <select
            id="prof-soil"
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
          >
            {SOIL_TYPES.map((s) => (
              <option key={s} value={s}>
                {translateSoilLabel(s, language)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="prof-crops" className="block text-xs font-semibold text-[#1D3829] mb-1">
            {t.profile.primaryCropsLabel}
          </label>
          <input
            id="prof-crops"
            type="text"
            value={primaryCropsText}
            onChange={(e) => setPrimaryCropsText(e.target.value)}
            className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1B5E3A] hover:bg-[#14482C] px-4 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          {saving ? t.profile.savingBtn : t.profile.saveBtn}
        </button>
      </form>

      {/* Activity History */}
      <section className="lg:col-span-6 rounded-xl border border-[#DCE6DF] bg-white p-6">
        <div className="flex items-center gap-2 border-b border-[#EEF3EF] pb-3 mb-4">
          <History className="w-5 h-5 text-[#1B5E3A]" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-[#0F2418]">
            {t.profile.historyTitle}
          </h2>
        </div>

        {activities.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#5B7466]">
            {t.profile.historyEmpty}
          </p>
        ) : (
          <div className="divide-y divide-[#EEF3EF]">
            {activities.map((act) => (
              <div key={act.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[#EAF4EE] px-2 py-0.5 text-[11px] font-semibold text-[#1B5E3A]">
                      {t.profile.activityTypeLabel[act.type]}
                    </span>
                    <p className="text-sm font-semibold text-[#0F2418]">{act.title}</p>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-[#647D6F] shrink-0">
                    {new Date(act.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-[#4A6355] leading-relaxed">{act.summary}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
