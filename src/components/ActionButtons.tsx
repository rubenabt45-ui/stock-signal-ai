
import { Button } from "@/components/ui/button";
import { TrendingUp, Bell, Star } from "lucide-react";

interface ActionButtonsProps {
  symbol?: string;
  responseType: 'trading' | 'product' | 'mixed';
  // onOpenChartAI?: (symbol: string) => void; // Removed for V1
  onSetAlert?: (symbol: string) => void;
  onAddToFavorites?: (symbol: string) => void;
}

export const ActionButtons = ({ 
  symbol, 
  responseType, 
  // onOpenChartAI,  // Removed for V1 
  onSetAlert, 
  onAddToFavorites 
}: ActionButtonsProps) => {
  if (!symbol && responseType !== 'product') return null;

  const buttons = [];

  if (symbol && responseType === 'trading') {
    // Chart AI feature removed for V1 launch

    buttons.push(
      <Button
        key="alert"
        variant="outline"
        size="sm"
        onClick={() => onSetAlert?.(symbol)}
        className="flex items-center gap-2 text-xs border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white"
      >
        <Bell className="h-3 w-3" />
        Set Price Alert
      </Button>
    );

    buttons.push(
      <Button
        key="favorites"
        variant="outline"
        size="sm"
        onClick={() => onAddToFavorites?.(symbol)}
        className="flex items-center gap-2 text-xs border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white"
      >
        <Star className="h-3 w-3" />
        Add to Favorites
      </Button>
    );
  }

  if (buttons.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {buttons}
    </div>
  );
};
