import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from 'src/constants/Colors';

interface HotZone {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  description: string;
}

interface HotZoneDropdownProps {
  hotZones: HotZone[];
  selectedHotZoneName: string;
  onHotZoneSelectionChange: (selectedHotZone: HotZone) => void;
}

const HotZoneDropdown: React.FC<HotZoneDropdownProps> = ({
  hotZones,
  selectedHotZoneName,
  onHotZoneSelectionChange,
}) => {

  const handleValueChange = (itemValue: string, itemIndex: number) => {
    // Resets to default state if the placeholder is selected
    if (itemValue === "" && itemIndex === 0) {
      return;
    }
    onHotZoneSelectionChange(hotZones[itemIndex - 1]);
  };

  return (
    <View style={styles.dropdownContainer}>
      <Picker
        selectedValue={selectedHotZoneName}
        onValueChange={handleValueChange}
        style={styles.picker}
        dropdownIconColor={Colors.White}
      >
        <Picker.Item label="Available hot zones" value="" />

        {hotZones.map((hotZone, index) => (
          <Picker.Item key={index} label={hotZone.name} value={hotZone.name} />
        ))}

      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: Colors.HeaderDarkerGreen,
    borderRadius: 50,
    padding: 5,
    margin: 10,
    elevation: 5,
    marginTop: 45, 
    marginLeft: 4,
    height: 60,
  },
  picker: {
    color: Colors.White,
  },
});

export default HotZoneDropdown;
