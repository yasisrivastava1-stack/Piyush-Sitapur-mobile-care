import React, { useState } from 'react';
import { X, MapPin, Smartphone, Shield, ArrowRight, Wrench, CheckCircle } from 'lucide-react';
import { SITAPUR_SEO_PAGES, SitapurSeoPage } from '../data/sitapurData';

interface SeoPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (brand?: string, service?: string) => void;
}

export const SeoPagesModal: React.FC<SeoPagesModalProps> = ({
  isOpen,
  onClose,
  onBookNow,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string>(SITAPUR_SEO_PAGES[0].slug);

  if (!isOpen) return null;

  const activePage: SitapurSeoPage =
    SITAPUR_SEO_PAGES.find((p) => p.slug === selectedSlug) || SITAPUR_SEO_PAGES[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-300 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
                Localized SEO Hubs
              </span>
              <span className="text-xs text-slate-400">Sitapur & Regional Districts</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-1">Sitapur Service Directories</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-600 shrink-0 overflow-x-auto gap-2 py-2">
          {SITAPUR_SEO_PAGES.map((page) => (
            <button
              key={page.slug}
              onClick={() => setSelectedSlug(page.slug)}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs ${
                selectedSlug === page.slug
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {page.locality || page.brand || 'Doorstep'}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Sitapur, Uttar Pradesh — Doorstep Repair Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {activePage.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {activePage.metaDescription}
            </p>
          </div>

          {/* Highlights */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
              Service Guarantees:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activePage.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Local Content Body */}
          <div className="text-xs text-slate-600 leading-relaxed space-y-2.5">
            <p>{activePage.content}</p>
            <p>
              Technicians carry state-of-the-art anti-static ESD mats, micro-soldering hot air guns,
              precision screwdrivers, and diagnostic battery testers directly to your location in
              Sitapur. All repairs are done in your sight, ensuring complete privacy of your photos,
              messages, and personal data.
            </p>
          </div>

          {/* Direct Booking CTA */}
          <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold">Need This Repaired Today?</h4>
              <p className="text-xs text-blue-100 mt-0.5">
                Sitapur technicians are on standby with OEM parts.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onBookNow(activePage.brand, activePage.repairType);
              }}
              className="bg-white hover:bg-slate-100 text-blue-700 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Wrench className="w-4 h-4" />
              <span>Book Doorstep Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
