import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import StepGoal from "./StepGoal";
import { Alert } from "react-native";
import { getDatabase, ref, set, get } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import useDarkModeToggle from "src/hooks/useDarkModeToggle";
import auth from "../../services/firebase";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
}));

jest.mock("src/hooks/useDarkModeToggle", () => jest.fn());

jest.mock("../../services/firebase", () => ({
  auth: {
    currentUser: { uid: "testUserID" },
  },
}));

// Mock Alert.alert
jest.spyOn(Alert, "alert");

describe("StepGoal Component", () => {
  let mockNavigation;
  let dbRef;

  beforeEach(() => {
    mockNavigation = { goBack: jest.fn() };
    dbRef = { key: "user-targets/testUserID" };

    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (ref as jest.Mock).mockReturnValue(dbRef);
    (set as jest.Mock).mockClear();
    (get as jest.Mock).mockClear();
    Alert.alert.mockClear();
  });

  // Unit Test
  test("renders the step goal input field and button correctly", () => {
    const { getByPlaceholderText, getByText } = render(<StepGoal />);
    expect(getByPlaceholderText("Enter Your Step Goal")).toBeTruthy();
    expect(getByText("Add Step Goal")).toBeTruthy();
  });

  // Integration Test: fetchStepGoal successfully retrieves step goal
  test("fetches and displays existing step goal on component load", async () => {
    (get as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      val: () => ({ stepGoal: 5000 }),
    });

    const { getByPlaceholderText } = render(<StepGoal />);

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith(dbRef);
      expect(getByPlaceholderText("Enter Your Step Goal").props.value).toBe("5000");
    });
  });

  // Integration Test: handleAddStepGoal successfully updates step goal
  test("updates step goal and shows success alert on valid input", async () => {
    const newStepGoal = "6000";
    (set as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(<StepGoal />);
    const stepGoalInput = getByPlaceholderText("Enter Your Step Goal");
    const addButton = getByText("Add Step Goal");

    fireEvent.changeText(stepGoalInput, newStepGoal);
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(set).toHaveBeenCalledWith(dbRef, { stepGoal: parseInt(newStepGoal) });
      expect(Alert.alert).toHaveBeenCalledWith("Success", "Step goal successfully updated!", [
        { text: "OK", onPress: expect.any(Function) },
      ]);
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  // Parameterized Test for Valid and Invalid Step Goal Inputs
  describe.each([
    { stepGoal: "5000", shouldUpdate: true },
    { stepGoal: "not_a_number", shouldUpdate: false },
    { stepGoal: "", shouldUpdate: false },
  ])("with step goal: $stepGoal", ({ stepGoal, shouldUpdate }) => {
    test(`step goal should ${shouldUpdate ? "" : "not "}be updated`, async () => {
      const { getByPlaceholderText, getByText } = render(<StepGoal />);
      const stepGoalInput = getByPlaceholderText("Enter Your Step Goal");
      const addButton = getByText("Add Step Goal");

      fireEvent.changeText(stepGoalInput, stepGoal);
      fireEvent.press(addButton);

      await waitFor(() => {
        if (shouldUpdate) {
          expect(set).toHaveBeenCalledWith(dbRef, { stepGoal: parseInt(stepGoal) });
          expect(Alert.alert).toHaveBeenCalledWith("Success", "Step goal successfully updated!", [
            { text: "OK", onPress: expect.any(Function) },
          ]);
        } else {
          expect(set).not.toHaveBeenCalled();
          expect(Alert.alert).toHaveBeenCalledWith("Validation Error", "Please enter a valid step goal.");
        }
      });
    });
  });
});
