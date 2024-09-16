import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Dimensions, Pressable, ImageBackground, ActivityIndicator, TextInput as RNTextInput } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "src/constants/Colors";
import LogWaterIntake from 'src/components/Main/WaterIntake/LogWaterIntake';
import WaterIntakeMetrics from 'src/components/Main/WaterIntake/WaterIntakeMetrics';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import firebaseServices from 'src/services/firebase';

const { auth, db } = firebaseServices;

const TextInput = ({ value, onChange }) => {
  const [currentValue, setCurrentValue] = useState(`${value}`);
  return (
    <RNTextInput
      value={currentValue}
      onChangeText={v => setCurrentValue(v)}
      onEndEditing={() => onChange(Number(currentValue))}
      keyboardType="numeric"
      style={styles.goalInput}
    />
  );
};

export default function WaterIntake({ onClose }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'addWater', title: 'Add Water' },
    { key: 'metrics', title: 'Metrics' },
  ]);

  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(0);
  const [newWaterGoal, setNewWaterGoal] = useState(0);
  const [pendingIntakeChange, setPendingIntakeChange] = useState(0);
  const [loading, setLoading] = useState(true);

  const getCurrentDateInUTCPlus3 = () => {
    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 3);
    return now.toISOString().split("T")[0];
  };

  const fetchWaterData = async () => {
    try {
      const userUID = auth.currentUser.uid;
      const currentDate = getCurrentDateInUTCPlus3();
      const userDocRef = doc(db, 'user_water', userUID);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setWaterGoal(userData.intake_goal_ml || 0);
        setNewWaterGoal(userData.intake_goal_ml || 0);

        const intakeDocRef = doc(db, 'user_water', userUID, 'intake', currentDate);
        const intakeDocSnap = await getDoc(intakeDocRef);

        if (intakeDocSnap.exists()) {
          setWaterIntake(intakeDocSnap.data().intake_ml || 0);
        } else {
          await setDoc(intakeDocRef, { intake_ml: 0 });
          setWaterIntake(0);
        }
      } else {
        await setDoc(userDocRef, { intake_goal_ml: 2000 }); // Default goal
        setWaterGoal(2000);
        setNewWaterGoal(2000);

        const intakeDocRef = doc(db, 'user_water', userUID, 'intake', currentDate);
        await setDoc(intakeDocRef, { intake_ml: 0 });
        setWaterIntake(0);
      }
    } catch (error) {
      Alert.alert("Error", "Error fetching water data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterData();
  }, []);

  const handleLogWater = (amount, type) => {
    if (type === 'add') {
      setPendingIntakeChange(prev => prev + amount);
    } else if (type === 'remove') {
      setPendingIntakeChange(prev => prev - amount);
    }
  };

  const handleSaveAndClose = async () => {
    try {
      const userUID = auth.currentUser.uid;
      const currentDate = getCurrentDateInUTCPlus3();
      const intakeDocRef = doc(db, 'user_water', userUID, 'intake', currentDate);
      const newIntake = waterIntake + pendingIntakeChange;
  
      await updateDoc(intakeDocRef, { intake_ml: newIntake });
  
      const userDocRef = doc(db, 'user_water', userUID);
      await updateDoc(userDocRef, { intake_goal_ml: newWaterGoal });
  
      setWaterIntake(newIntake);
      setWaterGoal(newWaterGoal);
  
      onClose(newIntake, newWaterGoal);
    } catch (error) {
      Alert.alert("Error", "Error saving water intake: " + error.message);
    }
  };
  
  // "Add Water" tab
  const AddWaterRoute = () => (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.WaterText} />
      ) : (
        <>
          <View style={styles.goalContainer}>
            <Text style={styles.goalText}>Daily Goal:</Text>
            <TextInput
              value={newWaterGoal}
              onChange={setNewWaterGoal}
            />
            <Text style={styles.goalText}>ml</Text>
          </View>
          <View style={styles.intakeContainer}>
            <Text style={styles.text}>Today's Total:</Text>
            <Text style={styles.boldText}>{waterIntake + pendingIntakeChange} ml</Text>
          </View>
          <LogWaterIntake
            onChange={handleLogWater}
            currentIntake={waterIntake + pendingIntakeChange}
          />
        </>
      )}
    </ScrollView>
  );

  // "Metrics" tab
  const MetricsRoute = () => (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.WaterText} />
      ) : (
        <WaterIntakeMetrics />
      )}
    </View>
  );

  const renderScene = SceneMap({
    addWater: AddWaterRoute,
    metrics: MetricsRoute,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: Colors.WaterText }}
      style={{ backgroundColor: Colors.WaterCounterBackground }}
      labelStyle={{ color: 'black' }}
    />
  );

  return (
    <ImageBackground source={require("../../assets/png/water-waves.png")} style={styles.background}>
      <SafeAreaView style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={renderTabBar}
        />
        <Pressable style={styles.saveButton} onPress={handleSaveAndClose}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
    padding: 0,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  intakeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goalText: {
    fontSize: 16,
    color: '#000',
  },
  goalInput: {
    width: 60,
    height: 30,
    borderColor: Colors.BackgroundGradientLower,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  text: {
    fontSize: 22,
    color: '#000',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 25,
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: Colors.WaterText,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
