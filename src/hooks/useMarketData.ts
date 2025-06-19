
import { useState, useEffect, useCallback } from 'react';

interface MarketData {
  price: number | null;
  change: number | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface UseMarketDataReturn extends MarketData {}

export const useMarketData = (symbol: string): UseMarketDataReturn => {
  const [marketData, setMarketData] = useState<MarketData>({
    price: null,
    change: null,
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  const fetchMarketData = useCallback(async () => {
    if (!symbol) return;

    try {
      console.log(`📊 Fetching market data for ${symbol}`);
      setMarketData(prev => ({ ...prev, isLoading: true, error: null }));

      // Simulate market data fetch with realistic prices and changes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const basePrice = getBasePriceForSymbol(symbol);
      const randomChange = (Math.random() - 0.5) * 10; // -5% to +5%
      const currentPrice = basePrice * (1 + randomChange / 100);

      const data = {
        price: currentPrice,
        change: randomChange,
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
      };

      console.log(`Market data updated for ${symbol}:`, {
        price: data.price.toFixed(2),
        change: data.change.toFixed(2),
        timestamp: new Date(data.lastUpdated).toLocaleTimeString()
      });

      setMarketData(data);
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error);
      setMarketData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch market data',
      }));
    }
  }, [symbol]);

  useEffect(() => {
    fetchMarketData();
    
    // Refresh market data every 60 seconds
    const interval = setInterval(fetchMarketData, 60000);
    
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  return marketData;
};

// Hook for fetching multiple symbols at once
export const useMultipleMarketData = (symbols: string[]): Record<string, UseMarketDataReturn> => {
  const [marketDataMap, setMarketDataMap] = useState<Record<string, UseMarketDataReturn>>({});

  useEffect(() => {
    if (symbols.length === 0) {
      setMarketDataMap({});
      return;
    }

    // Initialize loading state for all symbols
    const initialData: Record<string, UseMarketDataReturn> = {};
    symbols.forEach(symbol => {
      initialData[symbol] = {
        price: null,
        change: null,
        isLoading: true,
        error: null,
        lastUpdated: null,
      };
    });
    setMarketDataMap(initialData);

    // Fetch data for all symbols
    const fetchAllData = async () => {
      const promises = symbols.map(async (symbol) => {
        try {
          await new Promise(resolve => setTimeout(resolve, Math.random() * 500)); // Stagger requests
          
          const basePrice = getBasePriceForSymbol(symbol);
          const randomChange = (Math.random() - 0.5) * 10;
          const currentPrice = basePrice * (1 + randomChange / 100);

          return {
            symbol,
            data: {
              price: currentPrice,
              change: randomChange,
              isLoading: false,
              error: null,
              lastUpdated: Date.now(),
            }
          };
        } catch (error) {
          return {
            symbol,
            data: {
              price: null,
              change: null,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to fetch market data',
              lastUpdated: null,
            }
          };
        }
      });

      const results = await Promise.all(promises);
      
      const newMarketDataMap: Record<string, UseMarketDataReturn> = {};
      results.forEach(({ symbol, data }) => {
        newMarketDataMap[symbol] = data;
      });
      
      setMarketDataMap(newMarketDataMap);
    };

    fetchAllData();

    // Refresh data every 60 seconds
    const interval = setInterval(fetchAllData, 60000);
    
    return () => clearInterval(interval);
  }, [symbols.join(',')]); // Re-run when symbols array changes

  return marketDataMap;
};

// Helper function to get realistic base prices for different symbols
const getBasePriceForSymbol = (symbol: string): number => {
  const priceMap: Record<string, number> = {
    'AAPL': 175,
    'GOOGL': 140,
    'MSFT': 380,
    'TSLA': 240,
    'NVDA': 480,
    'AMZN': 145,
    'META': 320,
    'NFLX': 450,
    'BTCUSD': 42000,
    'ETHUSD': 2500,
    'EURUSD': 1.08,
    'GBPUSD': 1.25,
    'USDJPY': 149,
    'SPX': 4500,
    'QQQ': 380,
    'IWM': 195,
  };
  
  return priceMap[symbol] || 100 + Math.random() * 200;
};
