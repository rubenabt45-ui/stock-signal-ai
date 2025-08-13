
import { lazy, Suspense, ComponentType } from 'react';

// Lazy load heavy TradingView components only when needed
const LazyOptimizedTradingViewWidget = lazy(() => 
  import('./OptimizedTradingViewWidget').then(module => ({
    default: module.OptimizedTradingViewWidget
  }))
);

const LazyTradingViewAdvancedChart = lazy(() => 
  import('./TradingViewAdvancedChart').then(module => ({
    default: module.TradingViewAdvancedChart
  }))
);

const LazyMarketOverview = lazy(() => 
  import('./MarketOverview').then(module => ({
    default: module.MarketOverview
  }))
);

// Reuse existing loading fallback
const TradingViewLoader = ({ height = "600px", className = "" }) => (
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

// Wrapped components with Suspense
export const LazyOptimizedTradingViewWidgetWithSuspense: ComponentType<any> = (props) => (
  <Suspense fallback={<TradingViewLoader height={props.height} className={props.className} />}>
    <LazyOptimizedTradingViewWidget {...props} />
  </Suspense>
);

export const LazyTradingViewAdvancedChartWithSuspense: ComponentType<any> = (props) => (
  <Suspense fallback={<TradingViewLoader height={props.height} className={props.className} />}>
    <LazyTradingViewAdvancedChart {...props} />
  </Suspense>
);

export const LazyMarketOverviewWithSuspense: ComponentType<any> = (props) => (
  <Suspense fallback={<TradingViewLoader height={props.height} className={props.className} />}>
    <LazyMarketOverview {...props} />
  </Suspense>
);
