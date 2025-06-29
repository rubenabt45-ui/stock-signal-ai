import { useState, useMemo } from "react";
import { Search, TrendingUp, Globe, Coins, BarChart3, Zap, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CategoryFilter } from "@/pages/Favorites";

interface AssetSelectionProps {
  selectedAsset: string;
  onAssetSelect: (asset: string) => void;
}

interface Asset {
  symbol: string;
  name: string;
  category: 'stocks' | 'crypto' | 'forex' | 'indices' | 'commodities' | 'etf';
}

// Simplified asset database without price data
const allAssets: Asset[] = [
  // Stocks (S&P 500 major companies)
  { symbol: "AAPL", name: "Apple Inc.", category: "stocks" },
  { symbol: "MSFT", name: "Microsoft Corp.", category: "stocks" },
  { symbol: "GOOGL", name: "Alphabet Inc. Class A", category: "stocks" },
  { symbol: "GOOG", name: "Alphabet Inc. Class C", category: "stocks" },
  { symbol: "TSLA", name: "Tesla Inc.", category: "stocks" },
  { symbol: "NVDA", name: "NVIDIA Corp.", category: "stocks" },
  { symbol: "AMZN", name: "Amazon.com Inc.", category: "stocks" },
  { symbol: "META", name: "Meta Platforms Inc.", category: "stocks" },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc. Class B", category: "stocks" },
  { symbol: "LLY", name: "Eli Lilly and Co", category: "stocks" },
  { symbol: "AVGO", name: "Broadcom Inc.", category: "stocks" },
  { symbol: "WMT", name: "Walmart Inc.", category: "stocks" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", category: "stocks" },
  { symbol: "XOM", name: "Exxon Mobil Corp.", category: "stocks" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", category: "stocks" },
  { symbol: "V", name: "Visa Inc. Class A", category: "stocks" },
  { symbol: "PG", name: "Procter & Gamble Co.", category: "stocks" },
  { symbol: "JNJ", name: "Johnson & Johnson", category: "stocks" },
  { symbol: "MA", name: "Mastercard Inc. Class A", category: "stocks" },
  { symbol: "HD", name: "Home Depot Inc.", category: "stocks" },
  
  // Major Cryptocurrencies
  { symbol: "BTCUSD", name: "Bitcoin", category: "crypto" },
  { symbol: "ETHUSD", name: "Ethereum", category: "crypto" },
  { symbol: "SOLUSD", name: "Solana", category: "crypto" },
  { symbol: "ADAUSD", name: "Cardano", category: "crypto" },
  { symbol: "DOTUSD", name: "Polkadot", category: "crypto" },
  { symbol: "AVAXUSD", name: "Avalanche", category: "crypto" },
  { symbol: "LINKUSD", name: "Chainlink", category: "crypto" },
  { symbol: "MATICUSD", name: "Polygon", category: "crypto" },
  { symbol: "ATOMUSD", name: "Cosmos", category: "crypto" },
  { symbol: "ALGOUSD", name: "Algorand", category: "crypto" },
  
  // Major Forex Pairs
  { symbol: "EURUSD", name: "Euro / US Dollar", category: "forex" },
  { symbol: "GBPUSD", name: "British Pound / US Dollar", category: "forex" },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", category: "forex" },
  { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", category: "forex" },
  { symbol: "USDCAD", name: "US Dollar / Canadian Dollar", category: "forex" },
  { symbol: "USDCHF", name: "US Dollar / Swiss Franc", category: "forex" },
  { symbol: "NZDUSD", name: "New Zealand Dollar / US Dollar", category: "forex" },
  { symbol: "EURGBP", name: "Euro / British Pound", category: "forex" },
  { symbol: "EURJPY", name: "Euro / Japanese Yen", category: "forex" },
  { symbol: "GBPJPY", name: "British Pound / Japanese Yen", category: "forex" },
  
  // Major Indices
  { symbol: "SPX", name: "S&P 500 Index", category: "indices" },
  { symbol: "IXIC", name: "NASDAQ Composite", category: "indices" },
  { symbol: "DJI", name: "Dow Jones Industrial Average", category: "indices" },
  { symbol: "RUT", name: "Russell 2000", category: "indices" },
  { symbol: "VIX", name: "CBOE Volatility Index", category: "indices" },
  { symbol: "NDX", name: "NASDAQ-100", category: "indices" },
  { symbol: "FTSE", name: "FTSE 100", category: "indices" },
  { symbol: "DAX", name: "DAX Performance Index", category: "indices" },
  { symbol: "NKY", name: "Nikkei 225", category: "indices" },
  { symbol: "HSI", name: "Hang Seng Index", category: "indices" },
  
  // Commodities
  { symbol: "XAUUSD", name: "Gold Spot", category: "commodities" },
  { symbol: "XAGUSD", name: "Silver Spot", category: "commodities" },
  { symbol: "USOIL", name: "Crude Oil WTI", category: "commodities" },
  { symbol: "UKOIL", name: "Brent Crude Oil", category: "commodities" },
  { symbol: "NATGAS", name: "Natural Gas", category: "commodities" },
  { symbol: "COPPER", name: "Copper", category: "commodities" },
  { symbol: "PLATINUM", name: "Platinum", category: "commodities" },
  { symbol: "PALLADIUM", name: "Palladium", category: "commodities" },
  
  // Popular ETFs
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", category: "etf" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", category: "etf" },
  { symbol: "IWM", name: "iShares Russell 2000 ETF", category: "etf" },
  { symbol: "GLD", name: "SPDR Gold Shares", category: "etf" },
  { symbol: "TLT", name: "iShares 20+ Year Treasury Bond", category: "etf" },
  { symbol: "EEM", name: "iShares MSCI Emerging Markets", category: "etf" },
  { symbol: "VTI", name: "Vanguard Total Stock Market", category: "etf" },
  { symbol: "XLF", name: "Financial Select Sector SPDR", category: "etf" },
];

const categoryConfig = {
  stocks: { label: "Stocks", icon: TrendingUp, color: "text-blue-400", emoji: "📈" },
  crypto: { label: "Crypto", icon: Coins, color: "text-orange-400", emoji: "💰" },
  forex: { label: "Forex", icon: Globe, color: "text-green-400", emoji: "🌐" },
  indices: { label: "Indices", icon: BarChart3, color: "text-purple-400", emoji: "📊" },
  commodities: { label: "Commodities", icon: Zap, color: "text-yellow-400", emoji: "⚙️" },
  etf: { label: "ETFs", icon: TrendingUp, color: "text-cyan-400", emoji: "📊" },
};

export const AssetSelection = ({ selectedAsset, onAssetSelect }: AssetSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Smart search with fuzzy matching
  const filteredAssets = useMemo(() => {
    if (!searchTerm && selectedCategory === 'all') {
      return allAssets.slice(0, 20); // Show top 20 popular assets
    }

    return allAssets.filter(asset => {
      const matchesSearch = !searchTerm || 
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    }).slice(0, 50); // Limit results for performance
  }, [searchTerm, selectedCategory]);

  const handleAssetSelect = (symbol: string) => {
    onAssetSelect(symbol);
    setSearchTerm("");
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedCategory('all');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Don't close the search popover, keep it open for further selection
  };

  const categories = ['all', ...Object.keys(categoryConfig)];

  return (
    <Card className="tradeiq-card p-4 rounded-2xl">
      <div className="space-y-4">
        {/* Universal Search Input */}
        <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search stocks, crypto, forex, indices..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (!isSearchOpen) setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="pl-12 pr-12 h-12 bg-black/30 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-tradeiq-blue focus:ring-1 focus:ring-tradeiq-blue rounded-xl"
              />
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[600px] p-0 tradeiq-card border-gray-700 bg-tradeiq-navy z-50"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="space-y-4 p-4">
              {/* Category Filters */}
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => {
                  const config = category !== 'all' ? categoryConfig[category as keyof typeof categoryConfig] : null;
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === category
                          ? 'bg-tradeiq-blue text-white shadow-lg'
                          : 'bg-black/20 text-gray-400 hover:bg-black/40 hover:text-white'
                      }`}
                    >
                      {config && <span className="text-base">{config.emoji}</span>}
                      <span>{category === 'all' ? 'All Assets' : config?.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Results */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm font-medium">
                    {searchTerm ? `Search Results (${filteredAssets.length})` : 'Popular Assets'}
                  </p>
                  {selectedCategory !== 'all' && (
                    <Badge variant="secondary" className="text-xs bg-black/40">
                      {categoryConfig[selectedCategory as keyof typeof categoryConfig]?.emoji} {categoryConfig[selectedCategory as keyof typeof categoryConfig]?.label}
                    </Badge>
                  )}
                </div>
                
                <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
                  {filteredAssets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No assets found for "{searchTerm}"</p>
                      <p className="text-xs mt-1">Try searching for stocks, crypto, forex, or indices</p>
                    </div>
                  ) : (
                    filteredAssets.map((asset) => {
                      const categoryInfo = categoryConfig[asset.category];
                      const CategoryIcon = categoryInfo.icon;
                      
                      return (
                        <button
                          key={asset.symbol}
                          onClick={() => handleAssetSelect(asset.symbol)}
                          className={`w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 border border-gray-800/50 hover:border-tradeiq-blue/50 rounded-xl transition-all duration-200 group ${
                            selectedAsset === asset.symbol ? 'ring-2 ring-tradeiq-blue bg-tradeiq-blue/10' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="flex items-center space-x-2">
                              <CategoryIcon className={`h-4 w-4 ${categoryInfo.color}`} />
                              <Badge variant="outline" className={`text-xs border-gray-600/50 ${categoryInfo.color} border-opacity-30`}>
                                {categoryInfo.label}
                              </Badge>
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-bold text-white group-hover:text-tradeiq-blue transition-colors">
                                {asset.symbol}
                              </div>
                              <div className="text-xs text-gray-400 truncate max-w-[300px]">
                                {asset.name}
                              </div>
                            </div>
                          </div>
                          <FavoriteButton
                            symbol={asset.symbol}
                            name={asset.name}
                            category={asset.category as CategoryFilter}
                            variant="ghost"
                            size="sm"
                          />
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2 border-t border-gray-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 border-gray-700 hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Current Selection */}
        <div className="flex items-center justify-between p-4 bg-tradeiq-blue/10 border border-tradeiq-blue/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-pulse"></div>
            <div>
              <span className="text-white font-bold text-lg">{selectedAsset}</span>
              <span className="text-gray-400 text-sm ml-2">Active</span>
            </div>
          </div>
          <TrendingUp className="h-5 w-5 text-tradeiq-blue" />
        </div>
      </div>
    </Card>
  );
};
