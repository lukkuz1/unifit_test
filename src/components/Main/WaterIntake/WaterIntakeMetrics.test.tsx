import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import WaterIntakeMetrics from './WaterIntakeMetrics';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({
    forEach: jest.fn((cb) => {
      cb({ id: '2024-10-01', data: () => ({ intake_ml: 500 }) });
      cb({ id: '2024-10-02', data: () => ({ intake_ml: 700 }) });
    }),
  })),
}));

describe('WaterIntakeMetrics', () => {
  it('fetches and displays water intake data', async () => {
    const { getByText, getByTestId } = render(<WaterIntakeMetrics />);

    await waitFor(() => expect(getByText('This Week')).toBeTruthy());

    fireEvent.press(getByText('This Month'));
    await waitFor(() => expect(getByText('This Month')).toBeTruthy());
    
    fireEvent.press(getByText('This Year'));
    await waitFor(() => expect(getByText('This Year')).toBeTruthy());
  });
});
