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
import { Foundation } from "@expo/vector-icons";
import { format } from 'date-fns'
import MapView, {

} from "react-native-maps";
import { Marker } from "react-native-maps";

export default function ParcoursSingle({ route, navigation }) {
  const { slug, id, name } = route.params;
  const { userLog } = useContext(UserConnect);

  // retreive parcours details from server
  const [parcours, setParcours] = useState({});
  const [treks, setTreks] = useState([]);
  const [parcoursSteps, setParcoursSteps] = useState([]);

  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    getTreks();
    getParcours();
  }, [slug]);

  // Retreive One parcours from server
  async function getParcours() {
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
      `http://${backServerAddress}:3001/parcours/${slug}`,
      options
    );
    const data = await response.json();
    console.log(data);
    if (!data) {
      setParcours({});
      setErrorMessage("Aucun résultat trouvé");
    }
    if (data) {
      setParcours(data);
      setParcoursSteps(data.steps);

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
  console.log(parcours.parcoursPicture);
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{parcours.name}</Text>
        <Text style={styles.title2}>{parcours.country}</Text>

        <Image
          source={{
            uri: `http://${backServerAddress}:3001${parcours.parcoursPicture}`,
          }}
          style={styles.image}
        />
        {parcours.duration === 1 ? (
          <Text style={styles.highlight} >Durée : {parcours.duration} jour</Text>
        ) : (
          <Text style={styles.highlight}>Durée : {parcours.duration} jours</Text>
        )}
       


        {parcours.difficulty === 1 && (
                <Text style={styles.highlight}>
                  Niveau <Foundation name="foot" size={16} color={"#f1ebe3"} />
                </Text>
              )}

              {parcours.difficulty === 2 && (
                <Text style={styles.highlight}>
                  Niveau <Foundation name="foot" size={16} color={"#f1ebe3"} />{" "}
                  <Foundation name="foot" size={16} color={"#f1ebe3"} />
                </Text>
              )}
              {parcours.difficulty === 3 && (
                <Text style={styles.highlight}>
                  Niveau <Foundation name="foot" size={16} color={"#f1ebe3"} />{" "}
                  <Foundation name="foot" size={16} color={"#f1ebe3"} />{" "}
                  <Foundation name="foot" size={16} color={"#f1ebe3"} />
                </Text>
              )}

<Text style={styles.priceText}>{parcours.price} €</Text>

<Text style={styles.title3}>Prochains départs</Text>

<View style={styles.step} > 

{treks?.map((trek) => (
          <View key={trek?._id} style={styles.trek}>
            <View >
              <Image />
            </View>
            <View style={styles.trekItem} >
              <Text style={styles.trekTitle}>du {format(new Date(trek?.beginDate), 'dd/MM/yyyy')}</Text>
              <Text style={styles.trekTitle}> au {format(new Date(trek?.endDate), 'dd/MM/yyyy')}</Text>

             
              {/* <Text style={styles.trekDescription}>{trek?.trekName}</Text> */}
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  // navigation.navigate("ParcoursSingle", { slug : parcours.slug
                  navigation.navigate("TreksSingle", {
                    trekID: trek._id,
                    slug: slug,
                    slugTrek: trek.slug,
                  })
                }
              >
                <Text style={styles.textbutton}>Réserver</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
</View>

        <Text style={styles.title3}>Détail du parcours</Text>
        <Text style={styles.stepDescription}>{parcours.description}</Text>
        <Text style={styles.title3}>Les étapes</Text>
        {parcours?.steps?.map((step) => (
          <View key={step._id} style={styles.step}>
            <View style={styles.stepTop}>
              <View style={styles.left}>
                <Text style={styles.stepTitle}>{step.stepName}</Text>
                <Text style={styles.stepCoords}>Latitude : {step.stepLatitude}°</Text>
                <Text style={styles.stepCoords}>Longitude : {step.stepLongitude}°</Text>
              </View>
              <View style={styles.left}>
                <Image
                  source={{
                    uri: `http://${backServerAddress}:3001${step.stepPicture}`,
                  }}
                  style={styles.stepImage}
                />
              </View>
            </View>
            <View style={styles.right}>
              <Text style={styles.stepDescription}>{step.stepDescription}</Text>
            </View>
          </View>
        ))}

<View style={styles.containerMap}>
        <MapView
          style={styles.map}
          region={{
            latitude: parcoursSteps[0]?.stepLatitude,
            longitude: parcoursSteps[0]?.stepLongitude,
            latitudeDelta: 3,
            longitudeDelta: 3,
          }}
        >
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
    </MapView>
    </View>
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
  },
  stepTop: {
    flexDirection: "row",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 5,
  },
  title2: {
    fontSize: 22,
  },
  title3: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    // alignSelf: "center",
    margin: 10,
    //flex: 1
  },
  highlight: {
    backgroundColor: "#b0a292",
    marginVertical: 4,
    color: "#f1ebe3",
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 12,
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
    borderRadius: 12,
  },
  stepImage: {
    width: 150,
    height: 150,
    margin: 20,
    borderRadius: 8,
  },
  step: {
    marginVertical: 10,
    // flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 1,
    margin: 10,
    borderRadius: 12,
    backgroundColor: "#f1ebe3",


  },
  right: {
    // flex: 1,
    // backgroundColor: "pink",
    alignContent: 'center',

  },
  left: {
    // backgroundColor: "yellow",
    justifyContent: "center",
    flex: 1,
  },
  stepCoords: {
    paddingHorizontal: 10
  },
  stepDescription: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: "justify",
  },
  priceText: {
    fontWeight: "bold",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  containerMap: {
    // ...StyleSheet.absoluteFillObject,
    marginTop: 20,
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  trekItem: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  trek: {
paddingHorizontal: 16,
  },
  button: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#f89d0e",
    width: 70,
    marginHorizontal: 6,
  },
  textbutton: {
    alignSelf: "center",
    fontSize: 12,
  },
});
