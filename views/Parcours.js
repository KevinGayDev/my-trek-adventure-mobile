import { StyleSheet, Text, View, ScrollView } from "react-native";
import ParcoursList from "../components/ParcoursList";
// import { UserConnect } from "../App";
import UserConnect  from "../Context";
import { useContext } from "react";


export default function Parcours({navigation}) {

  const {userLog} = useContext(UserConnect);

  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>

    <View style={styles.container}>
      <Text style={styles.title}>Parcours proposés</Text>
      <ParcoursList navigation={navigation} />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20
  }
});