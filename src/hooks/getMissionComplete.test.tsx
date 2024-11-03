import {
  getStepCountMissionComplete,
  getCalorieMissionComplete,
} from "./getMissionComplete";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import firebaseServices from "src/services/firebase";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock("src/services/firebase", () => ({
  db: {},
  auth: { currentUser: { email: "testuser@example.com" } },
}));

describe("Mission Completion Functions", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getStepCountMissionComplete", () => {
    

    it("logs a message if no 'Steps' missions are found", async () => {
      (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });

      await getStepCountMissionComplete("referenceMission");

      expect(console.log).toHaveBeenCalledWith("No missions of type 'Step' found.");
    });

    it("handles errors during mission query and update", async () => {
      const mockError = new Error("Firestore error");
      (getDocs as jest.Mock).mockRejectedValueOnce(mockError);

      await getStepCountMissionComplete("referenceMission");

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching or updating user missions:",
        mockError
      );
    });
  });

  describe("getCalorieMissionComplete", () => {

    it("logs a message if no 'BigMac' mission is found", async () => {
      (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });

      await getCalorieMissionComplete("referenceMission");

      expect(console.log).toHaveBeenCalledWith(
        "No mission of type 'BigMac' found with the provided reference."
      );
    });

    it("handles errors during calorie mission query and update", async () => {
      const mockError = new Error("Firestore error");
      (getDocs as jest.Mock).mockRejectedValueOnce(mockError);

      await getCalorieMissionComplete("referenceMission");

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching or updating user missions:",
        mockError
      );
    });
  });

  describe.each([
    ["Steps", "Step", getStepCountMissionComplete],
    ["BigMac", "BigMac", getCalorieMissionComplete],
  ])(
    "Parameterized tests for different mission types",
    (missionType, missionMessage, missionCompleteFunction) => {
    

      it(`handles errors gracefully for '${missionType}' missions`, async () => {
        const mockError = new Error("Firestore error");
        (getDocs as jest.Mock).mockRejectedValueOnce(mockError);

        await missionCompleteFunction("referenceMission");

        expect(console.error).toHaveBeenCalledWith(
          "Error fetching or updating user missions:",
          mockError
        );
      });
    }
  );
});
