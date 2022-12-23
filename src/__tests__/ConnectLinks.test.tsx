import { render, screen } from '@testing-library/react';
import Links from '../components/ConnectLinks';

test('renders GitHub Link', () => {
  render(<Links />);
  const LinkElement = screen.getByText(/GitHub/);
  expect(LinkElement.closest('a')).toHaveAttribute('href', 'https://github.com/zkm');
  // expect(screen.getByRole('link')).toHaveAttribute('href', 'https://github.com/zkm');  
});

test('renders LinkedIn Link', () => {
  render(<Links />);
  const LinkElement = screen.getByText(/LinkedIn/);
  expect(LinkElement.closest('a')).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/zschneider/'
  );
});

test('renders Instagram Link', () => {
  render(<Links />);
  const LinkElement = screen.getByText(/Instagram/);
  expect(LinkElement.closest('a')).toHaveAttribute(
    'href',
    'https://www.instagram.com/zachschneider/'
  );
});

test('renders Twitter Link', () => {
  render(<Links />);
  const LinkElement = screen.getByText(/Twitter/);
  expect(LinkElement.closest('a')).toHaveAttribute('href', 'https://twitter.com/zkm');
});

test('renders StackOverflow Link', () => {
  render(<Links />);
  const LinkElement = screen.getByText(/StackOverflow/);
  expect(LinkElement.closest('a')).toHaveAttribute(
    'href',
    'https://stackoverflow.com/users/461733/zach-schneider'
  );
});
