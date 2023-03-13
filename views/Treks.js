import {
    StyleSheet,
    Text,
    View,
  } from "react-native";
  import { UserConnect } from "../App";
  import { useContext } from "react";
  
  export default function Treks() {

    const {userLog} = useContext(UserConnect);


    return (

        <View style={styles.container}>
        <Text style={styles.title}>Infos</Text>
        <Text style={styles.content}>
   Info trecks
        </Text>
      </View>
        
    )
  }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
    });
