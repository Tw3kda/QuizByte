import { db } from '@/utils/FirebaseConfig'; // Ajusta la ruta según tu proyecto
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface GameContextType {
  juegosEnTexto: string;
  obtenerJuegosAleatorios: () => Promise<void>;
  lobbyData: any;
  fetchLobbyData: (lobbyId: string) => Promise<any>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [juegosEnTexto, setJuegosEnTexto] = useState<string>("");
  const [lobbyData, setLobbyData] = useState<any>(null);

  const obtenerJuegosAleatorios = async () => {
    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;

      if (!uid) {
        console.warn("Usuario no autenticado");
        return;
      }

      const db = getFirestore();
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const fandomsMap = data.fandoms;

        if (fandomsMap && typeof fandomsMap === "object") {
          const nombres = Object.values(fandomsMap)
            .map((f: any) => f.name)
            .filter(Boolean);

          const seleccionados = nombres
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

          const texto = seleccionados.map((j) => `"${j}"`).join(", ");
          setJuegosEnTexto(texto);
        } else {
          console.warn("No se encontró el campo 'fandoms' o está mal formado");
        }
      } else {
        console.warn("No se encontró el usuario en Firestore");
      }
    } catch (error) {
      console.error("Error al obtener juegos aleatorios:", error);
    }
  };

  const fetchLobbyData = async (lobbyId: string) => {
    try {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      const lobbySnap = await getDoc(lobbyRef);

      if (lobbySnap.exists()) {
        const data = lobbySnap.data();
        setLobbyData(data);
        return data;
      } else {
        console.warn("El lobby no existe.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener datos del lobby:", error);
      return null;
    }
  };

  return (
    <GameContext.Provider
      value={{ juegosEnTexto, obtenerJuegosAleatorios, lobbyData, fetchLobbyData }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame debe usarse dentro de GameProvider");
  }
  return context;
};
