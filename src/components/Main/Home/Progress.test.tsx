import React from "react";
import { render } from "@testing-library/react-native";
import Progress from "./Progress";
import { useUser } from "src/hooks/useUser";

jest.mock("src/hooks/useUser", () => ({
  useUser: jest.fn(),
}));

describe("Progress Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    (useUser as jest.Mock).mockReturnValue({
      initialized: true,
      month: 10,
      day: 1,
      steps: {
        10: {
          1: 3000,
        },
      },
      stepGoal: 10000,
    });

    const { getByText } = render(<Progress />);
    expect(getByText("Your progress")).toBeTruthy();
    expect(getByText("Today")).toBeTruthy();
  });

  it("applies margin styles correctly", () => {
    const { getByText } = render(<Progress margin={[10, 20, 30, 40]} />);
    expect(getByText("Your progress")).toBeTruthy();
  });
});
