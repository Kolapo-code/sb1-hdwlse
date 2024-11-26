export type Currency = 'USD' | 'GBP' | 'EUR';

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  type: 'credit' | 'debit';
  description: string;
  date: Date;
}

export interface Account {
  id: string;
  balance: number;
  currency: Currency;
  transactions: Transaction[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  accounts: Account[];
}