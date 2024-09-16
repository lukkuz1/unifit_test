import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "src/constants/Colors"
import CalorieIcon from "src/assets/svg/calories.svg"
import BigMac from "src/assets/svg/bigmac.svg"

type Props = {
  calorieCount: number,
  margin?: [top: number, bottom: number, left: number, right: number],
}

export default function CalorieCounter({ calorieCount, margin = [0, 0, 0, 0] }: Props) {
  const convertToBigMac = () => {
    return (calorieCount / 509).toFixed(2);
  }

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
            Calories
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <CalorieIcon height={24} />
        </View>
      </View>
      <View style={{ margin: "auto", alignItems: "center", justifyContent: "center" }}>
        <BigMac height={110} />
        <Text style={{ fontSize: 24, fontWeight: "400", fontStyle: "italic", position: "absolute", bottom: '48%' }}>{calorieCount.toFixed(0)}</Text>
        <Text style={{ fontSize: 18, fontWeight: "400", fontStyle: "italic", color: '#404040', position: "absolute", bottom: '35%' }}>kcal</Text>
        <Text style={{ fontSize: 16, fontWeight: "400", fontStyle: "italic" }}>{convertToBigMac()} Big Mac's</Text>
      </View>
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
    backgroundColor: Colors.CalorieCounterBackground,
  },
});
