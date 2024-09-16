import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import Colors from "src/constants/Colors";
import { useAuth } from "src/hooks/useAuth";
import { useUser } from "src/hooks/useUser";
import EntryInputField from "src/components/Entry/EntryInputField";
import EntryButton from "src/components/Entry/EntryButton";
import { ScrollView } from "react-native-gesture-handler";
import PressableField from "src/components/Main/Profile/PressableField";
import { getAuth, deleteUser } from "@firebase/auth";

enum ChangeData {
  Password,
  Email,
}

export default function Profile() {
  const [weight, setWeight] = useState<string>();
  const [height, setHeight] = useState<string>();
  const [age, setAge] = useState<string>();
  const [stepGoal, setStepGoal] = useState<string>();
  const [changeEmail, setChangeEmail] = useState<boolean>(false);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [changeData, setChangeData] = useState<string>("");
  const [changeDataRepeat, setChangeDataRepeat] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const auth = useAuth();
  const user = useUser();
  const authUser = getAuth();

  const handleDeleteAccount = async () => {
    try {
      const confirmation = await new Promise<boolean>((resolve, reject) => {
        Alert.alert(
          "Delete Account",
          "Are you sure you want to delete your account?",
          [
            { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
            { text: "Delete", onPress: () => resolve(true) },
          ]
        );
      });

      if (confirmation) {
        await deleteUser(authUser.currentUser);
        Alert.alert(
          "Account Deleted",
          "Your account has been successfully deleted."
        );
        auth.signOut();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete account");
    }
  };

  const handleLogOut = async () => {
    await auth.signOut();
  };

  const handleChangeRequest = async (type: ChangeData) => {
    if (type == ChangeData.Password) {
      if (changeData == changeDataRepeat && changeData != "") {
        console.log("Changing password");
        const status: string = await auth.updatePassword(changeData);
        if (status != undefined) {
          if (status == "auth/operation-not-allowed") {
            setErrorMessage("Please verify your current email");
          } else {
            setErrorMessage(status);
          }
        } else {
          Alert.alert("Password Changed", "Password was changed successfully");
          setChangePassword(false);
          setChangeData("");
          setChangeDataRepeat("");
          setErrorMessage("");
        }
      } else setErrorMessage("Passwords don't match or empty");
    } else if (type == ChangeData.Email) {
      if (changeData == changeDataRepeat && changeData != "") {
        console.log("Changing email");
        const status = await auth.updateEmail(changeData);
        if (status != undefined) {
          setErrorMessage(status);
        } else {
          Alert.alert("Email Changed", "Email was changed successfully");
          setChangePassword(false);
          setChangeData("");
          setChangeDataRepeat("");
          setErrorMessage("");
        }
      } else setErrorMessage("Emails don't match or empty");
    }
  };

  const handleSaveRequest = async () => {
    let updateData = {};

    if (weight != undefined && Number(weight) != user.weight) {
      updateData = {
        ...updateData,
        weight: Number(weight),
      };
      setWeight(undefined);
    }
    if (height != undefined && Number(height) != user.height) {
      updateData = {
        ...updateData,
        height: Number(height),
      };
      setHeight(undefined);
    }
    if (age != undefined && Number(age) != user.age) {
      updateData = {
        ...updateData,
        age: Number(age),
      };
      setAge(undefined);
    }
    if (stepGoal != undefined && Number(stepGoal) != user.stepGoal) {
      updateData = {
        ...updateData,
        stepGoal: Number(stepGoal),
      };
      setStepGoal(undefined);
    }

    if (Object.keys(updateData).length != 0) {
      await user
        .updateDataJSON(updateData)
        .finally(() => {
          Alert.alert("Success", "Data was successfully saved");
        })
        .catch((error) => {});
    } else {
      Alert.alert("Missing data", "None of the fields were changed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View
          style={{
            height: 64,
            width: 64,
            position: "absolute",
            top: -32,
            left: 70,
            backgroundColor: Colors.ProfileLightGreen,
            borderRadius: 100,
          }}
        ></View>
        <View
          style={{
            height: 120,
            width: 120,
            position: "absolute",
            top: -36,
            left: 264,
            backgroundColor: Colors.ProfileLightGreen,
            borderRadius: 100,
          }}
        ></View>
        <View
          style={{
            height: 104,
            width: 104,
            position: "absolute",
            top: 130,
            left: -14,
            backgroundColor: Colors.ProfileLightGreen,
            borderRadius: 100,
          }}
        ></View>
        <View
          style={{
            height: 42,
            width: 42,
            position: "absolute",
            top: 118,
            left: 310,
            backgroundColor: Colors.ProfileLightGreen,
            borderRadius: 100,
          }}
        ></View>
        <View
          style={{
            marginTop: 40,
            borderColor: Colors.EntryDarkerWhite,
            borderWidth: 1,
            borderRadius: 100,
            elevation: 5,
          }}
        >
          <Image source={require("src/assets/jpeg/blankprofile.png")} />
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: Colors.White,
            marginTop: 15,
          }}
        >
          {user.user.email}
        </Text>
      </View>
      <View style={styles.dataContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <PressableField
            headerText="Email"
            style={{ width: 270, marginTop: 10, alignSelf: "center" }}
            onPress={() => {
              setChangeEmail(true);
            }}
          />
          <Modal
            visible={changeEmail}
            transparent={true}
            animationType={"fade"}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></View>
          </Modal>
          <Modal
            visible={changeEmail}
            transparent={true}
            animationType={"slide"}
          >
            <View
              style={[
                styles.dataContainer,
                { height: "auto", width: "auto", padding: 10 },
              ]}
            >
              <Text style={styles.textStyle}>Change Email</Text>
              {errorMessage != "" ? (
                <>
                  <Text style={styles.error}>{errorMessage}</Text>
                </>
              ) : (
                <></>
              )}
              <EntryInputField
                headerText="New Email"
                placeholderText={user.user.email}
                isPassword={false}
                keyboardType={"default"}
                onChangeText={(text) => {
                  setChangeData(text);
                }}
                style={{
                  width: 270,
                  margin: 10,
                  marginBottom: 15,
                  alignSelf: "center",
                }}
              />
              <EntryInputField
                headerText="Repeat New Email"
                placeholderText={user.user.email}
                isPassword={false}
                keyboardType={"default"}
                onChangeText={(text) => {
                  setChangeDataRepeat(text);
                }}
                style={{ width: 270, margin: 10, alignSelf: "center" }}
              />
              <EntryButton
                text="Change"
                textColor={Colors.White}
                buttonColor={Colors.HeaderGreen}
                onPress={() => {
                  handleChangeRequest(ChangeData.Email);
                }}
                style={{
                  width: 270,
                  marginTop: 20,
                  alignSelf: "center",
                  elevation: 5,
                }}
              />
              <EntryButton
                text="Cancel"
                textColor={Colors.White}
                buttonColor={Colors.Gray}
                onPress={() => {
                  setChangeEmail(false);
                  setChangeData("");
                  setChangeDataRepeat("");
                  setErrorMessage("");
                }}
                style={{
                  width: 270,
                  marginTop: 10,
                  alignSelf: "center",
                  elevation: 5,
                }}
              />
            </View>
          </Modal>
          <PressableField
            headerText="Password"
            style={{ width: 270, marginTop: 10, alignSelf: "center" }}
            onPress={() => {
              setChangePassword(true);
            }}
          />
          <Modal
            visible={changePassword}
            transparent={true}
            animationType={"fade"}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></View>
          </Modal>
          <Modal
            visible={changePassword}
            transparent={true}
            animationType={"slide"}
          >
            <View
              style={[
                styles.dataContainer,
                { height: "auto", width: "auto", padding: 10 },
              ]}
            >
              <Text style={styles.textStyle}>Change Password</Text>
              {errorMessage != "" ? (
                <>
                  <Text style={styles.error}>{errorMessage}</Text>
                </>
              ) : (
                <></>
              )}
              <EntryInputField
                headerText="New Password"
                placeholderText="_______"
                isPassword={true}
                keyboardType={"default"}
                onChangeText={(text) => {
                  setChangeData(text);
                }}
                style={{
                  width: 270,
                  margin: 10,
                  marginBottom: 15,
                  alignSelf: "center",
                }}
              />
              <EntryInputField
                headerText="Repeat New Password"
                placeholderText="_______"
                isPassword={true}
                keyboardType={"default"}
                onChangeText={(text) => {
                  setChangeDataRepeat(text);
                }}
                style={{ width: 270, margin: 10, alignSelf: "center" }}
              />
              <EntryButton
                text="Change"
                textColor={Colors.White}
                buttonColor={Colors.HeaderGreen}
                onPress={() => {
                  handleChangeRequest(ChangeData.Password);
                }}
                style={{
                  width: 270,
                  marginTop: 20,
                  alignSelf: "center",
                  elevation: 5,
                }}
              />
              <EntryButton
                text="Cancel"
                textColor={Colors.White}
                buttonColor={Colors.Gray}
                onPress={() => {
                  setChangePassword(false);
                  setChangeData("");
                  setChangeDataRepeat("");
                  setErrorMessage("");
                }}
                style={{
                  width: 270,
                  marginTop: 10,
                  alignSelf: "center",
                  elevation: 5,
                }}
              />
            </View>
          </Modal>
          <EntryInputField
            headerText="Weight"
            placeholderText={user.weight.toString()}
            isPassword={false}
            keyboardType={"number-pad"}
            onChangeText={(text) => {
              setWeight(text);
            }}
            postfix="kg"
            style={{ width: 270, marginTop: 10, alignSelf: "center" }}
            headerStyle={{
              fontWeight: weight != undefined ? "bold" : "normal",
            }}
          />
          <EntryInputField
            headerText="Height"
            placeholderText={user.height.toString()}
            isPassword={false}
            keyboardType={"number-pad"}
            onChangeText={(text) => {
              setHeight(text);
            }}
            postfix="cm"
            style={{ width: 270, marginTop: 10, alignSelf: "center" }}
            headerStyle={{
              fontWeight: height != undefined ? "bold" : "normal",
            }}
          />
          <EntryInputField
            headerText="Age"
            placeholderText={user.age.toString()}
            isPassword={false}
            keyboardType={"number-pad"}
            onChangeText={(text) => {
              setAge(text);
            }}
            style={{ width: 270, marginTop: 10, alignSelf: "center" }}
            headerStyle={{ fontWeight: age != undefined ? "bold" : "normal" }}
          />
          <EntryInputField
            headerText="Step Goal"
            placeholderText={user.stepGoal.toString()}
            isPassword={false}
            keyboardType={"number-pad"}
            onChangeText={(text) => {
              setStepGoal(text);
            }}
            style={{
              width: 270,
              marginTop: 10,
              marginBottom: 10,
              alignSelf: "center",
            }}
            headerStyle={{
              fontWeight: stepGoal != undefined ? "bold" : "normal",
            }}
          />
        </ScrollView>
        <EntryButton
          text="Save"
          textColor={Colors.White}
          buttonColor={Colors.HeaderGreen}
          onPress={() => {
            handleSaveRequest();
          }}
          style={{
            width: 270,
            marginTop: 10,
            alignSelf: "center",
            elevation: 5,
          }}
        />
        <EntryButton
          text="Log out"
          textColor={Colors.White}
          buttonColor={Colors.ProfileLogOutButton}
          onPress={handleLogOut}
          style={{
            width: 270,
            marginTop: 10,
            alignSelf: "center",
            elevation: 5,
          }}
        />
        <EntryButton
          text="Delete account"
          textColor={Colors.White}
          buttonColor={Colors.Red}
          onPress={() => handleDeleteAccount()}
          style={{
            width: 270,
            marginTop: 10,
            marginBottom: 20,
            alignSelf: "center",
            elevation: 5,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  headerContainer: {
    height: 280,
    backgroundColor: Colors.HeaderGreen,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    alignItems: "center",
    elevation: 5,
  },
  dataContainer: {
    height: 480,
    width: 310,
    position: "absolute",
    top: 230,
    backgroundColor: Colors.White,
    elevation: 6,
    borderRadius: 30,
    overflow: "hidden",
    alignSelf: "center",
  },
  textStyle: {
    alignSelf: "center",
    color: Colors.Black,
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
