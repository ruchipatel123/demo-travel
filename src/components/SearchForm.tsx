'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {  CalendarIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

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

interface SearchFormProps {
  type?: 'flight' | 'hotel' | 'train';
}

const SearchForm = ({ type = 'flight' }: SearchFormProps) => {
  const router = useRouter();
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  const handleCityInput = (field: 'from' | 'to', value: string) => {
    if (field === 'from') {
      setFromCity(value);
    } else {
      setToCity(value);
    }
    
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
    if (field === 'from') {
      setFromCity(value);
      setFromSuggestions([]);
    } else {
      setToCity(value);
      setToSuggestions([]);
    }
  };

  const handlePassengerChange = (type: 'adults' | 'children' | 'infants', value: number) => {
    if (value < 0) return;
    if (type === 'adults' && value === 0) return;
    if (type === 'infants' && value > passengers.adults) return;

    setPassengers(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const getTotalPassengers = () => {
    const { adults, children, infants } = passengers;
    return adults + children + infants;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromCity || !toCity) {
      alert('Please select both origin and destination cities');
      return;
    }
    
    if (!departureDate) {
      alert('Please select a departure date');
      return;
    }
    
    if (tripType === 'roundTrip' && !returnDate) {
      alert('Please select a return date for round trip');
      return;
    }

    const searchParams = new URLSearchParams({
      from: fromCity,
      to: toCity,
      departDate: departureDate.toISOString().split('T')[0],
      returnDate: returnDate ? returnDate.toISOString().split('T')[0] : '',
      passengers: JSON.stringify(passengers),
      tripType: tripType
    });

    // Route to the appropriate search page based on type
    router.push(`/${type}s/search?${searchParams.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {type === 'flight' && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              className={`flex items-center px-6 py-2.5 rounded-lg transition-colors ${
                tripType === 'oneWay'
                  ? 'bg-white text-[#7917BE] shadow'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setTripType('oneWay')}
            >
              One Way
            </button>
            <button
              type="button"
              className={`flex items-center px-6 py-2.5 rounded-lg transition-colors ${
                tripType === 'roundTrip'
                  ? 'bg-white text-[#7917BE] shadow'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setTripType('roundTrip')}
            >
              Round Trip
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={fromCity}
                onChange={(e) => handleCityInput('from', e.target.value)}
                placeholder="Enter city"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#7917BE] focus:border-[#7917BE]"
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
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={toCity}
                onChange={(e) => handleCityInput('to', e.target.value)}
                placeholder="Enter city"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#7917BE] focus:border-[#7917BE]"
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

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <DatePicker
                selected={departureDate}
                onChange={(date) => setDepartureDate(date)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#7917BE] focus:border-[#7917BE]"
                minDate={new Date()}
                placeholderText="Select date"
              />
            </div>
          </div>

          {tripType === 'roundTrip' && type === 'flight' && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <DatePicker
                  selected={returnDate}
                  onChange={(date) => setReturnDate(date)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#7917BE] focus:border-[#7917BE]"
                  minDate={departureDate || new Date()}
                  placeholderText="Select date"
                />
              </div>
            </div>
          )}

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'hotel' ? 'Guests' : 'Travelers'}
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <button
                type="button"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#7917BE] focus:border-[#7917BE] text-left"
                onClick={() => setShowPassengerModal(!showPassengerModal)}
              >
                {getTotalPassengers()} {getTotalPassengers() === 1 ? 'Person' : 'People'}
              </button>
              
              {showPassengerModal && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Adults</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => handlePassengerChange('adults', passengers.adults - 1)}
                        >
                          -
                        </button>
                        <span>{passengers.adults}</span>
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => handlePassengerChange('adults', passengers.adults + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Children</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => handlePassengerChange('children', passengers.children - 1)}
                        >
                          -
                        </button>
                        <span>{passengers.children}</span>
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => handlePassengerChange('children', passengers.children + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {type === 'flight' && (
                      <div className="flex justify-between items-center">
                        <span>Infants</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() => handlePassengerChange('infants', passengers.infants - 1)}
                          >
                            -
                          </button>
                          <span>{passengers.infants}</span>
                          <button
                            type="button"
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() => handlePassengerChange('infants', passengers.infants + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-[#7917BE] text-white py-3 px-6 rounded-lg hover:bg-[#9f1efb] transition-colors"
          >
            Search {type === 'flight' ? 'Flights' : type === 'hotel' ? 'Hotels' : 'Trains'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm; 