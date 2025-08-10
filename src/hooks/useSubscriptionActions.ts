
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSubscriptionActions = () => {
  const { toast } = useToast();

  const createCheckoutSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createPortalSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast({
        title: "Error",
        description: "Failed to open billing portal. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    createCheckoutSession,
    createPortalSession
  };
};
