import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { UserConnect } from "../App";
import { useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import backServerAddress from "../config";

export default function Treks() {
  const { userLog } = useContext(UserConnect);
  // Load the first time
  useEffect(() => {
    getMyBookings();
  }, []);

  const [bookings, setBookings] = useState([]);

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
    console.log("data : -->", data);
    if (data !== null) {
      setBookings(data);
    }
  }
  console.log(bookings);
  return (
    <View style={styles.container}>
      <View style={styles.myTrekContainer}></View>
      <Text style={styles.title}>Infos</Text>
      <Text style={styles.content}>Vos réservations</Text>
      {bookings?.map((booking) => (
        <View key={booking?._id}>

<Text>{booking.trekName}</Text>
{/* <TouchableOpacity
            style={styles.button}
            onPress={() =>
              // navigation.navigate("ParcoursSingle", { slug : parcours.slug
              navigation.navigate("TreksSingle", {
                trekID:  booking._id,
                slug: slug,
                slugTrek: booking.slug
                })
            }
          > <Text>{booking.trekName}</Text>
          </TouchableOpacity> */}

        
          <Text> {booking.trekState}</Text>

        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
