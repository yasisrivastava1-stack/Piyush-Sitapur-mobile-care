import React from 'react';
import { Booking } from '../types';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Phone, MapPin } from 'lucide-react';

interface DigitalInvoiceModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalInvoiceModal: React.FC<DigitalInvoiceModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const invoiceNo = `SMC-INV-${booking.bookingId.replace('SMC-', '')}`;
  const invoiceDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const partsCost = booking.quotation?.partsCost || Math.round(booking.estimatedPrice * 0.7);
  const labourCost = booking.quotation?.labourCost || Math.round(booking.estimatedPrice * 0.3);
  const discount = booking.quotation?.discount || 100;
  const subtotal = partsCost + labourCost;
  const grandTotal = booking.finalPrice || booking.estimatedPrice;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              Tax Invoice & Warranty Certificate
            </span>
            <span className="text-xs text-slate-400">Sitapur Hub</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div id="printable-invoice" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  SMC
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-900">
                    PIYUSH SITAPUR MOBILE CARE
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium">
                    “Mobile & Laptop Repair at Your Doorstep”
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Police Line, Subhash Nagar, Sitapur, Uttar Pradesh — 261001
              </p>
              <p className="text-xs text-slate-500">
                GSTIN: 09AAACS8842M1ZT • WhatsApp / Helpline: +91 85639 75583
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-mono text-slate-400 block uppercase">Tax Invoice</span>
              <span className="font-mono text-sm font-black text-blue-700">{invoiceNo}</span>
              <p className="text-xs text-slate-500 mt-1">Date: {invoiceDate}</p>
              <p className="text-xs text-slate-500">Booking Ref: {booking.bookingId}</p>
            </div>
          </div>

          {/* Customer & Technician Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Billed To (Customer)
              </span>
              <p className="font-bold text-slate-900 text-sm">{booking.customerName}</p>
              <p className="text-slate-600 mt-0.5">{booking.customerPhone}</p>
              <p className="text-slate-600 mt-0.5">
                {booking.address}, {booking.area}, Sitapur — {booking.pincode}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Service Fulfilled By
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {booking.technicianName || 'Piyush'}
              </p>
              <p className="text-slate-600 mt-0.5">Technician ID: {booking.technicianId || 'TECH-STP-01'}</p>
              <p className="text-slate-600 mt-0.5">Piyush Sitapur Mobile & Laptop Care</p>
            </div>
          </div>

          {/* Device & Service Performed */}
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-slate-400 block">Smartphone</span>
                <span className="font-bold text-slate-900">
                  {booking.brand} {booking.model}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Repaired Issues</span>
                <span className="font-bold text-slate-900">{booking.problems.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Warranty Period</span>
                <span className="font-bold text-emerald-700">6 Months Replacement</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="pb-2">Description / Part Details</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Unit Price</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5">
                    <span className="font-bold text-slate-800">
                      OEM Grade Replacement Hardware / Display / Sub-board
                    </span>
                    <p className="text-[11px] text-slate-500">
                      High-grade tested component with serialized warranty seal
                    </p>
                  </td>
                  <td className="py-2.5 text-center">1</td>
                  <td className="py-2.5 text-right font-medium">₹{partsCost}</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">₹{partsCost}</td>
                </tr>
                <tr>
                  <td className="py-2.5">
                    <span className="font-bold text-slate-800">
                      Doorstep Micro-Soldering & Certified Installation Labour
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Performed at customer location in Sitapur
                    </p>
                  </td>
                  <td className="py-2.5 text-center">1</td>
                  <td className="py-2.5 text-right font-medium">₹{labourCost}</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">₹{labourCost}</td>
                </tr>
                <tr>
                  <td className="py-2.5">
                    <span className="font-bold text-slate-800">Doorstep Visit & Inspection</span>
                  </td>
                  <td className="py-2.5 text-center">1</td>
                  <td className="py-2.5 text-right text-emerald-600 font-bold">FREE</td>
                  <td className="py-2.5 text-right text-emerald-600 font-bold">₹0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total & Discount Calculation */}
          <div className="border-t-2 border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-1 text-xs text-slate-500 max-w-xs">
              <span className="font-bold text-slate-700 block">Warranty Terms:</span>
              <p className="text-[11px] leading-relaxed">
                6-month warranty covers touch failure, display anomalies, and battery degradation.
                Physical accidental breaks and liquid immersion void warranty. Keep this digital invoice.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Sitapur Launch Discount:</span>
                <span>- ₹{discount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (18% included):</span>
                <span>Included</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total Paid:</span>
                <span className="text-blue-700 text-base">₹{grandTotal}</span>
              </div>
              <div className="text-right">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Payment Status: {booking.paymentStatus === 'paid' ? 'PAID IN FULL' : 'PENDING ON COMPLETION'}
                </span>
              </div>
            </div>
          </div>

          {/* Stamp & Authorized Signatory Simulation */}
          <div className="pt-6 border-t border-dashed border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
              <div className="text-[11px] font-semibold">
                <span>100% Genuine Certified Repair</span>
                <p className="text-slate-400 text-[10px]">Verified Piyush Sitapur Mobile & Laptop Care Seal</p>
              </div>
            </div>

            <div className="text-right">
              <div className="font-script text-slate-600 italic font-bold text-sm">
                Piyush Sitapur Mobile & Laptop Care
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Authorized Signatory & Lead Specialist
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
