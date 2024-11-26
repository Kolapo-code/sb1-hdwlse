import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from '@nativescript/core';
import { useBankStore } from '../../src/store/bankStore';
import { AccountCard } from '../components/AccountCard';
import { QuickActions } from '../components/QuickActions';

export const DashboardScreen = ({ navigation }) => {
  const user = useBankStore((state) => state.user);
  const convertCurrency = useBankStore((state) => state.convertCurrency);

  if (!user) return null;

  const totalBalance = user.accounts.reduce((total, account) => {
    const balanceInUSD = convertCurrency(account.balance, account.currency, 'USD');
    return total + balanceInUSD;
  }, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user.name}</Text>
        <Text style={styles.totalBalance}>
          Total Balance (USD)
          <Text style={styles.amount}>${totalBalance.toFixed(2)}</Text>
        </Text>
      </View>

      <QuickActions navigation={navigation} />

      <View style={styles.accounts}>
        {user.accounts.map((account) => (
          <AccountCard 
            key={account.id}
            account={account}
            onPress={() => navigation.navigate('Transactions', { accountId: account.id })}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4C0072',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  totalBalance: {
    fontSize: 16,
    color: '#ffffff',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  accounts: {
    padding: 20,
  },
});