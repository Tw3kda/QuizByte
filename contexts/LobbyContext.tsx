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
import React, {
    createContext,
    ReactNode,
    useEffect,
    useState,
} from "react";

type LobbyContextType = {
  uid: string | null;
  userName: string | null;
  guestName: string;
  lobbyId: string | null;
  createLobby: () => Promise<string | undefined>;
  setGuestName: React.Dispatch<React.SetStateAction<string>>;
};

type LobbyProviderProps = {
  children: ReactNode;
};

export const LobbyContext = createContext<LobbyContextType | undefined>(
  undefined
);

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
  }, [userName]); // Se vuelve a ejecutar si cambia el nombre de usuario

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
      return docSnap.exists()
        ? await generateUniqueLobbyId()
        : newId;
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
        },
        host: uid,
        players: {
          IDplayer1: userName,
          IDplayer2: "",
        },
        lastUpdated: serverTimestamp(),
        start: false
      };

      await setDoc(doc(db, "lobbies", newLobbyId), lobbyData);
      setLobbyId(newLobbyId);
      return newLobbyId;
    } catch (error) {
      console.error("Error creando el lobby:", error);
    }
  };

  return (
    <LobbyContext.Provider
      value={{
        userName,
        uid,
        guestName,
        lobbyId,
        createLobby,
        setGuestName,
      }}
    >
      {children}
    </LobbyContext.Provider>
  );
};
