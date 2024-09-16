import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import Colors from "src/constants/Colors";

const LogWaterIntake = ({ onChange, currentIntake }) => {
  const [inputValue, setInputValue] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    setSliderValue(inputValue);
  }, [inputValue]);

  const handleAddWater = () => {
    if (inputValue > 0) {
      if (inputValue >= 10000) {
        Alert.alert("Invalid Input", "Are you sure you drank that much water?");
        return;
      }
      onChange(inputValue, 'add');
      resetInput();
    } else {
      Alert.alert("Invalid Input", "Please enter a valid amount of water.");
    }
  };

  const handleRemoveWater = () => {
    if (inputValue > 0) {
      if (inputValue > currentIntake) {
        Alert.alert("Invalid Input", "You cannot remove more water than you have consumed.");
        return;
      }
      onChange(inputValue, 'remove');
      resetInput();
    } else {
      Alert.alert("Invalid Input", "Please enter a valid amount of water.");
    }
  };

  const handleSliderChange = (value) => {
    setInputValue(value);
    setSliderValue(value);
  };

  const resetInput = () => {
    setInputValue(0);
    setSliderValue(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modalText}>How much did you drink?</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(inputValue)}
        onChangeText={(text) => setInputValue(Number(text))}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1000}
        step={50}
        value={sliderValue}
        onValueChange={handleSliderChange}
        minimumTrackTintColor={Colors.BackgroundGradientLower}
        maximumTrackTintColor="#000000"
        thumbTintColor={Colors.BackgroundGradientUpper}
      />
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.removeButton]} onPress={handleRemoveWater}>
          <Text style={styles.buttonText}>Remove</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleAddWater}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: "white",
    opacity: 0.96,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: Colors.BackgroundGradientLower,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  slider: {
    width: '90%',
    height: 40,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    backgroundColor: Colors.BackgroundGradientLower,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '48%',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: Colors.BackgroundGradientUpper,
    paddingTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LogWaterIntake;
