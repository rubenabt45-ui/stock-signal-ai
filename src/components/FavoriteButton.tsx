import { useState } from 'react';
import { Heart, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/auth/auth.provider';
import { CategoryFilter } from '@/pages/Favorites';

interface FavoriteButtonProps {
  symbol: string;
  name: string;
  category: CategoryFilter;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'lg';
  showText?: boolean;
  className?: string;
}

export const FavoriteButton = ({
  symbol,
  name,
  category,
  variant = 'ghost',
  size = 'sm',
  showText = false,
  className = '',
}: FavoriteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { user } = useAuth();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      return;
    }

    setIsLoading(true);

    try {
      const favorite = isFavorite(symbol);
      
      if (favorite) {
        await removeFavorite(symbol);
      } else {
        await addFavorite({ symbol, name, category });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const favorite = isFavorite(symbol);

  if (!user) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              disabled
              className={`${className} opacity-50`}
            >
              <LogIn className="h-4 w-4" />
              {showText && <span className="ml-2">Login to Favorite</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Login required to add favorites</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`${className} transition-colors duration-200 ${
              favorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart 
              className={`h-4 w-4 ${favorite ? 'fill-current' : ''} ${isLoading ? 'animate-pulse' : ''}`} 
            />
            {showText && (
              <span className="ml-2">
                {isLoading ? 'Loading...' : favorite ? 'Remove Favorite' : 'Add Favorite'}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{favorite ? `Remove ${symbol} from favorites` : `Add ${symbol} to favorites`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
