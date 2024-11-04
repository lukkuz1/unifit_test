import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from './Login';
import { useAuth } from 'src/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

jest.mock('src/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Mock functions for signIn and navigate
const mockSignIn = jest.fn();
const mockNavigate = jest.fn();

(useAuth as jest.Mock).mockReturnValue({ signIn: mockSignIn });
(useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

describe('Login Screen Tests', () => {
  beforeEach(() => {
    // Clear mocks before each test to prevent data carry-over
    mockSignIn.mockClear();
    mockNavigate.mockClear();
  });

  it('renders correctly and allows filling in the email and password', () => {
    const { getByPlaceholderText } = render(<Login />);

    const emailInput = getByPlaceholderText('example@gmail.com');
    const passwordInput = getByPlaceholderText('Enter Your Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.onChangeText).toBeDefined();

    fireEvent.changeText(passwordInput, 'password123');
    expect(passwordInput.props.onChangeText).toBeDefined();
  });

  it('navigates to ForgotPassword screen when Forgot Password is pressed', () => {
    const { getByText } = render(<Login />);
    const forgotPasswordButton = getByText('Forgot Password?');

    fireEvent.press(forgotPasswordButton);
    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('calls signIn on login button press and displays error if login fails', async () => {
    mockSignIn.mockResolvedValueOnce('Invalid email or password'); // Mock failed login

    const { getByPlaceholderText, getByText, findByText } = render(<Login />);

    // Simulate filling in the email and password fields
    const emailInput = getByPlaceholderText('example@gmail.com');
    const passwordInput = getByPlaceholderText('Enter Your Password');
    fireEvent.changeText(emailInput, 'wrong@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    // Simulate pressing the login button
    const loginButton = getByText('Login1');
    fireEvent.press(loginButton);

    // Expect signIn to be called with email and password
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
    });

    // Check if error message is displayed
    const errorMessage = await findByText('Invalid email or password');
    expect(errorMessage).toBeTruthy();
  });

  it('does not display error when login succeeds', async () => {
    mockSignIn.mockResolvedValueOnce(undefined); // Mock successful login

    const { getByPlaceholderText, getByText, queryByText } = render(<Login />);

    // Simulate filling in the email and password fields
    const emailInput = getByPlaceholderText('example@gmail.com');
    const passwordInput = getByPlaceholderText('Enter Your Password');
    fireEvent.changeText(emailInput, 'correct@example.com');
    fireEvent.changeText(passwordInput, 'correctpassword');

    // Simulate pressing the login button
    const loginButton = getByText('Login1');
    fireEvent.press(loginButton);

    // Expect signIn to be called with email and password
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('correct@example.com', 'correctpassword');
    });

    // Verify no error message is displayed
    expect(queryByText('Invalid email or password')).toBeNull();
  });
  describe('Parameterized login tests', () => {
    test.each`
      email                    | password         | signInResult               | errorExpected
      ${'correct@example.com'} | ${'correctpassword'} | ${'Invalid credentials'}   | ${false}
      ${'wrong@example.com'}   | ${'wrongpass'}   | ${'Invalid credentials'}   | ${true}
      ${''}                    | ${'password123'} | ${'Email is required'}     | ${true}
      ${'test@example.com'}    | ${''}            | ${'Password is required'}  | ${true}
      ${''}                    | ${''}            | ${'Email and password required'} | ${true}
    `('calls signIn and handles error correctly with email="$email" and password="$password"', async ({ email, password, signInResult, errorExpected }) => {
      mockSignIn.mockResolvedValueOnce(signInResult);

      const { getByPlaceholderText, getByText, queryByText } = render(<Login />);

      // Fill email and password fields
      const emailInput = getByPlaceholderText('example@gmail.com');
      const passwordInput = getByPlaceholderText('Enter Your Password');
      fireEvent.changeText(emailInput, email);
      fireEvent.changeText(passwordInput, password);

      // Press the login button
      const loginButton = getByText('Login1');
      fireEvent.press(loginButton);

      // Check if signIn was called with the correct arguments
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith(email, password);
      });

      // Check error display based on test case expectation
      if (errorExpected) {
        const errorMessage = await queryByText(signInResult);
        expect(errorMessage).toBeTruthy();
      } else {
        expect(queryByText(signInResult)).toBeNull();
      }
    });
  });
  
});
