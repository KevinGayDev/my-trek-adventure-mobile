import { StyleSheet, Text, View } from "react-native";
import ParcoursList from "../components/ParcoursList";

export default function Parcours({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parcours proposés</Text>
 

      <ParcoursList navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});