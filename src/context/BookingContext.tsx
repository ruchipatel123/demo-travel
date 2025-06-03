'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BookingItem {
  id: string;
  type: 'flight' | 'hotel' | 'train';
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  details: {
    from?: string;
    to?: string;
    date?: string;
    returnDate?: string;
    passengers?: number;
    hotelName?: string;
    roomType?: string;
    checkIn?: string;
    checkOut?: string;
    trainNumber?: string;
    class?: string;
  };
  price: number;
}

interface BookingContextType {
  bookings: BookingItem[];
  addBooking: (booking: Omit<BookingItem, 'id' | 'bookingDate'>) => void;
  cancelBooking: (id: string) => void;
  getBookingsByType: (type: BookingItem['type']) => BookingItem[];
  getUserBookings: () => BookingItem[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load bookings from localStorage on mount
  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
    setMounted(true);
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [bookings, mounted]);

  const addBooking = (booking: Omit<BookingItem, 'id' | 'bookingDate'>) => {
    const newBooking: BookingItem = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      bookingDate: new Date().toISOString(),
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      )
    );
  };

  const getBookingsByType = (type: BookingItem['type']) => {
    return bookings.filter(booking => booking.type === type);
  };

  const getUserBookings = () => {
    return bookings;
  };

  if (!mounted) {
    return null;
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        getBookingsByType,
        getUserBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
} 