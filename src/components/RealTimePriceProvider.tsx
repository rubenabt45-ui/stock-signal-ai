
import React, { createContext, useContext, ReactNode } from 'react';
import { useRealTimePrices } from '@/hooks/useRealTimePrices';

interface PriceData {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

interface RealTimePriceContextType {
  prices: Record<string, PriceData>;
  isConnected: boolean;
  subscribe: (symbols: string[]) => void;
  unsubscribe: () => void;
  error: string | null;
}

const RealTimePriceContext = createContext<RealTimePriceContextType | undefined>(undefined);

export const useRealTimePriceContext = () => {
  const context = useContext(RealTimePriceContext);
  if (context === undefined) {
    throw new Error('useRealTimePriceContext must be used within a RealTimePriceProvider');
  }
  return context;
};

interface RealTimePriceProviderProps {
  children: ReactNode;
}

export const RealTimePriceProvider = ({ children }: RealTimePriceProviderProps) => {
  const realTimePrices = useRealTimePrices();

  return (
    <RealTimePriceContext.Provider value={realTimePrices}>
      {children}
    </RealTimePriceContext.Provider>
  );
};
