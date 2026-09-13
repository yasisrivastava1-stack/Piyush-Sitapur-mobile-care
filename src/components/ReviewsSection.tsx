import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquare, MapPin, ThumbsUp } from 'lucide-react';
import { CustomerReview } from '../types';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onAddReview: (review: Omit<CustomerReview, 'id' | 'date'>) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onAddReview }) => {
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newArea, setNewArea] = useState('Civil Lines, Sitapur');
  const [newBrand, setNewBrand] = useState('Samsung Galaxy');
  const [newRepairType, setNewRepairType] = useState('Screen Replacement');
  const [newComment, setNewComment] = useState('');

  const approvedReviews = reviews.filter((r) => r.isApproved);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newComment.trim()) return;

    onAddReview({
      bookingId: `SMC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: newCustomerName.trim(),
      area: newArea,
      brand: newBrand,
      repairType: newRepairType,
      rating: newRating,
      comment: newComment.trim(),
      isApproved: true,
    });

    setNewCustomerName('');
    setNewComment('');
    setShowAddReviewModal(false);
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full shadow-2xs">
              Verified Sitapur Customer Feedback
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Loved by Smartphone Owners in Sitapur
            </h2>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-blue-900">4.9 / 5.0</span>
              <span className="text-xs text-slate-500">
                (Based on 3,840+ Doorstep Repairs in Sitapur)
              </span>
            </div>
          </div>

          <button
            id="write-review-btn"
            onClick={() => setShowAddReviewModal(true)}
            className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={
                    rev.userPhoto ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={rev.customerName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {rev.customerName}
                    </span>
                    <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                    <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                    <span>{rev.area}</span>
                  </div>
                  <div className="text-[10px] text-blue-600 font-semibold truncate mt-0.5">
                    {rev.brand} • {rev.repairType}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for adding a new review */}
        {showAddReviewModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <h3 className="text-lg font-bold text-slate-900">Rate Your Experience</h3>
              <p className="text-xs text-slate-500 mt-1">
                Share your feedback on our doorstep mobile repair service in Sitapur.
              </p>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Your Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-slate-300 hover:text-amber-400 transition cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-800 ml-2">{newRating} of 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Rajesh Tripathi"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Sitapur Area</label>
                    <select
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                    >
                      <option value="Civil Lines, Sitapur">Civil Lines</option>
                      <option value="Station Road, Sitapur">Station Road</option>
                      <option value="Khairabad, Sitapur">Khairabad</option>
                      <option value="Awas Vikas, Sitapur">Awas Vikas</option>
                      <option value="Subhash Nagar, Sitapur">Subhash Nagar</option>
                      <option value="Lalbagh, Sitapur">Lalbagh</option>
                      <option value="Eye Hospital Rd, Sitapur">Eye Hospital Road</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Device Brand</label>
                    <input
                      type="text"
                      placeholder="E.g. iPhone 14 / Vivo"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Repair Performed</label>
                  <select
                    value={newRepairType}
                    onChange={(e) => setNewRepairType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                    <option value="Screen Replacement">Screen Replacement</option>
                    <option value="Battery Replacement">Battery Replacement</option>
                    <option value="Charging Problem">Charging Problem</option>
                    <option value="Speaker/Mic Repair">Speaker/Microphone Repair</option>
                    <option value="Camera Repair">Camera Repair</option>
                    <option value="Back Panel Replacement">Back Panel Replacement</option>
                    <option value="Other Service">Other Service</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Review & Comments</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell other Sitapur residents about technician punctuality, repair quality, and parts warranty..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddReviewModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
