
// Ultra-lightweight TradingView configurations for maximum performance
export const getTradingViewConfig = (theme: 'dark' | 'light') => {
  return {
    // Core performance settings
    autosize: false,
    width: "100%",
    height: 400,
    timezone: "Etc/UTC",
    theme: theme,
    style: "1", // Candlestick
    locale: "en",
    
    // Performance optimizations - disable everything we don't need
    enable_publishing: false,
    withdateranges: false,
    hide_side_toolbar: true,
    allow_symbol_change: false,
    details: false,
    hotlist: false,
    calendar: false,
    news: false,
    screener_popup: false,
    
    // Hide all UI controls for maximum performance
    hide_top_toolbar: true,
    hide_legend: false,
    hide_volume: false,
    toolbar_bg: theme === 'dark' ? "#0f172a" : "#ffffff",
    
    // Disable interactive features to reduce CPU
    disabled_features: [
      "header_symbol_search",
      "header_resolutions",
      "header_chart_type",
      "header_settings",
      "header_indicators",
      "header_compare",
      "header_undo_redo",
      "header_screenshot",
      "header_fullscreen_button",
      "volume_force_overlay",
      "left_toolbar",
      "control_bar",
      "timeframes_toolbar",
      "edit_buttons_in_legend",
      "context_menus",
      "border_around_the_chart",
      "remove_library_container_border"
    ],
    
    // Enabled minimal features only
    enabled_features: [
      "study_templates"
    ],
    
    // Minimal overrides for clean appearance
    overrides: {
      "paneProperties.background": theme === 'dark' ? "#0f172a" : "#ffffff",
      "paneProperties.backgroundType": "solid",
      "mainSeriesProperties.candleStyle.upColor": "#2563eb",
      "mainSeriesProperties.candleStyle.downColor": "#ef4444",
      "mainSeriesProperties.candleStyle.borderUpColor": "#2563eb",
      "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
      "mainSeriesProperties.candleStyle.wickUpColor": "#2563eb",
      "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444"
    }
  };
};

// Lightweight market overview config (even more stripped down)
export const getMarketOverviewConfig = (theme: 'dark' | 'light', symbols: string[]) => {
  return {
    colorTheme: theme,
    dateRange: "12M",
    showChart: true,
    locale: "en",
    width: "100%",
    height: 400,
    largeChartUrl: "",
    isTransparent: false,
    showSymbolLogo: false,
    showFloatingTooltip: false,
    
    // Aggressive performance settings
    hideTopToolbar: true,
    hideBottomToolbar: true,
    hideDateRanges: true,
    hideMarketStatus: true,
    hideSymbolSearch: true,
    hideVolumeMA: true,
    allowSymbolChange: false,
    details: false,
    hotlist: false,
    calendar: false,
    news: false,
    screener_popup: false,
    enable_publishing: false,
    withdateranges: false,
    hide_side_toolbar: true,
    save_image: false,
    
    // Clean styling
    plotLineColorGrowing: "rgba(37, 99, 235, 1)",
    plotLineColorFalling: "rgba(239, 68, 68, 1)",
    gridLineColor: "rgba(240, 243, 250, 0.06)",
    scaleFontColor: "rgba(120, 123, 134, 1)",
    belowLineFillColorGrowing: "rgba(37, 99, 235, 0.12)",
    belowLineFillColorFalling: "rgba(239, 68, 68, 0.12)",
    belowLineFillColorGrowingBottom: "rgba(37, 99, 235, 0)",
    belowLineFillColorFallingBottom: "rgba(239, 68, 68, 0)",
    symbolActiveColor: "rgba(60, 120, 216, 0.12)",
    
    symbolsGroups: [
      {
        name: "Related Assets",
        symbols: symbols.map(symbol => ({
          name: symbol,
          displayName: symbol.replace('NASDAQ:', '').replace('NYSE:', '')
        }))
      }
    ]
  };
};
