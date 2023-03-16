import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// import { UserConnect } from "../App";
import UserConnect  from "../Context";
import { useContext, useState, useEffect } from "react";
import * as Location from 'expo-location';
import * as SecureStore from "expo-secure-store";
import backServerAddress from "../config";
import MapView, {
  MAP_TYPES,
  PROVIDER_DEFAULT,
  UrlTile,
} from "react-native-maps";
import { Marker } from "react-native-maps";

export default function Treks({ navigation }) {
  const { userLog } = useContext(UserConnect);
  // Load the first time
  useEffect(() => {
    getMyBookings();
  }, []);

  const [bookings, setBookings] = useState([]);
  const [parcours, setParcours] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [location, setLocation] = useState(null);

  // get the "user" info from DB
  async function getMyBookings() {
    const token = await SecureStore.getItemAsync("token");
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + token,
      },
    };
    const result = await fetch(
      `http://${backServerAddress}:3001/bookings/userbookings/`,
      options
    );
    let data = await result.json();
    if (data !== null) {
      setBookings(data);
      // console.log(bookings);
      getUserPosition();
      // console.log(location);

    }

    async function getUserPosition() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg("L'application n'a pas pu accéder à votre position");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log(" -------- location ----------")
      console.log(location)
      setLocation(location);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.myTrekContainer}>
        <Text style={styles.title}> {bookings?.length !== 0 ? "Mes réservations" : "Ma réservation" } {bookings?.length > 1 && <Text style={{fontSize:16}}>{`(${bookings?.length})`}</Text>}</Text>
        {bookings.length !== 0 ? (
          <View>
            {bookings?.map((booking) => (
              <View key={booking?._id} style={styles.trekItem}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("TreksUser", {
                      slugTrek: booking.slug,
                      parcoursID: booking.parcoursID,
                      guideID: booking.guideID,
                    })
                  }
                >
                  <Text style={styles.text}>{booking.trekName}</Text>
                </TouchableOpacity>
                <Text style={styles.text}> {booking.trekState} </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate("TreksUser", {
                      slugTrek: booking.slug,
                      parcoursID: booking.parcoursID,
                      guideID: booking.guideID,
                    })
                  }
                >
                  <Text style={styles.textbutton}>Détail</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text style={styles.text}>Vous n'avez pas encore reservé de trek</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("Parcours", {
                })
              }
            >
              <Text style={styles.textbutton}>Découvrez nos offres</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.containerMap}>
        <MapView
          style={styles.map}
          region={{
            latitude: location?.coords?.latitude,
              longitude: location?.coords?.longitude,
            latitudeDelta: 50,
            longitudeDelta: 45,
          }}>
            {/* User marker */}
          {location && (<Marker
            // key={index}
            coordinate={{
              latitude: location?.coords?.latitude,
              longitude: location?.coords?.longitude,
            }}
            title="Ma position actuelle"
            /*description={marker.stepDescription}*/
            pinColor="green"
          />)}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1ebe3",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    color: "#b0a292",
    fontWeight: "bold",
    fontSize: 20,
    margin: 4,
  },
  containerMap: {
    flex: 0.5,
    // ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  myTrekContainer: {
    marginVertical: 50,
    borderRadius: 10,
    borderColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "white",
  
  },
  trekItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    margin: 10,
    justifyContent: 'flex-end'
  },
  button: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#f89d0e",
    width: 70,
    marginHorizontal: 5,
  },
  textbutton: {
    alignSelf: "center",
    fontSize: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
