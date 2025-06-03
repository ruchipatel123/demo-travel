'use client';

import { useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, MapPinIcon, CalendarIcon, UserIcon, WifiIcon, TvIcon, HomeIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import PaymentModal from '@/components/PaymentModal';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';

// Mock data for hotels (this should ideally come from an API or database)
const hotels = [
  {
    id: 1,
    name: 'Luxury Palace Hotel',
    location: 'Mumbai, Maharashtra',
    rating: 4.8,
    reviews: 2453,
    price: 12999,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: 'Experience luxury at its finest in the heart of Mumbai. Our 5-star hotel offers world-class amenities and breathtaking city views.',
    amenities: ['Free Wi-Fi', 'Swimming Pool', 'Spa', 'Fitness Center', '24/7 Room Service', 'Restaurant', 'Bar', 'Business Center'],
    rooms: [
      { type: 'Deluxe Room', price: 12999, capacity: '2 Adults' },
      { type: 'Executive Suite', price: 18999, capacity: '2 Adults, 2 Children' },
      { type: 'Presidential Suite', price: 25999, capacity: '4 Adults' }
    ],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587874522487-fe10e954d035?auto=format&fit=crop&w=800&q=80'
    ]
  },
  // Add other hotels here...
];

export default function HotelDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user, login } = useAuth();
  const { addBooking } = useBooking();
  
  const hotel = hotels.find(h => h.id === parseInt(resolvedParams.id));
  const selectedRoomDetails = hotel?.rooms.find(room => room.type === selectedRoom);

  const calculateNights = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return 0;
    const checkIn = new Date(selectedDates.checkIn);
    const checkOut = new Date(selectedDates.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    return selectedRoomDetails ? selectedRoomDetails.price * nights : 0;
  };

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

  const handlePaymentComplete = () => {
    if (!hotel) return;
    
    // Add the booking to the context
    addBooking({
      type: 'hotel',
      status: 'confirmed',
      details: {
        hotelName: hotel.name,
        roomType: selectedRoom,
        checkIn: selectedDates.checkIn,
        checkOut: selectedDates.checkOut,
      },
      price: calculateTotalPrice(),
    });
    
    setShowPaymentModal(false);
    setBookingConfirmed(true);
  };

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel Not Found</h2>
            <Link href="/hotels" className="text-[#7917BE] hover:text-[#9f1efb]">
              Back to Hotels
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
        <Link href="/hotels" className="inline-flex items-center text-[#7917BE] hover:text-[#9f1efb] mb-6">
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Back to Hotels
        </Link>

        {/* Hotel Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-96">
            <Image
              src={hotel.image}
              alt={hotel.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{hotel.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#7917BE]">₹{hotel.price.toLocaleString()}</div>
                <div className="text-gray-600">per night</div>
              </div>
            </div>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 font-semibold">{hotel.rating}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-600">{hotel.reviews.toLocaleString()} reviews</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">About this hotel</h2>
              <p className="text-gray-600">{hotel.description}</p>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotel.images.map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${hotel.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <WifiIcon className="h-5 w-5 text-[#7917BE] mr-2" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Book Your Stay</h2>
              
              {user && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-[#7917BE]">Booking as: {user}</p>
                </div>
              )}

              {/* Date Selection */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={selectedDates.checkIn}
                    onChange={(e) => setSelectedDates({ ...selectedDates, checkIn: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={selectedDates.checkOut}
                    onChange={(e) => setSelectedDates({ ...selectedDates, checkOut: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    min={selectedDates.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Room Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Room Type</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Choose a room</option>
                  {hotel.rooms.map((room, index) => (
                    <option key={index} value={room.type}>
                      {room.type} - ₹{room.price.toLocaleString()} ({room.capacity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Summary */}
              {selectedRoom && selectedDates.checkIn && selectedDates.checkOut && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Price Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Number of nights</span>
                      <span>{calculateNights()} nights</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per night</span>
                      <span>₹{selectedRoomDetails?.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total Amount</span>
                      <span>₹{calculateTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-[#7917BE] text-white py-3 px-6 rounded-lg hover:bg-[#9f1efb] transition-colors disabled:bg-gray-400"
                disabled={!selectedRoom || !selectedDates.checkIn || !selectedDates.checkOut}
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

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Hotel:</span> {hotel.name}</p>
                  <p><span className="font-medium">Room Type:</span> {selectedRoom}</p>
                  <p><span className="font-medium">Check-in:</span> {selectedDates.checkIn}</p>
                  <p><span className="font-medium">Check-out:</span> {selectedDates.checkOut}</p>
                  <p><span className="font-medium">Number of nights:</span> {calculateNights()}</p>
                  <p><span className="font-medium">Total Amount:</span> ₹{calculateTotalPrice().toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-6 py-2 bg-[#7917BE] text-white rounded-lg hover:bg-[#9f1efb]"
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
        amount={calculateTotalPrice()}
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
              <p className="text-gray-600 mb-6">Your booking has been confirmed. A confirmation email will be sent to {user}.</p>
              <Link
                href="/hotels"
                className="inline-block px-6 py-2 bg-[#7917BE] text-white rounded-lg hover:bg-[#9f1efb]"
                onClick={() => setBookingConfirmed(false)}
              >
                Back to Hotels
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 