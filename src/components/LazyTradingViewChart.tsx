
import { lazy, Suspense } from 'react';

// Lazy load TradingView components only when needed - optimized imports
const TradingViewAdvancedChart = lazy(() => 
  import('./TradingViewAdvancedChart').then(module => ({
    default: module.TradingViewAdvancedChart
  }))
);

const OptimizedTradingViewWidget = lazy(() => 
  import('./OptimizedTradingViewWidget').then(module => ({
    default: module.OptimizedTradingViewWidget
  }))
);

const TradingViewOverview = lazy(() => 
  import('./TradingViewOverview').then(module => ({
    default: module.TradingViewOverview
  }))
);

const MarketOverview = lazy(() => 
  import('./MarketOverview').then(module => ({
    default: module.MarketOverview
  }))
);

// Reuse existing loading fallback for consistency
const ChartLoader = ({ height = "600px", className = "" }) => (
  <div 
    className={`flex items-center justify-center bg-black/5 rounded-xl border border-gray-700/20 ${className}`}
    style={{ height }}
  >
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tradeiq-blue mx-auto"></div>
      <div>
        <p className="text-white font-medium">Loading Chart...</p>
        <p className="text-gray-400 text-sm">Initializing TradingView</p>
      </div>
    </div>
  </div>
);

interface LazyTradingViewAdvancedChartProps {
  symbol: string;
  timeframe: string;
  height?: string;
  className?: string;
}

export const LazyTradingViewAdvancedChart = (props: LazyTradingViewAdvancedChartProps) => (
  <Suspense fallback={<ChartLoader height={props.height} className={props.className} />}>
    <TradingViewAdvancedChart {...props} />
  </Suspense>
);

interface LazyOptimizedTradingViewWidgetProps {
  symbol: string;
  height?: string;
  className?: string;
  onReady?: () => void;
  onError?: (error: any) => void;
}

export const LazyOptimizedTradingViewWidget = (props: LazyOptimizedTradingViewWidgetProps) => (
  <Suspense fallback={<ChartLoader height={props.height} className={props.className} />}>
    <OptimizedTradingViewWidget {...props} />
  </Suspense>
);

interface LazyTradingViewOverviewProps {
  symbols: string[];
  height?: string;
  className?: string;
}

export const LazyTradingViewOverview = (props: LazyTradingViewOverviewProps) => (
  <Suspense fallback={<ChartLoader height={props.height} className={props.className} />}>
    <TradingViewOverview {...props} />
  </Suspense>
);

interface LazyMarketOverviewProps {
  symbols?: string[];
  theme?: "dark" | "light";
  height?: number;
  className?: string;
}

export const LazyMarketOverview = (props: LazyMarketOverviewProps) => (
  <Suspense fallback={<ChartLoader height={`${props.height || 400}px`} className={props.className} />}>
    <MarketOverview {...props} />
  </Suspense>
);
