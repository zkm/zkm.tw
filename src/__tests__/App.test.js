import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders my name', () => {
  render(<App />);
  const TitleElement = screen.getByText(/Zach Schneider/);
  expect(TitleElement).toBeInTheDocument();
});

test('renders GitHub Link', () => {
  render(<App />);
  const LinkElement = screen.getByText(/GitHub/);
  expect(LinkElement.closest('a')).toHaveAttribute('href', 'https://github.com/zkm');
});

test('renders LinkedIn Link', () => {
  render(<App />);
  const LinkElement = screen.getByText(/LinkedIn/);
  expect(LinkElement.closest('a')).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/zschneider/'
  );
});

test('renders Instagram Link', () => {
  render(<App />);
  const LinkElement = screen.getByText(/Instagram/);
  expect(LinkElement.closest('a')).toHaveAttribute(
    'href',
    'https://www.instagram.com/zachschneider/'
  );
});

test('renders Twitter Link', () => {
  render(<App />);
  const LinkElement = screen.getByText(/Twitter/);
  expect(LinkElement.closest('a')).toHaveAttribute('href', 'https://twitter.com/zkm');
});

test('renders StackOverflow Link', () => {
  render(<App />);
  const LinkElement = screen.getByText(/StackOverflow/);
  expect(LinkElement.closest('a')).toHaveAttribute(
    'href',
    'https://stackoverflow.com/users/461733/zach-schneider'
  );
});
