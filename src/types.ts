/**
 * Core Data Models & Types for Sitapur Mobile & Laptop Care
 */

export type UserRole = 'customer' | 'admin';

export type BookingStatus =
  | 'booking_received'
  | 'booking_confirmed'
  | 'technician_assigning'
  | 'technician_assigned'
  | 'technician_on_the_way'
  | 'technician_arrived'
  | 'device_inspection'
  | 'repair_started'
  | 'repair_completed'
  | 'payment_completed'
  | 'booking_closed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'cod' | 'upi' | 'razorpay' | 'payment_link';

export type QuotationStatus = 'none' | 'pending_approval' | 'approved' | 'rejected';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface RepairQuotation {
  repairType: string;
  partsRequired: string;
  partsCost: number;
  labourCost: number;
  visitCharge: number;
  discount: number;
  finalTotal: number;
  estimatedCompletionTime: string;
  warrantyPeriod: string;
  technicianNotes?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingId: string; // e.g. SMC-2026-000123
  customerId?: string;
  customerName: string;
  customerPhone: string;
  alternatePhone?: string;
  brand: string;
  model: string;
  problems: string[];
  problemDescription?: string;
  photos?: string[];
  address: string;
  landmark?: string;
  area: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  appointmentDate: string;
  appointmentSlot: string;
  estimatedPrice: number;
  finalPrice?: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  technicianRating?: number;
  technicianPhoto?: string;
  quotation?: RepairQuotation;
  quotationStatus?: QuotationStatus;
  createdAt: string;
  updatedAt: string;
  cancelReason?: string;
  cancelledAt?: string;
}

export type ServiceableArea = ServiceArea;

export interface Technician {
  id: string;
  deviceType?: 'mobile' | 'laptop' | string;
  name: string;
  phone: string;
  email?: string;
  photo: string;
  experience: string;
  skills: string[];
  serviceAreas: string[];
  availableDays: string[];
  availableHours: string;
  isVerified: boolean;
  isActive: boolean;
  isAvailable?: boolean;
  rating: number;
  completedJobs: number;
  todayEarnings: number;
  monthlyEarnings: number;
}

export interface ServiceArea {
  id: string;
  deviceType?: 'mobile' | 'laptop' | string;
  name: string;
  pincode: string;
  isServiceable: boolean;
  hubName: string;
  deliveryFee: number;
}

export interface RepairServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  startingPrice: number;
  estimatedMinutes: number;
  warrantyPeriod: string;
  icon: string;
  popular?: boolean;
}

export interface BrandItem {
  id: string;
  deviceType: 'mobile' | 'laptop';
  name: string;
  logo: string;
  popularModels: string[];
}

export interface CustomerReview {
  id: string;
  bookingId: string;
  customerName: string;
  area: string;
  brand: string;
  repairType: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  date: string;
  userPhoto?: string;
}

export interface SupportTicket {
  id: string;
  ticketId?: string;
  ticketNumber?: string;
  customerName: string;
  customerPhone: string;
  bookingId?: string;
  subject?: string;
  category?: 'Booking Help' | 'Payment Issue' | 'Repair Warranty' | 'Technician Behavior' | 'Cancellation' | 'Other' | string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  resolvedAt?: string;
}

export interface NotificationLog {
  id: string;
  bookingId?: string;
  recipient: string;
  channel: 'SMS' | 'WhatsApp' | 'Email' | 'In-App';
  title: string;
  message: string;
  sentAt: string;
  status: 'delivered' | 'sent' | 'failed';
}

export interface AppUser {
  uid: string;
  displayName: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  role: UserRole;
  savedAddresses?: Array<{
    id: string;
    label: string;
    address: string;
    landmark: string;
    area: string;
    pincode: string;
  }>;
}
