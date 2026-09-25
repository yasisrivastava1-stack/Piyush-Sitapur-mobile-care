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
import { CancelBookingModal } from './components/CancelBookingModal';
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
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  Smartphone,
  X,
  Plus,
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
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  // Track search query
  const [trackSearchInput, setTrackSearchInput] = useState<string>('');
  const [trackNotFound, setTrackNotFound] = useState<boolean>(false);

  // Handle Opening Booking Wizard
  const handleOpenBooking = async (brand?: string, service?: string) => {
    if (!currentUser) {
      try {
        const user = await signInWithGoogle();
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
  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: BookingStatus,
    cancelReason?: string
  ) => {
    if (!bookingId) return;
    try {
      const updateData: any = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      if (newStatus === 'cancelled') {
        updateData.cancelledAt = new Date().toISOString();
        if (cancelReason) {
          updateData.cancelReason = cancelReason;
        }
      } else if (
        newStatus === 'technician_assigned' ||
        newStatus === 'technician_on_the_way' ||
        newStatus === 'technician_arrived' ||
        newStatus === 'device_inspection' ||
        newStatus === 'repair_started'
      ) {
        const currentBooking = bookings.find((b) => b.id === bookingId);
        if (!currentBooking?.technicianName) {
          const defaultTech = technicians[0] || {
            id: 'tech_1',
            name: 'Piyush',
            phone: '+91 85639 75583',
            rating: 4.9,
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          };
          updateData.technicianId = defaultTech.id;
          updateData.technicianName = defaultTech.name;
          updateData.technicianPhone = defaultTech.phone;
          updateData.technicianRating = defaultTech.rating || 4.9;
          if (defaultTech.photo) updateData.technicianPhoto = defaultTech.photo;
        }
      }
      await updateDoc(doc(db, 'bookings', bookingId), updateData);
    } catch (err) {
      console.error('Failed to update booking status in Firestore', err);
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
    const tech = technicians.find((t) => t.id === technicianId) || technicians[0];
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        technicianId: tech ? tech.id : 'tech_1',
        technicianName: tech ? tech.name : 'Piyush',
        technicianPhone: tech ? tech.phone : '+91 85639 75583',
        technicianPhoto: tech ? tech.photo : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        technicianRating: tech ? tech.rating : 4.9,
        status: 'technician_assigned',
        updatedAt: new Date().toISOString(),
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

  // Admin Adds New Technician
  const handleAddTechnician = async (newTech: Omit<Technician, 'id'>) => {
    const id = `tech_${Date.now()}`;
    const created: Technician = {
      ...newTech,
      id,
    };
    try {
      await setDoc(doc(db, 'technicians', id), created);
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

        {/* TRACK ORDER & CUSTOMER DASHBOARD VIEW */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
              {/* Notification Banner when cancelled */}
              {cancelSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold">{cancelSuccessMsg}</span>
                  </div>
                  <button
                    onClick={() => setCancelSuccessMsg(null)}
                    className="p-1 text-emerald-700 hover:text-emerald-900 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Customer Dashboard Hero Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                      Customer Dashboard
                    </span>
                    <span className="text-xs text-slate-400">Sitapur Hub</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    {currentUser
                      ? `Welcome, ${currentUser.displayName || currentUser.email?.split('@')[0] || 'Customer'}`
                      : 'Track Your Repair Order'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage your doorstep repair bookings, track live technician visits, or cancel bookings anytime.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenBooking()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book New Repair</span>
                  </button>
                </div>
              </div>

              {/* Logged in User Bookings Section */}
              {currentUser && userBookings.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                        Your Doorstep Bookings ({userBookings.length})
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        View live status or cancel any pending booking with zero fees.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-semibold border border-blue-200">
                        {userBookings.filter(
                          (b) =>
                            b.status !== 'cancelled' &&
                            b.status !== 'repair_completed' &&
                            b.status !== 'payment_completed' &&
                            b.status !== 'booking_closed'
                        ).length}{' '}
                        Active
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-semibold border border-emerald-200">
                        {userBookings.filter(
                          (b) =>
                            b.status === 'repair_completed' ||
                            b.status === 'payment_completed' ||
                            b.status === 'booking_closed'
                        ).length}{' '}
                        Completed
                      </span>
                      <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 rounded-full font-semibold border border-rose-200">
                        {userBookings.filter((b) => b.status === 'cancelled').length} Cancelled
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {userBookings.map((b) => {
                      const isSelected = currentTrackBooking?.id === b.id;
                      const isCancellable =
                        b.status !== 'cancelled' &&
                        b.status !== 'repair_completed' &&
                        b.status !== 'payment_completed' &&
                        b.status !== 'booking_closed';

                      const isTechAssigned =
                        Boolean(b.technicianName) ||
                        Boolean(b.technicianId) ||
                        [
                          'technician_assigned',
                          'technician_on_the_way',
                          'technician_arrived',
                          'device_inspection',
                          'repair_started',
                          'repair_completed',
                          'payment_completed',
                          'booking_closed',
                        ].includes(b.status);

                      const techName = b.technicianName || 'Piyush';
                      const techPhone = b.technicianPhone || '+91 85639 75583';
                      const cleanPhone = techPhone.replace(/[^0-9]/g, '');

                      return (
                        <div
                          key={b.id}
                          className={`p-4 sm:p-5 transition hover:bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isSelected ? 'bg-blue-50/50 border-l-4 border-blue-600' : ''
                          }`}
                        >
                          <div
                            className="space-y-1.5 flex-1 cursor-pointer"
                            onClick={() => handleSelectUserBooking(b.id)}
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-sm text-blue-700">
                                {b.bookingId}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                  b.status === 'cancelled'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : b.status === 'repair_completed' ||
                                      b.status === 'payment_completed' ||
                                      b.status === 'booking_closed'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}
                              >
                                {b.status.replace(/_/g, ' ')}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                                  Viewing Live Below
                                </span>
                              )}
                            </div>

                            <div className="text-xs sm:text-sm font-semibold text-slate-800">
                              {b.brand} {b.model} •{' '}
                              <span className="text-slate-600 font-normal">
                                {b.problems?.join(', ') || 'Doorstep Diagnostic'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {b.appointmentDate} ({b.appointmentSlot})
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {b.area || 'Sitapur'}
                              </span>
                              <span className="font-semibold text-emerald-700">
                                ₹{b.finalPrice || b.estimatedPrice}
                              </span>
                            </div>

                            {/* Assigned Technician Contact Box after technician assigning */}
                            {isTechAssigned ? (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="mt-2.5 p-3 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-50/50 rounded-2xl border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="relative shrink-0">
                                    <img
                                      src={
                                        b.technicianPhoto ||
                                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                                      }
                                      alt={techName}
                                      className="w-10 h-10 rounded-xl object-cover border-2 border-blue-400/40 shadow-xs"
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                        Doorstep Technician Assigned
                                      </span>
                                      <span className="text-[11px] font-bold text-amber-600">
                                        ★ {b.technicianRating || 4.9}
                                      </span>
                                    </div>
                                    <div className="text-sm font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                                      <span>Technician:</span>
                                      <span className="text-blue-900 font-black">{techName}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-mono mt-0.5">
                                      <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                      <span className="text-slate-500 font-sans">Mobile:</span>
                                      <a
                                        href={`tel:${techPhone.replace(/\s+/g, '')}`}
                                        className="font-extrabold text-slate-900 hover:text-blue-700 hover:underline"
                                      >
                                        {techPhone}
                                      </a>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                                  <a
                                    href={`tel:${techPhone.replace(/\s+/g, '')}`}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                    title={`Call ${techName}`}
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>Call Technician</span>
                                  </a>
                                  <a
                                    href={`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
                                      techName
                                    )},%20I%20am%20tracking%20my%20repair%20booking%20${b.bookingId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition cursor-pointer"
                                    title="WhatsApp technician"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>WhatsApp</span>
                                  </a>
                                </div>
                              </div>
                            ) : (
                              b.status !== 'cancelled' && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-amber-800 bg-amber-50/90 px-3 py-1.5 rounded-xl border border-amber-200/80 w-fit">
                                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin shrink-0" />
                                  <span className="font-medium">Sitapur Hub is currently assigning your doorstep technician...</span>
                                </div>
                              )
                            )}

                            {b.status === 'cancelled' && b.cancelReason && (
                              <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-100 inline-block mt-1">
                                <strong>Reason for cancellation:</strong> {b.cancelReason}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons for Each Booking Card */}
                          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSelectUserBooking(b.id)}
                              className={`px-3 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              <span>Track Status</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            {isCancellable && (
                              <button
                                type="button"
                                id={`cancel-booking-btn-${b.bookingId}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBookingToCancel(b);
                                }}
                                className="px-3 py-2 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                title="Cancel this repair booking"
                              >
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Cancel Booking</span>
                              </button>
                            )}

                            {b.status === 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => handleOpenBooking(b.brand, b.model)}
                                className="px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Book Again</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentUser && userBookings.length === 0 && (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No Repair Bookings Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    You don't have any bookings registered under your account yet. Need your smartphone or laptop fixed at your doorstep in Sitapur?
                  </p>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Book Doorstep Repair</span>
                  </button>
                </div>
              )}

              {!currentUser && (
                <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-sm font-bold text-blue-900">Sign in to view your Customer Dashboard</h3>
                    <p className="text-xs text-blue-700">
                      Sign in to see all your bookings, active status, digital invoices, and cancel bookings anytime.
                    </p>
                  </div>
                  <button
                    onClick={() => signInWithGoogle()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                  >
                    Sign In with Google
                  </button>
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
                    placeholder="Track by Booking ID (e.g. SMC-2026-000123) or Mobile Number..."
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
                <p className="text-xs text-red-600 font-semibold pl-2">
                  No booking found with that ID or Phone. Showing most recent active booking below:
                </p>
              )}
            </div>

            {currentTrackBooking && (
              <BookingTracker
                booking={currentTrackBooking}
                onUpdateStatus={(newStatus, cancelReason) =>
                  handleUpdateBookingStatus(currentTrackBooking.id, newStatus, cancelReason)
                }
                onApproveQuotation={handleApproveQuotation}
                onPaymentComplete={handlePaymentComplete}
                onOpenInvoice={() => setInvoiceBooking(currentTrackBooking)}
                onOpenNewBooking={() => handleOpenBooking()}
                onCancelBooking={(b) => setBookingToCancel(b)}
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
            onAddTechnician={handleAddTechnician}
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
          <p>© 2026 Piyush Sitapur Mobile & Laptop Care. All rights reserved. “Mobile & Laptop Repair at Your Doorstep”.</p>
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

      {/* MODAL 5: Customer Cancel Booking In-App Modal */}
      <CancelBookingModal
        isOpen={Boolean(bookingToCancel)}
        onClose={() => setBookingToCancel(null)}
        booking={bookingToCancel}
        onConfirmCancel={async (bookingId, reason) => {
          await handleUpdateBookingStatus(bookingId, 'cancelled', reason);
          setCancelSuccessMsg(
            `Booking ${bookingToCancel?.bookingId || ''} has been successfully cancelled.`
          );
          setBookingToCancel(null);
        }}
      />
    </div>
  );
}
