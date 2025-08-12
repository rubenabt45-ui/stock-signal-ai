
import React from 'react';
import { X, Check, Zap, MessageSquare, TrendingUp, Star, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { createCheckoutSession, loading, stripeConfigured } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upgrade to Pro.",
        variant: "destructive",
      });
      onClose();
      navigate('/login');
      return;
    }

    if (!stripeConfigured) {
      toast({
        title: "Service unavailable",
        description: "Payment processing is temporarily unavailable. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    if (!createCheckoutSession) {
      toast({
        title: "Error",
        description: "Checkout functionality is not available. Please try refreshing the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting checkout process for user:', user.id);
      
      toast({
        title: "Redirecting to checkout...",
        description: "Please wait while we prepare your subscription.",
      });
      
      await createCheckoutSession();
      onClose();
      
    } catch (error) {
      console.error('Checkout error:', error);
      
      let errorMessage = "There was an error processing your payment. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('not configured')) {
          errorMessage = "Payment processing is not properly configured. Please contact support.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Checkout failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const proFeatures = [
    "Unlimited StrategyAI messages",
    "Complete chat history",
    "Priority customer support",
    "Early access to new features",
    "Advanced trading insights"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md tradeiq-card border-tradeiq-blue/30">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-tradeiq-blue" />
              <DialogTitle className="text-xl font-bold text-white">
                Upgrade to Pro
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="text-center mb-6">
            <p className="text-gray-300 mb-2">
              Unlock unlimited access to all TradeIQ features.
            </p>
            <p className="text-gray-400 text-sm">
              Upgrade to Pro for unlimited access and more features.
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white">
                $9.99<span className="text-lg font-normal text-gray-400">/month</span>
              </div>
              <div className="text-sm text-gray-400 mt-1">Cancel anytime</div>
            </div>
            
            <ul className="space-y-2">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            {!stripeConfigured ? (
              <>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-3">
                  <div className="flex items-center space-x-2 text-yellow-300">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Payment processing temporarily unavailable</span>
                  </div>
                </div>
                <Button 
                  disabled
                  className="w-full bg-gray-600 text-gray-400 cursor-not-allowed"
                >
                  Service Unavailable
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleUpgrade}
                disabled={loading || !user}
                className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90 text-white"
              >
                {loading ? 'Processing...' : user ? 'Upgrade Now' : 'Sign In Required'}
              </Button>
            )}
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanModal;

