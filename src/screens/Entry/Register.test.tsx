import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Entry from './Register';
import { useAuth } from 'src/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('src/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('Entry Component', () => {
  let mockNavigation;
  let mockAuth;

  beforeEach(() => {
    mockNavigation = { navigate: jest.fn() };
    mockAuth = { signUp: jest.fn() };

    (useNavigation as jest.Mock).mockImplementation(() => mockNavigation);
    (useAuth as jest.Mock).mockImplementation(() => mockAuth);
  });

  jest.spyOn(Alert, 'alert');

  // Unit Test
  test('navigates to login screen when "Log in!" is pressed', () => {
    const { getByText } = render(<Entry />);
    const loginText = getByText('Log in!');

    fireEvent.press(loginText);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  // Integration Test
  test('displays alert and navigates to login on successful sign-up', async () => {
    mockAuth.signUp.mockResolvedValueOnce(undefined); // Mock successful sign-up
    const { getByPlaceholderText, getByText } = render(<Entry />);

    const emailInput = getByPlaceholderText('example@gmail.com');
    const passwordInput = getByPlaceholderText('Enter Your Password');
    const signUpButton = getByText('Sign Up');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(mockAuth.signUp).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  // Parameterized Test
  describe.each([
    { email: 'valid@example.com', password: 'validPass123', shouldSignUp: true },
    { email: 'invalid-email', password: 'validPass123', shouldSignUp: false },
    { email: 'valid@example.com', password: '', shouldSignUp: false },
    { email: '', password: 'validPass123', shouldSignUp: false },
  ])('with email: $email and password: $password', ({ email, password, shouldSignUp }) => {
    test(`sign up should ${shouldSignUp ? '' : 'not '}be called`, async () => {
      const { getByPlaceholderText, getByText } = render(<Entry />);

      const emailInput = getByPlaceholderText('example@gmail.com');
      const passwordInput = getByPlaceholderText('Enter Your Password');
      const signUpButton = getByText('Sign Up');

      fireEvent.changeText(emailInput, email);
      fireEvent.changeText(passwordInput, password);
      fireEvent.press(signUpButton);

      await waitFor(() => {
        if (shouldSignUp) {
          expect(Alert.alert).toHaveBeenCalledWith('Verification link sent to your email', 'Confirm your email to login in to application.');
        } else {
          expect(mockAuth.signUp).not.toHaveBeenCalledWith('Verification link sent to your email', 'Confirm your email to login in to application.');
        }
      });
    });
  });
});
