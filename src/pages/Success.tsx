
import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionDetails {
  sessionId: string;
  status: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  metadata: any;
}

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('No session ID found in URL');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const fetchSessionDetails = async () => {
      try {
        console.log('Fetching session details for:', sessionId);
        
        // Get the current session token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.access_token) {
          throw new Error('Failed to get authentication session');
        }

        // Call the edge function to get session details
        const { data, error } = await supabase.functions.invoke('get-checkout-session', {
          body: { sessionId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          throw new Error(error.message || 'Failed to retrieve session details');
        }

        console.log('Session details retrieved:', data);
        setSessionDetails(data);
        
        // Trigger confetti animation on successful retrieval
        setShowConfetti(true);
        
      } catch (error) {
        console.error('Error fetching session details:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        
        toast({
          title: "Error retrieving session",
          description: "Could not verify your payment. Please contact support if you were charged.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [searchParams, user, toast]);

  useEffect(() => {
    // Optional: Auto-redirect after 15 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleReturnToDashboard = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <Loader2 className="h-12 w-12 text-tradeiq-blue animate-spin mx-auto" />
          <h1 className="text-2xl font-bold text-white">
            Verifying your payment...
          </h1>
          <p className="text-gray-400">
            Please wait while we confirm your subscription.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <CheckCircle className="h-24 w-24 text-yellow-500" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white">
              Payment Processing
            </h1>
            <p className="text-xl text-yellow-400 font-medium">
              We're confirming your payment
            </p>
            <p className="text-gray-400 leading-relaxed">
              Your payment is being processed. You should receive access to Pro features shortly.
              If you continue to see this message, please contact support.
            </p>
          </div>
          <Button 
            onClick={handleReturnToDashboard}
            className="w-full bg-tradeiq-blue hover:bg-blue-600 text-white font-medium h-12 text-lg"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
            Payment Successful
          </p>
          {sessionDetails && (
            <div className="text-gray-400 leading-relaxed space-y-2">
              <p>
                Your subscription has been activated successfully. You now have access to unlimited ChartIA analyses, 
                advanced TradingChat features, and priority support.
              </p>
              <div className="text-sm">
                <p>Payment Status: <span className="text-green-400 font-medium">{sessionDetails.paymentStatus}</span></p>
                <p>Amount: <span className="text-white font-medium">
                  ${(sessionDetails.amountTotal / 100).toFixed(2)} {sessionDetails.currency.toUpperCase()}
                </span></p>
                <p>Session ID: <span className="text-gray-500 font-mono text-xs">{sessionDetails.sessionId}</span></p>
              </div>
            </div>
          )}
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
            You'll be automatically redirected in 15 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
