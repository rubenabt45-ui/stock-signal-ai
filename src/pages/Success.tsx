
import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation on mount
    setShowConfetti(true);
    
    // Optional: Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleReturnToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background sparkles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-20 left-10 text-tradeiq-blue h-6 w-6 animate-pulse" />
          <Sparkles className="absolute top-32 right-20 text-yellow-400 h-4 w-4 animate-pulse delay-300" />
          <Sparkles className="absolute bottom-40 left-20 text-green-400 h-5 w-5 animate-pulse delay-700" />
          <Sparkles className="absolute bottom-20 right-10 text-purple-400 h-6 w-6 animate-pulse delay-1000" />
          <Sparkles className="absolute top-1/2 left-1/3 text-pink-400 h-4 w-4 animate-pulse delay-500" />
          <Sparkles className="absolute top-1/3 right-1/3 text-blue-300 h-5 w-5 animate-pulse delay-200" />
        </div>
      )}

      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <CheckCircle className="h-24 w-24 text-green-500 animate-scale-in" />
            <div className="absolute inset-0 h-24 w-24 rounded-full border-4 border-green-500/20 animate-ping"></div>
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-3xl font-bold text-white">
            Welcome to TradeIQ Pro! 🎉
          </h1>
          <p className="text-xl text-tradeiq-blue font-medium">
            You're now a Pro user
          </p>
          <p className="text-gray-400 leading-relaxed">
            Your subscription has been activated successfully. You now have access to unlimited ChartIA analyses, 
            advanced TradingChat features, and priority support.
          </p>
        </div>

        {/* Pro Features Summary */}
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50 space-y-3 animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-4">What's unlocked:</h3>
          <div className="space-y-2 text-left">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Unlimited ChartIA access</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Advanced TradingChat with memory</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Real-time NewsAI + favorites</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Priority support access</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 animate-fade-in">
          <Button 
            onClick={handleReturnToDashboard}
            className="w-full bg-tradeiq-blue hover:bg-blue-600 text-white font-medium h-12 text-lg"
          >
            Return to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <p className="text-gray-500 text-sm">
            You'll be automatically redirected in 10 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
