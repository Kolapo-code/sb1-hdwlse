import React from 'react';
import { format } from 'date-fns';
import { useBankStore } from '../store/bankStore';
import { Transaction } from '../types';

interface TransactionRowProps {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const symbol = transaction.currency === 'USD' ? '$' : 
                transaction.currency === 'EUR' ? '€' : '£';
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(transaction.date), 'MMM d, yyyy HH:mm')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {transaction.description}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
      }`}>
        {transaction.type === 'credit' ? '+' : '-'}{symbol}{Math.abs(transaction.amount).toFixed(2)}
      </td>
    </tr>
  );
};

export const TransactionHistory: React.FC<{ accountId: string }> = ({ accountId }) => {
  const user = useBankStore((state) => state.user);
  const account = user?.accounts.find(acc => acc.id === accountId);

  if (!account) return null;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {account.transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};