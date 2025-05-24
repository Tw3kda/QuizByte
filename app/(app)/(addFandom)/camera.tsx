import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CameraModal from "../../../components/cameraModel";
import colors from "../../../constants/Colors";

export default function CameraScreen({ navigation }: any) {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={()=>router.back()}>
          <Image
            source={require("../../../assets/images/Back.png")}
            style={{ width: 40, height: 40, marginTop: 10, }}
          />
        </TouchableOpacity>

        <Text style={styles.title}> Tomar foto</Text>
      </View>

      <CameraModal
        isVisible={cameraVisible}
        onClose={() => setCameraVisible(false)}
        onCapture={(uri: React.SetStateAction<string | null>) => {
          setImageUri(uri);
          setCameraVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blueDark,
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    fontSize: 24,
    marginBottom: 0,
    marginTop: 25,
    marginRight: 30,
  },
  titleContainer: {
    flexDirection: "row", // 🔹 ordena hijos horizontalmente
    justifyContent: "flex-start", // opcional: distribuye el espacio
    alignItems: "center", // opcional: alinea verticalmente
    marginVertical: 20,
  },
  previewImage: {
    width: 300,
    height: 363,
    resizeMode: "cover",
    marginVertical: 20,
    borderWidth: 5,
    borderColor: colors.purple,
  },
  camera: {
    width: 300,
    height: 363,
    borderWidth: 3,
    borderColor: colors.purple,
    resizeMode: "cover",
    marginBottom: 20,
  },
  searchButton: {
    width: 300,
    height: 55,
    backgroundColor: colors.purple,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 14,
    color: colors.white,
    textAlign: "center",
  },
  noImageText: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    fontSize: 14,
    textAlign: "center",
    marginTop: 50,
  },
  purple: {
    width: 100,
    height: 100,
    backgroundColor: colors.purple,
    alignItems: "center",
  },
});
