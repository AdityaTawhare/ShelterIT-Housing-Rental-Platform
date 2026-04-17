import React, { useState } from 'react';

const Booking: React.FC = () => {
  const [bookingData, setBookingData] = useState({
    propertyId: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    specialRequests: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking logic
    console.log('Booking submitted:', bookingData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Book Your Stay
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Fill in your booking details below.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkInDate"
                    id="checkInDate"
                    value={bookingData.checkInDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOutDate"
                    id="checkOutDate"
                    value={bookingData.checkOutDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                    Number of Guests
                  </label>
                  <select
                    name="guests"
                    id="guests"
                    value={bookingData.guests}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    id="specialRequests"
                    rows={3}
                    value={bookingData.specialRequests}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Any special requirements or requests?"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking; 