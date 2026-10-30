import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import MilitaryClock, { militaryLetter, zonedTime } from '../components/MilitaryClock';

describe('militaryLetter', () => {
    it('maps whole-hour offsets to letters, skipping J', () => {
        expect(militaryLetter(0)).toBe('Z');
        expect(militaryLetter(-5 * 60)).toBe('R');
        expect(militaryLetter(-6 * 60)).toBe('S');
        expect(militaryLetter(9 * 60)).toBe('I');
        expect(militaryLetter(10 * 60)).toBe('K');
        expect(militaryLetter(-12 * 60)).toBe('Y');
    });

    it('has no letter for offsets that are not whole hours', () => {
        expect(militaryLetter(5.5 * 60)).toBeNull();
    });
});

describe('zonedTime in America/Chicago', () => {
    it('is Romeo (UTC−5) until the fall-back on Nov 1, 2026, then Sierra (UTC−6)', () => {
        expect(zonedTime(new Date('2026-10-30T21:36:00Z'), 'America/Chicago')).toEqual({
            hhmm: '16:36',
            offsetMinutes: -300,
        });
        // 1:59:59 CDT, the last second of daylight time
        expect(zonedTime(new Date('2026-11-01T06:59:59Z'), 'America/Chicago').offsetMinutes).toBe(
            -300,
        );
        // 1:00 CST
        expect(zonedTime(new Date('2026-11-01T07:00:00Z'), 'America/Chicago')).toEqual({
            hhmm: '01:00',
            offsetMinutes: -360,
        });
    });
});

describe('MilitaryClock', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows the time with its letter and moves on with the minute', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-10-30T21:36:30Z'));
        render(<MilitaryClock timeZone="America/Chicago" />);

        expect(screen.getByText('16:36R')).toBeInTheDocument();
        expect(screen.getByText('Local time: 16:36 Romeo time (UTC−5)')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(30_000);
        });
        expect(screen.getByText('16:37R')).toBeInTheDocument();
    });

    it('catches up straight away when a hidden tab is shown again', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-10-30T21:36:00Z'));
        render(<MilitaryClock timeZone="America/Chicago" />);
        expect(screen.getByText('16:36R')).toBeInTheDocument();

        // Hours pass in a background tab without the timers firing
        vi.setSystemTime(new Date('2026-11-02T14:05:00Z'));
        const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
        act(() => {
            document.dispatchEvent(new Event('visibilitychange'));
        });
        visibility.mockRestore();

        expect(screen.getByText('08:05S')).toBeInTheDocument();
    });

    it('switches to Sierra across the fall-back', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-11-01T06:59:30Z'));
        render(<MilitaryClock timeZone="America/Chicago" />);
        expect(screen.getByText('01:59R')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(30_000);
        });
        expect(screen.getByText('01:00S')).toBeInTheDocument();
    });
});
