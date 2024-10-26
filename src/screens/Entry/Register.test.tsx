import React from 'react';
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

  test('renders the sign-up form correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Entry />);
    
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByPlaceholderText('example@gmail.com')).toBeTruthy();
    expect(getByPlaceholderText('Enter Your Password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Already have an account ?')).toBeTruthy();
  });

  test('updates email and password fields correctly', () => {
    const { getByPlaceholderText } = render(<Entry />);

    const emailInput = getByPlaceholderText('example@gmail.com');
    const passwordInput = getByPlaceholderText('Enter Your Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  test('handles sign-up success correctly', async () => {
    mockAuth.signUp.mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = render(<Entry />);
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

  test('displays error message on sign-up failure', async () => {
    const errorMessage = 'Sign-up failed';
    mockAuth.signUp.mockResolvedValue(errorMessage);

    const { getByText, getByPlaceholderText } = render(<Entry />);
    const emailInput = getByPlaceholderText('example@gmail.com');
    const passwordInput = getByPlaceholderText('Enter Your Password');
    const signUpButton = getByText('Sign Up');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(getByText(errorMessage)).toBeTruthy();
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  test('navigates to login screen when "Log in!" is pressed', () => {
    const { getByText } = render(<Entry />);
    const loginText = getByText('Log in!');

    fireEvent.press(loginText);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});
