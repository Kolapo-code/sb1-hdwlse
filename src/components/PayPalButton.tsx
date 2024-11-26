import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useBankStore } from '../store/bankStore';
import { toast } from 'react-hot-toast';

interface PayPalButtonProps {
  amount: string;
  currency: string;
  onSuccess: () => void;
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, currency, onSuccess }) => {
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: currency,
    intent: "capture",
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
            currency_code: currency,
          },
        },
      ],
    });
  };

  const onApprove = async (data: any, actions: any) => {
    const order = await actions.order.capture();
    toast.success('Payment successful!');
    onSuccess();
    return order;
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: "horizontal" }}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </PayPalScriptProvider>
  );
};