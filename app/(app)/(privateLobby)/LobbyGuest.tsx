import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WhiteButton from "../../../components/whiteButton";
import colors from "../../../constants/Colors";

export default function LobbyGuest() {
  const [userName, setUserName] = useState<string | null>(null);
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [lobby, setLobby] = useState<Record<string, any> | null>(null);

  const [fontsLoaded] = useFonts({
    "PressStart2P-Regular": require("../../../assets/fonts/PressStart2P-Regular.ttf"),
  });

  const { id } = useLocalSearchParams();

useEffect(() => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !id || typeof id !== "string") {
    console.log("Usuario no autenticado o ID inválido");
    return;
  }

  const db = getFirestore();
  const lobbyRef = doc(db, "lobbies", id);
  const userRef = doc(db, "users", user.uid);

  const fetchLobby = async () => {
    try {
      const userSnap = await getDoc(userRef);

      let name = "Invitado";
      if (userSnap.exists()) {
        const userData = userSnap.data();
        name = userData.name || "Invitado";
        setUserName(name);
      }

      await updateDoc(lobbyRef, {
        "players.IDplayer2": name,
        lastUpdated: serverTimestamp(),
      });

      const lobbySnap = await getDoc(lobbyRef);
      if (lobbySnap.exists()) {
        setLobby(lobbySnap.data());
        setLobbyId(id);
        console.log(id)
      } else {
        console.log("Lobby no encontrado");
      }
    } catch (error) {
      console.error("Error en fetchLobby:", error);
    }
  };

  fetchLobby();

  const unsubscribe = onSnapshot(lobbyRef, (lobbySnap) => {
    if (lobbySnap.exists()) {
      const data = lobbySnap.data();
      setLobby(data);

      if (data.start === true) {
        
        router.replace({
          pathname: `/(app)/(game)/GameScreen`,
          params: { id: id , p: "2"}, 
        });
        console.log("Iniciando partida en ID" +id );
      }
    }
  });

  return () => {
    unsubscribe();
    updateDoc(lobbyRef, {
      "players.IDplayer2": "",
      lastUpdated: serverTimestamp(),
    })
      .then(() => console.log("IDplayer2 limpiado al salir"))
      .catch((err) => console.error("Error al limpiar IDplayer2:", err));
  };
}, [id]);

  // Función que limpia IDplayer2 y hace router.back()
  const handleBack = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !id || typeof id !== "string") {
      router.back(); // si algo falla, simplemente regresa
      return;
    }

    const db = getFirestore();
    const lobbyRef = doc(db, "lobbies", id);

    try {
      await updateDoc(lobbyRef, {
        "players.IDplayer2": "",
        lastUpdated: serverTimestamp(),
      });
      console.log("IDplayer2 limpiado antes de hacer router.back()");
    } catch (error) {
      console.error("Error limpiando IDplayer2 antes de router.back():", error);
    } finally {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Image
            source={require("../../../assets/images/Back.png")}
            style={{ width: 40, height: 40, marginTop: 25 }}
          />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.title}> Lobby Privado </Text>
      </View>

      <Image
        source={require("../../../assets/images/Crown.png")}
        style={{ width: 25, height: 25, marginTop: "35%", marginBottom: 10 }}
      />

      <View style={styles.buttonContainer}>
        <WhiteButton
          title={lobby?.players?.IDplayer1 ?? "Cargando..."}
          onPress={() => {}}
          color={colors.purple}
          textColor={colors.white}
        />
        <WhiteButton
          title={userName ?? "Cargando..."}
          onPress={() => {}}
          color={colors.pink}
          textColor={colors.white}
        />
      </View>

      <View style={styles.startContainer}>
        <WhiteButton
          title="Espera al host"
          onPress={() => {}}
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
});
