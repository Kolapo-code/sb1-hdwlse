import { create } from 'zustand';
import { User, Account, Transaction, Currency } from '../types';

interface BankState {
  user: User | null;
  setUser: (user: User) => void;
  addTransaction: (accountId: string, transaction: Omit<Transaction, 'id' | 'date'>) => void;
  convertCurrency: (amount: number, from: Currency, to: Currency) => number;
}

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  accounts: [
    {
      id: '1',
      balance: 5000,
      currency: 'USD',
      transactions: []
    },
    {
      id: '2',
      balance: 3000,
      currency: 'GBP',
      transactions: []
    },
    {
      id: '3',
      balance: 4000,
      currency: 'EUR',
      transactions: []
    }
  ]
};

export const useBankStore = create<BankState>((set) => ({
  user: mockUser,
  setUser: (user) => set({ user }),
  addTransaction: (accountId, transaction) =>
    set((state) => {
      if (!state.user) return state;

      const newTransaction: Transaction = {
        ...transaction,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date()
      };

      const updatedAccounts = state.user.accounts.map((account) => {
        if (account.id === accountId) {
          const balanceChange = transaction.type === 'credit' ? transaction.amount : -transaction.amount;
          return {
            ...account,
            balance: account.balance + balanceChange,
            transactions: [newTransaction, ...account.transactions]
          };
        }
        return account;
      });

      return {
        user: {
          ...state.user,
          accounts: updatedAccounts
        }
      };
    }),
  convertCurrency: (amount, from, to) => {
    const rates = {
      USD: { EUR: 0.92, GBP: 0.79 },
      EUR: { USD: 1.09, GBP: 0.86 },
      GBP: { USD: 1.27, EUR: 1.16 }
    };
    
    if (from === to) return amount;
    return amount * rates[from][to];
  }
}));