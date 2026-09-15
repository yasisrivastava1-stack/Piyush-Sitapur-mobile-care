import React from 'react';
import {
  Smartphone,
  BatteryCharging,
  Zap,
  Volume2,
  Camera,
  Droplets,
  Cpu,
  Layers,
  ShieldCheck,
  Power,
  Wifi,
  Wrench,
  ArrowRight,
  Shield,
  Clock,
} from 'lucide-react';
import { SITAPUR_REPAIR_SERVICES } from '../data/sitapurData';

interface ServiceCategoriesProps {
  onSelectService: (serviceTitle: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-6 h-6 text-blue-600" />,
  BatteryCharging: <BatteryCharging className="w-6 h-6 text-emerald-600" />,
  Zap: <Zap className="w-6 h-6 text-amber-500" />,
  Volume2: <Volume2 className="w-6 h-6 text-purple-600" />,
  Camera: <Camera className="w-6 h-6 text-rose-500" />,
  Droplets: <Droplets className="w-6 h-6 text-cyan-500" />,
  Cpu: <Cpu className="w-6 h-6 text-indigo-600" />,
  Layers: <Layers className="w-6 h-6 text-orange-600" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-teal-600" />,
  Power: <Power className="w-6 h-6 text-red-500" />,
  Wifi: <Wifi className="w-6 h-6 text-sky-600" />,
  Wrench: <Wrench className="w-6 h-6 text-slate-600" />,
};

export const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ onSelectService }) => {
  return (
    <section id="services-section" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full shadow-2xs">
            Professional Doorstep Services
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
            What Can We Fix for You Today?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Certified smartphone and laptop repairs done right in front of your eyes at your home or office in Sitapur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {SITAPUR_REPAIR_SERVICES.map((srv) => (
            <div
              key={srv.id}
              id={`service-card-${srv.id}`}
              onClick={() => onSelectService(srv.title)}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              {srv.popular && (
                <span className="absolute top-3 right-3 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  Most Booked
                </span>
              )}

              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                  {ICON_MAP[srv.icon] || <Wrench className="w-6 h-6 text-blue-600" />}
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition">
                  {srv.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {srv.shortDesc}
                </p>

                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>~{srv.estimatedMinutes} mins</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <Shield className="w-3 h-3" />
                    <span className="truncate">{srv.warrantyPeriod.split(' ')[0]} {srv.warrantyPeriod.split(' ')[1]}</span>
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Doorstep Inspection</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Free Diagnosis
                  </span>
                </div>

                <button
                  id={`book-service-${srv.id}-btn`}
                  className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 group-hover:border-blue-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Book Doorstep</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
