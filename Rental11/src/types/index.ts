export interface Property {
  id: string;
  title: string;
  type: 'apartment' | 'house' | 'room' | 'lodge';
  price: number;
  location: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  rules: string[];
  description: string;
  owner: {
    id: string;
    name: string;
    rating: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}