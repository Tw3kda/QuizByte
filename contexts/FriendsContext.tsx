// 📦 Imports
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { FriendData, UserData } from '../interfaces/common';
import { db } from '../utils/FirebaseConfig';

// 🧠 Context Interface
interface FriendContextProps {
  currentUser: UserData | null;
  friends: FriendData[];
  friendRequests: FriendData[];
  searchResults: FriendData[];
  loading: boolean;
  error: unknown;
  searchUser: (name: string) => Promise<void>;
  sendFriendRequest: (targetUserName: string) => Promise<void>; // Cambiado a userName
  handleRequest: (solicitanteId: string, action: 'accept' | 'reject') => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>; // Nueva función para eliminar amigos
}

// 🌍 Context Initialization
export const FriendContext = createContext<FriendContextProps | undefined>(undefined);

export const useFriendContext = () => {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error('useFriendContext debe usarse dentro de un FriendProvider');
  }
  return context;
};

// 🔄 Provider
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

  // Función para cargar amigos y solicitudes
  const fetchFriendsAndRequests = async (currentUserId: string) => {
    try {
      console.log('Iniciando fetchFriendsAndRequests para userId:', currentUserId);
      setLoading(true);
      const userRef = doc(db, 'users', currentUserId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.warn('Usuario no encontrado en Firestore:', currentUserId);
        setCurrentUser(null);
        setFriends([]);
        setFriendRequests([]);
        return;
      }

      const userData = userSnap.data() as UserData;
      setCurrentUser({ ...userData, id: currentUserId });
      console.log('Current user data fetched:', userData);

      // --- Cargar Amigos ---
      const friendsCollectionRef = collection(userRef, 'friends');
      const friendsSnap = await getDocs(friendsCollectionRef);
      const friendsList = friendsSnap.docs.map((doc) => {
        const data = doc.data();
        console.log(`Amigo encontrado (doc.id: ${doc.id}):`, data);
        return {
          id: doc.id,
          name: data.name || 'Sin nombre',
          score: data.score || 0,
        };
      });
      setFriends(friendsList);
      console.log('Amigos cargados:', friendsList);

      // --- Cargar Solicitudes ---
      const requestsCollectionRef = collection(userRef, 'friendRequests');
      const requestsSnap = await getDocs(requestsCollectionRef);
      const requestsList = requestsSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<FriendData, 'id'>),
      }));
      setFriendRequests(requestsList);
      console.log('Solicitudes de amistad cargadas:', requestsList);

    } catch (err) {
      console.error('Error al cargar datos en fetchFriendsAndRequests:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };


  // 🔍 Cargar datos del usuario, amigos y solicitudes al inicio
  useEffect(() => {
    if (userId) {
      fetchFriendsAndRequests(userId);
    } else {
      setLoading(false);
    }
  }, [userId]); // Dependencia del userId

  // 🔍 Buscar usuarios (modificado para buscar por nombre)
  const searchUser = async (name: string) => {
    try {
      setLoading(true);
      console.log('Buscando usuario con nombre:', name);
      const usersCollectionRef = collection(db, 'users');
      const snapshot = await getDocs(usersCollectionRef);
      const results: FriendData[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Asegúrate de que el campo 'name' exista y sea una cadena para evitar errores
        if (data && typeof data.name === 'string' && docSnap.id !== userId && data.name.toLowerCase().includes(name.toLowerCase())) {
          results.push({ id: docSnap.id, name: data.name });
        }
      });

      setSearchResults(results);
      console.log('Resultados de búsqueda:', results);
    } catch (err) {
      console.error('Error al buscar usuario:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ✉️ Enviar solicitud (modificado para aceptar nombre de usuario)
  const sendFriendRequest = async (targetUserName: string) => {
    try {
      if (!currentUser) {
        console.error('No hay usuario actual para enviar solicitud.');
        return;
      }
      console.log(`Intentando enviar solicitud a: ${targetUserName}`);

      // Primero, busca el ID del usuario por su nombre
      const usersCollectionRef = collection(db, 'users');
      const snapshot = await getDocs(usersCollectionRef);
      let targetUserId: string | null = null;
      let targetUserData: UserData | null = null;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.name.toLowerCase() === targetUserName.toLowerCase()) {
          targetUserId = docSnap.id;
          targetUserData = { ...data as UserData, id: docSnap.id };
        }
      });

      if (!targetUserId) {
        console.warn(`No se encontró usuario con el nombre: ${targetUserName}`);
        alert(`No se encontró un usuario con el nombre: ${targetUserName}`);
        return;
      }

      // Evitar enviarse solicitud a sí mismo
      if (targetUserId === userId) {
        alert('No puedes enviarte una solicitud de amistad a ti mismo.');
        return;
      }

      // Verificar si ya son amigos
      const friendsSnap = await getDoc(doc(collection(doc(db, 'users', userId), 'friends'), targetUserId));
      if (friendsSnap.exists()) {
        alert(`${targetUserName} ya es tu amigo.`);
        return;
      }

      // Verificar si ya hay una solicitud pendiente (de ti a él)
      const requestSentSnap = await getDoc(doc(collection(doc(db, 'users', targetUserId), 'friendRequests'), userId));
      if (requestSentSnap.exists()) {
        alert(`Ya enviaste una solicitud a ${targetUserName}.`);
        return;
      }

      // Verificar si él ya te envió una solicitud a ti
      const requestReceivedSnap = await getDoc(doc(collection(doc(db, 'users', userId), 'friendRequests'), targetUserId));
      if (requestReceivedSnap.exists()) {
        alert(`${targetUserName} ya te envió una solicitud. ¡Acéptala!`);
        return;
      }


      const targetUserRef = doc(db, 'users', targetUserId);
      await setDoc(doc(collection(targetUserRef, 'friendRequests'), userId), {
        name: currentUser.name || '',
      });
      console.log(`Solicitud enviada de ${currentUser.name} a ${targetUserName} (ID: ${targetUserId})`);
      alert(`Solicitud enviada a ${targetUserName}.`);

    } catch (err) {
      console.error('Error al enviar solicitud:', err);
      setError(err);
      alert('Error al enviar la solicitud. Inténtalo de nuevo.');
    }
  };

  // ✅❌ Manejar solicitud
  const handleRequest = async (solicitanteId: string, action: 'accept' | 'reject') => {
    try {
      console.log(`Manejando solicitud de ${solicitanteId}, acción: ${action}`);
      const userRef = doc(db, 'users', userId);
      const solicitanteRef = doc(db, 'users', solicitanteId);

      // Eliminar la solicitud de friendRequests del usuario actual
      await deleteDoc(doc(collection(userRef, 'friendRequests'), solicitanteId));
      setFriendRequests((prev) => prev.filter((req) => req.id !== solicitanteId));
      console.log(`Solicitud de ${solicitanteId} eliminada de friendRequests del usuario actual.`);


      if (action === 'accept') {
        const solicitanteSnap = await getDoc(solicitanteRef);
        if (!solicitanteSnap.exists()) {
          console.error('El solicitante no existe en Firestore:', solicitanteId);
          alert('Error: El solicitante no existe.');
          return;
        }
        const solicitanteData = solicitanteSnap.data() as UserData;

        // Agregar al solicitante como amigo del usuario actual
        await setDoc(doc(collection(userRef, 'friends'), solicitanteId), {
          id: solicitanteId, // Agrega el ID explícitamente para consistencia
          name: solicitanteData.name,
          score: solicitanteData.stats?.[0] || 0,
        });
        console.log(`Agregado ${solicitanteData.name} como amigo del usuario actual.`);

        // Agregar al usuario actual como amigo del solicitante
        await setDoc(doc(collection(solicitanteRef, 'friends'), userId), {
          id: userId, // Agrega el ID explícitamente para consistencia
          name: currentUser?.name || '',
          score: currentUser?.stats?.[0] || 0,
        });
        console.log(`Agregado ${currentUser?.name} como amigo de ${solicitanteData.name}.`);

        // Refrescar la lista de amigos del usuario actual
        await fetchFriendsAndRequests(userId); // Vuelve a cargar amigos y solicitudes
        alert(`Has aceptado la solicitud de ${solicitanteData.name}.`);
      } else { // reject
        alert(`Has rechazado la solicitud.`);
      }

    } catch (err) {
      console.error('Error al manejar solicitud:', err);
      setError(err);
      alert('Error al manejar la solicitud. Inténtalo de nuevo.');
    }
  };

  // 🗑️ Eliminar amigo
  const removeFriend = async (friendId: string) => {
    try {
      console.log(`Intentando eliminar amigo: ${friendId} para usuario: ${userId}`);
      // Eliminar de la subcolección 'friends' del usuario actual
      await deleteDoc(doc(collection(doc(db, 'users', userId), 'friends'), friendId));
      console.log(`Eliminado ${friendId} de los amigos de ${userId}`);

      // Eliminar al usuario actual de la subcolección 'friends' del amigo
      await deleteDoc(doc(collection(doc(db, 'users', friendId), 'friends'), userId));
      console.log(`Eliminado ${userId} de los amigos de ${friendId}`);

      // Actualizar el estado local
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
      alert('Amigo eliminado exitosamente.');
    } catch (err) {
      console.error('Error al eliminar amigo:', err);
      setError(err);
      alert('Error al eliminar al amigo. Inténtalo de nuevo.');
    }
  };


  // 🌐 Context Provider
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
        removeFriend, // Incluye la nueva función
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};