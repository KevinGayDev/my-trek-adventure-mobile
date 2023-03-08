import { StyleSheet, Text, View } from "react-native";
import ParcoursList from "../components/ParcoursList";

export default function Parcours() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Infos</Text>
      <Text style={styles.content}>
    Info Parcours
      </Text>

      <ParcoursList />
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