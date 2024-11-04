import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { getAuth, updateEmail } from '@firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import EntryInputField from 'src/components/Entry/EntryInputField';
import EntryButton from 'src/components/Entry/EntryButton';
import Colors from 'src/constants/Colors';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';

const ProfileEdit = () => {
  const auth = getAuth();
  const [email, setEmail] = useState(auth.currentUser.email || '');
  const darkMode = useDarkModeToggle();

  const handleUpdateProfile = async () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; // Simple email validation

    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      await updateEmail(auth.currentUser, email);
      Alert.alert('Profile Updated', 'Your email has been successfully updated.');
    } catch (error) {
      Alert.alert('Update Failed', error.message);
    }
  };

  return (
    //<LinearGradient
      //colors={darkMode ? [Colors.DarkBackgroundGradientLower, Colors.DarkBackgroundGradientUpper] : [Colors.BackgroundGradientUpper, Colors.BackgroundGradientLower]}
      //style={styles.container}
    //>
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
    //</LinearGradient>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 60,
    color: Colors.EntryLighterWhite,
    fontSize: 24,
    fontWeight: '700',
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
