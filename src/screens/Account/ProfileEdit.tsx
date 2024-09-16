import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, updatePhoneNumber, updateEmail, PhoneAuthProvider } from '@firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import EntryInputField from 'src/components/Entry/EntryInputField';
import EntryButton from 'src/components/Entry/EntryButton';
import Colors from 'src/constants/Colors';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';

const ProfileEdit = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [phoneNumber, setPhoneNumber] = useState(auth.currentUser.phoneNumber || '');
  const [email, setEmail] = useState(auth.currentUser.email || '');
  const darkMode = useDarkModeToggle();

  function handleUpdateProfile() {
  }

  return (
    <LinearGradient colors={darkMode ? [Colors.DarkBackgroundGradientLower, Colors.DarkBackgroundGradientUpper] : [Colors.BackgroundGradientUpper, Colors.BackgroundGradientLower]} style={styles.container}>
      <View>
        <Text style={styles.label}>Edit your email</Text>

        <EntryInputField
          headerText="Email"
          placeholderText="Enter Email"
          value={email}
          isPassword={false}
          keyboardType="email-address"
          margin={[10, 0, 0, 0]}
          onChangeText={(text) => setEmail(text)}
        />
        <EntryButton
          text="Update Profile"
          textColor={Colors.White}
          buttonColor={Colors.LightBlue}
          margin={[40, 0, 0, 0]}
          onPress={handleUpdateProfile}
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

export default ProfileEdit;
