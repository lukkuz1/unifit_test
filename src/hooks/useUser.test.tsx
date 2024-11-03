import { renderHook, act } from "@testing-library/react-hooks";
import { UserProvider, useUser } from "./useUser";
import { ref, get, update, getDatabase, child } from "firebase/database";

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  get: jest.fn(),
  update: jest.fn(),
  getDatabase: jest.fn().mockReturnValue({}),
  child: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
}));

describe("useUser Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  it("should initialize user correctly", async () => {
    const mockUser = { uid: "123", email: "test@example.com" };
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

    (get as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      val: () => mockUserData,
    });

    (child as jest.Mock).mockReturnValue({});

    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    await act(async () => {
      await result.current.initialize(mockUser);
    });

    expect(result.current.initialized).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.totalPoints).toBe(0);
    expect(result.current.dailyPoints).toBe(0);
  });
});
