import React from 'react';
import { render } from '@testing-library/react-native';
import DistanceCounter from './DistanceCounter'; // Adjust the import path as necessary
import { useUser } from 'src/hooks/useUser';

jest.mock('src/hooks/useUser');

describe('DistanceCounter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Parameterized test for rendering distance based on different steps counts
  test.each([
    { stepsToday: 1000, expectedDistanceKm: (1000 * 0.762 / 1000).toFixed(2) },
    { stepsToday: 5000, expectedDistanceKm: (5000 * 0.762 / 1000).toFixed(2) },
    { stepsToday: 10000, expectedDistanceKm: (10000 * 0.762 / 1000).toFixed(2) },
  ])('calculates and renders distance correctly for %i steps', ({ stepsToday, expectedDistanceKm }) => {
    (useUser as jest.Mock).mockReturnValue({
      initialized: true,
      hours: 12,
      distanceHistory: {},
      steps: { 1: { 1: stepsToday } },
      month: 1,
      day: 1,
    });

    const { getByText } = render(<DistanceCounter />);

    expect(getByText('Distance travelled')).toBeTruthy();
    expect(getByText(`${expectedDistanceKm}`)).toBeTruthy();
  });

  // Parameterized test for different distance history scenarios
  test.each([
    { distanceHistory: { 11: 1, 10: 2, 9: 3 }, totalDistance: '3.00' },
    { distanceHistory: { 5: 1.5, 4: 2.3, 3: 0.5 }, totalDistance: '4.30' },
    { distanceHistory: {}, totalDistance: '0.00' },
  ])('renders correctly with distance history data', ({ distanceHistory, totalDistance }) => {
    (useUser as jest.Mock).mockReturnValue({
      initialized: true,
      hours: 12,
      distanceHistory,
      steps: { 1: { 1: 2000 } },
      month: 1,
      day: 1,
    });

    const { getByText } = render(<DistanceCounter />);

    expect(getByText('Distance travelled')).toBeTruthy();
    expect(getByText(totalDistance)).toBeTruthy();
  });

});
