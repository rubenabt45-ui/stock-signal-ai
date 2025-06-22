
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
    notifyError('Widget is null or undefined');
    return;
  }

  // Enhanced widget ready detection with guaranteed callback
  const initializeWidgetData = () => {
    try {
      // Method 1: Use onChartReady if available
      if (widget.onChartReady && typeof widget.onChartReady === 'function') {
        console.log(`📊 [${new Date().toLocaleTimeString()}] Using onChartReady for widget data ${symbol}`);
        
        widget.onChartReady(() => {
          console.log(`✅ [${new Date().toLocaleTimeString()}] Widget data ready via onChartReady for ${symbol}`);
          isWidgetReady = true;
          setupWidgetListeners(widget, symbol);
          
          // Start price extraction immediately and set up interval
          extractWidgetPrice();
          setupPriceExtraction();
        });
      } else {
        // Method 2: Polling fallback with more aggressive checking
        console.log(`⏰ [${new Date().toLocaleTimeString()}] Using polling fallback for widget data ${symbol}`);
        let attempts = 0;
        const maxAttempts = 30; // 6 seconds with 200ms intervals
        
        const pollForReady = () => {
          attempts++;
          
          try {
            // Check multiple conditions for readiness
            const chart = widget.activeChart && widget.activeChart();
            const hasSymbol = chart && (chart.symbol() || chart.getSymbol);
            const hasContainer = document.getElementById(widget._options?.container_id);
            
            if (chart && hasSymbol && hasContainer) {
              console.log(`✅ [${new Date().toLocaleTimeString()}] Widget data ready via polling for ${symbol} (attempt ${attempts})`);
              isWidgetReady = true;
              setupWidgetListeners(widget, symbol);
              
              // Start price extraction
              extractWidgetPrice();
              setupPriceExtraction();
              return;
            }
          } catch (e) {
            // Continue polling
          }
          
          if (attempts < maxAttempts) {
            setTimeout(pollForReady, 200);
          } else {
            console.error(`❌ [${new Date().toLocaleTimeString()}] Widget data polling failed after ${attempts} attempts for ${symbol}`);
            notifyError(`Widget failed to initialize data extraction for ${symbol}`);
          }
        };
        
        // Start polling after brief delay
        setTimeout(pollForReady, 300);
      }
    } catch (error) {
      console.error(`❌ [${new Date().toLocaleTimeString()}] Widget data initialization error for ${symbol}:`, error);
      notifyError(`Widget data initialization failed: ${error}`);
    }
  };

  // Initialize with slight delay to ensure DOM is ready
  setTimeout(initializeWidgetData, 200);
};

const setupWidgetListeners = (widget: any, symbol: string) => {
  try {
    const chart = widget.activeChart();
    if (!chart) return;

    // Listen for symbol changes
    if (chart.onSymbolChanged && typeof chart.onSymbolChanged === 'function') {
      chart.onSymbolChanged().subscribe(null, () => {
        console.log(`📈 [${new Date().toLocaleTimeString()}] Symbol changed detected for widget data ${symbol}`);
        setTimeout(() => extractWidgetPrice(), 100);
      });
    }

    // Listen for data updates
    if (chart.onDataLoaded && typeof chart.onDataLoaded === 'function') {
      chart.onDataLoaded().subscribe(null, () => {
        console.log(`📊 [${new Date().toLocaleTimeString()}] Data loaded for widget data ${symbol}`);
        setTimeout(() => extractWidgetPrice(), 50);
      });
    }

    // Listen for price scale changes
    if (chart.onPriceScaleChanged && typeof chart.onPriceScaleChanged === 'function') {
      chart.onPriceScaleChanged().subscribe(null, () => {
        setTimeout(() => extractWidgetPrice(), 50);
      });
    }

    console.log(`🎧 [${new Date().toLocaleTimeString()}] Widget data event listeners setup for ${symbol}`);
  } catch (error) {
    console.warn(`⚠️ Widget data event listener setup failed for ${symbol}:`, error);
  }
};

// Set up continuous price extraction
let priceExtractionInterval: NodeJS.Timeout | null = null;

const setupPriceExtraction = () => {
  // Clear existing interval
  if (priceExtractionInterval) {
    clearInterval(priceExtractionInterval);
  }
  
  // Extract price every 500ms for live updates
  priceExtractionInterval = setInterval(() => {
    if (isWidgetReady && globalTradingViewWidget) {
      extractWidgetPrice();
    }
  }, 500);
};

const extractWidgetPrice = () => {
  if (!globalTradingViewWidget || !isWidgetReady) {
    console.log(`⏳ [${new Date().toLocaleTimeString()}] Widget not ready for price extraction`);
    return null;
  }

  try {
    const chart = globalTradingViewWidget.activeChart();
    if (!chart) {
      console.log(`⚠️ [${new Date().toLocaleTimeString()}] No active chart available for price extraction`);
      return null;
    }

    // Get current symbol
    let symbolInfo = '';
    try {
      symbolInfo = chart.symbol() || chart.getSymbol?.() || currentSymbol;
    } catch (e) {
      symbolInfo = currentSymbol;
    }
    
    console.log(`📊 [${new Date().toLocaleTimeString()}] Extracting price for symbol: ${symbolInfo}`);
    
    // Multiple methods to get price data with priority order
    let priceData = null;

    // Method 1: Try to get series data (most reliable)
    try {
      const series = chart.getSeries?.();
      if (series && series.length > 0) {
        const mainSeries = series[0];
        if (mainSeries && mainSeries.data) {
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
      }
    } catch (seriesError) {
      console.log(`📊 Series extraction failed:`, seriesError);
    }

    // Method 2: Try to get current price from price scale
    if (!priceData?.price) {
      try {
        const priceScale = chart.getPriceScale?.();
        if (priceScale) {
          const visibleRange = chart.getVisibleRange?.();
          if (visibleRange && visibleRange.to) {
            priceData = { price: visibleRange.to };
            console.log(`💰 [${new Date().toLocaleTimeString()}] Price extracted via price scale: $${formatPrice(priceData.price)}`);
          }
        }
      } catch (e) {
        console.log(`💰 Price scale extraction failed:`, e);
      }
    }

    // Method 3: Try to get price from chart API
    if (!priceData?.price) {
      try {
        const currentPrice = chart.getCurrentPrice?.();
        if (currentPrice) {
          priceData = { price: currentPrice };
          console.log(`🎯 [${new Date().toLocaleTimeString()}] Price extracted via getCurrentPrice: $${formatPrice(priceData.price)}`);
        }
      } catch (e) {
        console.log(`🎯 getCurrentPrice extraction failed:`, e);
      }
    }

    if (priceData && priceData.price && !isNaN(priceData.price)) {
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

      console.log(`✅ [TV-SYNC] Price Update: ${widgetData.symbol} = $${formatPrice(widgetData.price)} (${formatChangePercent(widgetData.changePercent)}) at ${new Date().toLocaleTimeString()}`);
      
      // Update global data and notify all subscribers
      Object.assign(currentWidgetData, widgetData);
      notifySubscribers(widgetData);
      
      return widgetData;
    } else {
      console.log(`⚠️ [${new Date().toLocaleTimeString()}] No valid price data extracted`);
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

  const currentSymbolRef = useRef(symbol);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Update current symbol reference
  useEffect(() => {
    currentSymbolRef.current = symbol;
  }, [symbol]);

  const updateDataFromWidget = useCallback(() => {
    const targetSymbol = currentSymbolRef.current;
    
    // Check if we have recent data for this symbol
    if (currentWidgetData.symbol === targetSymbol && 
        currentWidgetData.price !== null && 
        currentWidgetData.lastUpdated && 
        (Date.now() - currentWidgetData.lastUpdated) < 5000) {
      console.log(`🔄 [${new Date().toLocaleTimeString()}] Using cached data for ${targetSymbol}: $${formatPrice(currentWidgetData.price)}`);
      setWidgetData({ ...currentWidgetData });
      return;
    }

    // Try to extract fresh data if widget is ready
    if (isWidgetReady && globalTradingViewWidget) {
      const extracted = extractWidgetPrice();
      if (extracted && extracted.symbol === targetSymbol) {
        setWidgetData(extracted);
      }
    } else {
      console.log(`⏳ [${new Date().toLocaleTimeString()}] Widget not ready for ${targetSymbol}, waiting...`);
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
    console.log(`🎯 [${new Date().toLocaleTimeString()}] Setting up widget data subscription for ${symbol}`);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Initial update
    updateDataFromWidget();
    
    // Setup timeout fallback (15 seconds for more reliability)
    timeoutRef.current = setTimeout(() => {
      if (widgetData.isLoading && !widgetData.price) {
        console.warn(`⚠️ [${new Date().toLocaleTimeString()}] Widget data timeout for ${symbol}`);
        setWidgetData(prev => ({
          ...prev,
          isLoading: false,
          error: 'TradingView widget data failed to load within 15 seconds',
        }));
      }
    }, 15000);
    
    // Subscribe to global updates
    const handleUpdate = (data: TradingViewWidgetData) => {
      const targetSymbol = currentSymbolRef.current;
      if (data.symbol === targetSymbol || 
          data.symbol.includes(targetSymbol) || 
          targetSymbol.includes(data.symbol)) {
        setWidgetData(data);
      }
    };
    
    dataSubscribers.add(handleUpdate);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      dataSubscribers.delete(handleUpdate);
      console.log(`🛑 [${new Date().toLocaleTimeString()}] Cleaned up widget data subscription for ${symbol}`);
    };
  }, [symbol, updateDataFromWidget]);

  return widgetData;
};

// Utility functions
export const formatPrice = (price: number | null): string => {
  if (price === null || price === undefined || isNaN(price)) return '--';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatChangePercent = (changePercent: number | null): string => {
  if (changePercent === null || changePercent === undefined || isNaN(changePercent)) return '--';
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};
