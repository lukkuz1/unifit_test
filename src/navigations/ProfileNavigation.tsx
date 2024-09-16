import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from 'src/screens/Main/Profile'
import Account from 'src/screens/Settings/Account';
import Notifications from 'src/screens/Settings/Notifications';
import Appearance from 'src/screens/Settings/Appearance';
import About from 'src/screens/Settings/About';
import ProfileEdit from 'src/screens/Account/ProfileEdit';
import StepGoal from 'src/screens/Account/StepGoal';
import DeleteAccount from 'src/screens/Account/DeleteAccount';


const Stack = createStackNavigator();

export default function ProfileNavigation() {

  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
        presentation: 'modal',
      }
      }
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="AccountNavigation" component={Account} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Appearance" component={Appearance} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
      <Stack.Screen name="AccountDelete" component={DeleteAccount} />
      <Stack.Screen name="StepGoal" component={StepGoal} />
    </Stack.Navigator>
  );
};
