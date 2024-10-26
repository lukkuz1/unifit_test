import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import WaterCounter from "./WaterCounter";

describe("WaterCounter Component", () => {
  it("renders correctly with provided props", () => {
    const { getByText } = render(<WaterCounter waterIntake={500} waterGoal={2000} />);

    expect(getByText("Water")).toBeTruthy();
    expect(getByText("+")).toBeTruthy();
  });

  it("calculates water intake percentage correctly", () => {
    const { getByText } = render(<WaterCounter waterIntake={1000} waterGoal={2000} />);
    const liquidGaugeValue = Math.floor((1000 / 2000) * 100);

    expect(getByText(`${liquidGaugeValue}`)).toBeTruthy();
  });

  it("opens modal when button is pressed", () => {
    const { getByText, getByTestId } = render(<WaterCounter waterIntake={0} waterGoal={2000} />);

    fireEvent.press(getByText("+"));
    expect(getByText("WaterIntake")).toBeTruthy();
  });

  it("closes modal when background is pressed", () => {
    const { getByText } = render(<WaterCounter waterIntake={0} waterGoal={2000} />);
    
    fireEvent.press(getByText("+"));
    fireEvent.press(getByText("WaterIntake"));
    expect(getByText("WaterIntake")).toBeFalsy();
  });
});
