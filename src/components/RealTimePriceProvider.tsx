import React, { createContext, useContext, ReactNode } from 'react';
import { useRealTimePrices } from '@/hooks/useRealTimePrices';
import { createContextGuard } from '@/utils/providerGuards';

interface PriceData {
  currentPrice: number;
  change: number;
  timestamp: number;
}

interface RealTimePriceContextType {
  prices: Record<string, PriceData>;
  isConnected: boolean;
  error: string | null;
  subscribe: (symbols: string[]) => void;
  unsubscribe: (symbols: string[]) => void;
  reconnect: () => void;
}

const RealTimePriceContext = createContext<RealTimePriceContextType | undefined>(undefined);

const priceGuard = createContextGuard('RealTimePriceProvider', 'useRealTimePriceContext');

export const useRealTimePriceContext = () => {
  const context = useContext(RealTimePriceContext);
  return priceGuard(context);
};

interface RealTimePriceProviderProps {
  children: ReactNode;
}

export const RealTimePriceProvider: React.FC<RealTimePriceProviderProps> = ({ children }) => {
  const realTimePrices = useRealTimePrices();

  return (
    <RealTimePriceContext.Provider value={realTimePrices}>
      {children}
    </RealTimePriceContext.Provider>
  );
};
