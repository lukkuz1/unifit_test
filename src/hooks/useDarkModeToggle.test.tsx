import useDarkModeToggle from './useDarkModeToggle';
import { fetchDarkModeSetting } from '../constants/DarkMode';
import { act, renderHook } from '@testing-library/react-hooks';

// Mock the fetchDarkModeSetting function
jest.mock('../constants/DarkMode', () => ({
  fetchDarkModeSetting: jest.fn(),
}));

describe('useDarkModeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    jest.useFakeTimers(); // Set up fake timers for controlling intervals
  });

  afterEach(() => {
    jest.clearAllTimers(); // Clear timers after each test
  });
  it('returns true when fetchDarkModeSetting resolves to true', async () => {
    // Mock the fetchDarkModeSetting to return true
    (fetchDarkModeSetting as jest.Mock).mockResolvedValueOnce(true);

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useDarkModeToggle());

    // Wait for the hook to update
    await waitForNextUpdate();

    // Assert: Check the result of the hook
    expect(result.current).toBe(true); // Check if darkMode is set to true
  });

});
