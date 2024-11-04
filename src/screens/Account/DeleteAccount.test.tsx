import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DeleteAccount from './DeleteAccount';
import { useNavigation } from '@react-navigation/native';
import { getAuth, deleteUser } from '@firebase/auth';
import { useAuth } from 'src/hooks/useAuth';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@firebase/auth', () => ({
  getAuth: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock('src/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('src/hooks/useDarkModeToggle', () => jest.fn());

describe('DeleteAccount Component', () => {
  let mockNavigation;
  let mockUserInfo;

  beforeEach(() => {
    mockNavigation = { navigate: jest.fn() };
    mockUserInfo = { signOut: jest.fn() };

    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useAuth as jest.Mock).mockReturnValue(mockUserInfo);
    (getAuth as jest.Mock).mockReturnValue({ currentUser: { uid: '123' } });
  });

  // Unit Test
  test('renders delete button and text correctly', () => {
    const { getByText } = render(<DeleteAccount />);
    expect(getByText('Delete your account')).toBeTruthy();
    expect(getByText('Delete Account')).toBeTruthy();
  });

  // Integration Test
  test('calls deleteUser and signs out on successful deletion', async () => {
    deleteUser.mockResolvedValueOnce(undefined); // Mock successful deletion
    const { getByText } = render(<DeleteAccount />);

    const deleteButton = getByText('Delete Account');
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith({ uid: '123' });
      expect(mockUserInfo.signOut).toHaveBeenCalled();
    });
  });

  // Parameterized Test
  describe.each([
    { deletionSuccess: true, alertMessage: 'Your account has been successfully deleted.' },
    { deletionSuccess: false, alertMessage: 'Account Deletion Failed' },
  ])('when deletion is $deletionSuccess', ({ deletionSuccess, alertMessage }) => {
    test(`displays correct alert: "${alertMessage}"`, async () => {
      if (deletionSuccess) {
        deleteUser.mockResolvedValueOnce(undefined);
      } else {
        deleteUser.mockRejectedValueOnce(new Error(alertMessage));
      }

      const { getByText } = render(<DeleteAccount />);

      const deleteButton = getByText('Delete Account');
      fireEvent.press(deleteButton);

      await waitFor(() => {
        expect(deleteUser).toHaveBeenCalledWith({ uid: '123' });
        if (deletionSuccess) {
          expect(mockUserInfo.signOut).toHaveBeenCalled();
        } else {
          expect(mockUserInfo.signOut).not.toHaveBeenCalled();
        }
      });
    });
  });
});
