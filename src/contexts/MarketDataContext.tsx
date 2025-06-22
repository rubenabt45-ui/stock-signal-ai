
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

// Optimized intervals for better performance
const UPDATE_INTERVAL = 15000; // 15 seconds for better performance
const CACHE_DURATION = 20000; // 20 seconds cache
const THROTTLE_DELAY = 2000; // 2 seconds throttle for rapid calls

export const MarketDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [marketData, dispatch] = useReducer(marketDataReducer, initialState);
  const intervalRef = useRef<NodeJS.Timeout>();
  const subscribedSymbols = useRef<Set<string>>(new Set());
  const lastFetchTimes = useRef<{ [symbol: string]: number }>({});
  const throttleTimers = useRef<{ [symbol: string]: NodeJS.Timeout }>({});

  // Throttled fetch function to prevent excessive API calls
  const throttledFetch = useCallback((symbol: string, fetchFn: () => Promise<void>) => {
    // Clear existing throttle timer
    if (throttleTimers.current[symbol]) {
      clearTimeout(throttleTimers.current[symbol]);
    }

    // Set new throttle timer
    throttleTimers.current[symbol] = setTimeout(() => {
      fetchFn();
      delete throttleTimers.current[symbol];
    }, THROTTLE_DELAY);
  }, []);

  const fetchMarketDataForSymbol = async (symbol: string): Promise<any> => {
    console.log(`🔄 Optimized MarketData: Fetching ${symbol}`);
    
    try {
      // Enhanced TradingView-aligned simulation for better performance
      console.log(`🎲 Optimized MarketData: Using high-performance simulation for ${symbol}`);
      return generateOptimizedMarketData(symbol);

    } catch (error) {
      console.error(`❌ Error in optimized fetch for ${symbol}:`, error);
      return generateOptimizedMarketData(symbol);
    }
  };

  const fetchMarketData = useCallback(async (symbol: string, forceRefresh = false) => {
    const now = Date.now();
    const lastFetch = lastFetchTimes.current[symbol] || 0;
    
    // Skip if recently fetched and not forced
    if (!forceRefresh && now - lastFetch < CACHE_DURATION) {
      console.log(`📋 Optimized MarketData: Using cached data for ${symbol}`);
      return;
    }

    // Use throttling for non-forced requests
    if (!forceRefresh) {
      throttledFetch(symbol, async () => {
        dispatch({ type: 'SET_LOADING', symbol });
        
        try {
          const data = await fetchMarketDataForSymbol(symbol);
          dispatch({ type: 'SET_DATA', symbol, data });
          lastFetchTimes.current[symbol] = Date.now();
          console.log(`💾 Optimized MarketData: Cached data for ${symbol}`);
        } catch (error) {
          dispatch({ type: 'SET_ERROR', symbol, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      });
    } else {
      // Immediate fetch for forced requests
      dispatch({ type: 'SET_LOADING', symbol });
      
      try {
        const data = await fetchMarketDataForSymbol(symbol);
        dispatch({ type: 'SET_DATA', symbol, data });
        lastFetchTimes.current[symbol] = now;
        console.log(`💾 Optimized MarketData: Force-cached data for ${symbol}`);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', symbol, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }
  }, [throttledFetch]);

  const subscribeToSymbol = useCallback((symbol: string) => {
    const wasEmpty = subscribedSymbols.current.size === 0;
    subscribedSymbols.current.add(symbol);
    console.log(`📡 Optimized MarketData: Subscribed to ${symbol}. Active:`, Array.from(subscribedSymbols.current));
    
    // Fetch immediately with force refresh for new subscriptions
    fetchMarketData(symbol, true);
    
    // Start global interval if not already running
    if (wasEmpty && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        const activeSymbols = Array.from(subscribedSymbols.current);
        console.log(`⏰ Optimized MarketData: Batch update - ${activeSymbols.length} symbols`);
        
        // Batch update all symbols
        activeSymbols.forEach(sym => {
          fetchMarketData(sym, false); // Use throttling for interval updates
        });
      }, UPDATE_INTERVAL);
      console.log(`⏰ Optimized MarketData: Started efficient polling (${UPDATE_INTERVAL}ms interval)`);
    }
  }, [fetchMarketData]);

  const unsubscribeFromSymbol = useCallback((symbol: string) => {
    subscribedSymbols.current.delete(symbol);
    console.log(`📡 Optimized MarketData: Unsubscribed from ${symbol}. Active:`, Array.from(subscribedSymbols.current));
    
    // Clear any pending throttle timers for this symbol
    if (throttleTimers.current[symbol]) {
      clearTimeout(throttleTimers.current[symbol]);
      delete throttleTimers.current[symbol];
    }
    
    // Stop global interval if no active subscriptions
    if (subscribedSymbols.current.size === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      console.log(`🛑 Optimized MarketData: Stopped polling - no active subscriptions`);
    }
  }, []);

  // Comprehensive cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear main interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Clear all throttle timers
      Object.values(throttleTimers.current).forEach(timer => {
        clearTimeout(timer);
      });
      throttleTimers.current = {};
      
      console.log('🧹 Optimized MarketData: Comprehensive cleanup completed');
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

// Optimized data generation with reduced CPU overhead
const generateOptimizedMarketData = (symbol: string) => {
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

  // Simplified calculation for better performance
  const basePrice = basePrices[symbol] || (50 + Math.random() * 300);
  const volatility = 0.01 + Math.random() * 0.02; // 1-3% daily range
  
  const openVariation = (Math.random() - 0.5) * volatility;
  const open = basePrice * (1 + openVariation);
  
  const range = basePrice * volatility;
  const high = Math.max(open, basePrice + range * Math.random());
  const low = Math.min(open, basePrice - range * Math.random());
  
  const currentPrice = low + Math.random() * (high - low);
  const change = currentPrice - open;
  const changePercent = (change / open) * 100;

  return {
    symbol,
    price: Number(currentPrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    volume: Math.floor(1000000 + Math.random() * 5000000),
  };
};
