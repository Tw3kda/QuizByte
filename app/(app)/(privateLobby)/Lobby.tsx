import { useFonts } from "expo-font";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WhiteButton from "../../../components/whiteButton";
import colors from "../../../constants/Colors";

export default function lobby() {
  const [userName, setUserName] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("+");
  const [lobbyCreated, setLobbyCreated] = useState(false);
  const [lobbyId, setLobbyId] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    "PressStart2P-Regular": require("../../../assets/fonts/PressStart2P-Regular.ttf"),
  });

  /////////////////////////////////////////
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          setUid(user.uid); // set UID
          const db = getFirestore();
          const userRef = doc(db, "users", user.uid); // or "profiles", depending on your structure
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data.name); // or whatever field your user document has
          } else {
            console.log("No user document found");
          }
        } else {
          console.log("No user is logged in");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  ///////////////////////////////////////////////////////////////////////////

useEffect(() => {
    if (!lobbyId) return;

    const db = getFirestore();
    const lobbyRef = doc(db, "lobbies", lobbyId);

    // Listener en tiempo real:
    const unsubscribe = onSnapshot(lobbyRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGuestName(data.players?.IDplayer2 || "+");
        console.log(data.players?.IDplayer2)
      } else {
        console.log("Lobby no existe");
        setGuestName("+");
      }
    }, (error) => {
      console.error("Error escuchando lobby:", error);
    });

    // Cleanup al desmontar
    return () => unsubscribe();
  }, [lobbyId]);


useEffect(() => {
  console.log("guest actualizado a:", guestName);
}, [guestName]);

  //////////////////////////////////////////////////////////////////////

useEffect(() => {
  if (uid && userName && !lobbyCreated) {
    createLobby(uid).then((id) => {
      if (id) {
        setLobbyId(id);
        setLobbyCreated(true);
      }
    });
  }
}, [uid, userName, lobbyCreated]);

  ///////////////////////////////////////
  async function createLobby(uid: string) {
    const db = getFirestore();

    async function generateUniqueLobbyId(): Promise<string> {
      const newId = generateCode();
      const docRef = doc(db, "lobbies", newId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // ID already used, try again
        return await generateUniqueLobbyId();
      } else {
        // ID is unique
        return newId;
      }
    }

    try {
      const lobbyId = await generateUniqueLobbyId();

      const lobbyData = {
        Stats: {
          PreguntasCorrectasP1: 0,
          PreguntasCorrectasP2: 0,
          PuntosP1: 0,
          PuntosP2: 0,
          p1Finished: false,
          p2Finished: false,
        },
        host: uid,
        players: {
          IDplayer1: String(userName),
          IDplayer2: "",
        },
      };

      console.log(userName)

      await setDoc(doc(db, "lobbies", lobbyId), lobbyData);
      console.log(" Lobby creado con ID:", lobbyId);
      return lobbyId; // You can return this if you want to show/share it
    } catch (error) {
      console.error(" Error al crear el lobby:", error);
    }
  }
  //////////////////////////////////////////////////////////////////////////

  function generateCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];

      // Add hyphens after every 4 characters (except the last one)
      if ((i + 1) % 4 === 0 && i < 11) {
        code += "-";
      }
    }

    return code;
  }
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

        <Text numberOfLines={1} style={styles.title}> Lobby Privado</Text>
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
                pathname: "/(app)/(privateLobby)/QR",
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
