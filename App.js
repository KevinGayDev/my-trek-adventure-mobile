import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./views/Login";
import Register from "./views/Register";
import Navbar from "./views/Navbar";
import * as React from "react";
import * as SecureStore from "expo-secure-store";
import backServerAddress from "./config";
import UserConnect from "./Context"

import { StatusBar } from "expo-status-bar";

// export const UserConnect = React.createContext();

export default function App() {
  React.useEffect(() => {
    getUser();
  }, []);

  const [userLog, setUserLog] = React.useState([]);

  // Logout
 function disconnect() {
    setUserLog(null); 
    async function save(key, value) {
      await SecureStore.setItemAsync(key, value);
    }
    save("token", "");
  }

  async function getUser() {
    // const token = localStorage.getItem("token");
    const token = await SecureStore.getItemAsync("token");
    console.log("token", token);
    if (!token) {
      setUserLog(null);
    }
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "bearer " + token,
      },
    };
    const result = await fetch(
      `http://${backServerAddress}:3001/login/userinfos`,
      options
    );
    let data = await result.json();
    console.log("data", data);
    if (data.message !== "Token invalide") {
      setUserLog(data);
    }
  }

  const Stack = createStackNavigator();

  return (
    <SafeAreaView style={styles.container}>
    <NavigationContainer>
      <UserConnect.Provider value={{ userLog, setUserLog, disconnect }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Navbar" component={Navbar} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </UserConnect.Provider>
    </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
