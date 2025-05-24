import { useIsFocused } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import colors from "../../../constants/Colors";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const router = useRouter();
  const isFocused = useIsFocused();
  const [inputCode, setInputCode] = useState("");

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setScanned(false); // cuando regresas a esta pantalla
    }
  }, [isFocused]);

  const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

  // Función para validar y navegar al LobbyGuest
  const handleSubmitCode = () => {
    if (regex.test(inputCode)) {
      router.push(`/LobbyGuest?id=${encodeURIComponent(inputCode)}`);
    } else {
      Alert.alert("Código no válido", "Por favor ingresa un código válido.");
    }
  };

  // Manejo de código escaneado (QR)
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);

      if (regex.test(data)) {
        router.push(`/LobbyGuest?id=${encodeURIComponent(data)}`);
      } else {
        Alert.alert("Código no válido", "El código QR escaneado no es válido.");
      }
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.noImageText}>Permiso no concedido.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.blueDark }}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.blueDark }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{ flex: 1, backgroundColor: colors.blueDark }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={() => router.push("/(app)/(drawer)/Index")}>
              <Image
                source={require("../../../assets/images/Back.png")}
                style={{ width: 40, height: 40, marginTop: 25 }}
              />
            </TouchableOpacity>

            <Text numberOfLines={1} style={styles.title}>
              Lobby Privado
            </Text>
          </View>

          <CameraView
            style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />

          <View style={[styles.iconButton, styles.marginButton]}>
            <TextInput
              placeholder="Escribe aquí..."
              placeholderTextColor="#ccc"
              style={styles.textInput}
              value={inputCode}
              onChangeText={setInputCode}
              autoCapitalize="characters"
              onSubmitEditing={handleSubmitCode}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={handleSubmitCode}>
              <Image
                source={require("../../../assets/images/enter.png")}
                style={{ width: 25, height: 25, marginRight: 10, tintColor:colors.white }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blueDark,
    alignItems: "center",
  },
  camera: {
    width: 300,
    height: 300,
    borderWidth: 3,
    borderColor: colors.purple,
    marginBottom: 0,
  },
  noImageText: {
    color: colors.white,
    fontSize: 14,
    textAlign: "center",
    marginTop: 50,
  },

  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontFamily: "PressStart2P-Regular",
    color: colors.white,
    fontSize: 20,
    marginBottom: 0,
    marginTop: 25,
    marginRight: 15,
  },
  iconButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,

    width: 280,
    height: 60,
    borderColor: colors.white,
    borderWidth: 5,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: colors.purple,
  },

  marginButton: {
    marginTop: "5%",
    marginBottom: "10%",
  },
  textInput: {
    flex: 1,
    fontFamily: "PressStart2P-Regular",
    fontSize: 14,
    color: colors.white,
    paddingHorizontal: 10,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.blueDark,
  },
});
