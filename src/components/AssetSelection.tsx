
import { useState } from "react";
import { Search, TrendingUp, Globe, Coins, BarChart3, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AssetSelectionProps {
  selectedAsset: string;
  onAssetSelect: (asset: string) => void;
}

interface Asset {
  symbol: string;
  name: string;
  price: string;
  change: string;
  category: 'stocks' | 'crypto' | 'forex' | 'indices' | 'commodities' | 'etf';
}

const popularAssets: Asset[] = [
  // Stocks
  { symbol: "AAPL", name: "Apple Inc.", price: "$175.43", change: "+1.2%", category: "stocks" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: "$378.85", change: "+0.8%", category: "stocks" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "$138.21", change: "-0.3%", category: "stocks" },
  { symbol: "TSLA", name: "Tesla Inc.", price: "$248.50", change: "+2.1%", category: "stocks" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: "$875.28", change: "+3.5%", category: "stocks" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: "$145.86", change: "+0.9%", category: "stocks" },
  { symbol: "META", name: "Meta Platforms", price: "$324.75", change: "+1.8%", category: "stocks" },
  
  // Cryptocurrencies
  { symbol: "BTCUSD", name: "Bitcoin", price: "$43,256", change: "+2.4%", category: "crypto" },
  { symbol: "ETHUSD", name: "Ethereum", price: "$2,543", change: "+1.8%", category: "crypto" },
  { symbol: "SOLUSD", name: "Solana", price: "$98.45", change: "+4.2%", category: "crypto" },
  { symbol: "ADAUSD", name: "Cardano", price: "$0.52", change: "-0.8%", category: "crypto" },
  { symbol: "DOTUSD", name: "Polkadot", price: "$7.32", change: "+1.1%", category: "crypto" },
  
  // Forex
  { symbol: "EURUSD", name: "EUR/USD", price: "1.0875", change: "+0.12%", category: "forex" },
  { symbol: "GBPUSD", name: "GBP/USD", price: "1.2645", change: "-0.08%", category: "forex" },
  { symbol: "USDJPY", name: "USD/JPY", price: "149.85", change: "+0.25%", category: "forex" },
  { symbol: "AUDUSD", name: "AUD/USD", price: "0.6542", change: "+0.18%", category: "forex" },
  { symbol: "USDCAD", name: "USD/CAD", price: "1.3725", change: "-0.15%", category: "forex" },
  
  // Indices
  { symbol: "SPX", name: "S&P 500", price: "4,567.80", change: "+0.65%", category: "indices" },
  { symbol: "IXIC", name: "NASDAQ", price: "14,234.50", change: "+0.92%", category: "indices" },
  { symbol: "DJI", name: "Dow Jones", price: "35,875.20", change: "+0.45%", category: "indices" },
  { symbol: "RUT", name: "Russell 2000", price: "1,987.65", change: "+0.38%", category: "indices" },
  { symbol: "VIX", name: "CBOE VIX", price: "16.45", change: "-2.1%", category: "indices" },
  
  // Commodities
  { symbol: "XAUUSD", name: "Gold", price: "$2,035.40", change: "+0.8%", category: "commodities" },
  { symbol: "XAGUSD", name: "Silver", price: "$24.85", change: "+1.2%", category: "commodities" },
  { symbol: "USOIL", name: "Crude Oil WTI", price: "$78.45", change: "-0.6%", category: "commodities" },
  { symbol: "UKOIL", name: "Brent Oil", price: "$82.30", change: "-0.4%", category: "commodities" },
  { symbol: "NATGAS", name: "Natural Gas", price: "$2.875", change: "+2.1%", category: "commodities" },
  
  // ETFs
  { symbol: "SPY", name: "SPDR S&P 500 ETF", price: "$456.78", change: "+0.65%", category: "etf" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", price: "$378.90", change: "+0.92%", category: "etf" },
  { symbol: "IWM", name: "iShares Russell 2000", price: "$198.76", change: "+0.38%", category: "etf" },
  { symbol: "GLD", name: "SPDR Gold Shares", price: "$185.67", change: "+0.8%", category: "etf" },
  { symbol: "TLT", name: "iShares 20+ Year Treasury", price: "$89.45", change: "-0.3%", category: "etf" },
];

const categoryConfig = {
  stocks: { label: "Stocks", icon: TrendingUp, color: "text-blue-400" },
  crypto: { label: "Crypto", icon: Coins, color: "text-orange-400" },
  forex: { label: "Forex", icon: Globe, color: "text-green-400" },
  indices: { label: "Indices", icon: BarChart3, color: "text-purple-400" },
  commodities: { label: "Commodities", icon: Zap, color: "text-yellow-400" },
  etf: { label: "ETFs", icon: TrendingUp, color: "text-cyan-400" },
};

export const AssetSelection = ({ selectedAsset, onAssetSelect }: AssetSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSearch = (symbol: string) => {
    onAssetSelect(symbol.toUpperCase());
    setSearchTerm("");
    setIsSearchFocused(false);
  };

  const filteredAssets = popularAssets.filter(asset => {
    const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Object.keys(categoryConfig)];

  return (
    <Card className="tradeiq-card p-4 rounded-2xl">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search any asset (stocks, crypto, forex, commodities...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyPress={(e) => e.key === 'Enter' && searchTerm && handleSearch(searchTerm)}
            className="pl-12 h-12 bg-black/30 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-tradeiq-blue focus:ring-1 focus:ring-tradeiq-blue rounded-xl"
          />
        </div>

        {/* Category Filter */}
        {(isSearchFocused || searchTerm) && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-tradeiq-blue text-white'
                    : 'bg-black/20 text-gray-400 hover:bg-black/40'
                }`}
              >
                {category === 'all' ? 'All' : categoryConfig[category as keyof typeof categoryConfig].label}
              </button>
            ))}
          </div>
        )}

        {/* Current Selection */}
        <div className="flex items-center justify-between p-3 bg-tradeiq-blue/10 border border-tradeiq-blue/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <div>
              <span className="text-white font-bold text-lg">{selectedAsset}</span>
              <span className="text-gray-400 text-sm ml-2">Selected</span>
            </div>
          </div>
          <TrendingUp className="h-5 w-5 text-tradeiq-blue" />
        </div>

        {/* Search Results or Popular Assets */}
        {(isSearchFocused || searchTerm) && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm font-medium">
                {searchTerm ? `Search Results (${filteredAssets.length})` : 'Popular Assets'}
              </p>
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {categoryConfig[selectedCategory as keyof typeof categoryConfig]?.label}
                </Badge>
              )}
            </div>
            
            {filteredAssets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No assets found for "{searchTerm}"</p>
                <p className="text-sm mt-1">Try searching for stocks, crypto, forex, or commodities</p>
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const categoryInfo = categoryConfig[asset.category];
                const CategoryIcon = categoryInfo.icon;
                
                return (
                  <button
                    key={asset.symbol}
                    onClick={() => handleSearch(asset.symbol)}
                    className="w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 border border-gray-800/50 hover:border-tradeiq-blue/50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <CategoryIcon className={`h-4 w-4 ${categoryInfo.color}`} />
                      <div className="text-left">
                        <div className="font-bold text-white group-hover:text-tradeiq-blue transition-colors">
                          {asset.symbol}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {asset.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold text-sm">{asset.price}</div>
                      <div className={`text-xs font-bold ${
                        asset.change.startsWith('+') ? 'text-tradeiq-success' : 'text-tradeiq-danger'
                      }`}>
                        {asset.change}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
