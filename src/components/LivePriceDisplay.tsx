
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTradingViewData } from "@/contexts/TradingViewDataContext";
import { memo } from "react";

interface LivePriceDisplayProps {
  symbol: string;
  showSymbol?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const formatPrice = (price: number | null): string => {
  if (price === null) return "0.00";
  if (price >= 1000) {
    return price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }
  return price.toFixed(2);
};

const formatChangePercent = (changePercent: number | null): string => {
  if (changePercent === null) return "0.00%";
  const sign = changePercent >= 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};

const LivePriceDisplayComponent = ({ 
  symbol, 
  showSymbol = true, 
  size = 'lg',
  className = ''
}: LivePriceDisplayProps) => {
  const { getData } = useTradingViewData();
  const { price, changePercent, lastUpdated } = getData(symbol);

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

  // If no price data is available from TradingView, show chart reference instead
  if (price === null) {
    return (
      <div className={`${sizeClasses.container} ${className}`}>
        {showSymbol && (
          <div className="flex items-center space-x-2">
            <span className={sizeClasses.symbol}>{symbol}</span>
          </div>
        )}
        
        <div className="text-center py-2">
          <div className="text-blue-400 font-medium text-sm mb-1">Live Chart Data</div>
          <div className="text-xs text-gray-500">Powered by TradingView</div>
          <div className="text-xs text-gray-600 mt-1">
            See chart above for real-time price
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses.container} ${className}`}>
      {showSymbol && (
        <div className="flex items-center space-x-2">
          <span className={sizeClasses.symbol}>{symbol}</span>
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-xs">
            TradingView Synced
          </Badge>
        </div>
      )}
      
      <div className="flex items-baseline space-x-3">
        <span className={sizeClasses.price}>
          ${formatPrice(price)}
        </span>
        {lastUpdated && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="TradingView synchronized"></div>
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
        <div className={`${sizeClasses.time} text-green-500 flex items-center space-x-1`}>
          <span>TradingView: {new Date(lastUpdated).toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
};

export const LivePriceDisplay = memo(LivePriceDisplayComponent, (prevProps, nextProps) => {
  return (
    prevProps.symbol === nextProps.symbol &&
    prevProps.showSymbol === nextProps.showSymbol &&
    prevProps.size === nextProps.size &&
    prevProps.className === nextProps.className
  );
});
