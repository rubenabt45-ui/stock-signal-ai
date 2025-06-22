
// Performance monitoring utilities for debugging and optimization
import React from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private renderTimers: Map<string, number> = new Map();

  startRender(componentName: string) {
    this.renderTimers.set(componentName, performance.now());
  }

  endRender(componentName: string) {
    const startTime = this.renderTimers.get(componentName);
    if (startTime) {
      const renderTime = performance.now() - startTime;
      this.metrics.push({
        componentName,
        renderTime,
        timestamp: Date.now()
      });
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 100) {
        console.warn(`🐌 Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
      
      this.renderTimers.delete(componentName);
      
      // Keep only recent metrics (last 50)
      if (this.metrics.length > 50) {
        this.metrics.shift();
      }
    }
  }

  getSlowComponents(threshold = 50): PerformanceMetrics[] {
    return this.metrics.filter(metric => metric.renderTime > threshold);
  }

  getAverageRenderTime(componentName: string): number {
    const componentMetrics = this.metrics.filter(m => m.componentName === componentName);
    if (componentMetrics.length === 0) return 0;
    
    const total = componentMetrics.reduce((sum, m) => sum + m.renderTime, 0);
    return total / componentMetrics.length;
  }

  logPerformanceReport() {
    if (process.env.NODE_ENV !== 'development') return;
    
    console.group('📊 Performance Report');
    
    const uniqueComponents = [...new Set(this.metrics.map(m => m.componentName))];
    uniqueComponents.forEach(componentName => {
      const avg = this.getAverageRenderTime(componentName);
      const count = this.metrics.filter(m => m.componentName === componentName).length;
      console.log(`${componentName}: ${avg.toFixed(2)}ms avg (${count} renders)`);
    });
    
    const slowComponents = this.getSlowComponents();
    if (slowComponents.length > 0) {
      console.warn('🐌 Slow components:', slowComponents);
    }
    
    console.groupEnd();
  }

  // Memory usage monitoring
  logMemoryUsage() {
    if (process.env.NODE_ENV !== 'development') return;
    
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('💾 Memory Usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React hook for easy performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const startRender = () => performanceMonitor.startRender(componentName);
  const endRender = () => performanceMonitor.endRender(componentName);
  
  return { startRender, endRender };
};

// HOC for automatic performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const MonitoredComponent = (props: P) => {
    performanceMonitor.startRender(displayName);
    
    React.useLayoutEffect(() => {
      performanceMonitor.endRender(displayName);
    });
    
    return React.createElement(WrappedComponent, props);
  };
  
  MonitoredComponent.displayName = `withPerformanceMonitoring(${displayName})`;
  return MonitoredComponent;
};
