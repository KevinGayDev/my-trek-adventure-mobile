import React, { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerComponent() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Sélectionner une image" onPress={pickImage} style={styles.button} />
      {image && <Image source={{ uri: image }}  style={styles.image}  />}
      
      {image && <Button title='Envoyer' ></Button>}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    margin: 20,
    width: 200, 
    height: 200 
  } })