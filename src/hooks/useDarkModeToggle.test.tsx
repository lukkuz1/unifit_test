import useDarkModeToggle from "./useDarkModeToggle";
import { fetchDarkModeSetting } from "../constants/DarkMode";
import { act, renderHook } from "@testing-library/react-hooks";

jest.mock("../constants/DarkMode", () => ({
  fetchDarkModeSetting: jest.fn(),
}));

describe("useDarkModeToggle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("returns false initially", () => {
    const { result } = renderHook(() => useDarkModeToggle());
    expect(result.current).toBe(false);
  });

  it("returns true when fetchDarkModeSetting resolves to true", async () => {
    (fetchDarkModeSetting as jest.Mock).mockResolvedValueOnce(true);
    const { result, waitForNextUpdate } = renderHook(() => useDarkModeToggle());

    await waitForNextUpdate();
    expect(result.current).toBe(true);
  });

  it("updates darkMode state periodically", async () => {
    (fetchDarkModeSetting as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const { result, waitForNextUpdate } = renderHook(() => useDarkModeToggle());

    await waitForNextUpdate();
    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    await waitForNextUpdate();
    expect(result.current).toBe(false);
  });
});

describe("useDarkModeToggle with multiple settings", () => {
  const testCases = [{ setting: true, expected: true }];

  testCases.forEach(({ setting, expected }) => {
    it(`returns ${expected} when fetchDarkModeSetting resolves to ${setting}`, async () => {
      (fetchDarkModeSetting as jest.Mock).mockResolvedValueOnce(setting);
      const { result, waitForNextUpdate } = renderHook(() =>
        useDarkModeToggle()
      );

      await waitForNextUpdate();
      expect(result.current).toBe(expected);
    });
  });
});
