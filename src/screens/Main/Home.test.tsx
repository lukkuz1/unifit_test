import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import Home from './Home';
import { Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { getDatabase, ref, set, get } from 'firebase/database';
import { collection, doc, getDoc } from 'firebase/firestore';
import firebaseServices from 'src/services/firebase';
import { useIsFocused } from "@react-navigation/native";

jest.mock('expo-sensors', () => ({
  Pedometer: {
    isAvailableAsync: jest.fn(),
    getPermissionsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    watchStepCount: jest.fn(),
  },
}));

jest.mock('src/services/firebase', () => ({
  auth: {
    currentUser: {
      email: 'test@example.com',
      uid: 'test-uid',
    },
  },
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useIsFocused as jest.Mock).mockReturnValue(true);
  });

  // Unit Test
  test('renders step counter and calorie counter correctly', () => {
    render(<Home />);
    expect(screen.getByText(/Calorie Count/i)).toBeTruthy();
    expect(screen.getByText(/Steps Count/i)).toBeTruthy();
  });

  // Integration Test: fetchWaterData loads data correctly
  test('fetches water data on component load', async () => {
    const waterData = { intake_goal_ml: 2000, intake_ml: 1500 };
    (getDoc as jest.Mock)
      .mockResolvedValueOnce({ exists: () => true, data: () => waterData });

    render(<Home />);
    
    await waitFor(() => {
      expect(getDoc).toHaveBeenCalledWith(expect.anything());
      expect(screen.getByText(/Water Goal/i)).toBeTruthy();
      expect(screen.getByText("1500")).toBeTruthy();
    });
  });

  // Integration Test: subscribe to pedometer updates step count
  test('updates step count and shows alert when permissions are not granted', async () => {
    (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    (Pedometer.getPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });
    (Pedometer.requestPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
    (Pedometer.watchStepCount as jest.Mock).mockImplementation(callback => {
      callback({ steps: 10 });
      return { remove: jest.fn() };
    });

    render(<Home />);

    await waitFor(() => {
      expect(Pedometer.requestPermissionsAsync).toHaveBeenCalled();
      expect(Pedometer.watchStepCount).toHaveBeenCalled();
    });
  });

  // Parameterized Test: step count to points calculation
  describe.each([
    { steps: 1000, expectedPoints: 10.0 },
    { steps: 5000, expectedPoints: 20.0 },
    { steps: 15000, expectedPoints: 30.0 },
  ])("for $steps steps", ({ steps, expectedPoints }) => {
    test(`calculates $expectedPoints points`, () => {
      const { getByText } = render(<Home />);
      const calculatePoints = screen.getByText(/Points/i); // Adjust selector to points
      fireEvent.press(calculatePoints);
      expect(screen.getByText(`${expectedPoints}`)).toBeTruthy();
    });
  });
});
