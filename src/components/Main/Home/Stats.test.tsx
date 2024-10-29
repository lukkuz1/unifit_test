import React from "react";
import { render } from "@testing-library/react-native";
import Stats from "./Stats";

describe("Stats Component", () => {
  // Parameterized test for rendering time in hours and minutes
  test.each([
    { time: 3600, expectedTimeText: "1h 0m" },
    { time: 7200, expectedTimeText: "2h 0m" },
    { time: 5400, expectedTimeText: "1h 30m" },
    { time: 0, expectedTimeText: "0h 0m" },
  ])("renders correctly for time %i seconds", ({ time, expectedTimeText }) => {
    const { getByText } = render(<Stats time={time} stepCount={5000} />);
    expect(getByText(expectedTimeText)).toBeTruthy();
  });

  // Parameterized test for calories calculation based on step count
  test.each([
    { stepCount: 5000, expectedCalories: "225" },
    { stepCount: 10000, expectedCalories: "450" },
    { stepCount: 0, expectedCalories: "0" },
    { stepCount: 7500, expectedCalories: "337.5" },
  ])("renders correct calories for step count %i", ({ stepCount, expectedCalories }) => {
    const { getByText } = render(<Stats time={3600} stepCount={stepCount} />);
    expect(getByText(expectedCalories)).toBeTruthy();
  });

  // Parameterized test for distance calculation based on step count
  test.each([
    { stepCount: 5000, expectedDistanceKm: "3.81" },
    { stepCount: 10000, expectedDistanceKm: "7.62" },
    { stepCount: 0, expectedDistanceKm: "0.00" },
    { stepCount: 7500, expectedDistanceKm: "5.72" },
  ])("renders correct distance for step count %i", ({ stepCount, expectedDistanceKm }) => {
    const { getByText } = render(<Stats time={3600} stepCount={stepCount} />);
    expect(getByText(expectedDistanceKm)).toBeTruthy();
  });
});
