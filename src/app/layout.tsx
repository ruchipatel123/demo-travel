import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { BookingProvider } from '@/context/BookingContext';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Go",
  description: "Your trusted travel companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <BookingProvider>
            <main className="min-h-screen bg-gray-100">
              {children}
            </main>
            <Footer />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
