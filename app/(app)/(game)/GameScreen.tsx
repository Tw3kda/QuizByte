import SplashScreen from "@/app/SplashScreen";
import { useGame } from "@/contexts/GameContext";
import { useGemini } from "@/contexts/GeminiContext";
import { LobbyContext } from "@/contexts/LobbyContext";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

  if (!lobbyContext) {
    return <Text>Error: LobbyContext no disponible.</Text>;
  }

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
  const { updateLobbyStats } = useContext(LobbyContext)!;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp(); // Esto envía la app al segundo plano en Android
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove(); // 👈 método correcto
    }, [])
  );

  const { userName, getPlayersFromLobby } = lobbyContext;

  const { id, p } = useLocalSearchParams();

  useEffect(() => {
    const getLobby = async () => {
      if (!lobbyContext) return;
      if (typeof id === "string") {
        const lobby = await getPlayersFromLobby(id);
        if (lobby) {
          setP1(lobby.IDplayer1 ?? "");
          setP2(lobby.IDplayer2 ?? "");
        }
      } else {
        setP1(userName ?? "");
      }
    };
    getLobby();
  }, [id, lobbyContext]);

  const { juegosEnTexto, obtenerJuegosAleatorios } = useGame();

  useEffect(() => {
    const cargarPreguntas = async () => {
      resetEstado();
      await obtenerJuegosAleatorios();
    };
    cargarPreguntas();
  }, [finished]);

  useEffect(() => {
    if (juegosEnTexto !== "") {
      handleFetch();
    }
  }, [juegosEnTexto]);

  const handleFetch = async () => {
    const result = await getResponse(
      "segun estos juegos:" +
        juegosEnTexto +
        " dame 5 preguntas dificiles con 4 respuesta(diferenciadas A, B, C , D) y la unica respuesta corecta, como respuesta correcta dame la letra. devuelveme solo un json con el siguiente formato " +
        '[{\
        "pregunta": "...",\
        "respuestas": {\
          "A": "...",\
          "B": "...",\
          "C": "...",\
          "D": "..."\
        },\
        "respuesta_correcta": "A"\
      }]'
    );
    console.log("Respuesta de getResponse:", result);
    const cleanResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleanResult);
      setPreguntas(parsed);
      setPreguntaActualIndex(0); // Reinicia la pregunta actual al cargar nuevas
      setAnswerColors({});
      setTimer(30);
      setIsLoading(false);
    } catch (e) {
      console.error("Error al parsear JSON:", e);
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

  useEffect(() => {
    if (
      (Object.values(answerColors).includes("green") ||
        Object.values(answerColors).includes("red")) &&
      preguntas[preguntaActualIndex]
    ) {
      const timeout = setTimeout(async () => {
        if (preguntaActualIndex < preguntas.length - 1) {
          setPreguntaActualIndex(preguntaActualIndex + 1);
          setAnswerColors({});
          setTimer(30);
        } else {
          console.log("Finished all questions");
          try {
            if (p === "3") {
              console.log(
                "Guest mode (p=3), points:",
                points,
                "correctAnswer:",
                correctAnswer
              );
              router.replace({
                pathname: "/Results3",
                params: {
                  pointSended: points,
                  preSended: correctAnswer,
                  p: "3",
                  userName, // Keep p=3 for consistency
                },
              });
            } else if (p === "1") {
              await updateDoc();
            } else if (p === "2") {
              await updateDoc();
            }
          } catch (error) {
            console.error("Error al actualizar o redirigir:", error);
            // Fallback navigation
          }
        }
      }, 2000); // 2-second delay before moving on
      return () => clearTimeout(timeout);
    }
  }, [
    answerColors,
    preguntas,
    preguntaActualIndex,
    id,
    p,
    points,
    correctAnswer,
  ]);

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
      setPoints((prev) => {
        return prev + 100 + 10 * timer;
      });
      setCorrectAnswer((prev) => prev + 1);
    }
  };

  const updateDoc = async () => {
    setIsLoading(true);

    console.log("updateDoc called with:", {
      p,
      points,
      correctAnswer,
      lobbyId,
      id,
    });
    const effectiveLobbyId = lobbyId || (typeof id === "string" ? id : "");
    if (!effectiveLobbyId) {
      console.error("No effective lobbyId provided");
      return;
    }
    try {
      if (p === "1") {
        console.log("hola p1");
        console.log(p);
        const updates = {
          PuntosP1: points,
          p1Finished: true,
          PreguntasCorrectasP1: correctAnswer,
          finished: true,
          start: false,
        };
        console.log(
          "Sending updates for player 1:",
          updates,
          "to lobbyId:",
          effectiveLobbyId
        );
        await updateLobbyStats(effectiveLobbyId, updates);
      } else if (p === "2") {
        console.log("hola p2");
        console.log(p);
        const updates = {
          PuntosP2: points,
          p2Finished: true,
          PreguntasCorrectasP2: correctAnswer,
          finished: true,
          start: false,
        };
        console.log(
          "Sending updates for player 2:",
          updates,
          "to lobbyId:",
          effectiveLobbyId
        );
        await updateLobbyStats(effectiveLobbyId, updates);
      } else {
        console.warn("Invalid player number:", p);
      }
      console.log("updateDoc completed successfully");
      const idSended = typeof id === "string" ? id : "";
      console.log("Navigating with idSended:", idSended);
      if (!idSended) {
        console.error("No valid lobbyId for navigation");
        return;
      }

      router.replace({
        pathname: "/Results2",
        params: { id: typeof id === "string" ? id : "", p },
      });
    } catch (error) {
      console.error("Error in updateDoc:", error);
      throw error;
    }
    setIsLoading(false);
  };

  const resetEstado = () => {
    setRespuesta("");
    setTimer(30);
    setAnswerColors({});
    setPreguntaActualIndex(0);
    setCorrectAnswer(0);
    setFinished(false);
    setPoints(0);
    setP2("");
    setLobbyId("");
    setIsLoading(true);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

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
      {/* Determina el tamaño de fuente para la pregunta */}
      {(() => {
        const textoPregunta = preguntas[preguntaActualIndex].pregunta;
        const fontSizePregunta =
          textoPregunta.length > 120
            ? 10
            : textoPregunta.length > 80
            ? 12
            : 15;

        return (
          <View style={styles.questionContainer}>
            <Text style={[styles.Question, { fontSize: fontSizePregunta }]}>
              {textoPregunta}
            </Text>
          </View>
        );
      })()}

      {/* Renderiza las respuestas con fuente adaptativa */}
      {(["A", "B", "C", "D"] as ("A" | "B" | "C" | "D")[]).map((key) => {
        const textoRespuesta = preguntas[preguntaActualIndex].respuestas[key];
        const fontSizeRespuesta =
          textoRespuesta.length > 60
            ? 10
            : textoRespuesta.length > 40
            ? 12
            : 16;

        return (
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
              <Text style={[styles.text, { fontSize: fontSizeRespuesta }]}>
                {textoRespuesta}
              </Text>
            </View>
          </Pressable>
        );
      })}
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
