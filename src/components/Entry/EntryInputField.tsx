import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions, ViewStyle, StyleProp, TextStyle } from 'react-native';
import Colors from 'src/constants/Colors';

type Props = {
  headerText: string;
  placeholderText: string;
  isPassword: boolean;
  postfix?: string;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<TextStyle>;
  margin?: [top: number, bottom: number, left: number, right: number];
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  value?: string;
}

export default function EntryInputField({ headerText, placeholderText, isPassword, margin = [0, 0, 0, 0], keyboardType, style, headerStyle, postfix = "", onChangeText }: Props) {
  return (
    <View
      style={[
        styles.rectangle,
        {
          marginTop: margin[0],
          marginBottom: margin[1],
          marginLeft: margin[2],
          marginRight: margin[3],
        },
        style
      ]}
    >
      <Text style={[styles.typeFont, headerStyle]}>{headerText}</Text>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          placeholder={placeholderText}
          placeholderTextColor={Colors.Gray}
          style={styles.insideFont}
          secureTextEntry={isPassword}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
        <Text style={styles.prefix}>{" " + postfix}</Text>
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
  prefix: {
    color: Colors.Gray,
    fontSize: 16,
    fontWeight: '400',
    marginTop: 3,
  },
  rectangle: {
    width: 310,
    height: 70,
    borderRadius: 18,
    backgroundColor: Colors.White,
    shadowColor: '#000000',
    elevation: 3,
    zIndex: 999,
    justifyContent: 'center',
  },
});
