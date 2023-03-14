import { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import backServerAddress from "../config";
import * as SecureStore from "expo-secure-store";
import { UserConnect } from "../App";

export default function ParcoursSingle({ route, navigation }) {
  const { slug, id, name } = route.params;
  const { userLog } = useContext(UserConnect);

  // retreive parcours details from server
  const [parcours, setParcours] = useState({});
  const [treks, setTreks] = useState([]);

  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    getParcours();
    getTreks();
  }, [slug]);

  // Retreive One parcours from server
  async function getParcours() {
    const token = await SecureStore.getItemAsync("token");
    console.log("token", token);
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://${backServerAddress}:3001/parcours/${slug}`,
      options
    );
    const data = await response.json();
    // console.log(data);
    if (!data) {
      setParcours({});
      setErrorMessage("Aucun résultat trouvé");
    }
    if (data) {
      setParcours(data);
      setErrorMessage(null);
      // displayTreks()
    }
  }

  // Display all the treks available for one parcours
  async function getTreks() {
    const token = await SecureStore.getItemAsync("token");
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://${backServerAddress}:3001/treks/get/${slug}`,
      options
    );
    const data = await response.json();
    if (!data) {
      setTreks({});
      setErrorMessage("Aucun résultat trouvé");
    }
    if (data) {
      setTreks(data);
      setErrorMessage(null);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{parcours.name}</Text>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Oldoinyolengai.jpg",
          }}
          style={styles.image}
        />
        {parcours.duration === 1 ? (
          <Text>Durée : {parcours.duration} jour</Text>
        ) : (
          <Text>Durée : {parcours.duration} jours</Text>
        )}
        <Text>Prix :{parcours.price} €</Text>
        <Text>Difficulté: {parcours.difficulty}</Text>
        <Text>Détail du parcours</Text>
        <Text>{parcours.description}</Text>
        <Text>Les étapes : </Text>
        {parcours?.steps?.map((step) => (
          <View key={step._id} style={styles.step}>
            <View style={styles.left}>
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Oldoinyolengai.jpg",
                }}
                style={styles.stepImage}
              />
            </View>
            <View style={styles.right}>
              <Text style={styles.stepDescription}>{step.stepDescription}</Text>
            </View>
          </View>
        ))}
        {treks?.map((trek) => (
          <View key={trek?._id} style={styles.step}>
            <View style={styles.left}>
              <Image
              />
            </View>
            <View style={styles.right}>
              <Text style={styles.stepTitle}>{trek?.beginDate}</Text>
              <Text style={styles.stepDescription}>{trek?.trekName}</Text>
              <TouchableOpacity
            style={styles.button}
            onPress={() =>
              // navigation.navigate("ParcoursSingle", { slug : parcours.slug
              navigation.navigate("TreksSingle", {
                trekID:  trek._id,
                slug: slug,
                slugTrek: trek.slug
                })
            }
          ><Text style={styles.textbutton}>Réserver</Text>
          </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  stepContainer: {
    backgroundColor: "pink",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  stepImage: {
    width: 100,
    height: 100,
    marginHorizontal: 20,
  },
  step: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  right: {
    flex: 1,
    backgroundColor: "pink",
  },
  left: {
    backgroundColor: "yellow",
    justifyContent: "center",
  },

  // stepDescription: {},
});
