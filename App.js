import { StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import Login from './views/Login';
import Register from './views/Register';
import Navbar from './views/Navbar';
import * as React from "react";
import * as SecureStore from 'expo-secure-store';
import backServerAddress from "./config";


import { StatusBar } from 'expo-status-bar';

export default function App() {


  React.useEffect(() => {
    getUser();
  }, []);

  const [userLog, setUserLog] = React.useState([]);

  async function getUser() {
    // const token = localStorage.getItem("token");
    const token = getValueFor("token")
    console.log("token" , token);
    if (!token)
    {
      setUserLog(null);
    }
    const options = {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          Authorization: "bearer " + token,
      },
    };
      const result = await fetch(`http://${backServerAddress}:3001/login/userinfos`, options);
      let data = await result.json();
      console.log("data" , data);
      if (data.message !== "Token invalide") {
        setUserLog(data);
      }
  }


// 
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      console.log("RESULT : ", result)
      alert("🔐 Here's your value 🔐 \n" + result);
    } else {
      alert('No values stored under that key.');
    }
  }  

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
