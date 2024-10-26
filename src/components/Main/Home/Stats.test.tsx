import React from "react";
import { render } from "@testing-library/react-native";
import Stats from "./Stats";

describe("Stats Component", () => {
  it("renders correctly with provided props", () => {
    const { getByText } = render(<Stats time={3600} stepCount={5000} />);

    expect(getByText("1h 0m")).toBeTruthy();
    expect(getByText("225")).toBeTruthy();
    expect(getByText("3.81")).toBeTruthy();
  });

  it("renders correctly with default margin", () => {
    const { getByText } = render(<Stats time={7200} stepCount={10000} />);

    expect(getByText("2h 0m")).toBeTruthy();
    expect(getByText("450")).toBeTruthy();
    expect(getByText("7.62")).toBeTruthy();
  });

  it("applies margin styles correctly", () => {
    const { getByText } = render(<Stats time={0} stepCount={0} margin={[10, 20, 30, 40]} />);
    expect(getByText("time")).toBeTruthy();
  });
});
