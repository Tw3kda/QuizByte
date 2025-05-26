import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, { createContext, ReactNode, useEffect, useState } from "react";

type LobbyContextType = {
  uid: string | null;
  userName: string | null;
  guestName: string;
  lobbyId: string | null;
  lobbyId0: string | null;
  setLobbyId: React.Dispatch<React.SetStateAction<string | null>>;
  createLobby: () => Promise<string | undefined>;
  setGuestName: React.Dispatch<React.SetStateAction<string>>;
  startLobby: () => Promise<void>;
  updateLobbyStats: (
    lobbyId0: string,
    updates: {
      p1Finished?: boolean;
      p2Finished?: boolean;
      PuntosP1?: number;
      PuntosP2?: number;
      PreguntasCorrectasP1?: number;
      PreguntasCorrectasP2?: number;
      start?: boolean;
      finished?: boolean;
    }
  ) => Promise<void>;
  getPlayersFromLobby: (id: string) => Promise<{
    finished: boolean;
    IDplayer1: string | null;
    IDplayer2: string | null;
  } | null>;
};

type LobbyProviderProps = {
  children: ReactNode;
};

export const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

export const LobbyProvider: React.FC<LobbyProviderProps> = ({ children }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("+");
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [lobbyCreated, setLobbyCreated] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setUid(user.uid);
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().name);
        }
      }
    };

    const cleanOldLobbies = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.log("Usuario no autenticado");
        return;
      }

      const uid = user.uid;
      const lobbiesRef = collection(db, "lobbies");
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      const q = query(lobbiesRef, where("players.IDplayer2", "==", ""));
      const snapshot = await getDocs(q);

      snapshot.forEach(async (docSnap) => {
        const data = docSnap.data();
        const isHost = data?.players?.IDplayer1 === userName;
        const isOld = data?.lastUpdated?.toDate() < fifteenMinutesAgo;

        if (isHost && isOld) {
          console.log(`Eliminando lobby ${docSnap.id} del host ${uid}`);
          await deleteDoc(doc(db, "lobbies", docSnap.id));
        }
      });
    };

    fetchUserInfo();
    cleanOldLobbies();
  }, [userName]);

  useEffect(() => {
    const tryCreateLobby = async () => {
      if (!lobbyCreated && uid && userName) {
        const newLobbyId = await createLobby();
        if (newLobbyId) {
          setLobbyCreated(true);
        }
      }
    };

    tryCreateLobby();
  }, [uid, userName, lobbyCreated]);

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
      if ((i + 1) % 4 === 0 && i < 11) code += "-";
    }
    return code;
  };

  const createLobby = async () => {
    if (!userName || !uid) {
      console.warn("No se puede crear lobby: userName o uid es null");
      return;
    }

    const db = getFirestore();

    const generateUniqueLobbyId = async (): Promise<string> => {
      const newId = generateCode();
      const docRef = doc(db, "lobbies", newId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? await generateUniqueLobbyId() : newId;
    };

    try {
      const newLobbyId = await generateUniqueLobbyId();
      const lobbyData = {
        Stats: {
          PreguntasCorrectasP1: 0,
          PreguntasCorrectasP2: 0,
          PuntosP1: 0,
          PuntosP2: 0,
          p1Finished: false,
          p2Finished: false,
          finished: false,
        },
        host: uid,
        players: {
          IDplayer1: userName,
          IDplayer2: "",
        },
        lastUpdated: serverTimestamp(),
        start: false,
      };

      await setDoc(doc(db, "lobbies", newLobbyId), lobbyData);
      setLobbyId(newLobbyId);
      return newLobbyId;
    } catch (error) {
      console.error("Error creando el lobby:", error);
    }
  };

  const startLobby = async () => {
    if (!lobbyId) {
      console.warn("No hay lobbyId disponible para iniciar la partida");
      return;
    }

    const db = getFirestore();
    const lobbyRef = doc(db, "lobbies", lobbyId);

    try {
      await setDoc(
        lobbyRef,
        {
          start: true,
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
      console.log("Lobby iniciado correctamente");
    } catch (error) {
      console.error("Error al iniciar el lobby:", error);
    }
  };

  const updateLobbyStats = async (
  lobbyId0: string,
  updates: {
    p1Finished?: boolean;
    p2Finished?: boolean;
    PuntosP1?: number;
    PuntosP2?: number;
    PreguntasCorrectasP1?: number;
    PreguntasCorrectasP2?: number;
    start?: boolean;
    finished?: boolean;
  }
) => {
  if (!lobbyId0) {
    console.warn("No hay lobbyId0 disponible para actualizar estadísticas");
    return;
  }

  const auth = getAuth();
  if (!auth.currentUser) {
    console.error("No user is authenticated");
    return;
  }

  const db = getFirestore();
  const lobbyRef = doc(db, "lobbies", lobbyId0);

  try {
    const lobbySnap = await getDoc(lobbyRef);
    if (!lobbySnap.exists()) {
      console.error("Lobby document does not exist for ID:", lobbyId0);
      return;
    }

    // Separa los campos que deben ir a Stats y los que son del documento raíz
    const statsFields: Record<string, any> = {};
    const rootFields: Record<string, any> = {};

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) continue;
      if (
        key === "PuntosP1" ||
        key === "PuntosP2" ||
        key === "p1Finished" ||
        key === "p2Finished" ||
        key === "PreguntasCorrectasP1" ||
        key === "PreguntasCorrectasP2"
      ) {
        statsFields[key] = value;
      } else {
        rootFields[key] = value;
      }
    }

    const updateData: any = {
      lastUpdated: serverTimestamp(),
    };

    if (Object.keys(statsFields).length > 0) {
      updateData["Stats"] = statsFields;
    }

    Object.assign(updateData, rootFields);

    console.log("Actualizando lobby con:", updateData);

    await setDoc(lobbyRef, updateData, { merge: true });
    console.log("Lobby actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar estadísticas del lobby:", error);
    throw error;
  }
};


  const getPlayersFromLobby = async (id: string): Promise<{
    IDplayer1: string | null;
    IDplayer2: string | null;
    finished: boolean;
  } | null> => {
    if (!id) {
      console.warn("No se proporcionó un ID de lobby");
      return null;
    }

    const db = getFirestore();
    const lobbyRef = doc(db, "lobbies", id);

    try {
      const lobbySnap = await getDoc(lobbyRef);
      if (!lobbySnap.exists()) {
        console.warn("El lobby no existe para el ID:", id);
        return null;
      }

      const lobbyData = lobbySnap.data();
      const players = lobbyData?.players;
      const finished = lobbyData?.Stats?.finished ?? false;

      return {
        IDplayer1: players?.IDplayer1 ?? null,
        IDplayer2: players?.IDplayer2 ?? null,
        finished,
      };
    } catch (error) {
      console.error("Error al obtener los jugadores del lobby:", error);
      return null;
    }
  };

  return (
    <LobbyContext.Provider
      value={{
        userName,
        uid,
        guestName,
        lobbyId,
        lobbyId0: lobbyId,
        setLobbyId,
        createLobby,
        setGuestName,
        startLobby,
        updateLobbyStats,
        getPlayersFromLobby,
      }}
    >
      {children}
    </LobbyContext.Provider>
  );
};
