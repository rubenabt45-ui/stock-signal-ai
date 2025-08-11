
/**
 * Centralized lazy imports for code splitting
 */
import { lazy } from 'react';

// Heavy components that should be lazy loaded
export const LazyStripeTestRunner = lazy(() => import('@/components/StripeTestRunner'));
export const LazyTradingViewWidget = lazy(() => 
  import('@/components/OptimizedTradingViewWidget').then(module => ({ 
    default: module.OptimizedTradingViewWidget 
  }))
);
export const LazyUpgradeModal = lazy(() => 
  import('@/components/UpgradeModal').then(module => ({ 
    default: module.UpgradeModal 
  }))
);

// Page-level lazy imports
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyTradingChat = lazy(() => import('@/pages/TradingChat'));
export const LazyMarketUpdates = lazy(() => import('@/pages/MarketUpdates'));
export const LazyEconomicEvents = lazy(() => import('@/pages/EconomicEvents'));
export const LazySettings = lazy(() => import('@/pages/Settings'));
export const LazyBilling = lazy(() => import('@/pages/Billing'));
export const LazyNewsAI = lazy(() => import('@/pages/NewsAI'));
export const LazyLearn = lazy(() => import('@/pages/Learn'));
