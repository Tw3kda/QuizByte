import SplashScreen from "@/app/SplashScreen";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import BlackButton from "../../../components/blackButton";
import colors from "../../../constants/Colors";
import { LobbyContext } from "../../../contexts/LobbyContext";
import { db } from "../../../utils/FirebaseConfig";

// Función para actualizar las estadísticas del usuario logueado
const updateUserStats = async (puntaje: number) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;

    if (!uid) {
      console.warn("No hay usuario autenticado.");
      return;
    }

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("El usuario no existe en Firestore");
      return;
    }

    const userData = userSnap.data();
    const currentStats = userData.stats || [0, 0, 0];

    const updatedStats = [
      (currentStats[0] || 0) + puntaje, // Acumulado de puntos
      (currentStats[1] || 0) + 1, // Partidas jugadas
      currentStats[2] || 0, // Ranking (sin cambios)
    ];

    await updateDoc(userRef, {
      stats: updatedStats,
    });

    console.log("Estadísticas actualizadas correctamente");
  } catch (error) {
    console.error("Error al actualizar las estadísticas:", error);
  }
};

export default function Results() {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user?.uid;

  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const playerMode = params.p as string;

  const victoryMessage = "¡Felicitaciones";
  const lossMessage = "Mejor suerte para la próxima.";
  const victoryIcon = require("../../../assets/images/Trophie.png");
  const lossIcon = require("../../../assets/images/Heartbroken.png");

  const [misAciertos, setMisAciertos] = useState(0);
  const [aciertosOtro, setAciertosOtro] = useState(0);
  const [miPuntaje, setMiPuntaje] = useState(0);
  const [otroPuntaje, setOtroPuntaje] = useState(0);
  const [otroPlayer, setOtroPlayer] = useState("El oponente");
  const [isWin, setIsWin] = useState(false);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<any>(null);
  const [bothPlayersFinished, setBothPlayersFinished] = useState(false);
  const [yo, setYo] = useState("");

  // Estado para evitar múltiples actualizaciones de stats
  const [statsActualizadas, setStatsActualizadas] = useState(false);

  // Access the LobbyContext
  const context = useContext(LobbyContext);

  if (!context) {
    return <Text>Error: contexto no disponible</Text>;
  }

  const { getLobbyStats } = context;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const fetchStats = async () => {
      if (!id) {
        console.warn("No lobby ID provided");
        return;
      }

      const stats = await getLobbyStats(id);
      if (!stats) {
        console.warn("Failed to fetch lobby stats");
        return;
      }

      const {
        PreguntasCorrectasP1,
        PreguntasCorrectasP2,
        PuntosP1,
        PuntosP2,
        IDplayer1,
        IDplayer2,
        p1Finished,
        p2Finished,
      } = stats;

      // Si ambos jugadores terminaron
      if (p1Finished && p2Finished) {
        setBothPlayersFinished(true);

        if (playerMode === "1") {
          setMisAciertos(PreguntasCorrectasP1);
          setAciertosOtro(PreguntasCorrectasP2);
          setMiPuntaje(PuntosP1);
          setOtroPuntaje(PuntosP2);
          setOtroPlayer(IDplayer2 || "Jugador 2");
          setIsWin(PuntosP1 >= PuntosP2);
          setTitle(PuntosP1 >= PuntosP2 ? victoryMessage : lossMessage);
          setIcon(PuntosP1 >= PuntosP2 ? victoryIcon : lossIcon);
          setYo(IDplayer1);
        } else if (playerMode === "2") {
          setMisAciertos(PreguntasCorrectasP2);
          setAciertosOtro(PreguntasCorrectasP1);
          setMiPuntaje(PuntosP2);
          setOtroPuntaje(PuntosP1);
          setOtroPlayer(IDplayer1 || "Jugador 1");
          setIsWin(PuntosP2 >= PuntosP1);
          setTitle(PuntosP2 >= PuntosP1 ? victoryMessage : lossMessage);
          setIcon(PuntosP2 >= PuntosP1 ? victoryIcon : lossIcon);
          setYo(IDplayer2);
        }

        // Actualizar solo una vez las stats del usuario logueado
        if (!statsActualizadas) {
          const miPuntajeFinal = playerMode === "1" ? PuntosP1 : PuntosP2;
          await updateUserStats(miPuntajeFinal);
          setStatsActualizadas(true);
        }
      } else {
        // Si no han terminado ambos, intentar de nuevo en 2s
        timeoutId = setTimeout(fetchStats, 2000);
      }
    };

    fetchStats();

    // Cleanup para limpiar timeout si cambia id o se desmonta
    return () => clearTimeout(timeoutId);
  }, [id, playerMode, getLobbyStats, statsActualizadas]);

  if (!bothPlayersFinished) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text numberOfLines={4} style={styles.title}>
          {title} {yo + "!"}
        </Text>
        <Image
          source={icon}
          style={{ width: 35, height: 35, marginTop: -35 }}
        />
      </View>

      <Text numberOfLines={2} style={styles.stats}>
        <Text style={styles.whiteText}>Tus aciertos </Text>
        <Text style={styles.blueText}>{misAciertos}</Text>
        <Text style={styles.whiteText}>/5</Text>
      </Text>

      <Text numberOfLines={2} style={styles.stats}>
        <Text style={styles.whiteText}>Aciertos de {otroPlayer}: </Text>
        <Text style={styles.blueText}>{aciertosOtro}</Text>
        <Text style={styles.whiteText}>/5</Text>
      </Text>

      <Text style={styles.orangeText}>Tu puntaje</Text>
      <Text style={styles.points}>{miPuntaje}</Text>

      <Text style={styles.purpleText}>
        Puntaje de {otroPlayer} : {otroPuntaje}
      </Text>

      <View style={styles.buttonContainer}>
        <BlackButton
          title="Jugar otra vez"
          color={colors.orange}
          onPress={() => {
            Alert.alert("Aviso", "Todavía no está implementado esta función");
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
  splashContainer: {
    flex: 1,
    backgroundColor: colors.blueDark,
    justifyContent: "center",
    alignItems: "center",
  },
  splashText: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  title: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    fontSize: 20,
    marginBottom: 45,
    marginTop: 20,
    marginRight: 0,
    width: "80%",
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
  titleName: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    fontSize: 20,
    marginBottom: 0,
    marginTop: 0,
    marginRight: 0,
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
    marginTop: 0,
    marginRight: 0,
    width: "80%",
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
    marginBottom: 0,
  },
  purpleText: {
    fontFamily: "PressStart2P-Regular",
    color: colors.pink,
    fontSize: 12,
    marginTop: 5,
    marginBottom: "25%",
  },
});
