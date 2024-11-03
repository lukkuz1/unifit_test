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
  it("returns true when fetchDarkModeSetting resolves to true", async () => {
    (fetchDarkModeSetting as jest.Mock).mockResolvedValueOnce(true);
    const { result, waitForNextUpdate } = renderHook(() => useDarkModeToggle());
    await waitForNextUpdate();
    expect(result.current).toBe(true);
  });
});
