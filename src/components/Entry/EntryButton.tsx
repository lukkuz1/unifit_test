import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { Logo } from 'src/constants/Enums';
import GoogleSVG from 'src/assets/svg/google.svg'
import FacebookSVG from 'src/assets/svg/facebook.svg'

type Props = {
  text: string;
  textColor: string;
  buttonColor: string;
  margin?: [top: number, bottom: number, left: number, right: number];
  style?: StyleProp<ViewStyle>;
  logo?: Logo,
  onPress?: () => void;

}

export default function EntryButton({ text, textColor, buttonColor, margin = [0, 0, 0, 0], logo, style, onPress }: Props) {

  let svg: ReactNode

  if (logo === Logo.GOOGLE) {
    svg = <GoogleSVG width={26} height={26} />
  } else if (logo === Logo.FACEBOOK) {
    svg = <FacebookSVG width={26} height={26} fill="#fff" />
  }


  return (
    <View
      style={[
        styles.rectangle,
        {
          backgroundColor: buttonColor,
          marginTop: margin[0],
          marginBottom: margin[1],
          marginLeft: margin[2],
          marginRight: margin[3],
          overflow: 'hidden',
        },
        style
      ]}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={onPress}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
        <View style={styles.inside}>
          <View style={styles.svg}>
            {svg}
          </View>
          <Text style={[styles.text, { color: textColor }]} >{text}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  rectangle: {
    width: 310,
    height: 50,
    flexShrink: 0,
    borderRadius: 50,
  },
  inside: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  },
  svg: {
    flex: 1,
    position: 'absolute',
    left: 13,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
