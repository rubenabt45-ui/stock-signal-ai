
import { useState } from "react";
import { Plus, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryFilter, FavoriteInput } from "@/types/favorites";

interface AddSymbolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSymbol: (favoriteInput: FavoriteInput) => Promise<void>;
  existingSymbols: string[];
}

const categories = [
  { key: 'stocks' as const, label: 'Stocks', emoji: '📈' },
  { key: 'crypto' as const, label: 'Crypto', emoji: '💰' },
  { key: 'forex' as const, label: 'Forex', emoji: '🌐' },
  { key: 'indices' as const, label: 'Indices', emoji: '📊' },
  { key: 'commodities' as const, label: 'Commodities', emoji: '⚙️' },
  { key: 'etf' as const, label: 'ETFs', emoji: '📊' },
];

export const AddSymbolModal = ({ isOpen, onClose, onAddSymbol, existingSymbols }: AddSymbolModalProps) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('stocks');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setSymbol('');
    setName('');
    setCategory('stocks');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symbol.trim() || !name.trim()) {
      setError('Symbol and name are required');
      return;
    }

    if (existingSymbols.includes(symbol.toUpperCase())) {
      setError('Symbol already exists in your favorites');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onAddSymbol({
        symbol: symbol.toUpperCase(),
        name: name.trim(),
        category,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add symbol');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="tradeiq-card border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Plus className="h-5 w-5 text-tradeiq-blue" />
            <span>Add Symbol to Favorites</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="symbol" className="text-gray-300">
              Symbol *
            </Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g., AAPL, BTCUSD"
              className="bg-gray-800 border-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Apple Inc."
              className="bg-gray-800 border-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">
              Category
            </Label>
            <Select value={category} onValueChange={(value) => setCategory(value as CategoryFilter)}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="tradeiq-card border-gray-700">
                {categories.map((cat) => (
                  <SelectItem key={cat.key} value={cat.key}>
                    <span className="flex items-center space-x-2">
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-600 hover:bg-gray-800"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 tradeiq-button-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Symbol'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
