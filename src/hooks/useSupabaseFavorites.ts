import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useToast } from '@/hooks/use-toast';

interface Favorite {
  id: string;
  symbol: string;
  name: string;
  category: string;
  position?: number;
  created_at?: string;
}

interface FavoriteInput {
  symbol: string;
  name: string;
  category: string;
}

export const useSupabaseFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load favorites on mount and when user changes
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error loading favorites:', error);
        toast({
          title: "Error loading favorites",
          description: "Unable to load your favorites. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async ({ symbol, name, category }: FavoriteInput) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add favorites.",
        variant: "destructive",
      });
      return;
    }

    // Check if already favorited
    const existing = favorites.find(fav => fav.symbol === symbol);
    if (existing) {
      toast({
        title: "Already in favorites",
        description: `${symbol} is already in your favorites.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const position = favorites.length;
      
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          symbol,
          name,
          category,
          position
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding favorite:', error);
        toast({
          title: "Error adding favorite",
          description: "Unable to add favorite. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setFavorites(prev => [...prev, data]);
      toast({
        title: "Added to favorites",
        description: `${symbol} has been added to your favorites.`,
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: "Error adding favorite",
        description: "Unable to add favorite. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFavorite = async (symbol: string) => {
    if (!user) return;

    const favoriteToRemove = favorites.find(fav => fav.symbol === symbol);
    if (!favoriteToRemove) return;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteToRemove.id);

      if (error) {
        console.error('Error removing favorite:', error);
        toast({
          title: "Error removing favorite",
          description: "Unable to remove favorite. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setFavorites(prev => prev.filter(fav => fav.symbol !== symbol));
      toast({
        title: "Removed from favorites",
        description: `${symbol} has been removed from your favorites.`,
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error removing favorite",
        description: "Unable to remove favorite. Please try again.",
        variant: "destructive",
      });
    }
  };

  const reorderFavorites = async (fromIndex: number, toIndex: number) => {
    if (!user || fromIndex === toIndex) return;

    // Optimistically update the local state
    const newFavorites = [...favorites];
    const [movedItem] = newFavorites.splice(fromIndex, 1);
    newFavorites.splice(toIndex, 0, movedItem);
    
    // Update positions
    const updatedFavorites = newFavorites.map((fav, index) => ({
      ...fav,
      position: index
    }));
    
    setFavorites(updatedFavorites);

    try {
      // Update positions in database
      const updates = updatedFavorites.map((fav, index) => ({
        id: fav.id,
        position: index
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('user_favorites')
          .update({ position: update.position })
          .eq('id', update.id);

        if (error) {
          console.error('Error updating favorite position:', error);
          // Revert on error
          loadFavorites();
          toast({
            title: "Error reordering favorites",
            description: "Unable to save new order. Reverted changes.",
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Favorites reordered",
        description: "Your favorites have been reordered successfully.",
      });
    } catch (error) {
      console.error('Error reordering favorites:', error);
      // Revert on error
      loadFavorites();
      toast({
        title: "Error reordering favorites",
        description: "Unable to save new order. Reverted changes.",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (symbol: string) => {
    return favorites.find(fav => fav.symbol === symbol);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    reorderFavorites,
    isFavorite,
    refreshFavorites: loadFavorites
  };
};
