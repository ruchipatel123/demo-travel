'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, MapPinIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';

// Mock hotel data
const mockHotels = [
  {
    id: 1,
    name: 'Luxury Palace Hotel',
    location: 'Mumbai, Maharashtra',
    rating: 4.8,
    reviews: 2453,
    price: 12999,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Seaside Resort & Spa',
    location: 'Goa',
    rating: 4.5,
    reviews: 1876,
    price: 8999,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Mountain View Resort',
    location: 'Shimla, Himachal Pradesh',
    rating: 4.6,
    reviews: 1234,
    price: 6999,
    image: 'https://images.unsplash.com/photo-1587874522487-fe10e954d035?auto=format&fit=crop&w=800&q=80',
  },
];

interface HotelFilters {
  priceRange: [number, number];
  rating: number[];
}

export default function HotelSearchResults() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [hotels, setHotels] = useState(mockHotels);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<HotelFilters>({
    priceRange: [0, 50000],
    rating: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const location = searchParams.get('to');
  const checkIn = searchParams.get('departDate');
  const checkOut = searchParams.get('returnDate');
  const guests = searchParams.get('passengers') ? JSON.parse(searchParams.get('passengers')!) : null;

  const handleFilterChange = (filterType: keyof HotelFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const applyFilters = () => {
    let filteredHotels = mockHotels;

    // Apply price filter
    filteredHotels = filteredHotels.filter(
      hotel => hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1]
    );

    // Apply rating filter
    if (filters.rating.length > 0) {
      filteredHotels = filteredHotels.filter(hotel => 
        filters.rating.some(rating => Math.floor(hotel.rating) === rating)
      );
    }

    setHotels(filteredHotels);
  };

  useEffect(() => {
    if (mounted) {
      applyFilters();
    }
  }, [filters, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Search Summary */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{location}</h1>
              <div className="text-sm text-gray-600">
                {checkIn} - {checkOut} • {guests?.adults + (guests?.children || 0)} Guests
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 md:hidden"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <div className="space-y-4">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹0</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Star Rating
                    </label>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.rating.includes(rating)}
                            onChange={(e) => {
                              const newRatings = e.target.checked
                                ? [...filters.rating, rating]
                                : filters.rating.filter(r => r !== rating);
                              handleFilterChange('rating', newRatings);
                            }}
                            className="mr-2"
                          />
                          <div className="flex items-center">
                            {Array.from({ length: rating }).map((_, i) => (
                              <StarIcon key={i} className="h-4 w-4 text-[#ff9948]" />
                            ))}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel List */}
          <div className="flex-1">
            <div className="space-y-4">
              {hotels.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="text-xl font-semibold text-gray-900 mb-2">No Hotels Found</div>
                  <p className="text-gray-600">Try adjusting your filters or search for different dates.</p>
                </div>
              ) : (
                hotels.map((hotel) => (
                  <Link href={`/hotels/${hotel.id}`} key={hotel.id}>
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="md:flex">
                        <div className="relative h-48 md:h-auto md:w-72">
                          <Image
                            src={hotel.image}
                            alt={hotel.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                <span className="text-sm">{hotel.location}</span>
                              </div>
                              <div className="flex items-center">
                                <div className="flex items-center">
                                  <StarIcon className="h-5 w-5 text-[#ff9948]" />
                                  <span className="ml-1 font-semibold">{hotel.rating}</span>
                                </div>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-sm text-gray-600">{hotel.reviews.toLocaleString()} reviews</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#7a17bf]">₹{hotel.price.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">per night</div>
                              <button className="mt-4 px-6 py-2 bg-[#7a17bf] text-white rounded-lg hover:bg-[#9f1efb]">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 