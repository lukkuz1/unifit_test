import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Missions from './Missions';
import * as firebaseServices from 'src/services/firebase'; 
import { QuerySnapshot } from 'firebase/firestore';

type MissionData = {
    id: string;
    description: string;
    points: number;
    duration: number;
};

jest.mock('src/services/firebase', () => ({
    ...jest.requireActual('src/services/firebase'),
    getDocs: jest.fn() as jest.MockedFunction<typeof firebaseServices.getDocs>,
    addDoc: jest.fn() as jest.MockedFunction<typeof firebaseServices.addDoc>,
}));

describe('Missions Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render loading state initially', () => {
        const { getByText } = render(<Missions />);
        expect(getByText('Loading...')).toBeTruthy();
    });

    it('should display missions when fetched successfully', async () => {
        const missionsData: MissionData[] = [
            { id: '1', description: 'Mission 1', points: 10, duration: 7 },
            { id: '2', description: 'Mission 2', points: 20, duration: 14 },
        ];

        const mockSnapshot: QuerySnapshot<MissionData> = {
            docs: missionsData.map((mission) => ({
                id: mission.id,
                data: () => mission,
            })),
        } as any;

        (firebaseServices.getDocs as jest.Mock).mockResolvedValueOnce(mockSnapshot);

        const { getByText } = render(<Missions />);

        await waitFor(() => {
            expect(getByText('Mission 1')).toBeTruthy();
            expect(getByText('Mission 2')).toBeTruthy();
        });
    });

    it('should show an error message if missions fail to load', async () => {
        (firebaseServices.getDocs as jest.Mock).mockRejectedValueOnce(new Error('Error fetching missions'));

        const { getByText } = render(<Missions />);

        await waitFor(() => {
            expect(getByText('Error fetching missions. Please try again later.')).toBeTruthy();
        });
    });

    it('should allow user to add a mission', async () => {
        const missionsData: MissionData[] = [
            { id: '1', description: 'Mission 1', points: 10, duration: 7 },
        ];

        const mockSnapshot: QuerySnapshot<MissionData> = {
            docs: missionsData.map((mission) => ({
                id: mission.id,
                data: () => mission,
            })),
        } as any;

        (firebaseServices.getDocs as jest.Mock).mockResolvedValueOnce(mockSnapshot);

        const { getByText } = render(<Missions />);

        await waitFor(() => {
            expect(getByText('Mission 1')).toBeTruthy();
        });

        fireEvent.press(getByText('Mission 1'));

        expect(firebaseServices.addDoc).toHaveBeenCalled();
    });
});
