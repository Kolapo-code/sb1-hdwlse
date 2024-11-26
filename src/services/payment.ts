import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const initiatePayment = async (amount: number, currency: string) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
    });

    const { clientSecret } = await response.json();
    return { stripe, clientSecret };
  } catch (error) {
    throw error;
  }
};

export const processPayment = async (
  stripe: any,
  elements: any,
  clientSecret: string
) => {
  try {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) throw error;
    return paymentIntent;
  } catch (error) {
    throw error;
  }
};