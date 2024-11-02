// useDarkModeToggle.test.tsx
import useDarkModeToggle from './useDarkModeToggle';
import { fetchDarkModeSetting } from '../constants/DarkMode';
import { act, renderHook } from '@testing-library/react-native';

// Mock the fetchDarkModeSetting function
jest.mock('../constants/DarkMode', () => ({
  fetchDarkModeSetting: jest.fn(),
}));

describe('useDarkModeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    jest.useFakeTimers(); // Set up fake timers
  });

  afterEach(() => {
    jest.clearAllTimers(); // Clear timers after each test
  });

  it('returns dark mode setting', async () => {
    // Arrange: Set up the mock to return a value
    (fetchDarkModeSetting as jest.Mock).mockResolvedValueOnce(true); // Simulate the function returning true

    // Act: Render the hook
    const { result } = renderHook(() => useDarkModeToggle());

    // Advance timers to allow useEffect to run
    act(() => {
      jest.runAllTimers(); // Fast-forward time
    });

    // Assert: Check the result of the hook
    expect(result.current).toBe(true); // Check if darkMode is set to true
  });

  it('updates dark mode setting on interval', async () => {
    // Arrange: Set the mock to return false initially, then true
    (fetchDarkModeSetting as jest.Mock)
      .mockResolvedValueOnce(false) // First call, returns false
      .mockResolvedValueOnce(true); // Second call, returns true

    // Act: Render the hook
    const { result } = renderHook(() => useDarkModeToggle());

    // Advance timers to allow the initial fetch to complete
    act(() => {
      jest.runAllTimers(); // Fast-forward time to trigger the first fetch
    });

    // Assert that the dark mode is initially false
    expect(result.current).toBe(false); // Verify first state

    // Manually advance timers to simulate the interval callback
    act(() => {
      jest.advanceTimersByTime(100); // Fast-forward time to trigger the second fetch
    });

    // Advance timers again to allow the second fetch to complete
    act(() => {
      jest.runAllTimers(); // Fast-forward time to ensure all promises resolve
    });

    // Assert that the dark mode has updated to true
    expect(result.current).toBe(true); // Verify second state
  });
});
