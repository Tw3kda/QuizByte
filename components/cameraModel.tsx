import { useGemini } from "@/contexts/GeminiContext";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import colors from "../constants/Colors";

export default function CameraScreen({ navigation }: any) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null); // Store base64 for both camera and gallery images
  const cameraRef = useRef<CameraView>(null);
  const { setImagenUri, enviarImagenAGemini } = useGemini();
  const router = useRouter();
  const { from } = useLocalSearchParams();

  useEffect(() => {
    (async () => {
      await requestPermission();
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Media library permission not granted");
        Alert.alert(
          "Permiso requerido",
          "Se necesita acceso a la galería para seleccionar imágenes."
        );
      }
    })();
  }, []);

  const getBase64FromUri = async (uri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        console.error("File does not exist at URI:", uri);
        return null;
      }
      return await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      console.error("Error reading file:", error);
      return null;
    }
  };

  const take = async () => {
    const result = await cameraRef.current?.takePictureAsync({
      quality: 1,
      base64: true,
    });

    if (result?.uri) {
      setCapturedImage(result.uri);
      setImageBase64(result.base64 || null); // Store base64 locally
      setImagenUri(result.uri); // Pass only the URI to context
    }
  };

  const open = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setCapturedImage(uri);
      // Generate base64 immediately to avoid file access issues later
      const base64 = await getBase64FromUri(uri);
      if (base64) {
        setImageBase64(base64);
      } else {
        Alert.alert(
          "Error",
          "No se pudo cargar la imagen. Por favor, intenta de nuevo."
        );
        setCapturedImage(null); // Reset to allow retry
        return;
      }
      setImagenUri(uri); // Pass only the URI to context
    }
  };

  const handleButtonPress = async () => {
  if (!capturedImage || !imageBase64) {
    Alert.alert(
      "Error",
      "No hay imagen capturada o no se pudo cargar. Por favor, intenta de nuevo."
    );
    return;
  }

  const prompt = "QUE VIDEOJUEGO ES LA IMAGEN, DEVUELVEME SOLO EL NOMBRE";

  if (from === "search") {
    const games = await enviarImagenAGemini(prompt, imageBase64);
    console.log("Juegos encontrados:", games);

    if (!games || games.length === 0) {
      Alert.alert(
        "Error",
        "No se pudo identificar el videojuego. Intenta con otra imagen."
      );
      return;
    }

    const game = games[0];

    console.log(game)

    router.push({
      pathname: "/confirm",
      params: {
        url: game.imageUrl ?? "",
        titulo: game.name,
        
      },
    });
  }
};
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.noImageText}>
          Permiso para usar la cámara no concedido.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              setCapturedImage(null);
              setImageBase64(null);
            }}
          >
            <Text style={styles.searchButtonText}>Tomar otra</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleButtonPress}
          >
            <Text style={styles.searchButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
          <TouchableOpacity style={styles.searchButton} onPress={open}>
            <Text style={styles.searchButtonText}>
              Buscar en el dispositivo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.purple} onPress={take}>
            <Image
              source={require("../assets/images/TakePhoto.png")}
              style={{ width: 80, height: 80, marginTop: 10 }}
            />
          </TouchableOpacity>
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
    paddingTop: 40,
  },
  title: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    fontSize: 16,
    marginTop: 15,
    marginBottom: 20,
  },
  previewImage: {
    width: 300,
    height: 363,
    resizeMode: "cover",
    marginVertical: 20,
    borderWidth: 5,
    borderColor: colors.purple,
  },
  camera: {
    width: 300,
    height: 363,
    borderWidth: 3,
    borderColor: colors.purple,
    resizeMode: "cover",
    marginBottom: 20,
  },
  searchButton: {
    width: 300,
    height: 55,
    backgroundColor: colors.purple,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    fontFamily: "PressStart2P-Regular",
    fontSize: 14,
    color: colors.white,
    textAlign: "center",
  },
  noImageText: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    fontSize: 14,
    textAlign: "center",
    marginTop: 50,
  },
  purple: {
    width: 100,
    height: 100,
    backgroundColor: colors.purple,
    alignItems: "center",
  },
});
