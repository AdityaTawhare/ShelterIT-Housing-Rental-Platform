-- Enable extensions for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    profile_image VARCHAR(255),
    is_host BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
    property_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    property_type TEXT NOT NULL CHECK (property_type IN ('rental', 'lodge')),
    location VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    monthly_rent NUMERIC(10, 2),
    daily_rent NUMERIC(10, 2),
    daily_rate NUMERIC(10, 2),
    image VARCHAR(255) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Amenities table
CREATE TABLE amenities (
    amenity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50)
);

-- Property amenities mapping
CREATE TABLE property_amenities (
    property_id UUID NOT NULL,
    amenity_id UUID NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id) ON DELETE CASCADE
);

-- Rules table
CREATE TABLE rules (
    rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Property rules mapping
CREATE TABLE property_rules (
    property_id UUID NOT NULL,
    rule_id UUID NOT NULL,
    PRIMARY KEY (property_id, rule_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (rule_id) REFERENCES rules(rule_id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE bookings (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    guest_id UUID NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_guests INT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    property_id UUID NOT NULL,
    guest_id UUID NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Favorites table
CREATE TABLE favorites (
    user_id UUID NOT NULL,
    property_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    property_id UUID,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE SET NULL
);

-- Insert sample amenities
INSERT INTO amenities (name, icon) VALUES
('WiFi', 'wifi'),
('Parking', 'parking'),
('AC', 'ac'),
('Kitchen', 'kitchen'),
('Laundry', 'laundry'),
('Restaurant', 'restaurant'),
('Room Service', 'room-service'),
('Heating', 'heating'),
('Gym', 'gym'),
('Swimming Pool', 'pool'),
('Spa', 'spa'),
('Cultural Shows', 'cultural-shows'),
('Boat Ride', 'boat-ride'),
('Garden', 'garden'),
('Security', 'security'),
('Trekking Guide', 'trekking-guide');

-- Insert sample rules
INSERT INTO rules (name) VALUES
('No pets allowed'),
('No smoking'),
('Minimum stay required'),
('Check-in: 2 PM'),
('Check-out: 12 PM'),
('No outside food allowed'),
('Dress code for restaurant'),
('No parties or events'),
('Quiet hours'),
('No unregistered guests');

-- Create indexes
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_price ON properties(monthly_rent, daily_rent, daily_rate);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_messages_users ON messages(sender_id, receiver_id);

-- Views

-- Property listings view
CREATE VIEW property_listings AS
SELECT 
    p.property_id,
    p.title,
    p.location,
    p.property_type,
    p.monthly_rent,
    p.daily_rent,
    p.daily_rate,
    p.image,
    p.rating,
    p.total_reviews,
    u.full_name AS host_name,
    u.phone_number AS host_phone,
    u.email AS host_email
FROM properties p
JOIN users u ON p.host_id = u.user_id
WHERE p.is_available = TRUE;

-- Booking history view
CREATE VIEW booking_history AS
SELECT 
    b.booking_id,
    p.title AS property_title,
    u.full_name AS guest_name,
    b.check_in_date,
    b.check_out_date,
    b.total_amount,
    b.status,
    b.payment_status
FROM bookings b
JOIN properties p ON b.property_id = p.property_id
JOIN users u ON b.guest_id = u.user_id;
