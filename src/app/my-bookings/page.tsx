'use client';

import { useState, useEffect } from 'react';
import { useBooking } from '@/context/BookingContext';
import Navbar from '@/components/Navbar';
import { Tab } from '@headlessui/react';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserIcon, 
  CurrencyRupeeIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

export default function MyBookings() {
  const { bookings, cancelBooking } = useBooking();
  const [selectedTab, setSelectedTab] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = ['All', 'Flights', 'Hotels', 'Trains'];

  const getFilteredBookings = (category: string) => {
    if (category === 'All') return bookings;
    return bookings.filter(booking => 
      booking.type.toLowerCase() === category.toLowerCase().slice(0, -1)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <PaperAirplaneIcon className="h-6 w-6" />;
      case 'hotel':
        return <BuildingOfficeIcon className="h-6 w-6" />;
      case 'train':
        return <RocketLaunchIcon className="h-6 w-6" />;
      default:
        return null;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        <Tab.Group onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow-sm mb-6">
            {categories.map((category) => (
              <Tab
                key={category}
                className={({ selected }: { selected: boolean }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                    selected
                      ? 'bg-[#7917BE] text-white shadow'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {categories.map((category, idx) => (
              <Tab.Panel
                key={idx}
                className="space-y-4"
              >
                {getFilteredBookings(category).length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                    No {category.toLowerCase()} bookings found
                  </div>
                ) : (
                  getFilteredBookings(category).map((booking) => (
                    <div key={booking.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              {getIcon(booking.type)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {booking.type === 'hotel' ? booking.details.hotelName :
                                 `${booking.details.from} to ${booking.details.to}`}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Booked on {mounted ? format(new Date(booking.bookingDate), 'MMM dd, yyyy') : ''}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {booking.type === 'hotel' ? (
                            <>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <CalendarIcon className="h-5 w-5" />
                                <span>Check-in: {booking.details.checkIn}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <CalendarIcon className="h-5 w-5" />
                                <span>Check-out: {booking.details.checkOut}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <UserIcon className="h-5 w-5" />
                                <span>Room Type: {booking.details.roomType}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <CalendarIcon className="h-5 w-5" />
                                <span>Date: {booking.details.date}</span>
                              </div>
                              {booking.details.returnDate && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <CalendarIcon className="h-5 w-5" />
                                  <span>Return: {booking.details.returnDate}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2 text-gray-600">
                                <UserIcon className="h-5 w-5" />
                                <span>{booking.details.passengers} Passengers</span>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-gray-900">
                            <CurrencyRupeeIcon className="h-5 w-5" />
                            <span className="text-lg font-semibold">₹{booking.price.toLocaleString()}</span>
                          </div>
                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                            >
                              <XMarkIcon className="h-5 w-5" />
                              <span>Cancel Booking</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
} 