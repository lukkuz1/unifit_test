import React, { useContext } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';
import Colors from "src/constants/Colors";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AccountIcon from "../../assets/svg/account.svg";
import NotificationsIcon from "../../assets/svg/notifications.svg";
import AppearanceIcon from "../../assets/svg/appearance.svg";
import AboutIcon from "../../assets/svg/about.svg";
import ArrowIcon from "../../assets/svg/arrow.svg";
import ChangePasswordIcon from "../../assets/svg/password.svg"
import DeleteAccountIcon from "../../assets/svg/deleteaccount.svg"
import StepGoalIcon from "../../assets/svg/stepgoal.svg"
import { useAuth } from "src/hooks/useAuth";

type Props = {
  time?: number;
  margin?: [top: number, bottom: number, left: number, right: number];
};

type RootParamList = {
  Login: undefined;
  Account: undefined;
};

export default function Account({ margin = [0, 100, 0, 0] }: Props) {
  const darkMode = useDarkModeToggle();
  const auth = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();

  const handlePasswordChange = () => {
    navigation.navigate("ChangePassword");
  };

  const handleProfileEdit = () => {
    navigation.navigate("ProfileEdit");
  };

  const handleTargetStep = () => {
    navigation.navigate("StepGoal");
  };

  const handleAccountDelete = () => {
    navigation.navigate("AccountDelete");
  };

  return (
    <LinearGradient
      colors={darkMode ? [Colors.DarkBackgroundGradientLower, Colors.DarkBackgroundGradientUpper] : [Colors.BackgroundGradientUpper, Colors.BackgroundGradientLower]}
      style={styles.container}
    >
      <View
        style={[
          styles.rectangle,
          {
            marginTop: margin[0],
            marginBottom: margin[1],
            marginLeft: margin[2],
            marginRight: margin[3],
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <ChangePasswordIcon style={styles.iconpush} />
            <Text style={styles.label}>Change Password</Text>
          </View>
          <Pressable
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={handlePasswordChange}
          >
            <ArrowIcon style={styles.arrowpush} />
          </Pressable>
        </View>
        <View style={styles.horizoltalLine} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <AccountIcon style={styles.iconpush} />
            <Text style={styles.label}>Edit Profile</Text>
          </View>
          <Pressable
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={handleProfileEdit}
          >
            <ArrowIcon style={styles.arrowpush} />
          </Pressable>
        </View>
        <View style={styles.horizoltalLine} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <StepGoalIcon style={styles.iconpush} />
            <Text style={styles.label}>Add step goal</Text>
          </View>
          <Pressable
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={handleTargetStep}
          >
            <ArrowIcon style={styles.arrowpush} />
          </Pressable>
        </View>
        <View style={styles.horizoltalLine} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <DeleteAccountIcon style={styles.iconpush} />
            <Text style={styles.deleteaccount}>Delete account</Text>
          </View>
          <Pressable
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={handleAccountDelete}
          >
            <ArrowIcon style={styles.arrowpush} />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  label: {
    marginLeft: 20,
    color: Colors.EntryLighterWhite,
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  
  deleteaccount: {
    marginLeft: 20,
    color: "red",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  iconpush: {
    marginLeft: 20,
  },
  arrowpush: {
    marginRight: 20,
  },
  logout: {
    marginLeft: 20,
    color: "red",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  about: {
    marginLeft: 25,
    color: Colors.EntryLighterWhite,
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  rectangle: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "40%",
    borderRadius: 20,
    borderColor: Colors.TransparentRectangleBorder,
    borderWidth: 1.3,
    backgroundColor: Colors.TransparentRectangle,
  },

  horizoltalLine: {
    width: "100%",
    height: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.TransparentRectangleBorder,
  },
});
