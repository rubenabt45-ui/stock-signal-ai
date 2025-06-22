
import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';

export interface MarketDataState {
  [symbol: string]: {
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
  };
}

type MarketDataAction = 
  | { type: 'SET_LOADING'; symbol: string }
  | { type: 'SET_DATA'; symbol: string; data: any }
  | { type: 'SET_ERROR'; symbol: string; error: string }
  | { type: 'CLEAR_ERROR'; symbol: string };

const initialState: MarketDataState = {};

const marketDataReducer = (state: MarketDataState, action: MarketDataAction): MarketDataState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        [action.symbol]: {
          ...state[action.symbol],
          isLoading: true,
          error: null,
        }
      };
    case 'SET_DATA':
      return {
        ...state,
        [action.symbol]: {
          ...action.data,
          isLoading: false,
          error: null,
          lastUpdated: Date.now(),
        }
      };
    case 'SET_ERROR':
      return {
        ...state,
        [action.symbol]: {
          ...state[action.symbol],
          isLoading: false,
          error: action.error,
        }
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        [action.symbol]: {
          ...state[action.symbol],
          error: null,
        }
      };
    default:
      return state;
  }
};

interface MarketDataContextType {
  marketData: MarketDataState;
  fetchMarketData: (symbol: string) => Promise<void>;
  subscribeToSymbol: (symbol: string) => void;
  unsubscribeFromSymbol: (symbol: string) => void;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

// Ultra-optimized intervals for smooth performance
const UPDATE_INTERVAL = 15000; // 15 seconds as requested
const CACHE_DURATION = 30000; // 30 seconds cache
const THROTTLE_DELAY = 5000; // 5 seconds throttle for rapid calls

export const MarketDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [marketData, dispatch] = useReducer(marketDataReducer, initialState);
  const intervalRef = useRef<NodeJS.Timeout>();
  const subscribedSymbols = useRef<Set<string>>(new Set());
  const lastFetchTimes = useRef<{ [symbol: string]: number }>({});
  const throttleTimers = useRef<{ [symbol: string]: NodeJS.Timeout }>({});

  // Ultra-aggressive throttling to prevent excessive API calls
  const throttledFetch = useCallback((symbol: string, fetchFn: () => Promise<void>) => {
    if (throttleTimers.current[symbol]) {
      clearTimeout(throttleTimers.current[symbol]);
    }

    throttleTimers.current[symbol] = setTimeout(() => {
      fetchFn();
      delete throttleTimers.current[symbol];
    }, THROTTLE_DELAY);
  }, []);

  const fetchMarketDataForSymbol = async (symbol: string): Promise<any> => {
    console.log(`🚀 Ultra-optimized MarketData: Fetching ${symbol}`);
    
    // Use only simulation for maximum performance (no external API calls)
    return generateUltraOptimizedMarketData(symbol);
  };

  const fetchMarketData = useCallback(async (symbol: string, forceRefresh = false) => {
    const now = Date.now();
    const lastFetch = lastFetchTimes.current[symbol] || 0;
    
    // Aggressive caching - skip if recently fetched
    if (!forceRefresh && now - lastFetch < CACHE_DURATION) {
      console.log(`⚡ Ultra-optimized: Using cached data for ${symbol}`);
      return;
    }

    // Use throttling for all non-forced requests
    if (!forceRefresh) {
      throttledFetch(symbol, async () => {
        dispatch({ type: 'SET_LOADING', symbol });
        
        try {
          const data = await fetchMarketDataForSymbol(symbol);
          dispatch({ type: 'SET_DATA', symbol, data });
          lastFetchTimes.current[symbol] = Date.now();
          console.log(`⚡ Ultra-optimized: Cached data for ${symbol}`);
        } catch (error) {
          dispatch({ type: 'SET_ERROR', symbol, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      });
    } else {
      // Immediate fetch for forced requests only
      dispatch({ type: 'SET_LOADING', symbol });
      
      try {
        const data = await fetchMarketDataForSymbol(symbol);
        dispatch({ type: 'SET_DATA', symbol, data });
        lastFetchTimes.current[symbol] = now;
        console.log(`⚡ Ultra-optimized: Force-cached data for ${symbol}`);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', symbol, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }
  }, [throttledFetch]);

  const subscribeToSymbol = useCallback((symbol: string) => {
    const wasEmpty = subscribedSymbols.current.size === 0;
    subscribedSymbols.current.add(symbol);
    console.log(`⚡ Ultra-optimized: Subscribed to ${symbol}. Active:`, Array.from(subscribedSymbols.current));
    
    // Fetch immediately for new subscriptions
    fetchMarketData(symbol, true);
    
    // Start ultra-efficient global interval
    if (wasEmpty && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        const activeSymbols = Array.from(subscribedSymbols.current);
        console.log(`⏰ Ultra-optimized: Batch update - ${activeSymbols.length} symbols (15s interval)`);
        
        // Batch update with aggressive throttling
        activeSymbols.forEach(sym => {
          fetchMarketData(sym, false);
        });
      }, UPDATE_INTERVAL);
      console.log(`⏰ Ultra-optimized: Started 15-second polling for smooth performance`);
    }
  }, [fetchMarketData]);

  const unsubscribeFromSymbol = useCallback((symbol: string) => {
    subscribedSymbols.current.delete(symbol);
    console.log(`⚡ Ultra-optimized: Unsubscribed from ${symbol}. Active:`, Array.from(subscribedSymbols.current));
    
    // Clear throttle timers
    if (throttleTimers.current[symbol]) {
      clearTimeout(throttleTimers.current[symbol]);
      delete throttleTimers.current[symbol];
    }
    
    // Stop polling if no active subscriptions
    if (subscribedSymbols.current.size === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      console.log(`🛑 Ultra-optimized: Stopped polling - no active subscriptions`);
    }
  }, []);

  // Comprehensive cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      Object.values(throttleTimers.current).forEach(timer => {
        clearTimeout(timer);
      });
      throttleTimers.current = {};
      
      console.log('🧹 Ultra-optimized: Complete cleanup');
    };
  }, []);

  return (
    <MarketDataContext.Provider value={{
      marketData,
      fetchMarketData,
      subscribeToSymbol,
      unsubscribeFromSymbol,
    }}>
      {children}
    </MarketDataContext.Provider>
  );
};

export const useMarketDataContext = () => {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketDataContext must be used within a MarketDataProvider');
  }
  return context;
};

// Ultra-optimized data generation with minimal CPU overhead
const generateUltraOptimizedMarketData = (symbol: string) => {
  const basePrices: Record<string, number> = {
    'AAPL': 175.43,
    'MSFT': 384.52,
    'GOOGL': 140.25,
    'TSLA': 248.87,
    'NVDA': 478.12,
    'AMZN': 145.67,
    'META': 325.89,
    'NFLX': 452.34,
    'AMD': 142.18,
    'INTC': 43.25,
  };

  // Minimal calculations for maximum performance
  const basePrice = basePrices[symbol] || (50 + Math.random() * 300);
  const volatility = 0.008; // Fixed low volatility for stability
  
  const variation = (Math.random() - 0.5) * volatility;
  const currentPrice = basePrice * (1 + variation);
  const open = basePrice * (1 + (Math.random() - 0.5) * volatility * 0.5);
  const change = currentPrice - open;
  const changePercent = (change / open) * 100;

  return {
    symbol,
    price: Number(currentPrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    open: Number(open.toFixed(2)),
    high: Number((Math.max(currentPrice, open) * 1.005).toFixed(2)),
    low: Number((Math.min(currentPrice, open) * 0.995).toFixed(2)),
    volume: Math.floor(1000000 + Math.random() * 2000000),
  };
};
