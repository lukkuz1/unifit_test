import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable,
} from "react-native";
import { Pedometer } from "expo-sensors";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "src/constants/Colors";
import firebaseServices from "src/services/firebase";
import {
  getStepCountMissionComplete,
  getCalorieMissionComplete,
} from "src/hooks/getMissionComplete";
import { useUser } from "src/hooks/useUser";
import CalorieCounter from "../../components/Main/Home/CalorieCounter";
import StepCounter from "../../components/Main/Home/StepsCounter";
import { get, ref, set, update } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import FootstepsIcon from "src/assets/svg/footsteps.svg";

const { db, auth } = firebaseServices;

const Missions = () => {
  const user = useUser();
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [userMissions, setUserMissions] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const stepCb = useRef<Function>();
  const pointsCb = useRef<Function>();
  const [pastStepCount, setPastStepCount] = useState<number>(0);
  const [stepCount, updateStepCount] = useState<number>(0);
  const [hourlySteps, updateHourlySteps] = useState<number>(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();

    if (isAvailable) {
      return Pedometer.watchStepCount(() => {
        updateStepCount((stepCount) => stepCount + 1);
        updateHourlySteps((hourlySteps) => hourlySteps + 1);
      });
    }
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const getCalories = (): number => {
    return (pastStepCount + stepCount) * 0.045;
  };

  const checkStepCountMissionStatus = async (referenceToMission) => {
    try {
      const userEmail = auth.currentUser.email;
      const userMissionQuerySnapshot = await getDocs(
        query(
          collection(db, "user_missions"),
          where("userEmail", "==", userEmail),
          where("referenceToMission", "==", referenceToMission)
        )
      );
      if (userMissionQuerySnapshot.empty) {
        return;
      }
      const missionDoc = await doc(db, "missions", referenceToMission);
      const missionSnapshot = await getDoc(missionDoc);
      const missionData = missionSnapshot.data();
      if (!missionData) {
        console.error("Mission not found!");
        return;
      }
      const stepsToWalk = missionData.stepCount;
      if (
        pastStepCount + stepCount >= stepsToWalk &&
        userMissionQuerySnapshot.size > 0
      ) {
        handleStepCountMissionComplete(referenceToMission);
      }
    } catch (error) {
      console.error("Error checking step count mission status:", error);
    }
  };

  const checkCalorieCountMissionStatus = async (referenceToMission) => {
    try {
      const userEmail = auth.currentUser.email;
      const userMissionQuerySnapshot = await getDocs(
        query(
          collection(db, "user_missions"),
          where("userEmail", "==", userEmail),
          where("referenceToMission", "==", referenceToMission)
        )
      );
      if (userMissionQuerySnapshot.empty) {
        return;
      }
      const missionDoc = await doc(db, "missions", referenceToMission);
      const missionSnapshot = await getDoc(missionDoc);
      const missionData = missionSnapshot.data();
      if (!missionData) {
        console.error("Mission not found!");
        return;
      }
      let caloriesToBurn = 0;
      if (
        missionData.mission_type === "BigMac" &&
        userMissionQuerySnapshot.size > 0
      ) {
        const bigMacCount = missionData.bigMacCount;
        const caloriesPerBigMac = 563;
        caloriesToBurn = bigMacCount * caloriesPerBigMac;
        if (getCalories() >= caloriesToBurn) {
          handleCalorieMissionComplete(referenceToMission);
        }
      }
    } catch (error) {
      console.error("Error checking calorie count mission status:", error);
    }
  };

  const fetchMissions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "missions"));
      const missionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMissions(missionsData);
    } catch (err) {
      console.error("Error fetching missions:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserEmail = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setCurrentUserEmail(currentUser.email);
    }
  };

  const fetchUserMissions = async () => {
    try {
      const q = query(
        collection(db, "user_missions"),
        where("userEmail", "==", currentUserEmail)
      );
      const querySnapshot = await getDocs(q);
      const userMissionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserMissions(userMissionsData);
    } catch (err) {
      console.error("Error fetching user missions:", err);
    }
  };

  useEffect(() => {
    getCurrentUserEmail();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMissions();
      if (currentUserEmail) {
        fetchUserMissions();
      }
    }, [currentUserEmail])
  );

  const handleAddMission = async (referenceToMission) => {
    try {
      const isMissionAdded = userMissions.some(
        (mission) =>
          mission.referenceToMission === referenceToMission &&
          mission.userEmail === currentUserEmail
      );
      if (isMissionAdded) {
        Alert.alert("Mission already started!");
        return;
      }
      const missionDocRef = await addDoc(collection(db, "user_missions"), {
        userEmail: currentUserEmail,
        referenceToMission,
        completed: false,
        createdAt: new Date(),
      });
      setUserMissions((prevMissions) => [
        ...prevMissions,
        {
          id: missionDocRef.id,
          referenceToMission,
          userEmail: currentUserEmail,
          completed: false,
        },
      ]);
    } catch (err) {
      console.error("Error adding mission:", err);
    }
  };

  const handleStepCountMissionComplete = async (referenceToMission) => {
    try {
      await PointAdd(referenceToMission);
      await getStepCountMissionComplete(referenceToMission);
    } catch (err) {
      console.error("Error completing missions:", err);
      Alert.alert("Failed to complete missions. Please try again.");
    }
  };

  const handleCalorieMissionComplete = async (referenceToMission) => {
    try {
      await PointAdd(referenceToMission);
      await getCalorieMissionComplete(referenceToMission);
    } catch (err) {
      console.error("Error completing missions:", err);
      Alert.alert("Failed to complete missions. Please try again.");
    }
  };

  const PointAdd = async (referenceToMission) => {
    try {
      const userRef = ref(
        firebaseServices.rtdb,
        "users/" + firebaseServices.auth.currentUser.uid
      );
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        let totalPoints = userData.totalPoints || 0;
        const missionDocRef = doc(db, "missions", referenceToMission);
        const missionDocSnapshot = await getDoc(missionDocRef);
        if (missionDocSnapshot.exists()) {
          const missionData = missionDocSnapshot.data();
          const pointsToAdd = missionData.points;
          totalPoints += pointsToAdd;
          await user.updatePoints(totalPoints);
          await deleteDoc(missionDocRef);
          const userMissionsQuerySnapshot = await getDocs(
            query(
              collection(db, "user_missions"),
              where("referenceToMission", "==", referenceToMission)
            )
          );
          userMissionsQuerySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
          navigation.navigate("Store");
          alert("You have completed a rush for " + pointsToAdd + " points");
        }
      } else {
        console.error("User data not found");
      }
    } catch (err) {
      console.error("Error adding points:", err);
    }
  };

  const handleCancelMission = async (referenceToMission) => {
    try {
      const missionToDelete = userMissions.find(
        (mission) =>
          mission.referenceToMission === referenceToMission &&
          mission.userEmail === currentUserEmail
      );
      if (!missionToDelete) {
        console.error("Mission not found!");
        return;
      }
      await deleteDoc(doc(db, "user_missions", missionToDelete.id));
      setUserMissions((prevMissions) =>
        prevMissions.filter((mission) => mission.id !== missionToDelete.id)
      );
    } catch (err) {
      console.error("Error deleting mission:", err);
    }
  };

  const cancelExpiredMissions = async () => {
    try {
      const currentDate = new Date();
      for (const mission of userMissions) {
        if (!mission || !mission.referenceToMission) {
          continue;
        }
        const missionRef = mission.referenceToMission;
        const missionDoc = await doc(db, "missions", missionRef);
        const missionSnapshot = await getDoc(missionDoc);
        if (!missionSnapshot.exists()) {
          continue;
        }
        const missionData = missionSnapshot.data();
        if (!missionData || !missionData.createdAt || !missionData.duration) {
          continue;
        }
        const createdAt = missionData.createdAt.toDate();
        if (!(createdAt instanceof Date && !isNaN(createdAt.getTime()))) {
          continue;
        }
        const completionDate = new Date(createdAt);
        completionDate.setDate(completionDate.getDate() + missionData.duration);
        if (
          completionDate.getTime() < currentDate.getTime() &&
          !mission.completed
        ) {
          await handleCancelMission(mission.id);
          setUserMissions((prevMissions) =>
            prevMissions.filter((m) => m.id !== mission.id)
          );
        }
      }
    } catch (err) {
      console.error("Error canceling expired missions:", err);
    }
  };

  useEffect(() => {
    cancelExpiredMissions();
  }, [userMissions]);

  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({ item }) => {
    checkStepCountMissionStatus(item.id);
    checkCalorieCountMissionStatus(item.id);

    const isMissionAdded = userMissions.some(
      (mission) =>
        mission.referenceToMission === item.id &&
        mission.userEmail === currentUserEmail
    );

    const isMissionCompleted = userMissions.some(
      (mission) =>
        mission.referenceToMission === item.id &&
        mission.userEmail === currentUserEmail &&
        mission.completed === true
    );

    if (isMissionCompleted) {
      Alert.alert(
        "Rush completed: " + item.description,
        "You have been rewarded: " + item.points + " points."
      );
      handleCancelMission(item.id);
    }

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + item.duration);

    return (
      <Animated.View
        style={[styles.missionItem, { transform: [{ scale: scaleValue }] }]}
      >
        {isMissionAdded && (
          <>
            <Text style={styles.missionDescription}>{item.description}</Text>
            <Text style={styles.missionPoints}>+{item.points} pts</Text>
            <Text style={styles.missionDuration}>
              Complete by: {completionDate.toISOString().split("T")[0]}
            </Text>
          </>
        )}
        <View style={styles.buttonContainer}>
          {isMissionAdded ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelMission(item.id)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddMission(item.id)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.buttonText}>{item.description}</Text>
            </TouchableOpacity>
          )}
        </View>
        {isMissionAdded && (
          <>
            {item.mission_type === "BigMac" ? (
              <View style={styles.taskContainer}>
                <CalorieCounter calorieCount={getCalories()} />
              </View>
            ) : (
              <View style={styles.taskContainer}>
                <StepCounter
                  stepCount={user.steps[user.month][user.day]}
                  target={item.stepCount}
                ></StepCounter>
              </View>
            )}
          </>
        )}
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error fetching missions. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.infoButton} onPress={showModal}>
            <Text style={styles.buttonText}>?</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Mission Blitz</Text>
        </View>
      </View>
      <FlatList
        data={missions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContentContainer}
      />
      <Modal visible={modalVisible} transparent={true} animationType={"fade"}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Mission Blitz</Text>
            <Text style={styles.modalText}>
            Mission Blitz is a competitive platform where players race to complete missions and earn points. 
            </Text>
            <Pressable onPress={hideModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  header: {
    height: "18%",
    backgroundColor: Colors.HeaderGreen,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 5,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 26,
    color: Colors.White,
    fontWeight: "bold",
  },
  infoIcon: {
    backgroundColor: Colors.HeaderDarkerGreen,
    borderRadius: 20,
    width: 40,
    height: 40,
    marginTop: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  infoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.HeaderGreen,
  },
  missionItem: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  missionDescription: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  missionPoints: {
    fontSize: 14,
    color: Colors.HeaderGreen,
  },
  missionDuration: {
    fontSize: 12,
    color: Colors.Gray,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: Colors.HeaderDarkerGreen,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: Colors.Red,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
  },
  flatListContentContainer: {
    paddingBottom: 100,
  },
  taskContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  dropdownWrapperHeader: {
    flex: 1,
    marginRight: 10,
  },
  infoButton: {
    backgroundColor: Colors.HeaderDarkerGreen,
    borderRadius: 20,
    width: 40,
    height: 40,
    marginTop: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    position: "absolute",
    right: 20,
    bottom: 130,
    padding: 8,
    backgroundColor: Colors.HeaderDarkerGreen,
    borderRadius: 15,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { height: 0, width: 0 },
    zIndex: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  mapContainer: {
    flex: 1,
    width: "100%",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4682B4",
  },
  modalText: {
    color: "#4682B4",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: Colors.BackgroundGradientLower,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default Missions;
