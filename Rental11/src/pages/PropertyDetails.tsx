import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, User, Phone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Property {
  id: string;
  title: string;
  location: string;
  image: string;
  rating: number;
  type: 'rental' | 'lodge';
  amenities: string[];
  rules: string[];
  description: string;
}

interface RentalProperty extends Property {
  type: 'rental';
  monthlyRent: number;
  dailyRent: number;
}

interface LodgeProperty extends Property {
  type: 'lodge';
  dailyRate: number;
}

type PropertyData = {
  [key: string]: RentalProperty | LodgeProperty;
};

// This would typically come from an API or database
const propertyData: PropertyData = {
  '1': {
    id: '1',
    title: 'Luxury Apartment in Bandra',
    location: 'Mumbai, Maharashtra',
    monthlyRent: 25000,
    dailyRent: 1200,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    type: 'rental',
    amenities: ['WiFi', 'Parking', 'AC', 'Kitchen', 'Laundry', 'Gym', 'Swimming Pool', '24/7 Security'],
    rules: ['No pets allowed', 'No smoking', 'Minimum 6 months stay', 'No parties or events'],
    description: 'A luxurious apartment in the heart of Bandra with modern amenities and stunning views. Perfect for professionals and families looking for a premium living experience.'
  },
  '2': {
    id: '2',
    title: 'Mountain View Lodge',
    location: 'Leh, Ladakh',
    dailyRate: 3500,
    image: '/house1.jpg',
    rating: 4.9,
    type: 'lodge',
    amenities: ['WiFi', 'Restaurant', 'Room Service', 'Heating', 'Tour Guide Service', 'Cultural Shows'],
    rules: ['Check-in: 2 PM', 'Check-out: 12 PM', 'No outside food allowed', 'Dress code for restaurant'],
    description: 'Experience the majestic Himalayas from this cozy lodge. Perfect for adventure seekers and nature lovers.'
  },
  '3': {
    id: '3',
    title: 'Modern Studio in Koregaon Park',
    location: 'Pune, Maharashtra',
    monthlyRent: 18000,
    dailyRent: 900,
    image: '/house2.jpg',
    rating: 4.7,
    type: 'rental',
    amenities: ['WiFi', 'Parking', 'AC', 'Kitchen', 'Gym', 'Swimming Pool', 'Private Pool', 'Terrace', 'Modern Design'],
    rules: ['No pets allowed', 'No smoking', 'Minimum 3 months stay', 'No parties', 'Pool usage 6 AM to 10 PM'],
    description: 'A stunning modern villa with a private pool and spacious terrace. Features contemporary design with floor-to-ceiling windows offering panoramic views. The property includes a beautiful pool deck perfect for relaxation and entertainment.'
  },
  '4': {
    id: '4',
    title: 'Beachside Villa',
    location: 'Goa',
    monthlyRent: 22000,
    dailyRent: 1500,
    image: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    type: 'rental',
    amenities: ['WiFi', 'Parking', 'AC', 'Kitchen', 'Swimming Pool', 'Private Beach Access', 'BBQ Area'],
    rules: ['No pets allowed', 'No smoking', 'Minimum 1 month stay', 'No loud music after 10 PM'],
    description: 'A beautiful villa just steps away from the beach. Perfect for family vacations and group getaways.'
  },
  '5': {
    id: '5',
    title: 'Heritage Haveli',
    location: 'Jaipur, Rajasthan',
    dailyRate: 4500,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    type: 'lodge',
    amenities: ['WiFi', 'Restaurant', 'Spa', 'Swimming Pool', 'Cultural Shows', 'Garden', 'Tour Guide'],
    rules: ['Check-in: 2 PM', 'Check-out: 12 PM', 'Dress code for restaurant', 'No outside food'],
    description: 'Experience royal living in this beautifully restored heritage haveli. A perfect blend of traditional architecture and modern comforts.'
  },
  '6': {
    id: '6',
    title: 'Lakeside Cottage',
    location: 'Udaipur, Rajasthan',
    dailyRate: 2800,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    type: 'lodge',
    amenities: ['WiFi', 'Restaurant', 'Boat Ride', 'Garden', 'Room Service', 'Laundry Service'],
    rules: ['Check-in: 2 PM', 'Check-out: 12 PM', 'No outside food allowed', 'No smoking in rooms', 'Respect local culture'],
    description: 'A charming lakeside cottage offering stunning views of Lake Pichola. Perfect for a peaceful getaway. The property features a beautiful garden and offers boat rides on the lake.'
  },
  '7': {
    id: '7',
    title: 'City Center Apartment',
    location: 'Bangalore, Karnataka',
    monthlyRent: 20000,
    dailyRent: 1000,
    image: '/house3.jpg',
    rating: 4.5,
    type: 'rental',
    amenities: ['WiFi', 'Parking', 'AC', 'Kitchen', 'Security', 'Lift', 'Power Backup', 'Housekeeping'],
    rules: ['No pets allowed', 'No smoking', 'Minimum 6 months stay', 'No parties', 'Maintenance fee extra'],
    description: 'A modern apartment in the heart of Bangalore, perfect for working professionals. The property is well-maintained and comes with all essential amenities. Located close to major IT parks and shopping areas.'
  },
  '8': {
    id: '8',
    title: 'Hill Station Retreat',
    location: 'Shimla, Himachal Pradesh',
    dailyRate: 3200,
    image: '/house4.jpg',
    rating: 4.7,
    type: 'lodge',
    amenities: ['WiFi', 'Restaurant', 'Heating', 'Trekking Guide', 'Room Service', 'Laundry Service'],
    rules: ['Check-in: 2 PM', 'Check-out: 12 PM', 'No outside food allowed', 'No smoking in rooms', 'Respect local culture'],
    description: 'A cozy retreat in the hills of Shimla, offering breathtaking views of the Himalayas. Perfect for nature lovers and adventure seekers. The property offers guided treks and comfortable accommodations.'
  },
  '9': {
    id: '9',
    title: 'Luxury Penthouse',
    location: 'Delhi',
    monthlyRent: 30000,
    dailyRent: 2000,
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    type: 'rental',
    amenities: ['WiFi', 'Parking', 'AC', 'Kitchen', 'Gym', 'Swimming Pool', '24/7 Security', 'Lift', 'Power Backup'],
    rules: ['No pets allowed', 'No smoking', 'Minimum 1 year stay', 'No parties', 'Maintenance fee extra'],
    description: 'A luxurious penthouse in the heart of Delhi, offering stunning city views. Perfect for executives and families. The property features a private gym, swimming pool, and modern amenities.'
  }
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1
  });

  const property = propertyData[id as keyof typeof propertyData];

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Property not found</h1>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go back to home
        </button>
      </div>
    </div>;
  }

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', bookingData);
    setShowBookingForm(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Optionally navigate to another page or reset form
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Property Image */}
          <div className="relative h-96">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
          </div>

          {/* Property Details */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{property.location}</span>
        </div>
      </div>
              <div className="text-right">
                {property.type === 'rental' ? (
                  <>
                    <div className="text-2xl font-bold text-indigo-600">
                      ₹{property.monthlyRent.toLocaleString()}/month
        </div>
                    <div className="text-gray-500">
                      ₹{property.dailyRent.toLocaleString()}/day
            </div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-indigo-600">
                    ₹{property.dailyRate.toLocaleString()}/day
        </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{property.description}</p>
          </div>

          {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

            {/* Rules */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Rules</h2>
              <ul className="list-disc list-inside text-gray-600">
              {property.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
              ))}
              </ul>
            </div>

            {/* Booking Button */}
            <button
              onClick={() => setShowBookingForm(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Success Message Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="bg-white rounded-lg p-8 flex flex-col items-center max-w-md w-full"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-800 mb-2"
                >
                  Booking Confirmed!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-center"
                >
                  Thank you for booking with us. You will receive a confirmation email shortly.
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Form Modal */}
        <AnimatePresence>
          {showBookingForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white rounded-lg p-8 max-w-md w-full"
              >
                <h2 className="text-2xl font-bold mb-6">Book Your Stay</h2>
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingData.name}
                      onChange={handleBookingChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleBookingChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date
                    </label>
                  <input
                    type="date"
                      name="checkInDate"
                      value={bookingData.checkInDate}
                      onChange={handleBookingChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date
                    </label>
                  <input
                    type="date"
                      name="checkOutDate"
                      value={bookingData.checkOutDate}
                      onChange={handleBookingChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleBookingChange}
                      min="1"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PropertyDetails;