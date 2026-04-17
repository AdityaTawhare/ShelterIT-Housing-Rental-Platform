import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Home as HomeIcon, Hotel, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: string;
  title: string;
  location: string;
  image: string;
  rating: number;
  type: 'rental' | 'lodge';
  amenities: string[];
  rules: string[];
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

type PropertyData = RentalProperty | LodgeProperty;

const Home = () => {
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState<'all' | 'rental' | 'lodge'>('all');
  const [searchLocation, setSearchLocation] = useState('');
  const [error, setError] = useState('');

  const featuredProperties: PropertyData[] = [
    {
      id: '1',
      title: 'Luxury Apartment in Bandra',
      location: 'Mumbai, Maharashtra',
      monthlyRent: 25000,
      dailyRent: 1200,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      type: 'rental',
      amenities: ['WiFi', 'Parking', 'AC', 'Kitchen', 'Laundry'],
      rules: ['No pets allowed', 'No smoking', 'Minimum 6 months stay']
    },
    {
      id: '2',
      title: 'Mountain View Lodge',
      location: 'Leh, Ladakh',
      dailyRate: 3500,
      image: '/house1.jpg',
      rating: 4.9,
      type: 'lodge',
      amenities: ['WiFi', 'Restaurant', 'Room Service', 'Heating'],
      rules: ['Check-in: 2 PM', 'Check-out: 12 PM', 'No outside food allowed']
    },
    {
      id: '3',
      title: 'Modern Studio in Koregaon Park',
      location: 'Pune, Maharashtra',
      monthlyRent: 18000,
      dailyRent: 900,
      image: '/house2.jpg',
      rating: 4.7,
      type: 'rental',
      amenities: ['WiFi', 'Parking', 'AC', 'Kitchen', 'Gym', 'Swimming Pool', 'Private Pool', 'Terrace'],
      rules: ['No pets allowed', 'No smoking', 'Minimum 3 months stay']
    },
    {
      id: '4',
      title: 'Beachside Villa',
      location: 'Goa',
      monthlyRent: 22000,
      dailyRent: 1500,
      image: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      type: 'rental',
      amenities: ['WiFi', 'Parking', 'AC', 'Kitchen', 'Swimming Pool'],
      rules: ['No pets allowed', 'No smoking', 'Minimum 1 month stay']
    },
    {
      id: '5',
      title: 'Heritage Haveli',
      location: 'Jaipur, Rajasthan',
      dailyRate: 4500,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      type: 'lodge',
      amenities: ['WiFi', 'Restaurant', 'Spa', 'Swimming Pool', 'Cultural Shows'],
      rules: ['Check-in: 2 PM', 'Check-out: 12 PM', 'Dress code for restaurant']
    },
    {
      id: '6',
      title: 'Lakeside Cottage',
      location: 'Udaipur, Rajasthan',
      dailyRate: 2800,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      type: 'lodge',
      amenities: ['WiFi', 'Restaurant', 'Boat Ride', 'Garden'],
      rules: ['Check-in: 2 PM', 'Check-out: 12 PM', 'No outside food allowed']
    },
    {
      id: '7',
      title: 'City Center Apartment',
      location: 'Bangalore, Karnataka',
      monthlyRent: 20000,
      dailyRent: 1000,
      image: '/house3.jpg',
      rating: 4.5,
      type: 'rental',
      amenities: ['WiFi', 'Parking', 'AC', 'Kitchen', 'Security'],
      rules: ['No pets allowed', 'No smoking', 'Minimum 6 months stay']
    },
    {
      id: '8',
      title: 'Hill Station Retreat',
      location: 'Shimla, Himachal Pradesh',
      dailyRate: 3200,
      image: '/house4.jpg',
      rating: 4.7,
      type: 'lodge',
      amenities: ['WiFi', 'Restaurant', 'Heating', 'Trekking Guide'],
      rules: ['Check-in: 2 PM', 'Check-out: 12 PM', 'No outside food allowed']
    },
    {
      id: '9',
      title: 'Luxury Penthouse',
      location: 'Delhi',
      monthlyRent: 30000,
      dailyRent: 2000,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      type: 'rental',
      amenities: ['WiFi', 'Parking', 'AC', 'Kitchen', 'Gym', 'Swimming Pool'],
      rules: ['No pets allowed', 'No smoking', 'Minimum 1 year stay']
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (searchLocation.trim() === '') {
      setError('Please enter a location to search');
      return;
    }
  };

  const filteredProperties = propertyType === 'all' 
    ? featuredProperties 
    : featuredProperties.filter(property => property.type === propertyType);

  const locationFilteredProperties = searchLocation
    ? filteredProperties.filter(property => 
        property.location.toLowerCase().includes(searchLocation.toLowerCase())
      )
    : filteredProperties;

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Stay</h1>
              <p className="text-xl">Discover amazing properties across India</p>
            </div>
            <button
              onClick={() => navigate('/add-property')}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Property
            </button>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Search
              </button>
            </div>
            {error && (
              <p className="text-red-300 mt-2">{error}</p>
            )}
          </form>
        </div>
      </section>

      {/* Property Type Filter */}
      <section className="container mx-auto px-4">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setPropertyType('all')}
            className={`px-6 py-2 rounded-full ${
              propertyType === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setPropertyType('rental')}
            className={`px-6 py-2 rounded-full flex items-center ${
              propertyType === 'rental'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Rentals
          </button>
          <button
            onClick={() => setPropertyType('lodge')}
            className={`px-6 py-2 rounded-full flex items-center ${
              propertyType === 'lodge'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Hotel className="w-4 h-4 mr-2" />
            Lodges
          </button>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        {locationFilteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-4">
              No properties found in {searchLocation}
            </h3>
            <p className="text-gray-500">
              Try searching for a different location or browse all properties
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locationFilteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
                onClick={() => handlePropertyClick(property.id)}
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <div className="flex items-center mb-4">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">{property.location}</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {property.type === 'rental' ? (
                      <>
                        <span className="text-lg font-semibold text-indigo-600">
                          ₹{(property as RentalProperty).monthlyRent.toLocaleString()}/month
                        </span>
                        <span className="text-sm text-gray-500">
                          ₹{(property as RentalProperty).dailyRent.toLocaleString()}/day
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-indigo-600">
                        ₹{(property as LodgeProperty).dailyRate.toLocaleString()}/day
                      </span>
                    )}
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span>{property.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ShelterIT</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Verified Properties',
                description: 'All our properties are thoroughly verified for quality and safety.',
                icon: '🏠'
              },
              {
                title: '24/7 Support',
                description: 'Our support team is always available to help you.',
                icon: '💬'
              },
              {
                title: 'Best Prices',
                description: 'We offer competitive prices with no hidden fees.',
                icon: '💰'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center p-6"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;