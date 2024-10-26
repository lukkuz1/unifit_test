import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Profile from "./Profile";
import * as userHook from "src/hooks/useUser";
import * as authHook from "src/hooks/useAuth";
import { Alert } from "react-native";


jest.mock("src/hooks/useUser");
jest.mock("src/hooks/useAuth");

describe("Profile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (userHook.useUser as jest.Mock).mockReturnValue({
      user: { weight: 70, height: 175, age: 25, stepGoal: 10000 },
      updateDataJSON: jest.fn().mockResolvedValue({}),
    });

    (authHook.useAuth as jest.Mock).mockReturnValue({
      signOut: jest.fn(),
    });
  });

  it("should save user data when Save button is pressed", async () => {
    const { getByText, getByPlaceholderText } = render(<Profile />);

    fireEvent.changeText(getByPlaceholderText("70"), "75");
    fireEvent.changeText(getByPlaceholderText("175"), "180");
    fireEvent.changeText(getByPlaceholderText("25"), "26");
    fireEvent.changeText(getByPlaceholderText("10000"), "12000");


    fireEvent.press(getByText("Save"));

    await waitFor(() => {
      expect(userHook.useUser().updateDataJSON).toHaveBeenCalledWith({
        weight: 75,
        height: 180,
        age: 26,
        stepGoal: 12000,
      });
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Success",
      "Data was successfully saved"
    );
  });
});
