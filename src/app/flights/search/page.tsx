'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLongRightIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';

// Mock flight data (in a real app, this would come from an API)
const mockFlights = [
  {
    id: 1,
    airline: 'IndiGo',
    flightNumber: '6E-123',
    departureTime: '06:00',
    arrivalTime: '08:30',
    duration: '2h 30m',
    price: 4999,
    stops: 0,
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    id: 2,
    airline: 'Air India',
    flightNumber: 'AI-456',
    departureTime: '08:30',
    arrivalTime: '11:15',
    duration: '2h 45m',
    price: 5999,
    stops: 0,
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    id: 3,
    airline: 'SpiceJet',
    flightNumber: 'SG-789',
    departureTime: '10:15',
    arrivalTime: '13:30',
    duration: '3h 15m',
    price: 4499,
    stops: 1,
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    id: 4,
    airline: 'IndiGo',
    flightNumber: '6E-456',
    departureTime: '14:00',
    arrivalTime: '16:30',
    duration: '2h 30m',
    price: 5299,
    stops: 0,
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    id: 5,
    airline: 'Air India',
    flightNumber: 'AI-789',
    departureTime: '16:30',
    arrivalTime: '19:15',
    duration: '2h 45m',
    price: 6299,
    stops: 0,
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    id: 6,
    airline: 'SpiceJet',
    flightNumber: 'SG-012',
    departureTime: '18:15',
    arrivalTime: '21:30',
    duration: '3h 15m',
    price: 4799,
    stops: 1,
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&h=100&q=80',
  },
];

interface FlightFilters {
  priceRange: [number, number];
  stops: number[];
  airlines: string[];
  departureTime: string[];
}

export default function FlightSearchResults() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [flights, setFlights] = useState(mockFlights);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FlightFilters>({
    priceRange: [0, 50000],
    stops: [],
    airlines: [],
    departureTime: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const departDate = searchParams.get('departDate');
  const passengers = searchParams.get('passengers') ? JSON.parse(searchParams.get('passengers')!) : null;

  const handleFilterChange = (filterType: keyof FlightFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const applyFilters = () => {
    let filteredFlights = mockFlights;

    // Apply price filter
    filteredFlights = filteredFlights.filter(
      flight => flight.price >= filters.priceRange[0] && flight.price <= filters.priceRange[1]
    );

    // Apply stops filter
    if (filters.stops.length > 0) {
      filteredFlights = filteredFlights.filter(flight => filters.stops.includes(flight.stops));
    }

    // Apply airline filter
    if (filters.airlines.length > 0) {
      filteredFlights = filteredFlights.filter(flight => filters.airlines.includes(flight.airline));
    }

    // Apply departure time filter
    if (filters.departureTime.length > 0) {
      filteredFlights = filteredFlights.filter(flight => {
        const hour = parseInt(flight.departureTime.split(':')[0]);
        return filters.departureTime.some(time => {
          switch (time) {
            case 'morning':
              return hour >= 6 && hour < 12;
            case 'afternoon':
              return hour >= 12 && hour < 17;
            case 'evening':
              return hour >= 17 && hour < 21;
            case 'night':
              return hour >= 21 || hour < 6;
            default:
              return true;
          }
        });
      });
    }

    setFlights(filteredFlights);
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
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center text-lg font-semibold">
                <span>{from}</span>
                <ArrowLongRightIcon className="h-6 w-6 mx-2" />
                <span>{to}</span>
              </div>
              <div className="text-sm text-gray-500">
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

                  {/* Stops */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stops
                    </label>
                    <div className="space-y-2">
                      {[0, 1, 2].map((stop) => (
                        <label key={stop} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.stops.includes(stop)}
                            onChange={(e) => {
                              const newStops = e.target.checked
                                ? [...filters.stops, stop]
                                : filters.stops.filter(s => s !== stop);
                              handleFilterChange('stops', newStops);
                            }}
                            className="mr-2"
                          />
                          {stop === 0 ? 'Non-stop' : `${stop} ${stop === 1 ? 'stop' : 'stops'}`}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Airlines */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Airlines
                    </label>
                    <div className="space-y-2">
                      {['IndiGo', 'Air India', 'SpiceJet'].map((airline) => (
                        <label key={airline} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.airlines.includes(airline)}
                            onChange={(e) => {
                              const newAirlines = e.target.checked
                                ? [...filters.airlines, airline]
                                : filters.airlines.filter(a => a !== airline);
                              handleFilterChange('airlines', newAirlines);
                            }}
                            className="mr-2"
                          />
                          {airline}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Departure Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure Time
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'morning', label: 'Morning (6AM - 12PM)' },
                        { id: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
                        { id: 'evening', label: 'Evening (5PM - 9PM)' },
                        { id: 'night', label: 'Night (9PM - 6AM)' },
                      ].map(({ id, label }) => (
                        <label key={id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.departureTime.includes(id)}
                            onChange={(e) => {
                              const newTimes = e.target.checked
                                ? [...filters.departureTime, id]
                                : filters.departureTime.filter(t => t !== id);
                              handleFilterChange('departureTime', newTimes);
                            }}
                            className="mr-2"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flight List */}
          <div className="flex-1">
            <div className="space-y-4">
              {flights.map((flight) => (
                <div key={flight.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src={flight.logo}
                          alt={flight.airline}
                          fill
                          className="object-contain rounded-full"
                        />
                      </div>
                      <div>
                        <div className="font-semibold">{flight.airline}</div>
                        <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#7917BE]">₹{flight.price}</div>
                      <Link
                        href={`/flights/book/${flight.id}?from=${from}&to=${to}&date=${departDate}&passengers=${encodeURIComponent(JSON.stringify(passengers))}`}
                        className="inline-block mt-2 px-6 py-2 bg-[#7917BE] text-white rounded-lg hover:bg-[#9f1efb]"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-semibold">{flight.departureTime}</div>
                      <div className="text-sm text-gray-500">{from}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-gray-500">{flight.duration}</div>
                      <div className="w-32 h-px bg-gray-300 my-2"></div>
                      <div className="text-sm text-gray-500">
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{flight.arrivalTime}</div>
                      <div className="text-sm text-gray-500">{to}</div>
                    </div>
                  </div>
                </div>
              ))}

              {flights.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="text-xl font-semibold text-gray-900 mb-2">No Flights Found</div>
                  <p className="text-gray-600">Try adjusting your filters or search for different dates.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 