import React from 'react';
import { Home, Wrench, Navigation, HelpCircle, Shield } from 'lucide-react';
import { UserRole } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenSupport: () => void;
  currentRole: UserRole;
  unconfirmedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onOpenSupport,
  currentRole,
  unconfirmedCount = 0,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        <button
          id="bottom-nav-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition ${
            activeTab === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          id="bottom-nav-track"
          onClick={() => setActiveTab('track')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition ${
            activeTab === 'track' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Navigation className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Dashboard</span>
        </button>

        {/* Center Prominent Book Button */}
        <button
          id="bottom-nav-book-repair"
          onClick={onOpenBooking}
          className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full w-12 h-12 shadow-lg shadow-blue-500/40 border-2 border-white hover:scale-105 transition"
        >
          <Wrench className="w-5 h-5" />
          <span className="sr-only">Book Repair</span>
        </button>

        {currentRole === 'admin' ? (
          <button
            id="bottom-nav-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition relative ${
              activeTab === 'admin' ? 'text-purple-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Shield className="w-5 h-5" />
              {unconfirmedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unconfirmedCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Admin</span>
          </button>
        ) : (
          <button
            id="bottom-nav-support"
            onClick={onOpenSupport}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition ${
              activeTab === 'support' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Support</span>
          </button>
        )}
      </div>
    </div>
  );
};
