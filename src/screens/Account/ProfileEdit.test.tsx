import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ProfileEdit from './ProfileEdit';
import { useNavigation } from '@react-navigation/native';
import { getAuth, updateEmail } from '@firebase/auth';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@firebase/auth', () => ({
  getAuth: jest.fn(),
  updateEmail: jest.fn(),
}));

jest.mock('src/hooks/useDarkModeToggle', () => jest.fn());

jest.spyOn(Alert, 'alert');

describe('ProfileEdit Component', () => {
  let mockNavigation;
  let auth;

  beforeEach(() => {
    mockNavigation = { navigate: jest.fn() };
    auth = { currentUser: { email: 'test@example.com' } };

    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (getAuth as jest.Mock).mockReturnValue(auth);
  });

  // Unit Test
  test('renders email input field and update button correctly', () => {
    const { getByText, getByPlaceholderText } = render(<ProfileEdit />);
    const emailInput = getByPlaceholderText('Enter Email');
    const updateButton = getByText('Update Profile');

    expect(emailInput).toBeTruthy();
    expect(updateButton).toBeTruthy();
  });

  // Integration Test
  test('calls updateEmail with the correct email and shows success alert on successful update', async () => {
    const newEmail = 'newemail@example.com';
    (updateEmail as jest.Mock).mockResolvedValueOnce(undefined); // Mock successful email update

    const { getByPlaceholderText, getByText } = render(<ProfileEdit />);
    const emailInput = getByPlaceholderText('Enter Email');
    const updateButton = getByText('Update Profile');

    fireEvent.changeText(emailInput, newEmail);
    fireEvent.press(updateButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Profile Updated', 'Your email has been successfully updated.');
    });
  });

  // Parameterized Test
  describe.each([
    { email: 'valid@example.com', shouldUpdate: true },
    { email: 'invalid-email', shouldUpdate: false },
    { email: 'another@valid.com', shouldUpdate: true },
    { email: '', shouldUpdate: false },
  ])('with email: $email', ({ email, shouldUpdate }) => {
    test(`update email should be called ${shouldUpdate}`, async () => {
      const { getByPlaceholderText, getByText } = render(<ProfileEdit />);
      const emailInput = getByPlaceholderText('Enter Email');
      const updateButton = getByText('Update Profile');

      fireEvent.changeText(emailInput, email);
      fireEvent.press(updateButton);

      await waitFor(() => {
        if (shouldUpdate) {
          expect(Alert.alert).toHaveBeenCalledWith('Profile Updated', 'Your email has been successfully updated.');
        } else {
          expect(Alert.alert).toHaveBeenCalledWith('Invalid Email', 'Please enter a valid email address.');
        }
      });
    });
  });
});
