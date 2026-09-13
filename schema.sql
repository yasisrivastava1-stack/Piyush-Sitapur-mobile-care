-- ====================================================================
-- SITAPUR MOBILE CARE - RELATIONAL DATABASE SCHEMA (PostgreSQL)
-- Architecture designed for Sitapur, UP with multi-city expansion support
-- ====================================================================

-- 1. USERS & ROLES
CREATE TYPE user_role AS ENUM ('customer', 'technician', 'admin', 'super_admin');
CREATE TYPE booking_status_enum AS ENUM (
  'booking_received',
  'technician_assigning',
  'technician_assigned',
  'technician_on_the_way',
  'technician_arrived',
  'device_inspection',
  'repair_started',
  'repair_completed',
  'payment_completed',
  'booking_closed',
  'cancelled'
);
CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_mode_enum AS ENUM ('cash_on_delivery', 'upi', 'razorpay', 'payment_link');
CREATE TYPE ticket_status_enum AS ENUM ('open', 'in_progress', 'resolved', 'closed');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    role user_role DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMERS
CREATE TABLE customers (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    alternate_phone VARCHAR(15),
    notes TEXT,
    total_bookings INT DEFAULT 0
);

-- 3. TECHNICIANS
CREATE TABLE technicians (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    experience_years NUMERIC(3,1) DEFAULT 2.0,
    rating NUMERIC(2,1) DEFAULT 4.9,
    completed_jobs INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE,
    profile_photo_url TEXT,
    identity_proof_type VARCHAR(50),
    identity_proof_number VARCHAR(100),
    today_earnings NUMERIC(10,2) DEFAULT 0.00,
    monthly_earnings NUMERIC(10,2) DEFAULT 0.00,
    commission_percentage NUMERIC(4,2) DEFAULT 75.00
);

-- 4. ADMINS
CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{"all": true}'
);

-- 5. SERVICE AREAS (Sitapur focus with multi-city expansion)
CREATE TABLE service_areas (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) DEFAULT 'Sitapur',
    state_name VARCHAR(100) DEFAULT 'Uttar Pradesh',
    area_name VARCHAR(150) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_serviceable BOOLEAN DEFAULT TRUE,
    hub_center VARCHAR(150) DEFAULT 'Civil Lines Hub',
    standard_visit_charge NUMERIC(8,2) DEFAULT 99.00
);

-- 6. TECHNICIAN SERVICE AREAS (Many-to-Many)
CREATE TABLE technician_service_areas (
    technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE,
    area_id INT REFERENCES service_areas(id) ON DELETE CASCADE,
    PRIMARY KEY (technician_id, area_id)
);

-- 7. TECHNICIAN AVAILABILITY
CREATE TABLE technician_availability (
    id SERIAL PRIMARY KEY,
    technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE,
    day_of_week VARCHAR(15) NOT NULL,
    slot_morning BOOLEAN DEFAULT TRUE,
    slot_afternoon BOOLEAN DEFAULT TRUE,
    slot_evening_1 BOOLEAN DEFAULT TRUE,
    slot_evening_2 BOOLEAN DEFAULT TRUE
);

-- 8. CUSTOMER ADDRESSES
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home',
    address_line TEXT NOT NULL,
    landmark VARCHAR(200),
    area_id INT REFERENCES service_areas(id),
    pincode VARCHAR(10) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. BRANDS & MOBILE MODELS
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) UNIQUE NOT NULL,
    slug VARCHAR(80) UNIQUE NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE mobile_models (
    id SERIAL PRIMARY KEY,
    brand_id INT REFERENCES brands(id) ON DELETE CASCADE,
    model_name VARCHAR(120) NOT NULL,
    release_year INT,
    is_popular BOOLEAN DEFAULT FALSE,
    screen_type VARCHAR(50),
    battery_capacity VARCHAR(30)
);

-- 10. REPAIR SERVICES & PARTS
CREATE TABLE repair_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    base_service_charge NUMERIC(8,2) DEFAULT 299.00,
    estimated_duration_minutes INT DEFAULT 45,
    default_warranty_days INT DEFAULT 90,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE parts (
    id SERIAL PRIMARY KEY,
    model_id INT REFERENCES mobile_models(id) ON DELETE CASCADE,
    repair_service_id INT REFERENCES repair_services(id) ON DELETE CASCADE,
    part_name VARCHAR(150) NOT NULL,
    part_quality VARCHAR(50) DEFAULT 'OEM Grade-A',
    cost_price NUMERIC(10,2) NOT NULL,
    selling_price NUMERIC(10,2) NOT NULL,
    stock_quantity INT DEFAULT 10,
    warranty_months INT DEFAULT 6
);

-- 11. DYNAMIC SERVICE PRICING
CREATE TABLE service_prices (
    id SERIAL PRIMARY KEY,
    brand_id INT REFERENCES brands(id),
    model_id INT REFERENCES mobile_models(id),
    service_id INT REFERENCES repair_services(id),
    estimated_parts_cost NUMERIC(8,2) NOT NULL,
    technician_charge NUMERIC(8,2) NOT NULL,
    visit_charge NUMERIC(8,2) DEFAULT 99.00,
    discount NUMERIC(8,2) DEFAULT 0.00
);

-- 12. BOOKINGS
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id VARCHAR(30) UNIQUE NOT NULL, -- e.g. SMC-2026-000123
    customer_id UUID REFERENCES users(id),
    technician_id UUID REFERENCES technicians(id),
    brand_id INT REFERENCES brands(id),
    model_id INT REFERENCES mobile_models(id),
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    alternate_phone VARCHAR(15),
    customer_address TEXT NOT NULL,
    landmark VARCHAR(200),
    area_name VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    appointment_date DATE NOT NULL,
    appointment_slot VARCHAR(50) NOT NULL,
    estimated_price NUMERIC(10,2) NOT NULL,
    final_price NUMERIC(10,2),
    booking_status booking_status_enum DEFAULT 'booking_received',
    payment_status payment_status_enum DEFAULT 'pending',
    payment_mode payment_mode_enum DEFAULT 'cash_on_delivery',
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. BOOKING ITEMS (Selected Problems)
CREATE TABLE booking_items (
    id SERIAL PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    service_id INT REFERENCES repair_services(id),
    service_name VARCHAR(150) NOT NULL,
    item_estimated_price NUMERIC(8,2) NOT NULL
);

-- 14. DEVICE PHOTOS
CREATE TABLE device_photos (
    id SERIAL PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. BOOKING STATUS HISTORY (Full Audit Trail)
CREATE TABLE booking_status_history (
    id SERIAL PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    status booking_status_enum NOT NULL,
    notes TEXT,
    changed_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. TECHNICIAN ASSIGNMENTS
CREATE TABLE technician_assignments (
    id SERIAL PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(30) DEFAULT 'assigned' -- assigned, accepted, rejected, reallocated
);

-- 17. REPAIR ESTIMATES & QUOTATIONS
CREATE TABLE repair_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES technicians(id),
    repair_type VARCHAR(150) NOT NULL,
    parts_required TEXT NOT NULL,
    parts_cost NUMERIC(10,2) NOT NULL,
    labour_cost NUMERIC(10,2) NOT NULL,
    visit_charge NUMERIC(10,2) DEFAULT 99.00,
    discount NUMERIC(10,2) DEFAULT 0.00,
    final_total NUMERIC(10,2) NOT NULL,
    estimated_completion_time VARCHAR(50),
    warranty_period VARCHAR(50) DEFAULT '6 Months Warranty',
    technician_notes TEXT,
    customer_approval_status VARCHAR(30) DEFAULT 'pending', -- pending, approved, rejected
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. PAYMENTS
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    transaction_id VARCHAR(100) UNIQUE,
    amount NUMERIC(10,2) NOT NULL,
    payment_mode payment_mode_enum NOT NULL,
    payment_status payment_status_enum DEFAULT 'pending',
    gateway_response JSONB,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- 19. INVOICES
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. SMC-INV-2026-0012
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    business_name VARCHAR(150) DEFAULT 'Sitapur Mobile Care',
    business_address TEXT DEFAULT 'Shop 12, Station Road, Near Eye Hospital, Sitapur, UP 261001',
    gst_number VARCHAR(20) DEFAULT '09AAACS1234F1Z8',
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    customer_address TEXT NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    tax_amount NUMERIC(10,2) DEFAULT 0.00,
    discount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    warranty_terms TEXT DEFAULT '6 Months replacement warranty on screen & battery.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. REVIEWS & RATINGS
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID REFERENCES users(id),
    technician_id UUID REFERENCES technicians(id),
    customer_name VARCHAR(120) NOT NULL,
    area_name VARCHAR(100),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. COUPONS & DISCOUNTS
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL, -- e.g. SITAPUR100, FIRSTREPAIR
    discount_type VARCHAR(20) DEFAULT 'flat', -- flat or percentage
    discount_value NUMERIC(8,2) NOT NULL,
    min_booking_amount NUMERIC(8,2) DEFAULT 500.00,
    is_active BOOLEAN DEFAULT TRUE,
    valid_until TIMESTAMP WITH TIME ZONE
);

-- 22. NOTIFICATIONS
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    recipient_phone VARCHAR(15) NOT NULL,
    recipient_email VARCHAR(255),
    channel VARCHAR(30) NOT NULL, -- SMS, WhatsApp, Email, In-app
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    is_delivered BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 23. SUPPORT TICKETS
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id VARCHAR(30) UNIQUE NOT NULL, -- e.g. TKT-2026-904
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    category VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status ticket_status_enum DEFAULT 'open',
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ====================================================================
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_date ON bookings(appointment_date);
CREATE INDEX idx_bookings_technician ON bookings(technician_id);
CREATE INDEX idx_bookings_pincode ON bookings(pincode);
CREATE INDEX idx_service_areas_pincode ON service_areas(pincode);
