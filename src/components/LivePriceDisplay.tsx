
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useSyncedMarketData, formatPrice, formatChangePercent } from "@/hooks/useSyncedMarketData";
import { Badge } from "@/components/ui/badge";

interface LivePriceDisplayProps {
  symbol: string;
  showSymbol?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LivePriceDisplay = ({ 
  symbol, 
  showSymbol = true, 
  size = 'lg',
  className = ''
}: LivePriceDisplayProps) => {
  const { price, changePercent, isLoading, error, lastUpdated } = useSyncedMarketData(symbol);

  // Synced market data log
  if (process.env.NODE_ENV === 'development' && price !== null) {
    console.log(`💰 LivePriceDisplay [${symbol}]: $${formatPrice(price)} (${formatChangePercent(changePercent)}) - Synced: ${new Date(lastUpdated || 0).toLocaleTimeString()}`);
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'space-y-1',
          symbol: 'text-sm font-medium text-gray-400',
          price: 'text-lg font-bold text-white',
          change: 'text-sm font-medium',
          icon: 'h-3 w-3',
          time: 'text-xs'
        };
      case 'md':
        return {
          container: 'space-y-2',
          symbol: 'text-base font-medium text-gray-400',
          price: 'text-2xl font-bold text-white',
          change: 'text-base font-semibold',
          icon: 'h-4 w-4',
          time: 'text-xs'
        };
      default: // lg
        return {
          container: 'space-y-3',
          symbol: 'text-lg font-semibold text-gray-300',
          price: 'text-4xl font-bold text-white',
          change: 'text-xl font-bold',
          icon: 'h-6 w-6',
          time: 'text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const isPositive = changePercent && changePercent > 0;
  const isNegative = changePercent && changePercent < 0;

  const getChangeColor = () => {
    if (isPositive) return 'text-green-400';
    if (isNegative) return 'text-red-400';
    return 'text-gray-400';
  };

  const getBadgeColor = () => {
    if (isPositive) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (isNegative) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (error) {
    return (
      <div className={`${sizeClasses.container} ${className}`}>
        <p className="text-red-400 font-medium">Error loading {symbol}</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (isLoading || price === null) {
    return (
      <div className={`${sizeClasses.container} ${className} animate-pulse`}>
        {showSymbol && <div className="h-6 bg-gray-700/50 rounded w-16"></div>}
        <div className="h-10 bg-gray-700/50 rounded w-32"></div>
        <div className="h-6 bg-gray-700/50 rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses.container} ${className}`}>
      {showSymbol && (
        <div className="flex items-center space-x-2">
          <span className={sizeClasses.symbol}>{symbol}</span>
          <Badge className="bg-tradeiq-blue/20 text-tradeiq-blue border-tradeiq-blue/30 text-xs">
            Synced
          </Badge>
        </div>
      )}
      
      <div className="flex items-baseline space-x-3">
        <span className={sizeClasses.price}>
          ${formatPrice(price)}
        </span>
        {lastUpdated && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </div>
      
      {changePercent !== null && (
        <Badge className={`${getBadgeColor()} border px-3 py-1.5`}>
          <div className="flex items-center space-x-1">
            {isPositive && <TrendingUp className={sizeClasses.icon} />}
            {isNegative && <TrendingDown className={sizeClasses.icon} />}
            {!isPositive && !isNegative && <Minus className={sizeClasses.icon} />}
            <span className={sizeClasses.change}>
              {formatChangePercent(changePercent)}
            </span>
          </div>
        </Badge>
      )}
      
      {lastUpdated && (
        <div className={`${sizeClasses.time} text-gray-500 flex items-center space-x-1`}>
          <span>Synced: {new Date(lastUpdated).toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
};
