import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EntryInputField from './EntryInputField';
import Colors from 'src/constants/Colors';

describe('EntryInputField Component', () => {
  it('renders correctly with provided props', () => {
    const { getByText, getByPlaceholderText } = render(
      <EntryInputField
        headerText="Email"
        placeholderText="Enter your email"
        isPassword={false}
        onChangeText={() => {}}
      />
    );

    expect(getByText('Email')).toBeTruthy();

    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
  });

  it('calls onChangeText when input text changes', () => {
    const handleChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <EntryInputField
        headerText="Email"
        placeholderText="Enter your email"
        isPassword={false}
        onChangeText={handleChangeText}
      />
    );

    const input = getByPlaceholderText('Enter your email');

    fireEvent.changeText(input, 'test@example.com');

    expect(handleChangeText).toHaveBeenCalledWith('test@example.com');
  });

  it('sets secureTextEntry to true when isPassword is true', () => {
    const { getByPlaceholderText } = render(
      <EntryInputField
        headerText="Password"
        placeholderText="Enter your password"
        isPassword={true}
        onChangeText={() => {}}
      />
    );

    const input = getByPlaceholderText('Enter your password');

    expect(input.props.secureTextEntry).toBe(true);
  });

  it('renders postfix correctly', () => {
    const { getByText } = render(
      <EntryInputField
        headerText="Phone Number"
        placeholderText="Enter your phone number"
        isPassword={false}
        postfix="+370"
        onChangeText={() => {}}
      />
    );

    expect(getByText(' +370')).toBeTruthy();
  });
});
