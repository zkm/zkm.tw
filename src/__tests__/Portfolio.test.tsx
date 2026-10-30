import { act, render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Portfolio from '../components/Portfolio';
import { useProfileData } from '../hooks/useProfileData';

// Mock the useProfileData hook
vi.mock('../hooks/useProfileData', () => ({
    useProfileData: vi.fn(),
}));

// framer-motion is globally mocked in test-setup.ts

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Github: () => <div data-testid="github-icon">Github</div>,
    Linkedin: () => <div data-testid="linkedin-icon">Linkedin</div>,
    Instagram: () => <div data-testid="instagram-icon">Instagram</div>,
    FileText: () => <div data-testid="file-text-icon">FileText</div>,
    MessageCircle: () => <div data-testid="message-circle-icon">MessageCircle</div>,
    X: () => <div data-testid="x-icon">X</div>,
    Send: () => <div data-testid="send-icon">Send</div>,
    User: () => <div data-testid="user-icon">User</div>,
    Bot: () => <div data-testid="bot-icon">Bot</div>,
}));

// Mock Resume component (the path is relative to this file, so it names the component's module)
vi.mock('../components/Resume', () => ({
    default: () => <div data-testid="resume-component">Resume Component</div>,
}));

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
};

describe('Portfolio', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state', () => {
        vi.mocked(useProfileData).mockReturnValue({
            data: null,
            loading: true,
            error: null,
        });

        render(<Portfolio />);
        // Check for spinner by role
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders error state', () => {
        vi.mocked(useProfileData).mockReturnValue({
            data: null,
            loading: false,
            error: 'Failed to load profile data',
        });

        render(<Portfolio />);
        expect(screen.getByText('Data unavailable')).toBeInTheDocument();
        expect(screen.getByText('Failed to load profile data.')).toBeInTheDocument();
    });

    it('renders portfolio data when loaded', async () => {
        vi.mocked(useProfileData).mockReturnValue({
            data: mockProfileData,
            loading: false,
            error: null,
        });

        render(<Portfolio />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
            expect(screen.getByText('Software Developer')).toBeInTheDocument();
            expect(
                screen.getByText('Passionate developer with 5 years of experience'),
            ).toBeInTheDocument();
        });
    });

    it('renders social links', async () => {
        vi.mocked(useProfileData).mockReturnValue({
            data: mockProfileData,
            loading: false,
            error: null,
        });

        render(<Portfolio />);

        await waitFor(() => {
            // Check for social links by their aria-labels
            expect(screen.getByLabelText(/github.*opens in new window/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/linkedin.*opens in new window/i)).toBeInTheDocument();
        });
    });

    it('shows portfolio view by default', async () => {
        vi.mocked(useProfileData).mockReturnValue({
            data: mockProfileData,
            loading: false,
            error: null,
        });

        render(<Portfolio />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
            expect(screen.queryByTestId('resume-component')).not.toBeInTheDocument();
        });
    });

    it('shows the initials placeholder when the profile image fails to load', async () => {
        vi.mocked(useProfileData).mockReturnValue({
            data: mockProfileData,
            loading: false,
            error: null,
        });

        render(<Portfolio />);

        const image = await screen.findByAltText('John Doe');
        const picture = image.closest('picture') as HTMLElement;
        const placeholder = screen.getByText('ZS');

        fireEvent.error(image);

        expect(picture.style.display).toBe('none');
        expect(placeholder.style.display).toBe('flex');
    });
});

describe('Portfolio resume dialog and browser history', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useProfileData).mockReturnValue({
            data: mockProfileData,
            loading: false,
            error: null,
        });
        window.history.replaceState(null, '', '/');
    });

    const openResume = async () => {
        fireEvent.click(await screen.findByRole('button', { name: /view resume/i }));
        return screen.getByRole('dialog', { name: 'Resume' });
    };

    it('adds a #resume history entry when the resume opens', async () => {
        render(<Portfolio />);
        await openResume();

        expect(window.location.hash).toBe('#resume');
        expect(window.history.state).toEqual({ resume: true });
    });

    it('closes the resume on Back instead of leaving the page', async () => {
        render(<Portfolio />);
        await openResume();

        act(() => window.history.back());

        await waitFor(() =>
            expect(screen.queryByRole('dialog', { name: 'Resume' })).not.toBeInTheDocument(),
        );
        expect(window.location.hash).toBe('');
        expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
    });

    it('steps back out of the #resume entry when the close button is used', async () => {
        render(<Portfolio />);
        await openResume();

        fireEvent.click(screen.getByRole('button', { name: 'Close resume' }));

        await waitFor(() =>
            expect(screen.queryByRole('dialog', { name: 'Resume' })).not.toBeInTheDocument(),
        );
        expect(window.location.hash).toBe('');
        expect(window.history.state).toBeNull();
    });

    it('closes the Say Hello dialog on Back without changing the URL', async () => {
        render(<Portfolio />);
        fireEvent.click(await screen.findByRole('button', { name: 'Say Hello' }));
        expect(screen.getByRole('dialog', { name: 'Say Hello' })).toBeInTheDocument();
        expect(window.history.state).toEqual({ contact: true });
        expect(window.location.hash).toBe('');

        act(() => window.history.back());

        await waitFor(() =>
            expect(screen.queryByRole('dialog', { name: 'Say Hello' })).not.toBeInTheDocument(),
        );
    });

    it('opens the resume when the hash changes to #resume on the page', async () => {
        render(<Portfolio />);
        await screen.findByRole('heading', { name: 'John Doe' });

        act(() => {
            window.location.hash = '#resume';
        });

        expect(await screen.findByRole('dialog', { name: 'Resume' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Close resume' }));
        await waitFor(() =>
            expect(screen.queryByRole('dialog', { name: 'Resume' })).not.toBeInTheDocument(),
        );
        expect(window.location.hash).toBe('');
    });

    it('ignores a #resume link when the resume is disabled', async () => {
        vi.mocked(useProfileData).mockReturnValue({
            data: { ...mockProfileData, resume: { enabled: false } },
            loading: false,
            error: null,
        });
        window.history.replaceState(null, '', '/#resume');
        render(<Portfolio />);

        await screen.findByRole('heading', { name: 'John Doe' });
        expect(screen.queryByRole('dialog', { name: 'Resume' })).not.toBeInTheDocument();
    });

    it('opens straight to the resume from a #resume link, with Back returning to the page', async () => {
        window.history.replaceState(null, '', '/#resume');
        render(<Portfolio />);

        expect(await screen.findByRole('dialog', { name: 'Resume' })).toBeInTheDocument();

        act(() => window.history.back());

        await waitFor(() =>
            expect(screen.queryByRole('dialog', { name: 'Resume' })).not.toBeInTheDocument(),
        );
        expect(window.location.hash).toBe('');
    });
});

describe('Portfolio projects', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('lists each project with its links, opening in a new window', async () => {
        vi.mocked(useProfileData).mockReturnValue({
            data: {
                ...mockProfileData,
                projects: [
                    {
                        name: 'Skywatch',
                        description: 'Copies Emergency Action Messages.',
                        tech: ['Python'],
                        links: [
                            { label: 'Listen live', url: 'https://skywatch.zkm.tw' },
                            { label: 'Source', url: 'https://github.com/zkm/skywatch' },
                        ],
                    },
                ],
            },
            loading: false,
            error: null,
        });

        render(<Portfolio />);

        expect(await screen.findByRole('heading', { name: 'Projects' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Skywatch' })).toBeInTheDocument();
        const live = screen.getByRole('link', {
            name: 'Skywatch: Listen live (opens in new window)',
        });
        expect(live).toHaveAttribute('href', 'https://skywatch.zkm.tw');
        expect(live).toHaveAttribute('target', '_blank');
        expect(screen.getByRole('link', { name: /Skywatch: Source/ })).toHaveAttribute(
            'href',
            'https://github.com/zkm/skywatch',
        );
    });

    it('leaves the section out when there are no projects', async () => {
        vi.mocked(useProfileData).mockReturnValue({
            data: mockProfileData,
            loading: false,
            error: null,
        });

        render(<Portfolio />);

        await screen.findByRole('heading', { name: 'John Doe' });
        expect(screen.queryByRole('heading', { name: 'Projects' })).not.toBeInTheDocument();
    });
});

describe('Portfolio current focus', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('lists the focus items when the profile has them', async () => {
        vi.mocked(useProfileData).mockReturnValue({
            data: { ...mockProfileData, focus: ['Cloud modernization', 'Skywatch'] },
            loading: false,
            error: null,
        });

        render(<Portfolio />);

        expect(await screen.findByText('Cloud modernization')).toBeInTheDocument();
        expect(screen.getByText('Skywatch')).toBeInTheDocument();
        expect(screen.queryByText(/Feel free to reach out/)).not.toBeInTheDocument();
    });

    it('falls back to the contact message without focus items', async () => {
        vi.mocked(useProfileData).mockReturnValue({
            data: mockProfileData,
            loading: false,
            error: null,
        });

        render(<Portfolio />);

        expect(await screen.findByText(/Feel free to reach out/)).toBeInTheDocument();
    });
});
