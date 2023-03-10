import { useState, useEffect,  } from "react";
import { StyleSheet, Text, View,  } from "react-native";
import backServerAddress from "../config";


export default function ParcoursSingle({route}) {
  const { slug } = route.params;
// Récupérer les infos du pacoursr.
console.log("parcoursSlug",slug)
// retreive parcours details from server
const [parcours, setParcours] = useState({});
const [errorMessage, setErrorMessage] = useState(null);

useEffect(() => {displayParcours()}, [slug])
// useFocusEffect  ?????????????????????


async function displayParcours() {

  const response = await fetch(`http://${backServerAddress}:3001/parcours/${slug}`);
  const data = await response.json();
  if (!data) {
    setParcours({});
    setErrorMessage("Aucun résultat trouvé");
  }

  if (data) {
    setParcours(data);
    setErrorMessage(null);
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parcours proposés</Text>
      <Text>{parcours.name}</Text>
      {parcours.duration === 1 ? <Text> {parcours.duration} jour</Text> :   <Text>{parcours.duration} jours</Text> }
      <Text>{parcours.price}</Text>
      <Text>{parcours.picture}</Text>
      <Text>{parcours.difficulty}</Text>      
      <Text>{parcours.description}</Text>


    {parcours?.steps?.map((step) => 
    <View key={parcours.slug}>
    <Text>{step.stepName}</Text>
    <Text>{step.stepPicture}</Text>
    <Text>{step.stepDescription}</Text>
    </View>
    )}
 
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
