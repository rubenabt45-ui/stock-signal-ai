
import { useState, useEffect } from 'react';

interface RealMarketDataReturn {
  price: number | null;
  changePercent: number | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export const useRealMarketData = (symbol: string): RealMarketDataReturn => {
  const [price, setPrice] = useState<number | null>(null);
  const [changePercent, setChangePercent] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Simulate real-time data with mock values
    const timeout = setTimeout(() => {
      setPrice(Math.random() * 200 + 100);
      setChangePercent((Math.random() - 0.5) * 10);
      setLastUpdated(Date.now());
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [symbol]);

  return { price, changePercent, isLoading, error, lastUpdated };
};
