import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EntryInputField from 'src/components/Entry/EntryInputField';
import EntryButton from 'src/components/Entry/EntryButton';
import Colors from 'src/constants/Colors';
import firebase from 'src/services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      if (!email.trim()) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
      await sendPasswordResetEmail(firebase.auth, email);
      Alert.alert(
        'Password Reset Email Sent',
        'If you have an account, check your email address for a password reset link.'
      );
      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('Email Not Found', 'This email address is not associated with any account.');
      } else {
        Alert.alert('Password Reset Failed', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <Text style={styles.label}>Forgot Password</Text>
        <EntryInputField
          headerText="Email"
          placeholderText="Enter Your Email"
          isPassword={false}
          margin={[0, 20, 0, 0]}
          onChangeText={(text) => setEmail(text)}
        />
        <EntryButton
          text="Reset Password"
          textColor={Colors.White}
          buttonColor={Colors.HeaderGreen}
          margin={[30, 75, 0, 0]}
          onPress={handleForgotPassword}
          style={{ elevation: 5 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 60,
    color: Colors.Black,
    fontSize: 26,
    fontWeight: '500',
  },
  rectangle: {
    flex: 1,
    marginTop: 180,
    borderTopLeftRadius: 100,
    backgroundColor: Colors.White,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.HeaderGreen,
  },
});

export default ForgotPassword;