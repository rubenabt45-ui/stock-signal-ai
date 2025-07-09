import React from 'react';
import { Crown, X, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  open, 
  onClose, 
  feature = "this feature" 
}) => {
  const { createCheckoutSession, loading } = useSubscription();
  const { toast } = useToast();

  const handleUpgrade = async () => {
    try {
      toast({
        title: "Redirecting to checkout...",
        description: "Please wait while we prepare your subscription.",
      });
      
      await createCheckoutSession();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md tradeiq-card border-tradeiq-blue/30">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-tradeiq-blue" />
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
              You've reached the limit for {feature}.
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
              <Badge className="bg-tradeiq-blue text-white mt-2">
                Cancel anytime
              </Badge>
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
            <Button 
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90 text-white"
            >
              {loading ? 'Processing...' : 'Upgrade Now'}
            </Button>
            
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