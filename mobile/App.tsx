import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from '@nativescript/theme';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { ATMLocatorScreen } from './screens/ATMLocatorScreen';
import { useAuthStore } from '../src/store/authStore';

const Stack = createStackNavigator();

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {!isAuthenticated ? (
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen 
                name="Dashboard" 
                component={DashboardScreen}
                options={{ 
                  title: 'NatWest Banking',
                  headerStyle: {
                    backgroundColor: '#4C0072',
                  },
                  headerTintColor: '#fff',
                }}
              />
              <Stack.Screen 
                name="Transactions" 
                component={TransactionsScreen}
                options={{ title: 'Transactions' }}
              />
              <Stack.Screen 
                name="Payment" 
                component={PaymentScreen}
                options={{ title: 'Make Payment' }}
              />
              <Stack.Screen 
                name="ATMLocator" 
                component={ATMLocatorScreen}
                options={{ title: 'Find ATM' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}