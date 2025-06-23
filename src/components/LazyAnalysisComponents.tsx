
import { lazy, Suspense, memo } from "react";
import { Card } from "@/components/ui/card";

// Lazy load heavy analysis components
const PatternDetection = lazy(() => import("@/components/PatternDetection").then(module => ({ default: module.PatternDetection })));
const TrendAnalysis = lazy(() => import("@/components/TrendAnalysis").then(module => ({ default: module.TrendAnalysis })));
const VolatilityAnalysis = lazy(() => import("@/components/VolatilityAnalysis").then(module => ({ default: module.VolatilityAnalysis })));
const AISuggestions = lazy(() => import("@/components/AISuggestions").then(module => ({ default: module.AISuggestions })));

interface LazyAnalysisComponentsProps {
  asset: string;
  timeframe: string;
}

const AnalysisLoadingSkeleton = () => (
  <Card className="tradeiq-card p-6 rounded-2xl animate-pulse">
    <div className="flex items-center space-x-3 mb-6">
      <div className="h-6 w-6 bg-gray-700 rounded"></div>
      <div className="h-6 w-32 bg-gray-700 rounded"></div>
    </div>
    <div className="space-y-4">
      <div className="h-16 bg-gray-700/30 rounded-xl"></div>
      <div className="h-16 bg-gray-700/30 rounded-xl"></div>
    </div>
  </Card>
);

const LazyAnalysisComponentsComponent = ({ asset, timeframe }: LazyAnalysisComponentsProps) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Suspense fallback={<AnalysisLoadingSkeleton />}>
          <PatternDetection asset={asset} timeframe={timeframe} />
        </Suspense>
        
        <Suspense fallback={<AnalysisLoadingSkeleton />}>
          <TrendAnalysis asset={asset} timeframe={timeframe} />
        </Suspense>
        
        <Suspense fallback={<AnalysisLoadingSkeleton />}>
          <VolatilityAnalysis asset={asset} timeframe={timeframe} />
        </Suspense>
      </div>
      
      <div>
        <Suspense fallback={<AnalysisLoadingSkeleton />}>
          <AISuggestions asset={asset} timeframe={timeframe} />
        </Suspense>
      </div>
    </div>
  );
};

export const LazyAnalysisComponents = memo(LazyAnalysisComponentsComponent, (prevProps, nextProps) => {
  return prevProps.asset === nextProps.asset && prevProps.timeframe === nextProps.timeframe;
});
