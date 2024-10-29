import React from 'react';
import { render } from '@testing-library/react-native';
import CalorieCounter from './CalorieCounter';

describe('CalorieCounter Component', () => {
  test.each([
    { calorieCount: 500, expectedText: '500' },
    { calorieCount: 1020, expectedText: '1020' },
    { calorieCount: 1500, expectedText: '1500' },
  ])('renders correctly with calorie count %i', ({ calorieCount, expectedText }) => {
    const { getByText } = render(<CalorieCounter calorieCount={calorieCount} />);

    expect(getByText(expectedText)).toBeTruthy();
    expect(getByText('kcal')).toBeTruthy();
  });

  // Parameterized test for Big Mac calculations
  test.each([
    { calorieCount: 500, expectedBigMacCount: (500 / 509).toFixed(2) },
    { calorieCount: 1020, expectedBigMacCount: (1020 / 509).toFixed(2) },
    { calorieCount: 1500, expectedBigMacCount: (1500 / 509).toFixed(2) },
  ])('calculates and displays the correct number of Big Macs for %i calories', ({ calorieCount, expectedBigMacCount }) => {
    const { getByText } = render(<CalorieCounter calorieCount={calorieCount} />);

    expect(getByText(`${expectedBigMacCount} Big Mac's`)).toBeTruthy();
  });

});
