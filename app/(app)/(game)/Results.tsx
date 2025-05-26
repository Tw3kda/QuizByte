import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../../constants/Colors"; // Asegúrate de que esta ruta sea correcta

export default function Results() {
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const pointSended = params.pointSended as string | undefined;
  const preSended = params.preSended as string | undefined;
  const playerMode = params.p as string;

  // Log para depuración
  useEffect(() => {
    console.log("Parámetros recibidos en Results:", {
      id,
      pointSended,
      preSended,
      p: playerMode,
    });
  }, [id, pointSended, preSended, playerMode]);

  // Validar y convertir parámetros
  const points = pointSended ? parseInt(pointSended, 10) : 0;
  const correctAnswers = preSended ? parseInt(preSended, 10) : 0;

  // Validación adicional
  const isGuestMode = playerMode === "3";
  const isValidData = !isNaN(points) && !isNaN(correctAnswers);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados</Text>
      {isGuestMode ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.subtitle}>Modo Invitado (p = 3)</Text>
          {isValidData ? (
            <>
              {id && (
                <Text style={styles.text}>ID de usuario: {id}</Text>
              )}
              <Text style={styles.text}>Puntos: {points}</Text>
              <Text style={styles.text}>Respuestas Correctas: {correctAnswers}</Text>
              <Text style={styles.text}>Modo de Jugador: {playerMode}</Text>
            </>
          ) : (
            <Text style={styles.errorText}>
              Error: Datos inválidos recibidos
            </Text>
          )}
        </View>
      ) : (
        <Text style={styles.errorText}>
          Esta pantalla está diseñada para modo invitado (p = 3). Modo actual: {playerMode}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blueDark,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 24,
    color: colors.white,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 18,
    color: colors.white,
    marginBottom: 15,
  },
  resultsContainer: {
    backgroundColor: colors.grayDark,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  text: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 16,
    color: colors.white,
    marginVertical: 10,
  },
  errorText: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 16,
    color: colors.red,
    textAlign: "center",
  },
});
