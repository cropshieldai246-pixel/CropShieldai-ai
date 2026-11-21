import React, { useState } from 'react';
import {
  Camera,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  ShoppingBag,
  Sprout,
  User,
  X,
} from 'lucide-react';
import { AssistantView } from './components/AssistantView';
import { AuthScreen } from './components/AuthScreen';
import { CropAdvisorView } from './components/CropAdvisorView';
import { DashboardView } from './components/DashboardView';
import { DiseaseDetectionView } from './components/DiseaseDetectionView';
import { LanguageSelector } from './components/LanguageSelector';
import { MarketplaceView } from './components/MarketplaceView';
import { ProfileView } from './components/ProfileView';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { translateStateLabel } from './i18n/translations';
import { apiRequest } from './lib/api';
import { FarmerProfile, NavTab } from './types';

interface NavItem {
  id: NavTab;
  labelKey: 'dashboard' | 'assistant' | 'disease' | 'advisor' | 'marketplace' | 'profile';
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { id: 'assistant', labelKey: 'assistant', icon: MessageSquareText },
  { id: 'disease', labelKey: 'disease', icon: Camera },
  { id: 'advisor', labelKey: 'advisor', icon: Compass },
  { id: 'marketplace', labelKey: 'marketplace', icon: ShoppingBag },
  { id: 'profile', labelKey: 'profile', icon: User },
];

function AppShell() {
  const { language, t } = useLanguage();
  // Keep Bearer token strictly in React memory (never localStorage/sessionStorage)
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleAuthenticated(profile: FarmerProfile, token: string) {
    setFarmer(profile);
    setAuthToken(token);
    setActiveTab('dashboard');
  }

  async function handleSignOut() {
    if (authToken) {
      try {
        await apiRequest('/api/auth/logout', { method: 'POST', token: authToken, language });
      } catch {
        // Ignore network errors during logout
      }
    }
    setAuthToken(null);
    setFarmer(null);
    setMobileMenuOpen(false);
  }

  if (!authToken || !farmer) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  const currentNav = NAV_ITEMS.find((item) => item.id === activeTab) ?? NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:fixed lg:inset-y-0 bg-[#122B1D] text-white">
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2E7D4F] flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight whitespace-nowrap">
            {t.brand}
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2E7D4F] text-white'
                    : 'text-[#C6DDD0] hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.nav[item.labelKey]}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 text-xs text-[#B7D4C3] space-y-1">
          <p className="font-semibold text-white truncate">{farmer.name}</p>
          <p className="truncate">
            {farmer.district}, {translateStateLabel(farmer.state, language)}
          </p>
          <p className="text-[11px] text-[#8FB59F] pt-1">
            {t.nav.sidebarFooterTagline}
          </p>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#122B1D] text-white flex flex-col z-10">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sprout className="w-5 h-5 text-[#7AE5A6]" aria-hidden="true" />
                <span className="font-display text-lg font-bold">{t.brand}</span>
              </div>
              <button
                type="button"
                aria-label={t.nav.closeMenu}
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#C6DDD0] hover:bg-white/10"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[#2E7D4F] text-white'
                        : 'text-[#C6DDD0] hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{t.nav[item.labelKey]}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2 text-xs font-semibold text-white"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                {t.nav.signOut}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#DCE6DF] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label={t.nav.openMenu}
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-[#DCE6DF] text-[#1D3829] hover:bg-[#F2F8F4]"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
            <p className="text-sm font-semibold text-[#0F2418] truncate">
              {t.brand} / {t.nav[currentNav.labelKey]}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <LanguageSelector compact />
            <span className="hidden md:inline text-xs font-medium text-[#4A6355] truncate max-w-[180px]">
              {farmer.name}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBDAD0] bg-white hover:bg-[#F2F8F4] px-3 py-1.5 text-xs font-semibold text-[#1D3829] transition-colors whitespace-nowrap shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              {t.nav.signOut}
            </button>
          </div>
        </header>

        {/* Active Module Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1280px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              farmer={farmer}
              token={authToken}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}
          {activeTab === 'assistant' && (
            <AssistantView farmer={farmer} token={authToken} />
          )}
          {activeTab === 'disease' && <DiseaseDetectionView token={authToken} />}
          {activeTab === 'advisor' && (
            <CropAdvisorView farmer={farmer} token={authToken} />
          )}
          {activeTab === 'marketplace' && <MarketplaceView token={authToken} />}
          {activeTab === 'profile' && (
            <ProfileView
              farmer={farmer}
              token={authToken}
              onFarmerUpdated={(updated) => setFarmer(updated)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
