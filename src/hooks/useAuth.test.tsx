// src/hooks/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from './useAuth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';

// Mock Firebase authentication functions
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

// Mock Firebase services
jest.mock('src/services/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn((callback) => {
      callback(null); // Initially set user to null
      return jest.fn(); // Return unsubscribe function
    }),
  },
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should sign up a user', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    const mockUserCredential = { user: mockUser };

    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(mockUserCredential);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      const response = await result.current.signUp('test@example.com', 'password');
      expect(response).toEqual(mockUserCredential); // Expect the response to match mockUserCredential
    });

    expect(result.current.user).toEqual(mockUser); // Expect user to be set after sign up
  });

  it('should sign in a user', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    const mockUserCredential = { user: mockUser };

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(mockUserCredential);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      const response = await result.current.signIn('test@example.com', 'password');
      expect(response).toEqual(mockUserCredential); // Expect the response to match mockUserCredential
    });

    expect(result.current.user).toEqual(mockUser); // Expect user to be set after sign in
  });

  it('should sign out a user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull(); // Expect user to be null after sign out
  });

  it('handles sign up errors gracefully', async () => {
    const mockError = new Error('auth/invalid-email');
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    const response = await result.current.signUp('test@example.com', 'password');
    expect(response).toEqual(mockError.message); // Expect the error message to match
  });

  it('handles sign in errors gracefully', async () => {
    const mockError = new Error('auth/user-not-found');
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    const response = await result.current.signIn('test@example.com', 'password');
    expect(response).toEqual(mockError.message); // Expect the error message to match
  });

  it('handles sign out errors gracefully', async () => {
    const mockError = new Error('auth/no-current-user');
    (firebaseSignOut as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull(); // Expect user to be null even after error
  });
});
