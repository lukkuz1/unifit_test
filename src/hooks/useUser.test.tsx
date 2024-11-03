import { renderHook, act } from '@testing-library/react-hooks';
import { UserProvider, useUser } from './useUser';
import {
  ref,
  get,
  update,
  getDatabase,
  child,
} from 'firebase/database';

// Mock Firebase database functions
jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  get: jest.fn(),
  update: jest.fn(),
  getDatabase: jest.fn().mockReturnValue({}),
  child: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
}));

describe('useUser Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    console.log = jest.fn(); // Suppress console.log
    console.error = jest.fn(); // Suppress console.error
  });

  it('should initialize user correctly', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    const mockUserData = {
      totalPoints: 0,
      dailyPoints: 0,
      steps: { 0: { 0: 0 } },
      distanceHistory: { 0: 0 },
      hourlySteps: 0,
      height: 180,
      weight: 75,
      age: 25,
      stepGoal: 6000,
    };

    // Mock the Firebase get call to return user data
    (get as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      val: () => mockUserData, // Ensure this returns the user data
    });

    // Mock the child function to return a reference
    (child as jest.Mock).mockReturnValue({}); // Mock child function

    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    // Initialize the user
    await act(async () => {
      await result.current.initialize(mockUser);
    });

    // Ensure the user has been initialized correctly
    expect(result.current.initialized).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.totalPoints).toBe(0); // Expecting totalPoints to match
    expect(result.current.dailyPoints).toBe(0); // Expecting dailyPoints to match
  });
});
