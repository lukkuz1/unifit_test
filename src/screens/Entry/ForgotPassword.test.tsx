import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ForgotPassword from './ForgotPassword';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import firebase from 'src/services/firebase';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn(),
}));

describe('ForgotPassword Component', () => {
  let mockNavigation;

  beforeEach(() => {
    mockNavigation = { navigate: jest.fn() };
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (sendPasswordResetEmail as jest.MockedFunction<typeof sendPasswordResetEmail>).mockClear();
  });

  test('renders the forgot password form correctly', () => {
    const { getByText, getByPlaceholderText } = render(<ForgotPassword />);
    
    expect(getByText('Forgot Password')).toBeTruthy();
    expect(getByPlaceholderText('Enter Your Email')).toBeTruthy();
    expect(getByText('Reset Password')).toBeTruthy();
  });

  test('updates email field correctly', () => {
    const { getByPlaceholderText } = render(<ForgotPassword />);
    const emailInput = getByPlaceholderText('Enter Your Email');

    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  test('shows alert for empty email', async () => {
    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});
    const { getByText } = render(<ForgotPassword />);
    const resetButton = getByText('Reset Password');

    fireEvent.press(resetButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Invalid Email', 'Please enter a valid email address.');
    });

    alertSpy.mockRestore();
  });

  test('calls sendPasswordResetEmail and navigates on successful reset', async () => {
    (sendPasswordResetEmail as jest.MockedFunction<typeof sendPasswordResetEmail>).mockResolvedValueOnce();

    const { getByText, getByPlaceholderText } = render(<ForgotPassword />);
    const emailInput = getByPlaceholderText('Enter Your Email');
    const resetButton = getByText('Reset Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(resetButton);

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(firebase.auth, 'test@example.com');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  test('shows alert for invalid email error', async () => {
    (sendPasswordResetEmail as jest.MockedFunction<typeof sendPasswordResetEmail>).mockRejectedValueOnce({ code: 'auth/invalid-email' });
    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<ForgotPassword />);
    const emailInput = getByPlaceholderText('Enter Your Email');
    const resetButton = getByText('Reset Password');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(resetButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Invalid Email', 'Please enter a valid email address.');
    });

    alertSpy.mockRestore();
  });

  test('shows alert for user-not-found error', async () => {
    (sendPasswordResetEmail as jest.MockedFunction<typeof sendPasswordResetEmail>).mockRejectedValueOnce({ code: 'auth/user-not-found' });
    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<ForgotPassword />);
    const emailInput = getByPlaceholderText('Enter Your Email');
    const resetButton = getByText('Reset Password');

    fireEvent.changeText(emailInput, 'nonexistent@example.com');
    fireEvent.press(resetButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Email Not Found', 'This email address is not associated with any account.');
    });

    alertSpy.mockRestore();
  });

  test('shows alert for other errors', async () => {
    const errorMessage = 'An unexpected error occurred';
    (sendPasswordResetEmail as jest.MockedFunction<typeof sendPasswordResetEmail>).mockRejectedValueOnce({ message: errorMessage });
    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<ForgotPassword />);
    const emailInput = getByPlaceholderText('Enter Your Email');
    const resetButton = getByText('Reset Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(resetButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Password Reset Failed', errorMessage);
    });

    alertSpy.mockRestore();
  });

  
});
