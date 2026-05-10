// Route prefetching utility

let prefetchObserver: IntersectionObserver | null = null;
let prefetchedRoutes = new Set<string>();

/**
 * Prefetch a route when it comes into viewport or on idle
 */
export function prefetchRoute(href: string): void {
  if (prefetchedRoutes.has(href)) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  link.as = 'document';
  document.head.appendChild(link);

  prefetchedRoutes.add(href);
}

/**
 * Prefetch multiple routes when user is idle
 */
export function prefetchRoutesOnIdle(routes: string[], threshold = 2000): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(
      () => {
        routes.forEach((route) => prefetchRoute(route));
      },
      { timeout: threshold }
    );
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      routes.forEach((route) => prefetchRoute(route));
    }, threshold);
  }
}

/**
 * Set up intersection observer for prefetching links when they come into viewport
 */
export function setupLinkPrefetching(): void {
  if (prefetchObserver) return;

  prefetchObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          if (link.href && !prefetchedRoutes.has(link.href)) {
            prefetchRoute(link.href);
          }
        }
      });
    },
    {
      rootMargin: '100px', // Start prefetching when link is 100px from viewport
    }
  );

  // Add data-prefetch attribute to links that should be prefetched
  document.querySelectorAll('a[data-prefetch="true"]').forEach((link) => {
    prefetchObserver?.observe(link);
  });
}

/**
 * Prefetch likely next routes based on current route
 */
export function prefetchLikelyRoutes(currentRoute: string): void {
  const routePrefetchMap: Record<string, string[]> = {
    '/': ['/certificates', '/alerts'],
    '/certificates': ['/alerts', '/reports'],
    '/alerts': ['/certificates', '/reports'],
    '/mda/verify': ['/mda/prequalification'],
    '/mda/prequalification': ['/mda/verify'],
    '/partner/clients': ['/partner/analytics'],
    '/partner/analytics': ['/partner/clients'],
  };

  const likelyRoutes = routePrefetchMap[currentRoute] || [];
  if (likelyRoutes.length > 0) {
    prefetchRoutesOnIdle(likelyRoutes);
  }
}

/**
 * Preload critical JavaScript chunks
 */
export function preloadCriticalChunks(chunks: string[]): void {
  chunks.forEach((chunk) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = chunk;
    link.as = 'script';
    document.head.appendChild(link);
  });
}

/**
 * Clean up prefetch resources
 */
export function cleanupPrefetch(): void {
  if (prefetchObserver) {
    prefetchObserver.disconnect();
    prefetchObserver = null;
  }
  prefetchedRoutes.clear();
}