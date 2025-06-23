
import { useState, useEffect, useCallback } from 'react';

interface PriceData {
  currentPrice: number;
  change: number;
  timestamp: number;
}

interface UseRealTimePricesReturn {
  prices: Record<string, PriceData>;
  isConnected: boolean;
  error: string | null;
  subscribe: (symbols: string[]) => void;
  unsubscribe: (symbols: string[]) => void;
  reconnect: () => void;
}

export const useRealTimePrices = (): UseRealTimePricesReturn => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback((symbols: string[]) => {
    // Mock subscription
    symbols.forEach(symbol => {
      setPrices(prev => ({
        ...prev,
        [symbol]: {
          currentPrice: Math.random() * 200 + 100,
          change: (Math.random() - 0.5) * 10,
          timestamp: Date.now()
        }
      }));
    });
    setIsConnected(true);
  }, []);

  const unsubscribe = useCallback((symbols: string[]) => {
    setPrices(prev => {
      const newPrices = { ...prev };
      symbols.forEach(symbol => {
        delete newPrices[symbol];
      });
      return newPrices;
    });
  }, []);

  const reconnect = useCallback(() => {
    setIsConnected(true);
    setError(null);
  }, []);

  useEffect(() => {
    setIsConnected(true);
    return () => setIsConnected(false);
  }, []);

  return { prices, isConnected, error, subscribe, unsubscribe, reconnect };
};
