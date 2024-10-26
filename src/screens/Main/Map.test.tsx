import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import MapPage from './Map';
import * as firebaseServices from 'src/services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { DocumentData } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

describe('MapPage', () => {
  beforeEach(() => {
    const mockHotZones = [
      { id: '1', name: 'Karštoji Zona 1', coordinates: { lat: 37.78825, lng: -122.4324 } },
      { id: '2', name: 'Karštoji Zona 2', coordinates: { lat: 37.78825, lng: -122.4324 } },
    ];

    (collection as jest.Mock).mockReturnValue({
      getDocs: jest.fn().mockResolvedValue({
        docs: mockHotZones.map(zone => ({
          id: zone.id,
          data: () => zone,
        })),
      }),
    });
  });

  it('should render hot zones correctly', async () => {
    render(<MapPage />);
    await waitFor(() => {
      expect(screen.getByText('Karštoji Zona 1')).toBeTruthy();
      expect(screen.getByText('Karštoji Zona 2')).toBeTruthy();
    });
  });
});
