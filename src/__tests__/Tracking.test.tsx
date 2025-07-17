import React from 'react';
import { render, waitFor } from '@testing-library/react';
import TagManager from 'react-gtm-module';
import Tracking from '../components/tracking/Tracking';

jest.mock('react-gtm-module', () => ({
  initialize: jest.fn(),
}));

afterEach(() => {
  delete process.env.REACT_APP_GTM_ID;
  jest.clearAllMocks();
});

it('initializes Tag Manager with the correct GTM ID', async () => {
  process.env.REACT_APP_GTM_ID = 'GTM-KTW7DXZ';

  render(<Tracking />);

  await waitFor(() => {
    expect(TagManager.initialize).toHaveBeenCalledWith({ gtmId: 'GTM-KTW7DXZ' });
  });
});
