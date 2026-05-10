import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

// Parse sampling rates from environment variables
const TRACES_SAMPLE_RATE = parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1');
const REPLAY_SESSION_SAMPLE_RATE = parseFloat(import.meta.env.VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE || '0.1');
const REPLAY_ERROR_SAMPLE_RATE = parseFloat(import.meta.env.VITE_SENTRY_REPLAY_ERROR_SAMPLE_RATE || '1.0');

// Only initialize Sentry if DSN is provided
if (SENTRY_DSN && SENTRY_DSN !== 'https://examplePublicKey@o0.ingest.sentry.io/0') {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: APP_ENV,
    release: `clearpass@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Set tracesSampleRate based on environment
    tracesSampleRate: APP_ENV === 'production' ? TRACES_SAMPLE_RATE : 1.0,

    // Capture Replay sessions
    replaysSessionSampleRate: APP_ENV === 'production' ? REPLAY_SESSION_SAMPLE_RATE : 1.0,

    // Capture Replay on errors
    replaysOnErrorSampleRate: REPLAY_ERROR_SAMPLE_RATE,

    // Filter out sensitive data and add environment-specific behavior
    beforeSend(event, hint) {
      // Remove sensitive data from headers
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
        delete event.request.headers['x-api-key'];
      }

      // Filter out localhost errors in production
      if (APP_ENV === 'production' && event.request?.url?.includes('localhost')) {
        return null;
      }

      // Add additional context in development
      if (APP_ENV === 'development') {
        console.error('Sentry Error:', event, hint);
      }

      return event;
    },

    // Performance monitoring
    beforeSendTransaction(event) {
      // Filter out certain transactions
      if (event.transaction?.includes('health')) {
        return null;
      }

      return event;
    },

    // Ignore specific errors
    ignoreErrors: [
      // Network errors that are not actionable
      /Network Error/i,
      /Failed to fetch/i,
      // ResizeObserver errors (often benign)
      /ResizeObserver loop limit exceeded/i,
    ],

    // Deny specific URLs
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
    ],
  });
}

export * from '@sentry/react';