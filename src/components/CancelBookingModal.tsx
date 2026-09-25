import React, { useState } from 'react';
import { Booking } from '../types';
import {
  AlertTriangle,
  X,
  Calendar,
  Clock,
  Smartphone,
  CheckCircle2,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onConfirmCancel: (bookingId: string, reason: string) => Promise<void> | void;
}

const CANCELLATION_REASONS = [
  'Need to reschedule for another date/time',
  'Changed my mind / No longer need repair',
  'Device fixed itself / Working now',
  'Already got it repaired elsewhere',
  'Estimated repair cost is higher than expected',
  'Booked by mistake / duplicate booking',
  'Other reason',
];

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirmCancel,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(CANCELLATION_REASONS[0]);
  const [customNote, setCustomNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const finalReason =
        selectedReason === 'Other reason' && customNote.trim()
          ? `Other: ${customNote.trim()}`
          : customNote.trim()
          ? `${selectedReason} - ${customNote.trim()}`
          : selectedReason;

      await onConfirmCancel(booking.id, finalReason);
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Failed to cancel booking. Please try again.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-rose-50/80 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 id="cancel-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                Cancel Repair Booking
              </h2>
              <p className="text-xs text-rose-700 font-medium">
                Sitapur Doorstep Service
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            aria-label="Close cancel dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Booking Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
              <span className="text-blue-700 font-mono text-sm">{booking.bookingId}</span>
              <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase">
                {booking.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Device</span>
                <span className="font-semibold text-slate-800">
                  {booking.brand} {booking.model}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Estimated Price</span>
                <span className="font-semibold text-emerald-700">
                  ₹{booking.finalPrice || booking.estimatedPrice}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase">Issues</span>
                <span className="font-medium text-slate-800">
                  {booking.problems?.join(', ') || 'Diagnostic Repair'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase">Scheduled Time</span>
                <span className="font-medium text-slate-800">
                  {booking.appointmentDate} • {booking.appointmentSlot}
                </span>
              </div>
            </div>
          </div>

          {/* Cancellation Reason Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Why do you want to cancel this booking?
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {CANCELLATION_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedReason === reason
                      ? 'border-blue-500 bg-blue-50/60 font-semibold text-blue-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancellation-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {/* Custom Notes */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Additional Comments / Feedback (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="Let us know how we can serve you better in Sitapur..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 placeholder-slate-400 text-slate-800"
              />
            </div>
          </div>

          {/* Free Cancellation Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              <strong>Free Doorstep Cancellation:</strong> No cancellation charges or hidden fees will be deducted. You can book a repair again anytime!
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            Keep Booking
          </button>

          <button
            id="confirm-cancel-booking-btn"
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Cancelling...</span>
              </>
            ) : (
              <span>Yes, Cancel Booking</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
