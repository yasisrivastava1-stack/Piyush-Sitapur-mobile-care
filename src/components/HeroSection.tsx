import React, { useState } from 'react';
import {
  Wrench,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';
import { SITAPUR_BRANDS } from '../data/sitapurData';

interface HeroSectionProps {
  onBookRepair: (preselectedBrand?: string, preselectedService?: string) => void;
  onOpenEstimate: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookRepair,
  onOpenEstimate,
}) => {
  const [searchModel, setSearchModel] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchModel.trim()) {
      onBookRepair(undefined, searchModel.trim());
    } else {
      onBookRepair();
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Main Hero Copy - Sleek Interface style */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-6 text-center lg:text-left">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full shadow-2xs">
                Piyush Sitapur Mobile & Laptop Care • Doorstep Service
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 tracking-tight">
                Mobile & Laptop Repair <br />
                <span className="text-blue-600">at Your Doorstep.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Book Piyush Sitapur Mobile & Laptop Care for trusted smartphone & laptop repair at your home or office anywhere in Sitapur. Free doorstep inspection, genuine parts, and quick service.
              </p>
            </div>

            {/* Quick Model Search Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-md mx-auto lg:mx-0 w-full bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2"
            >
              <div className="pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="hero-model-search"
                type="text"
                placeholder="E.g. iPhone 15, HP Pavilion, Galaxy S24..."
                value={searchModel}
                onChange={(e) => setSearchModel(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden py-1"
              />
              <button
                type="submit"
                id="hero-search-btn"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shrink-0 cursor-pointer shadow-xs"
              >
                Find Repair
              </button>
            </form>

            {/* Primary Action Buttons - Sleek Interface style */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-book-repair-btn"
                onClick={() => onBookRepair()}
                className="bg-blue-600 text-white px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wrench className="w-5 h-5" />
                <span>Book a Repair Now</span>
              </button>

              <button
                id="hero-free-estimate-btn"
                onClick={onOpenEstimate}
                className="bg-white border-2 border-slate-200 text-slate-700 px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:border-blue-200 hover:text-blue-600 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>View All Services</span>
              </button>
            </div>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a
                id="hero-call-now-btn"
                href="tel:+918563975583"
                className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-2 rounded-full border border-blue-200/60 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call: +91 85639 75583</span>
              </a>

              <a
                id="hero-whatsapp-us-btn"
                href="https://wa.me/918563975583?text=Hi%20Piyush%20Sitapur%20Mobile%20Care,%20I%20want%20to%20book%20a%20doorstep%20repair"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-3.5 py-2 rounded-full border border-emerald-200/60 transition"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-emerald-600" />
                <span>WhatsApp: 8563975583</span>
              </a>
            </div>

            {/* Sleek Interface 3 Metric Counters */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200/80">
              <div className="flex flex-col gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-blue-900">2,500+</span>
                <span className="text-[11px] text-slate-500 uppercase font-bold tracking-tighter">
                  Repairs Completed
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-blue-900">4.9/5</span>
                <span className="text-[11px] text-slate-500 uppercase font-bold tracking-tighter">
                  Customer Rating
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-blue-900">90-180 Days</span>
                <span className="text-[11px] text-slate-500 uppercase font-bold tracking-tighter">
                  Service Warranty
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Mockup - Sleek Interface style */}
          <div className="lg:col-span-5 relative flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Background Ambient Gradient Corner from Sleek Interface */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-50 rounded-bl-[120px] pointer-events-none" />

            {/* Device Mockup Shell */}
            <div className="relative w-72 sm:w-80 h-[560px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl p-4 overflow-hidden z-10">
              {/* Device Notch */}
              <div className="w-24 h-6 bg-slate-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />

              {/* Inside Screen Container */}
              <div className="h-full bg-white rounded-[2rem] flex flex-col overflow-hidden">
                {/* Mockup Header */}
                <div className="p-5 pt-8 bg-blue-600 text-white shrink-0">
                  <h2 className="font-bold text-lg leading-tight">What's wrong with your device?</h2>
                  <p className="text-xs opacity-80 mt-1">Step 3 of 8 • Select Issue</p>
                </div>

                {/* Mockup Scrollable Issues */}
                <div className="flex-1 p-3.5 space-y-2.5 overflow-y-auto">
                  {/* Selected Item (Broken Screen) */}
                  <div
                    onClick={() => onBookRepair(undefined, 'Screen Replacement')}
                    className="flex items-center gap-3 p-3 border border-blue-200 bg-blue-50 rounded-xl cursor-pointer hover:shadow-xs transition"
                  >
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-xs shrink-0">
                      <Wrench className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-900">Broken Screen</div>
                      <div className="text-[10px] text-blue-600 font-semibold">Free Doorstep Inspection</div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Battery Drain Item */}
                  <div
                    onClick={() => onBookRepair(undefined, 'Battery Replacement')}
                    className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-slate-50 rounded flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-800">Battery Drain</div>
                      <div className="text-[10px] text-slate-500">Original Certified Battery</div>
                    </div>
                  </div>

                  {/* Camera Issue Item */}
                  <div
                    onClick={() => onBookRepair(undefined, 'Camera Repair')}
                    className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-slate-50 rounded flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-800">Camera Issue</div>
                      <div className="text-[10px] text-slate-500">Original Lens & Sensor</div>
                    </div>
                  </div>

                  {/* Charging Issue Item */}
                  <div
                    onClick={() => onBookRepair(undefined, 'Charging Problem')}
                    className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-slate-50 rounded flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-800">Charging Jack</div>
                      <div className="text-[10px] text-slate-500">Port Cleaning & Fix</div>
                    </div>
                  </div>
                </div>

                {/* Mockup Action Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
                  <button
                    onClick={() => onBookRepair()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md shadow-blue-200 transition text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
