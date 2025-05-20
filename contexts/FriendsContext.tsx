import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { FriendData, UserData } from '../interfaces/common';
import { db } from '../utils/FirebaseConfig';

interface FriendContextProps {
  currentUser: UserData | null;
  friends: FriendData[];
  friendRequests: FriendData[];
  searchResults: FriendData[];
  loading: boolean;
  error: unknown;
  searchUser: (name: string) => Promise<void>;
  sendFriendRequest: (targetUserId: string) => Promise<void>;
  handleRequest: (solicitanteId: string, action: 'accept' | 'reject') => Promise<void>;
}

export const FriendContext = createContext<FriendContextProps | undefined>(undefined);

export const useFriendContext = () => {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error('useFriendContext debe usarse dentro de un FriendProvider');
  }
  return context;
};

interface FriendProviderProps {
  children: React.ReactNode;
  userId: string;
}

export const FriendProvider = ({ children, userId }: FriendProviderProps) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendData[]>([]);
  const [searchResults, setSearchResults] = useState<FriendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.data() as UserData;

        setCurrentUser({ ...userData, id: userId });

        const friendsArray: FriendData[] = Object.entries(userData.friends || {}).map(([id, data]) => ({
          id,
          name: data.name,
        }));

        const requestList: FriendData[] = userData.friendRequests || [];

        setFriends(friendsArray);
        setFriendRequests(requestList);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  const searchUser = async (name: string) => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const results: FriendData[] = [];

      usersSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.name.toLowerCase().includes(name.toLowerCase()) && docSnap.id !== userId) {
          results.push({ id: docSnap.id, name: data.name });
        }
      });

      setSearchResults(results);
    } catch (err) {
      console.error('Error al buscar usuario:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (targetUserId: string) => {
    try {
      const targetRef = doc(db, 'users', targetUserId);
      const targetSnap = await getDoc(targetRef);

      if (targetSnap.exists()) {
        const targetData = targetSnap.data() as UserData;

        const updatedRequests: FriendData[] = [
          ...(targetData.friendRequests || []),
          { id: userId, name: currentUser?.name || '' },
        ];

        await updateDoc(targetRef, { friendRequests: updatedRequests });
      }
    } catch (err) {
      console.error('Error al enviar solicitud:', err);
      setError(err);
    }
  };

  const handleRequest = async (solicitanteId: string, action: 'accept' | 'reject') => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as UserData;

      const updatedRequests = (userData.friendRequests || []).filter((req) => req.id !== solicitanteId);

      if (action === 'accept') {
        const solicitanteRef = doc(db, 'users', solicitanteId);
        const solicitanteSnap = await getDoc(solicitanteRef);
        const solicitanteData = solicitanteSnap.data() as UserData;

        // Agregar cada uno al listado de amigos del otro
        await updateDoc(userRef, {
          friendRequests: updatedRequests,
          [`friends.${solicitanteId}`]: { name: solicitanteData.name },
        });

        await updateDoc(solicitanteRef, {
          [`friends.${userId}`]: { name: userData.name },
        });

        // Actualizar estado local
        setFriends((prev) => [...prev, { id: solicitanteId, name: solicitanteData.name }]);
      } else {
        await updateDoc(userRef, { friendRequests: updatedRequests });
      }

      setFriendRequests(updatedRequests);
    } catch (err) {
      console.error('Error al manejar solicitud:', err);
      setError(err);
    }
  };

  return (
    <FriendContext.Provider
      value={{
        currentUser,
        friends,
        friendRequests,
        searchResults,
        loading,
        error,
        searchUser,
        sendFriendRequest,
        handleRequest,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};
