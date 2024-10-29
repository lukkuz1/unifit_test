import { getStepCountMissionComplete, getCalorieMissionComplete } from "./getMissionComplete";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import firebaseServices from "src/services/firebase";

jest.mock("firebase/firestore");
jest.mock("src/services/firebase", () => ({
  db: {},
  auth: { currentUser: { email: "testuser@example.com" } },
}));

describe("Mission Completion Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getStepCountMissionComplete", () => {
    it("completes user missions for 'Steps' type when a mission is found", async () => {
      const mockMissionsSnapshot = {
        empty: false,
        docs: [{ id: "mission1", data: () => ({ mission_type: "Steps" }) }],
      };
      const mockUserMissionsSnapshot = {
        empty: false,
        forEach: jest.fn((callback) =>
          callback({ id: "userMission1", data: () => ({}) })
        ),
      };

      // Provide the mock snapshot to be resolved
      (getDocs as jest.Mock)
        .mockResolvedValueOnce(mockMissionsSnapshot) // for missions query
        .mockResolvedValueOnce(mockUserMissionsSnapshot); // for user missions query
      (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

      await getStepCountMissionComplete("referenceMission");

      expect(collection).toHaveBeenCalledWith(expect.anything(), "missions");
      expect(where).toHaveBeenCalledWith("mission_type", "==", "Steps");
      expect(getDocs).toHaveBeenCalledTimes(2);
      expect(updateDoc).toHaveBeenCalledWith(
        expect.objectContaining({ id: "userMission1" }),
        { completed: true }
      );
    });

    it("logs a message if no 'Steps' missions are found", async () => {
      const consoleSpy = jest.spyOn(console, "log");
      (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });

      await getStepCountMissionComplete("referenceMission");

      expect(consoleSpy).toHaveBeenCalledWith("No missions of type 'Step' found.");
      consoleSpy.mockRestore();
    });

    it("handles errors during mission query and update", async () => {
      const consoleSpy = jest.spyOn(console, "error");
      const mockError = new Error("Firestore error");
      (getDocs as jest.Mock).mockRejectedValueOnce(mockError);

      await getStepCountMissionComplete("referenceMission");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching or updating user missions:",
        mockError
      );
      consoleSpy.mockRestore();
    });
  });

  describe("getCalorieMissionComplete", () => {
    it("completes user missions for 'BigMac' type when a mission is found", async () => {
      const mockMissionsSnapshot = {
        empty: false,
        docs: [{ id: "mission2", data: () => ({ mission_type: "BigMac" }) }],
      };
      const mockUserMissionsSnapshot = {
        empty: false,
        forEach: jest.fn((callback) =>
          callback({ id: "userMission2", data: () => ({}) })
        ),
      };

      (getDocs as jest.Mock)
        .mockResolvedValueOnce(mockMissionsSnapshot) // for missions query
        .mockResolvedValueOnce(mockUserMissionsSnapshot); // for user missions query
      (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

      await getCalorieMissionComplete("referenceMission");

      expect(collection).toHaveBeenCalledWith(expect.anything(), "missions");
      expect(where).toHaveBeenCalledWith("mission_type", "==", "BigMac");
      expect(where).toHaveBeenCalledWith("id", "==", "referenceMission");
      expect(getDocs).toHaveBeenCalledTimes(2);
      expect(updateDoc).toHaveBeenCalledWith(
        expect.objectContaining({ id: "userMission2" }),
        { completed: true }
      );
    });

    it("logs a message if no 'BigMac' mission is found", async () => {
      const consoleSpy = jest.spyOn(console, "log");
      (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });

      await getCalorieMissionComplete("referenceMission");

      expect(consoleSpy).toHaveBeenCalledWith(
        "No mission of type 'BigMac' found with the provided reference."
      );
      consoleSpy.mockRestore();
    });

    it("handles errors during calorie mission query and update", async () => {
      const consoleSpy = jest.spyOn(console, "error");
      const mockError = new Error("Firestore error");
      (getDocs as jest.Mock).mockRejectedValueOnce(mockError);

      await getCalorieMissionComplete("referenceMission");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching or updating user missions:",
        mockError
      );
      consoleSpy.mockRestore();
    });
  });
});
