import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchDarkModeSetting } from '../../constants/DarkMode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from 'src/constants/Colors';

export default function Appearance() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchDarkModeSetting().then((darkModeSetting) => {
      setDarkMode(darkModeSetting);
    });
  }, []);

  const toggleDarkMode = () => {
    const newDarkModeState = !darkMode;
    setDarkMode(newDarkModeState);
    updateDarkModeSetting(newDarkModeState);
  };

  const updateDarkModeSetting = async (value) => {
    try {
      await AsyncStorage.setItem('isDarkMode', value.toString());
    } catch (error) {
      console.error('Error updating dark mode setting:', error);
    }
  };



  return (
    <LinearGradient
      colors={darkMode ? [Colors.DarkBackgroundGradientLower, Colors.DarkBackgroundGradientUpper] : [Colors.BackgroundGradientUpper, Colors.BackgroundGradientLower]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          trackColor={{ false: Colors.EntryLighterWhite, true: Colors.EntryDarkerWhite }}
          thumbColor={darkMode ? Colors.Black : Colors.White}
          ios_backgroundColor={Colors.EntryLighterWhite}
          onValueChange={toggleDarkMode}
          value={darkMode}
        />
      </View>

      {/* Additional Appearance Options */}
      <View style={styles.additionalOptions}>
        {/* Theme Color */}
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Theme Color</Text>
        </TouchableOpacity>
        
        {/* Font Style */}
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Font Style</Text>
        </TouchableOpacity>
        
        
        {/* Accent Color */}
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Accent Color</Text>
        </TouchableOpacity>
        
        
        {/* Animation Speed */}
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Animation Speed</Text>
        </TouchableOpacity>
        
        {/* Toolbar Position */}
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Toolbar Position</Text>
        </TouchableOpacity>
        
        {/* Date and Time Format */}
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Date and Time Format</Text>
        </TouchableOpacity>
        

        
        
        {/* Add more appearance options as needed */}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    color: Colors.EntryLighterWhite,
    fontSize: 18,
    marginRight: 10,
  },
  additionalOptions: {
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: 'transparent', // Blank appearance
    borderWidth: 1,
    borderColor: Colors.EntryLighterWhite,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  optionText: {
    color: Colors.EntryLighterWhite,
    fontSize: 16,
  },
});
