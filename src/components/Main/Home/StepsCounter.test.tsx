import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import StepsCounter from "./StepsCounter";

describe("StepsCounter Component Integration Tests", () => {
  
  it("displays the correct step count and target when initialized", () => {
    const { getByText } = render(<StepsCounter stepCount={1000} target={5000} />);
    
    expect(getByText("1000")).toBeTruthy();
    expect(getByText("Steps")).toBeTruthy();
    expect(getByText("Goal: 5000")).toBeTruthy();
  });

  it("shows a congratulatory message when the target is reached", () => {
    const { getByText } = render(<StepsCounter stepCount={5000} target={5000} />);
    
    expect(getByText("5000")).toBeTruthy();
    expect(getByText("Steps")).toBeTruthy();
    expect(getByText("Congratulations! Target reached")).toBeTruthy();
  });

  it("updates dynamically when step count changes", () => {
    const { getByText, rerender } = render(<StepsCounter stepCount={2000} target={5000} />);
    
    expect(getByText("2000")).toBeTruthy();
    expect(getByText("Steps")).toBeTruthy();
    expect(getByText("Goal: 5000")).toBeTruthy();

    // Simulate step count update
    rerender(<StepsCounter stepCount={4000} target={5000} />);
    expect(getByText("4000")).toBeTruthy();
  });

  it("displays the correct progress percentage", () => {
    const { getByText } = render(<StepsCounter stepCount={2500} target={5000} />);

    expect(getByText("2500")).toBeTruthy();
    expect(getByText("Steps")).toBeTruthy();
    expect(getByText("50%")).toBeTruthy();
  });

  it("handles zero steps gracefully", () => {
    const { getByText } = render(<StepsCounter stepCount={0} target={5000} />);
    
    expect(getByText("0")).toBeTruthy();
    expect(getByText("Steps")).toBeTruthy();
    expect(getByText("0%")).toBeTruthy();
  });

  it("does not display 'target reached' message if below target", () => {
    const { getByText, queryByText } = render(<StepsCounter stepCount={4000} target={5000} />);
    
    expect(getByText("4000")).toBeTruthy();
    expect(getByText("Steps")).toBeTruthy();
    expect(queryByText("Congratulations! Target reached")).toBeNull();
  });
});
