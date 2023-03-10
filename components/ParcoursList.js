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
import { useState, useContext, useEffect } from "react";
import backServerAddress from "../config";

export default function ParcoursList({navigation}) {
  // const [isConnected, setIsConnected] = useState(false);
  const [parcoursList, setParcourslist] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    displayParcoursList();
  }, []);

  async function displayParcoursList() {
    const response = await fetch(`http://${backServerAddress}:3001/parcours/`);
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
    <View>
      {parcoursList.map((parcours) => (
        <View key={parcours.slug}>
          <Text>{parcours.name}</Text>
          {parcours.duration === 1 ? <Text> {parcours.duration} jour</Text> :   <Text>{parcours.duration} jours</Text> }
          <Text>{parcours.price} €</Text>
          <Text>{parcours.description}</Text>
          <TouchableOpacity 
          style={styles.button}
          onPress={() =>
            // navigation.navigate("ParcoursSingle", { slug : parcours.slug
              navigation.navigate("ParcoursSingle", { slug : parcours.slug
              // userID: METTRE ICI La donnée à renvoyer dans la page parcours Single.
            })
          }>
          <Text style={styles.textbutton}>Détail</Text></TouchableOpacity>
 
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
});

