'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserIcon } from '@heroicons/react/24/solid';
import LoginModal from './LoginModal';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, login, logout } = useAuth();

  const handleLogin = (email: string) => {
    login(email);
    setShowLoginModal(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="relative w-[150px] h-[50px]">
                <Image
                  src="/logo.svg"
                  alt="Travel Go"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/hotels"
                className="border-transparent text-gray-500 hover:border-[#7917BE] hover:text-[#7917BE] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Hotels
              </Link>
              <Link
                href="/flights"
                className="border-transparent text-gray-500 hover:border-[#7917BE] hover:text-[#7917BE] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Flights
              </Link>
              <Link
                href="/trains"
                className="border-transparent text-gray-500 hover:border-[#7917BE] hover:text-[#7917BE] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Trains
              </Link>
              {user && (
                <Link
                  href="/my-bookings"
                  className="border-transparent text-gray-500 hover:border-[#7917BE] hover:text-[#7917BE] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Bookings
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <UserIcon className="h-6 w-6" />
                  <span className="text-sm font-medium">{user.split('@')[0]}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Signed in as<br />
                    <span className="font-medium text-gray-900">{user}</span>
                  </div>
                  <div className="border-t border-gray-100"></div>
                  <Link
                    href="/my-bookings"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#7917BE] hover:bg-[#9f1efb]"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </nav>
  );
} 