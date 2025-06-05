
import { useState } from "react";
import { Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LivePriceBadge } from "@/components/LivePriceBadge";
import { MarketPrice } from "@/components/MarketPrice";
import { useMultipleMarketData } from "@/hooks/useMarketData";

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
  
  // Get real-time market data for all favorite symbols
  const symbols = favorites.map(fav => fav.symbol);
  const marketDataMap = useMultipleMarketData(symbols);

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

  return (
    <div className="space-y-2">
      {favorites.map((favorite, index) => {
        const marketData = marketDataMap[favorite.symbol];
        
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
              {/* Use the new MarketPrice component */}
              <div className="text-right">
                {marketData && !marketData.error ? (
                  <MarketPrice 
                    symbol={favorite.symbol} 
                    size="sm"
                    className="text-right"
                  />
                ) : (
                  <div className="animate-pulse">
                    <div className="h-5 bg-gray-700 rounded w-20 mb-1"></div>
                    <div className="h-4 bg-gray-800 rounded w-16"></div>
                  </div>
                )}
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
