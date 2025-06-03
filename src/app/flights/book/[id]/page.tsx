'use client';

import { useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, MapPinIcon, CalendarIcon, UserIcon, XMarkIcon, ClockIcon, ArrowLongRightIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import PaymentModal from '@/components/PaymentModal';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';

// Mock data for flights (this should ideally come from an API or database)
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
    aircraft: 'Airbus A320',
    cabinClasses: [
      { type: 'Economy', price: 4999, seatsAvailable: 120 },
      { type: 'Business', price: 14999, seatsAvailable: 12 }
    ],
    amenities: ['Meals', 'Entertainment', 'USB Power', 'WiFi', 'Extra Legroom']
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
    aircraft: 'Boeing 787',
    cabinClasses: [
      { type: 'Economy', price: 5999, seatsAvailable: 150 },
      { type: 'Business', price: 18999, seatsAvailable: 18 }
    ],
    amenities: ['Meals', 'Entertainment', 'USB Power', 'WiFi', 'Flatbed Seats']
  }
];

export default function FlightBooking({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [selectedClass, setSelectedClass] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user, login } = useAuth();
  const { addBooking } = useBooking();
  
  const flight = mockFlights.find(f => f.id === parseInt(resolvedParams.id));
  const selectedClassDetails = flight?.cabinClasses.find(c => c.type === selectedClass);

  const handleBookNow = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowBookingModal(true);
    }
  };

  const handleLogin = (email: string) => {
    login(email);
    setShowLoginModal(false);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const calculateTotalPrice = () => {
    return selectedClassDetails ? Math.round(selectedClassDetails.price * 1.18 * passengers) : 0;
  };

  const handlePaymentComplete = () => {
    if (!flight) return;
    
    // Add the booking to the context
    addBooking({
      type: 'flight',
      status: 'confirmed',
      details: {
        from: 'Mumbai',
        to: 'Delhi',
        date: new Date().toISOString().split('T')[0],
        passengers: passengers,
        class: selectedClass,
      },
      price: calculateTotalPrice(),
    });
    
    setShowPaymentModal(false);
    setBookingConfirmed(true);
  };

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Flight Not Found</h2>
            <Link href="/flights" className="text-blue-600 hover:text-blue-800">
              Back to Flights
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/flights/search" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Back to Flight Search
        </Link>

        {/* Flight Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={flight.logo}
                    alt={flight.airline}
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{flight.airline}</h1>
                  <p className="text-gray-600">{flight.flightNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">₹{flight.price.toLocaleString()}</div>
                <div className="text-gray-600">base price</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-2xl font-semibold">{flight.departureTime}</div>
                <div className="text-gray-600">Mumbai</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-gray-600">{flight.duration}</div>
                <div className="w-32 h-px bg-gray-300 my-2"></div>
                <div className="text-gray-600">
                  {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
                </div>
              </div>
              <div>
                <div className="text-2xl font-semibold">{flight.arrivalTime}</div>
                <div className="text-gray-600">Delhi</div>
              </div>
            </div>

            {/* Flight Info */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Flight Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700">Aircraft</h3>
                  <p>{flight.aircraft}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Amenities</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {flight.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Select Cabin Class</h2>
              <div className="space-y-4">
                {flight.cabinClasses.map((cabinClass) => (
                  <div
                    key={cabinClass.type}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedClass === cabinClass.type
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-600'
                    }`}
                    onClick={() => setSelectedClass(cabinClass.type)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{cabinClass.type}</h3>
                        <p className="text-sm text-gray-600">{cabinClass.seatsAvailable} seats available</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          ₹{cabinClass.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">per passenger</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Book Your Flight</h2>
              
              {user && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Booking as: {user}</p>
                </div>
              )}

              {/* Class Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Choose a class</option>
                  {flight.cabinClasses.map((cabinClass, index) => (
                    <option key={index} value={cabinClass.type}>
                      {cabinClass.type} - ₹{cabinClass.price.toLocaleString()} ({cabinClass.seatsAvailable} seats available)
                    </option>
                  ))}
                </select>
              </div>

              {/* Passenger Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Passengers</label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Summary */}
              {selectedClass && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Price Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Base Fare ({passengers} {passengers === 1 ? 'passenger' : 'passengers'})</span>
                      <span>₹{(selectedClassDetails!.price * passengers).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Taxes & Fees</span>
                      <span>₹{Math.round(selectedClassDetails!.price * 0.18 * passengers).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t">
                      <span>Total Amount</span>
                      <span className="text-blue-600">₹{calculateTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                disabled={!selectedClass}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Booking Confirmation</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Flight Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Airline:</span> {flight.airline}</p>
                  <p><span className="font-medium">Flight Number:</span> {flight.flightNumber}</p>
                  <p><span className="font-medium">From:</span> Mumbai</p>
                  <p><span className="font-medium">To:</span> Delhi</p>
                  <p><span className="font-medium">Departure:</span> {flight.departureTime}</p>
                  <p><span className="font-medium">Arrival:</span> {flight.arrivalTime}</p>
                  <p><span className="font-medium">Cabin Class:</span> {selectedClass}</p>
                  <p><span className="font-medium">Passengers:</span> {passengers}</p>
                  <p><span className="font-medium">Total Amount:</span> ₹{calculateTotalPrice().toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentComplete={handlePaymentComplete}
        amount={selectedClassDetails ? Math.round(selectedClassDetails.price * 1.18) : 0}
      />

      {/* Success Modal */}
      {bookingConfirmed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your flight has been booked successfully. A confirmation email will be sent to {user}.</p>
              <Link
                href="/flights"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setBookingConfirmed(false)}
              >
                Back to Flights
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 