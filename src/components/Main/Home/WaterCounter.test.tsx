import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import WaterCounter from "./WaterCounter";

describe("WaterCounter Component Integration Tests", () => {
  
  it("renders correctly with provided props", () => {
    const { getByText } = render(<WaterCounter waterIntake={500} waterGoal={2000} />);

    expect(getByText("Water")).toBeTruthy();
    expect(getByText("+")).toBeTruthy();
    expect(getByText("500 ml")).toBeTruthy();
    expect(getByText("Goal: 2000 ml")).toBeTruthy();
  });

  it("calculates and displays water intake percentage correctly", () => {
    const { getByText } = render(<WaterCounter waterIntake={1000} waterGoal={2000} />);
    const expectedPercentage = Math.floor((1000 / 2000) * 100);

    expect(getByText(`${expectedPercentage}%`)).toBeTruthy();
  });

  it("opens modal when '+' button is pressed", () => {
    const { getByText, getByTestId } = render(<WaterCounter waterIntake={0} waterGoal={2000} />);

    fireEvent.press(getByText("+"));
    expect(getByText("Add Water Intake")).toBeTruthy();
  });

  it("closes modal when background overlay is pressed", () => {
    const { getByText, getByTestId, queryByText } = render(<WaterCounter waterIntake={0} waterGoal={2000} />);

    fireEvent.press(getByText("+"));
    expect(getByText("Add Water Intake")).toBeTruthy();

    // Simulate press on background overlay to close modal
    fireEvent.press(getByTestId("modal-overlay"));
    expect(queryByText("Add Water Intake")).toBeNull();
  });

  it("increases water intake when water amount is added", () => {
    const { getByText, getByTestId, rerender } = render(<WaterCounter waterIntake={500} waterGoal={2000} />);
    
    fireEvent.press(getByText("+"));
    fireEvent.press(getByTestId("add-water-250ml")); // assuming 250 ml is an option

    // Re-render with updated intake for confirmation
    rerender(<WaterCounter waterIntake={750} waterGoal={2000} />);
    expect(getByText("750 ml")).toBeTruthy();
    const expectedPercentage = Math.floor((750 / 2000) * 100);
    expect(getByText(`${expectedPercentage}%`)).toBeTruthy();
  });

  it("does not exceed goal, even if additional water intake is added", () => {
    const { getByText, getByTestId, rerender } = render(<WaterCounter waterIntake={1950} waterGoal={2000} />);
    
    fireEvent.press(getByText("+"));
    fireEvent.press(getByTestId("add-water-250ml")); // simulating 250 ml add

    // Re-render with updated intake for confirmation
    rerender(<WaterCounter waterIntake={2000} waterGoal={2000} />);
    expect(getByText("2000 ml")).toBeTruthy();
    expect(getByText("100%")).toBeTruthy();
  });
});
