import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "src/constants/Colors";
import StockImage from "../../assets/svg/stock_image1.svg";
import FirstPlace from "../../assets/svg/firstplace.svg";
import FirstPlaceMedal from "../../assets/svg/firstPlaceMedal.svg";
import SecondPlaceMedal from "../../assets/svg/secondPlaceMedal.svg";
import ThirdPlaceMedal from "../../assets/svg/ThirdPlaceMedal.svg";
import Eclipse from "../../assets/svg/Eclipse.svg";
import Eclipse2 from "../../assets/svg/Ellipse2.svg";

type Props = {
  time?: number;
  margin?: [top: number, bottom: number, left: number, right: number];
};

enum LeaderboardType {
  Region,
  National,
  Global,
}

export default function Leaderboard({ margin = [0, 100, 0, 0] }: Props) {
  const [selectedType, setSelectedType] = useState<LeaderboardType | null>(
    null
  );

  const handleSelect = (type: LeaderboardType) => {
    setSelectedType(type);
    console.log("Selected Leaderboard Type:", LeaderboardType[type]);
  };

  const HorizontalLine = () => (
    <View style={styles.horizontalLine} />
  );

  return (
    <LinearGradient
      colors={[Colors.BackgroundGradientLower, Colors.BackgroundGradientUpper]}
      style={styles.container}
    >
      <View
        style={[
          styles.rectangleLeaderboardType,
          {
            marginTop: margin[0],
            marginBottom: margin[1],
            marginLeft: margin[2],
            marginRight: margin[3],
          },
        ]}
      >
        <View style={styles.buttonContainer}>
          <Pressable style={{ flex: 1 }} onPress={() => handleSelect(LeaderboardType.National)}>
            <Text
              style={[
                styles.label,
                selectedType === LeaderboardType.National && styles.selected,
                { textAlign: "center" }
              ]}
            >
              National
            </Text>
          </Pressable>
          <Pressable style={{ flex: 1 }} onPress={() => handleSelect(LeaderboardType.Region)}>
            <Text
              style={[
                styles.label,
                selectedType === LeaderboardType.Region && styles.selected,
                { textAlign: "center" }
              ]}
            >
              Region
            </Text>
          </Pressable>
          <Pressable style={{ flex: 1 }} onPress={() => handleSelect(LeaderboardType.Global)}>
            <Text
              style={[
                styles.label,
                selectedType === LeaderboardType.Global && styles.selected,
                { textAlign: "center" }
              ]}
            >
              Global
            </Text>
          </Pressable>
        </View>
      </View>

      <FirstPlace style={styles.firstPlace} />
      <FirstPlaceMedal style={styles.firstPlaceMedal} />
      <View style={styles.podiumMain}>
        <Eclipse2 style={styles.eclipse2Left} />
        <View style={[styles.inlineBlock]}>
          <Eclipse2 style={styles.eclipse2Right} />
          <Eclipse />
          <View style={styles.user}>
            <Text style={styles.label}>Eiden</Text>
          </View>
        </View>
      </View>

      <View style={styles.leaderboard}>
        <View style={styles.user}>
          <StockImage />
          <Text style={styles.label}>User1</Text>
          <Pressable style={styles.pointsContainer}>
            <Text style={styles.points}>5000 points</Text>
          </Pressable>
        </View>
        <HorizontalLine />
        <View style={styles.user}>
          <StockImage />
          <Text style={styles.label}>User2</Text>
          <Pressable style={styles.pointsContainer}>
            <Text style={styles.points}>5000 points</Text>
          </Pressable>
        </View>
        <HorizontalLine />
        <View style={styles.user}>
          <StockImage />
          <Text style={styles.label}>User3</Text>
          <Pressable style={styles.pointsContainer}>
            <Text style={styles.points}>5000 points</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.EntryLighterWhite,
    fontSize: 14,
    fontWeight: "200",
    marginLeft: 10,
  },
  points: {
    color: Colors.EntryLighterWhite,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },
  selected: {
    color: Colors.EntryLighterWhite,
    fontSize: 14,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  firstPlaceMedal: {
    position: "absolute",
    top: 235,
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    alignSelf: "center",

  },

  rectangleLeaderboardType: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: "5%",
    borderRadius: 20,
    borderColor: Colors.TransparentRectangleBorder,
    borderWidth: 1.3,
    backgroundColor: Colors.TransparentRectangle,
  },

  eclipse2Left: {
    position: "absolute",
    left: 20,
    top: 20,
    width: 50,
    height: 50,
  },
  eclipse2Right: {
    position: "absolute",
    left: 155,
    top: 50,
    width: 50,
    height: 50,
  },
  inlineBlock: {
    justifyContent: "center",
    alignItems: "center",
    width: "40%", // Adjust width as needed
    height: "125%", // Adjust height as needed
    borderRadius: 20,
    borderWidth: 1.3,
    borderColor: Colors.TransparentRectangleBorder,
    backgroundColor: Colors.TransparentRectangle,
    position: "absolute",
    top: -30, // Adjust as needed to poke out from the top
  },

  firstPlace: {
    position: "absolute",
    top: 170,
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    alignSelf: "center",
  },

  podiumMain: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: "15%",
    borderRadius: 20,
    borderColor: Colors.TransparentRectangleBorder,
    borderWidth: 1.3,
    backgroundColor: Colors.TransparentRectangle,
  },

  leaderboard: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "45%",
    borderRadius: 20,
    borderColor: Colors.TransparentRectangleBorder,
    borderWidth: 1.3,
    backgroundColor: Colors.TransparentRectangle,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    flex: 1,
  },
  pointsContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  horizontalLine: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.TransparentRectangleBorder,
  },
  buttonContainer: {
    paddingRight: 10,
    flexDirection: "row",
    width: "100%",
  },
});
