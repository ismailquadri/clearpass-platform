# Critical CSS Inlining - Future Optimization

## Current Status
- Not implemented - requires build-time tooling
- Current CSS size: 49KB gzipped
- Benefits would be minimal at current size

## Implementation Requirements
To implement critical CSS inlining, you would need:

1. **Install Plugin**: `npm install --save-dev vite-plugin-critical-css`
2. **Configure Vite**: Add plugin to vite.config.ts
3. **Define Critical CSS**: Manually identify above-fold styles
4. **Extract and Inline**: Plugin extracts critical CSS and inlines in HTML
5. **Load Remaining CSS**: Async load non-critical CSS

## Example Configuration
```typescript
import critical from 'vite-plugin-critical-css';

export default defineConfig({
  plugins: [
    critical({
      criticalUrl: 'http://localhost:5173',
      criticalBase: 'dist/',
      criticalPages: [{ uri: 'index.html' }],
      preload: true,
      minify: true,
    }),
  ],
});
```

## When to Implement
- When CSS size grows above 100KB
- When Lighthouse shows significant "Reduce unused CSS" warnings
- When above-fold content rendering is identified as bottleneck

## Alternative Approaches
1. **CSS Code Splitting**: Split CSS by route
2. **PurgeCSS**: Remove unused CSS (Tailwind already handles this)
3. **Inline Small CSS**: Inline CSS files < 2KB directly

## Recommendation
For current project size, focus on other optimizations first. Revisit when CSS grows significantly.