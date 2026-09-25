import React, { useState } from 'react';
import {
  Booking,
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
} from '../types';
import { CancelBookingModal } from './CancelBookingModal';
import {
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertCircle,
  QrCode,
  Check,
  ChevronRight,
  Sparkles,
  Star,
  Navigation,
  Smartphone,
  XCircle,
} from 'lucide-react';

interface BookingTrackerProps {
  booking: Booking;
  onUpdateStatus?: (status: BookingStatus, cancelReason?: string) => void;
  onApproveQuotation?: (approved: boolean) => void;
  onPaymentComplete?: (method: PaymentMethod) => void;
  onOpenInvoice?: () => void;
  onOpenNewBooking?: () => void;
  onCancelBooking?: (booking: Booking) => void;
}

const TIMELINE_STEPS: { key: BookingStatus; label: string; desc: string }[] = [
  { key: 'booking_received', label: 'Booking Received', desc: 'Request registered in Sitapur system' },
  { key: 'booking_confirmed', label: 'Booking Confirmed', desc: 'Confirmed by Admin • Dispatch scheduled' },
  { key: 'technician_assigning', label: 'Technician Assigning', desc: 'Locating closest technician in Sitapur' },
  { key: 'technician_assigned', label: 'Technician Assigned', desc: 'Technician Piyush assigned to your repair' },
  { key: 'technician_on_the_way', label: 'Technician On the Way', desc: 'Technician riding to your doorstep' },
  { key: 'technician_arrived', label: 'Technician Arrived', desc: 'Technician reached your location' },
  { key: 'device_inspection', label: 'Device Inspection', desc: 'Testing touch, display & internal circuits' },
  { key: 'repair_started', label: 'Repair Started', desc: 'Repairing phone in front of customer' },
  { key: 'repair_completed', label: 'Repair Completed', desc: 'Post-repair diagnostic quality checks passed' },
  { key: 'payment_completed', label: 'Payment Completed', desc: 'Payment received & warranty activated' },
  { key: 'booking_closed', label: 'Booking Completed', desc: 'Invoice issued with service warranty' },
];

export const BookingTracker: React.FC<BookingTrackerProps> = ({
  booking,
  onUpdateStatus,
  onApproveQuotation,
  onPaymentComplete,
  onOpenInvoice,
  onOpenNewBooking,
  onCancelBooking,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPayMode, setSelectedPayMode] = useState<PaymentMethod>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Check if booking is in a cancellable state (not yet completed, paid, or closed)
  const isCancellable =
    booking.status !== 'cancelled' &&
    booking.status !== 'repair_completed' &&
    booking.status !== 'payment_completed' &&
    booking.status !== 'booking_closed';

  // Determine current step index
  const currentIndex = TIMELINE_STEPS.findIndex((s) => s.key === booking.status);
  const activeStepIdx = currentIndex === -1 ? 0 : currentIndex;

  // Check if technician is assigned
  const isTechnicianAssigned =
    Boolean(booking.technicianName) ||
    Boolean(booking.technicianId) ||
    [
      'technician_assigned',
      'technician_on_the_way',
      'technician_arrived',
      'device_inspection',
      'repair_started',
      'repair_completed',
      'payment_completed',
      'booking_closed',
    ].includes(booking.status);

  const assignedTechName = booking.technicianName || 'Piyush';
  const assignedTechPhone = booking.technicianPhone || '+91 85639 75583';
  const cleanTechPhone = assignedTechPhone.replace(/[^0-9]/g, '');

  const handlePayNow = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPaymentModal(false);
      if (onPaymentComplete) {
        onPaymentComplete(selectedPayMode);
      }
    }, 1500);
  };

  const handleConfirmCancel = async (bookingId: string, reason: string) => {
    if (onCancelBooking) {
      onCancelBooking(booking);
    } else if (onUpdateStatus) {
      await onUpdateStatus('cancelled', reason);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/30 text-blue-100 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30">
              Live Doorstep Tracking
            </span>
            <span className="text-xs text-blue-200">Sitapur Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1.5 tracking-tight">
            Booking: {booking.bookingId}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            {booking.brand} {booking.model} • {booking.problems.join(', ')}
          </p>

          {/* Assigned Technician Badge in Top Banner */}
          {isTechnicianAssigned && booking.status !== 'cancelled' ? (
            <div className="mt-3 inline-flex flex-wrap items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs text-white border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="font-semibold text-blue-100">Assigned Technician:</span>
              <span className="font-extrabold text-white text-sm">{assignedTechName}</span>
              <span className="text-blue-300">•</span>
              <Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="text-blue-100 font-sans">Mobile:</span>
              <a
                href={`tel:${assignedTechPhone.replace(/\s+/g, '')}`}
                className="font-mono font-bold text-white hover:text-emerald-200 underline"
              >
                {assignedTechPhone}
              </a>
            </div>
          ) : booking.status !== 'cancelled' ? (
            <div className="mt-3 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl text-xs text-blue-100 border border-white/15">
              <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin shrink-0" />
              <span>Sitapur Hub is assigning your doorstep technician...</span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenInvoice && (
            <button
              id="tracker-open-invoice-btn"
              onClick={onOpenInvoice}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Digital Invoice</span>
            </button>
          )}

          {isCancellable && (onUpdateStatus || onCancelBooking) && (
            <button
              id="tracker-cancel-booking-btn"
              onClick={() => setShowCancelModal(true)}
              className="bg-rose-500/20 hover:bg-rose-500/40 text-rose-100 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-rose-400/30 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-300" />
              <span>Cancel Booking</span>
            </button>
          )}

          {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
            <button
              id="tracker-pay-now-btn"
              onClick={() => setShowPaymentModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay ₹{booking.finalPrice || booking.estimatedPrice}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Timeline & Quotation */}
        <div className="lg:col-span-7 space-y-6">
          {booking.status === 'cancelled' && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-2xl shadow-sm mb-6 space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-rose-600" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-bold text-rose-900">Booking Cancelled</h3>
                  <div className="mt-1 text-xs text-rose-700 space-y-1">
                    <p>This repair booking has been cancelled and will not be processed further.</p>
                    {booking.cancelReason && (
                      <p className="bg-rose-100/70 p-2.5 rounded-xl text-rose-900 font-medium">
                        <strong>Reason:</strong> {booking.cancelReason}
                      </p>
                    )}
                    {booking.cancelledAt && (
                      <p className="text-[11px] text-rose-500">
                        Cancelled on:{' '}
                        {new Date(booking.cancelledAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2.5 border-t border-rose-200/60">
                {onOpenNewBooking && (
                  <button
                    onClick={onOpenNewBooking}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Book a New Repair</span>
                  </button>
                )}
                <a
                  href="tel:+918563975583"
                  className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Sitapur Helpline</span>
                </a>
              </div>
            </div>
          )}

          {/* 10-Step Timeline Card */}
          {booking.status !== 'cancelled' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Doorstep Service Timeline</span>
                </h2>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  Step {activeStepIdx + 1} of 10
                </span>
              </div>

            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx < activeStepIdx;
                const isCurrent = idx === activeStepIdx;
                return (
                  <div key={step.key} className="flex items-start gap-4 relative">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                        isPassed
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`text-xs sm:text-sm font-bold ${
                            isCurrent
                              ? 'text-blue-600 font-extrabold'
                              : isPassed
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </h3>
                        {isCurrent && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                            In Progress
                          </span>
                        )}
                        {isPassed && (
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {/* SERVICE DETAILS & ESTIMATE CARD */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <h2 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Service Details & Estimate</span>
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Device:</span>
                <span className="font-bold text-slate-800">{booking.brand} {booking.model}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Reported Issue:</span>
                <span className="font-medium text-slate-800 text-right">{booking.problems.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold items-center mt-1">
                <span className="text-slate-900 text-sm">Estimated Price:</span>
                <span className="text-emerald-700 text-lg">₹{booking.finalPrice || booking.estimatedPrice}</span>
              </div>
              {(!booking.finalPrice && booking.estimatedPrice > 0) && (
                <p className="text-[10px] text-slate-400 mt-1">
                  *This is an estimated rate. Final price may vary after physical inspection by the technician.
                </p>
              )}
            </div>
          </div>

          {/* TECHNICIAN REPAIR ESTIMATE & CUSTOMER APPROVAL CARD */}
          {booking.quotation && (
            <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Technician Inspection Quotation
                    </h3>
                    <p className="text-xs text-slate-500">
                      Final cost estimate generated after physical inspection.
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    booking.quotationStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : booking.quotationStatus === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}
                >
                  {booking.quotationStatus === 'approved'
                    ? 'Customer Approved'
                    : booking.quotationStatus === 'rejected'
                    ? 'Quotation Rejected'
                    : 'Awaiting Your Approval'}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Repair Type:</span>
                  <span className="font-bold text-slate-800">{booking.quotation.repairType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Parts Required:</span>
                  <span className="font-semibold text-slate-800">{booking.quotation.partsRequired}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Parts Cost:</span>
                  <span className="font-semibold text-slate-800">₹{booking.quotation.partsCost}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Labour / Service Charge:</span>
                  <span className="font-semibold text-slate-800">₹{booking.quotation.labourCost}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Visit Charge:</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Sitapur Discount:</span>
                  <span className="font-semibold text-emerald-600">- ₹{booking.quotation.discount}</span>
                </div>
                <div className="flex justify-between py-1.5 text-sm font-black text-slate-900">
                  <span>Final Total:</span>
                  <span className="text-blue-700">₹{booking.quotation.finalTotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Est. Completion:</span>
                  <span className="font-medium text-slate-700">{booking.quotation.estimatedCompletionTime}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Warranty:</span>
                  <span className="font-bold text-emerald-700">{booking.quotation.warrantyPeriod}</span>
                </div>
                {booking.quotation.technicianNotes && (
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 mt-2">
                    <span className="font-bold block text-[11px] text-slate-700">Technician Remarks:</span>
                    <p className="text-[11px] mt-0.5">{booking.quotation.technicianNotes}</p>
                  </div>
                )}
              </div>

              {/* Exact required Approve / Reject Buttons */}
              {booking.quotationStatus !== 'approved' && booking.quotationStatus !== 'rejected' && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                  <button
                    id="approve-repair-quotation-btn"
                    onClick={() => onApproveQuotation && onApproveQuotation(true)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Repair</span>
                  </button>

                  <button
                    id="reject-repair-quotation-btn"
                    onClick={() => onApproveQuotation && onApproveQuotation(false)}
                    className="px-4 bg-slate-100 hover:bg-slate-200 text-rose-700 text-xs sm:text-sm font-semibold py-2.5 rounded-xl border border-slate-300 transition cursor-pointer"
                  >
                    Reject Repair
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Technician Info & Sitapur Map */}
        <div className="lg:col-span-5 space-y-6">
          {/* Technician Info Card - Shown after technician assigning */}
          {isTechnicianAssigned && booking.status !== 'cancelled' ? (
            <div className="bg-white rounded-3xl p-5 border-2 border-blue-200 shadow-md">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Assigned Sitapur Technician</span>
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ✓ Verified Specialist
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={
                      booking.technicianPhoto ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={assignedTechName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xs"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Doorstep Specialist
                  </div>
                  <h3 className="font-black text-lg text-slate-900 leading-tight">
                    {assignedTechName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-800 ml-1">
                        {booking.technicianRating || 4.9}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">• 8+ Yrs Exp</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">• Active</span>
                  </div>
                </div>
              </div>

              {/* Dedicated Highlighted Mobile Number Box */}
              <div className="mt-4 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/70 rounded-2xl border border-blue-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                      Technician Mobile Number
                    </span>
                    <a
                      href={`tel:${assignedTechPhone.replace(/\s+/g, '')}`}
                      className="text-base sm:text-lg font-mono font-black text-slate-900 hover:text-blue-700 transition tracking-wide"
                    >
                      {assignedTechPhone}
                    </a>
                  </div>
                </div>

                <a
                  href={`tel:${assignedTechPhone.replace(/\s+/g, '')}`}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>

              {/* Direct Call & WhatsApp Buttons */}
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <a
                  id="call-assigned-technician-btn"
                  href={`tel:${assignedTechPhone.replace(/\s+/g, '')}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Technician</span>
                </a>
                <a
                  id="whatsapp-assigned-technician-btn"
                  href={`https://wa.me/${cleanTechPhone}?text=Hi%20${encodeURIComponent(
                    assignedTechName
                  )},%20I%20am%20tracking%20my%20repair%20booking%20${booking.bookingId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <p className="text-[11px] text-slate-500 mt-3 text-center">
                Technician will call on <strong className="text-slate-700 font-mono">{booking.customerPhone}</strong> before arriving at your doorstep in {booking.area}.
              </p>
            </div>
          ) : booking.status !== 'cancelled' ? (
            /* Technician Assignment in Progress Card */
            <div className="bg-white rounded-3xl p-5 border border-amber-200/90 shadow-xs bg-amber-50/20">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-amber-100">
                <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>Technician Assignment in Progress</span>
                </h2>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  Sitapur Hub Dispatching
                </span>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/60 text-xs text-amber-900 space-y-1.5">
                <p className="font-bold">
                  Sitapur Hub is currently assigning a certified hardware technician for your area ({booking.area}).
                </p>
                <p className="text-[11px] text-amber-800">
                  Technician <strong>Name</strong> and direct <strong>Mobile Number</strong> will be displayed here immediately once assigned.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Need emergency dispatch assistance?</span>
                <a
                  href="tel:+918563975583"
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Hub Desk</span>
                </a>
              </div>
            </div>
          ) : null}

          {/* Interactive Sitapur Map Representation */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>Live Route in Sitapur</span>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                ETA: 12 Mins
              </span>
            </div>

            {/* Stylized Sitapur Area Map with Technician Pin */}
            <div className="relative w-full h-52 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
              {/* SVG Map Grid & Route Simulation */}
              <svg className="absolute inset-0 w-full h-full stroke-slate-300" strokeWidth="2">
                <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#cbd5e1" strokeWidth="6" />
                <line x1="20%" y1="80%" x2="80%" y2="20%" stroke="#cbd5e1" strokeWidth="4" />
                <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth="3" />
                {/* Active path */}
                <path
                  d="M 60 70 Q 150 120 280 140"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeDasharray="6,6"
                />
              </svg>

              {/* Sitapur Landmarks markers */}
              <div className="absolute top-4 left-6 bg-white/90 backdrop-blur px-2 py-0.5 rounded shadow-xs text-[9px] font-bold text-slate-600">
                Civil Lines Hub
              </div>
              <div className="absolute bottom-4 right-6 bg-white/90 backdrop-blur px-2 py-0.5 rounded shadow-xs text-[9px] font-bold text-slate-600">
                Eye Hospital Road
              </div>
              <div className="absolute top-12 right-10 bg-white/90 backdrop-blur px-2 py-0.5 rounded shadow-xs text-[9px] font-bold text-slate-600">
                Station Road
              </div>

              {/* Technician Moving Pin */}
              <div className="absolute top-24 left-24 flex flex-col items-center animate-bounce">
                <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                  {isTechnicianAssigned ? `🛵 ${assignedTechName} En Route` : '🛵 Locating Nearest Specialist'}
                </div>
                <div className="w-3 h-3 bg-blue-600 rotate-45 -mt-1.5"></div>
              </div>

              {/* Customer Destination Pin */}
              <div className="absolute bottom-10 right-20 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.2 rounded shadow-2xs mt-1">
                  Your Address
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
              <span>Customer: {booking.address}, {booking.area}</span>
              <span className="text-blue-600 font-semibold">{booking.pincode}</span>
            </div>
          </div>

          {/* Quick Simulation controls for evaluator testing */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 block mb-2">
              ⚙️ Prototype Simulator (Test Next Stage):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TIMELINE_STEPS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => onUpdateStatus && onUpdateStatus(s.key)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                    booking.status === s.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {s.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment System Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Choose Payment Method</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Sitapur Mobile & Laptop Care accepts UPI, Cash on Delivery, and online Razorpay payments.
            </p>

            <div className="mt-4 space-y-2.5">
              {[
                { id: 'upi', label: 'UPI (Google Pay, Paytm, Axis Bank)', icon: <QrCode className="w-5 h-5 text-indigo-600" /> },
                { id: 'cod', label: 'Cash on Delivery (Pay after repair)', icon: <CreditCard className="w-5 h-5 text-emerald-600" /> },
                { id: 'razorpay', label: 'Online / Razorpay / Cards / NetBanking', icon: <Sparkles className="w-5 h-5 text-blue-600" /> },
                { id: 'payment_link', label: 'SMS / WhatsApp Payment Link', icon: <Phone className="w-5 h-5 text-amber-500" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedPayMode(m.id as PaymentMethod)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                    selectedPayMode === m.id
                      ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {m.icon}
                    <span>{m.label}</span>
                  </div>
                  {selectedPayMode === m.id && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>

            {selectedPayMode === 'upi' && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block mb-3">
                  Scan Sitapur Mobile & Laptop Care QR Code:
                </span>
                <div className="w-48 h-48 bg-white border border-slate-300 rounded-lg mx-auto flex items-center justify-center overflow-hidden shadow-sm">
                  <img 
                    src="/axis-qr.png" 
                    alt="Axis Bank QR Code" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Please+Upload+QR+Code\nTo+Public+Folder';
                    }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 mt-3 block uppercase">
                  Komal Srivastava
                </span>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Payable:</span>
                <span className="text-base font-black text-slate-900">
                  ₹{booking.finalPrice || booking.estimatedPrice}
                </span>
              </div>
              <button
                id="confirm-payment-action-btn"
                onClick={handlePayNow}
                disabled={isProcessingPayment}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Interactive Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        booking={booking}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
};
