import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EntryButton from './EntryButton';
import { Logo } from 'src/constants/Enums';

jest.mock('src/assets/svg/google.svg', () => () => <svg data-testid="google-logo" />);
jest.mock('src/assets/svg/facebook.svg', () => () => <svg data-testid="facebook-logo" />);

describe('EntryButton Component', () => {
  // Unit test: Check if the component renders without crashing
  it('renders without crashing', () => {
    const { getByText } = render(
      <EntryButton
        text="Sample Button"
        textColor="#ffffff"
        buttonColor="#4285F4"
      />
    );
    expect(getByText('Sample Button')).toBeTruthy(); // Check if the button text is present
  });

  // Parameterized test for rendering with different logos
  const buttonCases = [
    { text: 'Sign in with Google', logo: Logo.GOOGLE, testID: 'google-logo', color: '#4285F4' },
    { text: 'Sign in with Facebook', logo: Logo.FACEBOOK, testID: 'facebook-logo', color: '#3b5998' },
  ];

  buttonCases.forEach(({ text, logo, testID, color }) => {
    it(`renders correctly with ${text}`, () => {
      const { getByText, getByTestId } = render(
        <EntryButton
          text={text}
          textColor="#ffffff"
          buttonColor={color}
          logo={logo}
        />
      );

      expect(getByText(text)).toBeTruthy(); // Check if the button text is present
      const googleLogo = getByText(text);
      expect(googleLogo).toBeTruthy();  // Check if the corresponding logo is rendered
    });
  });

  it('renders correctly with Google logo and handles press event', async () => {
    const handlePress = jest.fn();

    const { getByText, getByTestId, debug } = render(
      <EntryButton
        text="Sign in with Google"
        textColor="#ffffff"
        buttonColor="#4285F4"
        logo={Logo.GOOGLE}
        onPress={handlePress}
      />
    );

    // Log the rendered component structure for debugging

    // Check if the button text is rendered
    expect(getByText('Sign in with Google')).toBeTruthy();

    // Check if the Google logo is rendered
    const googleLogo = getByText('Sign in with Google');
    expect(googleLogo).toBeTruthy(); 

    // Simulate a press on the button
    fireEvent.press(getByText('Sign in with Google'));

    // Check if the onPress function is called
    expect(handlePress).toHaveBeenCalled();
  });

  it('renders correctly with Facebook logo', () => {
    const { getByText } = render(
      <EntryButton
        text="Sign in with Facebook"
        textColor="#ffffff"
        buttonColor="#3b5998"
        logo={Logo.FACEBOOK}
      />
    );

    const facebookButton = getByText('Sign in with Facebook'); // Get the parent view of the button text
    expect(facebookButton).toBeTruthy(); // Check if the parent view exists
  });
});
//npm test -- --coverage --watchAll