/**
 * Stripe Service
 * Handles Stripe Connect and payment operations
 */

import apiClient from '../lib/apiClient';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string;

export interface StripeAccountStatus {
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  requirements?: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
  };
}

export interface PaymentCheckoutResponse {
  payment_intent_id: string;
  client_secret: string;
  checkout_url: string;
}

/**
 * Create Stripe Connect account for seller
 */
export const createStripeAccount = async (returnUrl: string, refreshUrl: string) => {
  const response = await apiClient.post('/stripe/create-account/', {
    return_url: returnUrl,
    refresh_url: refreshUrl,
  });
  return response.data;
};

/**
 * Get Stripe account status for current seller
 */
export const getStripeAccountStatus = async (): Promise<StripeAccountStatus> => {
  const response = await apiClient.get('/stripe/account-status/');
  return response.data;
};

/**
 * Create account link for onboarding/re-authentication
 */
export const createAccountLink = async (returnUrl: string, refreshUrl: string) => {
  const response = await apiClient.post('/stripe/create-account-link/', {
    return_url: returnUrl,
    refresh_url: refreshUrl,
  });
  return response.data;
};

/**
 * Get Stripe dashboard URL for seller
 */
export const getStripeDashboardUrl = async () => {
  const response = await apiClient.get('/stripe/dashboard-link/');
  return response.data;
};

/**
 * Create payment checkout for an order
 */
export const createOrderCheckout = async (
  orderId: number,
  successUrl: string,
  cancelUrl: string
): Promise<PaymentCheckoutResponse> => {
  const response = await apiClient.post(`/orders/${orderId}/create-payment/`, {
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  return response.data;
};

/**
 * Get Stripe publishable key
 */
export const getStripePublicKey = () => {
  if (!stripePublicKey || stripePublicKey === 'pk_test_your_public_key_here') {
    console.warn('⚠️ Stripe publishable key not configured. Please update .env file.');
    return null;
  }
  return stripePublicKey;
};

/**
 * Check if Stripe is configured
 */
export const isStripeConfigured = () => {
  const key = getStripePublicKey();
  return key !== null && key.startsWith('pk_');
};

export default {
  createStripeAccount,
  getStripeAccountStatus,
  createAccountLink,
  getStripeDashboardUrl,
  createOrderCheckout,
  getStripePublicKey,
  isStripeConfigured,
};
