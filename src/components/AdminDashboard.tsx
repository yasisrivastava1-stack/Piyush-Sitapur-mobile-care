import React, { useState, useEffect } from 'react';
import {
  Booking,
  BookingStatus,
  Technician,
  ServiceableArea,
  SupportTicket,
} from '../types';
import {
  Users,
  Wrench,
  IndianRupee,
  MapPin,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Calendar,
  Layers,
  ChevronRight,
  Download,
  Settings,
  HelpCircle,
  Clock,
  Bell,
  Eye,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';
import { SERVICEABLE_AREAS, SITAPUR_REPAIR_SERVICES } from '../data/sitapurData';

const AdminRateInput = ({ booking, onUpdate }: { booking: Booking, onUpdate?: (id: string, rate: number) => void }) => {
  const [val, setVal] = useState(booking.estimatedPrice?.toString() || '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setVal(booking.estimatedPrice?.toString() || '');
    }
  }, [booking.estimatedPrice, isFocused]);

  const handleSave = (currentVal: string) => {
    const numVal = Number(currentVal);
    if (currentVal !== '' && !isNaN(numVal) && numVal !== booking.estimatedPrice) {
      onUpdate?.(booking.id, numVal);
    }
  };

  return (
    <input
      type="number"
      placeholder="₹ Est. Cost"
      value={val}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        setIsFocused(false);
        handleSave(e.target.value);
      }}
      onChange={e => setVal(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSave((e.target as HTMLInputElement).value);
          (e.target as HTMLInputElement).blur();
        }
      }}
      className="p-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium w-full max-w-[80px] text-emerald-700 font-bold"
    />
  );
};

interface AdminDashboardProps {
  bookings: Booking[];
  technicians: Technician[];
  supportTickets: SupportTicket[];
  onAssignTechnician: (bookingId: string, technicianId: string) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdateEstimatedPrice?: (bookingId: string, estimatedPrice: number) => void;
  onToggleTechnicianStatus: (techId: string) => void;
  onConfirmBooking?: (bookingId: string) => void;
  onOpenNewBooking?: () => void;
  onAddTechnician?: (technician: Omit<Technician, 'id'>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  technicians,
  supportTickets,
  onAssignTechnician,
  onUpdateBookingStatus,
  onUpdateEstimatedPrice,
  onToggleTechnicianStatus,
  onConfirmBooking,
  onOpenNewBooking,
  onAddTechnician,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'bookings' | 'technicians' | 'services' | 'areas' | 'tickets'
  >('overview');

  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<Booking | null>(null);

  // New Technician Modal state
  const [showAddTechModal, setShowAddTechModal] = useState(false);
  const [newTechName, setNewTechName] = useState('');
  const [newTechPhone, setNewTechPhone] = useState('');
  const [newTechExperience, setNewTechExperience] = useState('2 Years');
  const [newTechExp, setNewTechExp] = useState('4 Years');

  // Multi-city expansion toggle state
  const [expansionEnabled, setExpansionEnabled] = useState(false);

  // Counts
  const unconfirmedBookings = bookings.filter(
    (b) => b.status === 'booking_received' || b.status === 'technician_assigning'
  );
  const confirmedBookings = bookings.filter(
    (b) => b.status === 'booking_confirmed' || b.status === 'technician_assigned'
  );
  const inProgressBookings = bookings.filter((b) =>
    ['technician_on_the_way', 'technician_arrived', 'device_inspection', 'repair_started'].includes(
      b.status
    )
  );
  const completedBookings = bookings.filter((b) =>
    ['repair_completed', 'payment_completed', 'booking_closed'].includes(b.status)
  );

  // Confirmation Handler
  const handleConfirmSingleBooking = (bookingId: string) => {
    if (onConfirmBooking) {
      onConfirmBooking(bookingId);
    } else {
      onUpdateBookingStatus(bookingId, 'booking_confirmed');
      onAssignTechnician(bookingId, 'tech_1');
    }
  };

  // Revenue calculation
  const totalRevenue = bookings.reduce(
    (acc, b) => acc + (b.paymentStatus === 'paid' ? b.finalPrice || b.estimatedPrice : 0),
    124800
  );
  const totalCompleted = bookings.filter(
    (b) => b.status === 'repair_completed' || b.status === 'payment_completed' || b.status === 'booking_closed'
  ).length + 142;

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      bookingFilterStatus === 'all' ? true : b.status === bookingFilterStatus;
    
    const sq = searchQuery.toLowerCase();
    const matchesSearch =
      (b.bookingId || '').toLowerCase().includes(sq) ||
      (b.customerName || '').toLowerCase().includes(sq) ||
      (b.brand || '').toLowerCase().includes(sq) ||
      (b.area || '').toLowerCase().includes(sq);
      
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-0.5 rounded border border-purple-500/30">
              Admin & Operations Console
            </span>
            <span className="text-xs text-slate-400">Piyush Sitapur Mobile Care HQ</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Piyush Sitapur Central Management Portal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time control over doorstep technicians, customer tickets, pricing & logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,' +
                'BookingID,Customer,Phone,Brand,Model,Area,Price,Status\n' +
                bookings
                  .map(
                    (b) =>
                      `${b.bookingId},"${b.customerName}","${b.customerPhone}","${b.brand}","${b.model}","${b.area}",${b.estimatedPrice},${b.status}`
                  )
                  .join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', 'piyush_sitapur_mobile_care_report.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Unconfirmed Bookings Alert Banner */}
      {unconfirmedBookings.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 sm:p-5 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  Action Required
                </span>
                <span className="text-xs text-amber-100">Sitapur Hub Dispatch</span>
              </div>
              <h3 className="text-base sm:text-lg font-black mt-0.5">
                {unconfirmedBookings.length} New Booking{unconfirmedBookings.length > 1 ? 's' : ''} Received from Customer!
              </h3>
              <p className="text-xs text-amber-100">
                Customers booked doorstep mobile repairs. Click to confirm booking and schedule technician Piyush.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              id="admin-banner-review-btn"
              onClick={() => {
                setActiveAdminTab('bookings');
                setBookingFilterStatus('booking_received');
              }}
              className="flex-1 md:flex-none bg-white text-orange-700 hover:bg-orange-50 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Review & Confirm</span>
            </button>
            {unconfirmedBookings.length > 1 && (
              <button
                id="admin-banner-confirm-all-btn"
                onClick={() => {
                  unconfirmedBookings.forEach((b) => handleConfirmSingleBooking(b.id));
                }}
                className="bg-orange-700/80 hover:bg-orange-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Confirm All ({unconfirmedBookings.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: <TrendingUp className="w-4 h-4" /> },
          {
            id: 'bookings',
            label: `All Bookings (${bookings.length})${
              unconfirmedBookings.length > 0 ? ` • ${unconfirmedBookings.length} NEW` : ''
            }`,
            icon: <Wrench className="w-4 h-4" />,
            badge: unconfirmedBookings.length > 0 ? unconfirmedBookings.length : undefined,
          },
          { id: 'technicians', label: `Technicians (${technicians.length})`, icon: <Users className="w-4 h-4" /> },
          { id: 'services', label: 'Services & Pricing', icon: <Layers className="w-4 h-4" /> },
          { id: 'areas', label: 'Sitapur Areas & Pincodes', icon: <MapPin className="w-4 h-4" /> },
          { id: 'tickets', label: `Support Tickets (${supportTickets.length})`, icon: <HelpCircle className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeAdminTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Total Bookings
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900">
                  {bookings.length + 3840}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +18% MoM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Across all Sitapur zones</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Completed Repairs
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-emerald-600">{totalCompleted}</span>
                <span className="text-xs font-bold text-slate-500">98.4% Success</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Repaired right at doorstep</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Active Technicians
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-blue-600">
                  {technicians.filter((t) => t.isAvailable).length}
                </span>
                <span className="text-xs text-slate-400">of {technicians.length} enrolled</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">On road in Sitapur</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +24%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Parts + Service fees</p>
            </div>
          </div>

          {/* Sitapur Hub Status & Expansion Toggle */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Multi-City Expansion Engine
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-xl">
                The architecture is pre-configured to expand beyond Sitapur to Lakhimpur Kheri,
                Hardoi, and Lucknow suburbs with zero code changes.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">
                {expansionEnabled ? 'Expansion Mode ACTIVE' : 'Sitapur Hub Only'}
              </span>
              <button
                onClick={() => setExpansionEnabled(!expansionEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  expansionEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    expansionEnabled ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Recent Bookings Quick Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Recent Customer Bookings</h3>
                <p className="text-xs text-slate-500">Live incoming doorstep repair requests from Sitapur residents.</p>
              </div>
              <button
                onClick={() => setActiveAdminTab('bookings')}
                className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>View All ({bookings.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3">Booking ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Device & Issue</th>
                    <th className="pb-3">Sitapur Area</th>
                    <th className="pb-3">Technician</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.slice(0, 6).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 font-mono font-bold text-blue-700">
                        <div className="flex items-center gap-1.5">
                          <span>{b.bookingId}</span>
                          {(b.status === 'booking_received' || b.status === 'technician_assigning') && (
                            <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase animate-pulse">
                              NEW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-800 block">{b.customerName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{b.customerPhone}</span>
                      </td>
                      <td className="py-3 text-slate-600">
                        <span className="font-medium text-slate-800 block">{b.brand} {b.model}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">{(b.problems || []).join(', ')}</span>
                        {b.problemDescription && (
                          <span className="text-[10px] text-amber-700 font-medium line-clamp-1 mt-0.5" title={b.problemDescription}>
                            Note: {b.problemDescription}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-600">
                        <span>{b.area}</span>
                        <span className="text-[10px] text-slate-400 block">{b.appointmentDate}</span>
                      </td>
                      <td className="py-3 text-slate-800 font-medium">
                        {b.technicianName || 'Piyush (Hub)'}
                      </td>
                      <td className="py-3">
                        {b.status === 'booking_received' ? (
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            Awaiting Confirm
                          </span>
                        ) : b.status === 'booking_confirmed' ? (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            Confirmed
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {b.status.replace(/_/g, ' ')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status === 'booking_received' && (
                            <button
                              id={`admin-quick-confirm-${b.id}`}
                              onClick={() => handleConfirmSingleBooking(b.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
                              title="Confirm booking and dispatch Piyush"
                            >
                              <Check className="w-3 h-3" />
                              <span>Confirm</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedBookingForModal(b)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1 rounded-lg transition cursor-pointer"
                            title="View Full Booking Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS MANAGEMENT */}
      {activeAdminTab === 'bookings' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by ID, name, phone, area, model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                {unconfirmedBookings.length > 0 && (
                  <button
                    id="admin-confirm-all-tab-btn"
                    onClick={() => {
                      unconfirmedBookings.forEach((b) => handleConfirmSingleBooking(b.id));
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm All New ({unconfirmedBookings.length})</span>
                  </button>
                )}

                {onOpenNewBooking && (
                  <button
                    onClick={onOpenNewBooking}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New Booking</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Status Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
              {[
                { id: 'all', label: `All Bookings (${bookings.length})` },
                {
                  id: 'booking_received',
                  label: `⚠️ Needs Confirmation (${unconfirmedBookings.length})`,
                  highlight: unconfirmedBookings.length > 0,
                },
                {
                  id: 'booking_confirmed',
                  label: `✓ Confirmed (${confirmedBookings.length})`,
                },
                {
                  id: 'technician_on_the_way',
                  label: `🛵 On The Way (${bookings.filter((b) => b.status === 'technician_on_the_way').length})`,
                },
                {
                  id: 'repair_completed',
                  label: `🏁 Completed (${completedBookings.length})`,
                },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setBookingFilterStatus(pill.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    bookingFilterStatus === pill.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : pill.highlight
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table with Assign & Status Actions */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs overflow-x-auto">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
              <span>Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}</span>
              <span className="text-[11px] text-emerald-700 font-bold">
                ✓ Doorstep Dispatch & Live Confirmation Active
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Customer & Phone</th>
                  <th className="pb-3">Device / Issue</th>
                  <th className="pb-3">Sitapur Area & Slot</th>
                  <th className="pb-3">Technician</th>
                  <th className="pb-3">Estimated Cost (₹)</th>
                  <th className="pb-3">Status & Confirmation</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 font-medium text-sm">
                      No bookings found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 font-mono font-bold text-blue-700">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1">
                          {b.bookingId}
                        </span>
                        {(b.status === 'booking_received' || b.status === 'technician_assigning') && (
                          <span className="w-fit bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                            NEEDS CONFIRM
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-slate-800 block">{b.customerName}</span>
                      <a
                        href={`tel:${b.customerPhone}`}
                        className="text-[11px] text-blue-600 hover:underline font-mono block"
                      >
                        {b.customerPhone}
                      </a>
                    </td>
                    <td className="py-3.5 max-w-[180px]">
                      <span className="font-semibold text-slate-800 block">
                        {b.brand} {b.model}
                      </span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        {(b.problems || []).join(', ')}
                      </span>
                      {b.problemDescription && (
                        <span className="text-[10px] text-amber-700 font-medium line-clamp-2 mt-0.5" title={b.problemDescription}>
                          Note: {b.problemDescription}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-slate-600">
                      <span className="font-medium text-slate-800 block">{b.area} ({b.pincode})</span>
                      <span className="text-[10px] text-slate-400 block">
                        {b.appointmentDate} • {b.appointmentSlot}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <select
                        value={b.technicianId || 'tech_1'}
                        onChange={(e) => onAssignTechnician(b.id, e.target.value)}
                        className="p-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium max-w-[140px]"
                      >
                        {technicians.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.rating}★)
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5">
                      <AdminRateInput booking={b} onUpdate={onUpdateEstimatedPrice} />
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-col gap-1.5">
                        {/* Direct Confirm Button if received */}
                        {(b.status === 'booking_received' || b.status === 'technician_assigning') ? (
                          <button
                            id={`admin-confirm-btn-${b.id}`}
                            onClick={() => handleConfirmSingleBooking(b.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition w-fit"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm Booking</span>
                          </button>
                        ) : b.status === 'booking_confirmed' ? (
                          <div className="flex items-center gap-1.5">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Confirmed
                            </span>
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'technician_on_the_way')}
                              className="text-[10px] text-blue-600 hover:underline font-bold"
                              title="Mark technician on the way"
                            >
                              Dispatch →
                            </button>
                          </div>
                        ) : (
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit">
                            {b.status.replace(/_/g, ' ')}
                          </span>
                        )}

                        {/* Full Status Selector Dropdown */}
                        <select
                          value={b.status}
                          onChange={(e) =>
                            onUpdateBookingStatus(b.id, e.target.value as BookingStatus)
                          }
                          className="p-1 rounded-md border border-slate-200 text-[10px] font-medium bg-slate-50 text-slate-600 max-w-[130px]"
                        >
                          <option value="booking_received">Booking Received</option>
                          <option value="booking_confirmed">Booking Confirmed</option>
                          <option value="technician_assigning">Assigning Tech</option>
                          <option value="technician_assigned">Tech Assigned</option>
                          <option value="technician_on_the_way">On The Way</option>
                          <option value="technician_arrived">Arrived</option>
                          <option value="device_inspection">Inspection</option>
                          <option value="repair_started">Repair Started</option>
                          <option value="repair_completed">Completed</option>
                          <option value="payment_completed">Payment Paid</option>
                          <option value="booking_closed">Closed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBookingForModal(b)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                          title="View Full Booking Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`tel:${b.customerPhone}`}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/91${b.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                            b.customerName
                          )},%20regarding%20your%20mobile%20repair%20booking%20${b.bookingId}%20at%20Piyush%20Sitapur%20Mobile%20Care:`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                          title="Chat with customer on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TECHNICIANS MANAGEMENT */}
      {activeAdminTab === 'technicians' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              Verified Sitapur Doorstep Technicians ({technicians.length})
            </h3>
            <button
              onClick={() => setShowAddTechModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Technician</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {technicians.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            t.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{t.phone}</p>
                      <div className="text-[11px] text-amber-500 font-bold mt-0.5">
                        {t.rating} ★ ({t.completedJobs} Jobs done)
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Experience:</span>
                      <span className="font-bold text-slate-800">{t.experience}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Today's Payout:</span>
                      <span className="font-bold text-emerald-700">₹{t.todayEarnings}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Monthly Earnings:</span>
                      <span className="font-bold text-blue-700">₹{t.monthlyEarnings}</span>
                    </div>
                    <div className="pt-1 text-slate-500">
                      <span>Assigned Sitapur Localities:</span>
                      <p className="font-medium text-slate-700 mt-0.5 truncate">
                        {(t.serviceAreas || []).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onToggleTechnicianStatus(t.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      t.isAvailable
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                    }`}
                  >
                    {t.isAvailable ? 'Set Inactive' : 'Set Available'}
                  </button>

                  <a
                    href={`tel:${t.phone}`}
                    className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES & PRICING */}
      {activeAdminTab === 'services' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Service Catalog & Standard Price Matrix (Sitapur)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage base repair fees, average duration, and warranty commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SITAPUR_REPAIR_SERVICES.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-slate-900">{s.title}</h4>
                  <span className="text-xs font-extrabold text-blue-700">₹{s.startingPrice}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{s.shortDesc}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Warranty: {s.warrantyPeriod}</span>
                  <span>Duration: ~{s.estimatedMinutes} mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SITAPUR AREAS & PINCODES */}
      {activeAdminTab === 'areas' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Active Service Zones in Sitapur (Pincode Lock)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Only addresses within authorized pincodes are accepted for doorstep technician dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SERVICEABLE_AREAS.map((a) => (
              <div
                key={a.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  a.isServiceable
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{a.name}</h4>
                  <span className="text-[11px] font-mono text-slate-500 block">
                    Pincode: {a.pincode}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    a.isServiceable
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {a.isServiceable ? 'Active' : 'Coming Soon'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SUPPORT TICKETS */}
      {activeAdminTab === 'tickets' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Customer Support & Warranty Claims
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tickets submitted by customers regarding repair queries, reschedule, or warranty claims.
            </p>
          </div>

          <div className="space-y-3">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {ticket.ticketNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Booking: {ticket.bookingId}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{ticket.subject}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{ticket.message}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Customer: {ticket.customerName} ({ticket.customerPhone}) • {ticket.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ticket.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ticket.status.toUpperCase()}
                  </span>
                  <a
                    href={`tel:${ticket.customerPhone}`}
                    className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Resolve</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Full Booking Inspection & One-Click Confirmation */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-400">
                    {selectedBookingForModal.bookingId}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white uppercase">
                    {selectedBookingForModal.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  Customer Repair Order Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Customer Contact & Address Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Customer & Doorstep Location
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Customer Name</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedBookingForModal.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contact Number</span>
                    <span className="font-bold font-mono text-blue-700">{selectedBookingForModal.customerPhone}</span>
                  </div>
                  {selectedBookingForModal.alternatePhone && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Alternate Mobile</span>
                      <span className="font-mono text-slate-700">{selectedBookingForModal.alternatePhone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sitapur Service Zone</span>
                    <span className="font-semibold text-slate-800">{selectedBookingForModal.area} ({selectedBookingForModal.pincode})</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Full Doorstep Address & Landmark</span>
                    <span className="font-medium text-slate-800 block">{selectedBookingForModal.address}</span>
                    {selectedBookingForModal.landmark && (
                      <span className="text-[11px] text-blue-700 font-semibold block mt-0.5">
                        Landmark: {selectedBookingForModal.landmark}
                      </span>
                    )}
                    {selectedBookingForModal.latitude && selectedBookingForModal.longitude && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedBookingForModal.latitude},${selectedBookingForModal.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Track Customer Live Location on Map</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Device & Reported Issue */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                  Device & Repair Problems
                </h4>
                <div className="text-xs space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-blue-600 block">Smartphone Model</span>
                      <span className="font-extrabold text-sm text-slate-900">
                        {selectedBookingForModal.brand} {selectedBookingForModal.model}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Estimated Cost</span>
                      <span className="font-black text-sm text-emerald-700">
                        ₹{selectedBookingForModal.finalPrice || selectedBookingForModal.estimatedPrice}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Reported Problems:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedBookingForModal.problems.map((p, idx) => (
                        <span
                          key={idx}
                          className="bg-white text-blue-800 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs"
                        >
                          • {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedBookingForModal.problemDescription && (
                    <div className="pt-2 border-t border-blue-100">
                      <span className="text-[11px] text-slate-400 block">Customer Problem Notes:</span>
                      <p className="text-xs text-slate-700 italic mt-0.5">
                        "{selectedBookingForModal.problemDescription}"
                      </p>
                    </div>
                  )}

                  {selectedBookingForModal.photos && selectedBookingForModal.photos.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] text-slate-500 block mb-1">Attached Damage Photos:</span>
                      <div className="flex gap-2">
                        {selectedBookingForModal.photos.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt="Damage"
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment Slot & Technician Assigned */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Appointment Date</span>
                  <span className="font-bold text-slate-900">{selectedBookingForModal.appointmentDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Time Slot</span>
                  <span className="font-bold text-slate-900">{selectedBookingForModal.appointmentSlot}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Assigned Technician</span>
                  <span className="font-bold text-blue-700">{selectedBookingForModal.technicianName || 'Piyush (Lead)'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Current Status</span>
                  <span className="font-bold text-slate-900 capitalize">
                    {selectedBookingForModal.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedBookingForModal.customerPhone}`}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs px-3 py-2 rounded-xl border border-blue-200 flex items-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Customer</span>
                </a>
                <a
                  href={`https://wa.me/91${selectedBookingForModal.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                    selectedBookingForModal.customerName
                  )},%20confirming%20your%20repair%20booking%20${selectedBookingForModal.bookingId}%20with%20Piyush%20Sitapur%20Mobile%20Care.`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                {(selectedBookingForModal.status === 'booking_received' ||
                  selectedBookingForModal.status === 'technician_assigning') && (
                  <button
                    id="admin-modal-confirm-btn"
                    onClick={() => {
                      handleConfirmSingleBooking(selectedBookingForModal.id);
                      setSelectedBookingForModal((prev) =>
                        prev ? { ...prev, status: 'booking_confirmed', technicianName: 'Piyush' } : null
                      );
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Booking & Assign Piyush</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedBookingForModal(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Technician */}
      {showAddTechModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Add Doorstep Technician</h3>
              <button
                onClick={() => setShowAddTechModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Technician Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Piyush Sahu"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Number (Sitapur)</label>
                <input
                  type="tel"
                  placeholder="+91 85639 75583"
                  value={newTechPhone}
                  onChange={(e) => setNewTechPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Repair Experience</label>
                <select
                  value={newTechExp}
                  onChange={(e) => setNewTechExp(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="2 Years">2 Years</option>
                  <option value="4 Years">4 Years</option>
                  <option value="6 Years">6 Years</option>
                  <option value="8+ Years">8+ Years (Master Technician)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddTechModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newTechName.trim() && newTechPhone.trim()) {
                    if (onAddTechnician) {
                      onAddTechnician({
                        name: newTechName.trim(),
                        phone: newTechPhone.trim(),
                        photo: 'https://i.pravatar.cc/150?u=' + Date.now(),
                        experience: newTechExp,
                        skills: ['Smartphone Repair', 'Screen Replacement'],
                        serviceAreas: ['261001', '261002'],
                        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                        availableHours: '10:00 AM - 08:00 PM',
                        isVerified: true,
                        isActive: true,
                        isAvailable: true,
                        rating: 5.0,
                        completedJobs: 0,
                        todayEarnings: 0,
                        monthlyEarnings: 0,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      });
                    }
                    setShowAddTechModal(false);
                    setNewTechName('');
                    setNewTechPhone('');
                    setNewTechExp('4 Years');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer"
              >
                Register Technician
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
