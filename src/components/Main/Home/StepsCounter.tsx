import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Colors from "src/constants/Colors"
import WalkIcon from "src/assets/svg/walk.svg"

type Props = {
  stepCount: number,
  target: number,
  margin?: [top: number, bottom: number, left: number, right: number],
}

function Normalize(stepCount: number, target: number): number {
  let x: number;

  if (stepCount < target) {
    x = stepCount * 100 / target;
  } else if (stepCount < 0) {
    x = 0;
  } else {
    x = 100;
  }

  return x;
}

export default function StepsCounter({ stepCount, target, margin = [0, 0, 0, 0] }: Props) {

  return (
    <View style={[styles.rectangle, {
      marginTop: margin[0],
      marginBottom: margin[1],
      marginLeft: margin[2],
      marginRight: margin[3],
      elevation: 5,
    }]}  >
      <View style={{ flexDirection: "row", marginTop: 20, margin: "auto" }}>
        <View style={{ flex: 3, paddingLeft: 15 }}>
          <Text
            style={{
              color: Colors.Black,
              fontSize: 18,
              fontWeight: "400",
            }}>
            Walk
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <WalkIcon height={24} />
        </View>
      </View>
      <AnimatedCircularProgress
        size={135}
        width={12}
        fill={Normalize(stepCount, target)}
        backgroundColor={Colors.White}
        tintColor={Colors.StepCounterFill}
        rotation={180}
        lineCap="round"
        style={{ marginBottom: 20 }}
      >
        {
          () => (
            <>
              <Text
                style={{
                  color: Colors.Black,
                  fontSize: 24,
                  fontWeight: "400",
                }}>
                {stepCount}
              </Text>
              <Text
                style={{
                  color: Colors.StepCounterText,
                  fontSize: 20,
                  fontWeight: "400",
                }}>
                Steps
              </Text>
            </>
          )
        }
      </AnimatedCircularProgress>
    </View >
  )
}

const styles = StyleSheet.create({
  rectangle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    borderRadius: 20,
    backgroundColor: Colors.StepCounterBackground,
  },
});
