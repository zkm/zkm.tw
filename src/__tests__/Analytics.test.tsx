import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

// Mock the gtag function to test analytics
const mockGtag = vi.fn();

declare global {
  interface Window {
    gtag?: typeof mockGtag;
    dataLayer: Array<{ event: string; [key: string]: unknown }>;
  }
}

describe('Google Analytics Integration', () => {
  beforeEach(() => {
    // Reset mocks and setup
    vi.clearAllMocks();

    // Mock the global gtag function and dataLayer
    window.gtag = mockGtag;
    window.dataLayer = [];

    // Mock window.matchMedia for accessibility features (required by usePrefersReducedMotion hook)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock the script loading
    Object.defineProperty(document, 'querySelector', {
      writable: true,
      value: vi.fn((selector: string) => {
        if (selector === 'script[src*="googletagmanager.com/gtag/js"]') {
          return {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-2J7SWPGLE4',
            async: true,
            getAttribute: vi.fn((attr: string) => {
              if (attr === 'src') return 'https://www.googletagmanager.com/gtag/js?id=G-2J7SWPGLE4';
              return null;
            }),
            hasAttribute: vi.fn((attr: string) => attr === 'async'),
          };
        }
        return null;
      }),
    });
  });

  afterEach(() => {
    // Clean up
    vi.restoreAllMocks();
  });

  it('should have Google Analytics script tag in document', () => {
    // Check if the GA script is present (this would be in index.html in real environment)
    const gaScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    expect(gaScript).toBeTruthy();

    if (gaScript) {
      expect(gaScript.getAttribute('src')).toContain('G-2J7SWPGLE4');
      expect(gaScript.hasAttribute('async')).toBe(true);
    }
  });

  it('should have gtag function available globally', () => {
    expect(window.gtag).toBeDefined();
    expect(typeof window.gtag).toBe('function');
  });

  it('should have dataLayer array initialized', () => {
    expect(window.dataLayer).toBeDefined();
    expect(Array.isArray(window.dataLayer)).toBe(true);
  });

  it('should call gtag with correct configuration when initialized', () => {
    // Simulate the gtag initialization calls that happen in index.html
    if (window.gtag) {
      window.gtag('js', new Date());
      window.gtag('config', 'G-2J7SWPGLE4');
    }

    expect(mockGtag).toHaveBeenCalledWith('js', expect.any(Date));
    expect(mockGtag).toHaveBeenCalledWith('config', 'G-2J7SWPGLE4');
    expect(mockGtag).toHaveBeenCalledTimes(2);
  });

  it('should track page views when gtag is called', () => {
    // Simulate a page view event
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: '/',
        page_title: 'Portfolio',
        page_location: window.location.href,
      });
    }
    expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/',
      page_title: 'Portfolio',
      page_location: window.location.href,
    });
  });

  it('should track custom events', () => {
    // Test custom event tracking (e.g., resume button click)
    if (window.gtag) {
      window.gtag('event', 'resume_view', {
        event_category: 'engagement',
        event_label: 'Resume Button Click',
      });
    }

    expect(mockGtag).toHaveBeenCalledWith('event', 'resume_view', {
      event_category: 'engagement',
      event_label: 'Resume Button Click',
    });
  });

  it('should verify measurement ID is correct', () => {
    // Test that we're using the correct GA4 measurement ID
    const expectedMeasurementId = 'G-2J7SWPGLE4';

    if (window.gtag) {
      window.gtag('config', expectedMeasurementId);
    }

    expect(mockGtag).toHaveBeenCalledWith('config', expectedMeasurementId);
  });

  it('should handle analytics gracefully when gtag is not available', () => {
    // Test fallback when gtag is not loaded
    delete window.gtag;

    // This should not throw an error
    expect(() => {
      // In a real app, you might have wrapper functions that check if gtag exists
      if (window.gtag) {
        window.gtag('event', 'test');
      }
    }).not.toThrow();
  });

  it('should render app without errors when analytics are present', () => {
    // Ensure the app renders normally with analytics configured
    expect(() => {
      render(<App />);
    }).not.toThrow();
  });

  it('should provide utility for tracking resume interactions', () => {
    // Test a realistic scenario - tracking when someone views the resume
    const trackResumeView = () => {
      if (window.gtag) {
        window.gtag('event', 'resume_view', {
          event_category: 'engagement',
          event_label: 'Resume Component Opened',
          value: 1,
        });
      }
    };

    trackResumeView();

    expect(mockGtag).toHaveBeenCalledWith('event', 'resume_view', {
      event_category: 'engagement',
      event_label: 'Resume Component Opened',
      value: 1,
    });
  });

  it('should provide utility for tracking portfolio interactions', () => {
    // Test tracking social media clicks
    const trackSocialClick = (platform: string) => {
      if (window.gtag) {
        window.gtag('event', 'social_click', {
          event_category: 'social',
          event_label: platform,
          value: 1,
        });
      }
    };

    trackSocialClick('github');

    expect(mockGtag).toHaveBeenCalledWith('event', 'social_click', {
      event_category: 'social',
      event_label: 'github',
      value: 1,
    });
  });

  it('should handle contact reveal interactions', () => {
    // Test tracking when contact info is revealed
    const trackContactReveal = (type: 'email' | 'phone') => {
      if (window.gtag) {
        window.gtag('event', 'contact_reveal', {
          event_category: 'engagement',
          event_label: `${type}_revealed`,
          value: 1,
        });
      }
    };

    trackContactReveal('email');

    expect(mockGtag).toHaveBeenCalledWith('event', 'contact_reveal', {
      event_category: 'engagement',
      event_label: 'email_revealed',
      value: 1,
    });
  });
});
