import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@nativescript/core';
import { Account } from '../../src/types';

interface AccountCardProps {
  account: Account;
  onPress: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onPress }) => {
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '';
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.currency}>{account.currency} Account</Text>
        <Text style={styles.balance}>
          {getCurrencySymbol(account.currency)}
          {account.balance.toFixed(2)}
        </Text>
        <Text style={styles.viewTransactions}>View Transactions →</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currency: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  viewTransactions: {
    color: '#4C0072',
    fontSize: 14,
    fontWeight: '500',
  },
});