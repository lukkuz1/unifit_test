import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useAuth } from 'src/hooks/useAuth';
import { Logo } from 'src/constants/Enums';
import Colors from 'src/constants/Colors';
import EntryInputField from 'src/components/Entry/EntryInputField'
import EntryButton from 'src/components/Entry/EntryButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();

  const navigation = useNavigation();

  const handleLogin = async () => {
    const status = await auth.signIn(email, password);

    if (status != undefined) {
      setError(status);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <Text style={styles.label}>Login</Text>
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
        <View style={{ height: 25, width: 310, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <BouncyCheckbox
            size={23}
            fillColor={Colors.HeaderGreen}
            style={{ position: 'absolute', marginRight: 0, paddingRight: 0 }}
          />
          <Text style={{ color: Colors.Black, fontSize: 14, fontWeight: "400", left: 30 }}>Remember Me</Text>
          <Pressable style={{ position: 'absolute', right: 0 }} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={{ color: Colors.Black, fontSize: 14, fontWeight: "600" }}>Forgot Password?</Text>
          </Pressable>
        </View>
        <EntryButton
          text="Login"
          textColor={Colors.White}
          buttonColor={Colors.HeaderGreen}
          margin={[30, 75, 0, 0]}
          onPress={() => handleLogin()}
          style={{elevation: 5}}
        />
        <View style={{ height: 25, width: 310, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: Colors.Black, fontSize: 14, fontWeight: "400" }}>Don't have an account ?</Text>
          <Pressable style={{}} onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: Colors.Black, fontSize: 14, fontWeight: "600", marginLeft: 5 }}>Sign up!</Text>
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
