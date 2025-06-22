
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

// Global widget reference and ready state
let globalTradingViewWidget: any = null;
let isWidgetReady: boolean = false;
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
  isWidgetReady = false; // Reset ready state for new widget
  console.log('🎯 TradingView widget reference set, waiting for onChartReady...');
  
  if (widget && typeof widget.onChartReady === 'function') {
    widget.onChartReady(() => {
      isWidgetReady = true;
      console.log('✅ TradingView widget is now ready for data extraction');
      
      // Start extracting data now that widget is ready
      setTimeout(() => {
        extractWidgetPrice();
      }, 500);
    });
  } else {
    console.warn('⚠️ Widget does not have onChartReady method');
  }
};

const extractWidgetPrice = () => {
  if (!globalTradingViewWidget || !isWidgetReady) {
    console.log('⚠️ Widget not ready for price extraction');
    return null;
  }

  try {
    const chart = globalTradingViewWidget.activeChart?.();
    if (!chart) {
      console.log('⚠️ No active chart available');
      return null;
    }

    // Get symbol info
    const symbolInfo = chart.symbol();
    console.log(`📊 TradingView active symbol: ${symbolInfo}`);
    
    // Try to get current price data
    try {
      const series = chart.getSeries();
      if (series && series.length > 0) {
        const seriesData = series[0].data();
        if (seriesData && seriesData.length > 0) {
          const lastBar = seriesData[seriesData.length - 1];
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
            
            console.log(`💎 TradingView price extracted: $${formatPrice(widgetData.price)} for ${widgetData.symbol}`);
            
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
      }
    } catch (seriesError) {
      console.log('📊 Series data extraction failed:', seriesError);
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
  const timeoutRef = useRef<NodeJS.Timeout>();
  const currentSymbolRef = useRef(symbol);

  // Update current symbol reference
  useEffect(() => {
    currentSymbolRef.current = symbol;
    currentWidgetData.symbol = symbol;
  }, [symbol]);

  const updateDataFromWidget = useCallback(() => {
    if (!currentSymbolRef.current) return;

    const targetSymbol = currentSymbolRef.current;
    console.log(`🔄 Checking TradingView widget data for ${targetSymbol}`);
    
    // Only extract if widget is ready
    if (!globalTradingViewWidget || !isWidgetReady) {
      console.log(`⏳ TradingView widget not ready for ${targetSymbol}, waiting...`);
      setWidgetData(prev => ({
        ...prev,
        symbol: targetSymbol,
        isLoading: true,
        error: null,
      }));
      return;
    }
    
    // Try to extract from TradingView widget
    const extractedData = extractWidgetPrice();
    
    if (extractedData && extractedData.symbol.includes(targetSymbol)) {
      console.log(`✅ Using TradingView widget data for ${targetSymbol}: $${formatPrice(extractedData.price)}`);
      setWidgetData(extractedData);
    } else {
      console.log(`⏳ No matching data for ${targetSymbol}, keeping loading state`);
    }
  }, []);

  // Setup data extraction and polling
  useEffect(() => {
    console.log(`🎯 Setting up TradingView widget data extraction for ${symbol}`);
    
    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Initial extraction
    updateDataFromWidget();
    
    // Setup polling every 2 seconds for live updates
    intervalRef.current = setInterval(updateDataFromWidget, 2000);
    
    // Add timeout fallback after 10 seconds
    timeoutRef.current = setTimeout(() => {
      if (widgetData.isLoading) {
        console.log(`⚠️ TradingView widget timeout for ${symbol}`);
        setWidgetData(prev => ({
          ...prev,
          isLoading: false,
          error: 'TradingView widget failed to load within 10 seconds',
        }));
      }
    }, 10000);
    
    // Subscribe to updates
    dataSubscribers.add(setWidgetData);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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
