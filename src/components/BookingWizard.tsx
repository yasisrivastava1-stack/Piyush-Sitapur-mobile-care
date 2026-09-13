import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Upload,
  Camera,
  MapPin,
  Calendar,
  Clock,
  ShieldAlert,
  Search,
  Check,
  Smartphone,
  Info,
  Sparkles,
  Phone,
  Crosshair,
  MessageSquare,
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  SITAPUR_BRANDS,
  SERVICE_PROBLEMS,
  SERVICEABLE_AREAS,
  VALID_PINCODES,
  SITAPUR_REPAIR_SERVICES,
} from '../data/sitapurData';
import { Booking, BookingStatus, PaymentStatus } from '../types';

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirmed: (newBooking: Booking) => void;
  initialBrand?: string;
  initialModelOrService?: string;
  currentUser: FirebaseUser | null;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen,
  onClose,
  onBookingConfirmed,
  initialBrand,
  initialModelOrService,
  currentUser,
}) => {
  // Step tracker (1 to 8)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [modelSearchQuery, setModelSearchQuery] = useState<string>('');
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Step 5: Location
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [alternatePhone, setAlternatePhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('Civil Lines');
  const [pincode, setPincode] = useState<string>('261001');
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  // Geolocation State
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');

  // Step 6: Date & Slot
  const [appointmentDate, setAppointmentDate] = useState<string>('Today');
  const [appointmentSlot, setAppointmentSlot] = useState<string>('12:00 PM – 3:00 PM');

  // Coupon code in step 7
  const [couponCode, setCouponCode] = useState<string>('SITAPUR100');
  const [couponApplied, setCouponApplied] = useState<boolean>(true);

  // Booking result after step 8
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Pre-fill brand or service if passed in
  useEffect(() => {
    if (initialBrand) {
      setSelectedBrand(initialBrand);
      setCurrentStep(2);
    }
    if (initialModelOrService) {
      // Check if it matches a service problem
      const matchedProb = SERVICE_PROBLEMS.find((p) =>
        p.toLowerCase().includes(initialModelOrService.toLowerCase())
      );
      if (matchedProb) {
        setSelectedProblems([matchedProb]);
      } else {
        setModelSearchQuery(initialModelOrService);
      }
    }
  }, [initialBrand, initialModelOrService]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName) setCustomerName(currentUser.displayName);
      if (currentUser.phoneNumber) setCustomerPhone(currentUser.phoneNumber);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Selected brand object
  const brandObj = SITAPUR_BRANDS.find((b) => b.name === selectedBrand);

  // Models filtered by search
  const filteredModels = brandObj
    ? brandObj.popularModels.filter((m) =>
        m.toLowerCase().includes(modelSearchQuery.toLowerCase())
      )
    : [];

  // Pincode validation helper
  const handlePincodeChange = (val: string) => {
    setPincode(val);
    if (val.length === 6) {
      if (VALID_PINCODES.includes(val)) {
        setPincodeError(null);
      } else {
        setPincodeError('Sorry, doorstep service is currently unavailable in your area.');
      }
    } else {
      setPincodeError(null);
    }
  };

  // Toggle problem checkbox
  const toggleProblem = (prob: string) => {
    if (selectedProblems.includes(prob)) {
      setSelectedProblems(selectedProblems.filter((p) => p !== prob));
    } else {
      setSelectedProblems([...selectedProblems, prob]);
    }
  };

  // Price Calculation Logic
  const calculatePricing = () => {
    let partsCost = 0;
    let technicianCharge = 299;
    const visitCharge = 0; // Free visit promo in Sitapur
    const discount = couponApplied ? 100 : 0;

    selectedProblems.forEach((prob) => {
      if (prob.includes('Screen') || prob.includes('Display')) {
        partsCost += 1800;
        technicianCharge += 250;
      } else if (prob.includes('Battery')) {
        partsCost += 850;
        technicianCharge += 150;
      } else if (prob.includes('Charging')) {
        partsCost += 400;
        technicianCharge += 150;
      } else if (prob.includes('Camera')) {
        partsCost += 750;
        technicianCharge += 200;
      } else if (prob.includes('Water Damage')) {
        partsCost += 600;
        technicianCharge += 300;
      } else if (prob.includes('Back Glass')) {
        partsCost += 650;
        technicianCharge += 150;
      } else {
        partsCost += 350;
        technicianCharge += 150;
      }
    });

    if (partsCost === 0) {
      partsCost = 950;
    }

    const totalEstimated = Math.max(299, partsCost + technicianCharge + visitCharge - discount);

    return {
      repairService: selectedProblems.join(', ') || 'General Diagnostics',
      partsCost,
      technicianCharge,
      visitCharge,
      discount,
      totalEstimated,
    };
  };

  const pricing = calculatePricing();

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        newUrls.push(URL.createObjectURL(files[i]));
      }
      setUploadedPhotos([...uploadedPhotos, ...newUrls]);
    }
  };

  const addSampleDamagedPhoto = () => {
    setUploadedPhotos([
      ...uploadedPhotos,
      'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?w=400&auto=format&fit=crop&q=80',
    ]);
  };

  // GPS Current Location
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setLocationError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(data => {
              setIsLocating(false);
              if (data && data.display_name) {
                // Create a cleaner address string
                let cleanAddress = data.display_name;
                if (data.address) {
                  const parts = [];
                  if (data.address.road) parts.push(data.address.road);
                  if (data.address.suburb) parts.push(data.address.suburb);
                  if (data.address.neighbourhood) parts.push(data.address.neighbourhood);
                  if (data.address.city_district) parts.push(data.address.city_district);
                  if (data.address.city || data.address.town) parts.push(data.address.city || data.address.town);
                  if (parts.length > 0) {
                    cleanAddress = parts.join(', ');
                  }
                }
                
                setAddress(cleanAddress);
                
                if (data.address && data.address.postcode) {
                  const pc = data.address.postcode;
                  setPincode(pc);
                  if (VALID_PINCODES.includes(pc)) {
                    setPincodeError(null);
                  } else {
                    setPincodeError('You seem to be outside our Sitapur service area. Please manually enter a valid Sitapur pincode (e.g., 261001) for testing.');
                  }
                }
                
                const possibleArea = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || data.address?.town || data.address?.city;
                if (possibleArea) {
                  const matchedArea = SERVICEABLE_AREAS.find(a => a.name.toLowerCase().includes(possibleArea.toLowerCase()) || possibleArea.toLowerCase().includes(a.name.toLowerCase()));
                  if (matchedArea) {
                    setSelectedArea(matchedArea.name);
                  } else {
                     // Default to a central area if we are in Sitapur but no exact match
                     setSelectedArea('Sitapur City / Chowk');
                  }
                }
              } else {
                setAddress(`GPS Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
              }
            })
            .catch(() => {
              setIsLocating(false);
              setAddress(`GPS Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
            });
        },
        (err) => {
          setIsLocating(false);
          setLocationError('Failed to get location. Please type your exact address manually.');
        },
        { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
      );
    } else {
      setIsLocating(false);
      setLocationError('Geolocation not supported by browser.');
    }
  };

  // Submit Step 8 -> Generate Booking ID
  const handleFinalConfirm = () => {
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `SMC-2026-${randNum}`;

    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      bookingId,
      customerId: currentUser?.uid || `guest_${Date.now()}`,
      customerName: customerName || 'Sitapur Customer',
      customerPhone: customerPhone || '+91 85639 75583',
      alternatePhone,
      brand: selectedBrand || 'Smartphone',
      model: selectedModel || 'Selected Model',
      problems: selectedProblems.length > 0 ? selectedProblems : ['General Inspection'],
      problemDescription,
      photos: uploadedPhotos,
      address: address || 'Sitapur Main Road',
      landmark,
      area: selectedArea,
      pincode,
      ...(latitude !== undefined ? { latitude } : {}),
      ...(longitude !== undefined ? { longitude } : {}),
      appointmentDate,
      appointmentSlot,
      estimatedPrice: 0,
      status: 'booking_received',
      paymentStatus: 'pending',
      technicianId: 'tech_1',
      technicianName: 'Piyush',
      technicianPhone: '+91 85639 75583',
      technicianRating: 4.9,
      technicianPhoto:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setConfirmedBooking(newBooking);
    onBookingConfirmed(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header with Steps Tracker */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/30 text-blue-100 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-400/30">
                Urban Company Style Doorstep Booking
              </span>
              <span className="text-xs text-blue-200">Sitapur Hub</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold mt-1 tracking-tight">
              {confirmedBooking
                ? 'Booking Successfully Confirmed!'
                : `Step ${currentStep} of 7: ${
                    currentStep === 1
                      ? 'Select Mobile Brand'
                      : currentStep === 2
                      ? 'Select Mobile Model'
                      : currentStep === 3
                      ? 'Select Phone Problem'
                      : currentStep === 4
                      ? 'Upload Phone Photos'
                      : currentStep === 5
                      ? 'Service Location in Sitapur'
                      : currentStep === 6
                      ? 'Select Date & Time Slot'
                      : 'Price Estimate & Confirm'
                  }`}
            </h2>
          </div>

          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {!confirmedBooking && (
          <div className="w-full bg-slate-100 h-1.5 shrink-0">
            <div
              className="bg-blue-600 h-1.5 transition-all duration-300"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* SUCCESS SCREEN AFTER STEP 8 */}
          {confirmedBooking ? (
            <div className="text-center py-4 space-y-5 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Your repair request has been successfully booked!
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  A verified Sitapur doorstep technician has been notified and will call you prior to arrival.
                </p>
              </div>

              {/* Booking Details Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Booking Reference ID
                    </span>
                    <p className="text-base font-black text-blue-700 font-mono tracking-wider">
                      {confirmedBooking.bookingId}
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    Booking Received
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Smartphone</span>
                    <span className="font-bold text-slate-800">
                      {confirmedBooking.brand} {confirmedBooking.model}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Doorstep Inspection</span>
                    <span className="font-bold text-slate-800 text-emerald-700">
                      FREE (Pay only for parts after repair)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Appointment</span>
                    <span className="font-bold text-slate-800">
                      {confirmedBooking.appointmentDate}, {confirmedBooking.appointmentSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Service Area</span>
                    <span className="font-bold text-slate-800">
                      {confirmedBooking.area} ({confirmedBooking.pincode})
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium block">Doorstep Address</span>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {confirmedBooking.address}, {confirmedBooking.landmark}
                  </p>
                </div>

                {/* Assigned Technician Preview */}
                {confirmedBooking.technicianName && (
                  <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={confirmedBooking.technicianPhoto}
                        alt="Technician"
                        className="w-10 h-10 rounded-full object-cover border border-blue-300"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-900">
                            {confirmedBooking.technicianName}
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                            Lead Specialist
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Piyush Sitapur Mobile Care ({confirmedBooking.technicianRating} ★)
                        </p>
                      </div>
                    </div>
                    <a
                      href={`tel:${confirmedBooking.technicianPhone}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/918563975583?text=${encodeURIComponent(`*New Repair Booking!* 🛠️\n\n*ID:* ${confirmedBooking.bookingId}\n*Name:* ${confirmedBooking.customerName}\n*Phone:* ${confirmedBooking.customerPhone}\n*Device:* ${confirmedBooking.brand} ${confirmedBooking.model}\n*Issue:* ${confirmedBooking.problems.join(', ')}\n*Address:* ${confirmedBooking.address}, ${confirmedBooking.area}\n\nPlease confirm my booking!`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Notify Admin via WhatsApp
                </a>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    id="success-track-live-btn"
                    onClick={onClose}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
                  >
                    Track Live Status Now
                  </button>
                  <button
                    id="success-book-another-btn"
                    onClick={() => {
                      setConfirmedBooking(null);
                      setCurrentStep(1);
                      setSelectedBrand('');
                      setSelectedModel('');
                      setSelectedProblems([]);
                    }}
                    className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-5 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                  >
                    Book Another Repair
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Select Mobile Brand */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      STEP 1 — Select Mobile Brand
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select your smartphone manufacturer to view exact models and parts availability.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {SITAPUR_BRANDS.map((b) => (
                      <button
                        key={b.id}
                        id={`wizard-brand-${b.id}`}
                        onClick={() => {
                          setSelectedBrand(b.name);
                          setSelectedModel('');
                          setCurrentStep(2);
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center group ${
                          selectedBrand === b.name
                            ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                          {b.logo}
                        </span>
                        <span className="text-xs font-bold text-slate-800 block truncate w-full">
                          {b.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Select Mobile Model */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        STEP 2 — Select {selectedBrand} Model
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Search or pick your exact smartphone model.
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Change Brand
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="wizard-model-search-input"
                      type="text"
                      placeholder={`Search ${selectedBrand} models (e.g. Galaxy S24, iPhone 15, Redmi Note 13...)`}
                      value={modelSearchQuery}
                      onChange={(e) => setModelSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Model Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
                    {filteredModels.map((m) => (
                      <button
                        key={m}
                        id={`wizard-model-${m.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => {
                          setSelectedModel(m);
                          setCurrentStep(3);
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                          selectedModel === m
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span className="truncate">{m}</span>
                        {selectedModel === m && (
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
                        )}
                      </button>
                    ))}

                    {/* Custom model fallback */}
                    <div className="col-span-full pt-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Can't find your model? Enter manually:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter specific model name..."
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="flex-1 p-2 rounded-lg border border-slate-300 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedModel.trim()) setCurrentStep(3);
                            }}
                            className="bg-blue-600 text-white text-xs font-semibold px-3 rounded-lg hover:bg-blue-700 transition"
                          >
                            Proceed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Select Problem */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      STEP 3 — Select Phone Problem(s)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      You can select multiple issues. Our technician will carry parts for all selected issues.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SERVICE_PROBLEMS.map((prob) => {
                      const isSelected = selectedProblems.includes(prob);
                      return (
                        <button
                          key={prob}
                          id={`wizard-prob-${prob.replace(/\s+/g, '-').toLowerCase()}`}
                          onClick={() => toggleProblem(prob)}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-500'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="leading-snug">{prob}</span>
                          <span
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ml-1.5 ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Problem Details (Optional):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="E.g. Phone fell in water yesterday, display shows green vertical lines, touch works partially..."
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Upload Phone Photos */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      STEP 4 — Upload Phone Photos
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload photos of the damaged phone to help our technician bring the exact matching OEM parts.
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-6 h-6" />
                    </div>
                    <label className="block">
                      <span className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer shadow-xs transition inline-block">
                        Choose Photos or Take Picture
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-2">
                      PNG, JPG or JPEG (Max 3 photos)
                    </p>

                    <button
                      type="button"
                      onClick={addSampleDamagedPhoto}
                      className="mt-3 text-xs text-blue-600 hover:underline font-semibold"
                    >
                      + Or Click to Add Sample Damaged Screen Photo for Testing
                    </button>
                  </div>

                  {/* Uploaded previews */}
                  {uploadedPhotos.length > 0 && (
                    <div className="mt-3">
                      <span className="text-xs font-bold text-slate-700 block mb-2">
                        Attached Photos ({uploadedPhotos.length}):
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {uploadedPhotos.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-2xs group"
                          >
                            <img
                              src={url}
                              alt="Damaged phone"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx))
                              }
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-80 hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                    <span>
                      Photo upload is optional. You can proceed even without photos if you don't have another camera handy.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 5: Select Service Location */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        STEP 5 — Select Service Location
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Technician will arrive at this address in Sitapur with all tools & parts.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                        <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
                      </button>
                      <span className="text-[10px] text-slate-400 italic">May be inaccurate on Desktop/Wi-Fi</span>
                    </div>
                  </div>

                  {locationError && (
                    <div className="bg-rose-50 text-rose-600 p-2 rounded-xl text-xs flex items-start gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{locationError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Sunil Kumar Gupta"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="E.g. 94150 12345"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Alternate Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Family or office number"
                        value={alternatePhone}
                        onChange={(e) => setAlternatePhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Sitapur Area / Locality *
                      </label>
                      <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                      >
                        {SERVICEABLE_AREAS.filter((a) => a.isServiceable).map((a) => (
                          <option key={a.id} value={a.name}>
                            {a.name} ({a.pincode})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">
                        Complete Address (House / Flat / Shop / Landmark) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. H.No 44, Near SBI ATM, Civil Lines, Sitapur"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Landmark
                      </label>
                      <input
                        type="text"
                        placeholder="E.g. Behind Gandhi Park / Opp Eye Hospital"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Pincode (Sitapur) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="261001"
                        value={pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Required Unsupported Pincode Error Message */}
                  {pincodeError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span className="font-medium">{pincodeError}</span>
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-600">Initial Serviceable Area:</span>
                    <span className="font-bold text-slate-900">
                      Sitapur City, Civil Lines, Station Rd, Khairabad (261001, 261111)
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 6: Select Date & Time Slot */}
              {currentStep === 6 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      STEP 6 — Select Appointment Date & Time
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Technician will arrive within the selected 3-hour window.
                    </p>
                  </div>

                  {/* Date Selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-2">
                      Preferred Day:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Today', 'Tomorrow', 'Day After Tomorrow'].map((day) => (
                        <button
                          key={day}
                          id={`wizard-date-${day.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setAppointmentDate(day)}
                          className={`p-3 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
                            appointmentDate === day
                              ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Calendar className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                          <span>{day}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Required 4 Slots */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-2">
                      Available Time Slots in Sitapur:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { time: '9:00 AM – 12:00 PM', label: 'Morning Slot' },
                        { time: '12:00 PM – 3:00 PM', label: 'Afternoon Slot' },
                        { time: '3:00 PM – 6:00 PM', label: 'Evening Slot' },
                        { time: '6:00 PM – 9:00 PM', label: 'Late Evening Slot' },
                      ].map((slot) => (
                        <button
                          key={slot.time}
                          id={`wizard-slot-${slot.time.replace(/[:\s–]/g, '-')}`}
                          onClick={() => setAppointmentSlot(slot.time)}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                            appointmentSlot === slot.time
                              ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-500'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] text-slate-400 font-normal block">
                              {slot.label}
                            </span>
                            <span className="font-bold">{slot.time}</span>
                          </div>
                          <Clock
                            className={`w-4 h-4 ${
                              appointmentSlot === slot.time ? 'text-blue-600' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Price Estimate & Summary */}
              {currentStep === 7 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      STEP 7 — Transparent Price Estimate
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Detailed cost breakdown before technician dispatch. No advance payment required.
                    </p>
                  </div>

                  {/* Itemized Pricing Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Selected Device:</span>
                      <span className="font-bold text-slate-900">
                        {selectedBrand} {selectedModel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Repair Service:</span>
                      <span className="font-semibold text-slate-800 text-right">
                        {pricing.repairService}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Doorstep Visit & Inspection:</span>
                      <span className="font-bold text-emerald-600">100% FREE</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Parts & Replacement Estimate:</span>
                      <span className="font-semibold text-slate-800">
                        Honest upfront quote on doorstep
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Advance Payment Needed:</span>
                      <span className="font-bold text-emerald-700">₹0 (Zero Advance)</span>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-sm font-extrabold text-slate-900">
                      <span>Inspection Fee:</span>
                      <span className="text-emerald-600 text-base font-black">FREE (Pay after repair)</span>
                    </div>
                  </div>

                  {/* Exact Required Disclaimer */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-bold block">100% Honest Pricing Guarantee:</span>
                      <span>Technician inspects your device at your doorstep for free. Repair only starts after you approve the exact parts price.</span>
                    </div>
                  </div>

                  {/* Summary of Location & Slot */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Customer:</span>
                      <span className="font-bold text-slate-800">
                        {customerName} ({customerPhone})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Slot:</span>
                      <span className="font-bold text-slate-800">
                        {appointmentDate}, {appointmentSlot}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!confirmedBooking && (
          <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                id="wizard-back-btn"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 7 ? (
              <button
                id="wizard-next-btn"
                onClick={() => {
                  if (currentStep === 1 && !selectedBrand) {
                    setSelectedBrand('Samsung');
                  }
                  if (currentStep === 2 && !selectedModel) {
                    setSelectedModel(
                      brandObj?.popularModels[0] || 'Galaxy S24'
                    );
                  }
                  if (currentStep === 3 && selectedProblems.length === 0) {
                    setSelectedProblems(['Broken Screen']);
                  }
                  if (currentStep === 5 && (!customerName || !customerPhone)) {
                    if (!customerName) setCustomerName('Customer');
                    if (!customerPhone) setCustomerPhone('+91 85639 75583');
                    if (!address) setAddress('Civil Lines Main Road, Sitapur');
                  }
                  setCurrentStep(currentStep + 1);
                }}
                disabled={currentStep === 5 && Boolean(pincodeError)}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="wizard-confirm-booking-btn"
                onClick={handleFinalConfirm}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>CONFIRM DOORSTEP BOOKING</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
