
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useMarketData } from "@/hooks/useMarketData";

interface MarketPriceProps {
  symbol: string;
  showSymbol?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MarketPrice = ({ 
  symbol, 
  showSymbol = false, 
  size = 'md',
  className = ''
}: MarketPriceProps) => {
  const { price, change, isLoading, error, lastUpdated } = useMarketData(symbol);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          price: 'text-lg font-semibold',
          change: 'text-sm font-medium',
          icon: 'h-3 w-3'
        };
      case 'lg':
        return {
          price: 'text-4xl font-bold',
          change: 'text-xl font-bold',
          icon: 'h-6 w-6'
        };
      default:
        return {
          price: 'text-2xl font-bold',
          change: 'text-lg font-semibold',
          icon: 'h-4 w-4'
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const isPositive = change > 0;
  const isNegative = change < 0;

  const getChangeColor = () => {
    if (isPositive) return 'text-green-400';
    if (isNegative) return 'text-red-400';
    return 'text-gray-400';
  };

  const formatPrice = (value: number) => {
    if (value >= 1000) {
      return value.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
    return value.toFixed(2);
  };

  if (error) {
    return (
      <div className={`text-red-400 ${className}`}>
        <span className="text-sm">Error loading {symbol}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-700 rounded w-24 mb-1"></div>
        <div className="h-4 bg-gray-800 rounded w-16"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center space-x-2">
        {showSymbol && (
          <span className="text-gray-400 text-sm font-medium">{symbol}</span>
        )}
        <span className={`text-white ${sizeClasses.price}`}>
          ${formatPrice(price)}
        </span>
        {lastUpdated && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </div>
      
      <div className={`flex items-center space-x-1 ${getChangeColor()} ${sizeClasses.change}`}>
        {isPositive && <TrendingUp className={sizeClasses.icon} />}
        {isNegative && <TrendingDown className={sizeClasses.icon} />}
        {!isPositive && !isNegative && <Minus className={sizeClasses.icon} />}
        <span>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
      
      {lastUpdated && (
        <div className="text-xs text-gray-500">
          Updated {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};
