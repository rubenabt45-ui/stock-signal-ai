
import { useTradingViewData } from "@/contexts/TradingViewDataContext";
import { useMemo } from "react";

export const formatPrice = (price: number | null): string => {
  if (price === null) return "0.00";
  if (price >= 1000) {
    return price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }
  return price.toFixed(2);
};

export const formatChangePercent = (changePercent: number | null): string => {
  if (changePercent === null) return "0.00%";
  const sign = changePercent >= 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};

export const useTradingViewWidgetData = (symbol: string) => {
  const { getData } = useTradingViewData();
  
  return useMemo(() => {
    const data = getData(symbol);
    
    // Log when data is successfully retrieved
    if (data.price !== null && process.env.NODE_ENV === 'development') {
      console.log(`📊 useTradingViewWidgetData [${symbol}]: Price $${formatPrice(data.price)} (${formatChangePercent(data.changePercent)}) - Synced: ${data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : 'Never'}`);
    }
    
    return {
      price: data.price,
      changePercent: data.changePercent,
      high: data.high,
      low: data.low,
      volume: data.volume,
      lastUpdated: data.lastUpdated,
      isLoading: data.price === null && data.lastUpdated === null,
      error: data.price === null && data.lastUpdated === null ? 'Waiting for TradingView data...' : null
    };
  }, [getData, symbol]);
};
