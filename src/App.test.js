import { render, screen } from '@testing-library/react';
import App from './App';

test('renders my name', () => {
  render(<App />);
  const TitleElement = screen.getByText(/Zach Schneider/);
  expect(TitleElement).toBeInTheDocument();
});
