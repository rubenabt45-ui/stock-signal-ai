
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useRealTimePriceContext } from '@/components/RealTimePriceProvider';

interface LivePriceBadgeProps {
  symbol: string;
}

export const LivePriceBadge = ({ symbol }: LivePriceBadgeProps) => {
  const { prices, isConnected } = useRealTimePriceContext();
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [isAnimating, setIsAnimating] = useState(false);

  const currentPriceData = prices[symbol];
  const currentPrice = currentPriceData?.currentPrice;

  useEffect(() => {
    if (currentPrice && previousPrice !== null) {
      if (currentPrice > previousPrice) {
        setPriceDirection('up');
      } else if (currentPrice < previousPrice) {
        setPriceDirection('down');
      } else {
        setPriceDirection('neutral');
      }
      
      // Trigger animation on price change
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    
    if (currentPrice) {
      setPreviousPrice(currentPrice);
    }
  }, [currentPrice, previousPrice]);

  if (!currentPriceData) {
    return null;
  }

  const getBadgeColor = () => {
    switch (priceDirection) {
      case 'up':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'down':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getIndicatorColor = () => {
    if (!isConnected) return 'bg-red-500';
    switch (priceDirection) {
      case 'up':
        return 'bg-green-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className={`flex items-center space-x-2 transition-all duration-300 ${
      isAnimating ? 'animate-scale-in' : ''
    }`}>
      <Badge 
        className={`px-3 py-1.5 text-sm font-bold border transition-all duration-300 ${getBadgeColor()} ${
          isAnimating ? 'scale-105 shadow-lg' : 'shadow-md'
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {priceDirection === 'up' && <TrendingUp className="h-3 w-3" />}
            {priceDirection === 'down' && <TrendingDown className="h-3 w-3" />}
            <span>${currentPrice.toFixed(2)}</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${getIndicatorColor()} ${
            isConnected ? 'animate-pulse' : ''
          }`}></div>
        </div>
      </Badge>
    </div>
  );
};
