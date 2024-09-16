import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import firebaseServices from "src/services/firebase";
const { db, auth } = firebaseServices;

export const getStepCountMissionComplete = async (referenceToMission) => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const currentUserEmail = currentUser.email;
      const missionsQuery = query(
        collection(db, "missions"),
        where("mission_type", "==", "Steps")
      );
      const missionsSnapshot = await getDocs(missionsQuery);
      if (missionsSnapshot.empty) {
        console.log("No missions of type 'Step' found.");
        return;
      }
      const missionDoc = missionsSnapshot.docs[0];
      const userMissionsQuery = query(
        collection(db, "user_missions"),
        where("userEmail", "==", currentUserEmail),
        where("referenceToMission", "==", referenceToMission)
      );
      const userMissionsSnapshot = await getDocs(userMissionsQuery);
      userMissionsSnapshot.forEach(async (userMissionDoc) => {
        const userMissionRef = doc(db, "user_missions", userMissionDoc.id);
        await updateDoc(userMissionRef, {
          completed: true,
        });
      });
      console.log(
        "User missions completed status updated to true for all matching missions"
      );
    }
  } catch (err) {
    console.error("Error fetching or updating user missions:", err);
  }
};

export const getCalorieMissionComplete = async (referenceToMission) => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const currentUserEmail = currentUser.email;
      const missionsQuery = query(
        collection(db, "missions"),
        where("mission_type", "==", "BigMac"),
        where("id", "==", referenceToMission)
      );
      const missionsSnapshot = await getDocs(missionsQuery);
      if (missionsSnapshot.empty) {
        console.log(
          "No mission of type 'BigMac' found with the provided reference."
        );
        return;
      }
      const missionDoc = missionsSnapshot.docs[0];
      const missionData = missionDoc.data();
      const userMissionsQuery = query(
        collection(db, "user_missions"),
        where("userEmail", "==", currentUserEmail),
        where("referenceToMission", "==", referenceToMission)
      );
      const userMissionsSnapshot = await getDocs(userMissionsQuery);
      userMissionsSnapshot.forEach(async (userMissionDoc) => {
        const userMissionRef = doc(db, "user_missions", userMissionDoc.id);
        await updateDoc(userMissionRef, { completed: true });
      });

      console.log(
        "User missions completed status updated to true for all matching missions"
      );
    }
  } catch (err) {
    console.error("Error fetching or updating user missions:", err);
  }
};
