import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import * as React from "react";
import { useState, useContext, useEffect } from "react";
import backServerAddress from "../config";
import * as SecureStore from "expo-secure-store";

export default function ParcoursList({ navigation }) {
  // const [isConnected, setIsConnected] = useState(false);
  const [parcoursList, setParcourslist] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    displayParcoursList();
  }, []);

  async function displayParcoursList() {
    const token = await SecureStore.getItemAsync("token");
    console.log("TOKEN :", token);
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://${backServerAddress}:3001/parcours/`,
      options
    );
    const data = await response.json();
    if (!data) {
      setParcourslist([]);
      setErrorMessage("Aucun résultat trouvé");
    }

    if (Array.isArray(data)) {
      setParcourslist(data);
      setErrorMessage(null);
    }
  }

  return (
    <View style={styles.containerParcours}>
      {parcoursList.map((parcours) => (
        <View style={styles.viewParcour} key={parcours._id}>
          <View style={styles.parcoursTop}>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Oldoinyolengai.jpg",
              }}
              style={{ width: 100, height: 100 }}
            />

            <View style={styles.left}>
              <Text style={styles.titleParcour}>{parcours.name}</Text>
          
              {parcours.duration === 1 ? (
                <Text>Durée : {parcours.duration} jour</Text>
              ) : (
                <Text>Durée : {parcours.duration} jours</Text>
              )}
                  <Text>Niveau : {parcours.difficulty}</Text>
              <Text>Prix : {parcours.price} €</Text>
             
              <Text>Prochain départ le: {parcours.difficulty}</Text>
              
            </View>
          </View>

          <View style={styles.parcoursBottom}>
            <Text style={styles.textDescription}>{parcours.description}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              // navigation.navigate("ParcoursSingle", { slug : parcours.slug
              navigation.navigate("ParcoursSingle", {
                slug: parcours.slug,
                iD: parcours._id,
                name: parcours.name
                // userID: METTRE ICI La donnée à renvoyer dans la page parcours Single.
              })
            }
          >
            <Text style={styles.textbutton}>Détail</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>

    // code REACT KEBIN
    // <div id = "parcoursList">
    //   <p>Liste des parcours</p>
    //     {parcoursList.map((parcours, index) => (
    //       <Parcours
    //         key = {index}
    //         picture = {parcours.picture}
    //         name = {parcours.name}
    //         duration = {parcours.duration}
    //         description = {parcours.description}
    //         price = {parcours.price}
    //         difficulty = {parcours.difficulty}
    //         slug = {parcours.slug}
    //         />
    //     ))}
    // </div>
  );
}
const styles = StyleSheet.create({
  containerParcours: {
    marginHorizontal: 20,
  },
  textDescription: {
    textAlign:'justify'
  },
  parcoursTop: {
    flexDirection: "row",
  },
  parcoursBottom: {
    marginVertical: 5,
  },
  titleParcour: {
    fontWeight: "bold",
  },
  left: {
    paddingHorizontal: 10
  } , 
  button: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#f89d0e",
    width: 70,
  },
  textbutton: {
    alignSelf: "center",
    fontSize: 12,
  },
  viewParcour: {
    marginVertical: 10,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    padding : 10,
    backgroundColor: "white",
  },
});
