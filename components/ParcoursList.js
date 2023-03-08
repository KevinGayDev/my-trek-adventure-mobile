import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
  } from "react-native";
  import * as React from "react";
  import { useState, useContext, useEffect } from "react";
  import backServerAddress from "../config";


export default function ParcoursList() {


// const [isConnected, setIsConnected] = useState(false);
const [parcoursList, setParcourslist] = useState([])
const [errorMessage, setErrorMessage] = React.useState(null);

useEffect(() => {displayParcoursList()}, [])

async function displayParcoursList()
  {
      const response = await fetch(`http://${backServerAddress}:3001/parcours/`);
      const data = await response.json()
      if (!data) 
      {
        setParcourslist([]);
        setErrorMessage("Aucun résultat trouvé");
      }

      if (Array.isArray(data)) 
      {
        setParcourslist(data);
        setErrorMessage(null);
      }
  }

return (


<View>
    {parcoursList.map((item) => 
   <Text>{item.name}</Text> )}
</View>




    // code REACT KEBIN 
    // <div id = "parcoursList">
    //   <p>Liste des parcours</p>
    //     {parcoursList.map((parcours, index) => (
    //       <Parcours 
    //         key = {index}
    //         picture = {parcours.picture} 
    //         name = {parcours.name} 
    //         duration = {parcours.duration} 
    //         description = {parcours.description}
    //         price = {parcours.price} 
    //         difficulty = {parcours.difficulty}
    //         slug = {parcours.slug}
    //         />        
    //     ))}
    // </div>

);
}