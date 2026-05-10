import React from 'react';

// Performance monitoring utilities

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private marks: Map<string, number> = new Map();

  addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
  }

  startMark(name: string): void {
    this.marks.set(name, performance.now());
  }

  endMark(name: string, metadata?: Record<string, unknown>): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`Performance mark "${name}" not found`);
      return 0;
    }

    const duration = performance.now() - startTime;
    const metric: PerformanceMetrics = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);
    this.marks.delete(name);

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`, metadata);
    }

    return duration;
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  measureComponentRender(componentName: string): () => void {
    const startMark = `${componentName}-render-start`;
    const endMark = `${componentName}-render-end`;

    performance.mark(startMark);

    return () => {
      performance.mark(endMark);
      performance.measure(componentName, startMark, endMark);

      const measure = performance.getEntriesByName(componentName)[0];
      if (measure) {
        this.metrics.push({
          name: componentName,
          duration: measure.duration,
          timestamp: Date.now(),
        });

        if (import.meta.env.DEV) {
          console.log(`[Render] ${componentName}: ${measure.duration.toFixed(2)}ms`);
        }

        performance.clearMarks(startMark);
        performance.clearMarks(endMark);
        performance.clearMeasures(componentName);
      }
    };
  }

  measureAsyncOperation<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const start = performance.now();

    return fn().finally(() => {
      const duration = performance.now() - start;
      this.metrics.push({
        name,
        duration,
        timestamp: Date.now(),
        metadata,
      });

      if (import.meta.env.DEV) {
        console.log(`[Async] ${name}: ${duration.toFixed(2)}ms`, metadata);
      }
    });
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React DevTools Profiler integration
export function withProfiling<P extends object>(
  componentName: string,
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  if (import.meta.env.PROD) {
    return Component;
  }

  return function ProfiledComponent(props: P) {
    const endMeasure = performanceMonitor.measureComponentRender(componentName);

    try {
      return React.createElement(Component, props);
    } finally {
      endMeasure();
    }
  };
}

// Core Web Vitals monitoring
export function setupCoreWebVitals(): void {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        performanceMonitor.addMetric({
          name: 'LCP',
          duration: lastEntry.startTime,
          timestamp: Date.now(),
        });

        if (import.meta.env.DEV) {
          console.log(`[Web Vital] LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        }
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      console.warn('LCP observer not supported');
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          const fidEntry = entry as any; // TypeScript doesn't have the full type
          performanceMonitor.addMetric({
            name: 'FID',
            duration: fidEntry.processingStart - fidEntry.startTime,
            timestamp: Date.now(),
          });

          if (import.meta.env.DEV) {
            console.log(
              `[Web Vital] FID: ${(fidEntry.processingStart - fidEntry.startTime).toFixed(2)}ms`
            );
          }
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
          }
        }

        performanceMonitor.addMetric({
          name: 'CLS',
          duration: clsValue,
          timestamp: Date.now(),
        });

        if (import.meta.env.DEV) {
          console.log(`[Web Vital] CLS: ${clsValue.toFixed(4)}`);
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch {
      console.warn('CLS observer not supported');
    }
  }
}

// Memory monitoring
export function setupMemoryMonitoring(): void {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return;
  }

  const checkMemory = () => {
    const memory = (performance as any).memory;
    performanceMonitor.addMetric({
      name: 'memory',
      duration: memory.usedJSHeapSize,
      timestamp: Date.now(),
      metadata: {
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        usedPercent: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2),
      },
    });

    if (import.meta.env.DEV) {
      console.log(
        `[Memory] ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB / ${(
          memory.jsHeapSizeLimit /
          1024 /
          1024
        ).toFixed(2)}MB (${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2)}%)`
      );
    }
  };

  // Check memory every 30 seconds
  setInterval(checkMemory, 30000);
  checkMemory(); // Initial check
}
