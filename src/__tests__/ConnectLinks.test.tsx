import { render, screen } from '@testing-library/react';
import ConnectLinks from '../components/ConnectLinks';
import links from '../data/links';

describe('ConnectLinks', () => {
  it('renders a list of links', () => {
    render(<ConnectLinks />);

    // Check that the correct number of links are rendered
    expect(screen.getAllByRole('link')).toHaveLength(links.length);
  });
});
