
import { useState, useEffect } from 'react';
import { CategoryFilter } from '@/pages/Favorites';

interface FavoriteItem {
  symbol: string;
  name: string;
  category: CategoryFilter;
}

const FAVORITES_STORAGE_KEY = 'tradeiq_favorites';

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

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFavorites(parsed);
          return;
        }
      }
      // If no stored favorites or empty array, use defaults
      setFavorites(defaultFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites(defaultFavorites);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favorites.length > 0) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }, [favorites]);

  const addFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(fav => fav.symbol === item.symbol)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFavorite = (symbol: string) => {
    setFavorites(prev => prev.filter(fav => fav.symbol !== symbol));
  };

  const reorderFavorites = (fromIndex: number, toIndex: number) => {
    setFavorites(prev => {
      const newFavorites = [...prev];
      const [removed] = newFavorites.splice(fromIndex, 1);
      newFavorites.splice(toIndex, 0, removed);
      return newFavorites;
    });
  };

  const isFavorite = (symbol: string) => {
    return favorites.some(fav => fav.symbol === symbol);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    reorderFavorites,
    isFavorite,
  };
};
