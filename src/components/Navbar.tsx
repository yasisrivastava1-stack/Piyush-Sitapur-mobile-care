import React, { useState } from 'react';
import {
  Wrench,
  Phone,
  MessageSquare,
  MapPin,
  User,
  Shield,
  Briefcase,
  Layers,
  ChevronDown,
  LogOut,
  LogIn
} from 'lucide-react';
import { UserRole } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import { signInWithGoogle, logoutUser } from '../lib/firebase';

interface NavbarProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenBooking: () => void;
  onOpenProfile: () => void;
  onOpenSupport: () => void;
  onOpenSeoPages: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: FirebaseUser | null;
  unconfirmedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  onOpenBooking,
  onOpenProfile,
  onOpenSupport,
  onOpenSeoPages,
  activeTab,
  setActiveTab,
  currentUser,
  unconfirmedCount = 0,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top micro-bar for Sitapur local emergency helpline & location */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live in Sitapur:
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Doorstep Technicians Active in Civil Lines, Station Rd, Khairabad & nearby
            </span>
            <span className="text-slate-300 sm:hidden">Sitapur Hub Active</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="seo-pages-btn"
              onClick={onOpenSeoPages}
              className="hover:text-amber-400 text-slate-300 underline cursor-pointer transition text-[11px]"
            >
              Sitapur Service Areas & SEO
            </button>
            <span className="text-slate-700">|</span>
            <a
              href="tel:+918563975583"
              className="flex items-center gap-1 text-amber-400 font-medium hover:text-amber-300"
            >
              <Phone className="w-3 h-3" />
              <span>+91 85639 75583</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline - Sleek Interface style */}
        <div
          id="brand-logo"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="bg-blue-600 p-2.5 rounded-lg text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-blue-900 group-hover:text-blue-600 transition">
                Piyush Sitapur Mobile & Laptop Care
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                Doorstep
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 -mt-0.5">
              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
              <span>Mobile & Laptop Repair at Your Doorstep in Sitapur</span>
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            id="nav-home"
            onClick={() => setActiveTab('home')}
            className={`transition ${
              activeTab === 'home'
                ? 'text-blue-600 font-bold'
                : 'hover:text-blue-600'
            }`}
          >
            Home
          </button>
          <button
            id="nav-services"
            onClick={() => {
              setActiveTab('home');
              const el = document.getElementById('services-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Our Services
          </button>
          <button
            id="nav-brands"
            onClick={() => {
              setActiveTab('home');
              const el = document.getElementById('brands-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Brands
          </button>
          <button
            id="nav-track"
            onClick={() => setActiveTab('track')}
            className={`transition ${
              activeTab === 'track'
                ? 'text-blue-600 font-bold'
                : 'hover:text-blue-600'
            }`}
          >
            Live Tracking
          </button>
          <button
            id="nav-support"
            onClick={onOpenSupport}
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Support
          </button>
          {currentRole === 'admin' && (
            <button
              id="nav-admin-dashboard"
              onClick={() => setActiveTab('admin')}
              className={`transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'admin'
                  ? 'text-purple-600 font-bold'
                  : 'text-slate-700 hover:text-purple-600'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Portal</span>
              {unconfirmedCount > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  {unconfirmedCount}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Action Controls & Contact Pill */}
        <div className="flex items-center gap-3">
          {/* Sleek Contact Pill */}
          <a
            id="navbar-call-pill"
            href="tel:+918563975583"
            className="hidden md:flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full text-blue-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>+91 85639 75583</span>
          </a>

          {/* Quick WhatsApp button */}
          <a
            id="navbar-whatsapp-btn"
            href="https://wa.me/918563975583?text=Hi%20Piyush%20Sitapur%20Mobile%20Care,%20I%20want%20to%20repair%20my%20phone"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp</span>
          </a>

          {/* Book Repair Primary CTA - Sleek Interface style */}
          <button
            id="navbar-book-btn"
            onClick={onOpenBooking}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Book Repair</span>
          </button>

          {/* User Auth & Profile */}
          <div className="relative">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="user-profile-btn"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className={`flex items-center gap-1.5 pl-1.5 pr-3 py-1.5 text-xs font-semibold rounded-full border transition cursor-pointer ${
                    currentRole === 'admin'
                      ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}`}
                    alt="User"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {currentUser.displayName || 'User'}
                  </span>
                  {currentRole === 'admin' && (
                    <Shield className="w-3 h-3 text-purple-600 hidden sm:block" />
                  )}
                  {currentRole === 'customer' && unconfirmedCount > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                      {unconfirmedCount}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 top-10 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-semibold text-slate-800 truncate">{currentUser.displayName}</div>
                      <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                    </div>
                    
                    {currentRole === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-purple-50 text-purple-700 cursor-pointer"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                        {unconfirmedCount > 0 && (
                          <span className="ml-auto bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full">
                            {unconfirmedCount} New
                          </span>
                        )}
                      </button>
                    )}

                    <button
                      onClick={onOpenProfile}
                      className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-slate-50 text-slate-700 cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile & Bookings</span>
                    </button>

                    <button
                      onClick={async () => {
                        await logoutUser();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-rose-50 text-rose-600 cursor-pointer border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                  } catch (e) {
                    console.error("Login failed", e);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-sm"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
