import React from 'react';
import { UserProvider, useUser } from './useUser';
import { rtdb } from 'src/services/firebase'; // Mocking the Firebase service
import { set, get } from 'firebase/database';
import { act, render, fireEvent } from '@testing-library/react-native';
import { Button, View, Text } from 'react-native';

// Mock Firebase functions
jest.mock('firebase/database', () => ({
  set: jest.fn(),
  get: jest.fn(),
}));

const MockComponent = () => {
  const userContext = useUser();
  return (
    <View>
      <Text>{userContext.initialized ? 'true' : 'false'}</Text>
      <Button title="Initialize User" onPress={() => userContext.initialize({ email: 'test@example.com', uid: '123' })} />
      <Button title="Destroy User" onPress={userContext.destroy} />
    </View>
  );
};

describe('UserProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks
  });

  it('initializes with default values', () => {
    const { getByText } = render(
      <UserProvider>

      </UserProvider>
    );

    // Assert the default value
    expect(getByText('false')).toBeTruthy(); // Default should be false
  });

  it('initializes user correctly', async () => {
    // Mock the response for getting user data from the database
    (get as jest.Mock).mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      val: jest.fn().mockReturnValue({
        dailyPoints: 10,
        totalPoints: 100,
        distanceHistory: {},
        hourlySteps: 0,
        height: 170,
        weight: 70,
        age: 25,
        stepGoal: 6000,
        steps: {
          0: {
            1: 1000,
          },
        },
      }),
    });

    const { getByText } = render(
      <UserProvider>

      </UserProvider>
    );

    // Act: Initialize the user
    await act(async () => {
      fireEvent.press(getByText('Initialize User')); // Simulate button press
    });

    // Assert: Check if user is initialized
    expect(getByText('true')).toBeTruthy(); // User should be initialized
  });

  it('destroys user correctly', async () => {
    // Mock the response for getting user data from the database
    (get as jest.Mock).mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      val: jest.fn().mockReturnValue({
        dailyPoints: 10,
        totalPoints: 100,
        distanceHistory: {},
        hourlySteps: 0,
        height: 170,
        weight: 70,
        age: 25,
        stepGoal: 6000,
        steps: {
          0: {
            1: 1000,
          },
        },
      }),
    });

    const { getByText } = render(
      <UserProvider>

      </UserProvider>
    );

    // Act: Initialize the user
    await act(async () => {
      fireEvent.press(getByText('Initialize User')); // Simulate button press
    });

    // Act: Destroy the user
    await act(async () => {
      fireEvent.press(getByText('Destroy User')); // Simulate button press
    });

    // Assert: Check if user is destroyed
    expect(getByText('false')).toBeTruthy(); // User should be destroyed
  });
});
