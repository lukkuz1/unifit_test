import React from "react";
import { View, Text, StyleSheet, Image  } from "react-native";
import Colors from "src/constants/Colors";
import Forest from "src/assets/svg/forest.svg";

type Props = {
  margin?: [top: number, bottom: number, left: number, right: number],
}

export default function FillerModal({ margin = [0, 0, 0, 0] }: Props) {
  return (
    <View style={[
      styles.rectangle, {
        marginTop: margin[0],
        marginBottom: margin[1],
        marginLeft: margin[2],
        marginRight: margin[3],
        elevation: 5,
      }
    ]}>
      <View style={styles.centeredContainer}>
        <Text style={styles.text}>
          One step{"\n"}
          at a time
        </Text>
      </View>
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
    backgroundColor: Colors.FillerModalBackground,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    fontSize: 30,
    fontWeight: "400",
    color: '#404040',
    textAlign: 'center',
    position: 'absolute',
    elevation: 5,
  },
});
