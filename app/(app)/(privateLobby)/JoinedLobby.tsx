import { useIsFocused } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
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

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
  if (isFocused) {
    setScanned(false); // ✅ solo cuando regresas a esta pantalla
  }
}, [isFocused]);

  

const handleBarcodeScanned = ({ data }: { data: string }) => {
  if (!scanned) {
    setScanned(true);

    const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

    if (regex.test(data)) {
      // ✅ Formato correcto, redirigir
      
      router.push(`/LobbyGuest?id=${encodeURIComponent(data)}`);
      
    } else {
      
      Alert.alert("QR no válido", "Escanee una innvitacion valida.");
      router.push(`/Index`);
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
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
    </View>
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
    height: 400,
    borderWidth: 3,
    borderColor: colors.purple,
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
    fontSize: 14,
    color: colors.white,
    textAlign: "center",
  },
  noImageText: {
    color: colors.white,
    fontSize: 14,
    textAlign: "center",
    marginTop: 50,
  },

  titleContainer: {
    flexDirection: "row", // 🔹 ordena hijos horizontalmente
    justifyContent: "flex-start", // opcional: distribuye el espacio
    alignItems: "center", // opcional: alinea verticalmente
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
});
