'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

// List of major Indian cities
const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Goa',
  'Jaipur'
];

interface SearchFormData {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  tripType: 'oneWay' | 'roundTrip';
}

export default function FlightSearchForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<SearchFormData>({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    tripType: 'oneWay',
  });

  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    // Set default departure date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      departDate: tomorrow.toISOString().split('T')[0]
    }));
  }, []);

  const handleSwapCities = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handlePassengerChange = (type: 'adults' | 'children' | 'infants', value: number) => {
    if (value < 0) return;
    if (type === 'adults' && value === 0) return;
    if (type === 'infants' && value > formData.passengers.adults) return;

    setFormData(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: value,
      },
    }));
  };

  const getTotalPassengers = () => {
    const { adults, children, infants } = formData.passengers;
    return adults + children + infants;
  };

  const handleCityInput = (field: 'from' | 'to', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (value.length > 0) {
      const suggestions = cities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      if (field === 'from') {
        setFromSuggestions(suggestions);
      } else {
        setToSuggestions(suggestions);
      }
    } else {
      if (field === 'from') {
        setFromSuggestions([]);
      } else {
        setToSuggestions([]);
      }
    }
  };

  const handleCitySelect = (field: 'from' | 'to', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.from || !formData.to) {
      alert('Please select both origin and destination cities');
      return;
    }
    
    if (!formData.departDate) {
      alert('Please select a departure date');
      return;
    }
    
    if (formData.tripType === 'roundTrip' && !formData.returnDate) {
      alert('Please select a return date for round trip');
      return;
    }

    // Create the search URL
    const searchParams = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      departDate: formData.departDate,
      returnDate: formData.returnDate,
      passengers: JSON.stringify(formData.passengers),
      tripType: formData.tripType,
    });

    // Navigate to search results
    router.push(`/flights/search?${searchParams.toString()}`);
  };

  if (!mounted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-4">
        {/* Trip Type Selection */}
        <div className="flex space-x-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={formData.tripType === 'oneWay'}
              onChange={() => setFormData(prev => ({ ...prev, tripType: 'oneWay', returnDate: '' }))}
              className="mr-2"
            />
            One Way
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={formData.tripType === 'roundTrip'}
              onChange={() => setFormData(prev => ({ ...prev, tripType: 'roundTrip' }))}
              className="mr-2"
            />
            Round Trip
          </label>
        </div>

        {/* Cities Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="text"
              value={formData.from}
              onChange={(e) => handleCityInput('from', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter city"
              required
            />
            {fromSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {fromSuggestions.map((city) => (
                  <div
                    key={city}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleCitySelect('from', city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

       

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="text"
              value={formData.to}
              onChange={(e) => handleCityInput('to', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter city"
              required
            />
           
            {toSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {toSuggestions.map((city) => (
                  <div
                    key={city}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleCitySelect('to', city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dates Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
            <div className="relative">
              <input
                type="date"
                value={formData.departDate}
                onChange={(e) => setFormData(prev => ({ ...prev, departDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <CalendarIcon className="h-5 w-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          {formData.tripType === 'roundTrip' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min={formData.departDate || new Date().toISOString().split('T')[0]}
                  required={formData.tripType === 'roundTrip'}
                />
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Passengers Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
          <button
            type="button"
            onClick={() => setShowPassengerModal(!showPassengerModal)}
            className="w-full p-2 border border-gray-300 rounded-lg text-left flex items-center justify-between"
          >
            <span>{getTotalPassengers()} Passenger(s)</span>
            <UserIcon className="h-5 w-5 text-gray-400" />
          </button>

          {showPassengerModal && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg p-4 z-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Adults (12+ years)</span>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('adults', formData.passengers.adults - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span>{formData.passengers.adults}</span>
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('adults', formData.passengers.adults + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Children (2-11 years)</span>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('children', formData.passengers.children - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span>{formData.passengers.children}</span>
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('children', formData.passengers.children + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Infants (under 2 years)</span>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('infants', formData.passengers.infants - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span>{formData.passengers.infants}</span>
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('infants', formData.passengers.infants + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search Flights
        </button>
      </div>
    </form>
  );
} 