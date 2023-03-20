import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
import * as React from "react";
import { useState, useContext, useEffect } from "react";
import SelectDropdown from 'react-native-select-dropdown';
import backServerAddress from "../config";
import * as SecureStore from "expo-secure-store";
import { Foundation } from "@expo/vector-icons";

export default function ParcoursList({ navigation }) {
  const [parcoursList, setParcourslist] = useState([]);
  const [parcoursFilterList, setParcoursFilterList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [parcoursName, setParcoursName] = useState("");

  const [displayFieldSearch, setDisplayFieldSearch] = useState(false);
  const [displayFieldFilter, setDisplayFieldFilter] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState("0");
  const [displaySearch, setDisplaySearch] = useState(false);
  const [displayFilters, setDisplayFilters] = useState(false);

  useEffect(() => {
    displayParcoursList();
  }, []);

  useEffect(() => {
    if (parcoursName !== "") {
      const timeoutId = setTimeout(() => {
        filterParcoursByName();
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
    if (parcoursName === "") {
      setDisplaySearch(false);
      setErrorMessage("");
    }
  }, [parcoursName]);

  async function displayParcoursList() {
    const token = await SecureStore.getItemAsync("token");
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://${backServerAddress}:3001/parcours/`,
      options
    );
    const data = await response.json();
    if (!data) {
      setParcourslist([]);
      setErrorMessage("Aucun résultat trouvé");
    }

    if (Array.isArray(data)) {
      setParcourslist(data);
      setErrorMessage("");
    }
  }

  // Filter parcours by name
  async function filterParcoursByName() {
    const token = await SecureStore.getItemAsync("token");
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://${backServerAddress}:3001/parcours/filter/${parcoursName}`,
      options
    );
    setParcoursName("");
    const data = await response.json();
    if (data == []) {
      setParcoursFilterList([]);
      setErrorMessage("Aucun résultat trouvé");
    }
    setParcoursFilterList(data);
    setDisplaySearch(true);
    setErrorMessage(data.length + " parcours trouvé(s)");
  }

  // Filter parcours by difficulty and / or price
  async function filterParcoursDuo() {
    if (difficultyFilter === 0 && priceFilter === 0) {
      setSearchState("cancel");
    }
    else if (difficultyFilter > 0 || priceFilter > 0) {
      const token = await SecureStore.getItemAsync("token");
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch(`http://${backServerAddress}:3001/parcours/duo/${difficultyFilter}/${priceFilter}`, options);

      setDifficultyFilter(0);
      setPriceFilter(0);

      const data = await response.json();
      if (!data) {
        setParcoursFilterList([]);
        setErrorMessage("Aucun résultat trouvé");
        setSearchState("cancel");
      }
      setParcoursFilterList(data);
      setDisplaySearch(true);
      setErrorMessage(data.length + " parcours trouvé(s)");
    }
  }

  function setSearchState(name) {
    switch (name) {
      case "search":
        setDisplayFieldSearch(true);
        setDisplayFieldFilter(false);
        break;
      case "filters":
        setDisplayFieldSearch(false);
        setDisplayFieldFilter(true);
        break;
      case "cancel":
        setDisplayFieldSearch(false);
        setDisplayFieldFilter(false);
        setDisplaySearch(false);
        setDisplayFilters(false);
        break;
    }
  }

  return (
    <View style={styles.containerParcours}>
      <View>
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={() => setSearchState("search")} >
            <Text style={styles.textbutton}>Rechercher par nom</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} onPress={() => setSearchState("filters")}>
            <Text style={styles.textbutton}>+ de filtres</Text>
          </TouchableOpacity>
        </View>
        {displayFieldSearch && (
          <>
            <TextInput
              style={styles.input}
              onChangeText={setParcoursName}
              value={parcoursName}
              placeholder="Entrer un nom (par ex.): Parcours"
              keyboardType="default"
            />
            <TouchableOpacity style={styles.searchButton} onPress={() => setSearchState("cancel")}>
              <Text style={styles.textbutton}>Annuler</Text>
            </TouchableOpacity>
          </>
        )}
        {displayFieldFilter && (
          <View >
            <View style={styles.searchContainer}>
              <SelectDropdown
                data={["Tous", "1", "2", "3"]}
                defaultButtonText={"Difficulté"}
                buttonStyle={styles.dropdown}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem + " " + index);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  if (selectedItem === "Tous") {
                    setDifficultyFilter(0);
                  }
                  else {
                    setDifficultyFilter(selectedItem);
                  }
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item
                }}
              />
              <TextInput
                style={styles.input}
                onChangeText={setPriceFilter}
                value={priceFilter}
                placeholder="Par prix max (par ex. 500) "
                keyboardType="numeric"
              />
            </View>
            <View style={styles.searchContainer}>
              <TouchableOpacity style={styles.searchButton} onPress={filterParcoursDuo}>
                <Text style={styles.textbutton}>Rechercher</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.searchButton} onPress={() => setSearchState("cancel")}>
                <Text style={styles.textbutton}>Annuler</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.priceText]}>{errorMessage}</Text>
          </View>
        )}


        {/* If the user searches a parcours by name*/}
        {displaySearch && (
          (parcoursFilterList.length > 0 && (
            parcoursFilterList.map((parcours) => (
              <View style={styles.viewParcour} key={parcours._id}>
                <View style={styles.parcoursTop}>
                  <Image source={{
                    uri: `http://${backServerAddress}:3001${parcours.parcoursPicture}`,
                  }}
                    style={styles.image}
                  />

                  <View style={styles.left}>
                    <Text style={styles.titleParcour}>{parcours.name}</Text>
                    <Text style={styles.titleCountry}>{parcours.country}</Text>

                    {parcours.duration === 1 ? (
                      <Text style={styles.highlight}>{parcours.duration} jour</Text>
                    ) : (
                      <Text style={[styles.highlight]}>
                        {parcours.duration} jours
                      </Text>
                    )}

                    {parcours.difficulty === 1 && (
                      <Text style={styles.highlight}>
                        Niveau <Foundation name="foot" size={16} color={"#f1ebe3"} />
                      </Text>
                    )}

                    {parcours.difficulty === 2 && (
                      <Text style={styles.highlight}>
                        Niveau <Foundation name="foot" size={16} color={"#f1ebe3"} />{" "}
                        <Foundation name="foot" size={16} color={"#f1ebe3"} />
                      </Text>
                    )}
                    {parcours.difficulty === 3 && (
                      <Text style={styles.highlight}>
                        Niveau <Foundation name="foot" size={16} color={"#f1ebe3"} />{" "}
                        <Foundation name="foot" size={16} color={"#f1ebe3"} />{" "}
                        <Foundation name="foot" size={16} color={"#f1ebe3"} />
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.parcoursMiddle}>
                  <Text numberOfLines={3} style={styles.textDescription}>
                    {parcours.description}
                  </Text>
                  <View style={styles.parcoursBottom}>
                    <View style={styles.leftBottom}>
                      <Text style={styles.priceText}>{parcours.price} €</Text>
                    </View>
                    <View style={styles.right}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                          navigation.navigate("ParcoursSingle", {
                            slug: parcours.slug,
                            iD: parcours._id,
                            name: parcours.name,
                          })
                        }
                      >
                        <Text style={styles.textbutton}>Détail</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )))
          )
        )

        }

        {/* Normal display */}
        {!displayFieldSearch && (!displayFilters && !displaySearch) && (
          <>
            {parcoursList.map((parcours) => (
              <View style={styles.viewParcour} key={parcours._id}>
                <View style={styles.parcoursTop}>
                  <Image source={{
                    uri: `http://${backServerAddress}:3001${parcours.parcoursPicture}`,
                  }}
                    style={styles.image}
                  />

                  <View style={styles.left}>
                    <Text style={styles.titleParcour}>{parcours.name}</Text>
                    <Text style={styles.titleCountry}>{parcours.country}</Text>

                    {parcours.duration === 1 ? (
                      <Text style={styles.highlight}>{parcours.duration} jour</Text>
                    ) : (
                      <Text style={[styles.highlight]}>
                        {parcours.duration} jours
                      </Text>
                    )}

                    {parcours.difficulty === 1 && (
                      <Text style={styles.highlight}>
                        Niveau <Foundation name="foot" size={16} color={"#f1ebe3"} />
                      </Text>
                    )}

                    {parcours.difficulty === 2 && (
                      <Text style={styles.highlight}>
                        Niveau <Foundation name="foot" size={16} color={"#f1ebe3"} />{" "}
                        <Foundation name="foot" size={16} color={"#f1ebe3"} />
                      </Text>
                    )}
                    {parcours.difficulty === 3 && (
                      <Text style={styles.highlight}>
                        Niveau <Foundation name="foot" size={16} color={"#f1ebe3"} />{" "}
                        <Foundation name="foot" size={16} color={"#f1ebe3"} />{" "}
                        <Foundation name="foot" size={16} color={"#f1ebe3"} />
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.parcoursMiddle}>
                  <Text numberOfLines={3} style={styles.textDescription}>
                    {parcours.description}
                  </Text>
                  <View style={styles.parcoursBottom}>
                    <View style={styles.leftBottom}>
                      <Text style={styles.priceText}>{parcours.price} €</Text>
                    </View>
                    <View style={styles.right}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                          // navigation.navigate("ParcoursSingle", { slug : parcours.slug
                          navigation.navigate("ParcoursSingle", {
                            slug: parcours.slug,
                            iD: parcours._id,
                            name: parcours.name,
                          })
                        }
                      >
                        <Text style={styles.textbutton}>Détail</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  containerParcours: {
    marginHorizontal: 20,
  },
  viewParcour: {
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f1ebe3",
  },
  textDescription: {
    textAlign: "justify",
  },
  parcoursTop: {
    flexDirection: "row",
  },
  parcoursMiddle: {
    marginVertical: 12,
  },
  parcoursBottom: {
    marginTop: 16,
    flexDirection: "row",
  },
  titleParcour: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 2,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  titleCountry: {
    marginBottom: 8,
    fontSize: 16,
  },
  left: {
    paddingHorizontal: 16,
    flex: 1,
  },
  leftBottom: {
    flex: 1,
  },
  right: {
    paddingHorizontal: 10,
    alignContent: "flex-end",
  },
  dropdown: {
    width:124,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    alignSelf: "center"
  },
  button: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#f89d0e",
    width: 70,
  },
  textbutton: {
    alignSelf: "center",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-evenly",
  },
  searchButton: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    alignContent: "center",
    justifyContent: "space-evenly",
    borderRadius: 16,
    backgroundColor: "#f89d0e",
    width: 150,
    height: 40,
    marginHorizontal: 8
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 12,
  },
  highlight: {
    backgroundColor: "#b0a292",
    marginVertical: 4,
    color: "#f1ebe3",
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  priceText: {
    fontWeight: "bold",
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 8,
    marginVertical: 8,
  }
});
