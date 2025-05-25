import SplashScreen from "@/app/SplashScreen";
import { useGame } from "@/contexts/GameContext";
import { useGemini } from "@/contexts/GeminiContext";
import { LobbyContext } from "@/contexts/LobbyContext";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../../../constants/Colors";

interface Pregunta {
  pregunta: string;
  respuestas: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  respuesta_correcta: "A" | "B" | "C" | "D";
}

export default function GameScreen() {
  const lobbyContext = useContext(LobbyContext);
  const { getResponse } = useGemini();

  
  
  const [respuesta, setRespuesta] = useState("");
  const [timer, setTimer] = useState(30);
  const [answerColors, setAnswerColors] = useState<{ [key: string]: string }>(
    {}
  );
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [preguntaActualIndex, setPreguntaActualIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [finished, setFinished] = useState(false);
  const [points, setPoints] = useState(0);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [lobbyId, setLobbyId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

    if (!lobbyContext) {
    return <Text>Error: LobbyContext no disponible.</Text>;
  }

    const { uid, userName } = lobbyContext;

  const { id } = useLocalSearchParams();

  const { juegosEnTexto, obtenerJuegosAleatorios, fetchLobbyData, lobbyData } =
    useGame();

  useEffect(() => {
    obtenerJuegosAleatorios(); // esto se ejecuta primero
  }, []);

  useEffect(() => {
    if (juegosEnTexto && juegosEnTexto.length > 0) {
      handleFetch();
    }
  }, [juegosEnTexto]);

  useEffect(() => {
    const getLobby = async () => {
      if (typeof id === "string") {
        const lobby = await fetchLobbyData(id);
        setP1(lobby.player1);
        setP2(lobby.player2);
        setLobbyId(lobby.lobbyId);
      } else {
        setP1(userName ?? "")
      }
    };

    getLobby();
  }, [id]);

  const handleFetch = async () => {
    const result = await getResponse(
      "segun estos juegos:" +
        juegosEnTexto +
        " dame 5 preguntas dificiles con 4 respuesta(diferenciadas A, B, C , D) y la unica respuesta corecta. devuelveme solo un json con clave pregunta y respuestas "
    );
    console.log("Respuesta de getResponse:", result);
    const cleanResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed: Pregunta[] = JSON.parse(cleanResult);
      setPreguntas(parsed);
      setPreguntaActualIndex(0); // Reinicia la pregunta actual al cargar nuevas
      setAnswerColors({});
      setTimer(30);
    } catch (e) {
      console.error("Error al parsear JSON:", e);
    } finally{
      setIsLoading(false); // Finaliza la carga
    }
  };



  useEffect(() => {
    if (
      preguntas.length === 0 ||
      Object.values(answerColors).includes("green") ||
      Object.values(answerColors).includes("red")
    ) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [preguntas, answerColors, preguntaActualIndex]);

  // Handle timer reaching 0
  useEffect(() => {
    if (
      timer === 0 &&
      !Object.values(answerColors).includes("green") &&
      !Object.values(answerColors).includes("red") &&
      preguntas[preguntaActualIndex]
    ) {
      const preguntaActual = preguntas[preguntaActualIndex];
      const correcta = preguntaActual.respuesta_correcta;
      setAnswerColors({
        A: colors.grayDark,
        B: colors.grayDark,
        C: colors.grayDark,
        D: colors.grayDark,
        [correcta]: "green",
      });
    }
  }, [timer, preguntas, preguntaActualIndex]);

  // Handle transition to next question after 2-second delay
  useEffect(() => {
    if (
      (Object.values(answerColors).includes("green") ||
        Object.values(answerColors).includes("red")) &&
      preguntas[preguntaActualIndex]
    ) {
      const timeout = setTimeout(() => {
        if (preguntaActualIndex < preguntas.length - 1) {
          setPreguntaActualIndex(preguntaActualIndex + 1);
          setAnswerColors({});
          setTimer(30);
        } else {
          // Handle end of game (e.g., navigate to results screen or show message)
          console.log("Fin del juego");
        }
      }, 2000); // Wait 2 seconds before moving to the next question

      return () => clearTimeout(timeout);
    }
  }, [answerColors, preguntas, preguntaActualIndex]);

  const cambiarColorDeRespuesta = (key: "A" | "B" | "C" | "D") => {
    const preguntaActual = preguntas[preguntaActualIndex];
    if (!preguntaActual) return; // no hacer nada si no hay pregunta

    const correcta = preguntaActual.respuesta_correcta;

    const nuevosColores = {
      A: colors.grayDark,
      B: colors.grayDark,
      C: colors.grayDark,
      D: colors.grayDark,
      [key]: key === correcta ? "green" : "red",
      [correcta]: "green",
    };

    setAnswerColors(nuevosColores);

    if (key === correcta) {
      setCorrectAnswer((prev) => prev + 1);
      setPoints((prev) => {
        return prev + 100 + 10 * timer;
      });
    }
  };

     if (isLoading) return <SplashScreen />;

     
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <View style={styles.name}>
          <Text style={styles.text}>{p1}</Text>
        </View>

        {p2 && (
          <View style={styles.name}>
            <Text style={styles.text}>{p2}</Text>
          </View>
        )}
      </View>
      <View style={styles.utilContainer}>
        <Text style={styles.text}> Pregunta {preguntaActualIndex + 1}/5 </Text>
        <Image
          source={require("../../../assets/images/Timer.png")}
          style={{
            width: 30,
            height: 30,
            marginBottom: 20,
            marginLeft: 35,
            tintColor: colors.white,
          }}
        />

        <Text style={styles.timerText}> {timer} </Text>
      </View>

      {preguntas.length > 0 && preguntas[preguntaActualIndex] && (
        <>
          <View style={styles.questionContainer}>
            <Text style={styles.Question}>
              {preguntas[preguntaActualIndex].pregunta}
            </Text>
          </View>

          {(["A", "B", "C", "D"] as ("A" | "B" | "C" | "D")[]).map((key) => (
            <Pressable
              key={key}
              onPress={() => cambiarColorDeRespuesta(key)}
              disabled={
                !!Object.values(answerColors).find(
                  (color) => color === "green" || color === "red"
                )
              }
            >
              <View
                style={[
                  styles.answerContainer,
                  { backgroundColor: answerColors[key] || colors.grayDark },
                ]}
              >
                <Text style={styles.text}>
                  {preguntas[preguntaActualIndex].respuestas[key]}
                </Text>
              </View>
            </Pressable>
          ))}
        </>
      )}
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
    marginBottom: 0,
    marginTop: 25,
    marginRight: 15,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // 🟢 separa los dos elementos a los extremos
    width: "100%", // 🟢 ocupa todo el ancho
    paddingHorizontal: 20, // 🟢 agrega un margen interno a los lados
    marginTop: "5%",
  },
  text: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 16,
    color: colors.white,
    marginLeft: 5,
  },
  name: {
    width: 140,
    height: 45,
    backgroundColor: colors.grayDark,
    alignItems: "center",
    justifyContent: "center", // 🟢 bordes redondeados (opcional)
  },
  timerText: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 16,
    color: colors.white,
    marginRight: 5,
  },
  utilContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center", // 🟢 separa los dos elementos a los extremos
    width: "100%",
    height: "8%", // 🟢 agrega un margen interno a los lados
    marginTop: "5%",
    marginRight: 20,
  },
  Question: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 15,
    color: colors.white,
    lineHeight: 26,
  },
  questionContainer: {
    height: 200,
    width: 300,
    backgroundColor: colors.grayDark,
    alignItems: "center", // ✅ centra horizontalmente
    justifyContent: "center", // (opcional) para bordes redondeados
    marginBottom: "10%",
  },
  answerContainer: {
    width: 300,
    height: 50,
    backgroundColor: colors.grayDark,
    marginTop: "5%",
    alignItems: "center", // ✅ centra horizontalmente
    justifyContent: "center", // (opcional) para bordes redondeados
  },
});
