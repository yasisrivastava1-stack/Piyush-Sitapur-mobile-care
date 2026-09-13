import {
  BrandItem,
  RepairServiceItem,
  ServiceArea,
  Technician,
  CustomerReview,
  Booking,
} from '../types';

export const SITAPUR_BRANDS: BrandItem[] = [
  {
    id: 'apple',
    name: 'Apple',
    logo: '🍎',
    popularModels: [
      'iPhone 15 Pro Max',
      'iPhone 15 Pro',
      'iPhone 15 Plus',
      'iPhone 15',
      'iPhone 14 Pro Max',
      'iPhone 14 Pro',
      'iPhone 14',
      'iPhone 13 Pro',
      'iPhone 13',
      'iPhone 12',
      'iPhone 11',
      'iPhone XR',
    ],
  },
  {
    id: 'samsung',
    name: 'Samsung',
    logo: '📱',
    popularModels: [
      'Galaxy S24 Ultra',
      'Galaxy S24+',
      'Galaxy S24',
      'Galaxy S23 FE',
      'Galaxy A55 5G',
      'Galaxy A54 5G',
      'Galaxy A35 5G',
      'Galaxy M34 5G',
      'Galaxy F54',
      'Galaxy Z Fold 5',
      'Galaxy Z Flip 5',
      'Galaxy Note 20 Ultra',
    ],
  },
  {
    id: 'redmi',
    name: 'Redmi',
    logo: '🔴',
    popularModels: [
      'Redmi Note 13 Pro+ 5G',
      'Redmi Note 13 Pro 5G',
      'Redmi Note 13 5G',
      'Redmi Note 12 Pro',
      'Redmi 13C 5G',
      'Redmi 12 5G',
      'Redmi Note 11',
      'Redmi 10 Power',
    ],
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    logo: '🟠',
    popularModels: [
      'Xiaomi 14 Ultra',
      'Xiaomi 14',
      'Xiaomi 13 Pro',
      'Xiaomi 12 Pro',
      'Xiaomi 11T Pro',
      'Mi 11X 5G',
    ],
  },
  {
    id: 'realme',
    name: 'Realme',
    logo: '🟡',
    popularModels: [
      'Realme 12 Pro+ 5G',
      'Realme 12 Pro 5G',
      'Realme 12+ 5G',
      'Realme 11 Pro+',
      'Realme GT 6T',
      'Realme Narzo 70 Pro',
      'Realme C67 5G',
      'Realme C53',
    ],
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    logo: '➕',
    popularModels: [
      'OnePlus 12',
      'OnePlus 12R',
      'OnePlus 11 5G',
      'OnePlus 11R',
      'OnePlus Nord 4',
      'OnePlus Nord CE 4',
      'OnePlus Nord CE 3 Lite',
      'OnePlus 10 Pro',
      'OnePlus 9RT',
    ],
  },
  {
    id: 'vivo',
    name: 'Vivo',
    logo: '🔷',
    popularModels: [
      'Vivo V30 Pro',
      'Vivo V30',
      'Vivo V29 Pro',
      'Vivo Y200 5G',
      'Vivo T3 5G',
      'Vivo X100 Pro',
      'Vivo Y28 5G',
      'Vivo T2x 5G',
    ],
  },
  {
    id: 'oppo',
    name: 'Oppo',
    logo: '🟢',
    popularModels: [
      'Oppo Reno 11 Pro 5G',
      'Oppo Reno 11 5G',
      'Oppo Reno 10 5G',
      'Oppo F25 Pro 5G',
      'Oppo A79 5G',
      'Oppo A59 5G',
      'Oppo Find N3 Flip',
    ],
  },
  {
    id: 'motorola',
    name: 'Motorola',
    logo: 'Ⓜ️',
    popularModels: [
      'Moto Edge 50 Fusion',
      'Moto Edge 50 Pro',
      'Moto G84 5G',
      'Moto G64 5G',
      'Moto G34 5G',
      'Moto Edge 40 Neo',
      'Moto Razr 40 Ultra',
    ],
  },
  {
    id: 'poco',
    name: 'Poco',
    logo: '⚡',
    popularModels: [
      'Poco X6 Pro 5G',
      'Poco X6 5G',
      'Poco F6 5G',
      'Poco M6 Pro 5G',
      'Poco C65',
      'Poco X5 Pro',
    ],
  },
  {
    id: 'iqoo',
    name: 'iQOO',
    logo: '🚀',
    popularModels: [
      'iQOO 12 5G',
      'iQOO Neo 9 Pro',
      'iQOO Z9 5G',
      'iQOO Z9x 5G',
      'iQOO 11',
      'iQOO Neo 7',
    ],
  },
  {
    id: 'nokia',
    name: 'Nokia',
    logo: '📞',
    popularModels: [
      'Nokia G42 5G',
      'Nokia C32',
      'Nokia C22',
      'Nokia G21',
      'Nokia 2660 Flip',
      'Nokia 105',
    ],
  },
  {
    id: 'other',
    name: 'Other Brand',
    logo: '🔧',
    popularModels: [
      'Nothing Phone (2)',
      'Nothing Phone (2a)',
      'Google Pixel 8 Pro',
      'Google Pixel 8',
      'Google Pixel 7a',
      'Infinix Note 40 Pro',
      'Tecno Camon 30',
      'Lava Agni 2 5G',
      'Other Smartphone Model',
    ],
  },
];

export const SITAPUR_REPAIR_SERVICES: RepairServiceItem[] = [
  {
    id: 'screen',
    title: 'Screen Replacement',
    shortDesc: 'Original & OEM glass display replacement with touch calibration',
    startingPrice: 1499,
    estimatedMinutes: 40,
    warrantyPeriod: '6 Months Replacement Warranty',
    icon: 'Smartphone',
    popular: true,
  },
  {
    id: 'battery',
    title: 'Battery Replacement',
    shortDesc: 'High-capacity certified battery to resolve fast draining or swelling',
    startingPrice: 799,
    estimatedMinutes: 30,
    warrantyPeriod: '6 Months Warranty',
    icon: 'BatteryCharging',
    popular: true,
  },
  {
    id: 'charging',
    title: 'Charging Problem',
    shortDesc: 'Fix loose jack, slow charging, damaged Type-C / Lightning port',
    startingPrice: 499,
    estimatedMinutes: 25,
    warrantyPeriod: '3 Months Warranty',
    icon: 'Zap',
    popular: true,
  },
  {
    id: 'audio',
    title: 'Speaker/Microphone Repair',
    shortDesc: 'Fix low sound, crackling speaker, or caller cannot hear you',
    startingPrice: 399,
    estimatedMinutes: 25,
    warrantyPeriod: '3 Months Warranty',
    icon: 'Volume2',
  },
  {
    id: 'camera',
    title: 'Camera Repair',
    shortDesc: 'Repair blurry photos, cracked camera glass, or black screen',
    startingPrice: 699,
    estimatedMinutes: 35,
    warrantyPeriod: '3 Months Warranty',
    icon: 'Camera',
  },
  {
    id: 'water_damage',
    title: 'Water Damage',
    shortDesc: 'Deep ultrasonic motherboard chemical wash & circuit revival',
    startingPrice: 899,
    estimatedMinutes: 60,
    warrantyPeriod: '30 Days Testing Warranty',
    icon: 'Droplets',
    popular: true,
  },
  {
    id: 'software',
    title: 'Software Problem',
    shortDesc: 'Bootloop fix, OS flashing, pattern unlock, virus removal',
    startingPrice: 399,
    estimatedMinutes: 30,
    warrantyPeriod: '1 Month Warranty',
    icon: 'Cpu',
  },
  {
    id: 'motherboard',
    title: 'Motherboard Repair',
    shortDesc: 'Micro-soldering, short-circuit troubleshooting & IC replacement',
    startingPrice: 1899,
    estimatedMinutes: 75,
    warrantyPeriod: '3 Months Warranty',
    icon: 'Layers',
  },
  {
    id: 'back_panel',
    title: 'Back Panel Replacement',
    shortDesc: 'Cracked back glass, rear body housing, frame change',
    startingPrice: 599,
    estimatedMinutes: 30,
    warrantyPeriod: '3 Months Warranty',
    icon: 'ShieldCheck',
  },
  {
    id: 'power_boot',
    title: 'Power/Boot Problem',
    shortDesc: 'Phone not turning on, restarting continuously or dead state',
    startingPrice: 499,
    estimatedMinutes: 45,
    warrantyPeriod: '3 Months Warranty',
    icon: 'Power',
  },
  {
    id: 'network',
    title: 'Network Problem',
    shortDesc: 'No signal, SIM not detected, Wi-Fi or Bluetooth connectivity error',
    startingPrice: 499,
    estimatedMinutes: 35,
    warrantyPeriod: '3 Months Warranty',
    icon: 'Wifi',
  },
  {
    id: 'other_repair',
    title: 'Other Repair',
    shortDesc: 'Physical button repair, sensor issue, or comprehensive diagnosis',
    startingPrice: 299,
    estimatedMinutes: 30,
    warrantyPeriod: '3 Months Warranty',
    icon: 'Wrench',
  },
];

export const SERVICE_PROBLEMS = [
  'Broken Screen',
  'Display Not Working',
  'Battery Draining',
  'Phone Not Charging',
  'Charging Port Damaged',
  'Speaker Problem',
  'Mic Problem',
  'Camera Problem',
  'Phone Heating',
  'Water Damage',
  'Software Issue',
  'Phone Not Turning On',
  'Network Problem',
  'Back Glass Broken',
  'Other',
];

export const SERVICEABLE_AREAS: ServiceArea[] = [
  { id: 'area_1', name: 'Civil Lines', pincode: '261001', isServiceable: true, hubName: 'Central Sitapur Hub', deliveryFee: 0 },
  { id: 'area_2', name: 'Sitapur City / Chowk', pincode: '261001', isServiceable: true, hubName: 'Central Sitapur Hub', deliveryFee: 0 },
  { id: 'area_3', name: 'Station Road', pincode: '261001', isServiceable: true, hubName: 'Railway Station Service Center', deliveryFee: 0 },
  { id: 'area_4', name: 'Subhash Nagar', pincode: '261001', isServiceable: true, hubName: 'Central Sitapur Hub', deliveryFee: 0 },
  { id: 'area_5', name: 'Awas Vikas Colony', pincode: '261001', isServiceable: true, hubName: 'North Sitapur Hub', deliveryFee: 0 },
  { id: 'area_6', name: 'Khairabad', pincode: '261111', isServiceable: true, hubName: 'Khairabad Doorstep Unit', deliveryFee: 49 },
  { id: 'area_7', name: 'Lalbagh', pincode: '261001', isServiceable: true, hubName: 'Central Sitapur Hub', deliveryFee: 0 },
  { id: 'area_8', name: 'Bus Stand Area / Galla Mandi', pincode: '261001', isServiceable: true, hubName: 'Bus Stand Desk', deliveryFee: 0 },
  { id: 'area_9', name: 'Prem Nagar', pincode: '261001', isServiceable: true, hubName: 'Central Sitapur Hub', deliveryFee: 0 },
  { id: 'area_10', name: 'Transport Nagar', pincode: '261001', isServiceable: true, hubName: 'North Sitapur Hub', deliveryFee: 0 },
  { id: 'area_11', name: 'Eye Hospital Road', pincode: '261001', isServiceable: true, hubName: 'Central Sitapur Hub', deliveryFee: 0 },
  { id: 'area_12', name: 'Maholi Road Sector', pincode: '261002', isServiceable: true, hubName: 'West Sitapur Hub', deliveryFee: 49 },
  { id: 'area_13', name: 'Laharpur Road', pincode: '261111', isServiceable: true, hubName: 'East Sitapur Hub', deliveryFee: 49 },
  { id: 'area_14', name: 'Hargaon (Nearby)', pincode: '261121', isServiceable: false, hubName: 'Outstation Zone', deliveryFee: 99 },
];

export const VALID_PINCODES = ['261001', '261002', '261111'];

export const TECHNICIANS_DATA: Technician[] = [
  {
    id: 'tech_1',
    name: 'Piyush',
    phone: '+91 85639 75583',
    email: 'piyush@sitapurmobilecare.in',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    experience: '8+ Years Mobile Hardware Specialist',
    skills: ['All Smartphone Brands', 'Screen & OLED Replacement', 'Micro-soldering', 'Battery Revive', 'Water Damage'],
    serviceAreas: ['Civil Lines', 'Station Road', 'Sitapur City', 'Lalbagh', 'Khairabad', 'Awas Vikas Colony', 'Prem Nagar', 'Subhash Nagar'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availableHours: '8:30 AM - 9:30 PM',
    isVerified: true,
    isActive: true,
    rating: 4.9,
    completedJobs: 2500,
    todayEarnings: 0,
    monthlyEarnings: 0,
  },
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev_1',
    bookingId: 'SMC-2026-000104',
    customerName: 'Verified Customer',
    area: 'Civil Lines, Sitapur',
    brand: 'iPhone 13',
    repairType: 'Screen Replacement',
    rating: 5,
    comment:
      'Superb doorstep service! Piyush arrived on time at my office near Civil Lines. Replaced my broken iPhone screen right in front of me with testing. Warranty card given.',
    isApproved: true,
    date: 'Recently',
  },
  {
    id: 'rev_2',
    bookingId: 'SMC-2026-000098',
    customerName: 'Verified Customer',
    area: 'Awas Vikas Colony, Sitapur',
    brand: 'Samsung Galaxy M34',
    repairType: 'Battery Replacement',
    rating: 5,
    comment:
      'My phone was shutting down at 40%. Piyush came to my home, installed a brand new original battery in 30 minutes. Extremely polite and genuine service.',
    isApproved: true,
    date: 'Recently',
  },
  {
    id: 'rev_3',
    bookingId: 'SMC-2026-000091',
    customerName: 'Verified Customer',
    area: 'Station Road, Sitapur',
    brand: 'Redmi Note 12 Pro',
    repairType: 'Charging Port Damaged',
    rating: 5,
    comment:
      'Very quick and professional. Repaired the charging port in 20 minutes at Station Road. Genuine parts and honest quote. 100% recommended!',
    isApproved: true,
    date: 'Recently',
  },
  {
    id: 'rev_4',
    bookingId: 'SMC-2026-000085',
    customerName: 'Verified Customer',
    area: 'Eye Hospital Road, Sitapur',
    brand: 'OnePlus 11R',
    repairType: 'Back Glass Broken',
    rating: 5,
    comment:
      'Booked online via WhatsApp. Piyush arrived right on time. Perfectly sealed the back glass with factory finish. Genuine doorstep service in Sitapur!',
    isApproved: true,
    date: 'Recently',
  },
];

export const INITIAL_SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'booking_sample_active',
    bookingId: 'SMC-2026-000123',
    customerName: 'Customer (Sitapur)',
    customerPhone: '+91 85639 75583',
    alternatePhone: '+91 85639 75583',
    brand: 'Samsung',
    model: 'Galaxy S24',
    problems: ['Broken Screen', 'Phone Not Charging'],
    problemDescription: 'Glass cracked and charging cable slips out. Need free doorstep diagnosis.',
    address: 'Near Gandhi Park, Lalbagh',
    landmark: 'Behind Gandhi Park',
    area: 'Lalbagh',
    pincode: '261001',
    latitude: 27.5684,
    longitude: 80.6829,
    appointmentDate: 'Today',
    appointmentSlot: '12:00 PM – 3:00 PM',
    estimatedPrice: 0,
    finalPrice: 0,
    status: 'technician_on_the_way',
    paymentStatus: 'pending',
    paymentMethod: 'upi',
    technicianId: 'tech_1',
    technicianName: 'Piyush',
    technicianPhone: '+91 85639 75583',
    technicianRating: 4.9,
    technicianPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    quotation: {
      repairType: 'OLED Display & Type-C Charging Port Replacement',
      partsRequired: 'Original AMOLED panel with frame, Sub-board charging jack',
      partsCost: 0,
      labourCost: 0,
      visitCharge: 0,
      discount: 0,
      finalTotal: 0,
      estimatedCompletionTime: '35 minutes',
      warrantyPeriod: '6 Months Replacement Warranty',
      technicianNotes: 'Free on-site inspection. Honest quote provided before starting repair work.',
      createdAt: '2026-09-06T10:15:00Z',
    },
    quotationStatus: 'pending_approval',
    createdAt: '2026-09-06T09:30:00Z',
    updatedAt: '2026-09-06T10:15:00Z',
  },
];

export const SAMPLE_BOOKINGS = INITIAL_SAMPLE_BOOKINGS;
export const SITAPUR_TECHNICIANS = TECHNICIANS_DATA.map((t) => ({
  ...t,
  isAvailable: t.isActive,
}));
export const SITAPUR_REVIEWS = INITIAL_REVIEWS;

export const SAMPLE_SUPPORT_TICKETS = [
  {
    id: 'ticket_1',
    ticketNumber: 'TKT-2026-0041',
    bookingId: 'SMC-2026-000104',
    customerName: 'Customer (Civil Lines)',
    customerPhone: '+91 85639 75583',
    subject: 'Warranty Certificate & Invoice Confirmation',
    category: 'Repair Warranty' as const,
    message: 'Screen replacement completed smoothly. Just wanted the digital invoice PDF sent on WhatsApp.',
    status: 'resolved' as const,
    createdAt: 'Yesterday, 4:20 PM',
  },
  {
    id: 'ticket_2',
    ticketNumber: 'TKT-2026-0042',
    bookingId: 'SMC-2026-000123',
    customerName: 'Customer (Lalbagh)',
    customerPhone: '+91 85639 75583',
    subject: 'Doorstep Technician Arrival',
    category: 'Booking Help' as const,
    message: 'Technician Piyush is en-route. Will call 10 mins before reaching location.',
    status: 'in_progress' as const,
    createdAt: 'Today, 11:30 AM',
  },
];

export interface SitapurSeoPage {
  slug: string;
  title: string;
  metaDescription: string;
  brand?: string;
  repairType?: string;
  locality?: string;
  highlights: string[];
  content: string;
}

export const SITAPUR_SEO_PAGES: SitapurSeoPage[] = [
  {
    slug: 'doorstep-mobile-repair-sitapur',
    title: 'Doorstep Mobile Repair in Sitapur — 30 Min Home Service',
    metaDescription:
      'Book certified smartphone technicians at your home or office in Sitapur. 100% genuine parts, instant quotation, up to 6 months warranty.',
    locality: 'All Sitapur',
    highlights: [
      'Repaired in 30-45 minutes in front of your eyes',
      'Zero visit charges across Sitapur city zones',
      'No data privacy risk — you watch the entire process',
      'Cash on Delivery & UPI accepted after testing',
    ],
    content:
      'Piyush Sitapur Mobile Care brings certified mobile repair directly to your location anywhere in Sitapur, UP. No more leaving your phone with shady shops in the market for days. Whether you are located near Civil Lines, Station Road, Khairabad, or Awas Vikas, our doorstep mobile repair service brings professional equipment directly to your doorstep.',
  },
  {
    slug: 'mobile-screen-repair-sitapur',
    title: 'Mobile Screen Replacement in Sitapur — Original Display with 6M Warranty',
    metaDescription:
      'Get cracked smartphone screen fixed at your doorstep in Sitapur. Original OLED, AMOLED, and FHD+ displays with warranty.',
    repairType: 'Screen Replacement',
    locality: 'Sitapur District',
    highlights: [
      'Original & OEM Grade Gorilla Glass Displays',
      'Touch calibration and true-tone restore',
      'Free tempered glass installation with every screen replacement',
      'Full replacement guarantee',
    ],
    content:
      'Cracked your phone screen in Sitapur? Piyush Sitapur Mobile Care uses genuine display assemblies with premium oleophobic coating and original touch response.',
  },
  {
    slug: 'iphone-repair-sitapur',
    title: 'iPhone Repair in Sitapur — Certified Doorstep Apple Tech',
    metaDescription:
      'Doorstep Apple iPhone screen, battery, camera, and charging port repair in Sitapur. Genuine grade parts with warranty.',
    brand: 'Apple',
    repairType: 'Screen & Battery',
    locality: 'Sitapur City',
    highlights: [
      'iPhone 11 through iPhone 15 Pro Max supported',
      'Battery health 100% calibration',
      'Water resistance gasket replacement applied',
      'Face ID & True Tone retention preserved',
    ],
    content:
      'Searching for a reliable Apple iPhone repair center in Sitapur? Avoid traveling to Lucknow! Our senior technicians carry genuine OLED displays, high-density Apple batteries, and water-resistance seals for all iPhone models.',
  },
  {
    slug: 'samsung-mobile-repair-sitapur',
    title: 'Samsung Mobile Repair in Sitapur — Galaxy S & M Series Doorstep Service',
    metaDescription:
      'Doorstep Samsung smartphone repair in Sitapur. Galaxy S24, S23, A-series, and M-series screens, charging ports & batteries.',
    brand: 'Samsung',
    repairType: 'Display & Motherboard',
    locality: 'Civil Lines & Sitapur',
    highlights: [
      'Dynamic AMOLED 2X displays',
      'Super Fast Charging sub-board port repair',
      'Genuine Samsung high-capacity battery packs',
      'In-display fingerprint sensor calibration',
    ],
    content:
      'From flagships like the Galaxy S24 Ultra to popular models like Galaxy A54 and M34, get your Samsung smartphone repaired at your doorstep in Sitapur in under 45 minutes.',
  },
  {
    slug: 'realme-redmi-repair-sitapur',
    title: 'Realme & Redmi Repair in Sitapur — Fast Doorstep Service',
    metaDescription:
      'Affordable doorstep repair for Redmi Note and Realme series in Sitapur. Charging ports, batteries & screens fixed in 30 mins.',
    brand: 'Redmi',
    repairType: 'Screen & Charging',
    locality: 'Station Road & Khairabad',
    highlights: [
      'Quick 30-min turnaround for charging ports & screens',
      'Affordable, student & family friendly rates',
      'Genuine fast-charge Type-C boards',
      '6 Months warranty on display and battery',
    ],
    content:
      'Redmi and Realme phones are the daily drivers of thousands in Sitapur. When a charging port gets loose or a screen breaks, our local technicians carry matching parts for rapid same-day doorstep repairs.',
  },
  {
    slug: 'civil-lines-mobile-repair',
    title: 'Mobile Repair in Civil Lines Sitapur — 20 Min Rapid Arrival',
    metaDescription:
      'Doorstep phone repair service in Civil Lines, Sitapur (261001). Near Collectorate, DM Bungalow, and Eye Hospital.',
    locality: 'Civil Lines',
    highlights: [
      'Under 25 minutes technician arrival in Civil Lines',
      'Home or office visits across Court Road and VIP areas',
      'All major smartphone brands covered',
      'Digital tax invoice with GST',
    ],
    content:
      'Residents and office professionals in Civil Lines, Sitapur can now book smartphone repairs during lunch breaks or work hours without stepping outside. Technician brings mobile workbench and completes repairs on the spot.',
  },
  {
    slug: 'station-road-mobile-repair',
    title: 'Mobile Repair in Station Road Sitapur — Instant Technician Dispatch',
    metaDescription:
      'Doorstep phone repair at Station Road, Sitapur (261001). Near Railway Station, Gandhi Park, and Main Bazaar.',
    locality: 'Station Road',
    highlights: [
      'Instant dispatch from Station Road central hub',
      'Repairs done in front of shopkeepers and residents',
      'Transparent parts pricing with zero hidden fees',
    ],
    content:
      'Located near Sitapur Railway Station, Galla Mandi, or Station Road Market? Our central dispatch hub is located right on Station Road for lightning-fast technician arrivals.',
  },
  {
    slug: 'khairabad-mobile-repair',
    title: 'Mobile Repair in Khairabad Sitapur — Doorstep Service (261111)',
    metaDescription:
      'Doorstep smartphone repair in Khairabad town and highway sector. Screen, battery, and port replacement at home.',
    locality: 'Khairabad',
    highlights: [
      'Daily scheduled doorstep routes across Khairabad',
      'Full 6-month warranty backed by Sitapur central hub',
      'Expert technicians with multi-brand inventory',
    ],
    content:
      'Khairabad residents no longer need to take an auto into Sitapur city to get their smartphones fixed. Piyush Sitapur Mobile Care covers Khairabad daily with complete warranty support.',
  },
];

export const SITAPUR_FAQS = [
  {
    q: 'How does doorstep mobile repair in Sitapur work?',
    a: 'You select your mobile brand, model, and the issue online or via WhatsApp (+91 85639 75583). Choose your address in Sitapur and preferred time slot. Piyush Sitapur Mobile Care visits your doorstep with all required tools and genuine parts, inspects your device for free, and provides an honest upfront estimate before starting the repair.',
  },
  {
    q: 'Is my personal data (photos, messages, UPI) safe during repair?',
    a: '100% yes. Because the repair happens entirely in front of your eyes at your home or office, you never hand over your unlock pattern or password. Unlike traditional market shops where phones are kept overnight, your data never leaves your sight.',
  },
  {
    q: 'What is the warranty on mobile repairs in Sitapur?',
    a: 'We provide up to 6 months comprehensive replacement warranty on screens and batteries, and 3 months warranty on charging ports, speakers, and cameras. A digital invoice is issued immediately upon completion.',
  },
  {
    q: 'Are there any extra charges for technician home visit in Sitapur?',
    a: 'No! Doorstep visit and doorstep diagnosis are completely FREE across Sitapur city areas (Civil Lines, Station Road, Lalbagh, Awas Vikas, Subhash Nagar). You only pay for the parts if you decide to proceed with the repair.',
  },
  {
    q: 'What payment modes are accepted?',
    a: 'We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm, BHIM), debit/credit cards, and Razorpay online payments after the repair is completed.',
  },
  {
    q: 'Which areas of Sitapur do you serve?',
    a: 'We cover Civil Lines, Station Road, Khairabad, Awas Vikas Colony, Subhash Nagar, Lalbagh, Prem Nagar, Eye Hospital Road, Transport Nagar, Bus Stand Area, and surrounding localities with pincodes 261001, 261002, and 261111.',
  },
];

