
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit3, Check, Filter, BarChart3, LogIn, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { FavoritesList } from "@/components/FavoritesList";
import { AddSymbolModal } from "@/components/AddSymbolModal";
import { FilterDropdown } from "@/components/FilterDropdown";
import { MarketOverview } from "@/components/MarketOverview";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/providers/AuthProvider";
import { ChartCandlestick } from "lucide-react";
import { CategoryFilter, FavoriteInput } from "@/types/favorites";
import tradeiqLogo from '@/assets/tradeiq-logo.png';

const Favorites = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const { favorites, loading, error, addFavorite, removeFavorite, reorderFavorites, refetch } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get market overview symbols from favorites
  const getMarketOverviewSymbols = () => {
    if (!user || favorites.length === 0) {
      return ['NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:TSLA', 'NASDAQ:NVDA', 'NASDAQ:AMZN'];
    }
    
    // Format favorite symbols for TradingView
    return favorites.slice(0, 8).map(fav => {
      const symbol = fav.symbol.toUpperCase();
      // Add exchange prefix if not present
      if (!symbol.includes(':')) {
        return `NASDAQ:${symbol}`;
      }
      return symbol;
    });
  };

  const filteredFavorites = favorites.filter(fav => 
    categoryFilter === 'all' || fav.category === categoryFilter
  );

  const handleEditToggle = () => {
    if (!user) return;
    setIsEditMode(!isEditMode);
  };

  const handleAddSymbol = async (favoriteInput: FavoriteInput) => {
    const success = await addFavorite(favoriteInput);
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const handleSymbolClick = (symbol: string) => {
    if (!isEditMode && user) {
      navigate(`/?symbol=${symbol}`);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-tradeiq-navy">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={tradeiqLogo} alt="TradeIQ Logo" className="h-10" />
                <p className="text-sm text-gray-400 font-medium">Favorites</p>
              </div>
              <div className="flex items-center space-x-2">
                <Link to="/">
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Chart IA
                  </Button>
                </Link>
                
                {user && (
                  <>
                    <FilterDropdown 
                      selectedCategory={categoryFilter}
                      onCategoryChange={setCategoryFilter}
                    />
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          disabled={loading}
                          className="border-gray-700 hover:bg-gray-800"
                        >
                          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh favorites</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
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
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isEditMode ? 'Finish editing' : 'Edit favorites order'}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => setIsAddModalOpen(true)}
                          className="tradeiq-button-primary"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add symbol to favorites</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
                
                {!user && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => navigate('/login')}
                        className="tradeiq-button-primary"
                        size="sm"
                      >
                        <LogIn className="h-4 w-4 mr-1" />
                        Login
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Login to manage favorites</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 space-y-6">
          <Card className="tradeiq-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">
                  My Watchlist
                  {user && (
                    <Badge variant="secondary" className="ml-2 bg-tradeiq-blue/20 text-tradeiq-blue">
                      {filteredFavorites.length}
                    </Badge>
                  )}
                </CardTitle>
                {categoryFilter !== 'all' && (
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                  </Badge>
                )}
              </div>
              {error && (
                <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                  Error: {error}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center py-12 text-gray-500">
                  <LogIn className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Login Required</p>
                  <p className="text-sm mb-4">
                    Please log in to view and manage your favorites
                  </p>
                  <Button
                    onClick={() => navigate('/login')}
                    className="tradeiq-button-primary"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login to Continue
                  </Button>
                </div>
              ) : filteredFavorites.length === 0 && !loading ? (
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
                  loading={loading}
                  isEditMode={isEditMode}
                  onRemove={removeFavorite}
                  onReorder={reorderFavorites}
                  onSymbolClick={handleSymbolClick}
                />
              )}
            </CardContent>
          </Card>

          {/* Market Overview Section */}
          {user && favorites.length > 0 && (
            <Card className="tradeiq-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-lg flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-tradeiq-blue" />
                  <span>📈 Market Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MarketOverview 
                  symbols={getMarketOverviewSymbols()}
                  height={450}
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}
        </main>

        {/* Add Symbol Modal */}
        {user && (
          <AddSymbolModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddSymbol={handleAddSymbol}
            existingSymbols={favorites.map(f => f.symbol)}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default Favorites;
