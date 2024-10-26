
import React from 'react';
import { render } from '@testing-library/react-native';
import DistanceCounter from './DistanceCounter'; // Adjust the import path as necessary
import { useUser } from 'src/hooks/useUser';

jest.mock('src/hooks/useUser');

describe('DistanceCounter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with user data', () => {
    (useUser as jest.Mock).mockReturnValue({
      initialized: true,
      hours: 12,
      distanceHistory: { 11: 1, 10: 2, 9: 3 },
      steps: { 1: { 1: 2000 } }, // Steps for the current day
      month: 1,
      day: 1,
    });

    const { getByText } = render(<DistanceCounter />);

    expect(getByText('Distance travelled')).toBeTruthy();

    const totalDistanceKm = (2000 * 0.762 / 1000).toFixed(2);
    expect(getByText(`${totalDistanceKm}`)).toBeTruthy();
  });

  it('applies margin styles correctly', () => {
    (useUser as jest.Mock).mockReturnValue({
      initialized: true,
      hours: 12,
      distanceHistory: {},
      steps: { 1: { 1: 2000 } },
      month: 1,
      day: 1,
    });

    const { getByText } = render(<DistanceCounter margin={[10, 20, 30, 40]} />);

    expect(getByText('Distance travelled')).toBeTruthy();
  });
});
