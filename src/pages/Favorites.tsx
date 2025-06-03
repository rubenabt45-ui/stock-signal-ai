
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit3, Check, X, Filter, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FavoritesList } from "@/components/FavoritesList";
import { AddSymbolModal } from "@/components/AddSymbolModal";
import { FilterDropdown } from "@/components/FilterDropdown";
import { useFavorites } from "@/hooks/useFavorites";
import { ChartCandlestick } from "lucide-react";

export type CategoryFilter = 'all' | 'stocks' | 'crypto' | 'forex' | 'indices' | 'commodities' | 'etf';

const Favorites = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const { favorites, addFavorite, removeFavorite, reorderFavorites } = useFavorites();
  const navigate = useNavigate();

  const filteredFavorites = favorites.filter(fav => 
    categoryFilter === 'all' || fav.category === categoryFilter
  );

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleAddSymbol = (symbol: string, name: string, category: CategoryFilter) => {
    addFavorite({ symbol, name, category });
    setIsAddModalOpen(false);
  };

  const handleSymbolClick = (symbol: string) => {
    if (!isEditMode) {
      // Navigate to Chart IA with the selected symbol
      navigate(`/?symbol=${symbol}`);
    }
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChartCandlestick className="h-8 w-8 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">TradeIQ</h1>
                <p className="text-sm text-gray-400 font-medium">Favorites</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Chart IA
                </Button>
              </Link>
              <FilterDropdown 
                selectedCategory={categoryFilter}
                onCategoryChange={setCategoryFilter}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditToggle}
                className="border-gray-700 hover:bg-gray-800"
              >
                {isEditMode ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Done
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </>
                )}
              </Button>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="tradeiq-button-primary"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Card className="tradeiq-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">
                My Watchlist
                <Badge variant="secondary" className="ml-2 bg-tradeiq-blue/20 text-tradeiq-blue">
                  {filteredFavorites.length}
                </Badge>
              </CardTitle>
              {categoryFilter !== 'all' && (
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredFavorites.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ChartCandlestick className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No favorites yet</p>
                <p className="text-sm mb-4">
                  {categoryFilter === 'all' 
                    ? "Add your first symbol to start tracking" 
                    : `No ${categoryFilter} symbols in your watchlist`
                  }
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="tradeiq-button-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Symbol
                </Button>
              </div>
            ) : (
              <FavoritesList
                favorites={filteredFavorites}
                isEditMode={isEditMode}
                onRemove={removeFavorite}
                onReorder={reorderFavorites}
                onSymbolClick={handleSymbolClick}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Symbol Modal */}
      <AddSymbolModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSymbol={handleAddSymbol}
        existingSymbols={favorites.map(f => f.symbol)}
      />
    </div>
  );
};

export default Favorites;
