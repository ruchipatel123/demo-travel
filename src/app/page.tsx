'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SearchForm from '@/components/SearchForm';
import Image from 'next/image';
import { PaperAirplaneIcon, BuildingOffice2Icon, TruckIcon } from '@heroicons/react/24/outline';

type BookingType = 'flight' | 'hotel' | 'train';

export default function Home() {
  const [activeTab, setActiveTab] = useState<BookingType>('flight');

  const getHeroTitle = () => {
    switch (activeTab) {
      case 'flight':
        return 'Great Deals on Flights';
      case 'hotel':
        return 'Book Your Perfect Stay';
      case 'train':
        return 'Train Tickets Made Easy';
      default:
        return '';
    }
  };

  const getHeroSubtitle = () => {
    switch (activeTab) {
      case 'flight':
        return 'Book Domestic and International Flights at Best Prices';
      case 'hotel':
        return 'Find and Book Hotels & Resorts at the Best Rates';
      case 'train':
        return 'Book Train Tickets Quickly and Easily';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="relative">
        {/* Hero Background */}
        <div className="absolute inset-0 h-[600px] z-0">
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80"
            alt="Travel Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 pt-16 pb-32">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {getHeroTitle()}
            </h1>
            <p className="text-xl mb-8">
              {getHeroSubtitle()}
            </p>
          </div>

          {/* Booking Type Tabs */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-center ">
              <div className="inline-flex rounded-lg bg-white/10 backdrop-blur-sm ">
                <button
                  className={`flex text-center py-2 px-2 rounded-t-lg ${
                    activeTab === 'flight'
                      ? 'bg-white text-[#7917BE]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab('flight')}
                >
                  <PaperAirplaneIcon className="h-5 w-5 mr-2 rotate-45" />
                  Flights
                </button>
                <button
                  className={`flex text-center py-2 px-2 rounded-t-lg ${
                    activeTab === 'hotel'
                      ? 'bg-white text-[#7917BE]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab('hotel')}
                >
                  <BuildingOffice2Icon className="h-5 w-5 mr-2" />
                  Hotels
                </button>
                <button
                  className={`flex text-center py-2 px-2 rounded-t-lg ${
                    activeTab === 'train'
                      ? 'bg-white text-[#7917BE]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab('train')}
                >
                  <TruckIcon className="h-5 w-5 mr-2" />
                  Trains
                </button>
              </div>
            </div>
            
            {/* Search Form */}
            <div className="mt-0">
              <SearchForm type={activeTab} />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#7917BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">Get the best deals and offers on all bookings</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#7917BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
            <p className="text-gray-600">100% secure and hassle-free booking process</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#7917BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">Round the clock customer support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
