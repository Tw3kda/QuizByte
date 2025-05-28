import WhiteButton from "@/components/whiteButton";
import colors from "@/constants/Colors";
import { router } from "expo-router";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LobbyContext } from "../../../contexts/LobbyContext"; // ajusta la ruta si es necesario

export default function Lobby() {
  const lobby = useContext(LobbyContext);

  if (!lobby) {
    return <Text>Cargando contexto...</Text>;
  }

  const {
    uid,
    userName,
    guestName,
    lobbyId,
    createLobby,
    setGuestName,
    startLobby,
  } = lobby;

  useEffect(() => {
    const create = async () => {
      if (lobby?.lobbyId === null) {
        await lobby?.createLobby();
      }
    };
    create();
  }, []);

  useEffect(() => {
    if (!lobbyId) {
      console.log("No lobbyId, skipping listener setup");
      return;
    }

    console.log("Setting up onSnapshot for lobbyId:", lobbyId);
    const db = getFirestore();
    const lobbyRef = doc(db, "lobbies", lobbyId);

    const unsubscribe = onSnapshot(
      lobbyRef,
      (docSnap) => {
        console.log("onSnapshot triggered for lobbyId:", lobbyId);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Firestore data:", data);
          const player2 = data.players?.IDplayer2;
          console.log("Player2 value:", player2);
          setGuestName(player2 && player2.trim() !== "" ? player2 : "+");
        } else {
          console.log("Lobby document does not exist");
          setGuestName("+");
        }
      },
      (error) => {
        console.error("Firestore listener error:", error);
      }
    );

    return () => {
      console.log("Cleaning up onSnapshot for lobbyId:", lobbyId);
      unsubscribe();
    };
  }, [lobbyId, setGuestName]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => router.push("/(app)/(drawer)/Index")}>
          <Image
            source={require("../../../assets/images/Back.png")}
            style={{ width: 40, height: 40, marginTop: 25 }}
          />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.title}>
          {" "}
          Lobby Privado
        </Text>
      </View>

      <Image
        source={require("../../../assets/images/Crown.png")}
        style={{ width: 25, height: 25, marginTop: "35%", marginBottom: 10 }}
      />

      <View style={styles.buttonContainer}>
        <WhiteButton
          title={String(userName)}
          onPress={() => {}}
          color={colors.purple}
          textColor={colors.white}
        />

        <WhiteButton
          title={String(guestName)}
          onPress={() => {
            if (lobbyId) {
              router.push({
                pathname: "/(app)/(privateLobby)/Qr",
                params: { id: lobbyId },
              });
            }
          }}
          color={colors.pink}
          textColor={colors.white}
        />
      </View>
      <View style={styles.startContainer}>
        <WhiteButton
          title="Iniciar partida"
          onPress={() => {
            if (guestName !== "+" && guestName.trim() !== "") {
              startLobby(); // <-- llama al método aquí
              router.replace({
                pathname: `/(app)/(game)/GameScreen`,
                params: { id: lobbyId , p: "1"},
              });
              console.log("Iniciando partida en ID" +lobbyId );
            }
          }}
          color={colors.red}
          textColor={colors.white}
        />
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
    fontSize: 20,
    marginBottom: 0,
    marginTop: 25,
    marginRight: 15,
  },
  titleContainer: {
    flexDirection: "row", // 🔹 ordena hijos horizontalmente
    justifyContent: "flex-start", // opcional: distribuye el espacio
    alignItems: "center", // opcional: alinea verticalmente
    marginVertical: 20,
  },
  buttonContainer: {
    gap: 25,
  },
  startContainer: {
    marginTop: "70%",
  },
});
