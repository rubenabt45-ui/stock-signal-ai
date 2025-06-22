
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

// Global widget state management
let globalTradingViewWidget: any = null;
let isWidgetReady: boolean = false;
let currentSymbol: string = '';
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

export const setTradingViewWidget = (widget: any, symbol: string) => {
  console.log(`🎯 [${new Date().toLocaleTimeString()}] Setting TradingView widget for ${symbol}`);
  
  globalTradingViewWidget = widget;
  currentSymbol = symbol;
  isWidgetReady = false;
  
  // Reset widget data for new symbol
  Object.assign(currentWidgetData, {
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
  
  if (!widget) {
    console.warn('⚠️ Widget is null');
    return;
  }

  // Enhanced widget ready detection
  const initializeWidget = () => {
    try {
      // Method 1: Check if onChartReady exists and use it
      if (widget.onChartReady && typeof widget.onChartReady === 'function') {
        console.log(`📊 [${new Date().toLocaleTimeString()}] Using onChartReady for ${symbol}`);
        widget.onChartReady(() => {
          console.log(`✅ [${new Date().toLocaleTimeString()}] TradingView widget ready via onChartReady for ${symbol}`);
          isWidgetReady = true;
          setupWidgetListeners(widget, symbol);
          extractWidgetPrice();
        });
      } else {
        // Method 2: Fallback polling method
        console.log(`⏰ [${new Date().toLocaleTimeString()}] Using polling fallback for ${symbol}`);
        let attempts = 0;
        const maxAttempts = 50; // 10 seconds with 200ms intervals
        
        const pollForReady = () => {
          attempts++;
          
          try {
            const chart = widget.activeChart && widget.activeChart();
            if (chart && chart.symbol) {
              console.log(`✅ [${new Date().toLocaleTimeString()}] Widget ready via polling for ${symbol} (attempt ${attempts})`);
              isWidgetReady = true;
              setupWidgetListeners(widget, symbol);
              extractWidgetPrice();
              return;
            }
          } catch (e) {
            // Continue polling
          }
          
          if (attempts < maxAttempts) {
            setTimeout(pollForReady, 200);
          } else {
            console.error(`❌ [${new Date().toLocaleTimeString()}] Widget failed to initialize after ${attempts} attempts for ${symbol}`);
            notifyError(`TradingView widget failed to initialize for ${symbol}`);
          }
        };
        
        // Start polling after a brief delay
        setTimeout(pollForReady, 500);
      }
    } catch (error) {
      console.error(`❌ [${new Date().toLocaleTimeString()}] Widget initialization error for ${symbol}:`, error);
      notifyError(`Widget initialization failed: ${error}`);
    }
  };

  // Initialize with slight delay to ensure DOM is ready
  setTimeout(initializeWidget, 100);
};

const setupWidgetListeners = (widget: any, symbol: string) => {
  try {
    const chart = widget.activeChart();
    if (!chart) return;

    // Listen for symbol changes
    if (chart.onSymbolChanged && typeof chart.onSymbolChanged === 'function') {
      chart.onSymbolChanged().subscribe(null, () => {
        console.log(`📈 [${new Date().toLocaleTimeString()}] Symbol changed detected for ${symbol}`);
        setTimeout(() => extractWidgetPrice(), 500);
      });
    }

    // Listen for data updates
    if (chart.onDataLoaded && typeof chart.onDataLoaded === 'function') {
      chart.onDataLoaded().subscribe(null, () => {
        console.log(`📊 [${new Date().toLocaleTimeString()}] Data loaded for ${symbol}`);
        setTimeout(() => extractWidgetPrice(), 100);
      });
    }

    // Listen for price scale changes
    if (chart.onPriceScaleChanged && typeof chart.onPriceScaleChanged === 'function') {
      chart.onPriceScaleChanged().subscribe(null, () => {
        setTimeout(() => extractWidgetPrice(), 100);
      });
    }

    console.log(`🎧 [${new Date().toLocaleTimeString()}] Event listeners setup for ${symbol}`);
  } catch (error) {
    console.warn(`⚠️ Event listener setup failed for ${symbol}:`, error);
  }
};

const extractWidgetPrice = () => {
  if (!globalTradingViewWidget || !isWidgetReady) {
    console.log(`⏳ [${new Date().toLocaleTimeString()}] Widget not ready for price extraction`);
    return null;
  }

  try {
    const chart = globalTradingViewWidget.activeChart();
    if (!chart) {
      console.log(`⚠️ [${new Date().toLocaleTimeString()}] No active chart available`);
      return null;
    }

    // Get current symbol
    const symbolInfo = chart.symbol();
    console.log(`📊 [${new Date().toLocaleTimeString()}] Extracting price for symbol: ${symbolInfo}`);
    
    // Multiple methods to get price data
    let priceData = null;

    // Method 1: Try to get series data
    try {
      const series = chart.getSeries();
      if (series && series.length > 0) {
        const mainSeries = series[0];
        const seriesData = mainSeries.data();
        
        if (seriesData && seriesData.length > 0) {
          const lastBar = seriesData[seriesData.length - 1];
          if (lastBar) {
            priceData = {
              price: lastBar.close || lastBar.value || lastBar.price,
              open: lastBar.open,
              high: lastBar.high,
              low: lastBar.low,
              volume: lastBar.volume,
            };
            console.log(`💎 [${new Date().toLocaleTimeString()}] Price extracted via series: $${formatPrice(priceData.price)}`);
          }
        }
      }
    } catch (seriesError) {
      console.log(`📊 Series extraction failed:`, seriesError);
    }

    // Method 2: Try to get current price directly
    if (!priceData) {
      try {
        const currentPrice = chart.getVisibleRange && chart.getVisibleRange();
        if (currentPrice) {
          priceData = { price: currentPrice.to };
        }
      } catch (e) {
        console.log(`💰 Direct price extraction failed:`, e);
      }
    }

    if (priceData && priceData.price) {
      const change = priceData.price && priceData.open ? priceData.price - priceData.open : null;
      const changePercent = change && priceData.open ? (change / priceData.open) * 100 : null;
      
      const widgetData: TradingViewWidgetData = {
        symbol: symbolInfo || currentSymbol,
        price: priceData.price,
        change: change,
        changePercent: changePercent,
        open: priceData.open || null,
        high: priceData.high || null,
        low: priceData.low || null,
        volume: priceData.volume || null,
        lastUpdated: Date.now(),
        isLoading: false,
        error: null,
      };

      console.log(`✅ [${new Date().toLocaleTimeString()}] TradingView price: $${formatPrice(widgetData.price)} (${formatChangePercent(widgetData.changePercent)}) for ${widgetData.symbol}`);
      
      // Update global data and notify all subscribers
      Object.assign(currentWidgetData, widgetData);
      notifySubscribers(widgetData);
      
      return widgetData;
    }
  } catch (error) {
    console.error(`❌ [${new Date().toLocaleTimeString()}] Price extraction error:`, error);
    notifyError(`Price extraction failed: ${error}`);
  }
  
  return null;
};

const notifySubscribers = (data: TradingViewWidgetData) => {
  dataSubscribers.forEach(callback => {
    try {
      callback(data);
    } catch (e) {
      console.warn('Subscriber notification error:', e);
    }
  });
};

const notifyError = (errorMessage: string) => {
  const errorData = {
    ...currentWidgetData,
    isLoading: false,
    error: errorMessage,
  };
  Object.assign(currentWidgetData, errorData);
  notifySubscribers(errorData);
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
  }, [symbol]);

  const updateDataFromWidget = useCallback(() => {
    const targetSymbol = currentSymbolRef.current;
    
    // Check if we have data for this symbol
    if (currentWidgetData.symbol === targetSymbol && currentWidgetData.price !== null) {
      console.log(`🔄 [${new Date().toLocaleTimeString()}] Using cached data for ${targetSymbol}: $${formatPrice(currentWidgetData.price)}`);
      setWidgetData({ ...currentWidgetData });
      return;
    }

    // Try to extract fresh data
    if (isWidgetReady && globalTradingViewWidget) {
      extractWidgetPrice();
    } else {
      console.log(`⏳ [${new Date().toLocaleTimeString()}] Widget not ready for ${targetSymbol}`);
      setWidgetData(prev => ({
        ...prev,
        symbol: targetSymbol,
        isLoading: true,
        error: null,
      }));
    }
  }, []);

  // Setup data extraction and polling
  useEffect(() => {
    console.log(`🎯 [${new Date().toLocaleTimeString()}] Setting up widget data for ${symbol}`);
    
    // Clear existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Initial update
    updateDataFromWidget();
    
    // Setup polling every 1 second for live updates
    intervalRef.current = setInterval(updateDataFromWidget, 1000);
    
    // Setup timeout fallback
    timeoutRef.current = setTimeout(() => {
      if (widgetData.isLoading) {
        console.warn(`⚠️ [${new Date().toLocaleTimeString()}] Widget timeout for ${symbol}`);
        setWidgetData(prev => ({
          ...prev,
          isLoading: false,
          error: 'TradingView widget failed to load within 10 seconds',
        }));
      }
    }, 10000);
    
    // Subscribe to global updates
    const handleUpdate = (data: TradingViewWidgetData) => {
      if (data.symbol === currentSymbolRef.current || data.symbol.includes(currentSymbolRef.current)) {
        setWidgetData(data);
      }
    };
    
    dataSubscribers.add(handleUpdate);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      dataSubscribers.delete(handleUpdate);
      console.log(`🛑 [${new Date().toLocaleTimeString()}] Cleaned up widget data for ${symbol}`);
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
