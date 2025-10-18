import { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  interval?: string;
  timezone?: string;
  theme?: string;
  locale?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingViewWidget = ({
  symbol = "BINANCE:BTCUSDT",
  interval = "240",
  timezone = "Etc/UTC",
  theme = "dark",
  locale = "en"
}: TradingViewWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        // Initialize widget following the HTML structure
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: timezone,
          theme: theme,
          style: "1",
          locale: locale,
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          withdateranges: true,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          watchlist: [
            "BINANCE:BTCUSDT",
            "BINANCE:ETHUSDT"
          ],
          details: true,
          hotlist: true,
          calendar: true,
          studies: [
            "STD;SAM"
          ],
          container_id: "chart",
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650"
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, timezone, theme, locale]);

  return (
    <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
      <div id="chart" ref={containerRef} style={{ height: '600px', width: '100%' }}></div>
      <div className="tradingview-widget-copyright">
        <a 
          href="https://www.tradingview.com/" 
          rel="noopener noreferrer" 
          target="_blank"
        >
          <span>Track all Markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};
