
import React, { createContext, useContext, useState, useCallback } from 'react';

interface TradingViewData {
  price: number | null;
  changePercent: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
  lastUpdated: number | null;
}

interface TradingViewDataContextType {
  data: Record<string, TradingViewData>;
  updateData: (symbol: string, data: TradingViewData) => void;
  getData: (symbol: string) => TradingViewData;
}

const TradingViewDataContext = createContext<TradingViewDataContextType | undefined>(undefined);

export const TradingViewDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Record<string, TradingViewData>>({});

  const updateData = useCallback((symbol: string, newData: TradingViewData) => {
    console.log(`🔄 TradingView data updated for ${symbol}: $${newData.price?.toFixed(2)} (${newData.changePercent?.toFixed(2)}%)`);
    setData(prev => ({
      ...prev,
      [symbol]: newData
    }));
  }, []);

  const getData = useCallback((symbol: string): TradingViewData => {
    return data[symbol] || {
      price: null,
      changePercent: null,
      high: null,
      low: null,
      volume: null,
      lastUpdated: null
    };
  }, [data]);

  return (
    <TradingViewDataContext.Provider value={{ data, updateData, getData }}>
      {children}
    </TradingViewDataContext.Provider>
  );
};

export const useTradingViewData = () => {
  const context = useContext(TradingViewDataContext);
  if (context === undefined) {
    throw new Error('useTradingViewData must be used within a TradingViewDataProvider');
  }
  return context;
};
