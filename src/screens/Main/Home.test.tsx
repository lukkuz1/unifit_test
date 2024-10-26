import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import Home from './Home';
import firebaseServices from 'src/services/firebase';

jest.mock('src/services/firebase', () => ({
  auth: {
    currentUser: {
      email: 'test@example.com',
      uid: 'test-uid',
    },
  },
}));

const mockSteps = {
  stepCount: 1000,
  pastStepCount: 500,
  hourlySteps: 50,
};

describe('Home Ekranas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Atvaizduoja teisingą žingsnių skaičių', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('1500')).toBeTruthy();
    });
  });
});
