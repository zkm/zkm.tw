import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * for accessibility compliance (WCAG 2.1 Level AA)
 */
export const usePrefersReducedMotion = (): boolean => {
    // Read synchronously so the very first render already honours the preference
    // (otherwise infinite animations start before the effect can turn them off).
    const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
        () =>
            typeof window !== 'undefined' &&
            !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    );

    useEffect(() => {
        // Check if matchMedia is available (not available in some test environments)
        if (!window.matchMedia) {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        // Listen for changes
        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, []);

    return prefersReducedMotion;
};
