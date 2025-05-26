import SplashScreen from "@/app/SplashScreen";
import { db } from "@/utils/FirebaseConfig";
import { useFonts } from "expo-font";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../../../constants/Colors";

export default function SearchScreen() {
  const router = useRouter();
  const { titulo, url } = useLocalSearchParams();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [cleanUrl, setCleanUrl] = useState("");

  async function addFandomToUser(userId: string, name: any, url: any) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", userId);

    const fandomKey = `fandoms.${name}`;

    await updateDoc(userRef, {
      [fandomKey]: { name, url },
    });

    console.log(`Fandom ${name} agregado al usuario ${userId}`);
  }

  const handleConfirm = async () => {
    setIsLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No hay usuario autenticado");
      return;
    }

    if (titulo && url) {
      await addFandomToUser(user.uid, titulo, url);
      setIsLoading(false); // Finaliza la carga
      router.replace({ pathname: "/Search", params: { reset: "1" } });
    }
  };

  const [fontsLoaded] = useFonts({
    "PressStart2P-Regular": require("../../../assets/fonts/PressStart2P-Regular.ttf"),
  });

  useEffect(() => {
  if (url) {
    const cleanUrl = String(url).trim();
    setCleanUrl(cleanUrl);
    console.log("Attempting to load image:", cleanUrl);
    Image.getSize(
      cleanUrl,
      (width, height) => {
        const maxSize = 250;
        const scale = Math.min(maxSize / width, maxSize / height, 1);
        setImageSize({
          width: width * scale,
          height: height * scale,
        });
        console.log("Image size:", { width, height, scaledWidth: width * scale, scaledHeight: height * scale });
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching image size:", error);
        setImageSize({ width: 250, height: 250 });
        setIsLoading(false);
      }
    );
  }
}, [url]);

  if (!fontsLoaded) return null;

  const handleBack = () => {
    router.back();
  };

  if (isLoading) return <SplashScreen />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Seleccion</Text>

      {url ? (
        <View
          style={[
            styles.imageWrapper,
            {
              width: imageSize.width || 250,
              height: imageSize.height || 250,
            },
          ]}
        >
<Image
  key={cleanUrl}
  source={{ uri: cleanUrl }}
  style={{ width: imageSize.width || 250, height: imageSize.height || 250 }}
  resizeMode="contain"
  onError={(error) => console.error("Image load error:", error.nativeEvent.error)}
/>
        </View>
      ) : (
        <Text style={styles.noImageText}>Sin imagen</Text>
      )}

      <View style={styles.confirmContainer}>
        <Text style={styles.secondTitle}>{titulo}</Text>

        <Pressable onPress={handleConfirm} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Confirmar</Text>
        </Pressable>

        <Pressable onPress={handleBack} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Regresar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blueDark,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    textAlign: "center",
    fontSize: 24,
    marginBottom: 30,
    marginTop: 20,
  },
  secondTitle: {
    fontFamily: "PressStart2P-Regular",
    color: colors.orange,
    fontSize: 25,
    textAlign: "center",
    marginBottom: 35,
  },
  confirmContainer: {
    backgroundColor: colors.grayDark,
    paddingTop: 20,
    width: "95%",
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 30,
  },
  imageWrapper: {
    borderColor: colors.purple,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noImageText: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    fontSize: 14,
    textAlign: "center",
    marginVertical: 20,
  },
  searchButton: {
    width: 240,
    height: 62,
    backgroundColor: colors.purple,
    borderColor: colors.white,
    borderWidth: 5,
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 20,
    color: colors.white,
    textAlign: "center",
  },
});
