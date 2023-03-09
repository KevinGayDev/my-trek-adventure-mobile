import {
    StyleSheet,
    Text,
    View,
  } from "react-native";

  export default function Treks() {


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
