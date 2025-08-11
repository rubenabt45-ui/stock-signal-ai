
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useStripeActions = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleUpgradeClick = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🚀 Initiating upgrade via test checkout URL...');
      const { data, error } = await supabase.functions.invoke('test-stripe-checkout-url', {
        method: 'POST'
      });
      
      if (error) throw error;
      
      if (data.url) {
        console.log('✅ Redirecting to checkout:', data.url);
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('❌ Upgrade failed:', error);
      toast({
        title: "Upgrade Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const handleManageSubscriptionClick = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to manage subscription",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🔧 Opening customer portal...');
      const { data, error } = await supabase.functions.invoke('stripe-portal', {
        method: 'POST'
      });
      
      if (error) throw error;
      
      if (data.url) {
        console.log('✅ Redirecting to customer portal:', data.url);
        window.open(data.url, '_blank');
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error) {
      console.error('❌ Manage subscription failed:', error);
      toast({
        title: "Portal Access Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  return {
    handleUpgradeClick,
    handleManageSubscriptionClick
  };
};
