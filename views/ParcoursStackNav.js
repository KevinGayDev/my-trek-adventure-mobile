import { StyleSheet, Text, View, ScrollView } from "react-native";
import ParcoursList from "../components/ParcoursList";
import { createStackNavigator } from "@react-navigation/stack";
import ParcoursSingle from "./Parcours";
import UserConnect  from "../Context";
import { useContext } from "react";

export default function ParcoursStackNav({ navigation }) {

  const { userLog } = useContext(UserConnect);
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="ParcoursList" component={ParcoursList} />
      <Stack.Screen
        name="ParcoursSingle"
        component={ParcoursSingle}
        navigation={navigation}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
  },
});
