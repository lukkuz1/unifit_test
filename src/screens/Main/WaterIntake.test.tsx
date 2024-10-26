import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import WaterIntake from "./WaterIntake";
import firebaseServices from "src/services/firebase";

jest.mock("src/services/firebase", () => ({
  auth: {
    currentUser: {
      uid: "testUserUID",
      emailVerified: true,
      isAnonymous: false,
      metadata: {
        creationTime: '2022-01-01T00:00:00Z',
        lastSignInTime: '2022-01-01T00:00:00Z',
      },
      providerData: [],
      displayName: null,
      email: null,
      phoneNumber: null,
      photoURL: null,
    },
  },
  db: {},
  getDoc: jest.fn().mockImplementation(async () => ({
    exists: () => true,
    data: () => ({ intake_goal_ml: 2000 }),
  })),
  setDoc: jest.fn().mockResolvedValue({}),
  updateDoc: jest.fn().mockResolvedValue({}),
}));

describe("WaterIntake Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and display water intake data correctly", async () => {
    const { getByText, getByRole } = render(<WaterIntake onClose={jest.fn()} />);
    expect(getByRole("activityindicator")).toBeTruthy();
    await waitFor(() => {
      expect(getByText("Daily Goal:")).toBeTruthy();
      expect(getByText("ml")).toBeTruthy();
    });
  });
});
