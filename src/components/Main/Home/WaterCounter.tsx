import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal } from "react-native";
import Colors from "src/constants/Colors";
import WaterDropletIcon from "src/assets/svg/water/WaterDroplet.svg";
import { LiquidGauge } from 'react-native-liquid-gauge';
import WaterIntake from 'src/screens/Main/WaterIntake';

type Props = {
  margin?: [top: number, bottom: number, left: number, right: number],
  waterIntake: number,
  waterGoal: number,
}

const calculateWaterIntakePercentage = (waterIntake, waterGoal) => {
  if (waterGoal <= 0) {
    return 0;
  }
  const percentage = (waterIntake / waterGoal) * 100;
  return percentage > 100 ? 100 : percentage;
};

export default function WaterCounter({ margin = [0, 0, 0, 0], waterIntake, waterGoal }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentWaterIntake, setCurrentWaterIntake] = useState(waterIntake);
  const [currentWaterGoal, setCurrentWaterGoal] = useState(waterGoal);

  useEffect(() => {
    setCurrentWaterIntake(waterIntake);
    setCurrentWaterGoal(waterGoal);
  }, [waterIntake, waterGoal]);

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleModalClose = useCallback((newIntake, newGoal) => {
    setCurrentWaterIntake(newIntake);
    setCurrentWaterGoal(newGoal);
    setModalVisible(false);
  }, []);

  const waterIntakePercentage = calculateWaterIntakePercentage(currentWaterIntake, currentWaterGoal);

  return (
    <View style={[styles.rectangle, {
      marginTop: margin[0],
      marginBottom: margin[1],
      marginLeft: margin[2],
      marginRight: margin[3],
      elevation: 5,
    }]}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Water</Text>
        </View>
        <View style={styles.headerIconContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.plusText}>+</Text>
            <WaterDropletIcon style={styles.iconStyle} height={24} width={24}/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <LiquidGauge
          config={{
            circleColor: Colors.WaterCircle,
            textColor: Colors.WaterText,
            waveTextColor: Colors.WaterWaveText,
            waveColor: Colors.WaterWaveColor,
            circleThickness: 0.15,
            waveAnimateTime: 1800,
            waveAnimate: true,
            waveCount: 1,
          }}
          value={waterIntakePercentage}
          width={140}
          height={140}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <WaterIntake onClose={handleModalClose} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  rectangle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    borderRadius: 20,
    backgroundColor: Colors.WaterCounterBackground,
  },
  header: {
    flexDirection: "row",
    marginTop: 20,
    alignSelf: 'center',
  },
  headerTextContainer: {
    flex: 3,
    paddingLeft: 15,
  },
  headerText: {
    color: Colors.Black,
    fontSize: 18,
    fontWeight: "400",
  },
  headerIconContainer: {
    flex: 1,
    marginLeft: 0,
    marginRight: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#c1ddee',
    borderColor: '#3d76d2',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  plusText: {
    color: '#3d76d2',
    fontSize: 18,
    marginRight: 0,
    paddingLeft: 5,
  },
  iconStyle: {},
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 40,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
});
