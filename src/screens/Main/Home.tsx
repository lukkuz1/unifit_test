import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, Animated, Alert, View, Button, Text, Pressable, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Pedometer } from "expo-sensors";
import {
  getDatabase,
  ref,
  set,
  get,
} from "firebase/database";
import { collection, doc, getDoc } from 'firebase/firestore';
import firebaseServices from 'src/services/firebase';
import Colors from "src/constants/Colors";
import StepsCounter from "src/components/Main/Home/StepsCounter";
import CalorieCounter from "src/components/Main/Home/CalorieCounter";
import FillerModal from "src/components/Main/Home/FillerModal";
import Progress from "src/components/Main/Home/Progress";
import { app } from "../../services/firebase";
import { useIsFocused } from "@react-navigation/native";
import WalletIcon from "src/assets/svg/wallet.svg";
import FootstepsIcon from "src/assets/svg/footsteps.svg";
import DistanceCounter from "src/components/Main/Home/DistanceCounter";
import WaterCounter from "src/components/Main/Home/WaterCounter";
import { useUser } from "src/hooks/useUser";

const { auth, db } = firebaseServices;


export default function Home() {
  const stepCb = useRef<Function>();
  const pointsCb = useRef<Function>();
  const [pastStepCount, setPastStepCount] = useState<number>(0);
  const [stepCount, updateStepCount] = useState<number>(0);
  const [hourlySteps, updateHourlySteps] = useState<number>(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(0);

  const [time, setTime] = useState(0);
  const userEmail = auth.currentUser.email;
  const userUID = auth.currentUser.uid;
  const isFocused = useIsFocused();
  const [targetstepCount, updatetargetStepCount] = useState(0);
  const user = useUser();
  const userID = auth.currentUser.uid;

  function stepCallback() {
    user.syncStepsAndDistance(pastStepCount + stepCount, hourlySteps);
  }

  function pointsCallback() {
    user.syncPoints();
  }

  useEffect(() => {
    updateHourlySteps(0);
    stepCallback();
  }, [user.hours])

  useEffect(() => {
    setPastStepCount(0);
    updateStepCount(0);
    updateHourlySteps(0);
    stepCallback();
    user.initialize(user.user);
  }, [user.day])

  useEffect(() => {
    stepCb.current = stepCallback;
    pointsCb.current = pointsCallback;

  });

  useEffect(() => {
    if (user.initialized == true) {
      updateHourlySteps(user.hourlySteps);
      setPastStepCount(user.steps[user.month][user.day]);
      subscribe();
    }
  }, [user.initialized]);


  useEffect(() => {
    const stepUpdateTick = () => {
      stepCb.current();
    }

    const pointsUpdateTick = () => {
      pointsCb.current();
    }

    const stepSyncInterval = setInterval(stepUpdateTick, 1000);
    const pointsSyncInterval = setInterval(pointsUpdateTick, 1000);
    return () => {
      clearInterval(stepSyncInterval);
      clearInterval(pointsSyncInterval);
    }
  }, []);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();

    const permissions: any = await Pedometer.getPermissionsAsync().then((data) => {
      console.log(data)
      return data;
    });


    if (isAvailable) {
      if (permissions.granted == false) {
        console.log("Asking for permissions")
        await Pedometer.requestPermissionsAsync()
      }
      return Pedometer.watchStepCount(() => {
        updateStepCount(stepCount => stepCount + 1);
        updateHourlySteps(hourlySteps => hourlySteps + 1);
      });
    }
  };

  const getCalories = (): number => {
    return (pastStepCount + stepCount) * 0.045;
  }

  const getDistance = (): number => {
    return stepCount * 0.762 / 1000;
  }

  //const fetchStepGoal = async () => {
  //  try {
  //    checkStepGoalCompleted();
  //    const db = getDatabase(app);
  //    const userTargetRef = ref(db, `user-targets/${userID}`);
  //    const snapshot = await get(userTargetRef);
  //    if (snapshot.exists()) {
  //      updatetargetStepCount(snapshot.val()?.stepGoal?.toString() || "");
  //    } else {
  //      updatetargetStepCount(0);
  //      Alert.alert(
  //        "Info",
  //        "You have no step goal. We recommend adding it in Account settings tab."
  //      );
  //    }
  //  } catch (error) {
  //    Alert.alert("Error", "Error fetching step goal: " + error.message);
  //  }
  //};

  const fetchWaterData = async () => {
    try {
      const now = new Date();
      now.setUTCHours(now.getUTCHours() + 3);
      const currentDate = now.toISOString().split("T")[0];
      const userDocRef = doc(db, 'user_water', userUID);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setWaterGoal(userData.intake_goal_ml || 0);

        const intakeDocRef = doc(db, 'user_water', userUID, 'intake', currentDate);
        const intakeDocSnap = await getDoc(intakeDocRef);

        if (intakeDocSnap.exists()) {
          setWaterIntake(intakeDocSnap.data().intake_ml || 0);
        } else {
          setWaterIntake(0);
        }
      } else {
        setWaterGoal(0);
        setWaterIntake(0);
      }
    } catch (error) {
      Alert.alert("Error", "Error fetching water data: " + error.message);
    }
  };

  const addStepsToTarget = () => {
    const newTargetStepCount = stepCount + 1000; // You can adjust the number of steps added
    updateStepCount(newTargetStepCount);
  };

  //const checkStepGoalCompleted = async () => {
  //  if (stepCount > targetstepCount) {
  //    try {
  //      const db = getDatabase(app);
  //      const streakRef = ref(db, `user-streaks/${userID}/streaks`);
  //      const snapshot = await get(streakRef);
  //      if (snapshot.exists()) {
  //        const streakData = snapshot.val();
  //        const currentDate = new Date().toISOString().split("T")[0];
  //        const duration = streakData.duration;
  //        for (let i = 0; i < duration; i++) {
  //          const streakId = i.toString();
  //          const streakDaysRef = ref(
  //            db,
  //            `user-streaks/${userID}/streaks/days/${streakId}`
  //          );
  //          const streakDaysSnapshot = await get(streakDaysRef);
  //          if (streakDaysSnapshot.exists()) {
  //            const streakDaysData = streakDaysSnapshot.val();
  //            const currentStreakDay = streakDaysData.date;
  //            if (currentStreakDay === currentDate) {
  //              if (!streakDaysData.completed) {
  //                streakDaysData.completed = true;
  //                Alert.alert(
  //                  "Daily " + currentDate + " goal completed",
  //                  "Congrats on the progress!"
  //                );
  //              }
  //            }
  //            await set(streakDaysRef, streakDaysData);
  //          }
  //        }
  //      }
  //    } catch (error) {
  //      Alert.alert("Error", "Error updating streak: " + error.message);
  //    }
  //  }
  //  return;
  //};

  useEffect(() => {
    if (isFocused) {
      fetchWaterData();
    }
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      fetchWaterData();
    }, [])
  );

  const calculatePoints = (steps: number): number => {
    let points = 0;

    if (steps > 0) {
      for (let i = 1; i <= steps; i++) {
        points += Math.pow(0.6, Math.floor((i - 1) / 6000));
      }
    }

    return points;
  }

  return (
    <View style={styles.container}>
      <View style={{ height: '18%', backgroundColor: Colors.HeaderGreen, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: "hidden", elevation: 5, }}>
        <View style={{ height: 60, width: 185, backgroundColor: Colors.HeaderDarkerGreen, borderRadius: 50, marginTop: 50, marginLeft: 20, flexDirection: "row", elevation: 5 }}>
          <View style={{ height: 45, width: 45, backgroundColor: Colors.HeaderGreen, borderRadius: 50, marginTop: 8, marginLeft: 8 }}>
            <WalletIcon height={37} style={{ marginLeft: 4, marginTop: 4 }} />
          </View>
          <Text style={{ color: Colors.White, fontSize: 24, alignSelf: "center", margin: "auto" }}>{user.totalPoints.toFixed(0)}</Text>
        </View>
        <View style={{
          position: "absolute", height: 215, width: 215, backgroundColor: Colors.HeaderGreen,
          marginLeft: 215, marginTop: 30, borderRadius: 200, borderColor: Colors.HeaderDarkerGreen, borderWidth: 10
        }}>
          <FootstepsIcon height={100} style={{ marginLeft: 35, marginTop: 15 }} />
        </View>
      </View>
      <ScrollView style={{ maxHeight: '85%' }} showsVerticalScrollIndicator={false} >
        <View style={{ flexDirection: "row", margin: 10 }}>
          <StepsCounter stepCount={pastStepCount + stepCount} target={user.stepGoal} margin={[0, 0, 0, 10]} />
          {/*<WaterCounter margin={[0, 0, 0, 0]} waterIntake={waterIntake} waterGoal={waterGoal} />*/}
          <CalorieCounter calorieCount={getCalories()} margin={[0, 0, 0, 0]} />
        </View>
        <DistanceCounter margin={[0, 10, 10, 10]} />
        <Progress margin={[0, 0, 10, 10]} />
        <View style={{ flexDirection: "row", margin: 10 }}>
          <FillerModal margin={[0, 0, 0, 10]} />
          <WaterCounter margin={[0, 0, 0, 0]} waterIntake={waterIntake} waterGoal={waterGoal} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 60,
    color: Colors.EntryLighterWhite,
    fontSize: 24,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
});
