import React, { useState } from 'react';
import { useBankStore } from '../store/bankStore';
import { TransactionHistory } from './TransactionHistory';
import { PaymentForm } from './PaymentForm';
import { Currency } from '../types';

export const Dashboard: React.FC = () => {
  const user = useBankStore((state) => state.user);
  const convertCurrency = useBankStore((state) => state.convertCurrency);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  if (!user) return <div>Loading...</div>;

  const totalBalance = user.accounts.reduce((total, account) => {
    const balanceInUSD = convertCurrency(account.balance, account.currency, 'USD');
    return total + balanceInUSD;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {user.name}</h1>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Total Balance (USD)</h2>
              <p className="text-3xl font-bold text-indigo-600">${totalBalance.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {user.accounts.map((account) => (
                <div 
                  key={account.id} 
                  className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedAccountId === account.id ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  onClick={() => setSelectedAccountId(account.id)}
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {account.currency} Account
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {account.currency === 'USD' && '$'}
                    {account.currency === 'EUR' && '€'}
                    {account.currency === 'GBP' && '£'}
                    {account.balance.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedAccountId && (
            <TransactionHistory accountId={selectedAccountId} />
          )}
        </div>

        <div className="lg:col-span-1">
          <PaymentForm />
        </div>
      </div>
    </div>
  );
};