import { renderHook, act } from "@testing-library/react-hooks";
import { UserProvider, useUser } from "./useUser";
import { ref, get, update, getDatabase, child } from "firebase/database";
import { rtdb } from "src/services/firebase";

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
      height: 0,
      weight: 0,
      age: 0,
      stepGoal: 0,
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
    expect(result.current.dailyPoints).toBe(mockUserData.dailyPoints);
    expect(result.current.height).toBe(mockUserData.height);
    expect(result.current.weight).toBe(mockUserData.weight);
    expect(result.current.age).toBe(mockUserData.age);
    expect(result.current.stepGoal).toBe(mockUserData.stepGoal);
  });

  it("should update points correctly", async () => {
    const mockUser = { uid: "123", email: "test@example.com" };
    const mockUserData = {
      totalPoints: 10,
      dailyPoints: 5,
    };

    (get as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      val: () => mockUserData,
    });

    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    await act(async () => {
      await result.current.initialize(mockUser);
    });

    await act(async () => {
      await result.current.updatePoints(100);
    });

    expect(update).toHaveBeenCalledWith(ref(rtdb, `users/${mockUser.uid}`), {
      totalPoints: 100,
    });
    expect(result.current.totalPoints).toBe(100);
  });

  it("should handle errors during update points", async () => {
    const mockUser = { uid: "123", email: "test@example.com" };
    const mockUserData = {
      totalPoints: 0,
      dailyPoints: 0,
    };

    (get as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      val: () => mockUserData,
    });

    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    await act(async () => {
      await result.current.initialize(mockUser);
    });

    (update as jest.Mock).mockRejectedValueOnce(new Error("Update failed"));

    await act(async () => {
      await result.current.updatePoints(200);
    });

    expect(console.error).toHaveBeenCalledWith(
      "Failed to update points",
      expect.any(Error)
    );
  });

  const calculatePointsTestCases = [
    { steps: 0, expectedPoints: 0 },
    { steps: 6000, expectedPoints: 1 },
    { steps: 12000, expectedPoints: 2 },
    { steps: 18000, expectedPoints: 3 },
  ];

  describe("Points Calculation", () => {
    test.each(calculatePointsTestCases)(
      "should calculate correct points for $steps steps",
      async ({ steps, expectedPoints }) => {
        const mockUser = { uid: "123", email: "test@example.com" };
        const mockUserData = {
          totalPoints: 0,
          dailyPoints: 0,
          steps: { 0: { 0: steps } },
        };

        (get as jest.Mock).mockResolvedValueOnce({
          exists: () => true,
          val: () => mockUserData,
        });

        const { result } = renderHook(() => useUser(), {
          wrapper: UserProvider,
        });

        await act(async () => {
          await result.current.initialize(mockUser);
        });

        result.current.totalPoints = Math.floor(steps / 6000);

        expect(result.current.totalPoints).toBe(expectedPoints);
      }
    );
  });
});
