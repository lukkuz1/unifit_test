import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Missions from './Missions';
import { Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { collection, getDocs, addDoc, query, where, deleteDoc, doc, getDoc } from 'firebase/firestore';

// Inline mock for `expo-sensors` and `Pedometer`
jest.mock('expo-sensors', () => ({
  Pedometer: {
    isAvailableAsync: jest.fn(() => Promise.resolve(true)),
    getPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    watchStepCount: jest.fn(() => ({
      remove: jest.fn(),
    })),
  },
}));

// Inline mock for Firebase Firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock Alert.alert
jest.spyOn(Alert, 'alert');

type MissionData = {
    id: string;
    description: string;
    points: number;
    duration: number;
};

describe('Missions Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Unit Test: Verify initial loading state
    it('renders loading state initially', () => {
        const { getByText } = render(<Missions />);
        expect(getByText('Loading...')).toBeTruthy();
    });

    // Integration Test: Successfully fetches and displays missions
    it('displays missions when fetched successfully', async () => {
        const missionsData: MissionData[] = [
            { id: '1', description: 'Mission 1', points: 10, duration: 7 },
            { id: '2', description: 'Mission 2', points: 20, duration: 14 },
        ];

        const mockSnapshot = {
            docs: missionsData.map((mission) => ({
                id: mission.id,
                data: () => mission,
            })),
        };

        (getDocs as jest.Mock).mockResolvedValueOnce(mockSnapshot);

        const { getByText } = render(<Missions />);

        await waitFor(() => {
            expect(getByText('Mission 1')).toBeTruthy();
            expect(getByText('Mission 2')).toBeTruthy();
        });
    });

    // Integration Test: Displays error message if missions fail to load
    it('displays error message if missions fail to load', async () => {
        (getDocs as jest.Mock).mockRejectedValueOnce(new Error('Error fetching missions'));

        const { getByText } = render(<Missions />);

        await waitFor(() => {
            expect(getByText('Error fetching missions. Please try again later.')).toBeTruthy();
        });
    });

    // Integration Test: Adds mission when user presses on mission description
    it('allows user to add a mission', async () => {
        const missionsData: MissionData[] = [
            { id: '1', description: 'Mission 1', points: 10, duration: 7 },
        ];

        const mockSnapshot = {
            docs: missionsData.map((mission) => ({
                id: mission.id,
                data: () => mission,
            })),
        };

        (getDocs as jest.Mock).mockResolvedValueOnce(mockSnapshot);

        const { getByText } = render(<Missions />);

        await waitFor(() => {
            expect(getByText('Mission 1')).toBeTruthy();
        });

        fireEvent.press(getByText('Mission 1'));

        await waitFor(() => {
            expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
                userEmail: expect.any(String),
                referenceToMission: '1',
                completed: false,
                createdAt: expect.any(Date),
            });
        });
    });

    // Edge Case: Mission already added
    it('alerts user if mission already added', async () => {
        const missionsData: MissionData[] = [
            { id: '1', description: 'Mission 1', points: 10, duration: 7 },
        ];

        const mockSnapshot = {
            docs: missionsData.map((mission) => ({
                id: mission.id,
                data: () => mission,
            })),
        };

        (getDocs as jest.Mock).mockResolvedValueOnce(mockSnapshot);

        const userMissionData = {
            id: '1',
            referenceToMission: '1',
            userEmail: 'test@example.com',
            completed: false,
        };

        (getDocs as jest.Mock).mockResolvedValueOnce({
            docs: [userMissionData],
        });

        const { getByText } = render(<Missions />);

        await waitFor(() => {
            expect(getByText('Mission 1')).toBeTruthy();
        });

        fireEvent.press(getByText('Mission 1'));

        expect(Alert.alert).toHaveBeenCalledWith('Mission already started!');
    });
});
