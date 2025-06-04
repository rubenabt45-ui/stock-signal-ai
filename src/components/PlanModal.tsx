
import React from 'react';
import { X, Check, Zap, MessageSquare, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose }) => {
  const startCheckout = () => {
    // Stripe Checkout integration with test Price ID
    const stripe = (window as any).Stripe('pk_test_51234567890abcdefghijklmnopqrstuvwxyz'); // Test publishable key
    
    stripe.redirectToCheckout({
      lineItems: [{
        price: 'price_1OxxxxxxTestProTier', // Test Price ID for Pro tier
        quantity: 1,
      }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/settings`,
    }).then((result: any) => {
      if (result.error) {
        console.error('Stripe checkout error:', result.error);
        alert('There was an error processing your payment. Please try again.');
      }
    });
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
            >
              Upgrade to Pro
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
