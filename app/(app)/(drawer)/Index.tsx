import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import WhiteButton from "../../../components/whiteButton";
import colors from "../../../constants/Colors";
import fonts from "../../../constants/fonts";

export default function Index() {
  const [userName, setUserName] = useState("Cargando...");
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<{}>>();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const firestore = getFirestore();
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.name || "Jugador");
        } else {
          setUserName("Jugador");
        }
      } catch (error) {
        console.error("Error obteniendo el nombre:", error);
        setUserName("Jugador");
      }
    };

    fetchUserName();
  }, []);

  return (

<ImageBackground
  source={require("../../../assets/images/BackgroundLobby.png")}
  style={styles.container} // Usa el estilo principal aquí
  resizeMode="cover"
>
   
      {/* Header separado del scroll */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bienvenido {userName}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <WhiteButton
          title="¡Jugar Trivia!"
          color={colors.green}
          onPress={() =>
            router.replace({
              pathname: `/(app)/(game)/GameScreen`,
              params: { p: "3" },
            })
          }
        />

        <WhiteButton
          title="Lobby Privado"
          color={colors.purple}
          onPress={() => router.push("/(app)/(privateLobby)/Lobby")}
        />

        <WhiteButton
          title="Unirse a Lobby"
          color={colors.orange}
          onPress={() => router.push("/(app)/(privateLobby)/JoinedLobby")}
        />

        <WhiteButton
          title="Agregar Fandoms"
          color={colors.pink}
          onPress={() => router.push("/(app)/(addFandom)/Search")}
        />
      </ScrollView>


    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111721", 
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  imageStyle: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center", // Centrado vertical
    alignItems: "center", // Centrado horizontal
    paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 20,
    width: "100%",
  },
  menuButton: {
    padding: 10, // Añadimos un poco de padding al botón del menú para que sea más fácil de tocar
  },
  menuIcon: {
    fontSize: 20, // Hacemos el icono un poco más grande
    color: "#fff",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center", // Centramos el título dentro de su contenedor
  },
  title: {
    fontFamily: fonts.pressStart2P,
    fontSize: 17, // Un poco más grande para que destaque
    color: "#fff",
    textAlign: "center",
  },
});
