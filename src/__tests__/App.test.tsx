import * as React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders my name', () => {
  render(<App gtmId="GTM-KTW7DXZ" />);
  const titleElement: HTMLElement = screen.getByText(/Zach Schneider/);
  expect(titleElement).toBeInTheDocument();
});
