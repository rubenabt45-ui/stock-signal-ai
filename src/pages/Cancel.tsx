
import React from 'react';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
  const navigate = useNavigate();

  const handleReturnToSettings = () => {
    navigate('/settings');
  };

  const handleTryAgain = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Cancel Icon */}
        <div className="flex justify-center">
          <XCircle className="h-24 w-24 text-red-500" />
        </div>

        {/* Cancel Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            Payment Cancelled
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            Your upgrade was not completed
          </p>
          <p className="text-gray-400 leading-relaxed">
            No charges were made to your account. You can try upgrading to Pro again at any time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={handleTryAgain}
            className="w-full bg-tradeiq-blue hover:bg-blue-600 text-white font-medium h-12 text-lg"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Upgrade Again
          </Button>
          
          <Button 
            onClick={handleReturnToSettings}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 h-12 text-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Return to Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
