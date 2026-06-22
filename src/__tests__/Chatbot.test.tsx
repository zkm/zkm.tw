import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Chatbot from '../components/Chatbot';

describe('Chatbot', () => {
    beforeEach(() => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({ text: 'Mocked reply' }),
            }),
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders chat button', () => {
        render(<Chatbot />);
        expect(screen.getByRole('button', { name: /open chat/i })).toBeInTheDocument();
    });

    it('opens chat modal when button is clicked', () => {
        render(<Chatbot />);
        const chatButton = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(chatButton);

        expect(screen.getByText(/Chat with Zach/i)).toBeInTheDocument();
        expect(screen.getByText(/Ask me anything!/i)).toBeInTheDocument();
    });

    it('displays welcome message when opened', () => {
        render(<Chatbot />);
        const chatButton = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(chatButton);

        expect(screen.getByText(/Hi there! I'm Zach/i)).toBeInTheDocument();
    });

    it('closes chat modal when X button is clicked', () => {
        render(<Chatbot />);
        const chatButton = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(chatButton);

        const closeButton = screen.getByRole('button', { name: 'X' });
        fireEvent.click(closeButton);

        expect(screen.queryByText(/Chat with Zach/i)).not.toBeInTheDocument();
    });

    it('has input field and send button', () => {
        render(<Chatbot />);
        const chatButton = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(chatButton);

        expect(screen.getByPlaceholderText(/Ask me about my experience/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    });

    it('send button starts disabled', () => {
        render(<Chatbot />);
        const chatButton = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(chatButton);

        const sendButton = screen.getByRole('button', { name: 'Send' });
        expect(sendButton).toBeDisabled();
    });

    it('can type in input field', () => {
        render(<Chatbot />);
        const chatButton = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(chatButton);

        const input = screen.getByPlaceholderText(
            /Ask me about my experience/i,
        ) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Test message' } });

        expect(input.value).toBe('Test message');
    });

    it('sends message to /api/chat and renders the response', async () => {
        render(<Chatbot />);
        const chatButton = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(chatButton);

        const input = screen.getByPlaceholderText(/Ask me about my experience/i);
        fireEvent.change(input, { target: { value: 'What are your skills?' } });
        fireEvent.click(screen.getByRole('button', { name: 'Send' }));

        await waitFor(() => {
            expect(screen.getByText('Mocked reply')).toBeInTheDocument();
        });

        expect(fetch).toHaveBeenCalledWith(
            '/api/chat',
            expect.objectContaining({ method: 'POST' }),
        );
    });

    it('shows a rate-limit message on 429', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({ ok: false, status: 429, json: async () => ({}) }),
        );

        render(<Chatbot />);
        const chatButton = screen.getByRole('button', { name: /open chat/i });
        fireEvent.click(chatButton);

        const input = screen.getByPlaceholderText(/Ask me about my experience/i);
        fireEvent.change(input, { target: { value: 'Hello' } });
        fireEvent.click(screen.getByRole('button', { name: 'Send' }));

        await waitFor(() => {
            expect(screen.getByText(/sending messages a bit fast/i)).toBeInTheDocument();
        });
    });
});
