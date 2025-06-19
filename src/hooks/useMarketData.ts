
import { useState, useEffect, useCallback } from 'react';

interface MarketData {
  price: number | null;
  change: number | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export const useMarketData = (symbol: string): MarketData => {
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
