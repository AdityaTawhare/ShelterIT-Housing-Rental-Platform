import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              About Our Platform
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Learn more about our mission and values.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                We started with a simple mission: to make finding and booking rental properties easier and more enjoyable for everyone. Our platform connects property owners with potential renters, creating a seamless experience for both parties.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Transparency in all transactions</li>
                <li>Quality service for all users</li>
                <li>Secure and reliable platform</li>
                <li>Customer satisfaction as our top priority</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
              <p className="text-gray-600 mb-4">
                Our platform provides a wide range of rental properties, from cozy apartments to luxurious villas. We ensure that all properties meet our quality standards and provide detailed information to help you make the best choice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 