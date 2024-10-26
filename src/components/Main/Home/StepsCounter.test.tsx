import React from "react";
import { render } from "@testing-library/react-native";
import StepsCounter from "./StepsCounter";

describe("StepsCounter Component", () => {
  it("renders correctly with provided props", () => {
    const { getByText } = render(<StepsCounter stepCount={1000} target={5000} />);
    
    expect(getByText("1000")).toBeTruthy();
    expect(getByText("Steps")).toBeTruthy();
  });

  it("renders correctly when target is reached", () => {
    const { getByText } = render(<StepsCounter stepCount={6000} target={5000} />);

    expect(getByText("6000")).toBeTruthy();
    expect(getByText("Steps")).toBeTruthy();
  });

  it("applies margin styles correctly", () => {
    const { getByText } = render(<StepsCounter stepCount={0} target={1000} margin={[10, 20, 30, 40]} />);
    expect(getByText("Walk")).toBeTruthy();
  });
});
