
import { useEffect } from 'react';
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

export const useGlobalMarketData = (symbol: string): GlobalMarketData => {
  const { marketData, subscribeToSymbol, unsubscribeFromSymbol } = useMarketDataContext();

  useEffect(() => {
    if (!symbol) return;

    console.log(`🔗 useGlobalMarketData: Subscribing to ${symbol}`);
    subscribeToSymbol(symbol);

    return () => {
      console.log(`🔗 useGlobalMarketData: Unsubscribing from ${symbol}`);
      unsubscribeFromSymbol(symbol);
    };
  }, [symbol, subscribeToSymbol, unsubscribeFromSymbol]);

  const data = marketData[symbol] || {
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

  return {
    symbol,
    price: data.price,
    change: data.change,
    changePercent: data.changePercent,
    open: data.open,
    high: data.high,
    low: data.low,
    volume: data.volume,
    lastUpdated: data.lastUpdated,
    isLoading: data.isLoading,
    error: data.error,
  };
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
