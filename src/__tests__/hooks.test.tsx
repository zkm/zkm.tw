import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useProfileData } from '../hooks/useProfileData';
import { useResumeData } from '../hooks/useResumeData';

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

// Module level, not inside describe(): a component defined inside a function is a new
// component on every call (Biome lint/correctness/noComponentHookFactories).
const FocusTrapHarness = ({ active }: { active: boolean }) => {
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

describe('useFocusTrap', () => {
    it('wraps Tab from the last element to the first', async () => {
        const user = userEvent.setup();
        render(<FocusTrapHarness active />);
        screen.getByText('last').focus();
        await user.tab();
        expect(screen.getByText('first')).toHaveFocus();
    });

    it('wraps Shift+Tab from the first element to the last', async () => {
        const user = userEvent.setup();
        render(<FocusTrapHarness active />);
        screen.getByText('first').focus();
        await user.tab({ shift: true });
        expect(screen.getByText('last')).toHaveFocus();
    });

    it('does nothing when inactive', async () => {
        const user = userEvent.setup();
        render(<FocusTrapHarness active={false} />);
        screen.getByText('last').focus();
        await user.tab();
        expect(screen.getByText('last')).not.toHaveFocus();
    });
});

const mockFetch = (impl: () => Promise<Partial<Response>>) => {
    const fetchMock = vi.fn(impl);
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
};

const jsonResponse = (body: unknown, status = 200): Promise<Partial<Response>> =>
    Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(body),
    });

describe('useResumeData', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('loads /data/resume.json', async () => {
        const resume = { personalInfo: { name: 'Zach Schneider' } };
        const fetchMock = mockFetch(() => jsonResponse(resume));
        const { result } = renderHook(() => useResumeData());

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(fetchMock).toHaveBeenCalledWith('/data/resume.json');
        expect(result.current.resumeData).toEqual(resume);
        expect(result.current.error).toBeNull();
    });

    it('reports the HTTP status when the response is not ok', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        mockFetch(() => jsonResponse({}, 404));
        const { result } = renderHook(() => useResumeData());

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe('Failed to fetch resume data: 404');
        expect(result.current.resumeData).toBeNull();
    });

    it('falls back to a generic message when the rejection is not an Error', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        mockFetch(() => Promise.reject('offline'));
        const { result } = renderHook(() => useResumeData());

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe('Failed to load resume data');
    });
});

describe('useProfileData', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('loads /data/profile.json', async () => {
        const profile = { profile: { name: 'Zach Schneider' } };
        const fetchMock = mockFetch(() => jsonResponse(profile));
        const { result } = renderHook(() => useProfileData());

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(fetchMock).toHaveBeenCalledWith('/data/profile.json');
        expect(result.current.data).toEqual(profile);
        expect(result.current.error).toBeNull();
    });

    it('reports an error when the response is not ok', async () => {
        mockFetch(() => jsonResponse({}, 500));
        const { result } = renderHook(() => useProfileData());

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe('Failed to fetch profile data');
        expect(result.current.data).toBeNull();
    });
});
