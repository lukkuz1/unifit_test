import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack';
import Colors from 'src/constants/Colors';
import Home from 'src/screens/Main/Home'
import WaterIntakePage from 'src/screens/Main/WaterIntake';
import Store from 'src/screens/Main/Store';
import Map from 'src/screens/Main/Map'
import Missions from 'src/screens/Main/Missions';
import ProfileNavigation from './ProfileNavigation';
import HomeIcon from "src/assets/svg/home.svg"
import StoreIcon from "src/assets/svg/store.svg"
import TargetsIcon from "src/assets/svg/targets.svg"
import ProfileIcon from "src/assets/svg/profile.svg"
import MapIcon from "src/assets/svg/map.svg";
import StreakIcon from "src/assets/svg/streaks.svg";
import { RootStackParamList } from 'src/navigations/navigation';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="WaterIntakeScreen" component={WaterIntakePage} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <Tab.Navigator
      tabBarPosition={'bottom'}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.HeaderGreen,
          borderRadius: 30,
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 15,
          height: 66,
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 0,
        },
        tabBarIndicatorStyle: {
          height: 0,
        },
        unmountOnBlur: route.name === 'SettingsNavigation' || route.name === "Streaks",
        tabBarActiveTintColor: Colors.TabBarActiveTint,
        tabBarInactiveTintColor: Colors.TabBarInactiveTint,
        tabBarIcon: ({ color }) => {
          if (route.name === "Home")
            return <HomeIcon width={44} fill={color} />
          else if (route.name === "Store")
            return <StoreIcon width={44} fill={color} />
          else if (route.name === "Targets")
            return <TargetsIcon width={44} fill={color} />
          else if (route.name === "ProfileTab")
            return <ProfileIcon width={44} fill={color} />
          else if (route.name === "Map")
            return <MapIcon width={44} fill={color} />
          else if (route.name === "Streaks")
            return <StreakIcon width={44} fill={color} />
        },
        tabBarIconStyle: {
          marginRight: 22,
        }
      })}
      initialRouteName="Home"
    >
      <Tab.Screen name="Store" component={Store} />
      <Tab.Screen name="Streaks" component={Missions} />
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigation} />
    </Tab.Navigator >
  );
};
