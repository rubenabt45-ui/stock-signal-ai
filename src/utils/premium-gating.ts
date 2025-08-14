
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';

export const checkPremiumAccess = (subscription: ReturnType<typeof useSubscription>) => {
  if (!subscription.isPro) {
    toast.error('This feature requires a Pro subscription');
    return false;
  }
  return true;
};

export const premiumGate = (
  callback: () => void,
  subscription: ReturnType<typeof useSubscription>
) => {
  if (checkPremiumAccess(subscription)) {
    callback();
  }
};
