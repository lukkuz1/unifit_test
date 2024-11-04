import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { getDatabase, ref, set, get } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { app } from "../../services/firebase";
import auth from "../../services/firebase";
import { LinearGradient } from "expo-linear-gradient";
import EntryInputField from "src/components/Entry/EntryInputField";
import EntryButton from "src/components/Entry/EntryButton";
import Colors from "src/constants/Colors";
import useDarkModeToggle from "src/hooks/useDarkModeToggle";

export default function StepGoal() {
  const [stepGoal, setStepGoal] = useState("");
  const userID = auth.auth.currentUser.uid;
  const navigation = useNavigation();
  const darkMode = useDarkModeToggle();

  useEffect(() => {
    fetchStepGoal();
  }, []);

  const fetchStepGoal = async () => {
    try {
      const db = getDatabase(app);
      const userTargetRef = ref(db, `user-targets/${userID}`);
      const snapshot = await get(userTargetRef);
      if (snapshot.exists()) {
        setStepGoal(snapshot.val()?.stepGoal?.toString() || "");
      } else {
        setStepGoal("");
        Alert.alert("Info", "No existing step goal found for the user.");
      }
    } catch (error) {
      Alert.alert("Error", "Error fetching step goal: " + error.message);
    }
  };

  const handleAddStepGoal = async () => {
    if (!stepGoal || isNaN(parseInt(stepGoal))) {
      Alert.alert("Validation Error", "Please enter a valid step goal.");
      return;
    }
    try {
      const db = getDatabase(app);
      const userTargetRef = ref(db, `user-targets/${userID}`);
      await set(userTargetRef, {
        stepGoal: parseInt(stepGoal),
      });
  
      Alert.alert("Success", "Step goal successfully updated!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Error adding/updating step goal: " + error.message);
    }
  };

  return (
    //<LinearGradient
      //colors={
        //darkMode
          //? [
            //  Colors.DarkBackgroundGradientLower,
             // Colors.DarkBackgroundGradientUpper,
           // ]
          //: [Colors.BackgroundGradientUpper, Colors.BackgroundGradientLower]
     // }
     // style={styles.container}
   // >
      <View style={styles.label}>
        <EntryInputField
          headerText=""
          placeholderText="Enter Your Step Goal"
          isPassword={false}
          margin={[0, 10, 0, 0]}
          onChangeText={(text) => setStepGoal(text)}
          keyboardType="numeric"
          value={stepGoal}
        />
        <EntryButton
          text="Add Step Goal"
          textColor={Colors.DarkGray}
          buttonColor={Colors.White}
          margin={[0, 0, 0, 0]}
          onPress={handleAddStepGoal}
        />
      </View>
   // </LinearGradient>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 10,
    color: Colors.EntryLighterWhite,
    fontSize: 14,
    fontWeight: "700",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
});
