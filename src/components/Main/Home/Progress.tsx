import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Colors from "src/constants/Colors";
import ProgressIcon from "src/assets/svg/progress.svg"
import { useUser } from "src/hooks/useUser";

type Props = {
  margin?: [top: number, bottom: number, left: number, right: number]
}

const weekDaysMap = new Map<number, string>;
weekDaysMap.set(1, "Mon");
weekDaysMap.set(2, "Tue");
weekDaysMap.set(3, "Wed");
weekDaysMap.set(4, "Thu");
weekDaysMap.set(5, "Fri");
weekDaysMap.set(6, "Sat");
weekDaysMap.set(7, "Sun");

export default function Progress({ margin = [0, 0, 0, 0] }: Props) {
  let today = new Date();
  const user = useUser();

  //useEffect(() => {
  //  console.log("Progress rerendered");
  //});

  const getDayText = (day: number): string => {
    let currentDayNumber = today.getDay();
    if (currentDayNumber == day)
      return "Today"
    else
      return weekDaysMap.get(day);
  }

  const getDay = (day: number): number => {
    let currentDay = today.getDate();
    let currentDayNumber = today.getDay();
    if (currentDayNumber == day)
      return currentDay;
    else
      return currentDay - (currentDayNumber - day);
  }

  const getFillProgress = (day: number): number => {
    if (user.initialized == true) {

      let currentDay = today.getDate();
      let currentDayNumber = today.getDay();
      if (currentDayNumber == day) {
        return user.steps[user.month][user.day] / user.stepGoal * 100;
      }
      else {
        let data = user.steps[user.month][currentDay - (currentDayNumber - day)] != undefined ? user.steps[user.month][currentDay - (currentDayNumber - day)] : 0;
        return data / user.stepGoal * 100;
      }
    } else {
      return 0;
    }
  }

  let size = 35;
  let width = 5;

  return (
    <View style={[styles.rectangle, {
      marginTop: margin[0],
      marginBottom: margin[1],
      marginLeft: margin[2],
      marginRight: margin[3],
      elevation: 5,
    }]} >
      <View style={{ flexDirection: "row", marginTop: 20, margin: "auto" }}>
        <View style={{ flex: 6, paddingLeft: 15 }}>
          <Text
            style={{
              color: Colors.Black,
              fontSize: 18,
              fontWeight: "400",
            }}>
            Your progress
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <ProgressIcon height={26} />
        </View>
      </View>
      <View style={{ flex: 2, flexDirection: "row" }}>
        <View style={{ flex: 1, position: 'relative', justifyContent: "center", alignItems: "center" }}>
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(1)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.progressBar}
          />
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(1)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.rotatedProgressBar}
          />
          <Text style={styles.dayNumber}>{getDay(1)}</Text>
          <Text style={styles.dayText}>{getDayText(1)}</Text>
        </View>
        <View style={{ flex: 1, position: 'relative', justifyContent: "center", alignItems: "center" }}>
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(2)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.progressBar}
          />
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(2)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.rotatedProgressBar}
          />
          <Text style={styles.dayNumber}>{getDay(2)}</Text>
          <Text style={styles.dayText}>{getDayText(2)}</Text>
        </View>
        <View style={{ flex: 1, position: 'relative', justifyContent: "center", alignItems: "center" }}>
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(3)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.progressBar}
          />
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(3)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.rotatedProgressBar}
          />
          <Text style={styles.dayNumber}>{getDay(3)}</Text>
          <Text style={styles.dayText}>{getDayText(3)}</Text>
        </View>
        <View style={{ flex: 1, position: 'relative', justifyContent: "center", alignItems: "center" }}>
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(4)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.progressBar}
          />
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(4)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.rotatedProgressBar}
          />
          <Text style={styles.dayNumber}>{getDay(4)}</Text>
          <Text style={styles.dayText}>{getDayText(4)}</Text>
        </View>
        <View style={{ flex: 1, position: 'relative', justifyContent: "center", alignItems: "center" }}>
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(5)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.progressBar}
          />
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(5)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.rotatedProgressBar}
          />
          <Text style={styles.dayNumber}>{getDay(5)}</Text>
          <Text style={styles.dayText}>{getDayText(5)}</Text>
        </View>
        <View style={{ flex: 1, position: 'relative', justifyContent: "center", alignItems: "center" }}>
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(6)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.progressBar}
          />
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(6)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.rotatedProgressBar}
          />
          <Text style={styles.dayNumber}>{getDay(6)}</Text>
          <Text style={styles.dayText}>{getDayText(6)}</Text>
        </View>
        <View style={{ flex: 1, position: 'relative', justifyContent: "center", alignItems: "center" }}>
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(7)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.progressBar}
          />
          <AnimatedCircularProgress
            size={size}
            width={width}
            fill={getFillProgress(7)}
            backgroundColor={Colors.ProgressBarBackground}
            tintColor={Colors.ProgressBarFill}
            rotation={180}
            arcSweepAngle={180}
            lineCap="round"
            style={styles.rotatedProgressBar}
          />
          <Text style={styles.dayNumber}>{getDay(7)}</Text>
          <Text style={styles.dayText}>{getDayText(7)}</Text>
        </View>
      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  rectangle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    borderRadius: 20,
    backgroundColor: Colors.ProgressBackground,
  },
  titleText: {
    color: Colors.MainText,
    fontSize: 20,
    fontWeight: "300",
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 4 },
  },
  progressBar: {
    position: 'absolute',
    top: '20%'
  },
  rotatedProgressBar: {
    transform: [{ scaleX: -1 }],
    position: 'absolute',
    top: '20%'
  },
  dayNumber: {
    color: Colors.Black,
    fontSize: 10,
    fontWeight: "300",
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    top: '30%',
  },
  dayText: {
    color: Colors.Black,
    fontSize: 12,
    fontWeight: "300",
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    top: '60%',
  }
});

