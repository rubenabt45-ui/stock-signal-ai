
import { useEffect, useRef, useState, memo } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface TradingViewAdvancedChartProps {
  symbol: string;
  timeframe: string;
  height?: string;
  className?: string;
}

// Map timeframes to TradingView intervals
const getInterval = (timeframe: string): string => {
  const intervalMap: Record<string, string> = {
    '1D': '15',
    '1W': '1D',
    '1M': '1D',
    '3M': '1W',
    '6M': '1W',
    '1Y': '1M'
  };
  return intervalMap[timeframe] || '1D';
};

const TradingViewAdvancedChartComponent = ({ 
  symbol, 
  timeframe, 
  height = "600px", 
  className = "" 
}: TradingViewAdvancedChartProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartReady, setChartReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const { actualTheme } = useTheme();
  
  console.log(`[TV-IFRAME] ${new Date().toISOString()} - Loading chart: ${symbol} (${timeframe})`);

  // Generate TradingView embed URL
  const getEmbedUrl = (symbol: string, interval: string, theme: string) => {
    const baseUrl = 'https://s.tradingview.com/widgetembed/';
    const params = new URLSearchParams({
      symbol: symbol,
      interval: interval,
      hidesidetoolbar: '1',
      symboledit: '1',
      saveimage: '1',
      toolbarbg: theme === 'dark' ? '1a1a1a' : 'f1f3f6',
      studies: '[]',
      theme: theme === 'dark' ? 'dark' : 'light',
      style: '1',
      timezone: 'Etc/UTC',
      studies_overrides: '{}',
      overrides: '{}',
      enabled_features: '[]',
      disabled_features: '[]',
      locale: 'en',
      utm_source: '',
      utm_medium: '',
      utm_campaign: ''
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  const embedUrl = getEmbedUrl(symbol, getInterval(timeframe), actualTheme);

  useEffect(() => {
    setIsLoading(true);
    setChartReady(false);
    
    console.log(`[TV-IFRAME] Loading embed for ${symbol} with interval ${getInterval(timeframe)}`);
    
    // Simulate loading delay for smooth UX
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      setChartReady(true);
      console.log(`[TV-IFRAME] Chart ready: ${symbol} at ${new Date().toLocaleTimeString()}`);
    }, 1500);

    return () => clearTimeout(loadTimer);
  }, [symbol, timeframe]);

  const handleIframeLoad = () => {
    console.log(`[TV-IFRAME] Iframe loaded successfully for ${symbol}`);
    setIsLoading(false);
    setChartReady(true);
  };

  return (
    <div 
      className={`bg-black/5 rounded-xl border border-gray-700/20 overflow-hidden w-full min-h-[600px] relative ${className}`}
      style={{ 
        height: '600px',
        minHeight: '600px'
      }}
    >
      <iframe
        ref={iframeRef}
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowTransparency={true}
        scrolling="no"
        allowFullScreen={true}
        onLoad={handleIframeLoad}
        style={{
          display: isLoading ? 'none' : 'block',
          border: 'none',
          borderRadius: '12px'
        }}
        title={`TradingView Chart for ${symbol}`}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tradeiq-blue mx-auto"></div>
            <p className="text-white text-sm">Loading chart...</p>
            <p className="text-gray-400 text-xs">{symbol} - {timeframe}</p>
          </div>
        </div>
      )}
      
      {/* Ready indicator */}
      {chartReady && (
        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-500 text-xs font-medium">Live</span>
        </div>
      )}
    </div>
  );
};

// Simple memo for performance
export const TradingViewAdvancedChart = memo(TradingViewAdvancedChartComponent, (prevProps, nextProps) => {
  const shouldNotRerender = 
    prevProps.symbol === nextProps.symbol &&
    prevProps.timeframe === nextProps.timeframe &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className;
  
  if (!shouldNotRerender) {
    console.log(`[TV-IFRAME] Re-rendering: ${prevProps.symbol} → ${nextProps.symbol}, ${prevProps.timeframe} → ${nextProps.timeframe}`);
  }
  
  return shouldNotRerender;
});
