import { getDatabase, ref, set, get, remove } from "firebase/database";
import { Alert } from "react-native";
import { app } from "../../../services/firebase";
import { useNavigation } from "@react-navigation/native";

export const shuffleIcons = (icons: JSX.Element[]) => {
  for (let i = icons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [icons[i], icons[j]] = [icons[j], icons[i]];
  }
  return icons;
};

export const checkStepGoalCompleted = async (stepCount, targetStepCount, userID) => {
  if (stepCount > targetStepCount) {
    try {
      const db = getDatabase(app);
      const streakRef = ref(db, `user-streaks/${userID}/streaks`);
      const snapshot = await get(streakRef);

      if (snapshot.exists()) {
        const streakData = snapshot.val();
        const currentDate = new Date().toISOString().split('T')[0];
        const duration = streakData.days.duration;
        const streakDaysData = [];

        for (let i = 0; i < duration; i++) {
          const streakId = i.toString();
          const streakDaysRef = ref(db, `user-streaks/${userID}/streaks/days/${streakId}`);
          const streakDaysSnapshot = await get(streakDaysRef);
          if (streakDaysSnapshot.exists()) {
            streakDaysData.push(streakDaysSnapshot.val());
          } else {
            streakDaysData.push(null);
          }
        }

        for (let i = 0; i < duration; i++) {
          const streakDay = streakDaysData[i];

          if (streakDay) {
            if (i > 0) {
              const previousDayCompleted = streakDaysData.slice(0, i).every(day => day && day.completed);
              if (!previousDayCompleted) {
                await set(streakRef, null);
                Alert.alert('Streak reset', 'Previous days were not completed, streak has been reset.');
                return;
              }
            }

            if (streakDay.date === currentDate) {
              streakDay.completed = true;
              const streakDaysRef = ref(db, `user-streaks/${userID}/streaks/days/${i.toString()}`);
              await set(streakDaysRef, streakDay);

              if (i === duration - 1 && streakDaysData.every(day => day && day.completed)) {
                await set(streakRef, { ...streakData, completedStreak: true });
                Alert.alert('Streak Completed', 'Congratulations! You have completed your streak!');
                return;
              }
            }
          }
        }

        Alert.alert('Daily goal completed', 'Congrats on the progress!');
      }
    } catch (error) {
      Alert.alert('Error', 'Error updating streak: ' + error.message);
    }
  }
};

export const fetchUserStreak = async (userID, setSelectedStreak, setShowPicker, setShowStartButton, setShowReselectButton) => {
  if (!userID) return;
  const db = getDatabase(app);
  const userStreaksRef = ref(db, `user-streaks/${userID}/streaks`);
  try {
    const snapshot = await get(userStreaksRef);
    if (snapshot.exists()) {
      const streaksData = snapshot.val();
      setSelectedStreak(streaksData);
      setShowPicker(false);
      setShowStartButton(false);
      setShowReselectButton(true);
    } else {
      setSelectedStreak(null);
      setShowStartButton(false);
      setShowPicker(true);
      setShowReselectButton(false);
    }
  } catch (error) {
    console.error("Error fetching streaks:", error);
  }
};

export const cancelStreak = async (userID, setSelectedStreak, setShowStartButton, setShowReselectButton, fetchUserStreak) => {
  try {
    const db = getDatabase(app);
    const userStreakRef = ref(db, `user-streaks/${userID}`);
    await remove(userStreakRef);
    setSelectedStreak(null);
    setShowStartButton(false);
    setShowReselectButton(false);
    fetchUserStreak();
    Alert.alert("Journey Canceled", "Your journey has been canceled.");
  } catch (error) {
    console.error("Error canceling streak:", error);
    Alert.alert("Error", "Failed to cancel the streak. Please try again later.");
  }
};

export const startStreak = async (userID, streak, setShowStartButton) => {
  try {
    const db = getDatabase(app);
    const userStreakRef = ref(db, `user-streaks/${userID}`);
    await set(userStreakRef, { streaks: streak });
    setShowStartButton(false);
    Alert.alert("Journey Started", "Your journey has started!");
  } catch (error) {
    console.error("Error starting streak:", error);
    Alert.alert("Error", "Failed to start the streak. Please try again later.");
  }
};