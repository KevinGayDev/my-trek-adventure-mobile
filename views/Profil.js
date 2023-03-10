import { StyleSheet, Text, View } from "react-native";
import ImagePickerComponent from "../components/ImagePickerComponent";
import { useEffect, useState } from "react";
import backServerAddress from "../config";
import * as SecureStore from "expo-secure-store";

export default function Profil() {
  const [userDetail, setUserDetail] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    password: "",
    profilePicture: "",
    slug: "",
  });

  // Load the first time
  useEffect(() => {
    getUserUnique();
  }, []);
  

  // get the "user" info from DB
  async function getUserUnique() {
    console.log("test");
    const token = await SecureStore.getItemAsync("token");
    // const token = localStorage.getItem("token");
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + token,
      },
    };
    const result = await fetch(
      `http://${backServerAddress}/client/userinfos/`,
      options
    );
    let data = await result.json();
    if (data !== null) {
      setUserDetail(data);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Infos</Text>
      <Text style={styles.content}>Info utilisateur</Text>
      <ImagePickerComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
