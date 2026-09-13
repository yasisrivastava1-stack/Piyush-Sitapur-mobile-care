/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HeroSection } from './components/HeroSection';
import { ServiceCategories } from './components/ServiceCategories';
import { BrandsGrid } from './components/BrandsGrid';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ReviewsSection } from './components/ReviewsSection';
import { BookingWizard } from './components/BookingWizard';
import { BookingTracker } from './components/BookingTracker';
import { AdminDashboard } from './components/AdminDashboard';
import { DigitalInvoiceModal } from './components/DigitalInvoiceModal';
import { SupportModal } from './components/SupportModal';
import { SeoPagesModal } from './components/SeoPagesModal';
import { auth, signInWithGoogle, loginAnonymously, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import {
  Booking,
  BookingStatus,
  CustomerReview,
  PaymentMethod,
  RepairQuotation,
  SupportTicket,
  Technician,
  UserRole,
} from './types';
import {
  SAMPLE_BOOKINGS,
  SITAPUR_TECHNICIANS,
  SITAPUR_REVIEWS,
  SAMPLE_SUPPORT_TICKETS,
  SERVICEABLE_AREAS,
} from './data/sitapurData';
import {
  Phone,
  MessageSquare,
  MapPin,
  ShieldCheck,
  Wrench,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Navigation & Role State (Customer Panel and Admin Dashboard only)
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState<string>('home'); // 'home' | 'track' | 'support' | 'admin'

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        if (
          user.uid === 'QptrqWDcngVbnXATvNovNQTYbBk2' ||
          user.email === 'yasisrivastava1@gmail.com'
        ) {
          setCurrentRole('admin');
          setActiveTab('admin');
        } else {
          setCurrentRole('customer');
          setActiveTab('home');
        }
      } else {
        setCurrentRole('customer');
        setActiveTab('home');
      }
    });

    return () => unsubscribe();
  }, []);

  // Application Data State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>(SITAPUR_TECHNICIANS);
  const [reviews, setReviews] = useState<CustomerReview[]>(SITAPUR_REVIEWS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

  // Unconfirmed bookings count for Admin Notification Badge
  const unconfirmedCount = bookings.filter(
    (b) => b.status === 'booking_received' || b.status === 'technician_assigning'
  ).length;

  // Active tracking booking
  const [activeTrackBookingId, setActiveTrackBookingId] = useState<string>('');

  // Modals state
  const [isBookingWizardOpen, setIsBookingWizardOpen] = useState<boolean>(false);
  const [wizardPreselectedBrand, setWizardPreselectedBrand] = useState<string | undefined>(undefined);
  const [wizardPreselectedService, setWizardPreselectedService] = useState<string | undefined>(undefined);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState<boolean>(false);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);

  // Track search query
  const [trackSearchInput, setTrackSearchInput] = useState<string>('');
  const [trackNotFound, setTrackNotFound] = useState<boolean>(false);

  // Handle Opening Booking Wizard
  const handleOpenBooking = async (brand?: string, service?: string) => {
    if (!currentUser) {
      try {
        const user = await loginAnonymously();
        if (!user) return; // User cancelled
      } catch (e) {
        console.error("Login failed", e);
        return;
      }
    }
    
    setWizardPreselectedBrand(brand);
    setWizardPreselectedService(service);
    setIsBookingWizardOpen(true);
  };

  // Real-time listeners for Firestore
  useEffect(() => {
    // We can always listen to technicians and reviews (public read rules)
    const unsubTechs = onSnapshot(collection(db, 'technicians'), (snapshot) => {
      const techs: Technician[] = [];
      snapshot.forEach((doc) => techs.push({ id: doc.id, ...doc.data() } as Technician));
      if (techs.length >= 0) {
        setTechnicians(techs);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'technicians');
    });

    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      const revs: CustomerReview[] = [];
      snapshot.forEach((doc) => revs.push({ id: doc.id, ...doc.data() } as CustomerReview));
      if (revs.length >= 0) {
        setReviews(revs);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'reviews');
    });

    let unsubBookings = () => {};
    let unsubTickets = () => {};

    if (currentUser) {
      // For Admin, read all bookings and tickets. For customers, read only theirs.
      const bookingsQuery = currentRole === 'admin' 
        ? collection(db, 'bookings') 
        : query(collection(db, 'bookings'), where('customerId', '==', currentUser.uid));

      unsubBookings = onSnapshot(bookingsQuery, (snapshot) => {
        const bks: Booking[] = [];
        snapshot.forEach((doc) => bks.push({ id: doc.id, ...doc.data() } as Booking));
        if (bks.length >= 0) {
          bks.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
          });
          setBookings(bks); 
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'bookings');
      });

      const ticketsQuery = currentRole === 'admin'
        ? collection(db, 'supportTickets')
        : query(collection(db, 'supportTickets'), where('customerId', '==', currentUser.uid));

      unsubTickets = onSnapshot(ticketsQuery, (snapshot) => {
        const tks: SupportTicket[] = [];
        snapshot.forEach((doc) => tks.push({ id: doc.id, ...doc.data() } as SupportTicket));
        if (tks.length >= 0) {
          setSupportTickets(tks);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'supportTickets');
      });
    }

    return () => {
      unsubBookings();
      unsubTechs();
      unsubTickets();
      unsubReviews();
    };
  }, [currentUser, currentRole]);

  // Handle Booking Creation by customer (appears immediately on Admin Dashboard)
  const handleBookingConfirmed = async (newBooking: Booking) => {
    const freshBooking: Booking = {
      ...newBooking,
      status: 'booking_received',
    };
    try {
      await setDoc(doc(db, 'bookings', freshBooking.id), freshBooking);
      setActiveTrackBookingId(freshBooking.id);
      
      // Send WhatsApp Notification only if database save was successful
      const adminPhone = "918563975583";
      const message = `*New Repair Booking!* 🛠️\n\n*ID:* ${freshBooking.bookingId}\n*Name:* ${freshBooking.customerName}\n*Phone:* ${freshBooking.customerPhone}\n*Device:* ${freshBooking.brand} ${freshBooking.model}\n*Issue:* ${(freshBooking.problems || []).join(', ')}\n*Address:* ${freshBooking.address}, ${freshBooking.area}\n\nPlease confirm my booking!`;
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
    } catch (err) {
      console.error('Failed to create booking in Firestore', err);
      alert("Failed to save your booking to the database! Please ensure your Firestore Database is enabled in the Firebase Console.");
    }
  };

  // Admin Confirms Booking and assigns Piyush
  const handleConfirmBooking = async (bookingId: string) => {
    if (!bookingId) return;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'booking_confirmed',
        technicianId: 'tech_1',
        technicianName: 'Piyush',
        technicianPhone: '+91 85639 75583',
        technicianRating: 4.9,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Update Status of a Booking
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    if (!bookingId) return;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Update Estimated Price
  const handleUpdateEstimatedPrice = async (bookingId: string, estimatedPrice: number) => {
    if (!bookingId) return;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        estimatedPrice,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Customer Approves or Rejects Quotation
  const handleApproveQuotation = async (approved: boolean) => {
    if (!activeTrackBookingId) return;
    const b = bookings.find(x => x.id === activeTrackBookingId);
    if (!b) return;
    try {
      await updateDoc(doc(db, 'bookings', activeTrackBookingId), {
        quotationStatus: approved ? 'approved' : 'rejected',
        status: approved ? 'repair_started' : 'booking_closed',
        finalPrice: approved && b.quotation ? b.quotation.finalTotal : b.estimatedPrice,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Payment Completion
  const handlePaymentComplete = async (method: PaymentMethod) => {
    if (!activeTrackBookingId) return;
    try {
      await updateDoc(doc(db, 'bookings', activeTrackBookingId), {
        paymentStatus: 'paid',
        paymentMethod: method,
        status: 'payment_completed',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Technician Submits Quotation
  const handleSubmitQuotation = async (bookingId: string, quotation: RepairQuotation) => {
    if (!bookingId) return;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        quotation,
        quotationStatus: 'pending',
        finalPrice: quotation.finalTotal,
        status: 'device_inspection',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Assigns Technician
  const handleAssignTechnician = async (bookingId: string, technicianId: string) => {
    if (!bookingId) return;
    const tech = technicians.find((t) => t.id === technicianId);
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        technicianId,
        technicianName: tech ? tech.name : 'Assigned Technician',
        technicianPhone: tech ? tech.phone : '+91 94520 88219',
        technicianPhoto: tech ? tech.photo : null,
        technicianRating: tech ? tech.rating : 4.8,
        status: 'technician_assigned',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Toggles Technician Active Status
  const handleToggleTechnicianStatus = async (techId: string) => {
    const tech = technicians.find((t) => t.id === techId);
    if (!tech) return;
    try {
      await updateDoc(doc(db, 'technicians', techId), {
        isActive: !tech.isActive,
        isAvailable: !tech.isActive,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Add Customer Review
  const handleAddReview = async (newReview: Omit<CustomerReview, 'id' | 'date'>) => {
    const id = `rev_${Date.now()}`;
    const created: CustomerReview = {
      ...newReview,
      id,
      date: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'reviews', id), created);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Support Ticket
  const handleSubmitSupportTicket = async (
    ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>
  ) => {
    const id = `ticket_${Date.now()}`;
    const newTicket: SupportTicket = {
      ...ticketData,
      id,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'supportTickets', id), newTicket);
    } catch (err) {
      console.error(err);
    }
  };

  // Search for Booking to Track
  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackSearchInput.trim().toUpperCase();
    const found = bookings.find(
      (b) => b.bookingId.toUpperCase() === query || b.customerPhone.includes(query)
    );
    if (found) {
      setActiveTrackBookingId(found.id);
      setActiveTab('track');
      setTrackNotFound(false);
      setTrackSearchInput('');
    } else {
      setTrackNotFound(true);
    }
  };

  const userBookings = currentUser 
    ? bookings.filter(b => b.customerId === currentUser.uid).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  const currentTrackBooking =
    bookings.find((b) => b.id === activeTrackBookingId) || (userBookings.length > 0 ? userBookings[0] : bookings[0]);

  // When clicking a user booking in a list (we'll add a list UI)
  const handleSelectUserBooking = (id: string) => {
    setActiveTrackBookingId(id);
    setActiveTab('track');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white pb-16 lg:pb-0">
      {/* Top Main Navigation */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={(role) => {
          setCurrentRole(role);
          if (role === 'admin') setActiveTab('admin');
          else setActiveTab('home');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
        onOpenProfile={() => setActiveTab('track')}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        onOpenSeoPages={() => setIsSeoModalOpen(true)}
        currentUser={currentUser}
        unconfirmedCount={unconfirmedCount}
      />

      {/* Main View Render Based on activeTab and role */}
      <main className="flex-1">
        {/* CUSTOMER HOME VIEW */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Section */}
            <HeroSection
              onBookRepair={handleOpenBooking}
              onOpenEstimate={() => handleOpenBooking()}
            />

            {/* Service Categories */}
            <ServiceCategories
              onSelectService={(service) => handleOpenBooking(undefined, service)}
            />

            {/* Brands and Models Grid */}
            <BrandsGrid
              onSelectBrand={(brand, model) => handleOpenBooking(brand, model)}
            />

            {/* Why Choose Us */}
            <WhyChooseUs />

            {/* Verified Reviews Section */}
            <ReviewsSection reviews={reviews} onAddReview={handleAddReview} />

            {/* Local Sitapur Coverage Banner */}
            <section className="py-12 bg-white border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-blue-500/30 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30">
                      <MapPin className="w-3.5 h-3.5 text-blue-300" />
                      <span>Doorstep Coverage Across Sitapur</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black">
                      We Serve Every Street & Colony in Sitapur
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
                      Civil Lines • Station Road • Khairabad • Awas Vikas • Subhash Nagar • Lalbagh
                      • Eye Hospital Road • Kotwali Area • Transport Nagar • Bus Stand
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => handleOpenBooking()}
                      className="bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <Wrench className="w-4 h-4 text-blue-600" />
                      <span>Book a Repair Now</span>
                    </button>
                    <button
                      onClick={() => setIsSeoModalOpen(true)}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-3.5 rounded-xl border border-white/20 transition cursor-pointer"
                    >
                      View Local Directories
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TRACK ORDER VIEW */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
              {currentUser && userBookings.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800 text-sm">Your Recent Bookings</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {userBookings.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleSelectUserBooking(b.id)}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${
                          currentTrackBooking?.id === b.id ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-sm text-slate-800">
                            {b.bookingId} <span className="text-slate-400 font-normal ml-1">({b.brand} {b.model})</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{b.appointmentDate} • {b.status.replace(/_/g, ' ')}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Booking Bar */}
              <form
                onSubmit={handleTrackSearch}
                className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="flex items-center gap-2 flex-1 w-full pl-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter Booking ID (e.g. SMC-2026-000123) or Mobile Number..."
                    value={trackSearchInput}
                    onChange={(e) => setTrackSearchInput(e.target.value)}
                    className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Track Order
                </button>
              </form>

              {trackNotFound && (
                <p className="text-xs text-red-600 font-semibold mt-2 pl-2">
                  No booking found with that ID or Phone. Showing most recent active booking below:
                </p>
              )}
            </div>

            {currentTrackBooking && (
              <BookingTracker
                booking={currentTrackBooking}
                onUpdateStatus={(newStatus) =>
                  handleUpdateBookingStatus(currentTrackBooking.id, newStatus)
                }
                onApproveQuotation={handleApproveQuotation}
                onPaymentComplete={handlePaymentComplete}
                onOpenInvoice={() => setInvoiceBooking(currentTrackBooking)}
                onOpenNewBooking={() => handleOpenBooking()}
              />
            )}
          </div>
        )}

        {/* ADMIN CONSOLE VIEW */}
        {activeTab === 'admin' && (
          <AdminDashboard
            bookings={bookings}
            technicians={technicians}
            supportTickets={supportTickets}
            onAssignTechnician={handleAssignTechnician}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateEstimatedPrice={handleUpdateEstimatedPrice}
            onToggleTechnicianStatus={handleToggleTechnicianStatus}
            onConfirmBooking={handleConfirmBooking}
            onOpenNewBooking={() => handleOpenBooking()}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                PMC
              </div>
              <span className="font-extrabold text-white text-sm">PIYUSH SITAPUR MOBILE CARE</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Sitapur's trusted on-demand smartphone repair service. Professional technician arrives
              at your doorstep with genuine parts and free diagnosis.
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold">
              ✓ 100% Data Privacy • Doorstep Repair in Front of You
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Popular Repairs
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => handleOpenBooking(undefined, 'Screen Replacement')}
                  className="hover:text-white transition"
                >
                  Screen Replacement in Sitapur
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenBooking(undefined, 'Battery Replacement')}
                  className="hover:text-white transition"
                >
                  Battery Replacement in Sitapur
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenBooking(undefined, 'Charging Problem')}
                  className="hover:text-white transition"
                >
                  Charging Port Repair
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenBooking(undefined, 'Camera Repair')}
                  className="hover:text-white transition"
                >
                  Camera Lens & Sensor Repair
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenBooking(undefined, 'Water Damage')}
                  className="hover:text-white transition"
                >
                  Water Damage Micro-Soldering
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Sitapur Service Localities
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Civil Lines (261001)</li>
              <li>Station Road Market (261001)</li>
              <li>Khairabad Road (261111)</li>
              <li>Awas Vikas Colony (261001)</li>
              <li>Subhash Nagar & Lalbagh (261001)</li>
              <li>Eye Hospital Road (261001)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Helpline & Emergency
            </h4>
            <p className="text-slate-400">
              Dispatched from Police Line Subhash Nagar, Sitapur, UP
            </p>
            <div className="space-y-2">
              <a
                href="tel:+918563975583"
                className="flex items-center gap-2 text-white font-semibold hover:text-blue-400"
              >
                <Phone className="w-4 h-4 text-blue-500" />
                <span>+91 85639 75583</span>
              </a>
              <a
                href="https://wa.me/918563975583?text=Hi%20Piyush%20Sitapur%20Mobile%20Care,%20I%20want%20to%20book%20a%20doorstep%20repair"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white font-semibold hover:text-emerald-400"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <span>WhatsApp: +91 85639 75583</span>
              </a>
            </div>
            <button
              onClick={() => setIsSeoModalOpen(true)}
              className="text-blue-400 text-xs font-semibold hover:underline flex items-center gap-1 mt-2"
            >
              <span>Explore All Local Directories</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© 2026 Piyush Sitapur Mobile Care. All rights reserved. “Mobile Repair at Your Doorstep”.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSupportModalOpen(true)} className="hover:text-slate-300">
              Terms & Warranty
            </button>
            <button onClick={() => setIsSupportModalOpen(true)} className="hover:text-slate-300">
              Privacy Policy
            </button>
            <button onClick={() => setIsSeoModalOpen(true)} className="hover:text-slate-300">
              SEO Landing Pages
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile-First Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        currentRole={currentRole}
        unconfirmedCount={unconfirmedCount}
      />

      {/* MODAL 1: 8-Step Booking Wizard */}
      <BookingWizard
        isOpen={isBookingWizardOpen}
        currentUser={currentUser}
        onClose={() => {
          setIsBookingWizardOpen(false);
          setWizardPreselectedBrand(undefined);
          setWizardPreselectedService(undefined);
        }}
        onBookingConfirmed={handleBookingConfirmed}
        initialBrand={wizardPreselectedBrand}
        initialModelOrService={wizardPreselectedService}
      />

      {/* MODAL 2: Digital Invoice / Warranty Certificate */}
      {invoiceBooking && (
        <DigitalInvoiceModal
          booking={invoiceBooking}
          isOpen={Boolean(invoiceBooking)}
          onClose={() => setInvoiceBooking(null)}
        />
      )}

      {/* MODAL 3: Customer Support & Tickets */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onSubmitTicket={handleSubmitSupportTicket}
      />

      {/* MODAL 4: Localized SEO Landing Pages */}
      <SeoPagesModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
        onBookNow={handleOpenBooking}
      />
    </div>
  );
}
