
import { useState, useEffect, useRef } from 'react';

interface MarketData {
  price: number;
  change: number;
  isLoading: boolean;
  error: string | null;
}

export interface UseMarketDataReturn extends MarketData {
  lastUpdated: number | null;
}

// Mock data generator for demo purposes
// In production, this would be replaced with actual API calls
const generateMockMarketData = (symbol: string): { price: number; change: number } => {
  const basePrice = {
    'AAPL': 175,
    'MSFT': 378,
    'GOOGL': 138,
    'TSLA': 248,
    'NVDA': 875,
    'BTCUSD': 43000,
    'ETHUSD': 2500,
    'EURUSD': 1.08,
    'SPX': 4567,
  }[symbol] || 100;

  // Add some realistic volatility
  const volatility = Math.random() * 0.06 - 0.03; // -3% to +3%
  const price = basePrice * (1 + volatility);
  const change = (Math.random() * 10 - 5); // -5% to +5%

  return {
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2))
  };
};

// Cache to store market data for different symbols
const marketDataCache = new Map<string, { data: MarketData; timestamp: number }>();

export const useMarketData = (symbol: string): UseMarketDataReturn => {
  const [marketData, setMarketData] = useState<MarketData>({
    price: 0,
    change: 0,
    isLoading: true,
    error: null
  });
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMarketData = async (targetSymbol: string) => {
    try {
      setMarketData(prev => ({ ...prev, isLoading: true, error: null }));

      // Check cache first (valid for 30 seconds to reduce API calls)
      const cached = marketDataCache.get(targetSymbol);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < 30000) {
        setMarketData(cached.data);
        setLastUpdated(cached.timestamp);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In production, this would be an actual API call:
      // const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
      // const data = await response.json();
      
      const mockData = generateMockMarketData(targetSymbol);
      
      const newMarketData: MarketData = {
        price: mockData.price,
        change: mockData.change,
        isLoading: false,
        error: null
      };

      // Update cache
      marketDataCache.set(targetSymbol, {
        data: newMarketData,
        timestamp: now
      });

      setMarketData(newMarketData);
      setLastUpdated(now);

      console.log(`Market data updated for ${targetSymbol}:`, {
        price: mockData.price,
        change: mockData.change,
        timestamp: new Date(now).toLocaleTimeString()
      });

    } catch (error) {
      console.error(`Error fetching market data for ${targetSymbol}:`, error);
      setMarketData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch market data'
      }));
    }
  };

  useEffect(() => {
    if (!symbol) return;

    // Initial fetch
    fetchMarketData(symbol);

    // Set up interval for updates every 60 seconds
    intervalRef.current = setInterval(() => {
      fetchMarketData(symbol);
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol]);

  return {
    ...marketData,
    lastUpdated
  };
};

// Hook for fetching multiple symbols at once
export const useMultipleMarketData = (symbols: string[]) => {
  const [marketDataMap, setMarketDataMap] = useState<Record<string, UseMarketDataReturn>>({});

  useEffect(() => {
    const updateData = async () => {
      const newDataMap: Record<string, UseMarketDataReturn> = {};
      
      for (const symbol of symbols) {
        try {
          const cached = marketDataCache.get(symbol);
          const now = Date.now();
          
          if (cached && (now - cached.timestamp) < 30000) {
            newDataMap[symbol] = { ...cached.data, lastUpdated: cached.timestamp };
          } else {
            const mockData = generateMockMarketData(symbol);
            const marketData: MarketData = {
              price: mockData.price,
              change: mockData.change,
              isLoading: false,
              error: null
            };
            
            marketDataCache.set(symbol, { data: marketData, timestamp: now });
            newDataMap[symbol] = { ...marketData, lastUpdated: now };
          }
        } catch (error) {
          newDataMap[symbol] = {
            price: 0,
            change: 0,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch data',
            lastUpdated: null
          };
        }
      }
      
      setMarketDataMap(newDataMap);
    };

    if (symbols.length > 0) {
      updateData();
      const interval = setInterval(updateData, 60000);
      return () => clearInterval(interval);
    }
  }, [symbols.join(',')]);

  return marketDataMap;
};
