import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from 'src/hooks/useAuth';
import MainNavigation from 'src/navigations/MainNavigation';
import EntryNavigation from 'src/navigations/EntryNavigation';
import userInfo from "../services/firebase";
import { useUser } from 'src/hooks/useUser';

const Stack = createStackNavigator();

export default function Navigation() {
  const auth = useAuth();
  const user = useUser();

  return (
    <NavigationContainer>
      {auth.loggedIn && user.initialized ? (
        <MainNavigation />
      ) : (
        <EntryNavigation />
      )}
    </NavigationContainer >
  );
};
