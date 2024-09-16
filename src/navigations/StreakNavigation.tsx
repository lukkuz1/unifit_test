import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Streaks from 'src/screens/Main/Streaks';
import Missions from 'src/screens/Main/Missions';



const Stack = createStackNavigator();

export default function StreakNavigation() {

  return (
    <Stack.Navigator
      initialRouteName="StreakNavigation"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
        presentation: 'modal',
      }
      }
    >
      <Stack.Screen name="StreakNavigation" component={Streaks} />
      <Stack.Screen name="Missions" component={Missions} />
    </Stack.Navigator>
  );
};
