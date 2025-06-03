'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import FlightSearchForm from '@/components/FlightSearchForm';
import Navbar from '@/components/Navbar';

const dummyDestinations = [
  {
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=800&q=80',
    price: '₹2,999'
  },
  {
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    price: '₹3,499'
  },
  {
    name: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    price: '₹2,499'
  },
  {
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    price: '₹4,999'
  },
  {
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    price: '₹24,999'
  },
  {
    name: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    price: '₹29,999'
  }
];

export default function FlightsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[400px] bg-blue-600 ">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80"
            alt="Flight Hero"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="py-10 justify-center">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">Book Your Flight Tickets</h1>
            <p className="text-xl">Find the best deals on flights to your favorite destinations</p>
          </div>
          <div className="max-w-4xl mx-auto w-full">
            <FlightSearchForm />
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-60">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyDestinations.map((destination, index) => (
            <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-semibold">{destination.name}</h3>
                <p className="text-sm">Starting from {destination.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Book with Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Get the best deals and offers on flight tickets</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Safe and secure payment options</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 