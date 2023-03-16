import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { UserConnect } from "../App";
import { useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import backServerAddress from "../config";
import MapView, {
  MAP_TYPES,
  PROVIDER_DEFAULT,
  UrlTile,
} from "react-native-maps";

export default function Treks({ navigation }) {
  const { userLog } = useContext(UserConnect);
  // Load the first time
  useEffect(() => {
    getMyBookings();
  }, []);

  const [bookings, setBookings] = useState([]);
  const [parcours, setParcours] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

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
      console.log(bookings);

      // getParcours();
    }
  }

  // get the "Parcours" info from DB

  // async function getParcours() {
  //   const token = await SecureStore.getItemAsync("token");
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "bearer " + token,
  //     },
  //   };
  //   const result = await fetch(
  //     `http://${backServerAddress}:3001/parcours/get/${bookings[0]?.parcoursID}`,
  //     options
  //   );
  //   const data = await result.json();
  //   console.log("data : -->", data);
  //   if (data !== null) {
  //     setParcours(data);
  //     setErrorMessage(null);
  //   }
  // }

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
            // latitude: parcours?.steps[0].stepLatitude,
            // longitude: parcours?.steps[0].stepLongitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
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
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "white",
  },
  trekItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    margin: 10,
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
