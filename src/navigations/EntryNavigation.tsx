import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Login from 'src/screens/Entry/Login'
import Register from 'src/screens/Entry/Register'
import ForgotPassword from 'src/screens/Entry/ForgotPassword'
import UserInfoAdd from 'src/screens/Entry/UserInfo';

const Stack = createStackNavigator();

export default function Navigation() {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
};
