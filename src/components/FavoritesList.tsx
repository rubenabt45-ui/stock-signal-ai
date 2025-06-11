
import { useState } from "react";
import { Trash2, GripVertical, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LivePriceBadge } from "@/components/LivePriceBadge";
import { MarketPrice } from "@/components/MarketPrice";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useMultipleMarketData } from "@/hooks/useMarketData";
import { useAuth } from "@/contexts/AuthContext";

interface FavoriteItem {
  symbol: string;
  name: string;
  category: string;
}

interface FavoritesListProps {
  favorites: FavoriteItem[];
  loading?: boolean;
  isEditMode: boolean;
  onRemove: (symbol: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onSymbolClick?: (symbol: string) => void;
}

export const FavoritesList = ({ 
  favorites, 
  loading = false,
  isEditMode, 
  onRemove, 
  onReorder,
  onSymbolClick
}: FavoritesListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { user } = useAuth();
  
  // Get real-time market data for all favorite symbols
  const symbols = favorites.map(fav => fav.symbol);
  const marketDataMap = useMultipleMarketData(symbols);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!user) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!user || draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    onReorder(draggedIndex, dropIndex);
    setDraggedIndex(null);
  };

  const handleRemove = (symbol: string) => {
    if (!user) return;
    onRemove(symbol);
  };

  const handleSymbolClick = (symbol: string) => {
    if (!user) return;
    onSymbolClick?.(symbol);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-black/20 border border-gray-800/50 rounded-xl animate-pulse"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="h-6 bg-gray-700 rounded w-16"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-32"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-5 bg-gray-700 rounded w-20 mb-1"></div>
              <div className="h-4 bg-gray-800 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-gray-500">
        <LogIn className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">Authentication Required</p>
        <p className="text-sm mb-4">Please log in to view your favorites</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {favorites.map((favorite, index) => {
          const marketData = marketDataMap[favorite.symbol];
          
          return (
            <div
              key={favorite.symbol}
              className={`flex items-center justify-between p-4 bg-black/20 hover:bg-black/30 border border-gray-800/50 rounded-xl transition-all duration-200 ${
                isEditMode ? 'cursor-move' : 'cursor-pointer hover:border-tradeiq-blue/50'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              draggable={isEditMode && !!user}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => !isEditMode && handleSymbolClick(favorite.symbol)}
            >
              <div className="flex items-center space-x-3 flex-1">
                {isEditMode && user && (
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
                {/* Market Price */}
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

                {/* Remove button */}
                {isEditMode && (
                  user ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(favorite.symbol);
                      }}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled
                          className="ml-2 opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Login required to edit favorites</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
