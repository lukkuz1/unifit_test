import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PrizeDropdown from './PrizeDropdown';
import { useUser } from 'src/hooks/useUser';
import { getStorage, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

jest.mock('src/hooks/useUser');

jest.mock('firebase/storage');
jest.mock('firebase/firestore');

const mockUser = {
  user: { uid: 'user123' },
  totalPoints: 100,
  updatePoints: jest.fn(),
};

(useUser as jest.Mock).mockReturnValue(mockUser);

describe('PrizeDropdown', () => {
  const prize = {
    id: 'prize123',
    prize_name: 'Test Prize',
    prize_instructions: 'Instructions for redeeming test prize',
    required_points: 50,
    image_url: 'test_image_url',
  };

  const toggleExpand = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders closed', () => {
    const { getByText } = render(<PrizeDropdown prize={prize} toggleExpand={toggleExpand} isOpen={false} />);
    expect(getByText('Test Prize')).toBeTruthy();
  });

  it('expands and shows details', async () => {
    const mockImageUrl = 'http://mockurl.com/test_image';
    (getDownloadURL as jest.Mock).mockResolvedValue(mockImageUrl);

    const { getByText, getByRole } = render(<PrizeDropdown prize={prize} toggleExpand={toggleExpand} isOpen={true} />);
    
    expect(getByText('Test Prize')).toBeTruthy();
    expect(getByText('Instructions for redeeming test prize')).toBeTruthy();

    await waitFor(() => {
      const image = getByRole('image');
      expect(image.props.source).toEqual({ uri: mockImageUrl });
    });
  });

  it('redeems the prize', async () => {
    (getDoc as jest.Mock).mockResolvedValue({ exists: () => false });
    const { getByText } = render(<PrizeDropdown prize={prize} toggleExpand={toggleExpand} isOpen={true} />);

    fireEvent.press(getByText('Redeem'));
    
    await waitFor(() => {
      expect(getByText('Success')).toBeTruthy();
    });
  });

  it('alerts insufficient points', async () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { uid: 'user123' },
      totalPoints: 30,
      updatePoints: jest.fn(),
    });
    
    const { getByText } = render(<PrizeDropdown prize={prize} toggleExpand={toggleExpand} isOpen={true} />);

    fireEvent.press(getByText('Redeem'));
    
    await waitFor(() => {
      expect(getByText('Insufficient Points')).toBeTruthy();
    });
  });
});
