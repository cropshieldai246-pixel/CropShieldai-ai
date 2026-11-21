import React, { useState } from 'react';
import { ArrowRight, Leaf, ShieldCheck, Sprout } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { translateSoilLabel, translateStateLabel } from '../i18n/translations';
import { apiRequest, ApiError } from '../lib/api';
import { FarmerProfile } from '../types';
import { LanguageSelector } from './LanguageSelector';

interface AuthScreenProps {
  onAuthenticated: (farmer: FarmerProfile, token: string) => void;
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

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  // Login fields
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration fields
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [farmSizeAcres, setFarmSizeAcres] = useState('3');
  const [soilType, setSoilType] = useState('Loamy');
  const [primaryCropsText, setPrimaryCropsText] = useState('Paddy, Wheat');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest<{ farmer: FarmerProfile; token: string }>('/api/auth/login', {
        method: 'POST',
        language,
        body: { identifier: loginId, password: loginPassword, language },
      });
      onAuthenticated(res.farmer, res.token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.auth.loginFallbackError);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const primaryCrops = primaryCropsText
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const res = await apiRequest<{ farmer: FarmerProfile; token: string }>('/api/auth/register', {
        method: 'POST',
        language,
        body: {
          name,
          identifier,
          password,
          village,
          district,
          state,
          farmSizeAcres: Number(farmSizeAcres) || 2.5,
          soilType,
          primaryCrops,
          language,
        },
      });
      onAuthenticated(res.farmer, res.token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.auth.registerFallbackError);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest<{ farmer: FarmerProfile; token: string }>('/api/auth/demo', {
        method: 'POST',
        language,
        body: { language },
      });
      onAuthenticated(res.farmer, res.token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.auth.demoFallbackError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col lg:flex-row">
      {/* Left Hero Visual Panel */}
      <div className="relative lg:w-[48%] min-h-[280px] lg:min-h-screen bg-[#122B1D] overflow-hidden flex flex-col justify-between p-8 lg:p-12 text-white">
        {!heroImgFailed ? (
          <img
            src="/src/assets/images/hero_indian_farm_1795245915928.jpg"
            alt={t.auth.heroAlt}
            referrerPolicy="no-referrer"
            onError={() => setHeroImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-55"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2116] via-[#122B1D]/70 to-[#122B1D]/60" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2E7D4F] flex items-center justify-center border border-white/20">
            <Sprout className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight whitespace-nowrap">
            {t.brand}
          </span>
        </div>

        <div className="relative z-10 my-8 lg:my-0 max-w-lg">
          <h1 className="font-display text-3xl lg:text-4xl font-bold leading-tight text-balance">
            {t.auth.heroTitle}
          </h1>
          <p className="mt-4 text-sm lg:text-base text-[#DCEBE2] leading-relaxed">
            {t.auth.heroSubtitle}
          </p>

          <div className="mt-8 space-y-3 border-t border-white/15 pt-6 text-sm text-[#E7F3EC]">
            <div className="flex items-start gap-3">
              <Leaf className="w-4 h-4 mt-0.5 text-[#7AE5A6] shrink-0" aria-hidden="true" />
              <span>{t.auth.heroBullet1}</span>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-[#7AE5A6] shrink-0" aria-hidden="true" />
              <span>{t.auth.heroBullet2}</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-[#B7D4C3]">
          {t.auth.heroFooter}
        </p>
      </div>

      {/* Right Authentication Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md bg-white border border-[#DCE6DF] rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0F2418]">
                {mode === 'login' ? t.auth.loginTitle : t.auth.registerTitle}
              </h2>
              <p className="text-sm text-[#4A6355] mt-1">
                {mode === 'login' ? t.auth.loginSubtitle : t.auth.registerSubtitle}
              </p>
            </div>
            <LanguageSelector compact />
          </div>

          {/* Segmented Mode Switch */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#EFF5F1] rounded-lg mb-6" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 px-3 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                mode === 'login'
                  ? 'bg-white text-[#0F2418] shadow-xs'
                  : 'text-[#4A6355] hover:text-[#0F2418]'
              }`}
            >
              {t.auth.tabSignIn}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 px-3 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                mode === 'register'
                  ? 'bg-white text-[#0F2418] shadow-xs'
                  : 'text-[#4A6355] hover:text-[#0F2418]'
              }`}
            >
              {t.auth.tabRegister}
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-id" className="block text-sm font-medium text-[#1D3829] mb-1.5">
                  {t.auth.emailOrMobile}
                </label>
                <input
                  id="login-id"
                  type="text"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder={t.auth.emailOrMobilePlaceholder}
                  className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3.5 py-2.5 text-sm text-[#0F2418] placeholder:text-[#7E9688] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                />
              </div>

              <div>
                <label htmlFor="login-pw" className="block text-sm font-medium text-[#1D3829] mb-1.5">
                  {t.auth.password}
                </label>
                <input
                  id="login-pw"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder={t.auth.passwordPlaceholder}
                  className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3.5 py-2.5 text-sm text-[#0F2418] placeholder:text-[#7E9688] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B5E3A] hover:bg-[#14482C] disabled:opacity-60 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                {loading ? t.auth.signingIn : t.auth.signInBtn}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label htmlFor="reg-name" className="block text-xs font-semibold text-[#1D3829] mb-1">
                  {t.auth.fullName}
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.auth.fullNamePlaceholder}
                  className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-id" className="block text-xs font-semibold text-[#1D3829] mb-1">
                    {t.auth.emailOrMobileShort}
                  </label>
                  <input
                    id="reg-id"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t.auth.mobilePlaceholder}
                    className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                  />
                </div>
                <div>
                  <label htmlFor="reg-pw" className="block text-xs font-semibold text-[#1D3829] mb-1">
                    {t.auth.passwordMin}
                  </label>
                  <input
                    id="reg-pw"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.auth.passwordCreatePlaceholder}
                    className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-village" className="block text-xs font-semibold text-[#1D3829] mb-1">
                    {t.auth.village}
                  </label>
                  <input
                    id="reg-village"
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder={t.auth.villagePlaceholder}
                    className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                  />
                </div>
                <div>
                  <label htmlFor="reg-district" className="block text-xs font-semibold text-[#1D3829] mb-1">
                    {t.auth.district}
                  </label>
                  <input
                    id="reg-district"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={t.auth.districtPlaceholder}
                    className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-state" className="block text-xs font-semibold text-[#1D3829] mb-1">
                    {t.auth.state}
                  </label>
                  <select
                    id="reg-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {translateStateLabel(st, language)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="reg-size" className="block text-xs font-semibold text-[#1D3829] mb-1">
                    {t.auth.farmSize}
                  </label>
                  <input
                    id="reg-size"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={farmSizeAcres}
                    onChange={(e) => setFarmSizeAcres(e.target.value)}
                    className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-soil" className="block text-xs font-semibold text-[#1D3829] mb-1">
                    {t.auth.soilType}
                  </label>
                  <select
                    id="reg-soil"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                  >
                    {SOIL_TYPES.map((s) => (
                      <option key={s} value={s}>
                        {translateSoilLabel(s, language)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="reg-crops" className="block text-xs font-semibold text-[#1D3829] mb-1">
                    {t.auth.mainCrops}
                  </label>
                  <input
                    id="reg-crops"
                    type="text"
                    value={primaryCropsText}
                    onChange={(e) => setPrimaryCropsText(e.target.value)}
                    placeholder={t.auth.mainCropsPlaceholder}
                    className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B5E3A] hover:bg-[#14482C] disabled:opacity-60 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                {loading ? t.auth.creatingProfile : t.auth.createAccountBtn}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          )}

          {/* Instant Demo Access */}
          <div className="mt-6 pt-5 border-t border-[#E5EFE9]">
            <button
              type="button"
              disabled={loading}
              onClick={handleDemoLogin}
              className="w-full rounded-lg border border-[#B9D2C2] bg-[#F2F8F4] hover:bg-[#E5F1E9] px-4 py-2.5 text-sm font-semibold text-[#164A2D] transition-colors"
            >
              {t.auth.demoBtn}
            </button>
            <p className="mt-2.5 text-xs text-[#5B7466] leading-relaxed">
              {t.auth.storageNotice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
