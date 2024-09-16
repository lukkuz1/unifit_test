import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Colors from "src/constants/Colors";
import { Streak } from "../../components/Main/Streaks/Streak";
import StreakIcon1 from "../../assets/svg/streak-svg/campfire.svg";
import StreakIcon2 from "../../assets/svg/streak-svg/compass-rose.svg";
import StreakIcon3 from "../../assets/svg/streak-svg/ferry.svg";
import StreakIcon4 from "../../assets/svg/streak-svg/fish.svg";
import StreakIcon5 from "../../assets/svg/streak-svg/fish.svg";
import StreakIcon6 from "../../assets/svg/streak-svg/island.svg";
import StreakIcon7 from "../../assets/svg/streak-svg/jellyfish.svg";
import StreakIcon8 from "../../assets/svg/streak-svg/sail-boat.svg";
import StreakIcon9 from "../../assets/svg/streak-svg/ship-wheel.svg";
import StreakIcon10 from "../../assets/svg/streak-svg/treasure-chest.svg";
import StreakIcon11 from "../../assets/svg/streak-svg/tsunami.svg";
import StreakIcon12 from "../../assets/svg/streak-svg/waves.svg";
import useDarkModeToggle from "src/hooks/useDarkModeToggle";
import auth from "../../services/firebase";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  fetchUserStreak,
  startStreak,
  cancelStreak,
  shuffleIcons,
} from "../../components/Main/Streaks/StreakUtils";
import { calculateDate } from "../../components/Main/Streaks/StreakdateUtils";
import { streakTypes } from "../../components/Main/Streaks/StreakTypes";

const Streaks: React.FC = () => {
  const [selectedStreak, setSelectedStreak] = useState<Streak | null>(null);
  const [showStartButton, setShowStartButton] = useState<boolean>(false);
  const [showReselectButton, setShowReselectButton] = useState<boolean>(false);
  const darkMode = useDarkModeToggle();
  const [userID, setUserID] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [missionsModalVisible, setMissionsModalVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  const handleMissions = () => {
    navigation.navigate("Missions");
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const showMissionsModal = () => {
    setMissionsModalVisible(true);
  };

  const hideMissionsModal = () => {
    setMissionsModalVisible(false);
  };

  useEffect(() => {
    const currentUser = auth.auth.currentUser.uid;
    if (currentUser) {
      setUserID(currentUser);
    }
    if (userID) {
      fetchUserStreak(
        userID,
        setSelectedStreak,
        setShowPicker,
        setShowStartButton,
        setShowReselectButton
      );
    }
  }, [userID, isFocused]);

  useEffect(() => {
    if (userID) {
      fetchUserStreak(
        userID,
        setSelectedStreak,
        setShowPicker,
        setShowStartButton,
        setShowReselectButton
      );
    }
  }, [userID]);

  const selectStreak = (streak: Streak) => {
    setSelectedStreak(streak);
    setShowPicker(false);
    setShowStartButton(true);
    setShowReselectButton(true);
  };

  const reselectStreak = () => {
    setSelectedStreak(null);
    setShowPicker(true);
    setShowStartButton(false);
    setShowReselectButton(false);
  };


  const renderStreakIcon = (index: number) => {
    switch (index) {
      case 1:
        return <StreakIcon1 width={20} height={20} />;
      case 2:
        return <StreakIcon2 width={20} height={20} />;
      case 3:
        return <StreakIcon3 width={20} height={20} />;
      case 4:
        return <StreakIcon4 width={20} height={20} />;
      case 5:
        return <StreakIcon5 width={20} height={20} />;
      case 6:
        return <StreakIcon6 width={20} height={20} />;
      case 7:
        return <StreakIcon7 width={20} height={20} />;
      case 8:
        return <StreakIcon8 width={20} height={20} />;
      case 9:
        return <StreakIcon9 width={20} height={20} />;
      case 10:
        return <StreakIcon10 width={20} height={20} />;
      case 11:
        return <StreakIcon11 width={20} height={20} />;
      case 12:
        return <StreakIcon12 width={20} height={20} />;
      default:
        return null;
    }
  };

  const handleCancelStreak = async () => {
    await cancelStreak(
      userID,
      setSelectedStreak,
      setShowStartButton,
      setShowReselectButton,
      fetchUserStreak
    );
    navigation.navigate("Home");
  };

  const circleSize =
    selectedStreak?.duration === 3
      ? 60
      : selectedStreak?.duration === 7
      ? 60
      : 60;
  const iconSize =
    selectedStreak?.duration === 3
      ? 40
      : selectedStreak?.duration === 7
      ? 40
      : 40;
  const fontSize =
    selectedStreak?.duration === 3
      ? 10
      : selectedStreak?.duration === 7
      ? 10
      : 10;

  return (
    <SafeAreaView style={styles.container}>
      <Modal
       animationType="slide"
       transparent={true}
       visible={modalVisible}
       onRequestClose={hideModal}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>What is a journey?</Text>
          <Text style={styles.modalText}>
            Journey is like a streak, you complete your daily step goals and earn more points for being consistent everyday.
          </Text>
          <Pressable onPress={hideModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>

    <Modal
        animationType="slide"
        transparent={true}
        visible={missionsModalVisible}
        onRequestClose={hideMissionsModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Compete with other users to complete a rush to earn extra points.
            </Text>
            <Pressable onPress={handleMissions}>
              <Text style={styles.linkText}>Speed Rush</Text>
            </Pressable>
            <Pressable onPress={hideMissionsModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ImageBackground
        source={require("../../assets/jpeg/sea_background.jpeg")}
        style={styles.backgroundImage}
      >
        <View style={styles.innerContainer}>
          <TouchableOpacity
            style={[styles.infoButton]}
            onPress={showModal}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={[styles.buttonText, { color: "white" }]}>?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.MissionButton, { left: 20 }]} // Adjusted the left position
            onPress={showMissionsModal}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={[styles.buttonText, { color: Colors.EntryLighterWhite }]}>Speed rush</Text>
          </TouchableOpacity>

          {showPicker && !selectedStreak && (
            <Picker
              selectedValue={selectedStreak?.type}
              style={styles.dropdown}
              itemStyle={styles.dropdown_item}
              onValueChange={(itemValue) => {
                const selected = streakTypes.find(
                  (streak) => streak.type === itemValue
                );
                if (selected) {
                  selectStreak(selected);
                }
              }}
            >
              <Picker.Item
                style={styles.dropdown_item}
                label="Start your journey"
                value={null}
              />
              {streakTypes.map((streak, index) => (
                <Picker.Item
                  key={index}
                  label={`${streak.type} - ${streak.duration} days`}
                  value={streak.type}
                />
              ))}
            </Picker>
          )}

          {selectedStreak && !showStartButton && (
            <TouchableOpacity
              onPress={handleCancelStreak}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel your journey</Text>
            </TouchableOpacity>
          )}

          {showStartButton && (
            <>
              <TouchableOpacity
                onPress={() =>
                  startStreak(userID, selectedStreak, setShowStartButton)
                }
                style={styles.startButton}
              >
                <Text style={styles.startButtonText}>Sail away</Text>
              </TouchableOpacity>
              {showReselectButton && (
                <TouchableOpacity
                  onPress={reselectStreak}
                  style={styles.reselectButton}
                >
                  <Text style={styles.reselectButtonText}>
                    Select another journey
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {selectedStreak && (
              <View style={styles.selectedStreakContainer}>
                {/* <Text style={styles.journeyText}>{`${selectedStreak.duration}`} day journey:</Text> */}
                <View style={styles.circleContainer}>
                  {shuffleIcons(
                    Array.from(
                      { length: selectedStreak.duration },
                      (_, index) => renderStreakIcon((index % 12) + 1)
                    )
                  ).map((icon, index) => {
                    const isCompleted =
                      selectedStreak.days[index]?.completed ?? false;
                    return (
                      <View
                        key={index}
                        style={[
                          styles.circle,
                          {
                            width: circleSize,
                            height: circleSize,
                            backgroundColor: isCompleted
                              ? "rgba(0, 165, 0, 0.4)"
                              : "transparent",
                          },
                        ]}
                      >
                        {React.cloneElement(icon, {
                          width: iconSize,
                          height: iconSize,
                        })}
                        {/* <Text style={[styles.circleDate, { fontSize }]}>
                          {calculateDate(index)}
                        </Text> */}
                      </View>
                    );
                  })}
                </View>
              </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  dropdown: {
    width: "75%",
    color: Colors.Yellow,
    backgroundColor: "transparent",
    marginBottom: 50,
    textAlign: "center",
  },
  dropdown_item: {
    backgroundColor: "transparent",
  },
  startButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 100,
  },
  transparentRectangle: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 50,
  },
  reselectButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 100,
  },
  linkText: {
    color: Colors.Blue,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cancelButtonText: {
    color: Colors.Red,
    fontSize: 20,
    fontWeight: "bold",
  },
  startButtonText: {
    color: Colors.Green,
    fontSize: 30,
    fontWeight: "900",
  },
  reselectButtonText: {
    color: Colors.Yellow,
    fontSize: 20,
    fontWeight: "bold",
  },
  journeyText: {
    color: "#4682B4",
    fontSize: 16,
    fontWeight: "bold",
  },
  missionText: {
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
    alignContent: "center",
    display: "flex",
  },
  selectedStreakContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  circleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    borderRadius: 20,
    borderColor: "black",
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 40,
  },
  circleDate: {
    position: "absolute",
    bottom: 0,
    fontWeight: "bold",
    color: "blue",
  },
  backgroundContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "30%",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  infoButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
   MissionButton: {
    position: "absolute",
    top: 20,
    right: 20,
    borderRadius: 20,
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalView: {
    backgroundColor: "#87CEEB", // Light blue color resembling the sea
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#4682B4', // Steel blue color for the modal content background
    padding: 20,
    width: '90%',
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white', // White text color for the header
  },
  modalText: {
    color: 'white', // White text color for the modal text
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: Colors.BackgroundGradientLower,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white', // White text color for the close button
    fontSize: 18,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Streaks;
