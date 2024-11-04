import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Notifications from './Notifications';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from 'src/constants/Colors';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';

// Mock dark mode toggle hook
jest.mock('src/hooks/useDarkModeToggle', () => jest.fn());

describe('Notifications Component', () => {
  beforeEach(() => {
    (useDarkModeToggle as jest.Mock).mockClear();
  });

  // Unit Test: Checks main UI elements
  test('renders notification settings labels and switches correctly', () => {
    const { getByText, getAllByRole } = render(<Notifications />);
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('Push Notifications')).toBeTruthy();
    expect(getByText('Sound Notifications')).toBeTruthy();
    expect(getByText('Vibration Notifications')).toBeTruthy();
    expect(getByText('Priority Notifications')).toBeTruthy();

    // Verify the switches
    const switches = getAllByRole('switch');
    expect(switches.length).toBe(4); // One for each notification type
  });

  // Integration Tests: Toggles for each notification setting
  test('toggles push notifications correctly', () => {
    const { getByText, getByRole } = render(<Notifications />);
    const pushSwitch = getByRole('switch', { name: 'Push Notifications' });
    const pushLabel = getByText('Push Notifications');

    // Initial state is true, toggle it to false
    fireEvent(pushSwitch, 'onValueChange');
    expect(pushSwitch.props.value).toBe(false);

    // Toggle it back to true
    fireEvent(pushSwitch, 'onValueChange');
    expect(pushSwitch.props.value).toBe(true);
  });

  test('toggles sound notifications correctly', () => {
    const { getByText, getByRole } = render(<Notifications />);
    const soundSwitch = getByRole('switch', { name: 'Sound Notifications' });

    // Initial state is true, toggle it to false
    fireEvent(soundSwitch, 'onValueChange');
    expect(soundSwitch.props.value).toBe(false);

    // Toggle it back to true
    fireEvent(soundSwitch, 'onValueChange');
    expect(soundSwitch.props.value).toBe(true);
  });

  test('toggles vibration notifications correctly', () => {
    const { getByText, getByRole } = render(<Notifications />);
    const vibrationSwitch = getByRole('switch', { name: 'Vibration Notifications' });

    // Initial state is true, toggle it to false
    fireEvent(vibrationSwitch, 'onValueChange');
    expect(vibrationSwitch.props.value).toBe(false);

    // Toggle it back to true
    fireEvent(vibrationSwitch, 'onValueChange');
    expect(vibrationSwitch.props.value).toBe(true);
  });

  test('changes priority notifications correctly', () => {
    const { getByText, getByRole } = render(<Notifications />);
    const prioritySwitch = getByRole('switch', { name: 'Priority Notifications' });

    // Initial state is "high" (true), toggle to "low" (false)
    fireEvent(prioritySwitch, 'onValueChange');
    expect(prioritySwitch.props.value).toBe(false);

    // Toggle it back to "high" (true)
    fireEvent(prioritySwitch, 'onValueChange');
    expect(prioritySwitch.props.value).toBe(true);
  });

  // Parameterized Test: Checks gradient colors based on dark mode
  describe.each([
    { darkMode: true, expectedColors: [Colors.DarkBackgroundGradientLower, Colors.DarkBackgroundGradientUpper] },
    { darkMode: false, expectedColors: [Colors.BackgroundGradientUpper, Colors.BackgroundGradientLower] },
  ])('with dark mode: $darkMode', ({ darkMode, expectedColors }) => {
    test(`applies correct gradient colors for dark mode: ${darkMode}`, () => {
      (useDarkModeToggle as jest.Mock).mockReturnValue(darkMode);

      const { getByTestId } = render(<Notifications />);
      const linearGradient = getByTestId('LinearGradient');

      expect(linearGradient.props.colors).toEqual(expectedColors);
    });
  });
});
