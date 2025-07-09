import React from 'react';
import { Check, X, Crown, Zap } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Pricing = () => {
  const { createCheckoutSession, isPro, loading } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGetStarted = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      toast({
        title: "Redirecting to checkout...",
        description: "Please wait while we prepare your subscription.",
      });
      
      await createCheckoutSession();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

  const features = {
    free: [
      { name: "5 messages/day on StrategyAI", included: true },
      { name: "Full access to Learn PDFs", included: true },
      { name: "Economic Events", included: false, note: "Coming Soon" },
      { name: "Real-time market updates", included: false },
      { name: "Chat history", included: false },
      { name: "Customer support", included: false },
    ],
    pro: [
      { name: "Unlimited StrategyAI messages", included: true },
      { name: "Full access to Learn PDFs", included: true },
      { name: "Economic Events", included: true, note: "Coming Soon" },
      { name: "Real-time market updates", included: true, note: "Future" },
      { name: "Complete chat history", included: true },
      { name: "Priority email support", included: true },
    ]
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Pricing Plans</h1>
                <p className="text-sm text-gray-400 font-medium">Choose the plan that's right for you</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start for free and upgrade when you're ready for unlimited access to our AI trading tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="tradeiq-card relative">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-white mb-2">
                $0<span className="text-lg font-normal text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">Perfect for getting started</p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-4 mb-8">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                    )}
                    <span className={`${feature.included ? 'text-white' : 'text-gray-500'}`}>
                      {feature.name}
                      {feature.note && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {feature.note}
                        </Badge>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={handleGetStarted}
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="tradeiq-card relative border-tradeiq-blue/50">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-tradeiq-blue text-white px-4 py-1">
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-tradeiq-blue" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
              <div className="text-4xl font-bold text-white mb-2">
                $9.99<span className="text-lg font-normal text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">For serious traders</p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-4 mb-8">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-white">
                      {feature.name}
                      {feature.note && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {feature.note}
                        </Badge>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              
              {isPro ? (
                <Button 
                  disabled
                  className="w-full bg-green-600 hover:bg-green-600"
                >
                  Current Plan
                </Button>
              ) : (
                <Button 
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90 text-white"
                >
                  {loading ? 'Processing...' : 'Upgrade to Pro'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="text-lg font-semibold text-white mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-400">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-400">We accept all major credit cards and debit cards through our secure Stripe payment processor.</p>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h4>
              <p className="text-gray-400">You can start with our free plan immediately. No credit card required to get started.</p>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-white mb-2">When will Economic Events be available?</h4>
              <p className="text-gray-400">Economic Events feature is coming soon for all users. Pro users will get early access when it launches.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;