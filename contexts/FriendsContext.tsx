import { getAuth } from "firebase/auth";
import { collection, deleteField, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where, } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { db } from "../utils/FirebaseConfig";
import { useAuth } from "./AuthContext";

interface Friend {
  id: string;
  name: string;
  score: number;
}

interface FriendsContextType {
  friends: Friend[];
  friendRequests: Friend[];
  sendFriendRequest: (targetUserId: string, name: string) => Promise<void>;
  acceptFriendRequest: (requestUserId: string, name: string) => Promise<void>;
  removeFriend: (friendUserId: string) => Promise<void>;
  searchUser: (name: string) => Promise<Friend | null>;
  handleRequest: (id: string, action: "accept" | "reject") => Promise<void>;
  rejectFriendRequest: (requestUserId: string) => Promise<void>;
}

export const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      const friendsMap = data.friends || {};
      const requestsMap = data.friendRequests || {};

      const parseFriendList = async (map: any): Promise<Friend[]> => {
        const parsed: Friend[] = [];

        for (const id of Object.keys(map)) {
          const friendDoc = await getDoc(doc(db, "users", id));
          if (!friendDoc.exists()) continue;

          const friendData = friendDoc.data();
          const score = Array.isArray(friendData.stats) ? friendData.stats[0] || 0 : 0;

          parsed.push({
            id,
            name: friendData.name || "SinNombre",
            score,
          });
        }

        return parsed;
      };

      (async () => {
        const [fList, rList] = await Promise.all([
          parseFriendList(friendsMap),
          parseFriendList(requestsMap),
        ]);
        setFriends(fList);
        setFriendRequests(rList);
      })();
    });

    return () => unsubscribe();
  }, [user]);

  const sendFriendRequest = async (receiverId: string, senderName: string) => {
    const auth = getAuth();
    const senderId = auth.currentUser?.uid;
    if (!senderId || !receiverId) return;

    const receiverRef = doc(db, "users", receiverId);
    const receiverSnap = await getDoc(receiverRef);
    if (!receiverSnap.exists()) return;

    const receiverData = receiverSnap.data();
    const currentRequests = receiverData.friendRequests || {};

    if (!currentRequests[senderId]) {
      await updateDoc(receiverRef, {
        [`friendRequests.${senderId}`]: {
          name: senderName,
          score: 0,
        },
      });
    }
  };

  const acceptFriendRequest = async (requestUserId: string, name: string) => {
    if (!user?.uid || !user.displayName) return;

    const requestUserDoc = await getDoc(doc(db, "users", requestUserId));
    const requestStats = requestUserDoc.exists() && Array.isArray(requestUserDoc.data().stats)
      ? requestUserDoc.data().stats[0] || 0
      : 0;

    const myDoc = await getDoc(doc(db, "users", user.uid));
    const myStats = myDoc.exists() && Array.isArray(myDoc.data().stats)
      ? myDoc.data().stats[0] || 0
      : 0;

    await updateDoc(doc(db, "users", user.uid), {
      [`friends.${requestUserId}`]: {
        name,
        score: requestStats,
      },
      [`friendRequests.${requestUserId}`]: deleteField(),
    });

    await updateDoc(doc(db, "users", requestUserId), {
      [`friends.${user.uid}`]: {
        name: user.displayName,
        score: myStats,
      },
    });
  };

  const removeFriend = async (friendUserId: string) => {
    if (!user?.uid) return;

    const userRef = doc(db, "users", user.uid);
    const friendRef = doc(db, "users", friendUserId);

    await updateDoc(userRef, {
      [`friends.${friendUserId}`]: deleteField(),
    });

    await updateDoc(friendRef, {
      [`friends.${user.uid}`]: deleteField(),
    });
  };

  const searchUser = async (name: string): Promise<Friend | null> => {
    try {
      if (!name.trim()) {
        Alert.alert("Error", "El nombre no puede estar vacío");
        return null;
      }

      const q = query(collection(db, "users"), where("name", "==", name));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("No encontrado", `No se encontró ningún usuario con el nombre "${name}"`);
        return null;
      }

      const foundDoc = querySnapshot.docs[0];
      const foundUser = { id: foundDoc.id, ...foundDoc.data() } as Friend;

      if (foundUser.id === user?.uid) {
        Alert.alert("Ups...", "¡Ese eres tú!");
        return null;
      }

      if (friends.some(f => f.id === foundUser.id)) {
        Alert.alert("Ya es tu amigo", `${foundUser.name} ya está en tu lista de amigos`);
        return null;
      }

      if (friendRequests.some(req => req.id === foundUser.id)) {
        Alert.alert("Ya hay una solicitud", `Ya tienes una solicitud con ${foundUser.name}`);
        return null;
      }

      Alert.alert("Usuario encontrado", `${foundUser.name} está disponible para enviar solicitud`);
      return foundUser;
    } catch (error) {
      console.error("Error buscando usuario:", error);
      Alert.alert("Error", "Hubo un problema al buscar el usuario");
      return null;
    }
  };

  const rejectFriendRequest = async (requestUserId: string) => {
    if (!user?.uid) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        [`friendRequests.${requestUserId}`]: deleteField(),
      });
      Alert.alert("Solicitud rechazada", "El usuario fue eliminado de las solicitudes");
    } catch (error) {
      console.error("Error rechazando solicitud:", error);
      Alert.alert("Error", "No se pudo rechazar la solicitud");
    }
  };

  const handleRequest = async (friendId: string, action: "accept" | "reject") => {
    if (action === "accept") {
      const friendDoc = await getDoc(doc(db, "users", friendId));
      const friendName = friendDoc.exists() ? friendDoc.data().name : "Amigo";
      await acceptFriendRequest(friendId, friendName);
    } else {
      await rejectFriendRequest(friendId);
    }
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        friendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        removeFriend,
        searchUser,
        handleRequest,
        rejectFriendRequest,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) throw new Error("useFriends debe usarse dentro de FriendsProvider");
  return context;
};
