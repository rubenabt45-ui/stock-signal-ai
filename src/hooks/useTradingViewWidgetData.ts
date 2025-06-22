
import { useState, useEffect, useCallback, useRef } from 'react';

export interface TradingViewWidgetData {
  symbol: string;
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
}

declare global {
  interface Window {
    TradingView: any;
  }
}

// Global widget reference for direct price extraction
let globalTradingViewWidget: any = null;
const dataSubscribers = new Set<(data: TradingViewWidgetData) => void>();
const currentWidgetData: TradingViewWidgetData = {
  symbol: '',
  price: null,
  change: null,
  changePercent: null,
  open: null,
  high: null,
  low: null,
  volume: null,
  lastUpdated: null,
  isLoading: true,
  error: null,
};

export const setTradingViewWidget = (widget: any) => {
  globalTradingViewWidget = widget;
  console.log('🎯 TradingView widget reference updated for direct price extraction');
  
  // Extract price immediately when widget is set
  if (widget) {
    setTimeout(() => {
      extractWidgetPrice();
    }, 1000); // Give widget time to load data
  }
};

const extractWidgetPrice = () => {
  if (!globalTradingViewWidget) {
    console.log('⚠️ No TradingView widget available for price extraction');
    return;
  }

  try {
    const chart = globalTradingViewWidget.activeChart?.();
    if (chart) {
      // Get symbol info
      const symbolInfo = chart.symbol();
      console.log(`📊 TradingView active symbol: ${symbolInfo}`);
      
      // Try to get current price from chart
      try {
        const series = chart.getSeries();
        if (series && series.length > 0) {
          const lastBar = series[0].data()[series[0].data().length - 1];
          if (lastBar) {
            const price = lastBar.close || lastBar.value;
            const open = lastBar.open;
            const high = lastBar.high;
            const low = lastBar.low;
            const volume = lastBar.volume;
            
            const change = price && open ? price - open : null;
            const changePercent = change && open ? (change / open) * 100 : null;
            
            const widgetData: TradingViewWidgetData = {
              symbol: symbolInfo || currentWidgetData.symbol,
              price: price || null,
              change: change,
              changePercent: changePercent,
              open: open || null,
              high: high || null,
              low: low || null,
              volume: volume || null,
              lastUpdated: Date.now(),
              isLoading: false,
              error: null,
            };
            
            console.log(`💎 Direct TradingView price extracted: $${formatPrice(widgetData.price)} for ${widgetData.symbol}`);
            
            // Update global data and notify subscribers
            Object.assign(currentWidgetData, widgetData);
            dataSubscribers.forEach(callback => {
              try {
                callback(widgetData);
              } catch (e) {
                console.log('Subscriber notification error:', e);
              }
            });
            
            return widgetData;
          }
        }
      } catch (seriesError) {
        console.log('📊 Series data extraction failed, trying alternative method:', seriesError);
      }
    }
  } catch (error) {
    console.log('⚠️ TradingView widget price extraction failed:', error);
  }
  
  return null;
};

export const useTradingViewWidgetData = (symbol: string): TradingViewWidgetData => {
  const [widgetData, setWidgetData] = useState<TradingViewWidgetData>({
    symbol,
    price: null,
    change: null,
    changePercent: null,
    open: null,
    high: null,
    low: null,
    volume: null,
    lastUpdated: null,
    isLoading: true,
    error: null,
  });

  const intervalRef = useRef<NodeJS.Timeout>();
  const currentSymbolRef = useRef(symbol);

  // Update current symbol reference
  useEffect(() => {
    currentSymbolRef.current = symbol;
    currentWidgetData.symbol = symbol;
  }, [symbol]);

  const updateDataFromWidget = useCallback(() => {
    if (!currentSymbolRef.current) return;

    const targetSymbol = currentSymbolRef.current;
    console.log(`🔄 Extracting TradingView widget data for ${targetSymbol}`);
    
    // Try to extract from TradingView widget first
    const extractedData = extractWidgetPrice();
    
    if (extractedData && extractedData.symbol.includes(targetSymbol)) {
      console.log(`✅ Using TradingView widget data for ${targetSymbol}: $${formatPrice(extractedData.price)}`);
      setWidgetData(extractedData);
      return;
    }
    
    // If no widget data available, show loading state
    console.log(`⏳ TradingView widget not ready for ${targetSymbol}, waiting...`);
    setWidgetData(prev => ({
      ...prev,
      symbol: targetSymbol,
      isLoading: true,
      error: null,
    }));
  }, []);

  // Setup data extraction and polling
  useEffect(() => {
    console.log(`🎯 Setting up TradingView widget data extraction for ${symbol}`);
    
    // Initial extraction
    updateDataFromWidget();
    
    // Setup frequent polling to catch widget updates (every 2 seconds)
    intervalRef.current = setInterval(updateDataFromWidget, 2000);
    
    // Subscribe to updates
    dataSubscribers.add(setWidgetData);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      dataSubscribers.delete(setWidgetData);
      console.log(`🛑 Cleaned up TradingView widget data extraction for ${symbol}`);
    };
  }, [symbol, updateDataFromWidget]);

  return widgetData;
};

// Utility functions
export const formatPrice = (price: number | null): string => {
  if (price === null || price === undefined) return '--';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatChangePercent = (changePercent: number | null): string => {
  if (changePercent === null || changePercent === undefined) return '--';
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};
