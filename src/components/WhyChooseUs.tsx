import React from 'react';
import {
  Home,
  UserCheck,
  Receipt,
  Sparkles,
  Zap,
  ShieldCheck,
  MousePointerClick,
  MapPin,
} from 'lucide-react';

const REASONS = [
  {
    icon: <Home className="w-6 h-6 text-blue-600" />,
    title: 'Doorstep Service',
    description:
      'No need to travel to crowded markets or leave your phone behind. Technician visits your home or office anywhere in Sitapur.',
  },
  {
    icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
    title: 'Verified Technicians',
    description:
      'Background-verified, certified repair experts with 3+ to 6+ years of micro-soldering and smartphone diagnostic experience.',
  },
  {
    icon: <Receipt className="w-6 h-6 text-indigo-600" />,
    title: 'Transparent Pricing',
    description:
      'Clear upfront estimates with zero hidden costs. You review and approve the exact repair quotation before work begins.',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    title: 'Genuine / Quality Parts',
    description:
      'OEM-grade certified displays, high-density batteries, and authentic sub-boards tested for optimal performance.',
  },
  {
    icon: <Zap className="w-6 h-6 text-rose-500" />,
    title: 'Quick 30-Min Service',
    description:
      'Most screen, battery, and port replacements are completed in just 30 to 45 minutes right in front of your eyes.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
    title: 'Service Warranty',
    description:
      'Enjoy up to 6 months comprehensive replacement warranty on screens and batteries, backed by a digital invoice.',
  },
  {
    icon: <MousePointerClick className="w-6 h-6 text-purple-600" />,
    title: 'Easy Online Booking',
    description:
      'Book a slot in under 2 minutes. Select your brand, model, fault, preferred time slot, and track the technician live.',
  },
  {
    icon: <MapPin className="w-6 h-6 text-red-500" />,
    title: 'Local Sitapur Support',
    description:
      'Dedicated local support team based in Sitapur with fast phone, WhatsApp, and physical warranty assistance.',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full shadow-2xs">
            Trust & Reliability
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Choose Piyush Sitapur Mobile & Laptop Care?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Your smartphone holds your sensitive data and personal memories. Here is why Sitapur residents trust us at their doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REASONS.map((r, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {r.icon}
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition">
                {r.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
