import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as React from "react";
import { useState, useContext } from "react";

import backServerAddress from "../config";
export default function Login({ navigation }) {
  //  const { setUserLog } = useContext(UserConnect);

  const [user, setUser] = useState({
    mail: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = React.useState(null);
  const [successMessage, setsuccessMessage] = React.useState(null);

  function handleChange(label, value) {
    setUser({ ...user, [label]: value });
  }

  async function handleSubmit() {
    if (user.mail === "" || user.password === "") {
      setErrorMessage(`Un ou plusieurs champ(s) manquant(s)`);
    } else if (user.mail && user.password !== "") {
      setErrorMessage(null);

      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      };
      try {
        // Post data to DB on /login routes
        const result = await fetch(
          `http://${backServerAddress}:3001/login/user`,
          options
        );

        // Response from DB on /login routes
        const data = await result.json();

        // retreive token
        // const token = data.token;
        if (data.success) {
          setsuccessMessage(data.message);
          setErrorMessage(null);
          navigation.navigate("Navbar");

          // TODO
          // setUserLog(data.user);
        } else if (!data.success) {
          setErrorMessage(data.message);
          setsuccessMessage(null);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text>Identifiant</Text>
          <TextInput
            style={styles.input}
            // onChangeText={onChangeNumber}
            // value={number}
            placeholder="Votre email"
            keyboardType="email-address"
            // onChangeText={handleChange}
            onChangeText={(value) => handleChange("mail", value)}
            value={user.mail}
            autoCapitalize="none"
          />

          <Text>Mot de passe</Text>
          <TextInput
            style={styles.input}
            // onChangeText={onChangeNumber}
            // value={number}
            placeholder="Votre mot de passe"
            keyboardType="default"
            // onChangeText={handleChange}
            onChangeText={(value) => handleChange("password", value)}
            value={user.password}
            secureTextEntry={true}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmit()}
          >
            {/* onPress={() => navigation.navigate("Navbar")}> */}
            <Text style={styles.textbutton}>Se connecter</Text>
          </TouchableOpacity>
          <Text>{errorMessage}</Text>
          <Text>{successMessage}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.textbutton}>Pas encore inscrit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Navbar")}
          >
            <Text style={styles.textbutton}>Passage secret</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // logo: {
  //     height: 80,
  //     width: 300,
  //     margin: 50,
  // },
  container: {
    flex: 1,
    backgroundColor: "#00a5a7",
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
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 16,
    margin: 36,
    backgroundColor: "#f89d0e",
  },
  textbutton: {
    alignSelf: "center",
    fontSize: 16,
  },
});
