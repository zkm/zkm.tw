import React from 'react';
import { render, screen } from '@testing-library/react';
import TagManager from 'react-gtm-module';
import Tracking from '../components/Tracking';

jest.mock('react-gtm-module', () => ({
  initialize: jest.fn(),
}));

describe('Tracking', () => {
  it('initializes Tag Manager with the correct GTM ID', () => {
    render(<Tracking />);

    expect(TagManager.initialize).toHaveBeenCalledWith({ gtmId: 'GTM-KTW7DXZ' });
  });
});
