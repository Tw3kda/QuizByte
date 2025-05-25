import * as Clipboard from "expo-clipboard";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import colors from "../../../constants/Colors";

export default function lobby() {
  const { id } = useLocalSearchParams();
  console.log(id);

  const [fontsLoaded] = useFonts({
    "PressStart2P-Regular": require("../../../assets/fonts/PressStart2P-Regular.ttf"),
  });

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(String(id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Lobby Privado</Text>

      <View style={styles.purpleContainer}>
        <QRCode value={String(id)} size={240} quietZone={5} />
        <Text style={styles.codeText}> {id}</Text>
        <Pressable onPress={copyToClipboard}>
          <View style={styles.iconButton}>
            <Text numberOfLines={1} style={styles.text}>
              Copiar Codigo
            </Text>
            <Image
              source={require("../../../assets/images/BlockPaper.png")}
              style={{ width: 25, height: 25, marginRight: 10 }}
            />
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <View style={[styles.iconButton, styles.marginButton]}>
            <Text numberOfLines={1} style={styles.text}>
              Regresar
            </Text>
            <Image
              source={require("../../../assets/images/backButton.png")}
              style={{ width: 25, height: 25, marginRight: 10 }}
            />
          </View>
        </Pressable>
      </View>
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
    marginRight: 15,
  },
  purpleContainer: {
    alignItems: "center",
    width: "85%",
    marginTop: "10%",
    paddingTop: 80,

    backgroundColor: colors.purple,
  },
  codeText: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 16,
    color: colors.white,
    marginTop: "20%",
  },
  iconButton: {
    flexDirection: "row", // 🔹 ordena hijos horizontalmente
    justifyContent: "space-between", // opcional: distribuye el espacio
    alignItems: "center", // opcional: alinea verticalmente
    marginVertical: 20,

    width: 280,
    height: 60,
    borderColor: colors.white,
    borderWidth: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  text: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 16,
    color: colors.white,
    marginLeft: 5,
  },
  marginButton: {
    marginTop: "25%",
    marginBottom: "10%",
  },
});
