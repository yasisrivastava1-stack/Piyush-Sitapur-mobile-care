import React, { useState } from 'react';
import {
  Booking,
  BookingStatus,
  RepairQuotation,
  Technician,
} from '../types';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  Phone,
  Navigation,
  MapPin,
  Calendar,
  IndianRupee,
  Star,
  Camera,
  AlertCircle,
  FileCheck,
  Send,
  XCircle,
  Play,
  Check,
  ChevronRight,
} from 'lucide-react';

interface TechnicianDashboardProps {
  technician: Technician;
  bookings: Booking[];
  onUpdateBookingStatus: (bookingId: string, newStatus: BookingStatus) => void;
  onSubmitQuotation: (bookingId: string, quotation: RepairQuotation) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  technician,
  bookings,
  onUpdateBookingStatus,
  onSubmitQuotation,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
  const [selectedBookingForQuote, setSelectedBookingForQuote] = useState<Booking | null>(null);

  // Form state for Quotation
  const [repairType, setRepairType] = useState('OLED Screen & Charging Port Assembly');
  const [partsRequired, setPartsRequired] = useState('Original Display Panel + Type-C Sub-board');
  const [partsCost, setPartsCost] = useState(2400);
  const [labourCost, setLabourCost] = useState(450);
  const [visitCharge, setVisitCharge] = useState(0);
  const [discount, setDiscount] = useState(150);
  const [completionTime, setCompletionTime] = useState('35 mins');
  const [warrantyPeriod, setWarrantyPeriod] = useState('6 Months Replacement Warranty');
  const [notes, setNotes] = useState('Checked battery health (91%). Only front glass digitizer and sub-board damaged.');

  // Technician's assigned jobs
  const myJobs = bookings.filter(
    (b) => b.technicianId === technician.id || !b.technicianId || b.id.includes('sample')
  );

  const pendingRequests = myJobs.filter(
    (b) => b.status === 'booking_received' || b.status === 'technician_assigning'
  );
  const acceptedJobs = myJobs.filter(
    (b) =>
      b.status === 'technician_assigned' ||
      b.status === 'technician_on_the_way' ||
      b.status === 'technician_arrived' ||
      b.status === 'device_inspection' ||
      b.status === 'repair_started'
  );
  const completedJobs = myJobs.filter(
    (b) => b.status === 'repair_completed' || b.status === 'payment_completed' || b.status === 'booking_closed'
  );

  const displayedJobs =
    activeFilter === 'pending'
      ? pendingRequests
      : activeFilter === 'accepted'
      ? acceptedJobs
      : activeFilter === 'completed'
      ? completedJobs
      : myJobs;

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForQuote) return;

    const finalTotal = Math.max(0, partsCost + labourCost + visitCharge - discount);
    const newQuotation: RepairQuotation = {
      repairType,
      partsRequired,
      partsCost,
      labourCost,
      visitCharge,
      discount,
      finalTotal,
      estimatedCompletionTime: completionTime,
      warrantyPeriod,
      technicianNotes: notes,
      createdAt: new Date().toISOString(),
    };

    onSubmitQuotation(selectedBookingForQuote.id, newQuotation);
    setSelectedBookingForQuote(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Technician Profile Card & Metrics */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={technician.photo}
              alt={technician.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{technician.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  Verified Tech
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sitapur Central Hub • {technician.experience} • ID: {technician.id}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="flex items-center text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  {technician.rating} ★
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">{technician.completedJobs} Repairs Finished</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-950 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Active On Duty
            </span>
          </div>
        </div>

        {/* Financial and Job Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <span className="text-xs text-slate-400 block">Today's Earnings</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-1 block">
              ₹{technician.todayEarnings}
            </span>
            <span className="text-[10px] text-slate-400">Paid daily at 9 PM</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <span className="text-xs text-slate-400 block">Monthly Earnings</span>
            <span className="text-xl font-extrabold text-blue-400 mt-1 block">
              ₹{technician.monthlyEarnings}
            </span>
            <span className="text-[10px] text-slate-400">Current month payout</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <span className="text-xs text-slate-400 block">Active Jobs</span>
            <span className="text-xl font-extrabold text-amber-400 mt-1 block">
              {acceptedJobs.length}
            </span>
            <span className="text-[10px] text-slate-400">In doorstep queue</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <span className="text-xs text-slate-400 block">Assigned Areas</span>
            <span className="text-xs font-bold text-slate-200 mt-1 block truncate">
              {technician.serviceAreas.slice(0, 2).join(', ')}
            </span>
            <span className="text-[10px] text-slate-400">Sitapur Zone 1</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All Jobs (${myJobs.length})` },
          { id: 'pending', label: `Pending Requests (${pendingRequests.length})` },
          { id: 'accepted', label: `Active / In-Progress (${acceptedJobs.length})` },
          { id: 'completed', label: `Completed (${completedJobs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Jobs Feed */}
      <div className="space-y-4">
        {displayedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-sm">No jobs in this category right now.</p>
          </div>
        ) : (
          displayedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-blue-700">
                      {job.bookingId}
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200">
                      {job.brand} {job.model}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {job.appointmentDate} • Slot: {job.appointmentSlot}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full uppercase tracking-wider text-[11px]">
                    Status: {job.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    ₹{job.finalPrice || job.estimatedPrice}
                  </span>
                </div>
              </div>

              {/* Customer & Device Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{job.customerName}</span>
                    <a
                      href={`tel:${job.customerPhone}`}
                      className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{job.customerPhone}</span>
                    </a>
                  </div>
                  <p className="text-slate-600 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      {job.address}, {job.landmark} ({job.area} - {job.pincode})
                    </span>
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  <span className="text-slate-500 font-medium block">Reported Issues:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.problems.map((p, i) => (
                      <span
                        key={i}
                        className="bg-white text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  {job.problemDescription && (
                    <p className="text-slate-500 text-[11px] mt-1 italic">
                      "{job.problemDescription}"
                    </p>
                  )}
                </div>
              </div>

              {/* Customer photos preview if present */}
              {job.photos && job.photos.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" /> Photos:
                  </span>
                  <div className="flex gap-2">
                    {job.photos.map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt="Damaged phone"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-300 shadow-2xs"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Accept / Reject / Call / Navigate */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${job.customerPhone}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Customer</span>
                  </a>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      job.address + ', ' + job.area + ', Sitapur'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-100 hover:bg-slate-200 text-blue-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 flex items-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                  </a>

                  {/* Create / Edit Quotation Button */}
                  <button
                    onClick={() => setSelectedBookingForQuote(job)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-2 rounded-xl border border-indigo-200 flex items-center gap-1 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>
                      {job.quotation ? 'View / Edit Quotation' : 'Create Quotation'}
                    </span>
                  </button>
                </div>

                {/* Status Stepper Progression:
                    Assigned → On The Way → Arrived → Inspection → Repair Started → Repair Completed */}
                <div className="flex items-center gap-1.5">
                  {job.status === 'booking_received' && (
                    <button
                      onClick={() => onUpdateBookingStatus(job.id, 'technician_assigned')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition"
                    >
                      Accept Job
                    </button>
                  )}

                  {job.status === 'technician_assigned' && (
                    <button
                      onClick={() => onUpdateBookingStatus(job.id, 'technician_on_the_way')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      <span>Mark: On The Way</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {job.status === 'technician_on_the_way' && (
                    <button
                      onClick={() => onUpdateBookingStatus(job.id, 'technician_arrived')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      <span>Mark: Arrived at Doorstep</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {job.status === 'technician_arrived' && (
                    <button
                      onClick={() => onUpdateBookingStatus(job.id, 'device_inspection')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      <span>Start Inspection</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {job.status === 'device_inspection' && (
                    <button
                      onClick={() => onUpdateBookingStatus(job.id, 'repair_started')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      <span>Begin Repair Work</span>
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </button>
                  )}

                  {job.status === 'repair_started' && (
                    <button
                      onClick={() => onUpdateBookingStatus(job.id, 'repair_completed')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Finish & Complete Repair</span>
                    </button>
                  )}

                  {job.status === 'repair_completed' && (
                    <button
                      onClick={() => onUpdateBookingStatus(job.id, 'payment_completed')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Collect Payment</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* TECHNICIAN FINAL QUOTATION MODAL */}
      {selectedBookingForQuote && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Create Final Repair Quotation
                </h3>
                <p className="text-xs text-slate-500">
                  Booking: {selectedBookingForQuote.bookingId} ({selectedBookingForQuote.brand}{' '}
                  {selectedBookingForQuote.model})
                </p>
              </div>
              <button
                onClick={() => setSelectedBookingForQuote(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Exact Repair Type
                </label>
                <input
                  type="text"
                  required
                  value={repairType}
                  onChange={(e) => setRepairType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Parts Required & Specifications
                </label>
                <input
                  type="text"
                  required
                  value={partsRequired}
                  onChange={(e) => setPartsRequired(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Parts Cost (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={partsCost}
                    onChange={(e) => setPartsCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Labour / Service Cost (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={labourCost}
                    onChange={(e) => setLabourCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Visit Charge (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={visitCharge}
                    onChange={(e) => setVisitCharge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Est. Completion Time
                  </label>
                  <input
                    type="text"
                    value={completionTime}
                    onChange={(e) => setCompletionTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Warranty Period
                  </label>
                  <input
                    type="text"
                    value={warrantyPeriod}
                    onChange={(e) => setWarrantyPeriod(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Technician Inspection Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              {/* Total Calculation */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Calculated Final Total:</span>
                <span className="text-base font-black text-blue-800">
                  ₹{Math.max(0, partsCost + labourCost + visitCharge - discount)}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForQuote(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Quotation to Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
