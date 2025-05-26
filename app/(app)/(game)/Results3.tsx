import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import BlackButton from "../../../components/blackButton";
import colors from "../../../constants/Colors";

export default function Results3() {
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const pointSended = params.pointSended as string | undefined;
  const preSended = params.preSended as string | undefined;
  const playerMode = params.p as string | undefined;
  const user = params.userName as string | undefined;

  // Log para depuración
  useEffect(() => {
    console.log("Parámetros recibidos en Results3:", {
      id,
      pointSended,
      preSended,
      playerMode,
      user,
    });
  }, [id, pointSended, preSended, playerMode, user]);

  // Validar y convertir parámetros a números
  const points = pointSended ? parseInt(pointSended, 10) : 0;
  const correctAnswers = preSended ? parseInt(preSended, 10) : 0;

  // Validación adicional
  const isGuestMode = playerMode === "3";
  const isValidData = !isNaN(points) && !isNaN(correctAnswers);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text numberOfLines={1} style={styles.title}>
          Tu puntaje
        </Text>
        <Image
          source={require("../../../assets/images/Trophie.png")}
          style={{ width: 35, height: 35, marginTop: -35 }}
        />
      </View>

      {isValidData ? (
        <>
          <Text numberOfLines={1} style={styles.stats}>
            <Text style={styles.whiteText}>Tus aciertos </Text>
            <Text style={styles.blueText}>{correctAnswers}</Text>
            <Text style={styles.whiteText}>/5</Text>
          </Text>

          <Text style={styles.orangeText}>Tu puntaje</Text>
          <Text style={styles.points}>{points}</Text>
        </>
      ) : (
        <Text style={styles.whiteText}>Datos no válidos</Text>
      )}

      <View style={styles.buttonContainer}>
        <BlackButton
          title="Jugar otra vez"
          color={colors.orange}
          onPress={() => {
            router.replace({
              pathname: "/GameScreen",
              params: { p: playerMode },
            });
          }}
        />
        <BlackButton
          title="Volver a Lobby"
          color={colors.purple}
          onPress={() => {
            router.replace("../(drawer)/Index");
          }}
        />
      </View>

      <View style={styles.startContainer}></View>
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
    fontSize: 20,
    marginBottom: 45,
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    gap: 25,
  },
  startContainer: {
    marginTop: "70%",
  },
  whiteText: {
    color: colors.white,
  },
  blueText: {
    color: colors.purple,
  },
  stats: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    fontSize: 20,
    marginBottom: 15,
  },
  orangeText: {
    fontFamily: "PressStart2P-Regular",
    color: colors.orange,
    fontSize: 20,
    marginTop: 50,
  },
  points: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    fontSize: 50,
    marginTop: 10,
    marginBottom: "50%",
  },
});
