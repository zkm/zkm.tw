import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useFocusTrap } from '../hooks/useFocusTrap';

const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
        })),
    });
};

describe('usePrefersReducedMotion', () => {
    afterEach(() => {
        Reflect.deleteProperty(window, 'matchMedia');
    });

    it('returns the preference on the very first render (before effects run)', () => {
        mockMatchMedia(true);
        const seen: boolean[] = [];
        renderHook(() => {
            const value = usePrefersReducedMotion();
            seen.push(value);
            return value;
        });
        expect(seen[0]).toBe(true);
    });

    it('defaults to false when matchMedia is unavailable', () => {
        Reflect.deleteProperty(window, 'matchMedia');
        const { result } = renderHook(() => usePrefersReducedMotion());
        expect(result.current).toBe(false);
    });
});

describe('useFocusTrap', () => {
    const Harness = ({ active }: { active: boolean }) => {
        const ref = useRef<HTMLDivElement | null>(null);
        useFocusTrap(ref, active);
        return (
            <div>
                <button type="button">outside</button>
                <div ref={ref}>
                    <button type="button">first</button>
                    <button type="button">last</button>
                </div>
            </div>
        );
    };

    it('wraps Tab from the last element to the first', async () => {
        const user = userEvent.setup();
        render(<Harness active />);
        screen.getByText('last').focus();
        await user.tab();
        expect(screen.getByText('first')).toHaveFocus();
    });

    it('wraps Shift+Tab from the first element to the last', async () => {
        const user = userEvent.setup();
        render(<Harness active />);
        screen.getByText('first').focus();
        await user.tab({ shift: true });
        expect(screen.getByText('last')).toHaveFocus();
    });

    it('does nothing when inactive', async () => {
        const user = userEvent.setup();
        render(<Harness active={false} />);
        screen.getByText('last').focus();
        await user.tab();
        expect(screen.getByText('last')).not.toHaveFocus();
    });
});
