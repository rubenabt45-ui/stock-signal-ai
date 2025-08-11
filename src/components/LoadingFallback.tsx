
import { ChartCandlestick } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <ChartCandlestick className="h-12 w-12 text-tradeiq-blue animate-pulse" />
        <div className="text-white text-lg font-medium">{message}</div>
        <div className="text-gray-400 text-sm">TradeIQ</div>
      </div>
    </div>
  );
};
