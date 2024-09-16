import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "src/constants/Colors";
import TimeIcon from "src/assets/svg/time.svg"
import CaloriesIcon from "src/assets/svg/calories.svg"
import DistanceIcon from "src/assets/svg/distance.svg"

type Props = {
  time: number,
  stepCount: number,
  margin?: [top: number, bottom: number, left: number, right: number]
}

export default function Stats({ time, stepCount, margin = [0, 0, 0, 0] }: Props) {
  const convertTime = (): string => {
    if (time == null) {
      time = 0;
    }
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);

    return `${hours}h ${minutes}m`;
  }

  const getCalories = (): string => {
    return (stepCount * 0.045).toFixed(0);
  }

  const getDistance = (): string => {
    return (stepCount * 0.762 / 1000).toFixed(2);
  }



  return (
    <View style={[styles.rectangle, {
      marginTop: margin[0],
      marginBottom: margin[1],
      marginLeft: margin[2],
      marginRight: margin[3],
    }]} >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TimeIcon width={40} />
        <Text style={[styles.dataText, { marginTop: 5 }]}>{convertTime()}</ Text>
        <Text style={styles.text}>time</ Text>
      </ View>
      <View style={styles.verticalLine} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CaloriesIcon width={40} />
        <Text style={[styles.dataText, { marginTop: 5 }]}>{getCalories()}</ Text>
        <Text style={styles.text}>kcal</ Text>
      </ View>
      <View style={styles.verticalLine} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <DistanceIcon width={40} />
        <Text style={[styles.dataText, { marginTop: 5 }]}>{getDistance()}</ Text>
        <Text style={styles.text}>km</ Text>
      </ View>
    </View >
  )
}

const styles = StyleSheet.create({
  rectangle: {
    width: '85%',
    height: '15%',
    borderRadius: 20,
    borderColor: Colors.TransparentRectangleBorder,
    borderWidth: 1.3,
    backgroundColor: Colors.TransparentRectangle,
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
  },
  text: {
    color: Colors.MainText,
    fontSize: 16,
    fontWeight: "300",
  },
  dataText: {
    color: Colors.MainText,
    fontSize: 20,
    fontWeight: "700",
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 4 },
  },
  verticalLine: {
    width: 0,
    borderLeftWidth: 1,
    borderLeftColor: Colors.TransparentRectangleBorder
  }
});

