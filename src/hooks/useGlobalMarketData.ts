
import { useEffect, useCallback, useMemo } from 'react';
import { useMarketDataContext } from '@/contexts/MarketDataContext';

export interface GlobalMarketData {
  symbol: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
}

// Optimized hook with better subscription management
export const useGlobalMarketData = (symbol: string): GlobalMarketData => {
  const { marketData, subscribeToSymbol, unsubscribeFromSymbol } = useMarketDataContext();

  // Memoized subscription management to prevent unnecessary re-subscriptions
  const subscribe = useCallback(() => {
    if (!symbol) return;
    console.log(`🔗 useGlobalMarketData: Optimized subscription to ${symbol}`);
    subscribeToSymbol(symbol);
  }, [symbol, subscribeToSymbol]);

  const unsubscribe = useCallback(() => {
    if (!symbol) return;
    console.log(`🔗 useGlobalMarketData: Optimized unsubscription from ${symbol}`);
    unsubscribeFromSymbol(symbol);
  }, [symbol, unsubscribeFromSymbol]);

  useEffect(() => {
    subscribe();
    return unsubscribe;
  }, [subscribe, unsubscribe]);

  // Memoized data to prevent unnecessary re-renders
  const data = useMemo(() => {
    const rawData = marketData[symbol];
    
    if (!rawData) {
      return {
        symbol,
        price: null,
        change: null,
        changePercent: null,
        open: null,
        high: null,
        low: null,
        volume: null,
        lastUpdated: null,
        isLoading: true,
        error: null,
      };
    }
    
    return {
      symbol,
      price: rawData.price,
      change: rawData.change,
      changePercent: rawData.changePercent,
      open: rawData.open,
      high: rawData.high,
      low: rawData.low,
      volume: rawData.volume,
      lastUpdated: rawData.lastUpdated,
      isLoading: rawData.isLoading,
      error: rawData.error,
    };
  }, [symbol, marketData[symbol]]);

  return data;
};

// Utility functions for consistent formatting across the app
export const formatPrice = (price: number | null): string => {
  if (price === null || price === undefined) return '--';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatChangePercent = (changePercent: number | null): string => {
  if (changePercent === null || changePercent === undefined) return '--';
  
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};

export const formatChange = (change: number | null): string => {
  if (change === null || change === undefined) return '--';
  
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}`;
};

// Batch hook for multiple symbols (more efficient than multiple individual hooks)
export const useGlobalMarketDataBatch = (symbols: string[]): { [symbol: string]: GlobalMarketData } => {
  const { marketData, subscribeToSymbol, unsubscribeFromSymbol } = useMarketDataContext();
  
  useEffect(() => {
    // Subscribe to all symbols
    symbols.forEach(symbol => {
      if (symbol) {
        console.log(`🔗 useGlobalMarketDataBatch: Subscribing to ${symbol}`);
        subscribeToSymbol(symbol);
      }
    });

    return () => {
      // Unsubscribe from all symbols
      symbols.forEach(symbol => {
        if (symbol) {
          console.log(`🔗 useGlobalMarketDataBatch: Unsubscribing from ${symbol}`);
          unsubscribeFromSymbol(symbol);
        }
      });
    };
  }, [symbols.join(','), subscribeToSymbol, unsubscribeFromSymbol]);

  // Memoized batch data
  return useMemo(() => {
    const result: { [symbol: string]: GlobalMarketData } = {};
    
    symbols.forEach(symbol => {
      const rawData = marketData[symbol];
      
      result[symbol] = rawData ? {
        symbol,
        price: rawData.price,
        change: rawData.change,
        changePercent: rawData.changePercent,
        open: rawData.open,
        high: rawData.high,
        low: rawData.low,
        volume: rawData.volume,
        lastUpdated: rawData.lastUpdated,
        isLoading: rawData.isLoading,
        error: rawData.error,
      } : {
        symbol,
        price: null,
        change: null,
        changePercent: null,
        open: null,
        high: null,
        low: null,
        volume: null,
        lastUpdated: null,
        isLoading: true,
        error: null,
      };
    });
    
    return result;
  }, [symbols.join(','), marketData]);
};
