import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Stores from './Stores';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  getDownloadURL: jest.fn(),
}));

const mockStores = [
  {
    id: 'store123',
    store_name: 'Test Store',
    logo_url: 'test_logo_url',
    prizes: [],
  },
];

(getDocs as jest.Mock).mockResolvedValue({
  docs: mockStores.map(store => ({
    id: store.id,
    data: () => store,
  })),
});

(getDownloadURL as jest.Mock).mockResolvedValue('http://mockurl.com/test_logo');

describe('Stores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders stores correctly', async () => {
    const { getByText } = render(<Stores />);
    await waitFor(() => expect(getByText('Test Store')).toBeTruthy());
  });

  it('opens modal on store press', async () => {
    const { getByText } = render(<Stores />);
    await waitFor(() => expect(getByText('Test Store')).toBeTruthy());
    fireEvent.press(getByText('Test Store'));
    await waitFor(() => expect(getByText('Close')).toBeTruthy());
  });
});
