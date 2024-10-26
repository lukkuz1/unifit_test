import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PressableField from './PressableField';

describe('PressableField', () => {
  const mockOnPress = jest.fn();

  it('renders correctly with headerText', () => {
    const { getByText } = render(<PressableField headerText="Test Header" onPress={mockOnPress} />);
    expect(getByText('Test Header')).toBeTruthy();
    expect(getByText('Change')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(<PressableField headerText="Test Header" onPress={mockOnPress} />);
    fireEvent.press(getByText('Change'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
