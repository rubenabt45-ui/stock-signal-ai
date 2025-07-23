import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  message?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError,
  message = "⚠️ Our servers are currently experiencing issues. Please try again later."
}) => {
  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-300 mb-6">{message}</p>
        {error && (
          <details className="text-sm text-gray-400 mb-6">
            <summary className="cursor-pointer">Technical details</summary>
            <pre className="mt-2 text-left bg-gray-800 p-3 rounded">
              {error.message}
            </pre>
          </details>
        )}
        <Button onClick={handleRefresh} className="inline-flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
};