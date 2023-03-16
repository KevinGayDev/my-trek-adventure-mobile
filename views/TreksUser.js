import { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import backServerAddress from "../config";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
// import { UserConnect } from "../App";
import UserConnect from "../Context";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { format } from "date-fns";

export default function TreksUser({ route, navigation }) {
  const { trekID, slug, slugTrek, parcoursID } = route.params;
  const { userLog } = useContext(UserConnect);

  // retreive parcours details from server
  const [parcours, setParcours] = useState({});
  const [parcoursSteps, setParcoursSteps] = useState([]);
  const [treks, setTreks] = useState({
    beginDate: "2023-03-14T17:14:13.951Z",
    endDate: "2023-03-14T17:14:13.951Z",
  });
  const [guide, setGuide] = useState({});
  const [location, setLocation] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    getTreks();
  }, [slugTrek]);

  // useEffect(() => {

  // }, [parcours]);

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
      `http://${backServerAddress}:3001/treks/${slugTrek}`,
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
      getParcoursAndGuide(data.parcoursID, data.guideID);
      getUserPosition();
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
      setParcoursSteps();
      setErrorMessage("Aucun résultat trouvé");
    }
    if (parcoursData) {
      setParcours(parcoursData);
      setParcoursSteps(parcoursData.steps);
      setErrorMessage(null);
    }
  }

  async function getUserPosition() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("L'application n'a pas pu accéder à votre position");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
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
        {guide && (
          <View>
            <Text>Guide : </Text>
            <Text style={styles.stepTitle}>
              {guide?.firstName} {guide?.lastName}
            </Text>
          </View>
        )}

        <View style={styles.progressionContainer}>

          <Text style={[styles.stepTitle, {marginBottom: 10}]}> Votre progression</Text>
          {parcoursSteps.map((step) => (
            <Text> {step.stepName}</Text>
          ))}
        </View>
      </View>

      <View style={styles.containerMap}>
        <MapView
          style={styles.map}
          region={{
            latitude: parcoursSteps[0]?.stepLatitude,
            longitude: parcoursSteps[0]?.stepLongitude,
            latitudeDelta: 0.8,
            longitudeDelta: 0.8,
          }}
        >
          {/* Custom OSM Tile */}
          {parcoursSteps.map((marker) => (
            <Marker
              key={marker.stepLatitude}
              coordinate={{
                latitude: marker.stepLatitude,
                longitude: marker.stepLongitude,
              }}
              title={marker.stepName}
              description={marker.stepDescription}
              pinColor="black"
            />
          ))}

          {/* User marker */}
          {location && (
            <Marker
              // key={index}
              coordinate={{
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
              }}
              title="Ma position actuelle"
              /*description={marker.stepDescription}*/
              pinColor="green"
            />
          )}
        </MapView>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1ebe3",   
     alignItems: "center",
    justifyContent: "flex-start",
  },
  progressionContainer: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    margin: 12,
    backgroundColor: "white"
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  containerMap: {
    flex: 0.5,
    // ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  // stepDescription: {},
});
