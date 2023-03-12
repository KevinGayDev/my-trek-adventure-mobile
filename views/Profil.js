import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from "react-native";
import ImagePickerComponent from "../components/ImagePickerComponent";
import { useEffect, useState } from "react";
import backServerAddress from "../config";
import * as SecureStore from "expo-secure-store";

export default function Profil() {
  // Image for ImagePickerComponent passed as prop
  const [image, setImage] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

  const [userDetail, setUserDetail] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    password: "",
    profilePicture: "",
    slug: "",
  });
  console.log("userDetail", userDetail);

  // Load the first time
  useEffect(() => {
    getUserUnique();
  }, []);

  // get the "user" info from DB
  async function getUserUnique() {
    const token = await SecureStore.getItemAsync("token");
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + token,
      },
    };
    const result = await fetch(
      `http://${backServerAddress}:3001/login/userinfos/`,
      options
    );
    let data = await result.json();
    console.log("data : -->", data);
    if (data !== null) {
      setUserDetail(data);
    }
  }

  // Update user detail const from Input
  function handleChange(label, value) {
    setUser({ ...user, [label]: value });
  }

// Submit change to server and DB
  async function handleSubmit() {
    if (
      user.firstName === "" ||
      user.lastName === "" ||
      // user.password === "" ||
      user.mail === ""
    ) {
      setErrorMessage(`Un ou plusieurs champ(s) manquant(s)`);
    } else if (
      user.firstName !== "" &&
      user.lastName !== "" &&
      // user.password !== "" &&
      user.mail
    ) {
      setErrorMessage(null);

      let options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      };
      try {  
        const result = await fetch(
          `http://${backServerAddress}:3001/clients/update`,
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
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <ImageBackground source={require("../assets/nik-shuliahin-rkFIIE9PxH0-unsplash.jpg")}  style={{flex:1, }}>
      <View style={styles.container}>

    
        {userDetail?.profilePicture !== "" && (
          <Image
            style={styles.profilePicture}
            source={{ uri: userDetail.profilePicture }}
          />
        )}

        <Text style={styles.content}>{userDetail?.firstName}</Text>
        <Text style={styles.content}>{userDetail?.lastName}</Text>
        <Text style={styles.content}>{userDetail?.mail}</Text>
        <Text style={styles.content}>{userDetail?.pro}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsClicked(!isClicked)}
        >
          <Text style={styles.textbutton}>Modifier mes informations</Text>
        </TouchableOpacity>

        {isClicked === true && (
          <View>
            <Text style={styles.text}>Votre Prénom</Text>

            <TextInput
              style={styles.input}
              // onChangeText={onChangeNumber}
              value={userDetail.firstName}
              onChangeText={(value) => handleChange("lastName", value)}
              placeholder="Votre Nom"
              keyboardType="default"
            />
            <Text style={styles.text}>Votre Nom</Text>

            <TextInput
              style={styles.input}
              // onChangeText={onChangeNumber}
              value={userDetail.lastName}
              onChangeText={(value) => handleChange("lastName", value)}
              placeholder="Votre Nom"
              keyboardType="default"
            />

            <Text style={styles.text}>Votre Email</Text>
            <TextInput
              style={styles.input}
              value={userDetail.mail}
              onChangeText={(value) => handleChange("lastName", value)}
              placeholder="Votre Nom"
              keyboardType="default"
            />

            <Text style={styles.text}>Votre Mot de passe</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange("lastName", value)}
              placeholder="Entrer un nouveau de mot de passe si vous souhaiter le changer"
              keyboardType="default"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.textbutton}>
                Enregistrer les modifications
              </Text>
            </TouchableOpacity>

            <ImagePickerComponent
              image={image}
              setImage={setImage}
              title="Modifier mon Image de profil"
            />
          </View>
        )}
        

      </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  containerScroll: {
    flexGrow: 1,
  },

  profilePicture: {
    width: 200,
    height: 200,
    marginVertical: 20
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
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

  text: {
    textAlign: "left",
    alignSelf: "flex-start",
    paddingBottom: 10,
  },
  textbutton: {
    color: "white",
    alignSelf: "center",
    fontSize: 16,
  },
});
