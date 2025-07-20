
import { useState, useMemo } from "react";
import { Search, X, Plus } from "lucide-react";
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryFilter } from "@/pages/Favorites";

// Expanded asset database (reusing from AssetSelection)
const allAssets = [
  // Stocks
  { symbol: "AAPL", name: "Apple Inc.", category: "stocks" as const },
  { symbol: "MSFT", name: "Microsoft Corp.", category: "stocks" as const },
  { symbol: "GOOGL", name: "Alphabet Inc. Class A", category: "stocks" as const },
  { symbol: "TSLA", name: "Tesla Inc.", category: "stocks" as const },
  { symbol: "NVDA", name: "NVIDIA Corp.", category: "stocks" as const },
  { symbol: "AMZN", name: "Amazon.com Inc.", category: "stocks" as const },
  { symbol: "META", name: "Meta Platforms Inc.", category: "stocks" as const },
  
  // Crypto
  { symbol: "BTCUSD", name: "Bitcoin", category: "crypto" as const },
  { symbol: "ETHUSD", name: "Ethereum", category: "crypto" as const },
  { symbol: "SOLUSD", name: "Solana", category: "crypto" as const },
  { symbol: "ADAUSD", name: "Cardano", category: "crypto" as const },
  
  // Forex
  { symbol: "EURUSD", name: "Euro / US Dollar", category: "forex" as const },
  { symbol: "GBPUSD", name: "British Pound / US Dollar", category: "forex" as const },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", category: "forex" as const },
  
  // Indices
  { symbol: "SPX", name: "S&P 500 Index", category: "indices" as const },
  { symbol: "IXIC", name: "NASDAQ Composite", category: "indices" as const },
  { symbol: "DJI", name: "Dow Jones Industrial Average", category: "indices" as const },
  
  // Commodities
  { symbol: "XAUUSD", name: "Gold Spot", category: "commodities" as const },
  { symbol: "USOIL", name: "Crude Oil WTI", category: "commodities" as const },
  
  // ETFs
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", category: "etf" as const },
  { symbol: "QQQ", name: "Invesco QQQ Trust", category: "etf" as const },
];

interface AddSymbolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSymbol: (symbol: string, name: string, category: CategoryFilter) => void;
  existingSymbols: string[];
}

export const AddSymbolModal = ({ 
  isOpen, 
  onClose, 
  onAddSymbol, 
  existingSymbols 
}: AddSymbolModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const filteredAssets = useMemo(() => {
    if (!searchTerm) {
      return allAssets.slice(0, 20); // Show top 20 popular assets
    }

    return allAssets.filter(asset => 
      (asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
       asset.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !existingSymbols.includes(asset.symbol)
    ).slice(0, 50);
  }, [searchTerm, existingSymbols]);

  const handleAddSymbol = (asset: typeof allAssets[0]) => {
    onAddSymbol(asset.symbol, asset.name, asset.category);
    setSearchTerm("");
    // Don't close modal immediately - let user add multiple symbols
  };

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  const categoryColors = {
    stocks: "text-blue-400",
    crypto: "text-orange-400", 
    forex: "text-green-400",
    indices: "text-purple-400",
    commodities: "text-yellow-400",
    etf: "text-cyan-400",
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="tradeiq-card max-w-2xl max-h-[80vh] flex flex-col bg-tradeiq-navy border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center">
            <Plus className="h-5 w-5 mr-2 text-tradeiq-blue" />
            Add Symbol to Watchlist
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={t('placeholders.searchStocks')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-black/30 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-tradeiq-blue focus:ring-1 focus:ring-tradeiq-blue"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredAssets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{searchTerm}"</p>
                <p className="text-xs mt-1">Try searching for stocks, crypto, or forex</p>
              </div>
            ) : (
              filteredAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 border border-gray-800/50 hover:border-tradeiq-blue/50 rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs border-gray-600/50 ${categoryColors[asset.category]} border-opacity-30`}
                    >
                      {asset.category}
                    </Badge>
                    <div>
                      <div className="font-bold text-white">{asset.symbol}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[300px]">
                        {asset.name}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddSymbol(asset)}
                    disabled={existingSymbols.includes(asset.symbol)}
                    className="tradeiq-button-primary h-8 px-3"
                  >
                    {existingSymbols.includes(asset.symbol) ? 'Added' : 'Add'}
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-800">
            <Button
              variant="outline"
              onClick={handleClose}
              className="text-gray-400 border-gray-700 hover:bg-gray-800"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
