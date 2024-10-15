import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from './Login';
import { useAuth } from 'src/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockNavigate = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

describe('Login Screen', () => {
  it('renders correctly and allows filling in the email and password', () => {
    const { getByPlaceholderText, debug } = render(<Login />);

    const emailInput = getByPlaceholderText('example@gmail.com');
    const passwordInput = getByPlaceholderText('Enter Your Password');
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.onChangeText).toBeDefined();
    fireEvent.changeText(passwordInput, 'password123');
    expect(passwordInput.props.onChangeText).toBeDefined();
  });

});
