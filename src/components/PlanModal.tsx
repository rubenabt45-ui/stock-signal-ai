
import React from 'react';
import { X, Check, Zap, MessageSquare, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const startCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upgrade to Pro.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting checkout process for user:', user.id);
      
      // Get the current session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to get authentication session');
      }

      console.log('Retrieved session token, calling Edge Function');
      
      // Call the Edge Function to create checkout session with Authorization header
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (!data?.url) {
        console.error('No checkout URL returned:', data);
        throw new Error('No checkout URL received');
      }

      console.log('Checkout session created successfully:', data.sessionId);
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
    } catch (error) {
      console.error('Checkout error:', error);
      
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-tradeiq-navy border-gray-800/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Free Plan */}
          <div className="tradeiq-card p-6 relative">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Free Plan</h3>
              <div className="text-3xl font-bold text-gray-400">$0</div>
              <div className="text-sm text-gray-400">Forever</div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Limited ChartIA Access</div>
                  <div className="text-gray-400 text-sm">3 analyses per day</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Access to NewsAI</div>
                  <div className="text-gray-400 text-sm">Basic news analysis</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Basic TradingChat</div>
                  <div className="text-gray-400 text-sm">No memory or asset tracking</div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-gray-600 text-gray-400 hover:bg-gray-800"
              disabled
            >
              Current Plan
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="tradeiq-card p-6 relative border-2 border-tradeiq-blue">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-tradeiq-blue text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span>Most Popular</span>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
              <div className="text-3xl font-bold text-tradeiq-blue">$9.99</div>
              <div className="text-sm text-gray-400">per month</div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-tradeiq-blue mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Unlimited ChartIA Access</div>
                  <div className="text-gray-400 text-sm">Unlimited analyses and insights</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-tradeiq-blue mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Real-time NewsAI</div>
                  <div className="text-gray-400 text-sm">Save favorites & advanced filtering</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MessageSquare className="h-5 w-5 text-tradeiq-blue mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Advanced TradingChat</div>
                  <div className="text-gray-400 text-sm">Memory & asset tracking</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-tradeiq-blue mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Priority Support</div>
                  <div className="text-gray-400 text-sm">24/7 dedicated assistance</div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startCheckout}
              className="w-full bg-tradeiq-blue hover:bg-blue-600 text-white font-medium"
              disabled={!user}
            >
              {user ? 'Upgrade to Pro' : 'Sign In Required'}
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>Cancel anytime. No hidden fees. Secure payment with Stripe.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanModal;
