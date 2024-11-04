import React from 'react';
import { render } from '@testing-library/react-native';
import AboutUs from './About';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from 'src/constants/Colors';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';

// Mock the dark mode toggle hook
jest.mock('src/hooks/useDarkModeToggle', () => jest.fn());

describe('AboutUs Component', () => {
  // Unit Test
  test('renders the heading, subtitle, and paragraphs correctly', () => {
    const { getByText } = render(<AboutUs />);

    expect(getByText('Welcome to UniFit')).toBeTruthy();
    expect(getByText('Track. Achieve. Reward.')).toBeTruthy();
    expect(getByText("UniFit is more than just a fitness app; it's your companion on the journey to a healthier, happier you.")).toBeTruthy();
    expect(getByText('Designed with modern aesthetics and cutting-edge technology, UniFit empowers you to take control of your fitness goals and turn them into reality.')).toBeTruthy();
    expect(getByText("Whether you're a fitness enthusiast or just starting your wellness journey, UniFit offers intuitive features to track your progress, set personalized goals, and unlock rewards for your achievements.")).toBeTruthy();
    expect(getByText("Join our vibrant community of users and embark on a transformative experience towards better health and well-being. Let's make every step count!")).toBeTruthy();
  });
});
