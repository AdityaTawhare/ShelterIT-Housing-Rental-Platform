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