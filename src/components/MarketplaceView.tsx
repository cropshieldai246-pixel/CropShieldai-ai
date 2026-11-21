import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  Store,
  X,
} from 'lucide-react';
import { apiRequest, ApiError } from '../lib/api';
import { useLanguage } from '../i18n/LanguageContext';
import { translateCategory } from '../i18n/translations';
import { SupplierProduct, SupplierProfile } from '../types';

interface MarketplaceViewProps {
  token: string;
}

const CATEGORIES = [
  'All',
  'Seeds',
  'Bio-Fertilizers',
  'Organic Care',
  'Irrigation',
  'Soil Tools',
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

export function MarketplaceView({ token }: MarketplaceViewProps) {
  const { language, t } = useLanguage();
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [notice, setNotice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [imgFailed, setImgFailed] = useState(false);

  // Contact Supplier modal state
  const [contactTarget, setContactTarget] = useState<{
    supplier: SupplierProfile;
    product?: SupplierProduct;
  } | null>(null);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadMarketplace() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest<{ suppliers: SupplierProfile[]; notice: string }>(
          `/api/suppliers?lang=${encodeURIComponent(language)}`,
          { token, language }
        );
        if (!active) return;
        setSuppliers(res.suppliers);
        setNotice(res.notice);
      } catch (err) {
        if (!active) return;
        setError(err instanceof ApiError ? err.message : t.marketplace.errLoad);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMarketplace();
    return () => {
      active = false;
    };
  }, [token, language, t.marketplace.errLoad]);

  function openContactModal(supplier: SupplierProfile, product?: SupplierProduct) {
    setContactTarget({ supplier, product });
    setInquirySuccess(null);
    setInquiryMessage(
      product
        ? t.marketplace.defaultProductInquiry(supplier.ownerName, product.name, product.packSize)
        : t.marketplace.defaultSupplierInquiry(supplier.ownerName)
    );
  }

  async function handleSendInquiry(e: React.FormEvent) {
    e.preventDefault();
    if (!contactTarget || !inquiryMessage.trim()) return;
    setSendingInquiry(true);
    try {
      const res = await apiRequest<{ note: string }>('/api/suppliers/inquire', {
        method: 'POST',
        token,
        language,
        body: {
          supplierName: contactTarget.supplier.businessName,
          productName: contactTarget.product?.name,
          message: inquiryMessage,
        },
      });
      setInquirySuccess(res.note);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.marketplace.errInquiry);
    } finally {
      setSendingInquiry(false);
    }
  }

  const queryLower = searchQuery.trim().toLowerCase();

  const filteredSuppliers = suppliers
    .map((sup) => {
      const matchingProducts = sup.products.filter((prod) => {
        const catMatch = selectedCategory === 'All' || prod.category === selectedCategory;
        const textMatch =
          !queryLower ||
          prod.name.toLowerCase().includes(queryLower) ||
          prod.description.toLowerCase().includes(queryLower) ||
          sup.businessName.toLowerCase().includes(queryLower) ||
          sup.location.toLowerCase().includes(queryLower);
        return catMatch && textMatch;
      });
      return { ...sup, products: matchingProducts };
    })
    .filter((sup) => sup.products.length > 0);

  return (
    <div className="space-y-6">
      {/* Header + Hackathon Sample Notice */}
      <div className="rounded-xl border border-[#DCE6DF] bg-white p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1B5E3A]" aria-hidden="true" />
            <h1 className="font-display text-xl font-bold text-[#0F2418]">
              {t.marketplace.title}
            </h1>
          </div>
          <p className="text-sm text-[#4A6355]">
            {t.marketplace.subtitle}
          </p>
          <p className="text-xs font-medium text-[#7A5400]">
            {notice || t.marketplace.defaultNotice}
          </p>
        </div>

        {!imgFailed && (
          <img
            src="/src/assets/images/supplier_agri_inputs_1795245915334.jpg"
            alt={t.marketplace.imageAlt}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full lg:w-44 h-28 object-cover rounded-lg border border-[#DCE6DF] shrink-0"
          />
        )}
      </div>

      {/* Category Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EBF2EE] rounded-lg">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white text-[#0F2418] shadow-xs'
                  : 'text-[#4A6355] hover:text-[#0F2418]'
              }`}
            >
              {translateCategory(cat, language)}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#647D6F] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.marketplace.searchPlaceholder}
            aria-label={t.marketplace.searchAria}
            className="w-full rounded-lg border border-[#CBDAD0] bg-white pl-9 pr-3 py-2 text-sm text-[#0F2418] focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
          />
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-[#DCE6DF] bg-white p-12 text-center text-sm text-[#5B7466]">
          {t.marketplace.loadingText}
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#CBDAD0] bg-white p-12 text-center">
          <p className="text-sm font-semibold text-[#1D3829]">{t.marketplace.noResults}</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-3 rounded-lg bg-[#1B5E3A] px-4 py-2 text-xs font-semibold text-white"
          >
            {t.marketplace.resetFilters}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSuppliers.map((sup) => (
            <section
              key={sup.id}
              className="rounded-xl border border-[#DCE6DF] bg-white p-6 space-y-5"
            >
              {/* Supplier Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEF3EF] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#1B5E3A]" aria-hidden="true" />
                    <h2 className="font-display text-lg font-bold text-[#0F2418]">
                      {sup.businessName}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-[#4A6355] flex flex-wrap items-center gap-2">
                    <span>
                      {t.marketplace.ownerPrefix}: {sup.ownerName}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1B5E3A]" aria-hidden="true" />
                      {sup.location}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {sup.yearsActive} {t.marketplace.yearsActiveSuffix}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{t.marketplace.sampleListing}</span>
                  </p>
                  <p className="mt-1 text-xs text-[#1B5E3A] font-medium">
                    {t.marketplace.specializationPrefix}: {sup.specialization}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openContactModal(sup)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1B5E3A] text-[#1B5E3A] hover:bg-[#F2F8F4] px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.marketplace.contactSupplierBtn}
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sup.products.map((prod) => (
                  <article
                    key={prod.id}
                    className="rounded-lg border border-[#E5EFE9] bg-[#FAFCFB] p-4 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-[#4A6355]">
                            {translateCategory(prod.category, language)} · {prod.packSize}
                          </p>
                          <h3 className="font-display text-base font-bold text-[#0F2418] mt-0.5">
                            {prod.name}
                          </h3>
                        </div>
                        <p className="font-mono tabular-nums text-base font-bold text-[#1B5E3A] shrink-0">
                          ₹{prod.indicativePriceInr}
                        </p>
                      </div>

                      <p className="mt-2 text-xs text-[#334D3F] leading-relaxed">
                        {prod.description}
                      </p>
                      <p className="mt-2 text-xs text-[#5B7466]">
                        <span className="font-semibold text-[#1D3829]">
                          {t.marketplace.usageNotePrefix}{' '}
                        </span>
                        {prod.usageNote}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E5EFE9]">
                      <span className="text-[11px] text-[#5B7466]">{sup.responseTime}</span>
                      <button
                        type="button"
                        onClick={() => openContactModal(sup, prod)}
                        className="rounded-lg bg-[#1B5E3A] hover:bg-[#14482C] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors whitespace-nowrap"
                      >
                        {t.marketplace.contactSupplierBtn}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Contact Supplier Modal */}
      {contactTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg rounded-xl bg-white border border-[#DCE6DF] p-6 space-y-4 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="contact-modal-title" className="font-display text-lg font-bold text-[#0F2418]">
                  {t.marketplace.contactModalTitlePrefix} {contactTarget.supplier.businessName}
                </h2>
                <p className="text-xs text-[#4A6355] mt-0.5">
                  {contactTarget.supplier.location} · {t.marketplace.sampleSupplierContact}
                </p>
              </div>
              <button
                type="button"
                aria-label={t.marketplace.closeModalAria}
                onClick={() => setContactTarget(null)}
                className="p-1.5 rounded-lg text-[#5B7466] hover:bg-[#F2F8F4]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="rounded-lg bg-[#F4F8F5] p-3.5 space-y-1.5 text-xs text-[#1D3829]">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1B5E3A]" aria-hidden="true" />
                <span className="font-mono">{contactTarget.supplier.contactPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#1B5E3A]" aria-hidden="true" />
                <span className="font-mono">{contactTarget.supplier.contactEmail}</span>
              </p>
              {contactTarget.product && (
                <p className="pt-1 font-semibold text-[#1B5E3A]">
                  {t.marketplace.selectedProductPrefix} {contactTarget.product.name} (
                  {t.marketplace.indicativePricePrefix}
                  {contactTarget.product.indicativePriceInr})
                </p>
              )}
            </div>

            {inquirySuccess ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{t.marketplace.inquiryRecordedTitle}</p>
                  <p className="mt-1">{inquirySuccess}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3">
                <div>
                  <label htmlFor="sup-msg" className="block text-xs font-semibold text-[#1D3829] mb-1">
                    {t.marketplace.yourInquiryLabel}
                  </label>
                  <textarea
                    id="sup-msg"
                    rows={3}
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full rounded-lg border border-[#CBDAD0] bg-white px-3 py-2 text-sm text-[#0F2418]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setContactTarget(null)}
                    className="rounded-lg border border-[#CBDAD0] px-4 py-2 text-xs font-semibold text-[#1D3829]"
                  >
                    {t.marketplace.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    disabled={sendingInquiry}
                    className="rounded-lg bg-[#1B5E3A] hover:bg-[#14482C] px-4 py-2 text-xs font-semibold text-white"
                  >
                    {sendingInquiry ? t.marketplace.sendingBtn : t.marketplace.sendInquiryBtn}
                  </button>
                </div>
              </form>
            )}

            <p className="text-[11px] text-[#5B7466]">
              {t.marketplace.demoNoticeFooter}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
