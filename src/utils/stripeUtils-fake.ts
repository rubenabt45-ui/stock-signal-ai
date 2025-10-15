// Fake Stripe utilities for frontend-only mode
import { fakeMarketClient } from '@/lib/fakeClient';

export const checkProAccess = (userProfile: any): boolean => {
  return userProfile?.is_pro || false;
};

export const createStripeCheckout = async (): Promise<string | null> => {
  await fakeMarketClient.upgradeToPro();
  return null;
};

export const createStripePortal = async (): Promise<string | null> => {
  console.log('Customer portal (fake mode)');
  return null;
};

export const redirectToStripe = (_url: string): void => {
  console.log('Redirect to Stripe (fake mode)');
};
