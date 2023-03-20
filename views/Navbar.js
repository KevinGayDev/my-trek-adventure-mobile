import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Foundation } from "@expo/vector-icons";
import Treks from "./Treks";
import Parcours from "./Parcours";
import Profil from "./Profil";
import ParcoursSingle from "./ParcoursSingle";
import TreksSingle from "./TreksSingle";
import TreksUser from "./TreksUser";
// import { UserConnect } from "../App";
import UserConnect from "../Context";

// import { UserConnect } from "../App";
// import { useContext } from "react";

// import ParcoursStackNav from "./ParcoursStackNav";

export default function Navbar({ navigation }) {
  const Tab = createBottomTabNavigator();
  // const {userLog, disconnect} = useContext(UserConnect);

  // if (!userLog) {
  //   disconnect();
  //   navigation.navigate("Login");}

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: "grey",
        tabBarActiveTintColor: "black",
        tabBarHideOnKeyboard: true,
        tabBarStyle: { backgroundColor: "#fda82e", height: 56 },
        tabBarLabelStyle: {
          fontSize: 14,
      }
      }}

      //  screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Mes treks"
        component={Treks}
        options={{
          // tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused, activecolor }) => (
            <Foundation name="foot" size={32} color={color} />
          ),
          headerStyle: {
            backgroundColor: "#fda82e",
          },
          unmountOnBlur: true
        }}
      />

      <Tab.Screen
        name="Réserver"
        component={Parcours}
        options={{
          // tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused, activecolor }) => (
            <Foundation name="calendar" size={32} color={color} />
          ),
          headerStyle: {
            backgroundColor: "#fda82e",
          },
        }}
      />

      <Tab.Screen
        name="Mon profil"
        component={Profil}
        options={{
          tabBarIcon: ({ color, size, focused, activecolor }) => (
            <Foundation name="info" size={32} color={color} />
          ),
          headerStyle: {
            backgroundColor: "#fda82e",
          },
        }}
      />

      <Tab.Screen
        name="ParcoursSingle"
        component={ParcoursSingle}
        options={{
          title: "Détails du parcours",
          tabBarLabel: "Home",
          headerStyle: {
            backgroundColor: "#fda82e",
          },
          tabBarButton: () => null,
        }}
      />

      <Tab.Screen
        name="TreksSingle"
        component={TreksSingle}
        options={{
          title: "Détails du trek",
          tabBarLabel: "Home",
          headerStyle: {
            backgroundColor: "#fda82e",
          },
          tabBarButton: () => null,
        }}
      />

      <Tab.Screen
        name="TreksUser"
        component={TreksUser}
        options={{
          title: "Détails du trek",
          tabBarLabel: "Home",
          headerStyle: {
            backgroundColor: "#fda82e",
          },
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1ff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderRadius: 16,
    backgroundColor: "#fff",
    width: 250,
    height: 50,
    margin: 20,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "blue",
    width: 140,
    height: 36,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 16,
    margin: 36,
  },
  textbutton: {
    color: "white",
    alignSelf: "center",
    fontSize: 16,
  },
});

// import { SimpleLineIcons } from '@expo/vector-icons';
