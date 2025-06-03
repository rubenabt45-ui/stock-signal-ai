
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
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400"
          />
        </div>
        <Button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={!searchTerm.trim()}
        >
          Analyze
        </Button>
      </form>

      {/* Popular Stocks */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-slate-300">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">Popular Stocks</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {popularStocks.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => onStockSelect(stock.symbol)}
              className="p-3 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-left transition-all duration-200 hover:border-emerald-400 group"
            >
              <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                {stock.symbol}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {stock.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
