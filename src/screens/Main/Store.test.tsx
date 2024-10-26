import React from "react";
import { render } from "@testing-library/react-native";
import Store from "./Store";
import * as userHook from "src/hooks/useUser";

jest.mock("src/hooks/useUser");

describe("Store Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (userHook.useUser as jest.Mock).mockReturnValue({
      totalPoints: 150,
    });
  });

  it("should display total points correctly", () => {
    const { getByText } = render(<Store />);

    expect(getByText("150")).toBeTruthy();
  });
});
