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



  test('navigates to login screen when "Log in!" is pressed', () => {
    const { getByText } = render(<Entry />);
    const loginText = getByText('Log in!');

    fireEvent.press(loginText);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});
