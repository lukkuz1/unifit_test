import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from 'src/constants/Enums';
import Colors from 'src/constants/Colors';
import EntryInputField from 'src/components/Entry/EntryInputField';
import EntryButton from 'src/components/Entry/EntryButton';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from 'src/hooks/useAuth';

export default function Entry() {
  const navigation = useNavigation();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    const status = await auth.signUp(email, password);
    if (status != undefined) {
      setError(status);
    }
    else {
      Alert.alert('Verification link sent to your email', 'Confirm your email to login in to application.');
      navigation.navigate("Login");
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <Text style={styles.label}>Sign Up</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <EntryInputField
          headerText="Email"
          placeholderText="example@gmail.com"
          isPassword={false}
          margin={[0, 20, 0, 0]}
          onChangeText={(text) => setEmail(text)}
        />
        <EntryInputField
          headerText="Password"
          placeholderText="Enter Your Password"
          isPassword={true}
          margin={[0, 20, 0, 0]}
          onChangeText={(text) => setPassword(text)}
        />
        <EntryButton
          text="Sign Up"
          textColor={Colors.White}
          buttonColor={Colors.HeaderGreen}
          margin={[30, 75, 0, 0]}
          onPress={() => handleSignUp()}
          style={{elevation: 5}}
        />
        <View style={{ height: 25, width: 310, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: Colors.Black, fontSize: 14, fontWeight: "400" }}>Already have an account ?</Text>
          <Pressable style={{}} onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: Colors.Black, fontSize: 14, fontWeight: "600", marginLeft: 5 }}>Log in!</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 60,
    color: Colors.Black,
    fontSize: 26,
    fontWeight: "500",
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  separatorText: {
    color: Colors.Black,
    fontSize: 18,
    fontWeight: "400",
    textAlign: 'center',
    paddingHorizontal: 8,
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
