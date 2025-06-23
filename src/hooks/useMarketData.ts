
import { useState, useEffect } from 'react';

export interface UseMarketDataReturn {
  price: number;
  change: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export const useMarketData = (symbol: string): UseMarketDataReturn => {
  const [price, setPrice] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Simulate API call with mock data
    const timeout = setTimeout(() => {
      const mockPrice = Math.random() * 200 + 100;
      const mockChange = (Math.random() - 0.5) * 10;
      
      setPrice(mockPrice);
      setChange(mockChange);
      setLastUpdated(Date.now());
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [symbol]);

  return { price, change, isLoading, error, lastUpdated };
};

export const useMultipleMarketData = (symbols: string[]): Record<string, UseMarketDataReturn> => {
  const [data, setData] = useState<Record<string, UseMarketDataReturn>>({});

  useEffect(() => {
    const newData: Record<string, UseMarketDataReturn> = {};
    
    symbols.forEach(symbol => {
      newData[symbol] = {
        price: Math.random() * 200 + 100,
        change: (Math.random() - 0.5) * 10,
        isLoading: false,
        error: null,
        lastUpdated: Date.now()
      };
    });
    
    setData(newData);
  }, [symbols]);

  return data;
};
