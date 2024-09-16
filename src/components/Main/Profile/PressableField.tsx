import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, Pressable } from 'react-native';
import Colors from 'src/constants/Colors';

type Props = {
  headerText: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export default function PressableField({ headerText, style, onPress }: Props) {
  return (
    <View
      style={[
        styles.rectangle,
        style
      ]}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.typeFont}>{headerText}</Text>
        <Pressable style={{ marginLeft: 'auto', marginRight: 20 }} onPress={onPress}>
          <Text style={styles.insideFont}>Change</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  typeFont: {
    marginLeft: 15,
    color: Colors.Black,
    fontSize: 14,
    fontWeight: "400",
  },
  insideFont: {
    marginLeft: 15,
    color: Colors.Gray,
    fontSize: 16,
    fontWeight: "400",
  },
  rectangle: {
    width: 310,
    height: 45,
    borderRadius: 18,
    backgroundColor: Colors.White,
    shadowColor: '#000000',
    elevation: 3,
    zIndex: 999,
    justifyContent: 'center',
  },
});
