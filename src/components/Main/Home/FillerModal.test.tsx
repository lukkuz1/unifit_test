import React from "react";
import { render } from "@testing-library/react-native";
import FillerModal from "./FillerModal";

describe("FillerModal Component", () => {
  it("renders correctly with default props", () => {
    const { getByText } = render(<FillerModal />);

    expect(getByText("One step\nat a time")).toBeTruthy();
  });

  it("applies margin styles correctly", () => {
    const { getByText } = render(<FillerModal margin={[10, 20, 30, 40]} />);

    expect(getByText("One step\nat a time")).toBeTruthy();
  });
});
