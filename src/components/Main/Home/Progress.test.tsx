import React from "react";
import { render } from "@testing-library/react-native";
import Progress from "./Progress";
import { useUser } from "src/hooks/useUser";

jest.mock("src/hooks/useUser");

describe("Progress Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Parameterized test for different steps and step goals
  test.each([
    { stepsToday: 3000, stepGoal: 10000, expectedProgress: "30%" },
    { stepsToday: 5000, stepGoal: 10000, expectedProgress: "50%" },
    { stepsToday: 7500, stepGoal: 10000, expectedProgress: "75%" },
    { stepsToday: 10000, stepGoal: 10000, expectedProgress: "100%" },
    { stepsToday: 12000, stepGoal: 10000, expectedProgress: "100%" }, // Test over-goal progress capping
  ])(
    "renders correct progress for %i steps out of %i goal (expecting %s)",
    ({ stepsToday, stepGoal, expectedProgress }) => {
      (useUser as jest.Mock).mockReturnValue({
        initialized: true,
        month: 10,
        day: 1,
        steps: {
          10: {
            1: stepsToday,
          },
        },
        stepGoal,
      });

      const { getByText } = render(<Progress />);
      expect(getByText("Your progress")).toBeTruthy();
      expect(getByText("Today")).toBeTruthy();
      expect(getByText(expectedProgress)).toBeTruthy();
    }
  );


  // Parameterized test for different user states (e.g., uninitialized, different dates)
  test.each([
    { initialized: false, month: 10, day: 1, stepsToday: 0, expectedText: "No progress data" },
    { initialized: true, month: 9, day: 30, stepsToday: 3000, expectedText: "Your progress" },
    { initialized: true, month: 10, day: 2, stepsToday: 4000, expectedText: "Your progress" },
  ])(
    "renders correctly based on user initialization and date",
    ({ initialized, month, day, stepsToday, expectedText }) => {
      (useUser as jest.Mock).mockReturnValue({
        initialized,
        month,
        day,
        steps: { [month]: { [day]: stepsToday } },
        stepGoal: 10000,
      });

      const { getByText } = render(<Progress />);
      expect(getByText(expectedText)).toBeTruthy();
    }
  );
});
