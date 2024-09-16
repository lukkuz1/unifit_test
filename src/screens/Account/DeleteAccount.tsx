import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, CommonActions} from '@react-navigation/native';
import { getAuth, deleteUser } from '@firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import EntryButton from 'src/components/Entry/EntryButton';
import Colors from 'src/constants/Colors';
import { useAuth } from 'src/hooks/useAuth';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';

const DeleteAccount = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const userInfo = useAuth();
  const darkMode = useDarkModeToggle();

  const handleDeleteAccount = () => {
    deleteUser(auth.currentUser)
      .then(() => {
        Alert.alert("Account Deleted", "Your account has been successfully deleted.");
        userInfo.signOut();
      })
      .catch((error) => {
        Alert.alert("Account Deletion Failed", error.message);
      });
  };

  return (
    <LinearGradient colors={darkMode ? [Colors.DarkBackgroundGradientLower, Colors.DarkBackgroundGradientUpper] : [Colors.BackgroundGradientUpper, Colors.BackgroundGradientLower]} style={styles.container}>
      <View>
        <Text style={styles.label}>Delete your account</Text>
        <EntryButton
          text="Delete Account"
          textColor={Colors.White}
          buttonColor={Colors.Red}
          margin={[40, 0, 0, 0]}
          onPress={handleDeleteAccount}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 60,
    color: Colors.EntryLighterWhite,
    fontSize: 24,
    fontWeight: "700",
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeleteAccount;
