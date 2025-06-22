
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
    tvWidget: any;
  }
}

// Global widget state management - single source of truth
let currentWidgetInstance: any = null;
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

// Price extraction interval
let priceExtractionInterval: NodeJS.Timeout | null = null;

export const setTradingViewWidget = (widget: any, symbol: string) => {
  console.log(`[TV-SYNC] ${new Date().toISOString()} - Setting TradingView widget for ${symbol}`);
  
  currentWidgetInstance = widget;
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
    console.warn(`[TV-SYNC] Widget is null for ${symbol}`);
    notifyError('Widget is null or undefined');
    return;
  }

  // Setup widget data extraction after ready
  try {
    // Wait for widget to be fully ready
    setTimeout(() => {
      try {
        const chart = widget.activeChart();
        if (chart) {
          console.log(`[TV-SYNC] ${new Date().toISOString()} - Widget ready for data extraction: ${symbol}`);
          isWidgetReady = true;
          setupPriceExtraction();
          
          // Setup event listeners for data updates
          try {
            if (chart.onDataLoaded && typeof chart.onDataLoaded === 'function') {
              chart.onDataLoaded().subscribe(null, () => {
                console.log(`[TV-DATA] ${new Date().toISOString()} - Data loaded for ${symbol}`);
                setTimeout(() => extractWidgetPrice(), 200);
              });
            }
          } catch (e) {
            console.log(`[TV-LISTENER] Data loaded listener setup failed:`, e);
          }
          
          // Initial price extraction
          setTimeout(() => extractWidgetPrice(), 1000);
        } else {
          console.log(`[TV-SYNC] Chart not available yet, retrying...`);
          setTimeout(() => {
            const retryChart = widget.activeChart();
            if (retryChart) {
              isWidgetReady = true;
              setupPriceExtraction();
              setTimeout(() => extractWidgetPrice(), 1000);
            }
          }, 2000);
        }
      } catch (error) {
        console.error(`[TV-SYNC] Widget setup error for ${symbol}:`, error);
        notifyError(`Widget setup failed: ${error}`);
      }
    }, 500);
  } catch (error) {
    console.error(`[TV-SYNC] Widget setup error for ${symbol}:`, error);
    notifyError(`Widget setup failed: ${error}`);
  }
};

const setupPriceExtraction = () => {
  // Clear existing interval
  if (priceExtractionInterval) {
    clearInterval(priceExtractionInterval);
  }
  
  // Extract price every 2000ms for reliable updates without overwhelming the widget
  priceExtractionInterval = setInterval(() => {
    if (isWidgetReady && currentWidgetInstance) {
      extractWidgetPrice();
    }
  }, 2000);
};

const extractWidgetPrice = () => {
  if (!currentWidgetInstance || !isWidgetReady) {
    return null;
  }

  try {
    const chart = currentWidgetInstance.activeChart();
    if (!chart) {
      return null;
    }

    // Get current symbol
    let symbolInfo = '';
    try {
      symbolInfo = chart.symbol() || currentSymbol;
    } catch (e) {
      symbolInfo = currentSymbol;
    }
    
    console.log(`[TV-EXTRACT] ${new Date().toISOString()} - Extracting price for: ${symbolInfo}`);
    
    // Try to get price data from chart - using multiple methods for reliability
    let priceData = null;

    // Method 1: Try to get data from chart entity
    try {
      if (chart.entity && chart.entity().data) {
        const entityData = chart.entity().data();
        if (entityData && entityData.length > 0) {
          const lastBar = entityData[entityData.length - 1];
          if (lastBar && lastBar.close !== undefined) {
            priceData = {
              price: lastBar.close,
              open: lastBar.open || null,
              high: lastBar.high || null,
              low: lastBar.low || null,
              volume: lastBar.volume || null,
            };
            console.log(`[TV-EXTRACT] ${new Date().toISOString()} - Price via entity: $${formatPrice(priceData.price)}`);
          }
        }
      }
    } catch (e) {
      console.log(`[TV-EXTRACT] Entity extraction attempt:`, e);
    }

    // Method 2: Try series data (most reliable for OHLCV)
    if (!priceData?.price) {
      try {
        const series = chart.getSeries?.();
        if (series && series.length > 0) {
          const mainSeries = series[0];
          if (mainSeries && mainSeries.data) {
            const seriesData = mainSeries.data();
            
            if (seriesData && seriesData.length > 0) {
              const lastBar = seriesData[seriesData.length - 1];
              if (lastBar && lastBar.close !== undefined) {
                priceData = {
                  price: lastBar.close,
                  open: lastBar.open || null,
                  high: lastBar.high || null,
                  low: lastBar.low || null,
                  volume: lastBar.volume || null,
                };
                console.log(`[TV-EXTRACT] ${new Date().toISOString()} - Price via series: $${formatPrice(priceData.price)}`);
              }
            }
          }
        }
      } catch (e) {
        console.log(`[TV-EXTRACT] Series extraction attempt:`, e);
      }
    }

    // Method 3: Try current price methods
    if (!priceData?.price) {
      try {
        const currentPrice = chart.getCurrentPrice?.() || chart.getPrice?.();
        if (currentPrice && !isNaN(currentPrice)) {
          priceData = { price: currentPrice };
          console.log(`[TV-EXTRACT] ${new Date().toISOString()} - Price via getCurrentPrice: $${formatPrice(priceData.price)}`);
        }
      } catch (e) {
        console.log(`[TV-EXTRACT] getCurrentPrice attempt:`, e);
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

      console.log(`[TV-SYNC] LivePrice: $${formatPrice(widgetData.price)} - ${widgetData.symbol} (${formatChangePercent(widgetData.changePercent)})`);
      
      // Update global data and notify all subscribers
      Object.assign(currentWidgetData, widgetData);
      notifySubscribers(widgetData);
      
      return widgetData;
    }
  } catch (error) {
    console.error(`[TV-EXTRACT] ${new Date().toISOString()} - Price extraction error:`, error);
  }
  
  return null;
};

const notifySubscribers = (data: TradingViewWidgetData) => {
  dataSubscribers.forEach(callback => {
    try {
      callback(data);
    } catch (e) {
      console.warn('[TV-NOTIFY] Subscriber notification error:', e);
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
      console.log(`[TV-USE] ${new Date().toISOString()} - Using cached data for ${targetSymbol}: $${formatPrice(currentWidgetData.price)}`);
      setWidgetData({ ...currentWidgetData });
      return;
    }

    // Try to extract fresh data if widget is ready
    if (isWidgetReady && currentWidgetInstance) {
      const extracted = extractWidgetPrice();
      if (extracted && (extracted.symbol === targetSymbol || extracted.symbol.includes(targetSymbol))) {
        setWidgetData(extracted);
      }
    } else {
      console.log(`[TV-USE] ${new Date().toISOString()} - Widget not ready for ${targetSymbol}, waiting...`);
      setWidgetData(prev => ({
        ...prev,
        symbol: targetSymbol,
        isLoading: true,
        error: null,
      }));
    }
  }, []);

  // Setup data extraction and subscription
  useEffect(() => {
    console.log(`[TV-USE] ${new Date().toISOString()} - Setting up widget data subscription for ${symbol}`);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Initial update
    updateDataFromWidget();
    
    // Setup timeout fallback (15 seconds)
    timeoutRef.current = setTimeout(() => {
      if (widgetData.isLoading && !widgetData.price) {
        console.warn(`[TV-USE] ${new Date().toISOString()} - Widget data timeout for ${symbol}`);
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
      console.log(`[TV-USE] ${new Date().toISOString()} - Cleaned up widget data subscription for ${symbol}`);
    };
  }, [symbol, updateDataFromWidget, widgetData.isLoading, widgetData.price]);

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
