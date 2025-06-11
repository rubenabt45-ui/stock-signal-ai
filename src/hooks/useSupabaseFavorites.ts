
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryFilter } from '@/pages/Favorites';
import { useToast } from '@/hooks/use-toast';

interface FavoriteItem {
  symbol: string;
  name: string;
  category: CategoryFilter;
}

interface SupabaseFavoriteItem {
  id: string;
  symbol: string;
  name: string;
  category: string;
  display_order: number;
}

// Default favorites for new users
const defaultFavorites: FavoriteItem[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'stocks' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'stocks' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'stocks' },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'stocks' },
  { symbol: 'BTCUSD', name: 'Bitcoin', category: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum', category: 'crypto' },
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'forex' },
  { symbol: 'SPX', name: 'S&P 500 Index', category: 'indices' },
];

export const useSupabaseFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load favorites from Supabase
  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading favorites for user:', user.id);
      
      const { data, error: fetchError } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order', { ascending: true });

      if (fetchError) {
        console.error('❌ Error fetching favorites:', fetchError);
        throw fetchError;
      }

      console.log('✅ Favorites loaded:', data);

      if (data && data.length > 0) {
        const favoritesData = data.map(item => ({
          symbol: item.symbol,
          name: item.name,
          category: item.category as CategoryFilter,
        }));
        setFavorites(favoritesData);
      } else {
        // Initialize with default favorites for new users
        console.log('📝 No favorites found, initializing with defaults');
        await initializeWithDefaults();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load favorites';
      console.error('❌ Error loading favorites:', errorMessage);
      setError(errorMessage);
      toast({
        title: "Error Loading Favorites",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize with default favorites
  const initializeWithDefaults = async () => {
    if (!user) return;

    try {
      const favoritesToInsert = defaultFavorites.map((fav, index) => ({
        user_id: user.id,
        symbol: fav.symbol,
        name: fav.name,
        category: fav.category,
        display_order: index,
      }));

      const { error: insertError } = await supabase
        .from('user_favorites')
        .insert(favoritesToInsert);

      if (insertError) {
        throw insertError;
      }

      setFavorites(defaultFavorites);
      console.log('✅ Default favorites initialized');
    } catch (err) {
      console.error('❌ Error initializing defaults:', err);
    }
  };

  // Add favorite
  const addFavorite = async (item: FavoriteItem) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add favorites",
        variant: "destructive",
      });
      return false;
    }

    // Check if already exists
    if (favorites.some(fav => fav.symbol === item.symbol)) {
      toast({
        title: "Already Added",
        description: `${item.symbol} is already in your favorites`,
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('➕ Adding favorite:', item);
      
      const { error: insertError } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          symbol: item.symbol,
          name: item.name,
          category: item.category,
          display_order: favorites.length,
        });

      if (insertError) {
        throw insertError;
      }

      setFavorites(prev => [...prev, item]);
      toast({
        title: "Added to Favorites",
        description: `${item.symbol} has been added to your watchlist`,
      });
      
      console.log('✅ Favorite added successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add favorite';
      console.error('❌ Error adding favorite:', errorMessage);
      toast({
        title: "Error Adding Favorite",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // Remove favorite
  const removeFavorite = async (symbol: string) => {
    if (!user) return false;

    try {
      console.log('➖ Removing favorite:', symbol);
      
      const { error: deleteError } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('symbol', symbol);

      if (deleteError) {
        throw deleteError;
      }

      setFavorites(prev => prev.filter(fav => fav.symbol !== symbol));
      toast({
        title: "Removed from Favorites",
        description: `${symbol} has been removed from your watchlist`,
      });
      
      console.log('✅ Favorite removed successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove favorite';
      console.error('❌ Error removing favorite:', errorMessage);
      toast({
        title: "Error Removing Favorite",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // Reorder favorites
  const reorderFavorites = async (fromIndex: number, toIndex: number) => {
    if (!user) return false;

    try {
      console.log('🔄 Reordering favorites:', { fromIndex, toIndex });
      
      const newFavorites = [...favorites];
      const [removed] = newFavorites.splice(fromIndex, 1);
      newFavorites.splice(toIndex, 0, removed);

      // Update display_order for all favorites
      const updates = newFavorites.map((fav, index) => ({
        user_id: user.id,
        symbol: fav.symbol,
        display_order: index,
      }));

      // Use upsert to update display orders
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('user_favorites')
          .update({ display_order: update.display_order })
          .eq('user_id', user.id)
          .eq('symbol', update.symbol);

        if (updateError) {
          throw updateError;
        }
      }

      setFavorites(newFavorites);
      console.log('✅ Favorites reordered successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder favorites';
      console.error('❌ Error reordering favorites:', errorMessage);
      toast({
        title: "Error Reordering",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // Check if symbol is favorite
  const isFavorite = (symbol: string) => {
    return favorites.some(fav => fav.symbol === symbol);
  };

  // Load favorites when user changes
  useEffect(() => {
    loadFavorites();
  }, [user]);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    reorderFavorites,
    isFavorite,
    refetch: loadFavorites,
  };
};
