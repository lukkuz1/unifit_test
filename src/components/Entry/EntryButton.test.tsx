import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EntryButton from './EntryButton';
import { Logo } from 'src/constants/Enums';

jest.mock('src/assets/svg/google.svg', () => () => <svg data-testid="google-logo" />);
jest.mock('src/assets/svg/facebook.svg', () => () => <svg data-testid="facebook-logo" />);

describe('EntryButton Component', () => {
  it('renders correctly with Google logo and handles press event', () => {
    const handlePress = jest.fn();
    
    const { getByText, getByTestId } = render(
      <EntryButton
        text="Sign in with Google"
        textColor="#ffffff"
        buttonColor="#4285F4"
        logo={Logo.GOOGLE}
        onPress={handlePress}
      />
    );

    expect(getByText('Sign in with Google')).toBeTruthy();


    expect(getByTestId('google-logo')).toBeTruthy();


    fireEvent.press(getByText('Sign in with Google'));

    expect(handlePress).toHaveBeenCalled();
  });

  it('renders correctly with Facebook logo', () => {
    const { getByTestId } = render(
      <EntryButton
        text="Sign in with Facebook"
        textColor="#ffffff"
        buttonColor="#3b5998"
        logo={Logo.FACEBOOK}
      />
    );

    expect(getByTestId('facebook-logo')).toBeTruthy();
  });
});
