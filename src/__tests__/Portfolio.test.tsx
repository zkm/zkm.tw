import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Portfolio from '../components/Portfolio'
import { useProfileData } from '../hooks/useProfileData'

// Mock the useProfileData hook
vi.mock('../hooks/useProfileData')

// framer-motion is globally mocked in test-setup.ts

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Github: () => <div data-testid="github-icon">Github</div>,
  Linkedin: () => <div data-testid="linkedin-icon">Linkedin</div>,
  Instagram: () => <div data-testid="instagram-icon">Instagram</div>,
  FileText: () => <div data-testid="file-text-icon">FileText</div>,
}))

// Mock Resume component
vi.mock('./Resume', () => ({
  default: () => <div data-testid="resume-component">Resume Component</div>,
}))

const mockProfileData = {
  name: 'John Doe',
  title: 'Software Developer',
  bio: 'Passionate developer with 5 years of experience',
  profileImage: '/images/profile.jpg',
  backgroundImage: '/images/background.jpg',
  socialLinks: [
    {
      platform: 'github',
      url: 'https://github.com/johndoe',
      username: 'johndoe',
      icon: 'github',
      display: true,
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/johndoe',
      username: 'johndoe',
      icon: 'linkedin',
      display: true,
    },
  ],
  profile: {
    name: 'John Doe',
    title: 'Software Developer',
    tagline: 'Passionate developer with 5 years of experience',
    image: '/images/profile.jpg',
  },
  resume: { enabled: true },
  contact: { cta: 'Contact me', message: 'Feel free to reach out for collaboration!' },
}

describe('Portfolio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(useProfileData).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    })

  render(<Portfolio />)
  // Check for spinner by role or class
  expect(document.querySelector('.w-8.h-8.border-2.border-white.border-t-transparent.rounded-full')).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useProfileData).mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to load profile data',
    })

  render(<Portfolio />)
  expect(screen.getByText('Oops!')).toBeInTheDocument()
  expect(screen.getByText('Failed to load profile data')).toBeInTheDocument()
  })

  it('renders portfolio data when loaded', async () => {
    vi.mocked(useProfileData).mockReturnValue({
      data: mockProfileData,
      loading: false,
      error: null,
    })

    render(<Portfolio />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Software Developer')).toBeInTheDocument()
      expect(screen.getByText('Passionate developer with 5 years of experience')).toBeInTheDocument()
    })
  })

  it('renders social links', async () => {
    vi.mocked(useProfileData).mockReturnValue({
      data: mockProfileData,
      loading: false,
      error: null,
    })

    render(<Portfolio />)

    await waitFor(() => {
      expect(screen.getByTestId('github-icon')).toBeInTheDocument()
      expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument()
    })
  })

  it('shows portfolio view by default', async () => {
    vi.mocked(useProfileData).mockReturnValue({
      data: mockProfileData,
      loading: false,
      error: null,
    })

    render(<Portfolio />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByTestId('resume-component')).not.toBeInTheDocument()
    })
  })
})
