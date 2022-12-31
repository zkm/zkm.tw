import { render } from '@testing-library/react';
import App from '../App';

describe('App component', () => {
  test('it renders the correct content', () => {
    const { getByText } = render(<App />);

    // Check that the Header component is rendered correctly
    const headerElement = getByText('Zach Schneider');
    expect(headerElement).toBeInTheDocument();

    // Check that the Body component is rendered correctly
    const bodyElement = getByText('Stay in Touch');
    expect(bodyElement).toBeInTheDocument();
  });
});
