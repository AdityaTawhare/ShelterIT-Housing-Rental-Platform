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

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = user_id);

-- Properties policies
CREATE POLICY "Anyone can view properties" ON properties
    FOR SELECT USING (true);

CREATE POLICY "Hosts can insert their own properties" ON properties
    FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own properties" ON properties
    FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own properties" ON properties
    FOR DELETE USING (auth.uid() = host_id);

-- Bookings policies
CREATE POLICY "Users can view their bookings" ON bookings
    FOR SELECT USING (auth.uid() = guest_id OR auth.uid() IN (
        SELECT host_id FROM properties WHERE property_id = bookings.property_id
    ));

CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = guest_id);

CREATE POLICY "Users can update their bookings" ON bookings
    FOR UPDATE USING (auth.uid() = guest_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Guests can create reviews for their bookings" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = guest_id);

-- Favorites policies
CREATE POLICY "Users can manage their favorites" ON favorites
    FOR ALL USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view their messages" ON messages
    FOR SELECT USING (auth.uid() IN (sender_id, receiver_id));

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create functions
-- Function to calculate average rating
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE properties
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE property_id = NEW.property_id
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE property_id = NEW.property_id
        )
    WHERE property_id = NEW.property_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating property rating
CREATE TRIGGER update_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_property_rating();

-- Function to check booking availability
CREATE OR REPLACE FUNCTION check_booking_availability(
    p_property_id UUID,
    p_check_in DATE,
    p_check_out DATE
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM bookings
        WHERE property_id = p_property_id
        AND status != 'cancelled'
        AND (
            (check_in_date <= p_check_in AND check_out_date > p_check_in)
            OR
            (check_in_date < p_check_out AND check_out_date >= p_check_out)
            OR
            (check_in_date >= p_check_in AND check_out_date <= p_check_out)
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate total price
CREATE OR REPLACE FUNCTION calculate_total_price(
    p_property_id UUID,
    p_check_in DATE,
    p_check_out DATE
)
RETURNS NUMERIC AS $$
DECLARE
    v_total NUMERIC;
    v_days INTEGER;
    v_property properties%ROWTYPE;
BEGIN
    SELECT * INTO v_property FROM properties WHERE property_id = p_property_id;
    v_days := p_check_out - p_check_in;
    
    IF v_property.property_type = 'rental' THEN
        IF v_days >= 30 THEN
            v_total := (v_days / 30.0) * v_property.monthly_rent;
        ELSE
            v_total := v_days * v_property.daily_rent;
        END IF;
    ELSE
        v_total := v_days * v_property.daily_rate;
    END IF;
    
    RETURN v_total;
END;
$$ LANGUAGE plpgsql; 