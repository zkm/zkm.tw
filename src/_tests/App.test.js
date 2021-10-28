import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Twitter link', () => {
	render(<App />);
	const linkElement = screen.getByText(/Twitter/i);
	expect(linkElement).toBeInTheDocument();
});
test('renders Github link', () => {
	render(<App />);
	const linkElement = screen.getByText(/Github/i);
	expect(linkElement).toBeInTheDocument();
});
test('renders LinkedIn link', () => {
	render(<App />);
	const linkElement = screen.getByText(/LinkedIn/i);
	expect(linkElement).toBeInTheDocument();
});
test('renders Blog link', () => {
	render(<App />);
	const linkElement = screen.getByText(/Blog/i);
	expect(linkElement).toBeInTheDocument();
});
