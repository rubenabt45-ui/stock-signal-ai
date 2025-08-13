
import { logger } from './logger';

// Core Web Vitals measurement utility
export const measurePerformance = () => {
  // Only measure in production
  if (!import.meta.env.PROD) return;

  try {
    // Measure Time to First Byte (TTFB)
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          const ttfb = navEntry.responseStart - navEntry.requestStart;
          logger.info(`⚡ TTFB: ${Math.round(ttfb)}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });

    // Measure First Contentful Paint (FCP) and Largest Contentful Paint (LCP)
    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          logger.info(`🎨 FCP: ${Math.round(entry.startTime)}ms`);
        }
      });
    });

    paintObserver.observe({ entryTypes: ['paint'] });

    // LCP measurement
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        logger.info(`🖼️ LCP: ${Math.round(lastEntry.startTime)}ms`);
      }
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  } catch (error) {
    // Silently fail if Performance Observer is not supported
  }
};

// Preconnect to external domains for faster loading
export const setupPreconnections = () => {
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://s3.tradingview.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
};
