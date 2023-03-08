import { StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import Login from './views/Login';
import Register from './views/Register';
import Navbar from './views/Navbar';
import * as React from "react";

import { StatusBar } from 'expo-status-bar';

export default function App() {

  const Stack = createStackNavigator();

  return (

    <NavigationContainer >
    <Stack.Navigator  screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="Navbar" component={Navbar}  /> 
    </Stack.Navigator>
    <StatusBar style="auto" />
  </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
