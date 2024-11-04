import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Account from './Account';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from 'src/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';

// Mock navigation and dark mode toggle
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
jest.mock('src/hooks/useDarkModeToggle', () => jest.fn());

describe('Account Component', () => {
  let mockNavigation;

  beforeEach(() => {
    mockNavigation = { navigate: jest.fn() };
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useDarkModeToggle as jest.Mock).mockClear();
  });

  // Unit Test: Verifies component renders main elements
  test('renders labels and icons for each account action correctly', () => {
    const { getByText } = render(<Account />);

    expect(getByText('Change Password')).toBeTruthy();
    expect(getByText('Edit Profile')).toBeTruthy();
    expect(getByText('Add step goal')).toBeTruthy();
    expect(getByText('Delete account')).toBeTruthy();
  });

  // Integration Test: Ensures each button navigates to the correct screen
  test('navigates to ChangePassword screen on pressing "Change Password"', () => {
    const { getByText } = render(<Account />);
    const changePasswordButton = getByText('Change Password');

    fireEvent.press(changePasswordButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ChangePassword');
  });

  test('navigates to ProfileEdit screen on pressing "Edit Profile"', () => {
    const { getByText } = render(<Account />);
    const editProfileButton = getByText('Edit Profile');

    fireEvent.press(editProfileButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ProfileEdit');
  });

  test('navigates to StepGoal screen on pressing "Add step goal"', () => {
    const { getByText } = render(<Account />);
    const stepGoalButton = getByText('Add step goal');

    fireEvent.press(stepGoalButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('StepGoal');
  });

  test('navigates to AccountDelete screen on pressing "Delete account"', () => {
    const { getByText } = render(<Account />);
    const deleteAccountButton = getByText('Delete account');

    fireEvent.press(deleteAccountButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AccountDelete');
  });

  // Parameterized Test: Ensures gradient colors based on dark mode state
  describe.each([
    { darkMode: true, expectedColors: [Colors.DarkBackgroundGradientLower, Colors.DarkBackgroundGradientUpper] },
    { darkMode: false, expectedColors: [Colors.BackgroundGradientUpper, Colors.BackgroundGradientLower] },
  ])('with dark mode: $darkMode', ({ darkMode, expectedColors }) => {
    test(`applies correct gradient colors for dark mode: ${darkMode}`, () => {
      (useDarkModeToggle as jest.Mock).mockReturnValue(darkMode);

      const { getByTestId } = render(<Account />);
      const linearGradient = getByTestId('LinearGradient');

      expect(linearGradient.props.colors).toEqual(expectedColors);
    });
  });
});
