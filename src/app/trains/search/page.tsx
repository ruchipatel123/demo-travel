'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ClockIcon, ArrowLongRightIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';

// Mock train data
const mockTrains = [
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

interface TrainFilters {
  priceRange: [number, number];
  trainType: string;
}

export default function TrainSearchResults() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [trains, setTrains] = useState(mockTrains);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TrainFilters>({
    priceRange: [0, 5000],
    trainType: 'all',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const departDate = searchParams.get('departDate');
  const passengers = searchParams.get('passengers') ? JSON.parse(searchParams.get('passengers')!) : null;

  const handleFilterChange = (filterType: keyof TrainFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const applyFilters = () => {
    let filteredTrains = mockTrains;

    // Apply price filter
    filteredTrains = filteredTrains.filter(
      train => train.price >= filters.priceRange[0] && train.price <= filters.priceRange[1]
    );

    // Apply train type filter
    if (filters.trainType !== 'all') {
      filteredTrains = filteredTrains.filter(
        train => train.trainType.toLowerCase() === filters.trainType.toLowerCase()
      );
    }

    setTrains(filteredTrains);
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
              <div className="flex items-center text-lg font-semibold">
                <span>{from}</span>
                <ArrowLongRightIcon className="h-6 w-6 mx-2" />
                <span>{to}</span>
              </div>
              <div className="text-sm text-gray-600">
                {departDate} • {passengers?.adults + (passengers?.children || 0)} Traveller(s)
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
                      max="5000"
                      step="100"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹0</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Train Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Train Type
                    </label>
                    <select
                      value={filters.trainType}
                      onChange={(e) => handleFilterChange('trainType', e.target.value)}
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
            </div>
          </div>

          {/* Train List */}
          <div className="flex-1">
            <div className="space-y-4">
              {trains.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="text-xl font-semibold text-gray-900 mb-2">No Trains Found</div>
                  <p className="text-gray-600">Try adjusting your filters or search for different dates.</p>
                </div>
              ) : (
                trains.map((train) => (
                  <div key={train.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h2 className="text-xl font-semibold text-gray-900">{train.name}</h2>
                          <p className="text-sm text-gray-600">Train #{train.trainNumber} • {train.trainType}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#7917BE]">₹{train.price.toLocaleString()}</div>
                          <p className="text-sm text-gray-600">starting from</p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xl font-semibold">{train.departureTime}</div>
                          <div className="text-sm text-gray-600">{from}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-sm text-gray-600">{train.duration}</div>
                          <div className="w-full h-px bg-gray-300 my-2"></div>
                          <div className="text-sm text-gray-600">{train.stops} stops</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-semibold">{train.arrivalTime}</div>
                          <div className="text-sm text-gray-600">{to}</div>
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
                          href={`/trains/book/${train.id}?from=${from}&to=${to}&date=${departDate}&passengers=${encodeURIComponent(JSON.stringify(passengers))}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#7917BE] hover:bg-[#9f1efb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7917BE]"
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