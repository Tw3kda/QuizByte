import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WhiteButton from "../../../components/whiteButton";
import colors from "../../../constants/Colors";

export default function LobbyGuest() {
  const [userName, setUserName] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [lobby, setLobby] = useState<Record<string, any> | null>(null);

  const [fontsLoaded] = useFonts({
    "PressStart2P-Regular": require("../../../assets/fonts/PressStart2P-Regular.ttf"),
  });

  const { id } = useLocalSearchParams();
 

  /////////////////////////////////////////
 useEffect(() => {
  const fetchLobby = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("Usuario no autenticado");
      return;
    }

    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let name = "Invitado";
    if (userSnap.exists()) {
      const userData = userSnap.data();
      name = userData.name || "Invitado";
      setUserName(name);
    }

    if (!id || typeof id !== "string") {
      console.log("ID de lobby inválido");
      return;
    }

    const lobbyRef = doc(db, "lobbies", id);

    try {
      // Actualizar nombre de player2 en Firebase
      await updateDoc(lobbyRef, {

          "players.IDplayer2": name, // name viene del user.name o "Invitado"
      });
      console.log("IDplayer2 actualizado a:", name);

      // Obtener datos del lobby
      const lobbySnap = await getDoc(lobbyRef);
      if (lobbySnap.exists()) {
        setLobby(lobbySnap.data());
        setLobbyId(id);
        console.log("en guest" + id)
        console.log("en guest" + lobby?.players.IDplayer1)
      } else {
        console.log("Lobby no encontrado");
      }
    } catch (error) {
      console.error("Error en fetchLobby:", error);
    }
  };

  fetchLobby();
}, [id]);

  ///////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////

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
           title={lobby?.players?.IDplayer1 ?? "Cargando..."}
          onPress={() => {}}
          color={colors.purple}
          textColor={colors.white}
        />

        <WhiteButton
          title={String(userName)?? "Cargando..."}
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
