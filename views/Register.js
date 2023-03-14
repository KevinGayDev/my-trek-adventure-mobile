import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  ScrollView,
} from "react-native";

import * as React from "react";
import { useState, useContext } from "react";
import backServerAddress from "../config";
import ImagePickerComponent from "../components/ImagePickerComponent";

export default function Register({ navigation }) {
  const [image, setImage] = useState(null);

  React.useEffect(() => {
    setUser({ ...user, ["profilePicture"]: image });
  }, [image]);

  React.useEffect(() => {
    console.log(user);
  }, [user]);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    password: "",
    clientPicture: "",
  });

  const [errorMessage, setErrorMessage] = React.useState(null);
  const [successMessage, setsuccessMessage] = React.useState(null);

  function handleChange(label, value) {
    setUser({ ...user, [label]: value });
  }

  async function handleSubmit() {
    if (
      user.firstName === "" ||
      user.lastName === "" ||
      user.password === "" ||
      user.mail === ""
    ) {
      setErrorMessage(`Un ou plusieurs champ(s) manquant(s)`);
    } else if (
      user.firstName !== "" &&
      user.lastName !== "" &&
      user.password !== "" &&
      user.mail
    ) {
      setErrorMessage(null);

      console.log(user);
      let formdata = new FormData();
      formdata.append("firstName", user.firstName);
      formdata.append("lastName", user.lastName);
      formdata.append("mail", user.mail);
      formdata.append("password", user.password);
      formdata.append("clientPicture", {
        name: "profile.jpeg",
        uri: image,
        type: "image/jpeg",
      });

      let options = {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formdata,
      };

      try {
        // Post data to DB on /login routes
        const result = await fetch(
          `http://${backServerAddress}:3001/register/user`,
          options
        );

        // Response from DB on /login routes
        const data = await result.json();

        // retreive token
        // const token = data.token;
        if (data.success) {
          setsuccessMessage(data.message);
          setErrorMessage(null);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.text}>Prénom</Text>
            <TextInput
              style={styles.input}
              // onChangeText={onChangeNumber}
              // value={number}
              onChangeText={(value) => handleChange("firstName", value)}
              placeholder="Votre Prénom"
              keyboardType="default"
            />
            <Text style={styles.text}>Nom</Text>
            <TextInput
              style={styles.input}
              // onChangeText={onChangeNumber}
              // value={number}
              onChangeText={(value) => handleChange("lastName", value)}
              placeholder="Votre Nom"
              keyboardType="default"
            />

            <Text style={styles.text}>Mail</Text>
            <TextInput
              style={styles.input}
              // onChangeText={onChangeNumber}
              // value={number}
              placeholder="Votre adresse email"
              keyboardType="email-address"
              value={user.mail}
              onChangeText={(value) => handleChange("mail", value)}
            />
            <Text style={styles.text}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              // onChangeText={onChangeNumber}
              // value={number}
              placeholder="Votre mot de passe"
              keyboardType="default"
              onChangeText={(value) => handleChange("password", value)}
              secureTextEntry={true}
            />
            {/* <TextInput
        style={styles.input}
        // onChangeText={onChangeNumber}
        // value={number}
        placeholder="Photo de profil"
        keyboardType="default"
        onChangeText={(value) => handleChange("profilePicture", value)}
      /> */}

            <ImagePickerComponent image={image} setImage={setImage} />

            <Text>{image}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.textbutton}>S'inscrire</Text>
            </TouchableOpacity>
            <Text>
              {errorMessage} {successMessage}
            </Text>

            {/*  TODO Affichage conditionnel du boutton lorsque le register est OK. */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Login")}
            >
              <Text>Vers la page de connexion </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 80,
    width: 300,
    margin: 50,
  },

  text: {
    textAlign: "left",
    alignSelf: "flex-start",
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f89d0e",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },

  input: {
    borderRadius: 16,
    backgroundColor: "#fff",
    width: 250,
    height: 50,
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#a92e34",
    paddingVertical: 8,
    paddingHorizontal: 24,
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
