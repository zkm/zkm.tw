import React from 'react';
import { render } from '@testing-library/react';
import Header from '../layout/Header';

describe('Header component', () => {
  test('it renders the correct content', () => {
    const { getByText } = render(<Header name="Test Name" logo="/test/logo.png" />);

    // Check that the name is rendered correctly
    const nameElement = getByText('Test Name');
    expect(nameElement).toBeInTheDocument();

    // Check that the logo is rendered correctly
    const logoElement = getByText('Test Name').parentElement.querySelector('img');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('src', '/test/logo.png');
  });
});
