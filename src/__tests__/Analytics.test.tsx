import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';
import indexHtml from '../../index.html?raw';
import analyticsScript from '../../public/analytics.js?raw';

const MEASUREMENT_ID = 'G-2J7SWPGLE4';

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

// Runs the real public/analytics.js against jsdom's window.
const runAnalyticsScript = () => {
    new Function(analyticsScript)();
};

describe('Google Analytics integration', () => {
    beforeEach(() => {
        delete window.gtag;
        delete window.dataLayer;
    });

    describe('index.html', () => {
        it('loads the gtag.js library asynchronously with the correct measurement ID', () => {
            const doc = new DOMParser().parseFromString(indexHtml, 'text/html');
            const script = doc.querySelector('script[src*="googletagmanager.com/gtag/js"]');

            expect(script).not.toBeNull();
            expect(script?.getAttribute('src')).toContain(`id=${MEASUREMENT_ID}`);
            expect(script?.hasAttribute('async')).toBe(true);
        });

        it('loads the local analytics.js initialiser', () => {
            const doc = new DOMParser().parseFromString(indexHtml, 'text/html');
            expect(doc.querySelector('script[src="/analytics.js"]')).not.toBeNull();
        });

        it('does not rely on inline scripts or handlers blocked by the CSP', () => {
            const doc = new DOMParser().parseFromString(indexHtml, 'text/html');
            const inlineScripts = Array.from(doc.querySelectorAll('script:not([src])'));
            expect(inlineScripts).toHaveLength(0);
            expect(doc.querySelectorAll('[onload], [onclick], [onerror]')).toHaveLength(0);
        });
    });

    describe('public/analytics.js', () => {
        it('defines gtag and dataLayer when none exist', () => {
            runAnalyticsScript();

            expect(typeof window.gtag).toBe('function');
            expect(Array.isArray(window.dataLayer)).toBe(true);
        });

        it('queues a js call and a config call for the correct measurement ID', () => {
            runAnalyticsScript();

            // gtag pushes its `arguments` object, so normalise to arrays for comparison.
            const calls = (window.dataLayer ?? []).map((entry) =>
                Array.from(entry as ArrayLike<unknown>),
            );

            expect(calls[0][0]).toBe('js');
            expect(calls[0][1]).toBeInstanceOf(Date);
            expect(calls[1]).toEqual(['config', MEASUREMENT_ID, { anonymize_ip: true }]);
        });

        it('keeps an existing gtag and dataLayer instead of replacing them', () => {
            const existingLayer: unknown[] = [];
            const existingGtag = () => {};
            window.dataLayer = existingLayer;
            window.gtag = existingGtag;

            runAnalyticsScript();

            expect(window.gtag).toBe(existingGtag);
            expect(window.dataLayer).toBe(existingLayer);
        });
    });

    it('renders the app without errors when analytics are present', () => {
        runAnalyticsScript();
        expect(() => render(<App />)).not.toThrow();
    });

    it('renders the app without errors when gtag is not available', () => {
        expect(window.gtag).toBeUndefined();
        expect(() => render(<App />)).not.toThrow();
    });
});
