import { useFonts } from "expo-font";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import colors from "../../../constants/Colors";
import { useFandom } from "../../../contexts/FandomContext"; // 👈 import the hook

export default function SearchScreen() {
  const [fontsLoaded] = useFonts({
    "PressStart2P-Regular": require("../../../assets/fonts/PressStart2P-Regular.ttf"),
  });

  const { results, isLoading, error, fetchFandoms } = useFandom(); // 👈 use the context
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchFandoms(searchTerm);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>Agregar juego o película</Text>
      </View>

      <View style={styles.manualSearchContainer}>
        <Text style={styles.secondTitle}>Búsqueda Manual</Text>
        <TextInput
          style={styles.input}
          placeholder="ingrese fandom"
          placeholderTextColor={colors.grayLight}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />

        {/* Botón visual */}
        <Pressable onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </Pressable>

        {/* Mensajes de estado */}
        {isLoading && (
          <Text style={styles.loadingText}>Cargando resultados...</Text>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
        <ScrollView>
          <View style={styles.containerResult}>
            {results.map((item, index) => (
              <Pressable key={index}>
                <View style={styles.cardContainer}>
                  {item.imageUrl ? (
                    <Image
                      style={styles.image}
                      source={{ uri: item.imageUrl }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.noImageText}>Sin imagen</Text>
                  )}
                  <Text
                    style={styles.name}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.photoSearchContainer}>
        <Text style={styles.secondTitle}>Búsqueda por imagen</Text>
        <View style={[styles.purple]}>
          <Image
            source={require("../../../assets/images/Camera.png")}
            style={{ width: 80, height: 80 , marginTop:10}}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blueDark,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    textAlign: "center",
    fontSize: 24,
  },
  containerTitle: {
    width: "65%",
    paddingBottom: 25,
  },
  secondTitle: {
    fontFamily: "PressStart2P-Regular",
    color: colors.orange,
    textAlign: "center",
    marginBottom: 15,
  },
  manualSearchContainer: {
    backgroundColor: colors.grayDark,
    paddingTop: 20,
    width: "95%",
    height: "55%",
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 30,
  },
  input: {
    width: "75%",
    fontFamily: "PressStart2P-Regular",
    fontSize: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
    color: colors.grayDark,
    textAlign: "center",
    padding: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: colors.orange,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 0,
    marginBottom: 10,
  },
  searchButtonText: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 10,
    color: colors.white,
    textAlign: "center",
  },
  loadingText: {
    color: colors.white,
    fontFamily: "PressStart2P-Regular",
    fontSize: 10,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontFamily: "PressStart2P-Regular",
    fontSize: 10,
    marginBottom: 10,
  },
  noImageText: {
    color: colors.white,
    fontSize: 10,
    textAlign: "center",
    marginTop: 40,
  },
  containerResult: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
    width: "95%",
    marginLeft: 8,
  },
  cardContainer: {
    backgroundColor: colors.purple,
    width: 125,
    height: 149,
    marginBottom: 20,
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    alignSelf: "center",
    marginTop: 10,
  },
  name: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 10,
    color: colors.white,
    alignSelf: "center",
    marginTop: 5,
    textAlign: "center",
  },
  photoSearchContainer: {
    backgroundColor: colors.grayDark,
    paddingTop: 10,
    width: "50%",
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 30,
  },
  purple: {
    width: 100,
    height: 100,
    backgroundColor: colors.purple,
    alignItems: 'center'
  },
  button: {},
});
