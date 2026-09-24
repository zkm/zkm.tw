import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab / Shift+Tab focus inside `containerRef` while `active`.
 * The listener lives on the container (not the document) so nested dialogs
 * handle Tab first and stop it from reaching the outer trap.
 */
export const useFocusTrap = (containerRef: RefObject<HTMLElement | null>, active: boolean) => {
    useEffect(() => {
        const container = containerRef.current;
        if (!active || !container) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
                (el) => !el.closest('[inert]') && el.getAttribute('aria-hidden') !== 'true',
            );
            event.stopPropagation();

            if (focusable.length === 0) {
                event.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const current = document.activeElement;

            if (event.shiftKey && (current === first || !container.contains(current))) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (current === last || !container.contains(current))) {
                event.preventDefault();
                first.focus();
            }
        };

        container.addEventListener('keydown', onKeyDown);
        return () => container.removeEventListener('keydown', onKeyDown);
    }, [containerRef, active]);
};
