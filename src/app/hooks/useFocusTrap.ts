import { useEffect, useRef } from 'react';

/**
 * Custom hook to trap focus within a modal or dialog
 * Ensures keyboard users can't tab outside the modal
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the currently focused element before opening the modal
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus the first element when modal opens
    if (firstFocusable) {
      firstFocusable.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      // If shift + tab on first element, move to last
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
      // If tab on last element, move to first
      else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    };

    // Add tab key listener
    document.addEventListener('keydown', handleTabKey);

    // Cleanup: restore focus to previous element when modal closes
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      previousActiveElementRef.current?.focus();
    };
  }, [isActive]);

  return containerRef;
}