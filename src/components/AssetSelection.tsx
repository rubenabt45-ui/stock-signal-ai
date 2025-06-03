
import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface AssetSelectionProps {
  selectedAsset: string;
  onAssetSelect: (asset: string) => void;
}

const popularAssets = [
  { symbol: "AAPL", name: "Apple Inc.", price: "$175.43", change: "+1.2%" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: "$378.85", change: "+0.8%" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "$138.21", change: "-0.3%" },
  { symbol: "TSLA", name: "Tesla Inc.", price: "$248.50", change: "+2.1%" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: "$875.28", change: "+3.5%" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: "$145.86", change: "+0.9%" },
];

export const AssetSelection = ({ selectedAsset, onAssetSelect }: AssetSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (symbol: string) => {
    onAssetSelect(symbol.toUpperCase());
    setSearchTerm("");
    setIsSearchFocused(false);
  };

  const filteredAssets = popularAssets.filter(asset =>
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="tradeiq-card p-4 rounded-2xl">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search stocks (e.g., AAPL, Tesla)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyPress={(e) => e.key === 'Enter' && searchTerm && handleSearch(searchTerm)}
            className="pl-12 h-12 bg-black/30 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-tradeiq-blue focus:ring-1 focus:ring-tradeiq-blue rounded-xl"
          />
        </div>

        {/* Current Selection */}
        <div className="flex items-center justify-between p-3 bg-tradeiq-blue/10 border border-tradeiq-blue/30 rounded-xl">
          <div>
            <span className="text-white font-bold text-lg">{selectedAsset}</span>
            <span className="text-gray-400 text-sm ml-2">Selected</span>
          </div>
          <TrendingUp className="h-5 w-5 text-tradeiq-blue" />
        </div>

        {/* Search Results or Popular Assets */}
        {(isSearchFocused || searchTerm) && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <p className="text-gray-400 text-sm font-medium">
              {searchTerm ? 'Search Results' : 'Popular Assets'}
            </p>
            {filteredAssets.map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => handleSearch(asset.symbol)}
                className="w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 border border-gray-800/50 hover:border-tradeiq-blue/50 rounded-xl transition-all duration-200 group"
              >
                <div className="text-left">
                  <div className="font-bold text-white group-hover:text-tradeiq-blue transition-colors">
                    {asset.symbol}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {asset.name}
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
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
