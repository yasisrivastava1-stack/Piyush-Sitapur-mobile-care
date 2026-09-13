import React, { useState } from 'react';
import { ChevronRight, Smartphone } from 'lucide-react';
import { SITAPUR_BRANDS } from '../data/sitapurData';

interface BrandsGridProps {
  onSelectBrand: (brandName: string, modelName?: string) => void;
}

export const BrandsGrid: React.FC<BrandsGridProps> = ({ onSelectBrand }) => {
  const [selectedBrandTab, setSelectedBrandTab] = useState<string | null>(null);

  const activeBrand = SITAPUR_BRANDS.find((b) => b.id === selectedBrandTab);

  return (
    <div>
      {/* Sleek Certified Support Banner from Theme */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Certified Support For
            </span>
            <div className="flex items-center gap-6 sm:gap-8 opacity-40 grayscale font-black text-sm sm:text-base tracking-wider">
              <span>APPLE</span>
              <span>SAMSUNG</span>
              <span>XIAOMI</span>
              <span>ONEPLUS</span>
              <span>VIVO</span>
              <span>OPPO</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>12 Active Technicians in Sitapur</span>
          </div>
        </div>
      </div>

      <section id="brands-section" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full shadow-2xs">
              Multi-Brand Smartphone Support
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Select Your Smartphone Brand
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              From iPhones to flagship Androids and budget daily drivers, our Sitapur technicians carry OEM-grade parts for all leading brands.
            </p>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {SITAPUR_BRANDS.map((brand) => (
              <div
                key={brand.id}
                id={`brand-item-${brand.id}`}
                onClick={() => {
                  setSelectedBrandTab(selectedBrandTab === brand.id ? null : brand.id);
                }}
                className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer text-center relative group ${
                  selectedBrandTab === brand.id
                    ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 hover:border-blue-400 hover:shadow-xs'
                }`}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {brand.logo}
                </div>
                <h3 className="font-bold text-sm text-slate-900">{brand.name}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {brand.popularModels.length}+ Models
                </p>

                <button
                  id={`brand-book-${brand.id}-btn`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBrand(brand.name);
                  }}
                  className="mt-3 w-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 text-[11px] font-semibold py-2 rounded-xl transition cursor-pointer"
                >
                  Book {brand.name}
                </button>
              </div>
            ))}
          </div>

          {/* Brand Models Preview Drawer */}
          {activeBrand && (
            <div className="mt-6 bg-white rounded-2xl p-5 border border-blue-200 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeBrand.logo}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Popular {activeBrand.name} Models Repaired in Sitapur
                    </h4>
                    <p className="text-xs text-slate-500">
                      Select a model below to jump directly into booking:
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBrandTab(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {activeBrand.popularModels.map((model) => (
                  <button
                    key={model}
                    onClick={() => onSelectBrand(activeBrand.name, model)}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Smartphone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                        {model}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
