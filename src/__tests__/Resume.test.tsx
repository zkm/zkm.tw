import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Resume from '../components/Resume'
import { useResumeData } from '../hooks/useResumeData'
vi.mock('../hooks/useResumeData')

// Mock the Chart.js lazy import
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-chart">Chart</div>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Award: () => <div data-testid="award-icon">Award</div>,
  GraduationCap: () => <div data-testid="graduation-icon">GraduationCap</div>,
  HeartHandshake: () => <div data-testid="heart-icon">HeartHandshake</div>,
  Briefcase: () => <div data-testid="briefcase-icon">Briefcase</div>,
  Code2: () => <div data-testid="code-icon">Code2</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  Phone: () => <div data-testid="phone-icon">Phone</div>,
  Globe: () => <div data-testid="globe-icon">Globe</div>,
  Star: () => <div data-testid="star-icon">Star</div>,
  Book: () => <div data-testid="book-icon">Book</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  Check: () => <div data-testid="check-icon">Check</div>,
}))

const mockResumeData = {
  personalInfo: {
    name: 'John Doe',
    title: 'Software Developer',
    phone: '+1234567890',
    email: 'john@example.com',
    website: 'https://johndoe.com',
    portfolio: 'https://portfolio.johndoe.com',
  },
  summary: 'Experienced software developer with 5 years of experience.',
  technicalSkills: {
    languages: {
      HTML: ['HTML5'],
      CSS: ['CSS3'],
  JavaScript: ['React', 'Node.js'],
  Python: ['Django', 'Flask'],
  PHP: ['Laravel'],
  Other: ['TypeScript'],
    },
    frameworks: ['React', 'Vue.js'],
    cms: ['WordPress'],
    cloud: ['AWS', 'Azure'],
    tools: ['Git', 'Docker'],
    testing: ['Jest', 'Cypress'],
    methodologies: ['Agile', 'Scrum'],
  },
  workExperience: [
    {
      company: 'Tech Corp',
      position: 'Senior Developer',
      period: '2020-Present',
      responsibilities: ['Developed web applications', 'Led team of 3 developers'],
      notableProjects: [
        {
          name: 'E-commerce Platform',
          description: 'Built a scalable e-commerce solution',
          technologies: ['React', 'Node.js', 'MongoDB'],
          impact: 'Increased sales by 30%',
        },
      ],
      honorsAndAwards: [
        {
          award: 'Employee of the Year',
          issuer: 'Tech Corp',
          date: '2022',
          description: 'Outstanding performance and leadership',
        },
      ],
    },
  ],
  education: [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      period: '2016-2020',
    },
  ],
  activitiesAndVolunteer: [
    {
      organization: 'Code for Good',
      role: 'Volunteer Developer',
      period: '2021-Present',
      description: 'Building applications for non-profit organizations',
      notableProjects: [
        {
          name: 'Donation Tracker',
          description: 'Web app to track donations',
          technologies: ['React', 'Firebase'],
          impact: 'Helped raise $50k for charity',
        },
      ],
    },
  ],
  references: [
    {
      name: 'Jane Smith',
      phone: '+1234567890',
      email: 'jane@techcorp.com',
    },
  ],
}

describe('Resume', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(useResumeData).mockReturnValue({
      resumeData: null,
      loading: true,
      error: null,
    })

    render(<Resume />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useResumeData).mockReturnValue({
      resumeData: null,
      loading: false,
      error: 'Failed to load resume data',
    })

    render(<Resume />)
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })

  it('renders resume data when loaded', async () => {
    vi.mocked(useResumeData).mockReturnValue({
      resumeData: mockResumeData,
      loading: false,
      error: null,
    })

    render(<Resume />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Software Developer')).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: /reveal email address/i })[0]).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: /reveal phone number/i })[0]).toBeInTheDocument()
    })
  })

  it('renders work experience section', async () => {
    vi.mocked(useResumeData).mockReturnValue({
      resumeData: mockResumeData,
      loading: false,
      error: null,
    })

    render(<Resume />)

    await waitFor(() => {
      expect(screen.getByText('Work Experience')).toBeInTheDocument()
      expect(screen.getByText('Tech Corp')).toBeInTheDocument()
      expect(screen.getByText('Senior Developer')).toBeInTheDocument()
    })
  })

  it('renders education section', async () => {
    vi.mocked(useResumeData).mockReturnValue({
      resumeData: mockResumeData,
      loading: false,
      error: null,
    })

    render(<Resume />)

    await waitFor(() => {
      expect(screen.getByText('Education')).toBeInTheDocument()
      expect(screen.getByText(/Computer Science \(2016-2020\)/)).toBeInTheDocument()
    })
  })
})
