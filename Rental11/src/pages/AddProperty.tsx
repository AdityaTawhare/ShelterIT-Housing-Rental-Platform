import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface AddPropertyFormData {
  title: string;
  location: string;
  type: 'rental' | 'lodge';
  monthlyRent?: number;
  dailyRent?: number;
  dailyRate?: number;
  description: string;
  image: string;
  amenities: string[];
  rules: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddPropertyFormData>({
    title: '',
    location: '',
    type: 'rental',
    description: '',
    image: '',
    amenities: [],
    rules: [],
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newRule, setNewRule] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload image to Supabase Storage
      const file = await fetch(formData.image);
      const blob = await file.blob();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const { data: imageData, error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filename, blob);

      if (uploadError) throw uploadError;

      const imageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/property-images/${filename}`;

      // Insert property data
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert([
          {
            title: formData.title,
            location: formData.location,
            property_type: formData.type,
            description: formData.description,
            monthly_rent: formData.monthlyRent,
            daily_rent: formData.dailyRent,
            daily_rate: formData.dailyRate,
            image: imageUrl,
            address: formData.location, // You might want to add a separate address field
            host_id: (await supabase.auth.getUser()).data.user?.id
          }
        ])
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Insert amenities
      if (formData.amenities.length > 0) {
        const { error: amenitiesError } = await supabase
          .from('property_amenities')
          .insert(
            formData.amenities.map(amenity => ({
              property_id: propertyData.property_id,
              amenity_id: amenity // You'll need to get actual amenity IDs
            }))
          );

        if (amenitiesError) throw amenitiesError;
      }

      // Insert rules
      if (formData.rules.length > 0) {
        const { error: rulesError } = await supabase
          .from('property_rules')
          .insert(
            formData.rules.map(rule => ({
              property_id: propertyData.property_id,
              rule_id: rule // You'll need to get actual rule IDs
            }))
          );

        if (rulesError) throw rulesError;
      }

      // Navigate to the property details page
      navigate(`/property/${propertyData.property_id}`);
    } catch (error) {
      console.error('Error adding property:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold mb-8">Add Your Property</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter property name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="City, State"
                />
              </div>
            </div>

            {/* Property Type and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="rental">Rental</option>
                  <option value="lodge">Lodge</option>
                </select>
              </div>
              {formData.type === 'rental' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Rent (₹)
                    </label>
                    <input
                      type="number"
                      name="monthlyRent"
                      value={formData.monthlyRent || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Rent (₹)
                    </label>
                    <input
                      type="number"
                      name="dailyRent"
                      value={formData.dailyRent || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Rate (₹)
                  </label>
                  <input
                    type="number"
                    name="dailyRate"
                    value={formData.dailyRate || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your property..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Property preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add an amenity"
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span>{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rules
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add a rule"
                />
                <button
                  type="button"
                  onClick={addRule}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.rules.map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span>{rule}</span>
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add Property
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProperty; 