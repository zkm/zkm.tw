import type React from 'react';
import { useEffect, useState } from 'react';

// Military time-zone letters by whole-hour UTC offset. J is skipped (it means "local time").
const EAST = 'ABCDEFGHIKLM'; // UTC+1 … UTC+12
const WEST = 'NOPQRSTUVWXY'; // UTC−1 … UTC−12
const NAMES: Record<string, string> = {
    A: 'Alpha',
    B: 'Bravo',
    C: 'Charlie',
    D: 'Delta',
    E: 'Echo',
    F: 'Foxtrot',
    G: 'Golf',
    H: 'Hotel',
    I: 'India',
    K: 'Kilo',
    L: 'Lima',
    M: 'Mike',
    N: 'November',
    O: 'Oscar',
    P: 'Papa',
    Q: 'Quebec',
    R: 'Romeo',
    S: 'Sierra',
    T: 'Tango',
    U: 'Uniform',
    V: 'Victor',
    W: 'Whiskey',
    X: 'X-ray',
    Y: 'Yankee',
    Z: 'Zulu',
};

/** The military letter for a UTC offset in minutes, or null for offsets that aren't whole hours. */
export function militaryLetter(offsetMinutes: number): string | null {
    if (offsetMinutes % 60 !== 0) return null;
    const hours = offsetMinutes / 60;
    if (hours === 0) return 'Z';
    if (hours >= 1 && hours <= 12) return EAST[hours - 1];
    if (hours <= -1 && hours >= -12) return WEST[-hours - 1];
    return null;
}

/** Local time and UTC offset in an IANA time zone, from the browser's own zone data. */
export function zonedTime(date: Date, timeZone: string) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZoneName: 'shortOffset',
    }).formatToParts(date);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';

    // shortOffset reads "GMT", "GMT-5" or "GMT+5:30"
    const match = get('timeZoneName').match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    const offsetMinutes = match
        ? (match[1] === '-' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] ?? 0))
        : 0;

    return { hhmm: `${get('hour')}:${get('minute')}`, offsetMinutes };
}

function describeOffset(offsetMinutes: number) {
    if (offsetMinutes === 0) return 'UTC';
    const sign = offsetMinutes < 0 ? '−' : '+';
    const abs = Math.abs(offsetMinutes);
    const minutes = abs % 60 ? `:${String(abs % 60).padStart(2, '0')}` : '';
    return `UTC${sign}${Math.floor(abs / 60)}${minutes}`;
}

/** "16:36R": the time in `timeZone` with its military letter, updated on each minute. */
const MilitaryClock: React.FC<{ timeZone: string }> = ({ timeZone }) => {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        const tick = () => setNow(new Date());
        // Line up with the minute, then tick once a minute
        const timeout = setTimeout(
            () => {
                tick();
                interval = setInterval(tick, 60_000);
            },
            60_000 - (Date.now() % 60_000),
        );
        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, []);

    const { hhmm, offsetMinutes } = zonedTime(now, timeZone);
    const letter = militaryLetter(offsetMinutes);
    const offset = describeOffset(offsetMinutes);
    const label = letter ? `${hhmm} ${NAMES[letter]} time (${offset})` : `${hhmm} (${offset})`;

    return (
        <time dateTime={now.toISOString()} title={label}>
            <span aria-hidden="true">
                {hhmm}
                {letter ?? ` ${offset}`}
            </span>
            <span className="sr-only">Local time: {label}</span>
        </time>
    );
};

export default MilitaryClock;
