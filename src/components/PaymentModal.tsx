'use client';

import { useState } from 'react';
import { XMarkIcon, CreditCardIcon, QrCodeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  amount: number;
}

export default function PaymentModal({ isOpen, onClose, onPaymentComplete, amount }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | ''>('');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPaymentComplete();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-lg font-semibold mb-2">Amount to Pay</div>
          <div className="text-3xl font-bold text-[#7917BE]">₹{amount.toLocaleString()}</div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border rounded-lg flex items-center justify-center gap-2 ${
                paymentMethod === 'card' ? 'border-[#7917BE] bg-purple-50' : 'border-gray-200'
              }`}
            >
              <CreditCardIcon className="h-6 w-6 text-[#7917BE]" />
              <span>Credit/Debit Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 border rounded-lg flex items-center justify-center gap-2 ${
                paymentMethod === 'upi' ? 'border-[#7917BE] bg-purple-50' : 'border-gray-200'
              }`}
            >
              <QrCodeIcon className="h-6 w-6 text-[#7917BE]" />
              <span>UPI Payment</span>
            </button>
          </div>

          {paymentMethod === 'card' && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="1234 5678 9012 3456"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  placeholder="Name on card"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7917BE] text-white py-3 px-6 rounded-lg hover:bg-[#9f1efb] disabled:bg-gray-400"
              >
                {loading ? 'Processing Payment...' : `Pay ₹${amount.toLocaleString()}`}
              </button>
            </form>
          )}

          {paymentMethod === 'upi' && (
            <div className="text-center space-y-4">
              <div className="bg-gray-100 p-6 rounded-lg inline-block mx-auto">
                <div className="text-sm mb-2">Scan QR code to pay</div>
                {/* Replace with actual QR code */}
                <div className="w-48 h-48 bg-white p-4">
                  <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
                    QR Code
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center mt-2">
                Or pay using UPI ID: payment@travelgo
              </p>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#7917BE] text-white py-3 px-6 rounded-lg hover:bg-[#9f1efb] disabled:bg-gray-400"
              >
                {loading ? 'Confirming Payment...' : 'I have completed the payment'}
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-4">
            <Image src="/visa.png" alt="Visa" width={40} height={25} />
            <Image src="/mastercard.png" alt="Mastercard" width={40} height={25} />
            <Image src="/rupay.png" alt="RuPay" width={40} height={25} />
          </div>
        </div>
      </div>
    </div>
  );
} 