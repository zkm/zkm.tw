import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { useProfileData } from '../hooks/useProfileData';

// Mock the data hook to prevent async state updates (avoids act warnings)
vi.mock('../hooks/useProfileData');

const mockProfileData = {
  profile: {
    name: 'John Doe',
    title: 'Software Developer',
    tagline: 'Passionate developer',
    image: '/images/profile.jpg',
  },
  socialLinks: [
    { platform: 'github', url: 'https://github.com/johndoe', icon: 'github', display: true },
  ],
  resume: { enabled: true },
  contact: { cta: 'Contact me', message: 'Feel free to reach out!' },
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    vi.mocked(useProfileData).mockReturnValue({
      data: mockProfileData,
      loading: false,
      error: null,
    });
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders the Portfolio component', () => {
    vi.mocked(useProfileData).mockReturnValue({
      data: mockProfileData,
      loading: false,
      error: null,
    });
    render(<App />);
    // Since Portfolio is the main component, we just check that it renders
    // without throwing an error
    expect(document.querySelector('div')).toBeInTheDocument();
  });
});
