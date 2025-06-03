'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ClockIcon, ArrowLongRightIcon } from '@heroicons/react/24/solid';
import Navbar from '@/components/Navbar';

// Mock data for trains
const trains = [
  {
    id: 1,
    name: 'Rajdhani Express',
    trainNumber: '12951',
    departureTime: '16:50',
    arrivalTime: '10:05',
    duration: '17h 15m',
    price: 1499,
    stops: 5,
    trainType: 'Superfast',
    classes: [
      { type: 'AC First Class', price: 4500, seatsAvailable: 18 },
      { type: 'AC 2 Tier', price: 2500, seatsAvailable: 46 },
      { type: 'AC 3 Tier', price: 1499, seatsAvailable: 64 }
    ]
  },
  {
    id: 2,
    name: 'Duronto Express',
    trainNumber: '12952',
    departureTime: '08:00',
    arrivalTime: '23:45',
    duration: '15h 45m',
    price: 1299,
    stops: 3,
    trainType: 'Superfast',
    classes: [
      { type: 'AC First Class', price: 4200, seatsAvailable: 18 },
      { type: 'AC 2 Tier', price: 2200, seatsAvailable: 46 },
      { type: 'AC 3 Tier', price: 1299, seatsAvailable: 64 }
    ]
  },
  {
    id: 3,
    name: 'Shatabdi Express',
    trainNumber: '12953',
    departureTime: '06:00',
    arrivalTime: '14:30',
    duration: '8h 30m',
    price: 999,
    stops: 4,
    trainType: 'Superfast',
    classes: [
      { type: 'Executive Chair Car', price: 2999, seatsAvailable: 56 },
      { type: 'AC Chair Car', price: 999, seatsAvailable: 78 }
    ]
  }
];

export default function TrainsPage() {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedType, setSelectedType] = useState('all');

  // Filter trains based on selected criteria
  const filteredTrains = trains.filter(train => {
    const matchesPrice = train.price <= priceRange[1];
    const matchesType = selectedType === 'all' || train.trainType.toLowerCase() === selectedType;
    return matchesPrice && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Train Tickets</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹0</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Train Type Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Train Type</h3>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="all">All Types</option>
                  <option value="superfast">Superfast</option>
                  <option value="express">Express</option>
                  <option value="passenger">Passenger</option>
                </select>
              </div>
            </div>
          </div>

          {/* Train List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredTrains.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                  No trains found matching your criteria
                </div>
              ) : (
                filteredTrains.map((train) => (
                  <div key={train.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h2 className="text-xl font-semibold text-gray-900">{train.name}</h2>
                          <p className="text-sm text-gray-600">Train #{train.trainNumber} • {train.trainType}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">₹{train.price.toLocaleString()}</div>
                          <p className="text-sm text-gray-600">starting from</p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xl font-semibold">{train.departureTime}</div>
                          <div className="text-sm text-gray-600">Mumbai</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-sm text-gray-600">{train.duration}</div>
                          <div className="w-full h-px bg-gray-300 my-2"></div>
                          <div className="text-sm text-gray-600">{train.stops} stops</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-semibold">{train.arrivalTime}</div>
                          <div className="text-sm text-gray-600">Delhi</div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {train.classes.map((cls, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{cls.type}:</span>
                            <span className="text-gray-600"> {cls.seatsAvailable} seats available</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Link
                          href={`/trains/book/${train.id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 