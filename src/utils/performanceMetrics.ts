
// Runtime performance metrics logger
export const logPerformanceMetrics = () => {
  if (import.meta.env.PROD) {
    // Wait for page load to measure accurately
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          const lcp = performance.getEntriesByType('largest-contentful-paint')[0] as any;

          const ttfb = navigation.responseStart - navigation.requestStart;
          const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
          const lcpTime = lcp?.startTime || 0;

          console.log('📊 Performance Metrics:', {
            TTFB: `${Math.round(ttfb)}ms`,
            FCP: `${Math.round(fcp)}ms`, 
            LCP: `${Math.round(lcpTime)}ms`
          });
        } catch (error) {
          console.warn('Performance metrics unavailable:', error);
        }
      }, 1000);
    });
  }
};
