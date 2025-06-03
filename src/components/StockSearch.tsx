
import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StockSearchProps {
  onStockSelect: (symbol: string) => void;
}

// Popular stocks for quick selection
const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NFLX", name: "Netflix Inc." },
];

export const StockSearch = ({ onStockSelect }: StockSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onStockSelect(searchTerm.toUpperCase().trim());
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex space-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-black/30 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-tradeiq-blue focus:ring-1 focus:ring-tradeiq-blue rounded-xl"
          />
        </div>
        <Button 
          type="submit" 
          className="tradeiq-button-primary h-12 px-6 rounded-xl font-semibold transition-all duration-200"
          disabled={!searchTerm.trim()}
        >
          Analyze
        </Button>
      </form>

      {/* Popular Stocks */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-300">
          <TrendingUp className="h-4 w-4 text-tradeiq-blue" />
          <span className="text-sm font-semibold">Popular Stocks</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {popularStocks.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => onStockSelect(stock.symbol)}
              className="p-4 bg-black/20 hover:bg-black/40 border border-gray-800/50 hover:border-tradeiq-blue/50 rounded-xl text-left transition-all duration-200 group"
            >
              <div className="font-bold text-white group-hover:text-tradeiq-blue transition-colors text-lg">
                {stock.symbol}
              </div>
              <div className="text-xs text-gray-400 truncate mt-1">
                {stock.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
