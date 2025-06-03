'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import Navbar from '@/components/Navbar';

// Mock data for hotels
const hotels = [
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

export default function HotelsPage() {
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedRating, setSelectedRating] = useState(0);

  // Filter hotels based on selected criteria
  const filteredHotels = hotels.filter(hotel => {
    const matchesPrice = hotel.price <= priceRange[1];
    const matchesRating = selectedRating === 0 || hotel.rating >= selectedRating;
    return matchesPrice && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <h1 className="text-3xl font-bold mb-8">Hotels & Resorts</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-[#7917BE]"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹0</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Star Rating</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="rating"
                      value={0}
                      checked={selectedRating === 0}
                      onChange={(e) => setSelectedRating(parseInt(e.target.value))}
                      className="text-[#7917BE]"
                    />
                    <span>All Ratings</span>
                  </label>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={selectedRating === rating}
                        onChange={(e) => setSelectedRating(parseInt(e.target.value))}
                        className="text-[#7917BE]"
                      />
                      <span className="flex items-center">
                        {Array.from({ length: rating }).map((_, i) => (
                          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                        ))}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    setPriceRange([0, 50000]);
                    setSelectedRating(0);
                  }}
                  className="text-[#7917BE] text-sm font-medium hover:text-[#9f1efb]"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Hotel Listings */}
          <div className="lg:col-span-3 space-y-6">
            {filteredHotels.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Hotels Found</h3>
                <p className="text-gray-600">Try adjusting your filters to find more options.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600">{filteredHotels.length} hotels found</p>
                {filteredHotels.map((hotel) => (
                  <Link href={`/hotels/${hotel.id}`} key={hotel.id}>
                    <div className="bg-white rounded-lg mb-5 shadow overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative h-48 sm:h-auto sm:w-72">
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
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#7917BE]">₹{hotel.price.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">per night</div>
                            </div>
                          </div>
                          <div className="flex items-center mt-4">
                            <div className="flex items-center">
                              <StarIcon className="h-5 w-5 text-yellow-400" />
                              <span className="ml-1 font-semibold">{hotel.rating}</span>
                            </div>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{hotel.reviews.toLocaleString()} reviews</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            )}
            
            {/* Footer Space */}
            <div className="h-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 