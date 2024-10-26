import React from 'react';
import { render } from '@testing-library/react-native';
import CalorieCounter from './CalorieCounter';

describe('CalorieCounter Component', () => {
  it('renders correctly with the given calorie count', () => {
    const { getByText } = render(<CalorieCounter calorieCount={1020} />);

    expect(getByText('1020')).toBeTruthy();
    expect(getByText('kcal')).toBeTruthy();
  });

  it('calculates and displays the correct number of Big Macs', () => {
    const calorieCount = 1020;
    const { getByText } = render(<CalorieCounter calorieCount={calorieCount} />);

    const expectedBigMacCount = (calorieCount / 509).toFixed(2);
    
    expect(getByText(`${expectedBigMacCount} Big Mac's`)).toBeTruthy();
  });

  it('applies margin styles correctly', () => {
    const { getByText } = render(<CalorieCounter calorieCount={1020} margin={[10, 20, 30, 40]} />);

    expect(getByText('Calories')).toBeTruthy();
    expect(getByText('1020')).toBeTruthy();
  });
});
