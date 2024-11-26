import React, { useState } from 'react';
import { useBankStore } from '../store/bankStore';
import { Currency } from '../types';
import { OTPVerification } from './OTPVerification';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { PayPalButton } from './PayPalButton';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const PaymentForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const addTransaction = useBankStore((state) => state.addTransaction);
  const user = useBankStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowOTP(true);
  };

  const handlePaymentComplete = () => {
    const account = user?.accounts.find(acc => acc.currency === currency);
    if (!account || !amount) return;

    addTransaction(account.id, {
      amount: parseFloat(amount),
      currency,
      type: 'debit',
      description: `Payment to ${recipient}: ${description}`
    });

    setAmount('');
    setRecipient('');
    setDescription('');
    setShowOTP(false);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setPaymentMethod('stripe')}
          className={`px-4 py-2 rounded-md ${
            paymentMethod === 'stripe'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Credit Card
        </button>
        <button
          onClick={() => setPaymentMethod('paypal')}
          className={`px-4 py-2 rounded-md ${
            paymentMethod === 'paypal'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          PayPal
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="+1234567890"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recipient</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        {paymentMethod === 'stripe' ? (
          <Elements stripe={stripePromise}>
            <PaymentElement />
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Pay with Card
            </button>
          </Elements>
        ) : (
          <PayPalButton
            amount={amount}
            currency={currency}
            onSuccess={handlePaymentComplete}
          />
        )}
      </form>

      {showOTP && (
        <div className="mt-4">
          <OTPVerification
            onVerificationComplete={handlePaymentComplete}
            phoneNumber={phoneNumber}
          />
        </div>
      )}
    </div>
  );
};