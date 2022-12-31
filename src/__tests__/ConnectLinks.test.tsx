import React from 'react';
import { render } from '@testing-library/react';
import ConnectLinks from '../components/ConnectLinks';
import links from '../data/links';

describe('ConnectLinks', () => {
  it('renders a list of links', () => {
    const { getByText } = render(<ConnectLinks />);

    // Assert that each link is rendered
    links.forEach((link) => {
      expect(getByText(link.text)).toBeInTheDocument();
    });
  });
});
