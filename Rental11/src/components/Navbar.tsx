import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, User, LogIn, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">ShelterIT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location..."
                className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition">Contact</Link>
            <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition">
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by location..."
                    className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:border-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Link to="/about" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition">About</Link>
                <Link to="/contact" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition">Contact</Link>
                <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition">Login</Link>
                <Link to="/profile" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition">Profile</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;