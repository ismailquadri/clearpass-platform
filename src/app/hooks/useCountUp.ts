import { useEffect, useState } from 'react';

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Starts after an optional `delay` ms.
 */
export function useCountUp(target: number, duration = 1100, delay = 0): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let startTime: number | null = null;
    let frameId: number;

    const timeout = setTimeout(() => {
      const tick = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setValue(Math.round(easeOutQuart(progress) * target));
        if (progress < 1) frameId = requestAnimationFrame(tick);
      };
      frameId = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameId);
    };
  }, [target, duration, delay]);

  return value;
}
