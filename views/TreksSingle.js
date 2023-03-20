import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import backServerAddress from "../config";
import * as SecureStore from "expo-secure-store";
// import { UserConnect } from "../App";
import UserConnect  from "../Context";
import { format } from "date-fns";

export default function TreksSingle({ route, navigation }) {
  const { trekID, slug, slugTrek } = route.params;
  const { userLog } = useContext(UserConnect);
  const [guide, setGuide] = useState({});

  console.log(slugTrek);

  // retreive parcours details from server
  const [parcours, setParcours] = useState({});
  const [treks, setTreks] = useState({
    beginDate: "2023-03-14T17:14:13.951Z",
    endDate: "2023-03-14T17:14:13.951Z",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  // const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    getTreks();
  }, [slug]);

  // Display all the treks available for one parcours
  async function getTreks() {
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
      `http://${backServerAddress}:3001/treks/${slugTrek}`,
      options
    );
    const data = await response.json();
    console.log(data);
    if (!data) {
      setTreks({});
      setErrorMessage("Aucun résultat trouvé");
    }
    if (data) {
      setTreks(data);
      getParcoursAndGuide(data.parcoursID, data.guideID);
      setErrorMessage(null);
    }
  }


  // Display the Guide for the trek
  async function getParcoursAndGuide(parcoursID, guideID) {
    const token = await SecureStore.getItemAsync("token");
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const guideResponse = await fetch(
      `http://${backServerAddress}:3001/guides/get/${guideID}`,
      options
    );
    const guideData = await guideResponse.json();
    if (!guideData) {
      setGuide({});
      setErrorMessage("Aucun résultat trouvé");
    }
    if (guideData) {
      setGuide(guideData);
      setErrorMessage(null);
    }
    const parcoursResponse = await fetch(
      `http://${backServerAddress}:3001/parcours/get/${parcoursID}`,
      options
    );
    const parcoursData = await parcoursResponse.json();
    if (!parcoursData) {
      setParcours({});
      setErrorMessage("Aucun résultat trouvé");
    }
    if (parcoursData) {
      setParcours(parcoursData);
      setErrorMessage(null);
    }
  }

  // Send Bookings to server
  async function putBooking() {
    const token = await SecureStore.getItemAsync("token");
    const options = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ trekID: trekID }),
    };

    const response = await fetch(
      `http://${backServerAddress}:3001/bookings/add`,
      options
    );
    const data = await response.json();
    if (!data) {
      setParcours({});
      setErrorMessage("Aucun résultat trouvé");
    }
    if (data) {
      setParcours(data);
      setErrorMessage(null);
      navigation.navigate("Mes treks", {
        })
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{parcours.name}</Text>
        <Text>départ le : </Text>
        <Text style={styles.stepTitle}>
          {format(new Date(treks?.beginDate), "dd/MM/yyyy")}
        </Text>
        <Text>arrivée le : </Text>
        <Text style={styles.stepTitle}>
          {format(new Date(treks?.endDate), "dd/MM/yyyy")}
        </Text>
        <Text>Guide : </Text><Text style={styles.stepTitle}>{guide?.firstName} {guide?.lastName}</Text>
        <Text>Prix :</Text><Text style={styles.stepTitle}>{parcours?.price} €</Text>
        <TouchableOpacity style={styles.button} onPress={() => putBooking()}>
          <Text style={styles.textbutton}>Réserver et Payer</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.container}>
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
              navigation.navigate("TrekSingle", {
                iD: trek._id,
                name: trek.trekName,
                slug: trek._id,
                // userID: METTRE ICI La donnée à renvoyer dans la page parcours Single.
              })
            }
          ><Text style={styles.textbutton}>Réserver</Text>
          </TouchableOpacity>
            </View>
          </View>
        ))}
      </View> */}
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
  // stepDescription: {},
});
