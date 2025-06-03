
import { useState } from "react";
import { Trash2, GripVertical, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LivePriceBadge } from "@/components/LivePriceBadge";

interface FavoriteItem {
  symbol: string;
  name: string;
  category: string;
}

interface FavoritesListProps {
  favorites: FavoriteItem[];
  isEditMode: boolean;
  onRemove: (symbol: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onSymbolClick?: (symbol: string) => void;
}

export const FavoritesList = ({ 
  favorites, 
  isEditMode, 
  onRemove, 
  onReorder,
  onSymbolClick
}: FavoritesListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  // Mock price data for demo - in real app this would come from real-time data
  const getMockPriceData = (symbol: string) => {
    const prices: Record<string, { price: number; change: number; changePercent: number }> = {
      'AAPL': { price: 175.43, change: 2.10, changePercent: 1.21 },
      'MSFT': { price: 378.85, change: -1.45, changePercent: -0.38 },
      'GOOGL': { price: 138.21, change: 0.95, changePercent: 0.69 },
      'TSLA': { price: 248.50, change: 8.20, changePercent: 3.42 },
      'NVDA': { price: 875.28, change: -12.45, changePercent: -1.40 },
      'BTCUSD': { price: 43256, change: 1025, changePercent: 2.43 },
      'ETHUSD': { price: 2543, change: -45, changePercent: -1.74 },
      'EURUSD': { price: 1.0875, change: 0.0012, changePercent: 0.11 },
      'SPX': { price: 4567.80, change: 29.45, changePercent: 0.65 },
    };
    return prices[symbol] || { price: 100, change: 0, changePercent: 0 };
  };

  return (
    <div className="space-y-2">
      {favorites.map((favorite, index) => {
        const priceData = getMockPriceData(favorite.symbol);
        const isPositive = priceData.change >= 0;
        
        return (
          <div
            key={favorite.symbol}
            className={`flex items-center justify-between p-4 bg-black/20 hover:bg-black/30 border border-gray-800/50 rounded-xl transition-all duration-200 ${
              isEditMode ? 'cursor-move' : 'cursor-pointer hover:border-tradeiq-blue/50'
            }`}
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onClick={() => !isEditMode && onSymbolClick?.(favorite.symbol)}
          >
            <div className="flex items-center space-x-3 flex-1">
              {isEditMode && (
                <GripVertical className="h-5 w-5 text-gray-500" />
              )}
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-bold text-white text-lg">
                    {favorite.symbol}
                  </span>
                  <LivePriceBadge symbol={favorite.symbol} />
                </div>
                <span className="text-sm text-gray-400 truncate">
                  {favorite.name}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-white font-semibold text-lg">
                  ${priceData.price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </div>
                <div className={`text-sm font-bold flex items-center space-x-1 ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}${priceData.change.toFixed(2)} ({isPositive ? '+' : ''}{priceData.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {isEditMode && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(favorite.symbol);
                  }}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
