import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "src/constants/Colors"
import DistanceIcon from "src/assets/svg/distance.svg"
import * as Progress from 'react-native-progress'
import { useUser } from "src/hooks/useUser";

type Props = {
  margin?: [top: number, bottom: number, left: number, right: number],
}

export default function DistanceCounter({ margin = [0, 0, 0, 0] }: Props) {
  const user = useUser();
  let width = 80;

  const getWidth = (order: number) => {
    let hour = user.hours - (order - 1);
    const distance = (user.distanceHistory[hour] != undefined ? user.distanceHistory[hour] : 0);
    const distanceToWidth = distance * width / 6;

    if (distanceToWidth > 80) {
      return 80;
    } else if (distanceToWidth == 0) {
      return 10;
    } else {
      return 10 + distanceToWidth;
    }
  }

  const getTotalDistance = (obj: any): any => {
    const values = Object.values(obj);
    const total = values.reduce((acc: any, value: any) => acc + value, 0);
    return total;
  };

  return (
    <View style={[styles.rectangle, {
      marginTop: margin[0],
      marginBottom: margin[1],
      marginLeft: margin[2],
      marginRight: margin[3],
      elevation: 5,
    }]}  >
      <View style={{ flexDirection: "row", marginTop: 20, margin: "auto" }}>
        <View style={{ flex: 6, paddingLeft: 15 }}>
          <Text
            style={{
              color: Colors.Black,
              fontSize: 18,
              fontWeight: "400",
            }}>
            Distance travelled
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <DistanceIcon height={26} />
        </View>
      </View>
      <View style={{ flexDirection: "row", margin: "auto", marginTop: 10 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(12) > 10 ?
            <Progress.Bar progress={1} width={getWidth(12)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(11) > 10 ?
            <Progress.Bar progress={1} width={getWidth(11)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(10) > 10 ?
            <Progress.Bar progress={1} width={getWidth(10)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(9) > 10 ?
            <Progress.Bar progress={1} width={getWidth(9)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(8) > 10 ?
            <Progress.Bar progress={1} width={getWidth(8)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(7) > 10 ?
            <Progress.Bar progress={1} width={getWidth(7)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(6) > 10 ?
            <Progress.Bar progress={1} width={getWidth(6)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(5) > 10 ?
            <Progress.Bar progress={1} width={getWidth(5)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(4) > 10 ?
            <Progress.Bar progress={1} width={getWidth(4)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(3) > 10 ?
            <Progress.Bar progress={1} width={getWidth(3)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(2) > 10 ?
            <Progress.Bar progress={1} width={getWidth(2)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {getWidth(1) > 10 ?
            <Progress.Bar progress={1} width={getWidth(1)} height={13} borderWidth={0} borderRadius={100} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
            :
            <Progress.Bar progress={1} width={10} height={13} borderWidth={0} borderRadius={100} color={Colors.DistanceCounterDarkerGray} style={{
              transform: [{ rotate: '-90deg' }]
            }} />
          }
        </View>
      </View>
      <View style={{ flexDirection: "row", marginLeft: "auto" }}>
        <Text style={{ fontSize: 18, marginRight: 4 }}>{user.initialized == true ? (user.steps[user.month][user.day] * 0.762 / 1000).toFixed(2) : 0}</Text>
        <Text style={{ fontSize: 18, marginRight: 30, marginBottom: 5, color: Colors.Gray }}>km</Text>
      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  rectangle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 170,
    borderRadius: 20,
    backgroundColor: Colors.DistanceCounterBackground,
  },
});
