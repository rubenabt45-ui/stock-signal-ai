
import { useTradingViewData } from "@/contexts/TradingViewDataContext";

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
  const data = getData(symbol);
  
  return {
    price: data.price,
    changePercent: data.changePercent,
    high: data.high,
    low: data.low,
    volume: data.volume,
    lastUpdated: data.lastUpdated,
    isLoading: data.price === null,
    error: null
  };
};
