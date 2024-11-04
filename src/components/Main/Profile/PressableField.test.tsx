import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PressableField from './PressableField';

describe('PressableField', () => {
  const mockOnPress = jest.fn();

  // Unit Test: Test that the component renders correctly with specific props
  it('renders correctly with headerText', () => {
    const { getByText } = render(<PressableField headerText="Test Header" onPress={mockOnPress} />);
    expect(getByText('Test Header')).toBeTruthy();
    expect(getByText('Change')).toBeTruthy();
  });

  // Integration Test: Ensure that the component interacts with the provided onPress function correctly
  it('calls onPress when pressed', () => {
    const { getByText } = render(<PressableField headerText="Test Header" onPress={mockOnPress} />);
    fireEvent.press(getByText('Change'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  // Parameterized Test: Test with multiple header texts to verify rendering
  const testCases = [
    { headerText: "Header 1", expectedText: "Change" },
    { headerText: "Header 2", expectedText: "Change" },
    { headerText: "Header 3", expectedText: "Change" },
  ];

  test.each(testCases)('renders correctly with headerText: $headerText', ({ headerText, expectedText }) => {
    const { getByText } = render(<PressableField headerText={headerText} onPress={mockOnPress} />);
    expect(getByText(headerText)).toBeTruthy();
    expect(getByText(expectedText)).toBeTruthy();
  });
});
