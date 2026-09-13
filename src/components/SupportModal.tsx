import React, { useState } from 'react';
import { SupportTicket } from '../types';
import {
  X,
  MessageSquare,
  Phone,
  HelpCircle,
  FileCheck,
  Send,
  CheckCircle2,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { SITAPUR_FAQS } from '../data/sitapurData';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  onSubmitTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'contact' | 'ticket' | 'warranty' | 'faq'>('contact');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Ticket Form State
  const [bookingId, setBookingId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !message) return;

    onSubmitTicket({
      bookingId: bookingId.trim() || 'SMC-INQUIRY',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      subject: subject || (activeTab === 'warranty' ? 'Warranty Claim' : 'General Support Request'),
      message: message.trim(),
      status: 'open',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-300 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
                Sitapur Helpline & Support
              </span>
              <span className="text-xs text-slate-400">9 AM – 9 PM Everyday</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-1">How Can We Help You?</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-600 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Direct Helpline
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'ticket'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Create Support Ticket
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'warranty'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Claim Warranty
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'faq'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            FAQs
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-4 text-xs">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 text-slate-800">
                <span className="font-bold text-sm text-blue-900 block">
                  Piyush Sitapur Mobile Care
                </span>
                <p className="mt-1 text-slate-600">
                  Police Line, Subhash Nagar, Sitapur, Uttar Pradesh - 261001
                </p>
                <p className="mt-1 text-slate-500 font-medium">
                  Operating Hours: Monday to Sunday: 8:30 AM – 9:30 PM
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+918563975583"
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition text-left flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">Customer Helpline</span>
                    <span className="text-slate-500 text-xs mt-0.5 block">+91 85639 75583</span>
                    <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
                      Tap to Call Instant →
                    </span>
                  </div>
                </a>

                <a
                  href="https://wa.me/918563975583?text=Hi%20Piyush%20Sitapur%20Mobile%20Care,%20I%20need%20support%20regarding%20my%20phone%20repair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5 fill-emerald-600" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">Official WhatsApp</span>
                    <span className="text-slate-500 text-xs mt-0.5 block">+91 85639 75583</span>
                    <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                      Chat on WhatsApp →
                    </span>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* TAB 2 & 3: TICKET / WARRANTY FORM */}
          {(activeTab === 'ticket' || activeTab === 'warranty') && (
            <div>
              {submitted ? (
                <div className="text-center py-8 space-y-2 animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">
                    Your request has been registered!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Piyush Sitapur Mobile Care team will contact you within 15 minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                  {activeTab === 'warranty' && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center gap-2">
                      <Shield className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>
                        All Piyush Sitapur Mobile Care repairs come with 3 to 6 months replacement warranty.
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Booking ID (If available)
                      </label>
                      <input
                        type="text"
                        placeholder="E.g. SMC-2026-000123"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Amit Verma"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="E.g. 94150 99999"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                      <input
                        type="text"
                        placeholder={
                          activeTab === 'warranty'
                            ? 'Warranty replacement for screen'
                            : 'Reschedule booking / Bill query'
                        }
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Explain Your Issue / Query *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Please describe what issue you are facing with your phone or booking..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: FAQS */}
          {activeTab === 'faq' && (
            <div className="space-y-2 text-xs">
              {SITAPUR_FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full p-3.5 text-left font-bold text-slate-900 hover:bg-slate-50 flex items-center justify-between gap-2"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        expandedFaq === i ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === i && (
                    <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-slate-600 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
